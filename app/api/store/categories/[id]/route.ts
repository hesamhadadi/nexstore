import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import Store from '@/models/Store'

async function getStore(userId: string) {
  return Store.findOne({ ownerId: userId })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await getStore((session.user as any).id)
  const body = await req.json()
  const cat = await Category.findOneAndUpdate({ _id: params.id, storeId: store?._id }, body, { new: true })
  return NextResponse.json({ category: cat })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await getStore((session.user as any).id)
  // Delete all children recursively
  async function deleteWithChildren(id: string) {
    const children = await Category.find({ parentId: id, storeId: store?._id })
    for (const child of children) await deleteWithChildren(child._id.toString())
    await Category.findByIdAndDelete(id)
  }
  await deleteWithChildren(params.id)
  return NextResponse.json({ message: 'Deleted' })
}
