'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', storeName: '', storeSlug: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'storeName') {
      setForm(prev => ({
        ...prev,
        storeName: value,
        storeSlug: value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت‌نام')
      toast.success('ثبت‌نام موفق! منتظر تأیید ادمین باش')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" dir="rtl"
      style={{ background: '#faf9f7', fontFamily: 'Vazirmatn, sans-serif' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <ShoppingBag size={28} style={{ color: '#c9a96e' }} />
            <span className="text-xl font-bold">NexStore</span>
          </Link>
          <h2 className="text-3xl font-bold mb-2">ایجاد فروشگاه جدید</h2>
          <p style={{ color: '#9b9490' }}>در چند قدم فروشگاه آنلاینت رو بساز</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: step >= s ? '#0a0a0a' : '#e8e5e0',
                  color: step >= s ? 'white' : '#9b9490',
                }}>
                {s}
              </div>
              <div className="text-sm" style={{ color: step >= s ? '#0a0a0a' : '#9b9490' }}>
                {s === 1 ? 'اطلاعات شخصی' : 'اطلاعات فروشگاه'}
              </div>
              {s < 2 && <div className="flex-1 h-px" style={{ background: step > s ? '#0a0a0a' : '#e8e5e0' }} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">نام و نام خانوادگی</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    className="form-input" placeholder="محمد احمدی" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ایمیل</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    className="form-input" placeholder="example@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رمز عبور</label>
                  <div className="relative">
                    <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                      onChange={handleChange} className="form-input" placeholder="حداقل ۸ کاراکتر" required minLength={8} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b9490' }}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">نام فروشگاه</label>
                  <input name="storeName" value={form.storeName} onChange={handleChange}
                    className="form-input" placeholder="فروشگاه مد و پوشاک" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">آدرس فروشگاه (slug)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-3 py-3 rounded-lg border border-gray-200 whitespace-nowrap" style={{ color: '#9b9490', background: '#f5f5f5' }}>
                      nexstore.com/
                    </span>
                    <input name="storeSlug" value={form.storeSlug} onChange={handleChange}
                      className="form-input" placeholder="my-store" required pattern="[a-z0-9\-]+" />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#9b9490' }}>فقط حروف انگلیسی کوچک، اعداد و خط تیره</p>
                </div>
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <p className="text-sm" style={{ color: '#92400e' }}>
                    ⚠️ پس از ثبت‌نام، ادمین اصلی توکن فعال‌سازی برای فروشگاهت صادر می‌کنه.
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '0.875rem', background: 'transparent', border: '1.5px solid #e8e5e0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                  برگشت
                </button>
              )}
              <button type="submit" disabled={loading}
                style={{ flex: 2, padding: '0.875rem', background: loading ? '#999' : '#0a0a0a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                {step === 1 ? 'بعدی' : loading ? 'در حال ثبت...' : 'ثبت‌نام نهایی'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: '#9b9490' }}>
          حساب داری؟{' '}
          <Link href="/login" style={{ color: '#0a0a0a', fontWeight: '600', textDecoration: 'none' }}>
            وارد شو
          </Link>
        </p>
      </div>
    </div>
  )
}
