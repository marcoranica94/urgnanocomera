import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'UrgnanoComEra — La memoria storica di Urgnano',
    template: '%s | UrgnanoComEra',
  },
  description:
    'Fotografie, testimonianze e storie che raccontano il passato di Urgnano. Esplora la memoria storica del paese attraverso immagini, voci e luoghi.',
  openGraph: {
    siteName: 'UrgnanoComEra',
    locale: 'it_IT',
    type: 'website',
  },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
