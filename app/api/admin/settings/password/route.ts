import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const { currentPassword, newPassword } = await req.json()
  const user = await User.findById((session.user as any).id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const isValid = await user.comparePassword(currentPassword)
  if (!isValid) return NextResponse.json({ error: 'رمز عبور فعلی اشتباه است' }, { status: 400 })

  user.password = newPassword
  await user.save()
  return NextResponse.json({ message: 'Password changed' })
}
