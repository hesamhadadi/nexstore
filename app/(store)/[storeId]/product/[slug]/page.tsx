import { connectDB } from '@/lib/db'
import Store from '@/models/Store'
import Product from '@/models/Product'
import { notFound } from 'next/navigation'
import StoreProductDetail from '@/components/store/StoreProductDetail'

interface Props { params: { storeId: string; slug: string } }

export default async function ProductDetailPage({ params }: Props) {
  await connectDB()
  const store = await Store.findOne({ slug: params.storeId, isActive: true })
  if (!store) notFound()

  const product = await Product.findOne({ slug: params.slug, storeId: store._id, isActive: true })
    .populate('categoryId', 'name slug')
  if (!product) notFound()

  const related = await Product.find({
    storeId: store._id, categoryId: product.categoryId, _id: { $ne: product._id }, isActive: true
  }).limit(4)

  return (
    <StoreProductDetail
      store={JSON.parse(JSON.stringify(store))}
      product={JSON.parse(JSON.stringify(product))}
      related={JSON.parse(JSON.stringify(related))}
    />
  )
}
