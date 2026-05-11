// Edge Function · booking-confirmation
//
// Envía dos correos transaccionales via Resend tras una reserva:
//   1) Notificación a la doctora (siempre) — con link WhatsApp y archivo .ics adjunto.
//   2) Confirmación al paciente — con link WhatsApp y archivo .ics adjunto.
//
// El archivo .ics permite agregar el evento a Google Calendar / Apple Calendar /
// Outlook con un click. Resend lo entrega como attachment (base64).
//
// Se invoca desde el cliente después de un INSERT exitoso en `bookings`,
// o desde la edge function `booking-reminder` (recordatorio 24h antes).
// Es fire-and-forget: si los correos fallan, el cliente ignora — la reserva
// igual quedó persistida.
//
// Secrets esperados en el environment de la function:
//   • RESEND_API_KEY      (obligatorio)
//   • ADMIN_EMAIL         (default: jocorrales.dev@gmail.com)
//   • FROM_ADDRESS        (default: onboarding@resend.dev)
//   • SITE_URL            (default: URL Vercel/Pages)
//   • DOCTOR_WHATSAPP     (default: 50688414861)
//
// Limitación de Resend en cuenta nueva sin dominio verificado:
//   El campo `from` debe ser `onboarding@resend.dev` y el `to` sólo puede
//   ser el correo del dueño de la cuenta. Cuando se verifique un dominio
//   propio (rosibelpsicologa.cr), `from` cambia a `citas@rosibelpsicologa.cr`
//   y los correos pueden ir a cualquier paciente.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? 'jocorrales.dev@gmail.com';
const FROM_ADDRESS = Deno.env.get('FROM_ADDRESS') ?? 'onboarding@resend.dev';
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://dr-rosibel-cascante-bermudez.vercel.app';
const DOCTOR_WHATSAPP = Deno.env.get('DOCTOR_WHATSAPP') ?? '50688414861';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type BookingPayload = {
  id?: string;
  service_id: string;
  service_name?: string;
  scheduled_at: string;
  duration_min: number;
  modality: 'online' | 'presencial';
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  message?: string | null;
  price_crc?: number;
  // Variante 'reminder' usa plantilla distinta (asunto + cuerpo). Default 'confirmation'.
  template?: 'confirmation' | 'reminder';
};

