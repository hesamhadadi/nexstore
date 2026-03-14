import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SessionWrapper from '@/components/SessionWrapper'

export const metadata: Metadata = {
  title: 'NexStore — Multi-Store Platform',
  description: 'The ultimate multi-tenant e-commerce platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <SessionWrapper>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0f0f0f',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'Vazirmatn, DM Sans, sans-serif',
              },
            }}
          />
        </SessionWrapper>
      </body>
    </html>
  )
}
