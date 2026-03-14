import { connectDB } from '@/lib/db'
import Store from '@/models/Store'
import User from '@/models/User'
import Order from '@/models/Order'
import { Store as StoreIcon, Users, ShoppingCart, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  await connectDB()
  const [totalStores, activeStores, totalUsers, totalOrders] = await Promise.all([
    Store.countDocuments(),
    Store.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments(),
  ])
  const recentStores = await Store.find().sort({ createdAt: -1 }).limit(5).populate('ownerId', 'name email')
  return { totalStores, activeStores, totalUsers, totalOrders, recentStores }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'کل فروشگاه‌ها', value: stats.totalStores, icon: StoreIcon, color: '#4f46e5', bg: '#eef2ff' },
    { label: 'فروشگاه فعال', value: stats.activeStores, icon: Activity, color: '#059669', bg: '#ecfdf5' },
    { label: 'کاربران', value: stats.totalUsers, icon: Users, color: '#d97706', bg: '#fffbeb' },
    { label: 'سفارشات', value: stats.totalOrders, icon: ShoppingCart, color: '#dc2626', bg: '#fef2f2' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">داشبورد مدیریت</h1>
        <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>نمای کلی از وضعیت پلتفرم</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border" style={{ borderColor: '#e8e5e0' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#9b9490' }}>{card.label}</p>
                <p className="text-3xl font-bold">{card.value.toLocaleString('fa-IR')}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                <card.icon size={20} color={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent stores */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: '#e8e5e0' }}>
          <h2 className="font-semibold">آخرین فروشگاه‌ها</h2>
          <Link href="/admin/stores" style={{ fontSize: '0.875rem', color: '#c9a96e', textDecoration: 'none' }}>
            مشاهده همه
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>فروشگاه</th>
              <th>مالک</th>
              <th>وضعیت</th>
              <th>اقدامات</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentStores.map((store: any) => (
              <tr key={store._id}>
                <td>
                  <div>
                    <div className="font-medium">{store.name}</div>
                    <div className="text-xs" style={{ color: '#9b9490' }}>{store.slug}</div>
                  </div>
                </td>
                <td>
                  <div>
                    <div className="text-sm">{store.ownerId?.name}</div>
                    <div className="text-xs" style={{ color: '#9b9490' }}>{store.ownerId?.email}</div>
                  </div>
                </td>
                <td>
                  <span className={`tag ${store.isActive ? 'tag-success' : 'tag-error'}`}>
                    {store.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/stores/${store._id}`}
                    style={{ fontSize: '0.8rem', color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>
                    مدیریت
                  </Link>
                </td>
              </tr>
            ))}
            {stats.recentStores.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8" style={{ color: '#9b9490' }}>
                  هنوز فروشگاهی ثبت نشده
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
