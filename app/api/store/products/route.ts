import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Store from '@/models/Store'
import { slugify } from '@/lib/utils'

async function getStoreId(userId: string) {
  const store = await Store.findOne({ ownerId: userId })
  return store?._id
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const storeId = await getStoreId((session.user as any).id)
  if (!storeId) return NextResponse.json({ products: [] })

  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 50)
  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('category') || ''

  const query: any = { storeId }
  if (search) query.$or = [{ 'name.fa': { $regex: search, $options: 'i' } }, { 'name.en': { $regex: search, $options: 'i' } }]
  if (categoryId) query.categoryId = categoryId

  const [products, total] = await Promise.all([
    Product.find(query).populate('categoryId', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(query),
  ])

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const storeId = await getStoreId((session.user as any).id)
  if (!storeId) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const body = await req.json()
  const slug = slugify(body.name.en || body.name.fa) + '-' + Date.now()

  const product = await Product.create({ ...body, storeId, slug })
  return NextResponse.json({ product }, { status: 201 })
}
