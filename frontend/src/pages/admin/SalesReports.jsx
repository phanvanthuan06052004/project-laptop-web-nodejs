import { useState } from "react"
import { Button } from "~/components/ui/Button"

const mockReports = [
  { month: "01/2024", totalOrders: 120, totalRevenue: 320000000 },
  { month: "02/2024", totalOrders: 98, totalRevenue: 250000000 },
  { month: "03/2024", totalOrders: 150, totalRevenue: 400000000 },
  { month: "04/2024", totalOrders: 110, totalRevenue: 300000000 },
  { month: "05/2024", totalOrders: 130, totalRevenue: 350000000 }
]

const PAGE_SIZE = 6

const SalesReports = () => {
  const [year, setYear] = useState("2024")
  const [currentPage, setCurrentPage] = useState(1)

  // Lọc theo năm (mock)
  const filtered = mockReports.filter(r => r.month.endsWith(year))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const reports = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Báo cáo doanh số</h1>
        <div>
          <select
            className="border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            value={year}
            onChange={e => setYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="py-3 px-4 text-left">Tháng</th>
              <th className="py-3 px-4 text-center">Số đơn hàng</th>
              <th className="py-3 px-4 text-right">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500 dark:text-gray-400">Không có dữ liệu</td>
              </tr>
            ) : (
              reports.map(r => (
                <tr key={r.month} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="py-3 px-4 font-medium">{r.month}</td>
                  <td className="py-3 px-4 text-center">{r.totalOrders}</td>
                  <td className="py-3 px-4 text-right">{r.totalRevenue.toLocaleString()}₫</td>
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

export default SalesReports
