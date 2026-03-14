'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, Heart, Menu, X, ChevronLeft, ChevronRight, Star, Globe, ShoppingCart } from 'lucide-react'
import { t, isRTL, Language } from '@/lib/i18n'

interface Store {
  _id: string; name: string; slug: string; logo?: string; primaryColor: string
  secondaryColor: string; language: string; banners: any[]; description?: string
}
interface Product {
  _id: string; name: { fa: string; en: string; it: string }; images: string[]
  price: number; comparePrice?: number; discount?: any; rating: { average: number; count: number }
  isFeatured: boolean; stock: number; categoryId?: { name: { fa: string; en: string; it: string } }
}
interface Category {
  _id: string; name: { fa: string; en: string; it: string }; image?: string; slug: string
}

interface Props { store: Store; featuredProducts: Product[]; newProducts: Product[]; categories: Category[] }

export default function StoreHomepage({ store, featuredProducts, newProducts, categories }: Props) {
  const [lang, setLang] = useState<Language>(store.language as Language || 'fa')
  const [cart, setCart] = useState<{id: string; qty: number}[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const rtl = isRTL(lang)

  const primary = store.primaryColor || '#0f0f0f'
  const activeBanners = store.banners?.filter(b => b.isActive) || []

  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(() => setBannerIndex(i => (i + 1) % activeBanners.length), 5000)
      return () => clearInterval(interval)
    }
  }, [activeBanners.length])

  function addToCart(productId: string) {
    setCart(prev => {
      const existing = prev.find(i => i.id === productId)
      if (existing) return prev.map(i => i.id === productId ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: productId, qty: 1 }]
    })
    setCartOpen(true)
    setTimeout(() => setCartOpen(false), 2000)
  }

  function toggleWishlist(id: string) {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function getProductName(p: Product) { return p.name[lang] || p.name.fa || p.name.en }
  function getFinalPrice(p: Product) {
    if (p.discount?.isActive && p.discount?.value) {
      if (p.discount.type === 'percentage') return p.price * (1 - p.discount.value / 100)
      return p.price - p.discount.value
    }
    return p.price
  }
  function hasDiscount(p: Product) { return p.discount?.isActive && p.discount?.value > 0 }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}
      style={{ fontFamily: rtl ? 'Vazirmatn, sans-serif' : 'DM Sans, sans-serif', background: '#faf9f7', minHeight: '100vh', '--color-primary': primary } as any}>

      {/* Nav */}
      <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/store/${store.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {store.logo ? (
              <img src={store.logo} alt={store.name} className="h-9 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: primary }}>
                  <ShoppingBag size={16} color="white" />
                </div>
                <span className="font-bold text-lg" style={{ color: primary }}>{store.name}</span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/store/${store.slug}`} style={{ textDecoration: 'none', color: '#0a0a0a', fontSize: '0.875rem', fontWeight: '500' }}>{t(lang, 'home')}</Link>
            <Link href={`/store/${store.slug}/products`} style={{ textDecoration: 'none', color: '#9b9490', fontSize: '0.875rem' }}>{t(lang, 'products')}</Link>
            {categories.slice(0, 3).map(cat => (
              <Link key={cat._id} href={`/store/${store.slug}/category/${cat.slug}`}
                style={{ textDecoration: 'none', color: '#9b9490', fontSize: '0.875rem' }}>
                {cat.name[lang] || cat.name.fa}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Search size={18} />
            </button>

            {/* Language switcher */}
            <div className="relative group">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Globe size={18} />
              </button>
              <div className="absolute top-full mt-1 bg-white rounded-xl shadow-lg border overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                style={{ borderColor: '#e8e5e0', minWidth: '120px', [rtl ? 'right' : 'left']: 0 }}>
                {[{ code: 'fa', label: 'فارسی', flag: '🇮🇷' }, { code: 'en', label: 'English', flag: '🇺🇸' }, { code: 'it', label: 'Italiano', flag: '🇮🇹' }].map(l => (
                  <button key={l.code} onClick={() => setLang(l.code as Language)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    style={{ background: lang === l.code ? '#f5f5f5' : 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: rtl ? 'right' : 'left' }}>
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart */}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                  style={{ background: primary, fontSize: '0.65rem' }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-5 py-4 space-y-2 bg-white" style={{ borderColor: '#e8e5e0' }}>
            {[{ href: `/store/${store.slug}`, label: t(lang, 'home') }, { href: `/store/${store.slug}/products`, label: t(lang, 'products') }].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '0.75rem', borderRadius: '8px', textDecoration: 'none', color: '#0a0a0a', fontWeight: '500', fontSize: '0.9rem' }}>
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t px-5 py-4 bg-white" style={{ borderColor: '#e8e5e0' }}>
            <div className="max-w-2xl mx-auto relative">
              <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [rtl ? 'right' : 'left']: '1rem', color: '#9b9490' }} />
              <input autoFocus className="form-input" style={{ [rtl ? 'paddingRight' : 'paddingLeft']: '2.75rem' }}
                placeholder={t(lang, 'search') + '...'} />
            </div>
          </div>
        )}
      </header>

      {/* Hero Banner */}
      {activeBanners.length > 0 ? (
        <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: '400px' }}>
          {activeBanners.map((banner, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === bannerIndex ? 1 : 0, zIndex: i === bannerIndex ? 1 : 0 }}>
              <img src={banner.image} alt={banner.title || ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)' }}>
                <div className="max-w-7xl mx-auto px-8 w-full">
                  <div className={rtl ? 'max-w-lg' : 'max-w-lg ml-auto mr-0'}>
                    {banner.title && (
                      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-up"
                        style={{ fontFamily: 'Playfair Display, serif', lineHeight: 1.2 }}>
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p className="text-white/80 text-lg mb-8 animate-fade-up-delay-1">{banner.subtitle}</p>
                    )}
                    {banner.link && (
                      <Link href={banner.link}
                        className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm uppercase tracking-wider animate-fade-up-delay-2"
                        style={{ background: 'white', color: primary, textDecoration: 'none', borderRadius: '2px' }}>
                        {t(lang, 'products')}
                        {rtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {activeBanners.map((_, i) => (
                <button key={i} onClick={() => setBannerIndex(i)}
                  className="rounded-full transition-all"
                  style={{ width: i === bannerIndex ? '24px' : '8px', height: '8px', background: i === bannerIndex ? 'white' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer' }} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Default hero if no banners */
        <section className="relative flex items-center justify-center overflow-hidden" style={{ height: '70vh', background: primary }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="text-center px-6 relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              {store.name}
            </h1>
            {store.description && <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">{store.description}</p>}
            <Link href={`/store/${store.slug}/products`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: 'white', color: primary, textDecoration: 'none', fontWeight: '700', borderRadius: '2px', letterSpacing: '0.05em' }}>
              {t(lang, 'products')}
              {rtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Link>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t(lang, 'categories')}
              </h2>
              <Link href={`/store/${store.slug}/products`}
                className="text-sm font-medium flex items-center gap-1"
                style={{ color: primary, textDecoration: 'none' }}>
                {t(lang, 'products')}
                {rtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link key={cat._id} href={`/store/${store.slug}/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border text-center transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{ borderColor: '#e8e5e0', textDecoration: 'none' }}>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center img-zoom">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name[lang] || cat.name.fa} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-black transition-colors">
                    {cat.name[lang] || cat.name.fa}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-5" style={{ background: '#f0efec' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9a96e' }}>{t(lang, 'featured')}</span>
                <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {t(lang, 'products')}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <ProductCard key={product._id} product={product} lang={lang} primary={primary}
                  storeSlug={store.slug} onAddToCart={addToCart} onWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(product._id)} delay={idx * 100}
                  getFinalPrice={getFinalPrice} hasDiscount={hasDiscount} getProductName={getProductName} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-16 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9a96e' }}>{t(lang, 'new')}</span>
                <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {t(lang, 'products')}
                </h2>
              </div>
              <Link href={`/store/${store.slug}/products`}
                style={{ fontSize: '0.875rem', fontWeight: '600', color: primary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {t(lang, 'continueShopping')}
                {rtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {newProducts.map((product, idx) => (
                <ProductCard key={product._id} product={product} lang={lang} primary={primary}
                  storeSlug={store.slug} onAddToCart={addToCart} onWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(product._id)} delay={idx * 50}
                  getFinalPrice={getFinalPrice} hasDiscount={hasDiscount} getProductName={getProductName}
                  compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-5 border-t" style={{ borderColor: '#e8e5e0', background: primary }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            {store.logo ? (
              <img src={store.logo} alt={store.name} className="h-8 w-auto" style={{ filter: 'brightness(10)' }} />
            ) : (
              <span className="font-bold text-lg text-white">{store.name}</span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {store.name} — Powered by NexStore
          </p>
          <div className="flex gap-2">
            {['fa', 'en', 'it'].map(l => (
              <button key={l} onClick={() => setLang(l as Language)}
                style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: lang === l ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({ product, lang, primary, storeSlug, onAddToCart, onWishlist, isWishlisted, delay, getFinalPrice, hasDiscount, getProductName, compact = false }: any) {
  const finalPrice = getFinalPrice(product)
  const discounted = hasDiscount(product)
  const name = getProductName(product)

  return (
    <div className="product-card group bg-white rounded-2xl overflow-hidden border relative"
      style={{ borderColor: '#e8e5e0', animationDelay: `${delay}ms` }}>
      {/* Image */}
      <div className="relative img-zoom" style={{ paddingBottom: compact ? '100%' : '120%' }}>
        <div className="absolute inset-0">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#f5f5f5' }}>
              <ShoppingBag size={32} style={{ color: '#e0e0e0' }} />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {discounted && (
            <span className="discount-badge">
              {product.discount.type === 'percentage' ? `${product.discount.value}%` : '🔥'} OFF
            </span>
          )}
          {product.stock === 0 && (
            <span className="tag tag-error" style={{ fontSize: '0.65rem' }}>ناموجود</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={() => onWishlist(product._id)}
          className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          style={{ background: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Heart size={15} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#9b9490'} />
        </button>

        {/* Add to cart overlay */}
        {!compact && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform">
            <button onClick={() => onAddToCart(product._id)}
              disabled={product.stock === 0}
              className="w-full py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              style={{ background: primary, color: 'white', border: 'none', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: product.stock === 0 ? 0.5 : 1 }}>
              <ShoppingCart size={16} />
              {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1 truncate leading-snug">{name}</h3>

        {/* Rating */}
        {product.rating?.count > 0 && !compact && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill={i < Math.round(product.rating.average) ? '#f59e0b' : 'none'} color="#f59e0b" />
            ))}
            <span className="text-xs" style={{ color: '#9b9490' }}>({product.rating.count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold" style={{ color: discounted ? '#dc2626' : '#0a0a0a', fontSize: compact ? '0.85rem' : '1rem' }}>
            {finalPrice.toLocaleString('fa-IR')}
            <span className="text-xs font-normal mr-0.5">ت</span>
          </span>
          {discounted && (
            <span className="text-xs line-through" style={{ color: '#9b9490' }}>
              {product.price.toLocaleString('fa-IR')}
            </span>
          )}
        </div>

        {compact && (
          <button onClick={() => onAddToCart(product._id)} disabled={product.stock === 0}
            className="mt-2 w-full py-2 text-xs font-bold rounded-lg"
            style={{ background: primary, color: 'white', border: 'none', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: product.stock === 0 ? 0.5 : 1 }}>
            +
          </button>
        )}
      </div>
    </div>
  )
}
