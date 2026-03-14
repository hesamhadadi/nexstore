'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  _id: string
  name: { fa: string; en: string }
  images: string[]
  price: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  discount?: { value: number; isActive: boolean }
  categoryId?: { name: { fa: string } }
  soldCount: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/store/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch { toast.error('خطا در دریافت محصولات') }
    finally { setLoading(false) }
  }

  async function deleteProduct(id: string) {
    try {
      const res = await fetch(`/api/store/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('محصول حذف شد')
      fetchProducts()
    } catch { toast.error('خطا در حذف') }
    finally { setDeleteConfirm(null) }
  }

  async function toggleProduct(id: string) {
    try {
      await fetch(`/api/store/products/${id}/toggle`, { method: 'PUT' })
      fetchProducts()
    } catch { toast.error('خطا') }
  }

  const filtered = products.filter(p =>
    p.name.fa.includes(search) || p.name.en.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">محصولات</h1>
          <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>{products.length} محصول</p>
        </div>
        <Link href="/dashboard/products/new"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#0a0a0a', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem' }}>
          <Plus size={18} />
          محصول جدید
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#9b9490', position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="form-input" style={{ paddingRight: '2.75rem' }} placeholder="جستجو در محصولات..." />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border" style={{ borderColor: '#e8e5e0' }}>
              <div className="skeleton h-48" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: '#e8e5e0' }}>
          <Package size={48} style={{ color: '#e8e5e0', margin: '0 auto 1rem' }} />
          <h3 className="font-medium mb-2">محصولی یافت نشد</h3>
          <p className="text-sm mb-6" style={{ color: '#9b9490' }}>اولین محصول خود را اضافه کنید</p>
          <Link href="/dashboard/products/new"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#0a0a0a', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem' }}>
            <Plus size={16} />
            افزودن محصول
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl overflow-hidden border group transition-all hover:shadow-md" style={{ borderColor: '#e8e5e0' }}>
              {/* Image */}
              <div className="relative h-48 bg-gray-50 img-zoom">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name.fa}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} style={{ color: '#e8e5e0' }} />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {!product.isActive && (
                    <span className="tag tag-error" style={{ fontSize: '0.65rem' }}>غیرفعال</span>
                  )}
                  {product.discount?.isActive && (
                    <span className="discount-badge">{product.discount.value}% تخفیف</span>
                  )}
                </div>
                {product.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <Star size={16} fill="#c9a96e" color="#c9a96e" />
                  </div>
                )}
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Link href={`/dashboard/products/${product._id}/edit`}
                    style={{ background: 'white', borderRadius: '8px', padding: '0.5rem', display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#0a0a0a' }}>
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => toggleProduct(product._id)}
                    style={{ background: 'white', borderRadius: '8px', padding: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {product.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => setDeleteConfirm(product._id)}
                    style={{ background: 'white', borderRadius: '8px', padding: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#dc2626' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">{product.name.fa}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: '#c9a96e' }}>
                    {product.price.toLocaleString('fa-IR')} ت
                  </span>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#9b9490' }}>
                    <span>موجودی: {product.stock}</span>
                    <span>فروش: {product.soldCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <Trash2 size={40} style={{ color: '#dc2626', margin: '0 auto 1rem' }} />
            <h3 className="text-lg font-bold mb-2">حذف محصول</h3>
            <p className="text-sm mb-6" style={{ color: '#9b9490' }}>آیا مطمئنی؟ این عمل قابل بازگشت نیست.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1.5px solid #e8e5e0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                انصراف
              </button>
              <button onClick={() => deleteProduct(deleteConfirm)}
                style={{ flex: 1, padding: '0.75rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Package({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}>
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}
