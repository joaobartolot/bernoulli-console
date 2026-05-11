import { twMerge } from 'tailwind-merge'

function App() {
  const styles = {
    page: twMerge('min-h-svh bg-bronze-900 text-dusk-500'),
    main: twMerge(
      'mx-auto flex min-h-svh w-full max-w-5xl items-center px-6 py-16',
    ),
    content: twMerge('max-w-2xl'),
    label: twMerge(
      'text-sm font-medium uppercase tracking-wide text-coral-500',
    ),
    title: twMerge('mt-4 text-4xl font-semibold text-dusk-300 sm:text-5xl'),
    copy: twMerge('mt-5 max-w-xl text-base leading-7 text-lavender-500'),
    status: twMerge(
      'mt-8 inline-flex rounded border border-bronze-700 bg-bronze-800 px-4 py-2 text-sm font-medium text-dusk-400',
    ),
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.content} aria-labelledby="page-title">
          <p className={styles.label}>Visualization layer</p>
          <h1 className={styles.title} id="page-title">
            Bernoulli Console
          </h1>
          <p className={styles.copy}>
            A read-only frontend for operational telemetry visibility.
          </p>
          <p className={styles.status}>Initial Vite setup ready</p>
        </section>
      </main>
    </div>
  )
}

export default App
