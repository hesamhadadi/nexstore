'use client'
import { useEffect, useState } from 'react'
import { Search, UserCheck, UserX, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch { toast.error('خطا') }
    finally { setLoading(false) }
  }

  async function toggleUser(id: string) {
    try {
      await fetch(`/api/admin/users/${id}/toggle`, { method: 'PUT' })
      toast.success('وضعیت تغییر کرد')
      fetchUsers()
    } catch { toast.error('خطا') }
  }

  const filtered = users.filter(u =>
    u.name?.includes(search) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const roleLabel: Record<string, string> = {
    superadmin: 'ابرمدیر',
    store_admin: 'مدیر فروشگاه',
    customer: 'مشتری',
  }
  const roleColor: Record<string, string> = {
    superadmin: 'tag-error',
    store_admin: 'tag-info',
    customer: 'tag-default',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">مدیریت کاربران</h1>
        <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>{users.length} کاربر در سیستم</p>
      </div>

      <div className="relative">
        <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: '#9b9490' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} className="form-input"
          style={{ paddingRight: '2.75rem' }} placeholder="جستجو..." />
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
                <th>کاربر</th>
                <th>نقش</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>اقدام</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: user.role === 'superadmin' ? '#dc2626' : user.role === 'store_admin' ? '#4f46e5' : '#0a0a0a' }}>
                        {user.role === 'superadmin' ? <ShieldCheck size={16} /> : user.name?.[0] || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs" style={{ color: '#9b9490' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`tag ${roleColor[user.role] || 'tag-default'}`}>{roleLabel[user.role] || user.role}</span></td>
                  <td><span className={`tag ${user.isActive ? 'tag-success' : 'tag-error'}`}>{user.isActive ? 'فعال' : 'غیرفعال'}</span></td>
                  <td className="text-sm" style={{ color: '#9b9490' }}>{new Date(user.createdAt).toLocaleDateString('fa-IR')}</td>
                  <td>
                    {user.role !== 'superadmin' && (
                      <button onClick={() => toggleUser(user._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', background: user.isActive ? '#fef2f2' : '#ecfdf5', color: user.isActive ? '#dc2626' : '#059669', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Vazirmatn, sans-serif' }}>
                        {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                        {user.isActive ? 'مسدود' : 'فعال'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={5} className="text-center py-12" style={{ color: '#9b9490' }}>کاربری یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
