/**
 * Email utility — UrgnanoComEra
 *
 * Usa nodemailer con SMTP configurato via variabili d'ambiente.
 * Se le variabili non sono presenti, le email vengono skippate silenziosamente
 * (comportamento atteso in locale / staging senza SMTP).
 *
 * Variabili d'ambiente richieste per l'invio:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAIL
 */

import nodemailer from 'nodemailer'

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT ?? '587', 10),
    secure: parseInt(SMTP_PORT ?? '587', 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

const FROM = process.env.SMTP_FROM ?? 'noreply@urgnanoturistica.it'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

async function send(options: nodemailer.SendMailOptions) {
  const transport = createTransport()
  if (!transport) return // SMTP non configurato — skip silenzioso
  try {
    await transport.sendMail({ from: FROM, ...options })
  } catch (err) {
    // Non bloccare il flusso se l'email fallisce
    console.error('[email] Invio fallito:', err)
  }
}

// ─── Email al cittadino: conferma ricezione contributo ────────────────────────

export async function sendContributionConfirmation(
  to: string,
  name: string,
  type: string,
) {
  const typeLabel: Record<string, string> = {
    photo: 'fotografia',
    video: 'video',
    audio: 'registrazione audio',
    story: 'racconto scritto',
  }
  await send({
    to,
    subject: 'UrgnanoComEra — Contributo ricevuto, grazie!',
    text: [
      `Gentile ${name},`,
      '',
      `Abbiamo ricevuto il tuo contributo (${typeLabel[type] ?? type}).`,
      'Il nostro team lo esaminerà e ti contatteremo non appena verrà pubblicato.',
      '',
      'Grazie per aiutarci a preservare la memoria storica di Urgnano.',
      '',
      'Il team di UrgnanoComEra',
      'comera.urgnanoturistica.it',
    ].join('\n'),
    html: `
      <p>Gentile <strong>${name}</strong>,</p>
      <p>Abbiamo ricevuto il tuo contributo (<em>${typeLabel[type] ?? type}</em>).</p>
      <p>Il nostro team lo esaminerà e ti contatteremo non appena verrà pubblicato.</p>
      <p>Grazie per aiutarci a preservare la memoria storica di Urgnano.</p>
      <p><em>Il team di UrgnanoComEra</em></p>
    `,
  })
}

// ─── Email all'admin: notifica nuovo contributo ───────────────────────────────

export async function sendContributionNotificationToAdmin(params: {
  name: string
  email: string
  type: string
  title: string
}) {
  if (!ADMIN_EMAIL) return
  const typeLabel: Record<string, string> = {
    photo: 'Fotografia',
    video: 'Video',
    audio: 'Audio',
    story: 'Racconto scritto',
  }
  await send({
    to: ADMIN_EMAIL,
    subject: `UrgnanoComEra — Nuovo contributo da ${params.name}`,
    text: [
      `Nuovo contributo in attesa di moderazione.`,
      '',
      `Tipo: ${typeLabel[params.type] ?? params.type}`,
      `Titolo: ${params.title}`,
      `Mittente: ${params.name} <${params.email}>`,
      '',
      'Accedi al pannello admin per approvare o rifiutare.',
      'comera.urgnanoturistica.it/admin/collections/contributions',
    ].join('\n'),
  })
}

// ─── Email al cittadino: esito moderazione ────────────────────────────────────

export async function sendContributionStatusUpdate(
  to: string,
  name: string,
  status: 'approved' | 'rejected',
  moderationNote?: string | null,
) {
  const approved = status === 'approved'
  await send({
    to,
    subject: approved
      ? 'UrgnanoComEra — Il tuo contributo è stato pubblicato!'
      : 'UrgnanoComEra — Aggiornamento sul tuo contributo',
    text: [
      `Gentile ${name},`,
      '',
      approved
        ? 'Siamo lieti di informarti che il tuo contributo è stato approvato e pubblicato sull\'archivio di UrgnanoComEra.'
        : 'Purtroppo il tuo contributo non è stato approvato per la pubblicazione.',
      ...(moderationNote ? ['', `Note del moderatore: ${moderationNote}`] : []),
      '',
      'Il team di UrgnanoComEra',
      'comera.urgnanoturistica.it',
    ].join('\n'),
  })
}
