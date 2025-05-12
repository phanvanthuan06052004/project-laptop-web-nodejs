import { useState } from "react"
import { Button } from "~/components/ui/Button"
import { Eye, CheckCircle2, Search } from "lucide-react"

const mockTickets = [
  { _id: "1", customer: "Nguyễn Văn A", subject: "Không nhận được hàng", status: "Chờ xử lý" },
  { _id: "2", customer: "Trần Thị B", subject: "Sản phẩm lỗi", status: "Đã xử lý" },
  { _id: "3", customer: "Lê Văn C", subject: "Cần tư vấn thêm", status: "Chờ xử lý" }
]

const PAGE_SIZE = 10

const CustomerSupport = () => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = mockTickets.filter(t => t.customer.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const tickets = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Hỗ trợ khách hàng</h1>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            placeholder="Tìm kiếm hỗ trợ..."
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
              <th className="py-3 px-4 text-left">Khách hàng</th>
              <th className="py-3 px-4 text-left">Chủ đề</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">Không có ticket nào</td>
              </tr>
            ) : (
              tickets.map(t => (
                <tr key={t._id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="py-3 px-4 font-medium">{t.customer}</td>
                  <td className="py-3 px-4">{t.subject}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${t.status === "Đã xử lý" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{t.status}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button size="icon" variant="ghost" className="mr-2">
                      <Eye size={16} />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <CheckCircle2 size={16} />
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
    </div>
  )
}

export default CustomerSupport
