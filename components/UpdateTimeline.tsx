import type { SubsystemUpdate } from '@/lib/types'

const TYPE_CONFIG = {
  problema: { label: 'Problema', textColor: 'text-red-700',    bgColor: 'bg-red-100',    dotColor: 'bg-red-500',    icon: '🔴' },
  avance:   { label: 'Avance',   textColor: 'text-green-700',  bgColor: 'bg-green-100',  dotColor: 'bg-green-500',  icon: '✅' },
  riesgo:   { label: 'Riesgo',   textColor: 'text-yellow-700', bgColor: 'bg-yellow-100', dotColor: 'bg-yellow-500', icon: '⚠️' },
}

const PRIORITY_CONFIG = {
  alta:  { label: 'Alta',  textColor: 'text-red-700',    bgColor: 'bg-red-100'    },
  media: { label: 'Media', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  baja:  { label: 'Baja',  textColor: 'text-gray-600',   bgColor: 'bg-gray-100'   },
}

export default function UpdateTimeline({ updates }: { updates: SubsystemUpdate[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
      <div className="space-y-4">
        {updates.map((update) => {
          const type = TYPE_CONFIG[update.type]
          const priority = PRIORITY_CONFIG[update.priority]
          return (
            <div key={update.id} className="relative flex gap-4 pl-10">
              <div className={`absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 border-white ${type.dotColor}`} />
              <div className="flex-1 bg-gray-50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.bgColor} ${type.textColor}`}>
                      {type.icon} {type.label}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.bgColor} ${priority.textColor}`}>
                      Prioridad {priority.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(update.created_at).toLocaleDateString('es-CL', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{update.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{update.description}</p>
                {update.impact && (
                  <p className="text-gray-500 text-xs mt-2 border-t border-gray-200 pt-2">
                    <span className="font-medium">Impacto:</span> {update.impact}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
