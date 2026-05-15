function json(data, status = 200) {
  return Response.json(data, { status })
}

const notificationTypes = new Set(['order_created', 'payment_pending', 'customer_created', 'generic'])

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

export async function onRequestGet({ env }) {
  try {
    const templatesResult = await env.DB.prepare(`
      SELECT id, type, title, subject, body, active, created_at, updated_at
      FROM notification_templates
      ORDER BY active DESC, type ASC
    `).all()

    const logsResult = await env.DB.prepare(`
      SELECT id, template_id, type, status, description, metadata_json, created_at
      FROM notification_logs
      ORDER BY created_at DESC, id DESC
      LIMIT 50
    `).all()

    return json({
      success: true,
      templates: templatesResult.results || [],
      logs: (logsResult.results || []).map((log) => ({
        ...log,
        metadata: safeJsonParse(log.metadata_json, {}),
        metadata_json: undefined,
      })),
    })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento notifiche. Verifica la migration 0009.', error: error.message }, 500)
  }
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
          `Invio mock ${type} registrato. Nessuna email reale inviata.`,
          JSON.stringify(body.metadata && typeof body.metadata === 'object' ? body.metadata : {}),
        )
        .run()

      await logActivity(env, 'mock_send', template?.id || '', `Notifica mock ${type} registrata.`)
      return json({ success: true, message: 'Notifica mock registrata.' })
    }

    const template = normalizeTemplate(body)

    if (!template.title || !template.subject) {
      return json({ success: false, message: 'Titolo e subject sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO notification_templates (type, title, subject, body, active)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(template.type, template.title, template.subject, template.body, template.active)
      .run()

    await logActivity(env, 'create', inserted.meta.last_row_id, `Template notifica ${template.type} creato.`)
    return json({ success: true, message: 'Template notifica creato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore salvataggio notifica.', error: error.message }, 500)
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
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento notifica.', error: error.message }, 500)
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
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione notifica.', error: error.message }, 500)
  }
}
