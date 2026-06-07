import { twMerge } from 'tailwind-merge'
import type { DashboardTelemetry } from '../../types/dashboard'
import { formatClock, formatFlow, formatStatus } from '../../utils/format'
import { DashboardPanel } from './DashboardPanel'

type LiveStatusProps = {
  dashboard: DashboardTelemetry
  lastLoadedAt: Date | null
}

export function LiveStatus({ dashboard, lastLoadedAt }: LiveStatusProps) {
  return (
    <DashboardPanel title="Live Status">
      <StatusRow
        label="Pump Status"
        value={formatStatus(dashboard.pumpRunning)}
      />
      <StatusRow
        label="Active Tank"
        value={dashboard.activeTank?.name ?? 'Unknown'}
        pill={Boolean(dashboard.activeTank)}
      />
      <StatusRow label="System Mode" value="Automatic" />
      <StatusRow
        label="Total Flow"
        value={formatFlow(dashboard.totalCurrentFlow)}
      />
      <StatusRow label="Last Updated" value={formatClock(lastLoadedAt)} />
    </DashboardPanel>
  )
}

function StatusRow({
  label,
  value,
  pill = false,
}: {
  label: string
  value: string
  pill?: boolean
}) {
  return (
    <div className="flex items-center justify-between border-b border-bronze-800 py-3 text-sm last:border-b-0">
      <span className="text-rose-200">{label}</span>
      <span
        className={twMerge(
          'font-semibold text-coral-500',
          pill && 'rounded-md bg-coral-500 px-3 py-1 text-white',
        )}
      >
        {value}
      </span>
    </div>
  )
}
