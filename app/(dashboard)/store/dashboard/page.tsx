import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Store from '@/models/Store'
import Product from '@/models/Product'
import Order from '@/models/Order'
import User from '@/models/User'
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function StoreDashboard() {
  const session = await getServerSession(authOptions)
  await connectDB()

  const userId = (session?.user as any)?.id
  const store = await Store.findOne({ ownerId: userId })
  if (!store) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} style={{ color: '#9b9490', margin: '0 auto 1rem' }} />
          <h2 className="text-xl font-bold mb-2">فروشگاه یافت نشد</h2>
          <p style={{ color: '#9b9490' }}>با ادمین اصلی تماس بگیرید</p>
        </div>
      </div>
    )
  }

  const [products, orders, customers] = await Promise.all([
    Product.countDocuments({ storeId: store._id }),
    Order.countDocuments({ storeId: store._id }),
    User.countDocuments({ storeId: store._id, role: 'customer' }),
  ])

  const recentOrders = await Order.find({ storeId: store._id })
    .sort({ createdAt: -1 }).limit(5).populate('customerId', 'name email')

  const totalRevenue = await Order.aggregate([
    { $match: { storeId: store._id, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ])

  const revenue = totalRevenue[0]?.total || 0

  const cards = [
    { label: 'محصولات', value: products, icon: Package, color: '#4f46e5', bg: '#eef2ff' },
    { label: 'سفارشات', value: orders, icon: ShoppingCart, color: '#059669', bg: '#ecfdf5' },
    { label: 'مشتریان', value: customers, icon: Users, color: '#d97706', bg: '#fffbeb' },
    { label: 'درآمد کل', value: revenue.toLocaleString('fa-IR') + ' ت', icon: TrendingUp, color: '#dc2626', bg: '#fef2f2' },
  ]

  const statusLabels: Record<string, string> = {
    pending: 'در انتظار', confirmed: 'تأیید شده', processing: 'پردازش',
    shipped: 'ارسال شده', delivered: 'تحویل', cancelled: 'لغو'
  }
  const statusColors: Record<string, string> = {
    pending: 'tag-warning', confirmed: 'tag-info', processing: 'tag-info',
    shipped: 'tag-success', delivered: 'tag-success', cancelled: 'tag-error'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">خوش آمدی، {session?.user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>
            وضعیت فروشگاه: {' '}
            <span className={`font-medium ${store.isActive ? 'text-green-600' : 'text-red-500'}`}>
              {store.isActive ? 'فعال' : 'غیرفعال - منتظر تأیید ادمین'}
            </span>
          </p>
        </div>
        <Link href={`/store/${store.slug}`} target="_blank"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }}>
          مشاهده فروشگاه
          <ExternalLink size={15} />
        </Link>
      </div>

      {/* Warning if inactive */}
      {!store.isActive && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
          <AlertCircle size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p className="font-medium text-sm" style={{ color: '#92400e' }}>فروشگاه شما هنوز فعال نشده</p>
            <p className="text-xs mt-1" style={{ color: '#b45309' }}>با ادمین اصلی تماس بگیرید تا توکن فعال‌سازی دریافت کنید.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#e8e5e0' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: '#9b9490' }}>{card.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.bg }}>
                <card.icon size={16} color={card.color} />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: '#e8e5e0' }}>
          <h2 className="font-semibold">آخرین سفارشات</h2>
          <Link href="/dashboard/orders" style={{ fontSize: '0.875rem', color: '#c9a96e', textDecoration: 'none' }}>
            مشاهده همه
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>شماره سفارش</th>
              <th>مشتری</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order: any) => (
              <tr key={order._id}>
                <td><code className="text-xs" style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>#{order.orderNumber}</code></td>
                <td>
                  <div className="text-sm">{order.customerId?.name}</div>
                  <div className="text-xs" style={{ color: '#9b9490' }}>{order.customerId?.email}</div>
                </td>
                <td className="font-medium">{order.total.toLocaleString('fa-IR')} ت</td>
                <td><span className={`tag ${statusColors[order.status] || 'tag-default'}`}>{statusLabels[order.status]}</span></td>
                <td className="text-sm" style={{ color: '#9b9490' }}>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10" style={{ color: '#9b9490' }}>هنوز سفارشی ثبت نشده</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
