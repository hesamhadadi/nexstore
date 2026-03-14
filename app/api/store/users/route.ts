import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Store from '@/models/Store'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await Store.findOne({ ownerId: (session.user as any).id })
  if (!store) return NextResponse.json({ users: [] })
  const users = await User.find({ storeId: store._id, role: 'customer' }).select('-password').sort({ createdAt: -1 })
  return NextResponse.json({ users })
}
