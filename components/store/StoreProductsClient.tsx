'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, Grid, List, ChevronLeft, Heart, ShoppingCart, Star, SlidersHorizontal, X } from 'lucide-react'
import { t, isRTL, Language } from '@/lib/i18n'

interface Props {
  store: any; products: any[]; categories: any[]
  total: number; page: number; pages: number
}

export default function StoreProductsClient({ store, products, categories, total, page, pages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Language>(store.language || 'fa')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [cart, setCart] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const rtl = isRTL(lang)
  const primary = store.primaryColor || '#0f0f0f'

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/store/${store.slug}/products?${params.toString()}`)
  }

  function getProductName(p: any) { return p.name[lang] || p.name.fa || p.name.en }

  function getFinalPrice(p: any) {
    if (p.discount?.isActive && p.discount?.value) {
      return p.discount.type === 'percentage'
        ? p.price * (1 - p.discount.value / 100)
        : p.price - p.discount.value
    }
    return p.price
  }

  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const currentSearch = searchParams.get('search') || ''

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} style={{ fontFamily: rtl ? 'Vazirmatn, sans-serif' : 'DM Sans, sans-serif', background: '#faf9f7', minHeight: '100vh' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link href={`/store/${store.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {store.logo
              ? <img src={store.logo} alt={store.name} className="h-8 w-auto" />
              : <span className="font-bold" style={{ color: primary }}>{store.name}</span>
            }
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'fa' ? 'en' : l === 'en' ? 'it' : 'fa')}
              className="text-xs px-3 py-1.5 rounded-lg border" style={{ background: 'white', borderColor: '#e8e5e0', cursor: 'pointer', fontFamily: 'inherit' }}>
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Page title + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{t(lang, 'products')}</h1>
            <p className="text-sm" style={{ color: '#9b9490' }}>{total.toLocaleString(rtl ? 'fa-IR' : 'en')} محصول</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [rtl ? 'right' : 'left']: '0.75rem', color: '#9b9490' }} />
              <input defaultValue={currentSearch}
                onKeyDown={e => e.key === 'Enter' && updateFilter('search', (e.target as HTMLInputElement).value)}
                className="form-input text-sm"
                style={{ [rtl ? 'paddingRight' : 'paddingLeft']: '2.25rem', width: '200px' }}
                placeholder={t(lang, 'search') + '...'} />
            </div>
            {/* Sort */}
            <select value={currentSort} onChange={e => updateFilter('sort', e.target.value)}
              className="form-input text-sm" style={{ width: 'auto' }}>
              <option value="newest">جدیدترین</option>
              <option value="price_asc">ارزان‌ترین</option>
              <option value="price_desc">گران‌ترین</option>
              <option value="popular">پرفروش‌ترین</option>
            </select>
            {/* View toggle */}
            <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
              <button onClick={() => setView('grid')}
                style={{ padding: '0.5rem 0.75rem', background: view === 'grid' ? '#0a0a0a' : 'white', color: view === 'grid' ? 'white' : '#9b9490', border: 'none', cursor: 'pointer' }}>
                <Grid size={16} />
              </button>
              <button onClick={() => setView('list')}
                style={{ padding: '0.5rem 0.75rem', background: view === 'list' ? '#0a0a0a' : 'white', color: view === 'list' ? 'white' : '#9b9490', border: 'none', cursor: 'pointer' }}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border p-5 sticky top-24" style={{ borderColor: '#e8e5e0' }}>
              <h3 className="font-semibold mb-4">{t(lang, 'categories')}</h3>
              <div className="space-y-1">
                <button onClick={() => updateFilter('category', '')}
                  style={{ display: 'block', width: '100%', textAlign: rtl ? 'right' : 'left', padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: !currentCategory ? '600' : '400', background: !currentCategory ? '#f5f5f5' : 'transparent', color: !currentCategory ? '#0a0a0a' : '#9b9490' }}>
                  همه محصولات
                </button>
                {categories.map(cat => (
                  <button key={cat._id} onClick={() => updateFilter('category', cat._id)}
                    style={{ display: 'block', width: '100%', textAlign: rtl ? 'right' : 'left', padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: currentCategory === cat._id ? '600' : '400', background: currentCategory === cat._id ? '#f5f5f5' : 'transparent', color: currentCategory === cat._id ? '#0a0a0a' : '#9b9490' }}>
                    {cat.name[lang] || cat.name.fa}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: '#e8e5e0' }}>
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-medium mb-2">{t(lang, 'noResults')}</h3>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => {
                  const finalPrice = getFinalPrice(product)
                  const discounted = product.discount?.isActive && product.discount?.value > 0
                  const name = getProductName(product)
                  return (
                    <div key={product._id} className="product-card group bg-white rounded-2xl overflow-hidden border" style={{ borderColor: '#e8e5e0' }}>
                      <div className="relative img-zoom" style={{ paddingBottom: '120%' }}>
                        <div className="absolute inset-0">
                          {product.images?.[0]
                            ? <img src={product.images[0]} alt={name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: '#f5f5f5' }}>🛍️</div>
                          }
                        </div>
                        {discounted && (
                          <div className="absolute top-2 right-2">
                            <span className="discount-badge">{product.discount.value}{product.discount.type === 'percentage' ? '%' : 'ت'} OFF</span>
                          </div>
                        )}
                        <button onClick={() => setWishlist(prev => prev.includes(product._id) ? prev.filter(i => i !== product._id) : [...prev, product._id])}
                          className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <Heart size={14} fill={wishlist.includes(product._id) ? '#ef4444' : 'none'} color={wishlist.includes(product._id) ? '#ef4444' : '#9b9490'} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform">
                          <button onClick={() => setCart(prev => [...prev, product._id])}
                            disabled={product.stock === 0}
                            className="w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                            style={{ background: primary, color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: product.stock === 0 ? 0.5 : 1 }}>
                            <ShoppingCart size={14} />
                            {product.stock === 0 ? t(lang, 'outOfStock') : t(lang, 'addToCart')}
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <Link href={`/store/${store.slug}/product/${product.slug}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h3 className="font-semibold text-sm mb-2 leading-snug line-clamp-2">{name}</h3>
                        </Link>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: discounted ? '#dc2626' : '#0a0a0a' }}>
                            {finalPrice.toLocaleString(rtl ? 'fa-IR' : 'en')}
                            <span className="text-xs font-normal mr-0.5">ت</span>
                          </span>
                          {discounted && (
                            <span className="text-xs line-through" style={{ color: '#9b9490' }}>
                              {product.price.toLocaleString(rtl ? 'fa-IR' : 'en')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => {
                  const finalPrice = getFinalPrice(product)
                  const discounted = product.discount?.isActive && product.discount?.value > 0
                  const name = getProductName(product)
                  return (
                    <div key={product._id} className="bg-white rounded-2xl border overflow-hidden flex" style={{ borderColor: '#e8e5e0' }}>
                      <div className="w-36 h-36 flex-shrink-0 img-zoom">
                        {product.images?.[0]
                          ? <img src={product.images[0]} alt={name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: '#f5f5f5' }}>🛍️</div>
                        }
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">{name}</h3>
                          {product.shortDescription?.[lang] && (
                            <p className="text-sm leading-relaxed" style={{ color: '#9b9490' }}>{product.shortDescription[lang]}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: discounted ? '#dc2626' : '#0a0a0a' }}>
                              {finalPrice.toLocaleString(rtl ? 'fa-IR' : 'en')} ت
                            </span>
                            {discounted && <span className="text-sm line-through" style={{ color: '#9b9490' }}>{product.price.toLocaleString(rtl ? 'fa-IR' : 'en')} ت</span>}
                          </div>
                          <button onClick={() => setCart(prev => [...prev, product._id])}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: '600' }}>
                            <ShoppingCart size={16} />
                            {t(lang, 'addToCart')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => updateFilter('page', String(i + 1))}
                    style={{ width: '40px', height: '40px', padding: '0.5rem 0.875rem', borderRadius: '10px', border: '1.5px solid', borderColor: page === i + 1 ? '#0a0a0a' : '#e8e5e0', background: page === i + 1 ? '#0a0a0a' : 'white', color: page === i + 1 ? 'white' : '#9b9490', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {(i + 1).toLocaleString(rtl ? 'fa-IR' : 'en')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
