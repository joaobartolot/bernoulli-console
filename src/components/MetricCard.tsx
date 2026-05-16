import type { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Card } from './Card'

type MetricCardProps = {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  tone?: 'neutral' | 'active' | 'warning'
}

const toneStyles = {
  neutral: 'bg-dusk-900 text-dusk-500',
  active: 'bg-coral-900 text-coral-500',
  warning: 'bg-rose-900 text-rose-500',
}

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = 'neutral',
}: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-dusk-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-dusk-200">{value}</p>
          <p className="mt-2 text-sm text-lavender-500">{detail}</p>
        </div>
        <div className={twMerge('rounded-md p-2', toneStyles[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  )
}
