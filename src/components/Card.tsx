import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={twMerge(
        'rounded-lg border border-bronze-800 bg-bronze-900 p-5 shadow-sm',
        className,
      )}
    >
      {children}
    </section>
  )
}
