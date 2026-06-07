import { twMerge } from 'tailwind-merge'
import type { DashboardTelemetry } from '../../types/dashboard'
import { formatClock } from '../../utils/format'
import { DashboardPanel } from './DashboardPanel'

export function RecentEvents({ dashboard }: { dashboard: DashboardTelemetry }) {
  return (
    <DashboardPanel title="Recent Events">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-bronze-800 text-xs text-rose-400">
            <tr>
              <th className="py-2 font-medium">Time</th>
              <th className="py-2 font-medium">Event</th>
              <th className="py-2 font-medium">Details</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.recentEvents.map((event) => (
              <tr
                key={event.id}
                className="border-b border-bronze-800 last:border-0"
              >
                <td className="py-2 text-rose-300">
                  {formatClock(event.time)}
                </td>
                <td className="py-2 font-medium text-rose-200">
                  {event.event}
                </td>
                <td className="py-2 text-rose-400">{event.details}</td>
                <td className="py-2">
                  <span
                    className={twMerge(
                      'font-medium',
                      event.status === 'Warning'
                        ? 'text-coral-500'
                        : event.status === 'Success'
                          ? 'text-dusk-500'
                          : 'text-lavender-500',
                    )}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
            {dashboard.recentEvents.length === 0 ? (
              <tr>
                <td className="py-5 text-rose-400" colSpan={4}>
                  No telemetry events loaded.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  )
}
