// Edge Function · task-reminder
//
// Envía un recordatorio por correo al paciente cuando tiene una tarea
// asignada por la doctora con due_date próximo (hoy o mañana) y aún no
// completada. Se invoca desde la función SQL `send_task_reminders()`
// disparada por pg_cron una vez al día (07:00 CR).
//
// Secrets esperados:
//   • RESEND_API_KEY  (obligatorio)
//   • FROM_ADDRESS    (default: onboarding@resend.dev)
//   • SITE_URL        (default: URL Vercel)
//   • DOCTOR_WHATSAPP (default: 50688414861)

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_ADDRESS = Deno.env.get('FROM_ADDRESS') ?? 'onboarding@resend.dev';
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://dr-rosibel-cascante-bermudez.vercel.app';
const DOCTOR_WHATSAPP = Deno.env.get('DOCTOR_WHATSAPP') ?? '50688414861';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type TaskPayload = {
  task_id: string;
  title: string;
  description?: string | null;
  due_date: string; // YYYY-MM-DD
  patient_name: string;
  patient_email: string;
};

function isToday(dateStr: string): boolean {
  const today = new Date();
  const cr = new Date(today.getTime() - 6 * 60 * 60 * 1000);
  const todayCR = `${cr.getUTCFullYear()}-${String(cr.getUTCMonth() + 1).padStart(2, '0')}-${String(cr.getUTCDate()).padStart(2, '0')}`;
  return dateStr === todayCR;
}

function waUrl(text: string): string {
  return `https://wa.me/${DOCTOR_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function buildEmail(t: TaskPayload) {
  const cuando = isToday(t.due_date) ? 'hoy' : 'mañana';
  const wa = waUrl(`Hola Rosibel, sobre la tarea "${t.title}".`);
  const portalLink = `${SITE_URL}/portal/tareas`;

  const subject = `Recordatorio: tu tarea "${t.title}" ${cuando}`;

  const text = `Hola ${t.patient_name.split(' ')[0]},

Te recuerdo que ${cuando} tenés pendiente esta tarea que conversamos:

  "${t.title}"
${t.description ? `\n${t.description}\n` : ''}

Cuando la terminés, marcala como hecha desde tu portal: ${portalLink}

Si necesitás conversarlo, escribime por WhatsApp:
${wa}

Un abrazo,
Rosibel`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3D4F3B;line-height:1.6">
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#2A382A;font-weight:500;margin:0 0 16px">Tu tarea ${cuando}</h1>
      <p>Hola ${t.patient_name.split(' ')[0]}, te recuerdo que ${cuando} tenés pendiente esto:</p>
      <blockquote style="border-left:3px solid #5C7D60;background:#E4E8DD;padding:14px 18px;margin:16px 0;font-size:16px;color:#2A382A;border-radius:4px">
        <strong>${t.title}</strong>
        ${t.description ? `<br/><span style="color:#5A6F58">${t.description}</span>` : ''}
      </blockquote>
      <p style="margin:20px 0">
        <a href="${portalLink}" style="display:inline-block;background:#5C7D60;color:#F2EDE3;padding:11px 18px;border-radius:6px;text-decoration:none;font-weight:600">Marcar como hecha →</a>
      </p>
      <p style="margin:24px 0 12px">
        <a href="${wa}" style="display:inline-block;background:#1FA851;color:#fff;padding:11px 18px;border-radius:6px;text-decoration:none;font-weight:600">💬 Escribirme por WhatsApp</a>
      </p>
      <p>Un abrazo,<br/>Rosibel</p>
    </div>
  `;

  return { subject, text, html };
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

  let task: TaskPayload;
  try {
    task = (await req.json()) as TaskPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid-json' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!task?.task_id || !task?.title || !task?.due_date || !task?.patient_email || !task?.patient_name) {
    return new Response(JSON.stringify({ error: 'invalid-payload' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const email = buildEmail(task);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Dra. Rosibel <${FROM_ADDRESS}>`,
      to: [task.patient_email],
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return new Response(
      JSON.stringify({ ok: false, status: res.status, detail }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const data = await res.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, id: data?.id ?? null }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
