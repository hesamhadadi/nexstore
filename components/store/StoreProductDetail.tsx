'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight, Check, Minus, Plus, ArrowRight } from 'lucide-react'
import { t, isRTL, Language } from '@/lib/i18n'

interface Props { store: any; product: any; related: any[] }

export default function StoreProductDetail({ store, product, related }: Props) {
  const [lang, setLang] = useState<Language>(store.language || 'fa')
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const rtl = isRTL(lang)
  const primary = store.primaryColor || '#0f0f0f'

  const name = product.name[lang] || product.name.fa || product.name.en
  const desc = product.description[lang] || product.description.fa
  const shortDesc = product.shortDescription?.[lang] || product.shortDescription?.fa

  function getFinalPrice() {
    let price = product.price
    if (selectedVariant !== null && product.variants?.[selectedVariant]?.price) {
      price += product.variants[selectedVariant].price
    }
    if (product.discount?.isActive && product.discount?.value) {
      price = product.discount.type === 'percentage'
        ? price * (1 - product.discount.value / 100)
        : price - product.discount.value
    }
    return price
  }

  function handleAddToCart() {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const finalPrice = getFinalPrice()
  const hasDiscount = product.discount?.isActive && product.discount?.value > 0
  const inStock = product.stock > 0

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} style={{ fontFamily: rtl ? 'Vazirmatn, sans-serif' : 'DM Sans, sans-serif', background: '#faf9f7', minHeight: '100vh' }}>
      {/* Navbar */}
      <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href={`/store/${store.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {store.logo
              ? <img src={store.logo} alt={store.name} className="h-8 w-auto" />
              : <span className="font-bold" style={{ color: primary }}>{store.name}</span>
            }
          </Link>
          <button onClick={() => setLang(l => l === 'fa' ? 'en' : l === 'en' ? 'it' : 'fa')}
            className="text-xs px-3 py-1.5 rounded-lg border" style={{ background: 'white', borderColor: '#e8e5e0', cursor: 'pointer', fontFamily: 'inherit' }}>
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: '#9b9490' }}>
          <Link href={`/store/${store.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>{t(lang, 'home')}</Link>
          {rtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          <Link href={`/store/${store.slug}/products`} style={{ textDecoration: 'none', color: 'inherit' }}>{t(lang, 'products')}</Link>
          {rtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          <span style={{ color: '#0a0a0a', fontWeight: '500' }}>{name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main image */}
            <div className="relative bg-white rounded-3xl overflow-hidden mb-4 border" style={{ borderColor: '#e8e5e0', paddingBottom: '100%' }}>
              <div className="absolute inset-0">
                {product.images?.[selectedImage]
                  ? <img src={product.images[selectedImage]} alt={name} className="w-full h-full object-contain p-6" />
                  : <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
                }
              </div>
              {hasDiscount && (
                <div className="absolute top-4 right-4">
                  <span className="discount-badge text-sm py-1.5 px-3">
                    {product.discount.value}{product.discount.type === 'percentage' ? '%' : ' ت'} OFF
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
                    style={{ borderColor: selectedImage === i ? primary : '#e8e5e0', padding: 0, background: 'none', cursor: 'pointer' }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.categoryId && (
              <Link href={`/store/${store.slug}/products?category=${product.categoryId._id}`}
                style={{ textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e' }}>
                {product.categoryId.name[lang] || product.categoryId.name.fa}
              </Link>
            )}

            <h1 className="text-3xl font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>{name}</h1>

            {shortDesc && <p className="text-base leading-relaxed" style={{ color: '#9b9490' }}>{shortDesc}</p>}

            {/* Rating */}
            {product.rating?.count > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(product.rating.average) ? '#f59e0b' : 'none'} color="#f59e0b" />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating.average.toFixed(1)}</span>
                <span className="text-sm" style={{ color: '#9b9490' }}>({product.rating.count} نظر)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-4 py-4 border-y" style={{ borderColor: '#e8e5e0' }}>
              <div>
                <div className="text-4xl font-bold" style={{ color: hasDiscount ? '#dc2626' : '#0a0a0a' }}>
                  {finalPrice.toLocaleString(rtl ? 'fa-IR' : 'en')}
                  <span className="text-lg font-normal mr-1 text-gray-500">تومان</span>
                </div>
                {hasDiscount && (
                  <div className="text-lg line-through mt-1" style={{ color: '#9b9490' }}>
                    {product.price.toLocaleString(rtl ? 'fa-IR' : 'en')} تومان
                  </div>
                )}
              </div>
              {!inStock && (
                <span className="tag tag-error text-sm">ناموجود</span>
              )}
              {inStock && product.stock < 10 && (
                <span className="tag tag-warning text-sm">فقط {product.stock} عدد مانده</span>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">{t(lang, 'color')}</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: any, i: number) => (
                    <button key={i} onClick={() => setSelectedColor(selectedColor === i ? null : i)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all"
                      style={{ borderColor: selectedColor === i ? primary : '#e8e5e0', background: selectedColor === i ? '#f5f5f5' : 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <span className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ background: color.hex }} />
                      {color.name[lang] || color.name.fa}
                      {selectedColor === i && <Check size={14} style={{ color: primary }} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">{t(lang, 'size')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any, i: number) => (
                    <button key={i} onClick={() => setSelectedVariant(selectedVariant === i ? null : i)}
                      className="px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all"
                      style={{ borderColor: selectedVariant === i ? primary : '#e8e5e0', background: selectedVariant === i ? primary : 'white', color: selectedVariant === i ? 'white' : '#0a0a0a', cursor: v.stock === 0 ? 'not-allowed' : 'pointer', opacity: v.stock === 0 ? 0.4 : 1, fontFamily: 'inherit' }}>
                      {v.value}
                      {v.price > 0 && <span className="mr-1 text-xs">(+{v.price.toLocaleString(rtl ? 'fa-IR' : 'en')})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4">
              {/* Qty */}
              <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Minus size={16} />
                </button>
                <span className="px-4 font-bold">{qty.toLocaleString(rtl ? 'fa-IR' : 'en')}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to cart */}
              <button onClick={handleAddToCart} disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-3 py-4 font-bold text-sm uppercase tracking-wider transition-all"
                style={{ background: addedToCart ? '#059669' : inStock ? primary : '#e8e5e0', color: inStock ? 'white' : '#9b9490', border: 'none', borderRadius: '12px', cursor: inStock ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                {addedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                {addedToCart ? 'افزوده شد!' : inStock ? t(lang, 'addToCart') : t(lang, 'outOfStock')}
              </button>

              {/* Wishlist */}
              <button onClick={() => setWishlisted(!wishlisted)}
                style={{ padding: '1rem', background: 'white', border: '1.5px solid', borderColor: wishlisted ? '#ef4444' : '#e8e5e0', borderRadius: '12px', cursor: 'pointer' }}>
                <Heart size={20} fill={wishlisted ? '#ef4444' : 'none'} color={wishlisted ? '#ef4444' : '#9b9490'} />
              </button>
            </div>

            {/* Description */}
            <div className="pt-4 border-t" style={{ borderColor: '#e8e5e0' }}>
              <h3 className="font-semibold mb-3">{t(lang, 'description')}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4a4a4a', whiteSpace: 'pre-wrap' }}>{desc}</p>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span key={tag} className="tag tag-default">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>{t(lang, 'relatedProducts')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => {
                const pName = p.name[lang] || p.name.fa
                return (
                  <Link key={p._id} href={`/store/${store.slug}/product/${p.slug}`}
                    className="product-card bg-white rounded-2xl overflow-hidden border group"
                    style={{ borderColor: '#e8e5e0', textDecoration: 'none', color: 'inherit' }}>
                    <div className="relative img-zoom" style={{ paddingBottom: '100%' }}>
                      <div className="absolute inset-0">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={pName} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: '#f5f5f5' }}>🛍️</div>
                        }
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate mb-1">{pName}</h4>
                      <span className="font-bold text-sm">{p.price.toLocaleString(rtl ? 'fa-IR' : 'en')} ت</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
