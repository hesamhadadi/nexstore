'use client'
import { useEffect, useState } from 'react'
import { Plus, Key, ToggleLeft, ToggleRight, ExternalLink, Search, RefreshCw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Store {
  _id: string
  name: string
  slug: string
  isActive: boolean
  token: string
  tokenExpiresAt?: string
  ownerId: { name: string; email: string }
  createdAt: string
  language: string
  primaryColor: string
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showTokenModal, setShowTokenModal] = useState<Store | null>(null)
  const [tokenDays, setTokenDays] = useState(30)

  useEffect(() => { fetchStores() }, [])

  async function fetchStores() {
    try {
      const res = await fetch('/api/admin/stores')
      const data = await res.json()
      setStores(data.stores || [])
    } catch { toast.error('خطا در دریافت فروشگاه‌ها') }
    finally { setLoading(false) }
  }

  async function toggleStore(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/stores/${id}/toggle`, { method: 'PUT' })
      if (!res.ok) throw new Error()
      toast.success(current ? 'فروشگاه غیرفعال شد' : 'فروشگاه فعال شد')
      fetchStores()
    } catch { toast.error('خطا') }
  }

  async function generateToken(storeId: string) {
    try {
      const res = await fetch(`/api/admin/stores/${storeId}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: tokenDays }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('توکن جدید صادر شد')
      setShowTokenModal(null)
      fetchStores()
    } catch { toast.error('خطا در صدور توکن') }
  }

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase()) ||
    s.ownerId?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">مدیریت فروشگاه‌ها</h1>
          <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>{stores.length} فروشگاه ثبت شده</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#9b9490' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ paddingRight: '2.75rem' }}
          placeholder="جستجو در فروشگاه‌ها..."
        />
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
                <th>فروشگاه</th>
                <th>مالک</th>
                <th>توکن</th>
                <th>وضعیت</th>
                <th>اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((store) => (
                <tr key={store._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: store.primaryColor || '#0a0a0a' }}>
                        {store.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-xs flex items-center gap-1" style={{ color: '#9b9490' }}>
                          {store.slug}
                          <Link href={`/store/${store.slug}`} target="_blank">
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="text-sm font-medium">{store.ownerId?.name}</div>
                      <div className="text-xs" style={{ color: '#9b9490' }}>{store.ownerId?.email}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <code className="text-xs px-2 py-1 rounded" style={{ background: '#f5f5f5' }}>
                        {store.token?.substring(0, 12)}...
                      </code>
                      {store.tokenExpiresAt && (
                        <div className="text-xs mt-1" style={{ color: '#9b9490' }}>
                          انقضا: {new Date(store.tokenExpiresAt).toLocaleDateString('fa-IR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`tag ${store.isActive ? 'tag-success' : 'tag-error'}`}>
                      {store.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowTokenModal(store)}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: '#eff6ff', color: '#2563eb', border: 'none', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                        <Key size={13} />
                        توکن
                      </button>
                      <button
                        onClick={() => toggleStore(store._id, store.isActive)}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        style={{
                          background: store.isActive ? '#fef2f2' : '#ecfdf5',
                          color: store.isActive ? '#dc2626' : '#059669',
                          border: 'none', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif'
                        }}>
                        {store.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        {store.isActive ? 'غیرفعال' : 'فعال'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-12" style={{ color: '#9b9490' }}>
                    فروشگاهی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-2">صدور توکن جدید</h3>
            <p className="text-sm mb-6" style={{ color: '#9b9490' }}>
              برای فروشگاه <strong>{showTokenModal.name}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">مدت اعتبار (روز)</label>
              <input
                type="number"
                value={tokenDays}
                onChange={(e) => setTokenDays(Number(e.target.value))}
                className="form-input"
                min={1}
                max={365}
              />
              <p className="text-xs mt-1" style={{ color: '#9b9490' }}>
                انقضا: {new Date(Date.now() + tokenDays * 86400000).toLocaleDateString('fa-IR')}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowTokenModal(null)}
                style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1.5px solid #e8e5e0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                انصراف
              </button>
              <button onClick={() => generateToken(showTokenModal._id)}
                style={{ flex: 2, padding: '0.75rem', background: '#0a0a0a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Key size={16} />
                صدور توکن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
