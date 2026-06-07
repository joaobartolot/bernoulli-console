import { Fan } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { DashboardTelemetry, TankSummary } from '../../types/dashboard'
import { formatLiters, formatStatus } from '../../utils/format'
import { DashboardPanel } from './DashboardPanel'
import { tankStyles } from './dashboardStyles'

type ProcessOverviewProps = {
  dashboard: DashboardTelemetry
}

export function ProcessOverview({ dashboard }: ProcessOverviewProps) {
  return (
    <DashboardPanel title="Process Overview" className="overflow-hidden">
      <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
        <div className="flex items-center justify-center">
          <div className="rounded-lg border border-bronze-800 bg-bronze-900 p-6 text-center">
            <p className="text-sm font-semibold uppercase text-rose-200">
              Pump
            </p>
            <div
              className={twMerge(
                'mx-auto mt-4 flex size-20 items-center justify-center rounded-full border-4',
                dashboard.pumpRunning
                  ? 'border-coral-500 bg-coral-900 text-coral-500'
                  : 'border-lavender-800 bg-white text-lavender-500',
              )}
            >
              <Fan
                className={twMerge(
                  'size-10',
                  dashboard.pumpRunning && 'animate-spin',
                )}
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-sm text-rose-300">
              {formatStatus(dashboard.pumpRunning)}
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          {dashboard.tanks.map((tank, index) => (
            <ProcessLine key={tank.id} tank={tank} index={index} />
          ))}
        </div>
      </div>
    </DashboardPanel>
  )
}

function ProcessLine({ tank, index }: { tank: TankSummary; index: number }) {
  const style = tankStyles[tank.id]

  return (
    <div className="grid items-center gap-3 text-sm md:grid-cols-[110px_1fr_130px_110px_150px]">
      <div>
        <p className="font-semibold uppercase text-rose-200">
          Valve {index + 1}
        </p>
        <p
          className={twMerge('mt-1 font-medium', tank.valveOpen && style.text)}
        >
          {tank.valveOpen ? 'Open' : 'Closed'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={twMerge(
            'h-2 flex-1 rounded-full',
            tank.valveOpen ? style.bg : 'bg-bronze-800',
          )}
        />
        <span
          className={twMerge(
            'flex size-12 items-center justify-center rounded-md border bg-white',
            tank.valveOpen
              ? `${style.border} ${style.text}`
              : 'border-bronze-800 text-lavender-500',
          )}
        >
          <ValveIcon isOpen={Boolean(tank.valveOpen)} />
        </span>
      </div>

      <div className="mx-auto flex size-20 flex-col items-center justify-center rounded-full border-4 border-coral-500 bg-white text-center">
        <p className="text-xl font-semibold text-rose-200">
          {tank.latestFlow === null ? '--' : tank.latestFlow.toFixed(1)}
        </p>
        <p className="text-[10px] text-rose-400">L/min</p>
      </div>

      <div className="hidden h-2 rounded-full bg-bronze-800 md:block" />

      <div className="flex items-center gap-3">
        <TankVessel tank={tank} />
        <div>
          <p className="font-semibold uppercase text-rose-200">{tank.name}</p>
          <p className="mt-1 text-xl font-semibold text-rose-200">
            {formatLiters(tank.yearProduction)}
          </p>
          <p className="text-xs text-rose-400">Total production</p>
        </div>
      </div>
    </div>
  )
}

function ValveIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={twMerge(
        'relative block h-8 w-12',
        isOpen ? 'text-coral-500' : 'text-lavender-500',
      )}
      aria-hidden="true"
    >
      <span className="absolute left-1/2 top-0 h-3 w-0.5 -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-1/2 top-0 h-1 w-6 -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-1/2 top-3 h-2 w-0.5 -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-1 top-4 h-0 w-0 border-y-[8px] border-l-[18px] border-y-transparent border-l-current" />
      <span className="absolute right-1 top-4 h-0 w-0 border-y-[8px] border-r-[18px] border-y-transparent border-r-current" />
      <span className="absolute left-1/2 top-[17px] size-2 -translate-x-1/2 rounded-full bg-current" />
    </span>
  )
}

function TankVessel({ tank }: { tank: TankSummary }) {
  const style = tankStyles[tank.id]
  const fillPercent = Math.min(
    86,
    Math.max(18, (tank.yearProduction / Math.max(tank.yearProduction, 1)) * 70),
  )

  return (
    <div className="relative h-20 w-12 overflow-hidden rounded-b-lg rounded-t-full border border-rose-700 bg-white">
      <div
        className={twMerge('absolute inset-x-0 bottom-0 opacity-80', style.bg)}
        style={{ height: `${fillPercent}%` }}
      />
      <div className="absolute inset-0 grid grid-rows-5 px-2 py-3">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="border-t border-rose-700/40" />
        ))}
      </div>
    </div>
  )
}
