// Edge Function · booking-confirmation
//
// Envía dos correos transaccionales via Resend tras una reserva:
//   1) Notificación a la doctora (siempre).
//   2) Confirmación al paciente (si tenemos email).
//
// Se invoca desde el cliente después de un INSERT exitoso en `bookings`.
// Es fire-and-forget: si los correos fallan, el cliente ignora — la reserva
// igual quedó persistida.
//
// Secret esperado en el environment de la function:
//   • RESEND_API_KEY  (se setea desde el dashboard de Supabase)
//
// Limitación de Resend en cuenta nueva sin dominio verificado:
//   El campo `from` debe ser `onboarding@resend.dev` y el `to` sólo puede
//   ser el correo del dueño de la cuenta. Cuando se verifique un dominio
//   propio (rosibelpsicologa.cr), `from` cambia a `citas@rosibelpsicologa.cr`
//   y los correos pueden ir a cualquier paciente.
//
// Endpoint Resend: https://resend.com/docs/api-reference/emails/send-email

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? 'cascantebermudezrosibel@gmail.com';
const FROM_ADDRESS = Deno.env.get('FROM_ADDRESS') ?? 'onboarding@resend.dev';
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://jicorrales.github.io/DrRosibelCascanteBermudez';

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
};

function fmtFecha(iso: string): string {
  const d = new Date(iso);
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function emailToPatient(b: BookingPayload) {
  const cuando = fmtFecha(b.scheduled_at);
  const modalidad = b.modality === 'online' ? 'online (te mandaré el enlace antes)' : 'presencial';
  const cancelLink = `${SITE_URL}/reservar`;
  return {
    to: b.patient_email,
    subject: `Tu cita con Rosibel está reservada · ${cuando}`,
    text: `Hola ${b.patient_name.split(' ')[0]},

Quedamos para el ${cuando} (${b.duration_min} min, ${modalidad}).
${b.service_name ? `Servicio: ${b.service_name}.` : ''}

Si necesitás reagendar o cancelar, podés escribirme directamente o entrar a ${cancelLink}.

Cualquier cosa que querés que sepa antes de la sesión, respondé este correo.

Un abrazo,
Rosibel`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3D4F3B;line-height:1.6">
        <h1 style="font-family:Georgia,serif;font-size:24px;color:#2A382A;font-weight:500;margin:0 0 16px">Tu cita está reservada</h1>
        <p>Hola ${b.patient_name.split(' ')[0]},</p>
        <p>Quedamos para el <strong>${cuando}</strong> (${b.duration_min} min, ${modalidad}).</p>
        ${b.service_name ? `<p>Servicio: <strong>${b.service_name}</strong>.</p>` : ''}
        <p>Si necesitás reagendar o cancelar, podés escribirme directamente o entrar a <a href="${cancelLink}" style="color:#4F6E54">${cancelLink}</a>.</p>
        <p>Cualquier cosa que querés que sepa antes de la sesión, respondé este correo.</p>
        <p>Un abrazo,<br/>Rosibel</p>
      </div>
    `,
  };
}

function emailToAdmin(b: BookingPayload) {
  const cuando = fmtFecha(b.scheduled_at);
  return {
    to: ADMIN_EMAIL,
    subject: `Nueva reserva · ${b.patient_name} · ${cuando}`,
    text: `Reserva nueva:

Paciente: ${b.patient_name}
Correo:   ${b.patient_email}
Teléfono: ${b.patient_phone}
Cuándo:   ${cuando}
Servicio: ${b.service_name ?? b.service_id}
Modalidad: ${b.modality}
${b.message ? `\nMensaje del paciente:\n${b.message}` : ''}

Revisar / confirmar: ${SITE_URL}/admin/citas?estado=pending
`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3D4F3B;line-height:1.6">
        <h1 style="font-family:Georgia,serif;font-size:22px;color:#2A382A;font-weight:500;margin:0 0 16px">Nueva reserva</h1>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;color:#85997B">Paciente</td><td style="padding:6px 0;font-weight:600">${b.patient_name}</td></tr>
          <tr><td style="padding:6px 0;color:#85997B">Correo</td><td style="padding:6px 0">${b.patient_email}</td></tr>
          <tr><td style="padding:6px 0;color:#85997B">Teléfono</td><td style="padding:6px 0">${b.patient_phone}</td></tr>
          <tr><td style="padding:6px 0;color:#85997B">Cuándo</td><td style="padding:6px 0;font-weight:600">${cuando}</td></tr>
          <tr><td style="padding:6px 0;color:#85997B">Servicio</td><td style="padding:6px 0">${b.service_name ?? b.service_id}</td></tr>
          <tr><td style="padding:6px 0;color:#85997B">Modalidad</td><td style="padding:6px 0">${b.modality}</td></tr>
        </table>
        ${b.message ? `<p style="margin-top:16px;padding:12px 14px;background:#ECE4D4;border-radius:6px"><strong>Mensaje:</strong><br/>${b.message}</p>` : ''}
        <p style="margin-top:24px">
          <a href="${SITE_URL}/admin/citas?estado=pending" style="display:inline-block;background:#6B8B6E;color:#F2EDE3;padding:10px 18px;border-radius:6px;text-decoration:none">Revisar en el panel →</a>
        </p>
      </div>
    `,
  };
}

async function sendOne(payload: ReturnType<typeof emailToPatient>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Dra. Rosibel <${FROM_ADDRESS}>`,
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { ok: false, to: payload.to, status: res.status, detail };
  }
  const body = await res.json().catch(() => ({}));
  return { ok: true, to: payload.to, id: body?.id ?? null };
}

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

  // Validaciones mínimas (defensa en profundidad — RLS ya validó al insertar)
  if (!booking?.scheduled_at || !booking?.patient_email || !booking?.patient_name) {
    return new Response(JSON.stringify({ error: 'invalid-payload' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const results = await Promise.allSettled([
    sendOne(emailToAdmin(booking)),
    sendOne(emailToPatient(booking)),
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
