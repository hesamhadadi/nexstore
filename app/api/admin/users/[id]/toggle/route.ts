import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const user = await User.findById(params.id)
  if (!user || user.role === 'superadmin') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }
  user.isActive = !user.isActive
  await user.save()
  return NextResponse.json({ user })
}
