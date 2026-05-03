'use client'

import Link from 'next/link'
import { useState } from 'react'
import StatusBadge from './StatusBadge'
import AudioRecorder from './AudioRecorder'
import type { Subsystem, Role } from '@/lib/types'

const ICONS: Record<string, string> = {
  atraccion:   '🎯',
  ingreso:     '🚀',
  desarrollo:  '📈',
  desempeno:   '⭐',
  experiencia: '💚',
  operacion:   '⚙️',
}

const ALERT_BG: Record<string, string> = {
  green:  'bg-green-50',
  yellow: 'bg-yellow-50',
  red:    'bg-red-50',
}

const ALERT_TEXT: Record<string, string> = {
  green:  'text-green-700',
  yellow: 'text-yellow-700',
  red:    'text-red-700',
}

interface Props {
  subsystem: Subsystem
  role: Role
}

export default function SubsystemCard({ subsystem, role }: Props) {
  const [showAudio, setShowAudio] = useState(false)
  const icon = ICONS[subsystem.id] ?? '📊'

  return (
    <>
      <div className="card hover:shadow-md transition-all duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${ALERT_BG[subsystem.status]}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{subsystem.name}</h3>
            <div className="mt-1">
              <StatusBadge status={subsystem.status} />
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 mb-2">
          <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">KPI Principal</div>
          <div className="text-sm font-semibold text-gray-800 truncate">{subsystem.kpi}</div>
        </div>

        {/* Alert */}
        <div className={`rounded-lg px-3 py-2.5 mb-5 ${ALERT_BG[subsystem.status]}`}>
          <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Alerta</div>
          <div className={`text-sm font-medium ${ALERT_TEXT[subsystem.status]} truncate`}>
            {subsystem.alert}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 flex-wrap">
          <Link href={`/subsystem/${subsystem.id}`} className="btn-primary flex-1 text-center">
            Ver detalle
          </Link>
          {role === 'admin' && (
            <>
              <Link href={`/subsystem/${subsystem.id}?edit=true`} className="btn-secondary">
                ✏️
              </Link>
              <button
                onClick={() => setShowAudio(true)}
                className="btn-secondary"
                title="Grabar actualización"
              >
                🎤
              </button>
            </>
          )}
        </div>
      </div>

      {showAudio && (
        <AudioRecorder
          subsystemId={subsystem.id}
          subsystemName={subsystem.name}
          onClose={() => setShowAudio(false)}
        />
      )}
    </>
  )
}
