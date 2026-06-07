import { CalendarDays, RefreshCcw } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { refreshRateOptions } from '../../config/dashboard'
import { formatDateInput, formatTimestamp } from '../../utils/format'

type TopBarProps = {
  selectedDate: Date
  refreshIntervalSeconds: number
  isRefreshing: boolean
  lastLoadedAt: Date | null
  onRefresh: () => void
  onRefreshIntervalChange: (value: number) => void
  onDateChange: (value: Date) => void
}

export function TopBar({
  selectedDate,
  refreshIntervalSeconds,
  isRefreshing,
  lastLoadedAt,
  onRefresh,
  onRefreshIntervalChange,
  onDateChange,
}: TopBarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-lg border border-bronze-800 bg-white px-5 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-end gap-5">
        <h1 className="text-2xl font-semibold text-rose-200">Dashboard</h1>
        <p className="hidden text-sm text-rose-400 sm:block">
          Overview of production and process
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex h-11 items-center gap-2 rounded-md border border-bronze-800 bg-bronze-900 px-3 text-rose-300">
          <CalendarDays className="size-5" aria-hidden="true" />
          <input
            className="bg-transparent text-sm outline-none"
            type="date"
            value={formatDateInput(selectedDate)}
            onChange={(event) => onDateChange(new Date(event.target.value))}
          />
        </label>

        <button
          className="flex size-11 items-center justify-center rounded-md border border-bronze-800 bg-bronze-900 text-rose-300 disabled:cursor-wait disabled:opacity-70"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh telemetry"
        >
          <RefreshCcw
            className={twMerge('size-5', isRefreshing && 'animate-spin')}
            aria-hidden="true"
          />
        </button>

        <label className="flex h-11 items-center gap-2 rounded-md border border-bronze-800 bg-bronze-900 px-3 text-rose-300">
          Auto refresh
          <select
            className="bg-transparent text-sm outline-none"
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
          <span
            className={twMerge(
              'size-2 rounded-full',
              refreshIntervalSeconds > 0 ? 'bg-coral-500' : 'bg-dusk-800',
            )}
          />
        </label>

        <p className="text-xs text-rose-400">
          Loaded {formatTimestamp(lastLoadedAt)}
        </p>
      </div>
    </header>
  )
}
