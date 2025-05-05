const ProductDescription = ({ description }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h3>
      <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  )
}

export default ProductDescription
