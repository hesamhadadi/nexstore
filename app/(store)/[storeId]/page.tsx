import { connectDB } from '@/lib/db'
import Store from '@/models/Store'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { notFound } from 'next/navigation'
import StoreHomepage from '@/components/store/StoreHomepage'

interface Props { params: { storeId: string } }

export async function generateMetadata({ params }: Props) {
  await connectDB()
  const store = await Store.findOne({ slug: params.storeId, isActive: true })
  if (!store) return { title: 'Not Found' }
  return {
    title: store.seo?.title || store.name,
    description: store.seo?.description || store.description,
  }
}

export default async function StorePage({ params }: Props) {
  await connectDB()
  const store = await Store.findOne({ slug: params.storeId, isActive: true })
  if (!store) notFound()

  const [featuredProducts, categories] = await Promise.all([
    Product.find({ storeId: store._id, isActive: true, isFeatured: true }).limit(8).populate('categoryId', 'name'),
    Category.find({ storeId: store._id, isActive: true, parentId: null }).sort({ order: 1 }),
  ])

  const newProducts = await Product.find({ storeId: store._id, isActive: true })
    .sort({ createdAt: -1 }).limit(12).populate('categoryId', 'name')

  return (
    <StoreHomepage
      store={JSON.parse(JSON.stringify(store))}
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
      newProducts={JSON.parse(JSON.stringify(newProducts))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  )
}
