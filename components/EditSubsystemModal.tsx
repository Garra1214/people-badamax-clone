'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Subsystem, Status } from '@/lib/types'

export default function EditSubsystemModal({ subsystem }: { subsystem: Subsystem }) {
  const [name, setName] = useState(subsystem.name)
  const [status, setStatus] = useState<Status>(subsystem.status)
  const [kpi, setKpi] = useState(subsystem.kpi)
  const [alert, setAlert] = useState(subsystem.alert)
  const [description, setDescription] = useState(subsystem.description ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function handleClose() {
    router.push(`/subsystem/${subsystem.id}`)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error: dbError } = await supabase
      .from('subsystems')
      .update({ name, status, kpi, alert, description, updated_at: new Date().toISOString() })
      .eq('id', subsystem.id)

    if (dbError) {
      setError('Error al guardar. Verifica tus permisos.')
      setSaving(false)
    } else {
      router.push(`/subsystem/${subsystem.id}`)
      router.refresh()
    }
  }

  const STATUS_OPTIONS: { value: Status; label: string; activeClass: string; dotClass: string }[] = [
    { value: 'green',  label: 'Verde',     activeClass: 'border-green-500 bg-green-50 text-green-700',   dotClass: 'bg-green-500'  },
    { value: 'yellow', label: 'Amarillo',  activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700', dotClass: 'bg-yellow-500' },
    { value: 'red',    label: 'Rojo',      activeClass: 'border-red-500 bg-red-50 text-red-700',          dotClass: 'bg-red-500'    },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Editar subsistema</h2>
            <p className="text-sm text-gray-500 mt-0.5">{subsystem.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado del semáforo</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                    status === opt.value ? opt.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${opt.dotClass}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">KPI Principal</label>
            <input
              type="text"
              value={kpi}
              onChange={(e) => setKpi(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ej: 45 postulantes activos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alerta / Estado resumido</label>
            <input
              type="text"
              value={alert}
              onChange={(e) => setAlert(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ej: Pipeline saludable"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descripción detallada del estado actual..."
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleClose} disabled={saving} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
