import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import Store from '@/models/Store'
import { slugify } from '@/lib/utils'

async function getStore(userId: string) {
  return Store.findOne({ ownerId: userId })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await getStore((session.user as any).id)
  if (!store) return NextResponse.json({ categories: [] })

  const categories = await Category.find({ storeId: store._id }).sort({ order: 1, createdAt: 1 })

  // Build tree
  const map = new Map(categories.map(c => [c._id.toString(), { ...c.toObject(), children: [] }]))
  const tree: any[] = []
  map.forEach(cat => {
    if (cat.parentId) {
      const parent = map.get(cat.parentId.toString())
      if (parent) parent.children.push(cat)
      else tree.push(cat)
    } else {
      tree.push(cat)
    }
  })

  return NextResponse.json({ categories, tree })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await getStore((session.user as any).id)
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const body = await req.json()
  const slug = slugify(body.name.en || body.name.fa) + '-' + Date.now()

  const category = await Category.create({ ...body, storeId: store._id, slug })
  return NextResponse.json({ category }, { status: 201 })
}
