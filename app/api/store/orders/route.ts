import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Store from '@/models/Store'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await Store.findOne({ ownerId: (session.user as any).id })
  if (!store) return NextResponse.json({ orders: [] })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = Number(searchParams.get('page') || 1)
  const limit = 20

  const query: any = { storeId: store._id }
  if (status && status !== 'all') query.status = status

  const [orders, total] = await Promise.all([
    Order.find(query).populate('customerId', 'name email phone').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(query),
  ])

  return NextResponse.json({ orders, total, pages: Math.ceil(total / limit) })
}
