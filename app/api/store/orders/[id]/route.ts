import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Store from '@/models/Store'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await Store.findOne({ ownerId: (session.user as any).id })
  const body = await req.json()
  const order = await Order.findOneAndUpdate(
    { _id: params.id, storeId: store?._id },
    { $set: body },
    { new: true }
  )
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ order })
}