// ─────────────────────────────────────────────
// Formato fecha / hora — siempre en zona CR
// ─────────────────────────────────────────────
function fmtFecha(iso: string): string {
  const d = new Date(iso);
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  // CR está en UTC-6 sin DST. Convertimos manualmente para evitar depender del TZ del runtime.
  const cr = new Date(d.getTime() - 6 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${days[cr.getUTCDay()]} ${cr.getUTCDate()} de ${months[cr.getUTCMonth()]}, ${pad(cr.getUTCHours())}:${pad(cr.getUTCMinutes())}`;
}

// ─────────────────────────────────────────────
// WhatsApp helpers
// ─────────────────────────────────────────────
function waUrl(text: string): string {
  return `https://wa.me/${DOCTOR_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

// ─────────────────────────────────────────────
// .ics generator — RFC 5545 mínimo viable
// ─────────────────────────────────────────────
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function icsDate(iso: string): string {
  // Formato YYYYMMDDTHHMMSSZ en UTC, requerido por el spec.
  const d = new Date(iso);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function icsEscape(s: string): string {
  // Spec: escapar \, ;, , y \n.
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function buildIcs(b: BookingPayload): string {
  const start = new Date(b.scheduled_at);
  const end = new Date(start.getTime() + b.duration_min * 60 * 1000);
  const uid = `${b.id ?? crypto.randomUUID()}@rosibelpsicologa.cr`;
  const stamp = icsDate(new Date().toISOString());
  const location = b.modality === 'online' ? 'Online (link al correo antes de la sesión)' : 'San Pedro, San José, Costa Rica';
  const summary = `Sesión con Rosibel${b.service_name ? ` · ${b.service_name}` : ''}`;
  const description = [
    `Paciente: ${b.patient_name}`,
    `Modalidad: ${b.modality}`,
    b.service_name ? `Servicio: ${b.service_name}` : '',
    '',
    `WhatsApp: ${waUrl(`Hola Rosibel, sobre mi cita del ${fmtFecha(b.scheduled_at)}.`)}`,
  ]
    .filter(Boolean)
    .join('\n');

  // CRLF line endings + BEGIN/END VEVENT/VCALENDAR según RFC 5545.
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dra. Rosibel Cascante//Reservas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsDate(start.toISOString())}`,
    `DTEND:${icsDate(end.toISOString())}`,
    `SUMMARY:${icsEscape(summary)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `LOCATION:${icsEscape(location)}`,
    `ORGANIZER;CN=Rosibel Cascante:mailto:${ADMIN_EMAIL}`,
    `ATTENDEE;CN=${icsEscape(b.patient_name)};RSVP=TRUE:mailto:${b.patient_email}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio de tu cita',
    'TRIGGER:-PT1H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

function icsToBase64(ics: string): string {
  // btoa requiere binary string. Las plantillas ya están en latin1-safe para
  // los campos ASCII; los strings UTF-8 se codifican via TextEncoder.
  const bytes = new TextEncoder().encode(ics);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

// ─────────────────────────────────────────────
// Plantillas de correo
// ─────────────────────────────────────────────
function emailToPatient(b: BookingPayload) {
  const cuando = fmtFecha(b.scheduled_at);
  const isReminder = b.template === 'reminder';
  const modalidad = b.modality === 'online' ? 'online (te mandaré el enlace antes)' : 'presencial';
  const cancelLink = `${SITE_URL}/portal/citas`;
  const wa = waUrl(`Hola Rosibel, sobre mi cita del ${cuando}.`);

  const subject = isReminder
    ? `Mañana tenemos sesión · ${cuando}`
    : `Tu cita con Rosibel está reservada · ${cuando}`;

  const intro = isReminder
    ? `Hola ${b.patient_name.split(' ')[0]}, te recuerdo que mañana tenemos sesión.`
    : `Hola ${b.patient_name.split(' ')[0]}, quedó reservada tu cita.`;

  const text = `${intro}

Cuándo: ${cuando}
Duración: ${b.duration_min} min
Modalidad: ${modalidad}
${b.service_name ? `Servicio: ${b.service_name}` : ''}

Agregá la cita a tu calendario: abrí el archivo .ics adjunto a este correo.

¿Necesitás reagendar, cancelar o avisarme algo? Escribime por WhatsApp:
${wa}

O entrá a tu portal: ${cancelLink}

Un abrazo,
Rosibel`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3D4F3B;line-height:1.6">
      <h1 style="font-family:Georgia,serif;font-size:24px;color:#2A382A;font-weight:500;margin:0 0 16px">${
        isReminder ? 'Mañana tenemos sesión' : 'Tu cita está reservada'
      }</h1>
      <p>${intro}</p>
      <table style="border-collapse:collapse;margin:16px 0;width:100%">
        <tr><td style="padding:6px 0;color:#85997B">Cuándo</td><td style="padding:6px 0;font-weight:600">${cuando}</td></tr>
        <tr><td style="padding:6px 0;color:#85997B">Duración</td><td style="padding:6px 0">${b.duration_min} min</td></tr>
        <tr><td style="padding:6px 0;color:#85997B">Modalidad</td><td style="padding:6px 0">${modalidad}</td></tr>
        ${b.service_name ? `<tr><td style="padding:6px 0;color:#85997B">Servicio</td><td style="padding:6px 0">${b.service_name}</td></tr>` : ''}
      </table>
      <p style="background:#ECE4D4;padding:12px 14px;border-radius:6px;margin:20px 0">
        📅 <strong>Agregá la cita a tu calendario</strong> abriendo el archivo <code>.ics</code> adjunto a este correo (funciona con Google Calendar, Apple, Outlook).
      </p>
      <p style="margin:24px 0 12px">
        <a href="${wa}" style="display:inline-block;background:#1FA851;color:#fff;padding:11px 18px;border-radius:6px;text-decoration:none;font-weight:600">💬 Escribirme por WhatsApp</a>
      </p>
      <p style="margin:0 0 24px"><a href="${cancelLink}" style="color:#3F5A45">O entrá a tu portal de paciente →</a></p>
      <p>Un abrazo,<br/>Rosibel</p>
    </div>
  `;

  return { to: b.patient_email, subject, text, html };
}

function emailToAdmin(b: BookingPayload) {
  const cuando = fmtFecha(b.scheduled_at);
  const isReminder = b.template === 'reminder';
  const wa = waUrl(`Hola ${b.patient_name.split(' ')[0]}, te confirmo nuestra cita del ${cuando}.`);

  const subject = isReminder
    ? `Recordatorio: cita con ${b.patient_name} mañana · ${cuando}`
    : `Nueva reserva · ${b.patient_name} · ${cuando}`;

  const text = `${isReminder ? 'Recordatorio' : 'Reserva nueva'}:

Paciente: ${b.patient_name}
Correo:   ${b.patient_email}
Teléfono: ${b.patient_phone}
Cuándo:   ${cuando}
Servicio: ${b.service_name ?? b.service_id}
Modalidad: ${b.modality}
${b.message ? `\nMensaje del paciente:\n${b.message}` : ''}

WhatsApp directo al paciente:
${wa}

Calendario: abrí el archivo .ics adjunto para agregar el evento a tu Google Calendar / Apple Calendar.

Revisar / confirmar: ${SITE_URL}/admin/citas?estado=pending
`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3D4F3B;line-height:1.6">
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#2A382A;font-weight:500;margin:0 0 16px">${
        isReminder ? 'Recordatorio de sesión' : 'Nueva reserva'
      }</h1>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0;color:#85997B">Paciente</td><td style="padding:6px 0;font-weight:600">${b.patient_name}</td></tr>
        <tr><td style="padding:6px 0;color:#85997B">Correo</td><td style="padding:6px 0">${b.patient_email}</td></tr>
        <tr><td style="padding:6px 0;color:#85997B">Teléfono</td><td style="padding:6px 0">${b.patient_phone}</td></tr>
        <tr><td style="padding:6px 0;color:#85997B">Cuándo</td><td style="padding:6px 0;font-weight:600">${cuando}</td></tr>
        <tr><td style="padding:6px 0;color:#85997B">Servicio</td><td style="padding:6px 0">${b.service_name ?? b.service_id}</td></tr>
        <tr><td style="padding:6px 0;color:#85997B">Modalidad</td><td style="padding:6px 0">${b.modality}</td></tr>
      </table>
      ${b.message ? `<p style="margin-top:16px;padding:12px 14px;background:#ECE4D4;border-radius:6px"><strong>Mensaje:</strong><br/>${b.message}</p>` : ''}
      <p style="background:#E4E8DD;padding:12px 14px;border-radius:6px;margin:20px 0">
        📅 Calendario: abrí el archivo <code>.ics</code> adjunto para agregar este evento a tu Google Calendar.
      </p>
      <p style="margin:24px 0 12px">
        <a href="${wa}" style="display:inline-block;background:#1FA851;color:#fff;padding:11px 18px;border-radius:6px;text-decoration:none;font-weight:600;margin-right:8px">💬 WhatsApp al paciente</a>
        <a href="${SITE_URL}/admin/citas?estado=pending" style="display:inline-block;background:#5C7D60;color:#F2EDE3;padding:11px 18px;border-radius:6px;text-decoration:none;font-weight:600">Revisar en panel →</a>
      </p>
    </div>
  `;

  return { to: ADMIN_EMAIL, subject, text, html };
}

// ─────────────────────────────────────────────
// Envío via Resend (con adjunto .ics)
// ─────────────────────────────────────────────
type EmailPayload = { to: string; subject: string; text: string; html: string };

async function sendOne(payload: EmailPayload, icsBase64: string | null) {
  const body: Record<string, unknown> = {
    from: `Dra. Rosibel <${FROM_ADDRESS}>`,
    to: [payload.to],
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  };
  if (icsBase64) {
    body.attachments = [
      {
        filename: 'cita.ics',
        content: icsBase64,
        // Resend acepta string (auto-detecta) o {filename, content, contentType}
        // contentType: 'text/calendar; method=REQUEST',
      },
    ];
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { ok: false, to: payload.to, status: res.status, detail };
  }
  const data = await res.json().catch(() => ({}));
  return { ok: true, to: payload.to, id: data?.id ?? null };
}

// ─────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method-not-allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'RESEND_API_KEY no está configurada en la edge function.' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  let booking: BookingPayload;
  try {
    booking = (await req.json()) as BookingPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid-json' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!booking?.scheduled_at || !booking?.patient_email || !booking?.patient_name) {
    return new Response(JSON.stringify({ error: 'invalid-payload' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const ics = buildIcs(booking);
  const icsB64 = icsToBase64(ics);

  const results = await Promise.allSettled([
    sendOne(emailToAdmin(booking), icsB64),
    sendOne(emailToPatient(booking), icsB64),
  ]);

  const summary = results.map((r, i) => {
    if (r.status === 'fulfilled') return { kind: i === 0 ? 'admin' : 'patient', ...r.value };
    return { kind: i === 0 ? 'admin' : 'patient', ok: false, error: String(r.reason) };
  });

  return new Response(JSON.stringify({ ok: true, sent: summary }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
