'use client'
import { useEffect, useState } from 'react'
import { Search, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/store/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch { toast.error('خطا') }
    finally { setLoading(false) }
  }

  async function toggleUser(id: string) {
    try {
      await fetch(`/api/store/users/${id}/toggle`, { method: 'PUT' })
      toast.success('وضعیت کاربر تغییر کرد')
      fetchUsers()
    } catch { toast.error('خطا') }
  }

  const filtered = users.filter(u =>
    u.name?.includes(search) || u.email?.includes(search) || u.phone?.includes(search)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">مشتریان</h1>
        <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>{users.length} مشتری ثبت‌نام کرده</p>
      </div>

      <div className="relative">
        <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: '#9b9490' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} className="form-input"
          style={{ paddingRight: '2.75rem' }} placeholder="جستجو بر اساس نام، ایمیل یا شماره..." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'کل مشتریان', value: users.length, color: '#4f46e5', bg: '#eef2ff' },
          { label: 'فعال', value: users.filter(u => u.isActive).length, color: '#059669', bg: '#ecfdf5' },
          { label: 'غیرفعال', value: users.filter(u => !u.isActive).length, color: '#dc2626', bg: '#fef2f2' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border text-center" style={{ borderColor: '#e8e5e0' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm" style={{ color: '#9b9490' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a' }} />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>مشتری</th>
                <th>تماس</th>
                <th>آدرس</th>
                <th>تاریخ ثبت‌نام</th>
                <th>وضعیت</th>
                <th>اقدام</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: '#0a0a0a' }}>
                        {user.name?.[0] || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs" style={{ color: '#9b9490' }}>#{user._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      {user.email && (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9b9490' }}>
                          <Mail size={12} /> {user.email}
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9b9490' }}>
                          <Phone size={12} /> {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-sm" style={{ color: '#9b9490' }}>
                    {user.address?.city || '—'}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9b9490' }}>
                      <Calendar size={12} />
                      {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                  </td>
                  <td>
                    <span className={`tag ${user.isActive ? 'tag-success' : 'tag-error'}`}>
                      {user.isActive ? 'فعال' : 'مسدود'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => toggleUser(user._id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', background: user.isActive ? '#fef2f2' : '#ecfdf5', color: user.isActive ? '#dc2626' : '#059669', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Vazirmatn, sans-serif' }}>
                      {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      {user.isActive ? 'مسدود' : 'فعال‌سازی'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={6} className="text-center py-12" style={{ color: '#9b9490' }}>مشتری یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
