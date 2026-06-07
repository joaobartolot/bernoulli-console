import { Database } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { twMerge } from 'tailwind-merge'
import type { DashboardTelemetry, TankSummary } from '../../types/dashboard'
import { formatLiters, formatPercentChange } from '../../utils/format'
import { DashboardPanel } from './DashboardPanel'
import { tankStyles } from './dashboardStyles'

type ProductionTotalsProps = {
  title: string
  detail: string
  tanks: TankSummary[]
  valueKey: 'yearProduction' | 'todayProduction'
}

export function ProductionTotals({
  title,
  detail,
  tanks,
  valueKey,
}: ProductionTotalsProps) {
  return (
    <DashboardPanel title={title} detail={detail}>
      <div className="grid gap-3 md:grid-cols-3">
        {tanks.map((tank) => (
          <TankMetric
            key={tank.id}
            tank={tank}
            value={formatLiters(tank[valueKey])}
          />
        ))}
      </div>
    </DashboardPanel>
  )
}

export function YearlyProduction({
  tanks,
  selectedYear,
}: {
  tanks: TankSummary[]
  selectedYear: number
}) {
  return (
    <DashboardPanel title="Yearly Production" detail="Selected year">
      <div className="grid gap-3 md:grid-cols-3">
        {tanks.map((tank) => (
          <TankMetric
            key={tank.id}
            tank={tank}
            value={formatLiters(tank.yearProduction)}
            detail={formatPercentChange(
              tank.yearChangePercent,
              selectedYear - 1,
            )}
            trend={tank.yearChangePercent}
          />
        ))}
      </div>
    </DashboardPanel>
  )
}

export function ProductionSummary({
  dashboard,
}: {
  dashboard: DashboardTelemetry
}) {
  return (
    <DashboardPanel title="Production Summary" detail="Selected year">
      <div className="grid items-center gap-4 md:grid-cols-[0.8fr_1fr]">
        <div className="relative h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dashboard.productionShare}
                dataKey="value"
                innerRadius="54%"
                outerRadius="86%"
              >
                {dashboard.productionShare.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
            <div>
              <p className="text-xs uppercase text-rose-400">Total</p>
              <p className="text-lg font-semibold text-rose-200">
                {formatLiters(dashboard.totalYearProduction)}
              </p>
            </div>
          </div>
        </div>
        <TankLegend dashboard={dashboard} showPercent />
      </div>
    </DashboardPanel>
  )
}

export function TankLegend({
  dashboard,
  showPercent = false,
}: {
  dashboard: DashboardTelemetry
  showPercent?: boolean
}) {
  return (
    <div className="space-y-3 text-sm">
      {dashboard.tanks.map((tank) => {
        const percent =
          dashboard.totalYearProduction > 0
            ? (tank.yearProduction / dashboard.totalYearProduction) * 100
            : 0

        return (
          <div
            key={tank.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={twMerge('size-3 rounded-sm', tankStyles[tank.id].bg)}
              />
              <span className="text-rose-200">{tank.name}</span>
            </div>
            <span className="text-rose-200">
              {formatLiters(tank.yearProduction)}
              {showPercent ? ` (${percent.toFixed(1)}%)` : null}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function TankMetric({
  tank,
  value,
  detail,
  trend,
}: {
  tank: TankSummary
  value: string
  detail?: string
  trend?: number | null
}) {
  const style = tankStyles[tank.id]

  return (
    <div className="flex items-center gap-4 rounded-lg border border-bronze-800 bg-white p-4">
      <div
        className={twMerge(
          'flex size-14 items-center justify-center rounded-full text-white',
          style.bg,
        )}
      >
        <Database className="size-6" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-rose-200">{tank.name}</p>
        <p className="mt-1 text-xl font-semibold text-rose-200">{value}</p>
        {detail ? (
          <p
            className={twMerge(
              'mt-1 text-xs text-dusk-500',
              trend !== null &&
                trend !== undefined &&
                (trend >= 0 ? 'text-dusk-500' : 'text-coral-500'),
            )}
          >
            {detail}
          </p>
        ) : null}
      </div>
    </div>
  )
}
