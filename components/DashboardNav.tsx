'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/lib/types'

interface Props {
  email: string
  role: Role
}

export default function DashboardNav({ email, role }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">Badamax</span>
              <span className="text-gray-400 text-xs ml-2 hidden sm:inline">People Control Tower</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                role === 'admin'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {role === 'admin' ? 'Admin' : 'Viewer'}
              </span>
              <span className="text-gray-500 text-sm truncate max-w-[200px]">{email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
