import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, Steps, Button, message, Spin } from "antd"
import { useDispatch } from "react-redux"
import { clearCart } from "~/store/slices/cartSlice"
import PaymentMethod from "~/components/payment/PaymentMethod"
import BankTransferInfo from "~/components/payment/BankTransferInfo"
import { orderService } from "~/services/orderService"

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("MOMO")
  const [paymentInfo, setPaymentInfo] = useState(null)

  const orderData = location.state?.orderData
  if (!orderData) {
    navigate("/cart")
    return null
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      const response = await orderService.createNewOrder({
        ...orderData,
        paymentMethod
      })

      setPaymentInfo(response.payment)

      switch (response.payment.paymentMethod) {
        case "MOMO":
          window.location.href = response.payment.paymentUrl
          break

        case "COD":
          message.success("Đơn hàng đã được tạo. Vui lòng thanh toán khi nhận hàng.")
          dispatch(clearCart())
          navigate("/order-success", { state: { orderId: response.order.insertedId } })
          break

        case "BANK":
          message.success("Vui lòng chuyển khoản theo thông tin bên dưới")
          break
      }
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tạo đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Steps
        current={1}
        items={[
          { title: "Giỏ hàng" },
          { title: "Thanh toán" },
          { title: "Hoàn tất" }
        ]}
        style={{ marginBottom: 24 }}
      />

      <Spin spinning={loading}>
        <Card title="Phương thức thanh toán">
          <PaymentMethod value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />

          <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={handlePayment} loading={loading}>
              Thanh toán
            </Button>
          </div>
        </Card>

        {paymentInfo?.paymentMethod === "BANK" && (
          <div style={{ marginTop: 24 }}>
            <BankTransferInfo
              bankAccounts={paymentInfo.bankAccounts}
              orderCode={orderData.orderCode}
              amount={orderData.totalAmount}
            />
          </div>
        )}
      </Spin>
    </div>
  )
}

export default PaymentPage 