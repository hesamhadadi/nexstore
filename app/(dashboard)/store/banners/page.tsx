'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, Eye, EyeOff, GripVertical, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface Banner {
  image: string; title?: string; subtitle?: string; link?: string; isActive: boolean
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/store/settings').then(r => r.json()).then(d => {
      setBanners(d.store?.banners || [])
      setLoading(false)
    })
  }, [])

  function addBanner() {
    setBanners(prev => [...prev, { image: '', title: '', subtitle: '', link: '', isActive: true }])
  }

  function removeBanner(i: number) {
    setBanners(prev => prev.filter((_, j) => j !== i))
  }

  function updateBanner(i: number, field: string, value: any) {
    setBanners(prev => prev.map((b, j) => j === i ? { ...b, [field]: value } : b))
  }

  async function uploadBannerImage(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return
    setUploading(i)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: reader.result, folder: 'banners' }),
        })
        const data = await res.json()
        if (data.url) updateBanner(i, 'image', data.url)
        toast.success('تصویر آپلود شد')
      }
      reader.readAsDataURL(e.target.files[0])
    } catch { toast.error('خطا در آپلود') }
    finally { setUploading(null) }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/store/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners }),
      })
      if (!res.ok) throw new Error()
      toast.success('بنرها ذخیره شدند')
    } catch { toast.error('خطا در ذخیره') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a' }} /></div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">بنرهای اسلایدر</h1>
          <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>تصاویر اسلایدر صفحه اصلی فروشگاه</p>
        </div>
        <button onClick={addBanner}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#0a0a0a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', fontFamily: 'Vazirmatn, sans-serif' }}>
          <Plus size={18} />
          بنر جدید
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: '#e8e5e0' }}>
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="font-medium mb-2">هنوز بنری ندارید</h3>
          <p className="text-sm mb-6" style={{ color: '#9b9490' }}>بنرهای جذاب برای صفحه اصلی فروشگاهتان اضافه کنید</p>
          <button onClick={addBanner}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#0a0a0a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
            <Plus size={16} />
            افزودن بنر
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {banners.map((banner, i) => (
            <div key={i} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
              {/* Image preview */}
              <div className="relative h-48 bg-gray-100 group">
                {banner.image ? (
                  <img src={banner.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color: '#9b9490' }}>
                    <Upload size={32} />
                    <span className="text-sm">تصویر بنر را آپلود کنید</span>
                  </div>
                )}
                {/* Upload overlay */}
                <label className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  style={{ background: banner.image ? 'rgba(0,0,0,0)' : 'transparent', transition: 'background 0.2s' }}
                  onMouseEnter={e => banner.image && ((e.target as HTMLElement).style.background = 'rgba(0,0,0,0.3)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.background = banner.image ? 'rgba(0,0,0,0)' : 'transparent')}>
                  <div className="px-4 py-2 rounded-lg text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.6)' }}>
                    {uploading === i ? 'در حال آپلود...' : 'تغییر تصویر'}
                  </div>
                  <input type="file" accept="image/*" onChange={e => uploadBannerImage(i, e)} className="hidden" />
                </label>
                {/* Active toggle */}
                <div className="absolute top-3 left-3">
                  <button onClick={() => updateBanner(i, 'isActive', !banner.isActive)}
                    style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}>
                    {banner.isActive ? <Eye size={16} color="#059669" /> : <EyeOff size={16} color="#9b9490" />}
                  </button>
                </div>
                {/* Order badge */}
                <div className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                  {i + 1}
                </div>
              </div>

              {/* Fields */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">عنوان بنر</label>
                    <input value={banner.title || ''} onChange={e => updateBanner(i, 'title', e.target.value)}
                      className="form-input" placeholder="حراج بزرگ پاییزه" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">زیرعنوان</label>
                    <input value={banner.subtitle || ''} onChange={e => updateBanner(i, 'subtitle', e.target.value)}
                      className="form-input" placeholder="تا ۵۰٪ تخفیف روی همه محصولات" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1.5">لینک</label>
                    <input value={banner.link || ''} onChange={e => updateBanner(i, 'link', e.target.value)}
                      className="form-input" placeholder="/products?sale=true" />
                  </div>
                  <button onClick={() => removeBanner(i)}
                    style={{ padding: '0.75rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '1.5rem' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {banners.length > 0 && (
        <button onClick={handleSave} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', background: saving ? '#999' : '#0a0a0a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: '1rem' }}>
          <Save size={18} />
          {saving ? 'در حال ذخیره...' : 'ذخیره بنرها'}
        </button>
      )}
    </div>
  )
}
