export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero — placeholder: Sprint 2.2 */}
      <section className="flex min-h-[60vh] items-center justify-center bg-secondary/40 px-4 py-24">
        <div className="max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            La memoria di Urgnano,<br />
            <span className="text-accent">come era.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Fotografie, testimonianze e storie che raccontano il passato del nostro paese.
            Esplora, scopri, contribuisci.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/archivio"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Esplora l&apos;archivio
            </a>
            <a
              href="/contribuisci"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Contribuisci
            </a>
          </div>
        </div>
      </section>

      {/* Sezioni placeholder — Sprint 2.2 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-center text-muted-foreground text-sm">
          Contenuti in arrivo — Sprint 2.2
        </p>
      </section>
    </div>
  )
}
