import { useState } from "react"
import { Button } from "~/components/ui/Button"
import { Edit, Trash2, Search } from "lucide-react"

const mockCustomers = [
  { _id: "1", name: "Nguyễn Văn A", email: "a@gmail.com", phone: "0901234567", status: "Hoạt động" },
  { _id: "2", name: "Trần Thị B", email: "b@gmail.com", phone: "0912345678", status: "Khóa" },
  { _id: "3", name: "Lê Văn C", email: "c@gmail.com", phone: "0987654321", status: "Hoạt động" },
  { _id: "4", name: "Phạm Thị D", email: "d@gmail.com", phone: "0978123456", status: "Hoạt động" },
  { _id: "5", name: "Vũ Văn E", email: "e@gmail.com", phone: "0934567890", status: "Khóa" }
]

const PAGE_SIZE = 10

const ManageCustomers = () => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Lọc và phân trang
  const filtered = mockCustomers.filter(cus => cus.name.toLowerCase().includes(search.toLowerCase()) || cus.email.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const customers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleDelete = () => {
    setShowDeleteModal(false)
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            placeholder="Tìm kiếm khách hàng..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-2 top-2.5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="py-3 px-4 text-left">Tên khách hàng</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Số điện thoại</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">Không có khách hàng nào</td>
              </tr>
            ) : (
              customers.map(cus => (
                <tr key={cus._id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="py-3 px-4 font-medium">{cus.name}</td>
                  <td className="py-3 px-4">{cus.email}</td>
                  <td className="py-3 px-4">{cus.phone}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${cus.status === "Hoạt động" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{cus.status}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button size="icon" variant="ghost" className="mr-2">
                      <Edit size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setShowDeleteModal(true)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx}
              variant={currentPage === idx + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
        </div>
      )}
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowDeleteModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Xác nhận xóa khách hàng</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
              <Button variant="danger" onClick={handleDelete}>Xóa</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCustomers
