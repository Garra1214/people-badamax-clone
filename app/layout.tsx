import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'People Control Tower | Badamax',
  description: 'Panel de control de gestión de personas en tiempo real',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
