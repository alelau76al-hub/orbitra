function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

const notificationTypes = new Set([
  'order_created',
  'payment_pending',
  'payment_received',
  'order_shipped',
  'refund_created',
  'customer_account',
  'customer_created',
  'generic',
])

const defaultTemplates = [
  {
    id: 0,
    type: 'order_created',
    title: 'Ordine creato',
    subject: 'Ordine ricevuto',
    body: 'Grazie, il tuo ordine e stato ricevuto.',
    active: 1,
    fallback: true,
  },
  {
    id: 0,
    type: 'payment_received',
    title: 'Pagamento ricevuto',
    subject: 'Pagamento confermato',
    body: 'Il pagamento del tuo ordine e stato ricevuto.',
    active: 1,
    fallback: true,
  },
  {
    id: 0,
    type: 'order_shipped',
    title: 'Ordine spedito',
    subject: 'Il tuo ordine e in viaggio',
    body: 'Il tuo ordine e stato affidato alla spedizione.',
    active: 1,
    fallback: true,
  },
  {
    id: 0,
    type: 'refund_created',
    title: 'Rimborso creato',
    subject: 'Rimborso registrato',
    body: 'Abbiamo registrato un rimborso per il tuo ordine.',
    active: 0,
    fallback: true,
  },
  {
    id: 0,
    type: 'customer_account',
    title: 'Account cliente',
    subject: 'Aggiornamento account',
    body: 'Il tuo profilo cliente e stato aggiornato.',
    active: 0,
    fallback: true,
  },
]

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeTemplate(body = {}) {
  return {
    id: body.id ? Number(body.id) : null,
    type: notificationTypes.has(body.type) ? body.type : 'generic',
    title: String(body.title || '').trim(),
    subject: String(body.subject || '').trim(),
    body: String(body.body || '').trim(),
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
  }
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value || '')
  } catch {
    return fallback
  }
}

function providerStatus(env) {
  const providers = [
    { key: 'resend', label: 'Resend', configured: Boolean(env.RESEND_API_KEY) },
    { key: 'sendgrid', label: 'SendGrid', configured: Boolean(env.SENDGRID_API_KEY) },
    { key: 'brevo', label: 'Brevo', configured: Boolean(env.BREVO_API_KEY) },
    { key: 'mailgun', label: 'Mailgun', configured: Boolean(env.MAILGUN_API_KEY) },
  ]
  const activeProvider = providers.find((provider) => provider.configured)

  return {
    mode: activeProvider ? 'external_ready' : 'mock_only',
    active_provider: activeProvider?.label || 'none',
    providers,
    message: activeProvider
      ? `${activeProvider.label} configurato via env. Invio reale predisposto.`
      : 'Mock / logging only: configura RESEND_API_KEY, SENDGRID_API_KEY, BREVO_API_KEY o MAILGUN_API_KEY per invii reali.',
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'notification', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

async function loadTemplates(env) {
  try {
    if (!env?.DB) return []
    const { results } = await env.DB.prepare(`
      SELECT id, type, title, subject, body, active, created_at, updated_at
      FROM notification_templates
      ORDER BY active DESC, type ASC
    `).all()

    return results || []
  } catch {
    return []
  }
}

async function loadLogs(env) {
  try {
    if (!env?.DB) return []
    const { results } = await env.DB.prepare(`
      SELECT id, template_id, type, status, description, metadata_json, created_at
      FROM notification_logs
      ORDER BY created_at DESC, id DESC
      LIMIT 50
    `).all()

    return (results || []).map((log) => ({
      ...log,
      metadata: safeJsonParse(log.metadata_json, {}),
      metadata_json: undefined,
    }))
  } catch {
    return []
  }
}

function mergeDefaultTemplates(templates = []) {
  const existingTypes = new Set(templates.map((template) => template.type))
  return [
    ...templates,
    ...defaultTemplates.filter((template) => !existingTypes.has(template.type)),
  ]
}

export async function onRequestGet({ env }) {
  const templates = mergeDefaultTemplates(await loadTemplates(env))
  const logs = await loadLogs(env)

  return json({
    success: true,
    templates,
    logs,
    provider_status: providerStatus(env),
    notification_types: [...notificationTypes],
    fallback: templates.some((template) => template.fallback),
  })
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)

    if (body.action === 'send_mock') {
      const templateId = Number(body.template_id)
      const template = templateId
        ? await env.DB.prepare('SELECT id, type, title FROM notification_templates WHERE id = ?')
            .bind(templateId)
            .first()
        : null
      const type = template?.type || (notificationTypes.has(body.type) ? body.type : 'generic')

      await env.DB.prepare(`
        INSERT INTO notification_logs (template_id, type, status, description, metadata_json)
        VALUES (?, ?, 'mocked', ?, ?)
      `)
        .bind(
          template?.id || null,
          type,
          `Mock/log ${type} registrato. Nessuna email reale inviata senza provider configurato.`,
          JSON.stringify(body.metadata && typeof body.metadata === 'object' ? body.metadata : {}),
        )
        .run()

      await logActivity(env, 'mock_send', template?.id || '', `Notifica mock ${type} registrata.`)
      return json({ success: true, message: 'Notifica mock registrata nel log.' })
    }

    const template = normalizeTemplate(body)

    if (!template.title || !template.subject) {
      return json({ success: false, message: 'Titolo e subject sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO notification_templates (type, title, subject, body, active)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(type) DO UPDATE SET
        title = excluded.title,
        subject = excluded.subject,
        body = excluded.body,
        active = excluded.active,
        updated_at = CURRENT_TIMESTAMP
    `)
      .bind(template.type, template.title, template.subject, template.body, template.active)
      .run()

    await logActivity(env, 'save', inserted.meta.last_row_id, `Template notifica ${template.type} salvato.`)
    return json({ success: true, message: 'Template notifica salvato.' })
  } catch {
    return json({ success: false, message: 'Salvataggio notifica non riuscito.' }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const template = normalizeTemplate(await readBody(request))

    if (!template.id || !template.title || !template.subject) {
      return json({ success: false, message: 'Dati template non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE notification_templates
      SET type = ?, title = ?, subject = ?, body = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(template.type, template.title, template.subject, template.body, template.active, template.id)
      .run()

    await logActivity(env, 'update', template.id, `Template notifica ${template.type} aggiornato.`)
    return json({ success: true, message: 'Template notifica aggiornato.' })
  } catch {
    return json({ success: false, message: 'Aggiornamento notifica non riuscito.' }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID template mancante.' }, 400)

    await env.DB.prepare('UPDATE notification_templates SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Template notifica disattivato.')
    return json({ success: true, message: 'Template notifica disattivato.' })
  } catch {
    return json({ success: false, message: 'Disattivazione notifica non riuscita.' }, 500)
  }
}
