'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users,
  Image, Settings, LogOut, ShoppingBag, Menu, X, BarChart3, Palette
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/products', label: 'محصولات', icon: Package },
  { href: '/dashboard/categories', label: 'دسته‌بندی‌ها', icon: Tag },
  { href: '/dashboard/orders', label: 'سفارشات', icon: ShoppingCart },
  { href: '/dashboard/users', label: 'کاربران', icon: Users },
  { href: '/dashboard/banners', label: 'بنرها', icon: Image },
  { href: '/dashboard/appearance', label: 'ظاهر', icon: Palette },
  { href: '/dashboard/settings', label: 'تنظیمات', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0efec' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a' }} />
    </div>
  )

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return null
  }

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif', background: '#f0efec' }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
        style={{ background: '#ffffff', borderLeft: '1px solid #e8e5e0' }}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#e8e5e0' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
              <ShoppingBag size={16} color="#c9a96e" />
            </div>
            <div>
              <div className="font-bold text-sm">فروشگاه من</div>
              <div className="text-xs" style={{ color: '#9b9490' }}>پنل مدیریت</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}
                className="sidebar-link"
                style={{
                  ...(active ? { background: '#0a0a0a', color: 'white' } : {}),
                  textDecoration: 'none',
                }}
                onClick={() => setOpen(false)}>
                <item.icon size={17} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: '#e8e5e0' }}>
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: '#c9a96e' }}>
              {session?.user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="font-medium text-sm truncate">{session?.user?.name}</div>
              <div className="text-xs truncate" style={{ color: '#9b9490' }}>{session?.user?.email}</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.625rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#9b9490', fontFamily: 'Vazirmatn, sans-serif', fontSize: '0.875rem', transition: 'all 0.2s' }}>
            <LogOut size={15} />
            خروج
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4" style={{ borderColor: '#e8e5e0' }}>
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#9b9490' }}>
            <span>NexStore</span>
            <span>/</span>
            <span style={{ color: '#0a0a0a', fontWeight: '500' }}>
              {navItems.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href))?.label || 'داشبورد'}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
