export const tankStyles = {
  tank_1: {
    chart: 'var(--chart-tank_1)',
    bg: 'bg-coral-500',
    text: 'text-coral-500',
    border: 'border-coral-800',
  },
  tank_2: {
    chart: 'var(--chart-tank_2)',
    bg: 'bg-lavender-500',
    text: 'text-lavender-500',
    border: 'border-lavender-800',
  },
  tank_3: {
    chart: 'var(--chart-tank_3)',
    bg: 'bg-bronze-500',
    text: 'text-bronze-400',
    border: 'border-bronze-800',
  },
}

export const tankSeries = [
  { key: 'tank_1', name: 'Tank 1', stroke: 'var(--chart-tank_1)' },
  { key: 'tank_2', name: 'Tank 2', stroke: 'var(--chart-tank_2)' },
  { key: 'tank_3', name: 'Tank 3', stroke: 'var(--chart-tank_3)' },
] as const
