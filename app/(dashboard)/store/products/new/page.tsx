'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload, X, Save, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Category { _id: string; name: { fa: string } }

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    nameFa: '', nameEn: '', nameIt: '',
    descFa: '', descEn: '', descIt: '',
    shortDescFa: '', shortDescEn: '', shortDescIt: '',
    price: '', comparePrice: '', stock: '',
    categoryId: '', sku: '', weight: '',
    discountType: 'percentage', discountValue: '', discountActive: false,
    discountStart: '', discountEnd: '',
    isFeatured: false, isActive: true,
    tags: '',
  })
  const [images, setImages] = useState<string[]>([])
  const [colors, setColors] = useState<{ nameFa: string; nameEn: string; hex: string; stock: string }[]>([])
  const [variants, setVariants] = useState<{ nameFa: string; nameEn: string; value: string; price: string; stock: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'description' | 'pricing' | 'variants' | 'seo'>('basic')

  useEffect(() => {
    fetch('/api/store/categories').then(r => r.json()).then(d => setCategories(d.categories || []))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return
    setUploading(true)
    try {
      for (const file of Array.from(e.target.files)) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: reader.result, folder: 'products' }),
          })
          const data = await res.json()
          if (data.url) setImages(prev => [...prev, data.url])
        }
        reader.readAsDataURL(file)
      }
      toast.success('تصاویر آپلود شدند')
    } catch { toast.error('خطا در آپلود') }
    finally { setUploading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nameFa || !form.price || !form.categoryId) {
      toast.error('فیلدهای الزامی را پر کنید')
      return
    }
    setLoading(true)
    try {
      const body = {
        name: { fa: form.nameFa, en: form.nameEn || form.nameFa, it: form.nameIt || form.nameFa },
        description: { fa: form.descFa, en: form.descEn || form.descFa, it: form.descIt || form.descFa },
        shortDescription: { fa: form.shortDescFa, en: form.shortDescEn, it: form.shortDescIt },
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        stock: Number(form.stock) || 0,
        categoryId: form.categoryId,
        sku: form.sku,
        weight: form.weight ? Number(form.weight) : undefined,
        images,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        discount: form.discountValue ? {
          type: form.discountType,
          value: Number(form.discountValue),
          isActive: form.discountActive,
          startDate: form.discountStart || undefined,
          endDate: form.discountEnd || undefined,
        } : undefined,
        colors: colors.map(c => ({
          name: { fa: c.nameFa, en: c.nameEn || c.nameFa, it: c.nameFa },
          hex: c.hex,
          stock: Number(c.stock) || 0,
        })),
        variants: variants.map(v => ({
          name: { fa: v.nameFa, en: v.nameEn || v.nameFa, it: v.nameFa },
          value: v.value,
          price: v.price ? Number(v.price) : undefined,
          stock: Number(v.stock) || 0,
        })),
      }
      const res = await fetch('/api/store/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('محصول ایجاد شد')
      router.push('/dashboard/products')
    } catch (err: any) {
      toast.error(err.message || 'خطا در ایجاد محصول')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'اطلاعات اصلی' },
    { id: 'description', label: 'توضیحات' },
    { id: 'pricing', label: 'قیمت و تخفیف' },
    { id: 'variants', label: 'رنگ و مدل' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#9b9490', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowRight size={16} />
          برگشت
        </Link>
        <div>
          <h1 className="text-2xl font-bold">محصول جدید</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white border" style={{ borderColor: '#e8e5e0' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontFamily: 'Vazirmatn, sans-serif', fontSize: '0.8rem', fontWeight: '500', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#0a0a0a' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#9b9490',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-2xl p-6 border space-y-5" style={{ borderColor: '#e8e5e0' }}>
            <h2 className="font-semibold text-lg">اطلاعات پایه</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام فارسی *</label>
                <input name="nameFa" value={form.nameFa} onChange={handleChange} className="form-input" placeholder="نام محصول" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام انگلیسی</label>
                <input name="nameEn" value={form.nameEn} onChange={handleChange} className="form-input" placeholder="Product Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام ایتالیایی</label>
                <input name="nameIt" value={form.nameIt} onChange={handleChange} className="form-input" placeholder="Nome Prodotto" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">دسته‌بندی *</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className="form-input" required>
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name.fa}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">کد SKU</label>
                <input name="sku" value={form.sku} onChange={handleChange} className="form-input" placeholder="SKU-001" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer" style={{ borderColor: '#e8e5e0' }}
                onClick={() => setForm(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}>
                <div className={`w-10 h-6 rounded-full transition-all relative ${form.isFeatured ? 'bg-black' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${form.isFeatured ? 'right-1' : 'left-1'}`} />
                </div>
                <span className="text-sm font-medium">محصول ویژه</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer" style={{ borderColor: '#e8e5e0' }}
                onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}>
                <div className={`w-10 h-6 rounded-full transition-all relative ${form.isActive ? 'bg-black' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${form.isActive ? 'right-1' : 'left-1'}`} />
                </div>
                <span className="text-sm font-medium">نمایش محصول</span>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-3">تصاویر محصول</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border" style={{ borderColor: '#e8e5e0' }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: '#dc2626', border: 'none', cursor: 'pointer', color: 'white' }}>
                      <X size={12} />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5 rounded" style={{ background: '#0a0a0a', color: 'white' }}>اصلی</span>}
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-black"
                  style={{ borderColor: '#e8e5e0' }}>
                  <Upload size={22} style={{ color: '#9b9490', marginBottom: '0.5rem' }} />
                  <span className="text-xs" style={{ color: '#9b9490' }}>{uploading ? 'در حال آپلود...' : 'آپلود تصویر'}</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">تگ‌ها</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="form-input" placeholder="تگ1, تگ2, تگ3" />
              <p className="text-xs mt-1" style={{ color: '#9b9490' }}>با کاما جدا کنید</p>
            </div>
          </div>
        )}

        {/* Description */}
        {activeTab === 'description' && (
          <div className="bg-white rounded-2xl p-6 border space-y-5" style={{ borderColor: '#e8e5e0' }}>
            <h2 className="font-semibold text-lg">توضیحات</h2>
            <div>
              <label className="block text-sm font-medium mb-2">توضیح کوتاه فارسی</label>
              <input name="shortDescFa" value={form.shortDescFa} onChange={handleChange} className="form-input" placeholder="توضیح مختصر..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">توضیحات کامل فارسی *</label>
              <textarea name="descFa" value={form.descFa} onChange={handleChange} className="form-input" rows={5} placeholder="توضیحات کامل محصول..." required style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">توضیح کوتاه انگلیسی</label>
              <input name="shortDescEn" value={form.shortDescEn} onChange={handleChange} className="form-input" placeholder="Short description..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">توضیحات کامل انگلیسی</label>
              <textarea name="descEn" value={form.descEn} onChange={handleChange} className="form-input" rows={4} placeholder="Full description..." style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">توضیحات ایتالیایی</label>
              <textarea name="descIt" value={form.descIt} onChange={handleChange} className="form-input" rows={4} placeholder="Descrizione completa..." style={{ resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* Pricing */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-2xl p-6 border space-y-5" style={{ borderColor: '#e8e5e0' }}>
            <h2 className="font-semibold text-lg">قیمت‌گذاری</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">قیمت (تومان) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} className="form-input" placeholder="۱۰۰۰۰۰" required min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">قیمت قبل از تخفیف</label>
                <input name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} className="form-input" placeholder="۱۵۰۰۰۰" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">موجودی انبار</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} className="form-input" placeholder="۱۰۰" min={0} />
              </div>
            </div>

            <div className="border-t pt-5" style={{ borderColor: '#e8e5e0' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">تخفیف زمان‌دار</h3>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setForm(prev => ({ ...prev, discountActive: !prev.discountActive }))}>
                  <div className={`w-10 h-6 rounded-full transition-all relative ${form.discountActive ? 'bg-black' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${form.discountActive ? 'right-1' : 'left-1'}`} />
                  </div>
                  <span className="text-sm">{form.discountActive ? 'فعال' : 'غیرفعال'}</span>
                </div>
              </div>

              {form.discountActive && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">نوع تخفیف</label>
                      <select name="discountType" value={form.discountType} onChange={handleChange} className="form-input">
                        <option value="percentage">درصدی</option>
                        <option value="fixed">مبلغ ثابت</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">مقدار تخفیف</label>
                      <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} className="form-input" placeholder={form.discountType === 'percentage' ? '۲۰' : '۱۰۰۰۰'} min={0} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">تاریخ شروع</label>
                      <input name="discountStart" type="datetime-local" value={form.discountStart} onChange={handleChange} className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">تاریخ پایان</label>
                      <input name="discountEnd" type="datetime-local" value={form.discountEnd} onChange={handleChange} className="form-input" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Variants */}
        {activeTab === 'variants' && (
          <div className="space-y-5">
            {/* Colors */}
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: '#e8e5e0' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">رنگ‌ها</h2>
                <button type="button" onClick={() => setColors(prev => [...prev, { nameFa: '', nameEn: '', hex: '#000000', stock: '' }])}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: '0.8rem' }}>
                  <Plus size={14} />
                  افزودن رنگ
                </button>
              </div>
              <div className="space-y-3">
                {colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8f8f8' }}>
                    <input type="color" value={color.hex}
                      onChange={e => setColors(prev => prev.map((c, j) => j === i ? { ...c, hex: e.target.value } : c))}
                      className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                    <input value={color.nameFa}
                      onChange={e => setColors(prev => prev.map((c, j) => j === i ? { ...c, nameFa: e.target.value } : c))}
                      className="form-input" placeholder="نام رنگ (فارسی)" style={{ flex: 2 }} />
                    <input value={color.nameEn}
                      onChange={e => setColors(prev => prev.map((c, j) => j === i ? { ...c, nameEn: e.target.value } : c))}
                      className="form-input" placeholder="Color name" style={{ flex: 2 }} />
                    <input type="number" value={color.stock}
                      onChange={e => setColors(prev => prev.map((c, j) => j === i ? { ...c, stock: e.target.value } : c))}
                      className="form-input" placeholder="موجودی" style={{ flex: 1 }} />
                    <button type="button" onClick={() => setColors(prev => prev.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0.25rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {colors.length === 0 && <p className="text-sm text-center py-4" style={{ color: '#9b9490' }}>رنگی اضافه نشده</p>}
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: '#e8e5e0' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">مدل‌ها / سایزها</h2>
                <button type="button" onClick={() => setVariants(prev => [...prev, { nameFa: '', nameEn: '', value: '', price: '', stock: '' }])}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: '0.8rem' }}>
                  <Plus size={14} />
                  افزودن مدل
                </button>
              </div>
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8f8f8' }}>
                    <input value={v.nameFa}
                      onChange={e => setVariants(prev => prev.map((vr, j) => j === i ? { ...vr, nameFa: e.target.value } : vr))}
                      className="form-input" placeholder="نوع (مثلاً: سایز)" style={{ flex: 2 }} />
                    <input value={v.value}
                      onChange={e => setVariants(prev => prev.map((vr, j) => j === i ? { ...vr, value: e.target.value } : vr))}
                      className="form-input" placeholder="مقدار (مثلاً: XL)" style={{ flex: 1 }} />
                    <input type="number" value={v.price}
                      onChange={e => setVariants(prev => prev.map((vr, j) => j === i ? { ...vr, price: e.target.value } : vr))}
                      className="form-input" placeholder="قیمت اضافه" style={{ flex: 1 }} />
                    <input type="number" value={v.stock}
                      onChange={e => setVariants(prev => prev.map((vr, j) => j === i ? { ...vr, stock: e.target.value } : vr))}
                      className="form-input" placeholder="موجودی" style={{ flex: 1 }} />
                    <button type="button" onClick={() => setVariants(prev => prev.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0.25rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {variants.length === 0 && <p className="text-sm text-center py-4" style={{ color: '#9b9490' }}>مدلی اضافه نشده</p>}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 sticky bottom-4">
          <Link href="/dashboard/products"
            style={{ flex: 1, padding: '0.875rem', background: 'white', border: '1.5px solid #e8e5e0', borderRadius: '10px', textDecoration: 'none', color: '#0a0a0a', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Vazirmatn, sans-serif' }}>
            انصراف
          </Link>
          <button type="submit" disabled={loading}
            style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', background: loading ? '#999' : '#0a0a0a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Vazirmatn, sans-serif', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <Save size={18} />
            {loading ? 'در حال ذخیره...' : 'ذخیره محصول'}
          </button>
        </div>
      </form>
    </div>
  )
}
