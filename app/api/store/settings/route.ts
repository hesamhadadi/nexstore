import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Store from '@/models/Store'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const store = await Store.findOne({ ownerId: (session.user as any).id })
  return NextResponse.json({ store })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const store = await Store.findOneAndUpdate(
    { ownerId: (session.user as any).id },
    { $set: body },
    { new: true }
  )
  return NextResponse.json({ store })
}
