/**
 * DESIGN TOKENS — UrgnanoComEra
 *
 * File UNICO per tutta l'identità visiva del progetto.
 * - Fase 1 (attuale): palette temporanea prodotta da Claude
 * - Fase 2: il team grafico esterno sostituirà solo questo file
 *
 * I valori HSL vengono iniettati come CSS custom properties in globals.css.
 * Tailwind legge da lì tramite tailwind.config.ts.
 */

export const tokens = {
  // ─── Tipografia ──────────────────────────────────────────────
  fonts: {
    // Serif per titoli: evoca la carta stampata d'epoca
    serif: '"Playfair Display", Georgia, serif',
    // Sans per corpo testo e UI
    sans: '"Inter", system-ui, sans-serif',
  },

  // ─── Radius ──────────────────────────────────────────────────
  radius: '0.5rem',

  // ─── Palette Light (tema chiaro) ─────────────────────────────
  // Toni caldi seppia/crema evocativi della carta fotografica antica
  light: {
    background:          '40 30% 97%',   // bianco caldo
    foreground:          '25 25% 15%',   // marrone scuro
    primary:             '220 60% 40%',  // blu istituzionale Comune di Urgnano
    primaryForeground:   '0 0% 100%',
    secondary:           '35 40% 88%',   // beige seppia
    secondaryForeground: '25 25% 20%',
    muted:               '35 25% 92%',
    mutedForeground:     '25 15% 45%',
    accent:              '35 55% 65%',   // oro antico (accento storico)
    accentForeground:    '25 25% 10%',
    card:                '40 25% 94%',
    cardForeground:      '25 25% 15%',
    border:              '35 20% 82%',
    input:               '35 20% 82%',
    ring:                '220 60% 40%',
  },

  // ─── Palette Dark (tema scuro) ────────────────────────────────
  // Antracite profondo con accenti oro — come un archivio notturno
  dark: {
    background:          '220 15% 10%',  // antracite
    foreground:          '35 20% 90%',   // bianco avorio
    primary:             '220 60% 60%',  // blu chiaro su sfondo scuro
    primaryForeground:   '0 0% 100%',
    secondary:           '220 12% 18%',  // grigio ardesia
    secondaryForeground: '35 15% 80%',
    muted:               '220 12% 15%',
    mutedForeground:     '35 10% 55%',
    accent:              '42 70% 55%',   // oro su sfondo scuro
    accentForeground:    '220 15% 8%',
    card:                '220 13% 13%',
    cardForeground:      '35 20% 90%',
    border:              '220 12% 22%',
    input:               '220 12% 22%',
    ring:                '220 60% 60%',
  },
} as const

export type ThemeTokens = typeof tokens.light
