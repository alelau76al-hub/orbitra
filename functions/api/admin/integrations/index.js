function json(data, status = 200) {
  return Response.json(data, { status })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeIntegration(body = {}) {
  const config = body.config && typeof body.config === 'object' ? body.config : {}

  return {
    id: body.id ? Number(body.id) : null,
    name: String(body.name || '').trim(),
    type: String(body.type || 'custom').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-'),
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
    config,
    webhook_url: String(body.webhook_url || '').trim(),
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
      VALUES (?, 'integration', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, name, type, active, config_json, webhook_url, created_at, updated_at
      FROM integrations
      ORDER BY active DESC, name ASC
    `).all()

    return json({
      success: true,
      integrations: (results || []).map((integration) => ({
        ...integration,
        config: safeJsonParse(integration.config_json, {}),
        config_json: undefined,
      })),
    })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento integrazioni. Verifica la migration 0009.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const integration = normalizeIntegration(await readBody(request))

    if (!integration.name || !integration.type) {
      return json({ success: false, message: 'Nome e tipo integrazione sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO integrations (name, type, active, config_json, webhook_url)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(
        integration.name,
        integration.type,
        integration.active,
        JSON.stringify(integration.config),
        integration.webhook_url,
      )
      .run()

    await logActivity(env, 'create', inserted.meta.last_row_id, `Integrazione ${integration.name} creata.`)
    return json({ success: true, message: 'Integrazione creata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione integrazione.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const integration = normalizeIntegration(await readBody(request))

    if (!integration.id || !integration.name || !integration.type) {
      return json({ success: false, message: 'Dati integrazione non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE integrations
      SET name = ?, type = ?, active = ?, config_json = ?, webhook_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        integration.name,
        integration.type,
        integration.active,
        JSON.stringify(integration.config),
        integration.webhook_url,
        integration.id,
      )
      .run()

    await logActivity(env, 'update', integration.id, `Integrazione ${integration.name} aggiornata.`)
    return json({ success: true, message: 'Integrazione aggiornata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento integrazione.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID integrazione mancante.' }, 400)

    await env.DB.prepare('UPDATE integrations SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Integrazione disattivata.')
    return json({ success: true, message: 'Integrazione disattivata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione integrazione.', error: error.message }, 500)
  }
}
