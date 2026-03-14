'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, ChevronDown, ChevronRight, Upload, FolderTree } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  _id: string; name: { fa: string; en: string; it: string }
  parentId?: string; image?: string; isActive: boolean; children?: Category[]
}

function CategoryNode({ cat, depth = 0, onEdit, onDelete, onAddChild }: any) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = cat.children?.length > 0

  return (
    <div>
      <div className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-gray-50 group transition-colors"
        style={{ paddingRight: `${(depth + 1) * 1.5}rem` }}>
        <button onClick={() => setExpanded(!expanded)}
          style={{ background: 'none', border: 'none', cursor: hasChildren ? 'pointer' : 'default', color: hasChildren ? '#0a0a0a' : 'transparent', padding: '0.25rem' }}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {cat.image ? (
          <img src={cat.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: '#f5f5f5' }}>📁</div>
        )}

        <div className="flex-1">
          <span className="font-medium text-sm">{cat.name.fa}</span>
          {cat.name.en && cat.name.en !== cat.name.fa && (
            <span className="text-xs mr-2" style={{ color: '#9b9490' }}>({cat.name.en})</span>
          )}
          {!cat.isActive && <span className="tag tag-error mr-2" style={{ fontSize: '0.65rem' }}>غیرفعال</span>}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onAddChild(cat._id)}
            style={{ padding: '0.25rem 0.5rem', background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Vazirmatn, sans-serif' }}>
            + زیردسته
          </button>
          <button onClick={() => onEdit(cat)}
            style={{ padding: '0.25rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            <Edit size={13} />
          </button>
          <button onClick={() => onDelete(cat._id)}
            style={{ padding: '0.25rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div style={{ borderRight: '2px solid #f0f0f0', marginRight: `${(depth + 1) * 1.5}rem` }}>
          {cat.children.map((child: Category) => (
            <CategoryNode key={child._id} cat={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoriesPage() {
  const [tree, setTree] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [parentId, setParentId] = useState<string | null>(null)
  const [form, setForm] = useState({ nameFa: '', nameEn: '', nameIt: '', image: '', isActive: true })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/store/categories')
      const data = await res.json()
      setTree(data.tree || [])
    } catch { toast.error('خطا') }
    finally { setLoading(false) }
  }

  function openAdd(pid: string | null = null) {
    setEditCat(null)
    setParentId(pid)
    setForm({ nameFa: '', nameEn: '', nameIt: '', image: '', isActive: true })
    setShowModal(true)
  }

  function openEdit(cat: Category) {
    setEditCat(cat)
    setParentId(cat.parentId || null)
    setForm({ nameFa: cat.name.fa, nameEn: cat.name.en, nameIt: cat.name.it, image: cat.image || '', isActive: cat.isActive })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.nameFa) { toast.error('نام فارسی الزامی است'); return }
    setSaving(true)
    try {
      const body = {
        name: { fa: form.nameFa, en: form.nameEn || form.nameFa, it: form.nameIt || form.nameFa },
        image: form.image || undefined,
        isActive: form.isActive,
        parentId: parentId || undefined,
      }
      const res = await fetch(editCat ? `/api/store/categories/${editCat._id}` : '/api/store/categories', {
        method: editCat ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      toast.success(editCat ? 'دسته‌بندی بروز شد' : 'دسته‌بندی ایجاد شد')
      setShowModal(false)
      fetchCategories()
    } catch { toast.error('خطا در ذخیره') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('آیا مطمئنید؟ زیردسته‌ها هم حذف می‌شوند.')) return
    try {
      await fetch(`/api/store/categories/${id}`, { method: 'DELETE' })
      toast.success('حذف شد')
      fetchCategories()
    } catch { toast.error('خطا') }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: reader.result, folder: 'categories' }),
        })
        const data = await res.json()
        if (data.url) setForm(prev => ({ ...prev, image: data.url }))
      }
      reader.readAsDataURL(e.target.files[0])
    } catch { toast.error('خطا') }
    finally { setUploading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">دسته‌بندی‌ها</h1>
          <p style={{ color: '#9b9490', fontSize: '0.875rem' }}>ساختار درختی نامحدود</p>
        </div>
        <button onClick={() => openAdd()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#0a0a0a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', fontFamily: 'Vazirmatn, sans-serif' }}>
          <Plus size={18} />
          دسته جدید
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e5e0' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a' }} />
          </div>
        ) : tree.length === 0 ? (
          <div className="text-center py-16">
            <FolderTree size={48} style={{ color: '#e8e5e0', margin: '0 auto 1rem' }} />
            <p className="font-medium mb-2">هنوز دسته‌بندی ندارید</p>
            <p className="text-sm mb-6" style={{ color: '#9b9490' }}>اولین دسته‌بندی خود را بسازید</p>
            <button onClick={() => openAdd()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#0a0a0a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
              <Plus size={16} />
              دسته جدید
            </button>
          </div>
        ) : (
          <div className="p-4">
            {tree.map(cat => (
              <CategoryNode key={cat._id} cat={cat} onEdit={openEdit} onDelete={handleDelete} onAddChild={(pid: string) => openAdd(pid)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-5">
              {editCat ? 'ویرایش دسته‌بندی' : parentId ? 'افزودن زیردسته' : 'دسته‌بندی جدید'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام فارسی *</label>
                <input value={form.nameFa} onChange={e => setForm(p => ({ ...p, nameFa: e.target.value }))}
                  className="form-input" placeholder="نام دسته‌بندی" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام انگلیسی</label>
                <input value={form.nameEn} onChange={e => setForm(p => ({ ...p, nameEn: e.target.value }))}
                  className="form-input" placeholder="Category Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نام ایتالیایی</label>
                <input value={form.nameIt} onChange={e => setForm(p => ({ ...p, nameIt: e.target.value }))}
                  className="form-input" placeholder="Nome Categoria" />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-2">تصویر دسته‌بندی</label>
                <div className="flex items-center gap-3">
                  {form.image && <img src={form.image} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: '#f5f5f5', border: 'none', color: '#0a0a0a' }}>
                    <Upload size={16} />
                    {uploading ? 'آپلود...' : 'آپلود تصویر'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}>
                <div className={`w-10 h-6 rounded-full transition-all relative ${form.isActive ? 'bg-black' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow ${form.isActive ? 'right-1' : 'left-1'}`} />
                </div>
                <span className="text-sm font-medium">نمایش در فروشگاه</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1.5px solid #e8e5e0', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                انصراف
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 2, padding: '0.75rem', background: saving ? '#999' : '#0a0a0a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Vazirmatn, sans-serif' }}>
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
