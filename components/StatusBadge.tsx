import type { Status } from '@/lib/types'

const CONFIG: Record<Status, { label: string; textColor: string; bgColor: string; dotColor: string }> = {
  green:  { label: 'Operando',    textColor: 'text-green-700',  bgColor: 'bg-green-100',  dotColor: 'bg-green-500'  },
  yellow: { label: 'Con alertas', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100', dotColor: 'bg-yellow-500' },
  red:    { label: 'Crítico',     textColor: 'text-red-700',    bgColor: 'bg-red-100',    dotColor: 'bg-red-500'    },
}

export default function StatusBadge({ status }: { status: Status }) {
  const { label, textColor, bgColor, dotColor } = CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {label}
    </span>
  )
}
