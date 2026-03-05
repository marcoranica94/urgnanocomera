import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ContribuisciForm } from '@/components/contribuisci/ContribuisciForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contribuisci',
  description: 'Hai foto, video, audio o ricordi della storia di Urgnano? Condividili con la comunità.',
  openGraph: { title: 'Contribuisci — UrgnanoComEra' },
}

export default async function ContribuisciPage() {
  const payload = await getPayload({ config })

  const locationsResult = await payload.find({
    collection: 'locations',
    limit: 200,
    sort: 'name',
  }) as any

  const locations = (locationsResult.docs as Array<{ id: string | number; name: string }>).map(l => ({
    id: l.id,
    name: l.name,
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* Intestazione */}
      <div className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Contribuisci alla memoria di Urgnano
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Hai fotografie, filmati, registrazioni audio o ricordi scritti legati alla storia di Urgnano?
          Condividili con la comunità e aiutaci a preservare il patrimonio storico del paese.
        </p>
      </div>

      {/* Come funziona */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            n: '1',
            title: 'Compila il modulo',
            desc: 'Scegli il tipo di materiale, caricalo e aggiungi una breve descrizione.',
          },
          {
            n: '2',
            title: 'Revisione del team',
            desc: 'Il nostro team esamina il contributo per verificarne l\'autenticità storica.',
          },
          {
            n: '3',
            title: 'Pubblicazione',
            desc: 'Il materiale approvato viene pubblicato nell\'archivio con il tuo nome.',
          },
        ].map(step => (
          <div key={step.n} className="flex gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-lg font-bold text-primary">
              {step.n}
            </div>
            <div>
              <p className="font-medium text-card-foreground">{step.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <ContribuisciForm locations={locations} />
    </div>
  )
}
