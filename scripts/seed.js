require('dotenv').config({ path: '.env' })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('❌ MONGODB_URI در .env تنظیم نشده!'); process.exit(1) }

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: { type: String, default: 'customer' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

async function seed() {
  console.log('🔌 اتصال به MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ متصل شد!')

  const User = mongoose.models.User || mongoose.model('User', UserSchema)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourstore.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'

  const existing = await User.findOne({ email: adminEmail })
  if (existing) {
    existing.role = 'superadmin'
    existing.isActive = true
    await existing.save()
    console.log('✅ کاربر موجود به superadmin ارتقا یافت:', adminEmail)
    await mongoose.disconnect(); process.exit(0)
  }

  const hashed = await bcrypt.hash(adminPassword, 12)
  await User.create({ name: 'Super Admin', email: adminEmail, password: hashed, role: 'superadmin', isActive: true })

  console.log('\n🎉 ابرمدیر ساخته شد!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  ایمیل:  ', adminEmail)
  console.log('  رمز:    ', adminPassword)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n➡️  برو به: http://localhost:3000/login\n')
  await mongoose.disconnect(); process.exit(0)
}

seed().catch(err => { console.error('❌ خطا:', err.message); process.exit(1) })
