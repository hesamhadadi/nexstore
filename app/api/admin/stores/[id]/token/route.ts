import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Store from '@/models/Store'
import { generateToken } from '@/lib/utils'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const { days = 30 } = await req.json()
  const store = await Store.findById(params.id)
  if (!store) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  store.token = generateToken(32)
  store.tokenExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  store.isActive = true
  await store.save()

  return NextResponse.json({ token: store.token, expiresAt: store.tokenExpiresAt })
}
