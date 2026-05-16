import type { LucideIcon } from 'lucide-react'
import { Droplets, Gauge, ToggleRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { TankSummary } from '../types/dashboard'
import {
  formatFlow,
  formatLiters,
  formatStatus,
  formatTimestamp,
} from '../utils/format'
import { Card } from './Card'

type TankCardProps = {
  tank: TankSummary
}

export function TankCard({ tank }: TankCardProps) {
  const valveTone = tank.valveOpen ? 'text-coral-500' : 'text-dusk-500'

  return (
    <Card className="flex min-h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-dusk-500">{tank.name}</p>
          <h2 className="mt-2 text-xl font-semibold text-dusk-200">
            {formatFlow(tank.latestFlow)}
          </h2>
        </div>
        <div className="rounded-md bg-bronze-800 p-2 text-coral-500">
          <Droplets className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <TankStat
          icon={ToggleRight}
          label="Valve"
          value={formatStatus(tank.valveOpen)}
          className={valveTone}
        />
        <TankStat
          icon={Gauge}
          label="Quality"
          value={tank.quality ?? 'Unknown'}
        />
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <ProductionRow label="Today" value={tank.todayProduction} />
        <ProductionRow label="Month" value={tank.monthProduction} />
        <ProductionRow label="Year" value={tank.yearProduction} />
      </dl>

      <p className="mt-auto pt-5 text-xs text-dusk-500">
        Last sample {formatTimestamp(tank.lastEventTime)}
      </p>
    </Card>
  )
}

type TankStatProps = {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}

function TankStat({ icon: Icon, label, value, className }: TankStatProps) {
  return (
    <div className="rounded-md border border-bronze-800 bg-bronze-900 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-dusk-500">
        <Icon className={twMerge('size-4', className)} aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-dusk-300">{value}</p>
    </div>
  )
}

type ProductionRowProps = {
  label: string
  value: number
}

function ProductionRow({ label, value }: ProductionRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-bronze-800 px-3 py-2">
      <dt className="text-dusk-500">{label}</dt>
      <dd className="font-semibold text-dusk-300">{formatLiters(value)}</dd>
    </div>
  )
}
