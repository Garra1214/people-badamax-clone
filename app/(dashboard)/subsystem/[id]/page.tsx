import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/StatusBadge'
import UpdateTimeline from '@/components/UpdateTimeline'
import EditSubsystemModal from '@/components/EditSubsystemModal'
import SubsystemAudioButton from '@/components/SubsystemAudioButton'
import type { Subsystem, SubsystemUpdate, Role } from '@/lib/types'

export const revalidate = 0

const ICONS: Record<string, string> = {
  atraccion:   '🎯',
  ingreso:     '🚀',
  desarrollo:  '📈',
  desempeno:   '⭐',
  experiencia: '💚',
  operacion:   '⚙️',
}

interface Props {
  params: { id: string }
  searchParams: { edit?: string }
}

export default async function SubsystemPage({ params, searchParams }: Props) {
  const { id } = params
  const isEditing = searchParams.edit === 'true'

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: subsystem },
    { data: updates },
    { data: profile },
  ] = await Promise.all([
    supabase.from('subsystems').select('*').eq('id', id).single(),
    supabase.from('updates').select('*').eq('subsystem_id', id).order('created_at', { ascending: false }),
    supabase.from('users').select('role').eq('id', user.id).single(),
  ])

  if (!subsystem) notFound()

  const role: Role = profile?.role ?? 'viewer'
  const sub = subsystem as Subsystem
  const updateList = (updates as SubsystemUpdate[]) ?? []
  const icon = ICONS[id] ?? '📊'

  const problems = updateList.filter((u) => u.type === 'problema')
  const advances = updateList.filter((u) => u.type === 'avance')
  const risks    = updateList.filter((u) => u.type === 'riesgo')

  const STATUS_BG  = { green: 'bg-green-50',  yellow: 'bg-yellow-50',  red: 'bg-red-50'  }
  const STATUS_TXT = { green: 'text-green-900', yellow: 'text-yellow-900', red: 'text-red-900' }
  const STATUS_LBL = { green: 'text-green-600', yellow: 'text-yellow-600', red: 'text-red-600' }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-700 transition-colors">Panel de Control</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{sub.name}</span>
      </div>

      {/* Hero card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${STATUS_BG[sub.status]}`}>
              {icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{sub.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={sub.status} />
                {sub.updated_at && (
                  <span className="text-xs text-gray-400">
                    Actualizado {new Date(sub.updated_at).toLocaleDateString('es-CL', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {role === 'admin' && (
            <div className="flex items-center gap-2">
              <Link href={`/subsystem/${id}?edit=true`} className="btn-secondary">
                ✏️ Editar
              </Link>
              <SubsystemAudioButton subsystemId={id} subsystemName={sub.name} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPIs */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">KPIs y Estado</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xs text-blue-500 uppercase tracking-wide font-semibold mb-1">KPI Principal</div>
                <div className="text-lg font-bold text-blue-900">{sub.kpi}</div>
              </div>
              <div className={`rounded-xl p-4 ${STATUS_BG[sub.status]}`}>
                <div className={`text-xs uppercase tracking-wide font-semibold mb-1 ${STATUS_LBL[sub.status]}`}>
                  Alerta
                </div>
                <div className={`text-lg font-bold ${STATUS_TXT[sub.status]}`}>{sub.alert}</div>
              </div>
            </div>
            {sub.description && (
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">{sub.description}</p>
            )}
          </div>

          {/* Active problems */}
          {problems.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                Problemas Activos
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                  {problems.length}
                </span>
              </h2>
              <div className="space-y-3">
                {problems.map((p) => (
                  <div key={p.id} className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.priority === 'alta'  ? 'bg-red-200 text-red-800' :
                        p.priority === 'media' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        Prioridad {p.priority}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{p.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{p.description}</p>
                    {p.impact && (
                      <p className="text-red-600 text-xs mt-2 font-medium">Impacto: {p.impact}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-5">
              Últimas Actualizaciones
              {updateList.length > 0 && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">
                  {updateList.length}
                </span>
              )}
            </h2>
            {updateList.length > 0 ? (
              <UpdateTimeline updates={updateList} />
            ) : (
              <div className="text-center py-10 text-gray-400">
                <span className="text-3xl block mb-2">📋</span>
                <p className="text-sm">Sin actualizaciones registradas.</p>
                {role === 'admin' && (
                  <p className="text-xs mt-1">Usa el botón &quot;Grabar actualización&quot; para agregar una.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-3">
              {[
                { label: 'Total actualizaciones', value: updateList.length, color: 'text-gray-900' },
                { label: 'Problemas activos',     value: problems.length,  color: problems.length > 0 ? 'text-red-600'    : 'text-green-600' },
                { label: 'Avances registrados',   value: advances.length,  color: advances.length > 0 ? 'text-green-600'  : 'text-gray-500'  },
                { label: 'Riesgos identificados',  value: risks.length,    color: risks.length > 0    ? 'text-yellow-600' : 'text-gray-500'  },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`font-bold text-base ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {role === 'admin' && (
            <div className="card bg-blue-50 border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm">Acciones rápidas</h3>
              <div className="space-y-2">
                <Link
                  href={`/subsystem/${id}?edit=true`}
                  className="w-full flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 py-1 transition-colors"
                >
                  ✏️ Editar estado y KPIs
                </Link>
                <SubsystemAudioButton subsystemId={id} subsystemName={sub.name} />
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && role === 'admin' && <EditSubsystemModal subsystem={sub} />}
    </div>
  )
}
