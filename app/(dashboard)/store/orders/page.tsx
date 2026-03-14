'use client'
import { useEffect, useState } from 'react'
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'در انتظار',       color: 'tag-warning', icon: Clock },
  confirmed:  { label: 'تأیید شده',       color: 'tag-info',    icon: CheckCircle },
  processing: { label: 'در پردازش',       color: 'tag-info',    icon: Package },
  shipped:    { label: 'ارسال شده',       color: 'tag-info',    icon: Truck },
  delivered:  { label: 'تحویل داده شده', color: 'tag-success', icon: CheckCircle },
  cancelled:  { label: 'لغو شده',         color: 'tag-error',   icon: XCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchOrders() }, [filter])

  async function fetchOrders() {
    try {
      const res = await fetch(`/api/store/orders?status=${filter}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch { toast.error('خطا در دریافت سفارشات') }
    finally { setLoading(false) }
  }

  async function updateStatus(orderId: string, status: string) {
    try {
      await fetch(`/api/store/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      toast.success('وضعیت بروز شد')
      fetchOrders()
      setSelectedOrder(null)
    } catch { toast.error('خطا') }
  }

  const filtered = orders.filter(o =>
    o.orderNumber?.includes(search) ||
    o.customerId?.name?.includes(search) ||
    o.customerId?.email?.includes(search)
  )

  const statusCounts = orders.reduce((acc: any, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">سفارشات</h1>
        <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>{orders.length} سفارش</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[{ key: 'all', label: 'همه' }, ...Object.entries(statusConfig).map(([key, val]) => ({ key, label: val.label }))].map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '100px', border: '1.5px solid',
              borderColor: filter === s.key ? '#0a0a0a' : '#e8e5e0',
              background: filter === s.key ? '#0a0a0a' : 'white',
              color: filter === s.key ? 'white' : '#9b9490',
              fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer',
              fontFamily: 'Vazirmatn, sans-serif',
            }}>
            {s.label}
            {s.key !== 'all' && statusCounts[s.key] ? (
              <span className="mr-1 text-xs opacity-70">({statusCounts[s.key]})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: '#9b9490' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} className="form-input"
          style={{ paddingRight: '2.75rem' }} placeholder="جستجو بر اساس شماره سفارش یا نام مشتری..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a' }} />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>شماره سفارش</th>
                <th>مشتری</th>
                <th>مبلغ</th>
                <th>آیتم‌ها</th>
                <th>وضعیت پرداخت</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const status = statusConfig[order.status]
                const StatusIcon = status?.icon || Clock
                return (
                  <tr key={order._id}>
                    <td>
                      <code className="text-xs px-2 py-1 rounded" style={{ background: '#f5f5f5' }}>
                        #{order.orderNumber}
                      </code>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium text-sm">{order.customerId?.name}</div>
                        <div className="text-xs" style={{ color: '#9b9490' }}>{order.customerId?.email}</div>
                      </div>
                    </td>
                    <td className="font-bold">{order.total?.toLocaleString('fa-IR')} ت</td>
                    <td className="text-sm">{order.items?.length} آیتم</td>
                    <td>
                      <span className={`tag ${order.paymentStatus === 'paid' ? 'tag-success' : order.paymentStatus === 'refunded' ? 'tag-error' : 'tag-warning'}`}>
                        {order.paymentStatus === 'paid' ? 'پرداخت شده' : order.paymentStatus === 'refunded' ? 'برگشت' : 'پرداخت نشده'}
                      </span>
                    </td>
                    <td>
                      <span className={`tag ${status?.color || 'tag-default'} flex items-center gap-1 w-fit`}>
                        <StatusIcon size={12} />
                        {status?.label}
                      </span>
                    </td>
                    <td className="text-sm" style={{ color: '#9b9490' }}>
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Vazirmatn, sans-serif' }}>
                        <Eye size={14} />
                        مشاهده
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={8} className="text-center py-12" style={{ color: '#9b9490' }}>سفارشی یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl" style={{ borderColor: '#e8e5e0' }}>
              <div>
                <h3 className="font-bold text-lg">سفارش #{selectedOrder.orderNumber}</h3>
                <p className="text-sm" style={{ color: '#9b9490' }}>{new Date(selectedOrder.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#9b9490' }}>×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer info */}
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#9b9490' }}>اطلاعات مشتری</h4>
                <div className="p-4 rounded-xl" style={{ background: '#f8f8f8' }}>
                  <p className="font-medium">{selectedOrder.customerId?.name}</p>
                  <p className="text-sm" style={{ color: '#9b9490' }}>{selectedOrder.customerId?.email}</p>
                  {selectedOrder.shippingAddress && (
                    <p className="text-sm mt-2" style={{ color: '#9b9490' }}>
                      {selectedOrder.shippingAddress.city}، {selectedOrder.shippingAddress.street}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#9b9490' }}>آیتم‌های سفارش</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: '#e8e5e0' }}>
                      {item.image && <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name?.fa || item.name?.en}</p>
                        {item.color && <p className="text-xs" style={{ color: '#9b9490' }}>رنگ: {item.color}</p>}
                        {item.variant && <p className="text-xs" style={{ color: '#9b9490' }}>مدل: {item.variant}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{item.price?.toLocaleString('fa-IR')} ت</p>
                        <p className="text-xs" style={{ color: '#9b9490' }}>×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between font-bold" style={{ borderColor: '#e8e5e0' }}>
                  <span>جمع کل</span>
                  <span>{selectedOrder.total?.toLocaleString('fa-IR')} ت</span>
                </div>
              </div>

              {/* Status update */}
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#9b9490' }}>تغییر وضعیت</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <button key={key} onClick={() => updateStatus(selectedOrder._id, key)}
                      style={{
                        padding: '0.5rem', borderRadius: '8px', border: '1.5px solid',
                        borderColor: selectedOrder.status === key ? '#0a0a0a' : '#e8e5e0',
                        background: selectedOrder.status === key ? '#0a0a0a' : 'transparent',
                        color: selectedOrder.status === key ? 'white' : '#9b9490',
                        fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif',
                      }}>
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
