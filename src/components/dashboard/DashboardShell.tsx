import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type DashboardShellProps = {
  header: ReactNode
  children: ReactNode
}

const navItems = [{ label: 'Dashboard', icon: LayoutDashboard, active: true }]

export function DashboardShell({ header, children }: DashboardShellProps) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 overflow-hidden bg-bronze-900 text-dusk-200 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <Sidebar />

      <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden p-3 lg:p-4">
        <div className="mx-auto flex h-full w-full max-w-[1680px] min-h-0 flex-col">
          <div className="shrink-0">{header}</div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 pt-3 pb-3 lg:pb-4">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-full min-h-0 w-60 flex-col bg-dusk-300 text-bronze-900 lg:flex">
      <div className="flex items-center gap-3 px-6 py-7">
        <WineMark />
        <p className="text-2xl font-semibold text-bronze-900">WineFactory</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4">
        {navItems.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="space-y-4 px-5 pb-6 text-sm">
        <div>
          <p className="mb-2 text-xs uppercase text-bronze-800">Plant</p>
          <div className="flex items-center justify-between rounded-md border border-lavender-500 bg-lavender-400 px-4 py-3 text-bronze-900">
            Main Winery
            <SlidersHorizontal className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="rounded-md bg-lavender-400 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-bronze-900 text-lavender-500">
              OP
            </div>
            <div>
              <p className="font-medium text-bronze-900">Operator</p>
              <p className="text-xs text-bronze-800">admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

type SidebarItemProps = {
  label: string
  icon: LucideIcon
  active?: boolean
}

function SidebarItem({ label, icon: Icon, active = false }: SidebarItemProps) {
  return (
    <div
      className={twMerge(
        'flex items-center gap-3 rounded-md px-4 py-3 text-sm text-bronze-900',
        active && 'bg-lavender-500 font-semibold',
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
      {label}
    </div>
  )
}

function WineMark() {
  return (
    <div className="grid w-8 grid-cols-3 gap-1">
      {Array.from({ length: 9 }, (_, index) => (
        <span key={index} className="size-2 rounded-full bg-coral-700" />
      ))}
    </div>
  )
}
