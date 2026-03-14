import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Store from '@/models/Store'
import { generateToken, slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, storeName, storeSlug } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'فیلدهای الزامی را پر کنید' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'این ایمیل قبلاً ثبت شده است' }, { status: 400 })
    }

    const user = await User.create({ name, email, password, role: 'store_admin' })

    if (storeName && storeSlug) {
      const slug = slugify(storeSlug)
      const existingStore = await Store.findOne({ slug })
      if (existingStore) {
        await User.findByIdAndDelete(user._id)
        return NextResponse.json({ error: 'این نام فروشگاه قبلاً استفاده شده' }, { status: 400 })
      }

      const token = generateToken(32)
      const store = await Store.create({
        name: storeName, slug, ownerId: user._id,
        token, isActive: false,
      })

      await User.findByIdAndUpdate(user._id, { storeId: store._id })
    }

    return NextResponse.json({ message: 'ثبت‌نام موفق' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'خطای سرور' }, { status: 500 })
  }
}
