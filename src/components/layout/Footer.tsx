import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Col 1 — Brand */}
          <div>
            <p className="font-serif text-lg font-bold text-foreground">UrgnanoComEra</p>
            <p className="mt-2 text-sm text-muted-foreground">
              La memoria storica di Urgnano, raccontata da chi l&apos;ha vissuta.
            </p>
          </div>

          {/* Col 2 — Sezioni */}
          <div>
            <p className="text-sm font-semibold text-foreground">Esplora</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/archivio" className="hover:text-foreground transition-colors">Archivio fotografico</Link></li>
              <li><Link href="/testimonianze" className="hover:text-foreground transition-colors">Testimonianze</Link></li>
              <li><Link href="/mappa" className="hover:text-foreground transition-colors">Mappa interattiva</Link></li>
              <li><Link href="/timeline" className="hover:text-foreground transition-colors">Timeline storica</Link></li>
              <li><Link href="/storie" className="hover:text-foreground transition-colors">Storie e racconti</Link></li>
            </ul>
          </div>

          {/* Col 3 — Info */}
          <div>
            <p className="text-sm font-semibold text-foreground">Informazioni</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contribuisci" className="hover:text-foreground transition-colors">Contribuisci</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li>
                <a
                  href="https://www.comune.urgnano.bg.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Comune di Urgnano
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            Un progetto dell&apos;Assessorato alla Digitalizzazione del Comune di Urgnano ·{' '}
            <Link href="/privacy" className="hover:text-foreground underline">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
