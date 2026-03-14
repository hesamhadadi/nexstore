'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { LayoutDashboard, Store, Users, Settings, LogOut, ShoppingBag, Menu, X, Key } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/stores', label: 'فروشگاه‌ها', icon: Store },
  { href: '/admin/users', label: 'کاربران', icon: Users },
  { href: '/admin/settings', label: 'تنظیمات', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0efec' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a' }} />
    </div>
  )

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') window.location.replace('/login')
    return null
  }

  if (status === 'authenticated' && (session?.user as any)?.role !== 'superadmin') {
    if (typeof window !== 'undefined') window.location.replace('/login')
    return null
  }

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif', background: '#f0efec' }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#0a0a0a] transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#c9a96e' }}>
                <ShoppingBag size={16} color="white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">NexStore</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>پنل ابرمدیر</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  style={{ textDecoration: 'none' }}>
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 px-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#c9a96e', color: 'white' }}>
                {session?.user?.name?.[0] || 'A'}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{session?.user?.name}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>ابرمدیر</div>
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4" style={{ borderColor: '#e8e5e0' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Key size={16} style={{ color: '#c9a96e' }} />
            <span className="text-sm font-medium">پنل مدیریت اصلی</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
