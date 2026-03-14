import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Store from '@/models/Store'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const store = await Store.findById(params.id)
  if (!store) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  store.isActive = !store.isActive
  await store.save()
  return NextResponse.json({ store })
}
