const litersFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const flowFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatLiters(value: number): string {
  return `${litersFormatter.format(value)} L`
}

export function formatFlow(value: number | null): string {
  if (value === null) {
    return 'No data'
  }

  return `${flowFormatter.format(value)} L/min`
}

export function formatTimestamp(value: Date | null): string {
  if (!value) {
    return 'No samples'
  }

  return timeFormatter.format(value)
}

export function formatStatus(value: boolean | null): string {
  if (value === null) {
    return 'Unknown'
  }

  return value ? 'On' : 'Off'
}
