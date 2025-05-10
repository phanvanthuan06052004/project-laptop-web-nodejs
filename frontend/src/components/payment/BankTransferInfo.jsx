import React, { useState } from "react"
import { Copy, X } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { QRCodeSVG } from "qrcode.react"
import { useCancelTransactionMutation } from "~/store/apis/paymentSlice"

const BankTransferInfo = () => {
  const { paymentInfo } = useLocation().state
  const navigate = useNavigate()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [cancelTransaction] = useCancelTransactionMutation()

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Hiển thị thông báo native
    toast.success("Đã sao chép vào clipboard")
  }

  const handleCancel = async () => {
    try {
      await cancelTransaction(paymentInfo.paymentLinkId).unwrap()
      toast.success("Hủy giao dịch thành công")
      navigate("/")
    } catch (error) {
      toast.error(error.data?.message || "Có lỗi xảy ra khi hủy giao dịch")
    }
  }

  return (
    <div className="max-w-xl mx-auto my-10 bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="text-gray-800 font-medium">
          Mở App Ngân hàng hoặc ví điện tử bất kỳ để <b>quét mã QR</b> hoặc <b>chuyển khoản</b> chính xác số tiền bên dưới
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="flex-1 flex justify-center">
          <QRCodeSVG
            value={paymentInfo.qrCode}
            size={208}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            className="border border-gray-200 rounded-lg"
          />
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div>
            <span className="font-semibold">Ngân hàng:</span> <span>{paymentInfo.bankName || "Ngân hàng TMCP Quân đội"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Chủ tài khoản:</span>
            <span>{paymentInfo.accountName}</span>
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100"
              onClick={() => copyToClipboard(paymentInfo.accountName)}
              title="Sao chép"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Số tài khoản:</span>
            <span>{paymentInfo.bankAccounts}</span>
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100"
              onClick={() => copyToClipboard(paymentInfo.bankAccounts)}
              title="Sao chép"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Số tiền:</span>
            <span>{Number(paymentInfo.amount).toLocaleString("vi-VN")} VND</span>
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100"
              onClick={() => copyToClipboard(paymentInfo.amount)}
              title="Sao chép"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Nội dung:</span>
            <span>{paymentInfo.description}</span>
            <button
              className="ml-2 p-1 rounded hover:bg-gray-100"
              onClick={() => copyToClipboard(paymentInfo.description)}
              title="Sao chép"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Hủy giao dịch
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        <span className="font-medium text-red-500">Lưu ý:</span> Nhập chính xác số tiền <b>{Number(paymentInfo.amount).toLocaleString("vi-VN")}</b> khi chuyển khoản
      </div>

      {/* Modal xác nhận hủy */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Xác nhận hủy giao dịch</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy giao dịch này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Đóng
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BankTransferInfo