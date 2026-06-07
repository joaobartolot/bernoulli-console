export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-800 bg-rose-900 px-4 py-3 text-sm text-rose-300">
      <p className="font-semibold">Unable to load telemetry</p>
      <p className="mt-1 text-rose-400">{message}</p>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          className="h-24 animate-pulse rounded-lg border border-bronze-800 bg-white"
          key={index}
        />
      ))}
    </div>
  )
}
