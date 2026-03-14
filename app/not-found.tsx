import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl"
      style={{ fontFamily: 'Vazirmatn, sans-serif', background: '#faf9f7' }}>
      <div className="text-center px-6">
        <div className="text-9xl font-bold mb-4" style={{ color: '#e8e5e0', fontFamily: 'Playfair Display, serif' }}>404</div>
        <h1 className="text-2xl font-bold mb-3">صفحه یافت نشد</h1>
        <p className="mb-8" style={{ color: '#9b9490' }}>صفحه‌ای که دنبالش می‌گردی وجود نداره یا حذف شده.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/"
            style={{ padding: '0.75rem 2rem', background: '#0a0a0a', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
            برو خانه
          </Link>
          <Link href="/login"
            style={{ padding: '0.75rem 2rem', background: 'transparent', color: '#0a0a0a', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', border: '1.5px solid #e8e5e0' }}>
            ورود
          </Link>
        </div>
      </div>
    </div>
  )
}
