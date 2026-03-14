'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Shield, Save, Key } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('رمز عبور جدید مطابقت ندارد')
      return
    }
    if (form.newPassword.length < 8) {
      toast.error('رمز عبور باید حداقل ۸ کاراکتر باشد')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('رمز عبور تغییر کرد')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.message || 'خطا')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">تنظیمات</h1>
        <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>مدیریت حساب ابرمدیر</p>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e8e5e0' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0a, #333)' }}>
            <Shield size={28} color="#c9a96e" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{session?.user?.name}</h2>
            <p className="text-sm" style={{ color: '#9b9490' }}>{session?.user?.email}</p>
            <span className="tag tag-error mt-1" style={{ display: 'inline-flex' }}>ابرمدیر</span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: '#f0f0f0', background: '#fafafa' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0a0a0a' }}>
            <Key size={16} color="white" />
          </div>
          <h2 className="font-semibold">تغییر رمز عبور</h2>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">رمز عبور فعلی</label>
            <input type="password" value={form.currentPassword}
              onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))}
              className="form-input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">رمز عبور جدید</label>
            <input type="password" value={form.newPassword}
              onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
              className="form-input" minLength={8} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">تکرار رمز عبور جدید</label>
            <input type="password" value={form.confirmPassword}
              onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
              className="form-input" required />
          </div>
          <button type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', background: saving ? '#999' : '#0a0a0a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
            <Save size={16} />
            {saving ? 'در حال ذخیره...' : 'ذخیره رمز عبور'}
          </button>
        </form>
      </div>
    </div>
  )
}
