import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type DashboardPanelProps = {
  title: string
  detail?: string
  className?: string
  children: ReactNode
}

export function DashboardPanel({
  title,
  detail,
  className,
  children,
}: DashboardPanelProps) {
  return (
    <section
      className={twMerge(
        'rounded-lg border border-bronze-800 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-bronze-800 pb-3">
        <h2 className="text-base font-semibold uppercase text-rose-200">
          {title}
        </h2>
        {detail ? <p className="text-xs text-rose-400">{detail}</p> : null}
      </div>
      {children}
    </section>
  )
}
