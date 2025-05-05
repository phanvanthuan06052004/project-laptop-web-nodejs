const ProductSpecifications = ({ attributeGroup }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {attributeGroup.map((attr, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium w-1/4">{attr.name}</td>
                <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: attr.values }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductSpecifications
