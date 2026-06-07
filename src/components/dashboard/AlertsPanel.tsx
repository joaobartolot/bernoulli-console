import { ShieldCheck } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { DashboardTelemetry } from '../../types/dashboard'
import { DashboardPanel } from './DashboardPanel'

export function AlertsPanel({ dashboard }: { dashboard: DashboardTelemetry }) {
  const isNormal = dashboard.healthStatus === 'normal'

  return (
    <DashboardPanel
      title="Alerts"
      detail={`${dashboard.alertCount} Active`}
      className="text-center"
    >
      <div className="flex min-h-52 flex-col items-center justify-center">
        <div
          className={twMerge(
            'flex size-20 items-center justify-center rounded-full',
            isNormal
              ? 'bg-coral-900 text-coral-500'
              : 'bg-rose-900 text-rose-500',
          )}
        >
          <ShieldCheck className="size-12" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-rose-200">
          {isNormal ? 'All systems normal' : 'Telemetry needs attention'}
        </p>
        <p className="mt-2 text-sm text-rose-400">
          {isNormal
            ? 'No active telemetry alarms'
            : 'Check stale or bad-quality samples'}
        </p>
      </div>
    </DashboardPanel>
  )
}
