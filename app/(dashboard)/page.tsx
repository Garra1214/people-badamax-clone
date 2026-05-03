import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SubsystemCard from '@/components/SubsystemCard'
import type { Subsystem, Role } from '@/lib/types'

export const revalidate = 0

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: subsystems }, { data: profile }] = await Promise.all([
    supabase.from('subsystems').select('*').order('name'),
    supabase.from('users').select('role').eq('id', user.id).single(),
  ])

  const role: Role = profile?.role ?? 'viewer'
  const list = (subsystems as Subsystem[]) ?? []

  const counts = {
    green:  list.filter((s) => s.status === 'green').length,
    yellow: list.filter((s) => s.status === 'yellow').length,
    red:    list.filter((s) => s.status === 'red').length,
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-500 text-sm mt-1">
          Estado en tiempo real de la gestión de personas · {list.length} subsistemas
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center py-4">
          <div className="text-3xl font-bold text-green-600">{counts.green}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">Operando</div>
        </div>
        <div className="card text-center py-4">
          <div className="text-3xl font-bold text-yellow-500">{counts.yellow}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">Con alertas</div>
        </div>
        <div className="card text-center py-4">
          <div className="text-3xl font-bold text-red-600">{counts.red}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">Crítico</div>
        </div>
      </div>

      {/* Subsystem grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((subsystem) => (
          <SubsystemCard key={subsystem.id} subsystem={subsystem} role={role} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No hay subsistemas cargados.</p>
          <p className="text-sm">Ejecuta el SQL de inicialización en Supabase.</p>
        </div>
      )}
    </div>
  )
}
