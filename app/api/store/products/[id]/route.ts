import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Store from '@/models/Store'

async function getStoreId(userId: string) {
  const store = await Store.findOne({ ownerId: userId })
  return store?._id
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const storeId = await getStoreId((session.user as any).id)
  const product = await Product.findOne({ _id: params.id, storeId }).populate('categoryId', 'name')
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const storeId = await getStoreId((session.user as any).id)
  const body = await req.json()
  const product = await Product.findOneAndUpdate({ _id: params.id, storeId }, body, { new: true })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const storeId = await getStoreId((session.user as any).id)
  await Product.findOneAndDelete({ _id: params.id, storeId })
  return NextResponse.json({ message: 'Deleted' })
}
