import { Activity, RefreshCcw } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { apiBaseUrl, gatewayId, refreshRateOptions } from '../config/dashboard'
import { formatTimestamp } from '../utils/format'

type DashboardHeaderProps = {
  refreshIntervalSeconds: number
  isRefreshing: boolean
  lastLoadedAt: Date | null
  onRefresh: () => void
  onRefreshIntervalChange: (value: number) => void
}

export function DashboardHeader({
  refreshIntervalSeconds,
  isRefreshing,
  lastLoadedAt,
  onRefresh,
  onRefreshIntervalChange,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-bronze-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium uppercase text-coral-500">
          <Activity className="size-4" aria-hidden="true" />
          Bernoulli Service
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-dusk-200 sm:text-4xl">
          Industrial Production Dashboard
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-dusk-500">
          Gateway {gatewayId} polling {apiBaseUrl}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm font-medium text-dusk-400">
          Refresh
          <select
            className="h-10 rounded-md border border-bronze-700 bg-bronze-900 px-3 text-sm text-dusk-300 outline-none focus:border-coral-500"
            value={refreshIntervalSeconds}
            onChange={(event) =>
              onRefreshIntervalChange(Number(event.target.value))
            }
          >
            {refreshRateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-dusk-500 px-4 text-sm font-semibold text-bronze-900 transition hover:bg-dusk-400 disabled:cursor-wait disabled:opacity-70"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw
            className={twMerge('size-4', isRefreshing && 'animate-spin')}
            aria-hidden="true"
          />
          Refresh
        </button>

        <p className="text-xs text-dusk-500">
          Loaded {formatTimestamp(lastLoadedAt)}
        </p>
      </div>
    </header>
  )
}
