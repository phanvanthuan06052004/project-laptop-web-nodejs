import { useState } from "react"
import { Button } from "~/components/ui/Button"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  useGetProductsQuery,
  useDeleteProductMutation
} from "~/store/apis/productApi"

const PAGE_SIZE = 5

const ManageLaptops = () => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  // Lấy danh sách laptop từ API
  const {
    data,
    isLoading,
    isError,
    error
  } = useGetProductsQuery({ page: currentPage, limit: PAGE_SIZE, search })
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const laptops = data?.products || []
  const totalPages = data?.pagination?.totalPages || 1

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProduct(deleteId).unwrap()
      setShowDeleteModal(false)
      setDeleteId(null)
    } catch {
      // TODO: Hiển thị thông báo lỗi
      setShowDeleteModal(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Quản lý Laptop</h1>
        <Button className="flex items-center gap-2" onClick={() => navigate("/admin/laptops/new")}> <Plus size={18} /> Thêm laptop mới </Button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            placeholder="Tìm kiếm laptop..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
          />
          <Search size={18} className="absolute left-2 top-2.5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="py-3 px-4 text-left w-2/5">Tên laptop</th>
              <th className="py-3 px-4 text-center">Giá</th>
              <th className="py-3 px-4 text-center">Số lượng</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-6">Đang tải...</td></tr>
            ) : isError ? (
              <tr><td colSpan={6} className="text-center py-6 text-red-500">Lỗi: {error?.data?.message || "Không thể tải dữ liệu"}</td></tr>
            ) : laptops.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">Không có laptop nào</td>
              </tr>
            ) : (
              laptops.map(lap => (
                <tr key={lap._id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="py-3 px-4 font-medium w-2/5">{lap.name || ""}</td>
                  <td className="py-3 px-4 text-right">{typeof lap.price === "number" ? lap.price.toLocaleString() : "0"}₫</td>
                  <td className="py-3 px-4 text-right">{lap?.quantity || 0}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      lap.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {lap.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button size="icon" variant="ghost" className="mr-2" onClick={() => navigate(`/admin/products/${lap._id}`)}>
                      <Edit size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { setShowDeleteModal(true); setDeleteId(lap._id) }}>
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
          {(() => {
            const pages = []
            const maxPagesToShow = 7
            let start = Math.max(1, currentPage - 3)
            let end = Math.min(totalPages, currentPage + 3)
            if (end - start < maxPagesToShow - 1) {
              if (start === 1) {
                end = Math.min(totalPages, start + maxPagesToShow - 1)
              } else if (end === totalPages) {
                start = Math.max(1, end - maxPagesToShow + 1)
              }
            }
            if (start > 1) {
              pages.push(
                <Button key={1} variant={currentPage === 1 ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(1)}>1</Button>
              )
              if (start > 2) pages.push(<span key="start-ellipsis" className="px-1">...</span>)
            }
            for (let i = start; i <= end; i++) {
              if (i === 1 || i === totalPages) continue
              pages.push(
                <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(i)}>{i}</Button>
              )
            }
            if (end < totalPages) {
              if (end < totalPages - 1) pages.push(<span key="end-ellipsis" className="px-1">...</span>)
              pages.push(
                <Button key={totalPages} variant={currentPage === totalPages ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
              )
            }
            return pages
          })()}
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
              onClick={() => { setShowDeleteModal(false); setDeleteId(null) }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Xác nhận xóa sản phẩm</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => { setShowDeleteModal(false); setDeleteId(null) }}>Hủy</Button>
              <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>Xóa</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageLaptops
