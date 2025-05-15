import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "~/components/ui/dialog";
import { useApplyCouponMutation, useGetCouponsQuery } from "~/store/apis/couponSlice";
import { toast } from "react-toastify";

const CouponModal = ({ isOpen, onClose, subtotal, cartItems, currentUser, shippingCost, onApplyCoupon }) => {
  const queryParams = {
    page: 1,
    limit: 50,
    sort: "createdAt",
    order: "desc",
    search: ""
  };
  const { data: couponsData, isLoading: isCouponsLoading, error: couponsError } = useGetCouponsQuery(queryParams);
  const [applyCoupon] = useApplyCouponMutation();
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Debug API request và response
  useEffect(() => {
    console.log("CouponModal - Query params for GET /coupon:", queryParams);
    console.log("CouponModal - couponsData:", couponsData);
    console.log("CouponModal - couponsError:", couponsError);
    if (couponsError) {
      console.error("CouponModal - Error fetching coupons:", couponsError?.data?.message || couponsError);
    }
  }, [couponsData, couponsError, currentUser]);

  // Filter valid coupons
  useEffect(() => {
    const checkCoupons = async () => {
      console.log("CouponModal - Starting checkCoupons...");
      console.log("CouponModal - cartItems:", cartItems);
      console.log("CouponModal - subtotal:", subtotal);

      if (!couponsData?.coupons || !currentUser?._id) {
        console.log("CouponModal - No coupons data or userId available. Skipping...");
        setAvailableCoupons([]);
        return;
      }

      console.log("CouponModal - Total coupons to check:", couponsData.coupons.length);
      const validCoupons = [];
      const cartProductIds = cartItems.map(item => item.productId || item.id || item.product?._id || item._id);
      console.log("CouponModal - cartProductIds:", cartProductIds);

      for (const coupon of couponsData.coupons) {
        console.log(`CouponModal - Checking coupon: ${coupon.code}`);

        if (!coupon.is_public || !coupon.is_active) {
          console.log(`CouponModal - Coupon ${coupon.code} skipped: not public or not active`);
          continue;
        }

        const endDate = new Date(coupon.end_day);
        const now = new Date();
        if (endDate < now) {
          console.log(`CouponModal - Coupon ${coupon.code} skipped: expired (end_day: ${endDate}, now: ${now})`);
          continue;
        }

        if (coupon.target_type === "PRODUCT") {
          const hasApplicableProduct = coupon.target_ids?.some(id => cartProductIds.includes(id));
          if (!hasApplicableProduct) {
            console.log(`CouponModal - Coupon ${coupon.code} skipped: no matching products (target_ids: ${coupon.target_ids})`);
            continue;
          }
        }

        if (coupon.target_type === "ORDER" && coupon.min_value && subtotal < coupon.min_value) {
          console.log(`CouponModal - Coupon ${coupon.code} skipped: subtotal (${subtotal}) less than min_value (${coupon.min_value})`);
          continue;
        }

        try {
          const result = await applyCoupon({
            couponCode: coupon.code,
            userId: currentUser._id,
            orderTotal: subtotal,
            shippingCost: shippingCost
          }).unwrap();
          console.log(`CouponModal - Coupon ${coupon.code} apply result:`, result);
          if (result.discount > 0) {
            validCoupons.push({ ...coupon, discount: result.discount });
            console.log(`CouponModal - Coupon ${coupon.code} added to validCoupons`);
          } else {
            console.log(`CouponModal - Coupon ${coupon.code} not valid: discount <= 0, result:`, result);
          }
        } catch (error) {
          console.error(`CouponModal - Coupon ${coupon.code} apply error:`, error?.data?.message || error);
          validCoupons.push({ ...coupon, error: error?.data?.message || "Unknown error" });
        }
      }

      console.log("CouponModal - Valid coupons found:", validCoupons);
      setAvailableCoupons(validCoupons.filter(coupon => coupon.discount > 0)); // Chỉ giữ mã có discount > 0
    };

    checkCoupons();
  }, [couponsData, currentUser, subtotal, shippingCost, cartItems, applyCoupon]);

  const handleSelectCoupon = async (code) => {
    try {
      const result = await applyCoupon({
        couponCode: code,
        userId: currentUser._id,
        orderTotal: subtotal,
        shippingCost: shippingCost
      }).unwrap();
      toast.success("Áp dụng mã giảm giá thành công!");
      if (onApplyCoupon) {
        onApplyCoupon(result); // Cập nhật appliedCoupon trong Checkout
      }
      onClose(); // Đóng modal sau khi áp dụng
    } catch (error) {
      toast.error(error?.data?.message || "Không thể áp dụng mã giảm giá");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn mã giảm giá</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="mt-4">
          {isCouponsLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Đang tải mã giảm giá...</p>
          ) : availableCoupons.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Không có mã giảm giá khả dụng.</p>
          ) : (
            <div className="space-y-3">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="p-3 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSelectCoupon(coupon.code)}
                >
                  <p className="font-medium">{coupon.code}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {coupon.target_type === "FREESHIPPING"
                      ? "Miễn phí vận chuyển"
                      : coupon.target_type === "ORDER"
                      ? coupon.type === "PERCENT"
                        ? `Giảm ${coupon.value}% đơn hàng`
                        : `Giảm ₫${coupon.value.toLocaleString("vi-VN")} đơn hàng`
                      : `Giảm ${coupon.type === "PERCENT" ? `${coupon.value}%` : `₫${coupon.value.toLocaleString("vi-VN")}`} cho sản phẩm cụ thể`}
                  </p>
                  {coupon.discount && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Giảm: ₫{coupon.discount.toLocaleString("vi-VN")}
                    </p>
                  )}
                  {coupon.error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Lỗi: {coupon.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponModal;