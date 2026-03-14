import Link from 'next/link'
import { ShoppingBag, Zap, Globe, Shield, BarChart3, Palette, ArrowRight, Check, Store } from 'lucide-react'

export default function HomePage() {
  const features = [
    { icon: Store, title: 'Multi-Store', desc: 'راه‌اندازی نامحدود فروشگاه با مدیریت جداگانه برای هر کدام' },
    { icon: Globe, title: 'چند زبانه', desc: 'پشتیبانی کامل از فارسی، انگلیسی و ایتالیایی' },
    { icon: Palette, title: 'شخصی‌سازی', desc: 'رنگ، لوگو و ظاهر کاملاً اختصاصی هر فروشگاه' },
    { icon: Zap, title: 'سریع و قدرتمند', desc: 'ساخته شده با Next.js 14 برای بهترین عملکرد' },
    { icon: BarChart3, title: 'آمار جامع', desc: 'داشبورد حرفه‌ای با گزارش‌های دقیق فروش' },
    { icon: Shield, title: 'امنیت بالا', desc: 'سیستم احراز هویت پیشرفته و کنترل دسترسی' },
  ]

  const plans = [
    { name: 'استارتر', price: '۲۹۹,۰۰۰', features: ['۱ فروشگاه', '۵۰ محصول', 'آپلود تصویر', 'پشتیبانی ۷/۲۴'] },
    { name: 'حرفه‌ای', price: '۷۹۹,۰۰۰', popular: true, features: ['۵ فروشگاه', 'محصول نامحدود', 'دامنه اختصاصی', 'آمار پیشرفته', 'API دسترسی'] },
    { name: 'سازمانی', price: 'تماس بگیرید', features: ['فروشگاه نامحدود', 'همه امکانات', 'پشتیبانی اختصاصی', 'سفارشی‌سازی'] },
  ]

  return (
    <main className="min-h-screen" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {/* Background grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #c9a96e, transparent)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/60 text-sm">پلتفرم فروشگاه‌ساز حرفه‌ای</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            فروشگاه آنلاین
            <br />
            <span style={{ color: '#c9a96e' }}>خودت را بساز</span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            با NexStore در کمتر از ۵ دقیقه یک فروشگاه اینترنتی حرفه‌ای راه‌اندازی کن.
            مدیریت محصولات، سفارشات، و مشتریان — همه در یک پنل.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-primary" style={{
              background: '#c9a96e',
              color: 'white',
              border: '2px solid #c9a96e',
              padding: '1rem 2.5rem',
              borderRadius: '4px',
              fontFamily: 'Vazirmatn, sans-serif',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}>
              شروع رایگان
              <ArrowRight size={18} />
            </Link>
            <Link href="/admin" style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              padding: '1rem 2.5rem',
              borderRadius: '4px',
              fontFamily: 'Vazirmatn, sans-serif',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}>
              پنل مدیریت
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/10">
            {[
              { num: '۱۰۰+', label: 'فروشگاه فعال' },
              { num: '۵۰K+', label: 'محصول ثبت شده' },
              { num: '۹۹.۹٪', label: 'آپتایم' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.num}</div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6" style={{ background: '#faf9f7' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>همه چیز که نیاز داری</h2>
            <p style={{ color: '#9b9490' }}>قدرتمند، سریع، و آسان برای استفاده</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #0a0a0a, #333)' }}>
                  <f.icon size={22} color="#c9a96e" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9b9490' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>چطور کار می‌کند؟</h2>
          </div>
          <div className="space-y-8">
            {[
              { step: '۱', title: 'ثبت‌نام کن', desc: 'یک حساب کاربری بساز و درخواست فروشگاه ارسال کن' },
              { step: '۲', title: 'توکن بگیر', desc: 'ادمین اصلی توکن فعال‌سازی برات صادر می‌کنه' },
              { step: '۳', title: 'فروشگاهت رو شخصی‌سازی کن', desc: 'لوگو، رنگ، محصولات و همه چیز رو تنظیم کن' },
              { step: '۴', title: 'شروع به فروش کن', desc: 'فروشگاهت آنلاینه و مشتری‌ها می‌تونن خرید کنن' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-black font-bold"
                  style={{ background: '#c9a96e' }}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 px-6" style={{ background: '#faf9f7' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>پلن‌های اشتراک</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`p-8 rounded-2xl border-2 relative ${plan.popular ? 'border-black bg-black text-white' : 'border-gray-100 bg-white'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 right-6 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: '#c9a96e', color: 'white' }}>
                    محبوب‌ترین
                  </span>
                )}
                <div className={`text-sm font-medium mb-2 ${plan.popular ? 'text-white/60' : 'text-gray-500'}`}>{plan.name}</div>
                <div className={`text-3xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-black'}`}>
                  {plan.price}
                  {plan.price !== 'تماس بگیرید' && <span className="text-sm font-normal mr-1">تومان/ماه</span>}
                </div>
                <div className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={16} color={plan.popular ? '#c9a96e' : '#059669'} />
                      <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" className="block mt-8 text-center py-3 rounded-lg font-semibold text-sm transition-all"
                  style={plan.popular
                    ? { background: '#c9a96e', color: 'white', textDecoration: 'none' }
                    : { background: '#0a0a0a', color: 'white', textDecoration: 'none' }}>
                  شروع کن
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: '#e8e5e0' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} style={{ color: '#c9a96e' }} />
            <span className="font-bold text-lg">NexStore</span>
          </div>
          <p className="text-sm" style={{ color: '#9b9490' }}>
            © ۲۰۲۴ NexStore — پلتفرم فروشگاه‌ساز حرفه‌ای
          </p>
          <div className="flex gap-6">
            <Link href="/login" style={{ color: '#9b9490', textDecoration: 'none', fontSize: '0.875rem' }}>ورود</Link>
            <Link href="/register" style={{ color: '#9b9490', textDecoration: 'none', fontSize: '0.875rem' }}>ثبت‌نام</Link>
            <Link href="/admin" style={{ color: '#9b9490', textDecoration: 'none', fontSize: '0.875rem' }}>ادمین</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
