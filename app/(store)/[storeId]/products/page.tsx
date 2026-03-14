import { connectDB } from '@/lib/db'
import Store from '@/models/Store'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { notFound } from 'next/navigation'
import StoreProductsClient from '@/components/store/StoreProductsClient'

interface Props {
  params: { storeId: string }
  searchParams: { category?: string; sort?: string; search?: string; page?: string }
}

export default async function StoreProductsPage({ params, searchParams }: Props) {
  await connectDB()
  const store = await Store.findOne({ slug: params.storeId, isActive: true })
  if (!store) notFound()

  const query: any = { storeId: store._id, isActive: true }
  if (searchParams.category) query.categoryId = searchParams.category
  if (searchParams.search) {
    query.$or = [
      { 'name.fa': { $regex: searchParams.search, $options: 'i' } },
      { 'name.en': { $regex: searchParams.search, $options: 'i' } },
    ]
  }

  const sortOptions: Record<string, any> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { soldCount: -1 },
  }
  const sort = sortOptions[searchParams.sort || 'newest'] || { createdAt: -1 }
  const page = Number(searchParams.page || 1)
  const limit = 24

  const [products, total, categories] = await Promise.all([
    Product.find(query).sort(sort).skip((page - 1) * limit).limit(limit).populate('categoryId', 'name'),
    Product.countDocuments(query),
    Category.find({ storeId: store._id, isActive: true }).sort({ order: 1 }),
  ])

  return (
    <StoreProductsClient
      store={JSON.parse(JSON.stringify(store))}
      products={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
      total={total}
      page={page}
      pages={Math.ceil(total / limit)}
    />
  )
}
