export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf9f7' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 rounded-full animate-spin"
          style={{ borderColor: '#e8e5e0', borderTopColor: '#0a0a0a', borderWidth: '3px' }} />
        <p className="text-sm" style={{ color: '#9b9490', fontFamily: 'Vazirmatn, sans-serif' }}>در حال بارگذاری...</p>
      </div>
    </div>
  )
}
