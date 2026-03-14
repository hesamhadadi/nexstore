'use client'
import { useState, useEffect } from 'react'
import { Save, Globe, Mail, Phone, MapPin, Instagram, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    instagram: '',
    telegram: '',
    whatsapp: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  })

  useEffect(() => {
    fetch('/api/store/settings').then(r => r.json()).then(d => {
      const s = d.store
      if (s) {
        setForm({
          name: s.name || '',
          description: s.description || '',
          contactEmail: s.contactInfo?.email || '',
          contactPhone: s.contactInfo?.phone || '',
          contactAddress: s.contactInfo?.address || '',
          instagram: s.socialLinks?.instagram || '',
          telegram: s.socialLinks?.telegram || '',
          whatsapp: s.socialLinks?.whatsapp || '',
          seoTitle: s.seo?.title || '',
          seoDescription: s.seo?.description || '',
          seoKeywords: s.seo?.keywords || '',
        })
      }
      setLoading(false)
    })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/store/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          contactInfo: {
            email: form.contactEmail,
            phone: form.contactPhone,
            address: form.contactAddress,
          },
          socialLinks: {
            instagram: form.instagram,
            telegram: form.telegram,
            whatsapp: form.whatsapp,
          },
          seo: {
            title: form.seoTitle,
            description: form.seoDescription,
            keywords: form.seoKeywords,
          },
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('تنظیمات ذخیره شد')
    } catch {
      toast.error('خطا در ذخیره')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a' }} />
    </div>
  )

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: '#f0f0f0', background: '#fafafa' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
          <Icon size={16} color="white" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">تنظیمات فروشگاه</h1>
        <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>اطلاعات پایه و تماس فروشگاه</p>
      </div>

      {/* Basic Info */}
      <Section title="اطلاعات پایه" icon={Globe}>
        <div>
          <label className="block text-sm font-medium mb-2">نام فروشگاه</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="فروشگاه من" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">توضیح کوتاه</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            className="form-input" rows={3} placeholder="بهترین محصولات را از ما بخرید..." style={{ resize: 'vertical' }} />
        </div>
      </Section>

      {/* Contact */}
      <Section title="اطلاعات تماس" icon={Phone}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ایمیل</label>
            <div className="relative">
              <Mail size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0.75rem', color: '#9b9490' }} />
              <input name="contactEmail" value={form.contactEmail} onChange={handleChange}
                className="form-input" style={{ paddingRight: '2.25rem' }} placeholder="info@mystore.com" type="email" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">تلفن</label>
            <div className="relative">
              <Phone size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0.75rem', color: '#9b9490' }} />
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                className="form-input" style={{ paddingRight: '2.25rem' }} placeholder="021-12345678" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">آدرس</label>
          <div className="relative">
            <MapPin size={16} style={{ position: 'absolute', top: '0.875rem', right: '0.75rem', color: '#9b9490' }} />
            <textarea name="contactAddress" value={form.contactAddress} onChange={handleChange}
              className="form-input" style={{ paddingRight: '2.25rem', resize: 'vertical' }} rows={2}
              placeholder="تهران، خیابان ولیعصر، پلاک ۱۲" />
          </div>
        </div>
      </Section>

      {/* Social */}
      <Section title="شبکه‌های اجتماعی" icon={Instagram}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">📸 اینستاگرام</label>
            <input name="instagram" value={form.instagram} onChange={handleChange}
              className="form-input" placeholder="@mystore" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">✈️ تلگرام</label>
            <input name="telegram" value={form.telegram} onChange={handleChange}
              className="form-input" placeholder="@mystore" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">💬 واتساپ</label>
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
              className="form-input" placeholder="+989123456789" />
          </div>
        </div>
      </Section>

      {/* SEO */}
      <Section title="سئو و متا" icon={Globe}>
        <div>
          <label className="block text-sm font-medium mb-2">عنوان صفحه (Title Tag)</label>
          <input name="seoTitle" value={form.seoTitle} onChange={handleChange}
            className="form-input" placeholder="فروشگاه من — بهترین محصولات" />
          <p className="text-xs mt-1" style={{ color: form.seoTitle.length > 60 ? '#dc2626' : '#9b9490' }}>
            {form.seoTitle.length}/60 کاراکتر
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">توضیحات متا (Meta Description)</label>
          <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange}
            className="form-input" rows={3} placeholder="توضیح کوتاه درباره فروشگاه برای موتورهای جستجو..." style={{ resize: 'vertical' }} />
          <p className="text-xs mt-1" style={{ color: form.seoDescription.length > 160 ? '#dc2626' : '#9b9490' }}>
            {form.seoDescription.length}/160 کاراکتر
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">کلمات کلیدی</label>
          <input name="seoKeywords" value={form.seoKeywords} onChange={handleChange}
            className="form-input" placeholder="فروشگاه آنلاین، خرید اینترنتی، پوشاک" />
          <p className="text-xs mt-1" style={{ color: '#9b9490' }}>با کاما جدا کنید</p>
        </div>
      </Section>

      <button onClick={handleSave} disabled={saving}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          width: '100%', padding: '1rem', background: saving ? '#999' : '#0a0a0a',
          color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700',
          cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: '1rem',
        }}>
        <Save size={18} />
        {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </button>
    </div>
  )
}
