'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email, password, redirect: false,
      })
      if (res?.error) {
        toast.error('ایمیل یا رمز عبور اشتباه است')
      } else {
        // Fetch session to get role
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        const role = session?.user?.role
        if (role === 'superadmin') router.push('/admin')
        else if (role === 'store_admin') router.push('/dashboard')
        else router.push('/')
      }
    } catch {
      toast.error('خطایی رخ داد')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
      {/* Left panel - visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #c9a96e, transparent)' }} />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
            style={{ background: 'linear-gradient(135deg, #c9a96e, #a07850)' }}>
            <ShoppingBag size={36} color="white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            NexStore
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-sm">
            پلتفرم حرفه‌ای فروشگاه آنلاین. هر چیزی که نیاز داری در یک مکان.
          </p>

          <div className="mt-16 grid grid-cols-2 gap-4 w-full max-w-xs">
            {['مدیریت محصولات', 'آمار فروش', 'چند زبانه', 'شخصی‌سازی'].map((f) => (
              <div key={f} className="px-3 py-2 rounded-lg text-xs text-center"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#faf9f7' }}>
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ShoppingBag size={22} style={{ color: '#c9a96e' }} />
              <span className="font-bold">NexStore</span>
            </Link>
            <h2 className="text-3xl font-bold mb-2">خوش برگشتی 👋</h2>
            <p style={{ color: '#9b9490' }}>وارد حساب کاربری‌ات شو</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b9490' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: loading ? '#999' : '#0a0a0a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontFamily: 'Vazirmatn, sans-serif',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'در حال ورود...' : (
                <>
                  ورود به حساب
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm" style={{ color: '#9b9490' }}>
            حساب کاربری نداری؟{' '}
            <Link href="/register" style={{ color: '#0a0a0a', fontWeight: '600', textDecoration: 'none' }}>
              ثبت‌نام کن
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
