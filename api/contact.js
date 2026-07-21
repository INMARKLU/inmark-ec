// Serverless function (Vercel) — envío del formulario de contacto vía Resend
// Recibe los datos del formulario de /contacto y envía la notificación a hola@inmark.ec
// Sin dependencias npm: usa fetch (Node 18+) contra la API REST de Resend.

const TO_EMAIL = process.env.CONTACT_TO || 'hola@inmark.ec';
// El "from" debe ser un dominio verificado en Resend (inmark.ec).
const FROM_EMAIL = process.env.CONTACT_FROM || 'Inmark Web <notificaciones@inmark.ec>';

const SERVICIOS = {
  seo: 'SEO & Arquitectura digital',
  ia: 'Automatización con IA',
  ads: 'Google Ads',
  web: 'Desarrollo web',
  estrategia: 'Estrategia completa',
};

const PRESUPUESTOS = {
  menos2k: '- $2.000',
  '2k-5k': '$2.000 – $5.000',
  '5k-15k': '$5.000 – $15.000',
  mas15k: '+ $15.000',
};

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Comprobación de configuración
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] Falta la variable de entorno RESEND_API_KEY en Vercel.');
    return res.status(500).json({ ok: false, error: 'Servidor sin configurar (RESEND_API_KEY).' });
  }

  // Body (Vercel parsea JSON automáticamente; fallback por si llega como string)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const nombre = (body.nombre || '').trim();
  const empresa = (body.empresa || '').trim();
  const email = (body.email || '').trim();
  const telefono = (body.telefono || '').trim();
  const servicio = SERVICIOS[body.servicio] || body.servicio || '—';
  const presupuesto = PRESUPUESTOS[body.presupuesto] || body.presupuesto || '—';
  const mensaje = (body.mensaje || '').trim();

  // Validación mínima
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios (nombre, email o mensaje).' });
  }

  const subject = `Nueva solicitud web — ${nombre}${empresa ? ' · ' + empresa : ''}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1C1C1C;max-width:560px">
      <h2 style="margin:0 0 4px">Nueva solicitud desde inmark.ec</h2>
      <p style="color:#666;margin:0 0 20px">Formulario de contacto</p>
      <table style="border-collapse:collapse;width:100%;font-size:15px">
        <tr><td style="padding:8px 0;color:#666;width:130px">Nombre</td><td style="padding:8px 0"><b>${esc(nombre)}</b></td></tr>
        <tr><td style="padding:8px 0;color:#666">Empresa</td><td style="padding:8px 0">${esc(empresa) || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Teléfono</td><td style="padding:8px 0">${esc(telefono) || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Servicio</td><td style="padding:8px 0">${esc(servicio)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Presupuesto</td><td style="padding:8px 0">${esc(presupuesto)}</td></tr>
      </table>
      <p style="color:#666;margin:20px 0 6px">Mensaje</p>
      <div style="background:#F6F3FF;border-radius:12px;padding:16px;white-space:pre-wrap;font-size:15px;line-height:1.5">${esc(mensaje)}</div>
    </div>`;

  const text =
`Nueva solicitud desde inmark.ec

Nombre: ${nombre}
Empresa: ${empresa || '—'}
Email: ${email}
Teléfono: ${telefono || '—'}
Servicio: ${servicio}
Presupuesto: ${presupuesto}

Mensaje:
${mensaje}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      console.error('[contact] Resend respondió error', r.status, JSON.stringify(data));
      return res.status(502).json({ ok: false, error: 'No se pudo enviar el correo.', detail: data });
    }

    console.log('[contact] Email enviado OK. id=', data.id, 'to=', TO_EMAIL);
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('[contact] Excepción al enviar:', err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: 'Error interno al enviar el correo.' });
  }
};
