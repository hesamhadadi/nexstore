'use client'
import { useState, useEffect } from 'react'
import { Upload, Save, RefreshCw, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const colorPresets = [
  { name: 'کلاسیک مشکی', primary: '#0f0f0f', secondary: '#ffffff', accent: '#c9a96e' },
  { name: 'آبی نیوی', primary: '#1e3a5f', secondary: '#ffffff', accent: '#e8b86d' },
  { name: 'سبز زمردی', primary: '#064e3b', secondary: '#ffffff', accent: '#fbbf24' },
  { name: 'بنفش شاهانه', primary: '#4c1d95', secondary: '#ffffff', accent: '#f59e0b' },
  { name: 'قرمز آتشین', primary: '#7f1d1d', secondary: '#ffffff', accent: '#fbbf24' },
  { name: 'خاکی گرم', primary: '#78350f', secondary: '#fffbeb', accent: '#d97706' },
]

export default function AppearancePage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    primaryColor: '#0f0f0f',
    secondaryColor: '#ffffff',
    accentColor: '#c9a96e',
    language: 'fa',
    logo: '',
  })
  const [storeSlug, setStoreSlug] = useState('')

  useEffect(() => {
    fetch('/api/store/settings').then(r => r.json()).then(d => {
      if (d.store) {
        setForm({
          primaryColor: d.store.primaryColor || '#0f0f0f',
          secondaryColor: d.store.secondaryColor || '#ffffff',
          accentColor: d.store.accentColor || '#c9a96e',
          language: d.store.language || 'fa',
          logo: d.store.logo || '',
        })
        setStoreSlug(d.store.slug || '')
      }
    })
  }, [])

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: reader.result, folder: 'logos' }),
        })
        const data = await res.json()
        if (data.url) {
          setForm(prev => ({ ...prev, logo: data.url }))
          toast.success('لوگو آپلود شد')
        }
      }
      reader.readAsDataURL(e.target.files[0])
    } catch { toast.error('خطا در آپلود') }
    finally { setUploading(false) }
  }

  async function handleSave() {
    setLoading(true)
    try {
      const res = await fetch('/api/store/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success('تنظیمات ذخیره شد')
    } catch { toast.error('خطا در ذخیره') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">ظاهر فروشگاه</h1>
          <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>لوگو، رنگ و زبان فروشگاه خود را تنظیم کنید</p>
        </div>
        {storeSlug && (
          <Link href={`/store/${storeSlug}`} target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'none' }}>
            <Eye size={16} />
            پیش‌نمایش
          </Link>
        )}
      </div>

      {/* Logo */}
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: '#e8e5e0' }}>
        <h2 className="font-semibold mb-5">لوگو فروشگاه</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
            {form.logo ? (
              <img src={form.logo} alt="لوگو" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center">
                <Upload size={24} style={{ color: '#9b9490', margin: '0 auto 0.25rem' }} />
                <span className="text-xs" style={{ color: '#9b9490' }}>لوگو</span>
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm"
              style={{ background: '#0a0a0a', color: 'white' }}>
              <Upload size={16} />
              {uploading ? 'در حال آپلود...' : 'آپلود لوگو'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-xs mt-2" style={{ color: '#9b9490' }}>PNG یا SVG شفاف توصیه می‌شود. حداکثر ۲ مگابایت</p>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: '#e8e5e0' }}>
        <h2 className="font-semibold mb-2">رنگ‌بندی</h2>
        <p className="text-sm mb-5" style={{ color: '#9b9490' }}>رنگ اصلی فروشگاه را انتخاب یا سفارشی کنید</p>

        {/* Presets */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {colorPresets.map((preset) => (
            <button key={preset.name} type="button"
              onClick={() => setForm(prev => ({ ...prev, primaryColor: preset.primary, secondaryColor: preset.secondary, accentColor: preset.accent }))}
              className="flex flex-col items-center gap-2 p-2 rounded-xl border transition-all hover:border-black"
              style={{ borderColor: form.primaryColor === preset.primary ? '#0a0a0a' : '#e8e5e0', background: 'none', cursor: 'pointer' }}>
              <div className="w-10 h-10 rounded-lg" style={{ background: preset.primary }} />
              <span className="text-xs text-center" style={{ color: '#9b9490', lineHeight: 1.2 }}>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Custom colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">رنگ اصلی</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.primaryColor}
                onChange={e => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-10 rounded-lg border cursor-pointer" style={{ borderColor: '#e8e5e0', padding: '2px' }} />
              <input value={form.primaryColor}
                onChange={e => setForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="form-input font-mono text-sm" placeholder="#000000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">رنگ پس‌زمینه</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.secondaryColor}
                onChange={e => setForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-12 h-10 rounded-lg border cursor-pointer" style={{ borderColor: '#e8e5e0', padding: '2px' }} />
              <input value={form.secondaryColor}
                onChange={e => setForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="form-input font-mono text-sm" placeholder="#ffffff" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">رنگ تأکیدی</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accentColor}
                onChange={e => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                className="w-12 h-10 rounded-lg border cursor-pointer" style={{ borderColor: '#e8e5e0', padding: '2px' }} />
              <input value={form.accentColor}
                onChange={e => setForm(prev => ({ ...prev, accentColor: e.target.value }))}
                className="form-input font-mono text-sm" placeholder="#c9a96e" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-5 p-4 rounded-xl border" style={{ borderColor: '#e8e5e0', background: '#fafafa' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#9b9490' }}>پیش‌نمایش رنگ‌بندی</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg" style={{ background: form.primaryColor }} />
            <div className="w-10 h-10 rounded-lg border" style={{ background: form.secondaryColor, borderColor: '#e8e5e0' }} />
            <div className="w-10 h-10 rounded-lg" style={{ background: form.accentColor }} />
            <div className="flex-1 h-10 rounded-lg flex items-center px-4" style={{ background: form.primaryColor }}>
              <span className="text-sm font-medium" style={{ color: form.secondaryColor }}>دکمه نمونه</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: '#e8e5e0' }}>
        <h2 className="font-semibold mb-5">زبان پیش‌فرض فروشگاه</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { code: 'fa', label: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
            { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
            { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
          ].map(lang => (
            <button key={lang.code} type="button"
              onClick={() => setForm(prev => ({ ...prev, language: lang.code }))}
              className="p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer"
              style={{
                borderColor: form.language === lang.code ? '#0a0a0a' : '#e8e5e0',
                background: form.language === lang.code ? '#0a0a0a' : 'white',
                color: form.language === lang.code ? 'white' : '#0a0a0a',
              }}>
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#9b9490' }}>مشتریان می‌توانند زبان را از فروشگاه تغییر دهند</p>
      </div>

      <button onClick={handleSave} disabled={loading}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', background: loading ? '#999' : '#0a0a0a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: '1rem' }}>
        <Save size={18} />
        {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </button>
    </div>
  )
}
