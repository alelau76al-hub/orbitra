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

function normalizeCampaign(body = {}) {
  return {
    id: body.id ? Number(body.id) : null,
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    starts_at: String(body.starts_at || '').trim() || null,
    ends_at: String(body.ends_at || '').trim() || null,
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
    discount_code: String(body.discount_code || '').trim().toUpperCase(),
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'marketing_campaign', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, title, description, starts_at, ends_at, active, discount_code, created_at, updated_at
      FROM marketing_campaigns
      ORDER BY active DESC, created_at DESC, id DESC
    `).all()

    return json({ success: true, campaigns: results || [] })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento campagne. Verifica la migration 0009.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const campaign = normalizeCampaign(await readBody(request))

    if (!campaign.title) return json({ success: false, message: 'Titolo campagna obbligatorio.' }, 400)

    const inserted = await env.DB.prepare(`
      INSERT INTO marketing_campaigns (title, description, starts_at, ends_at, active, discount_code)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
      .bind(
        campaign.title,
        campaign.description,
        campaign.starts_at,
        campaign.ends_at,
        campaign.active,
        campaign.discount_code,
      )
      .run()

    await logActivity(env, 'create', inserted.meta.last_row_id, `Campagna ${campaign.title} creata.`)

    return json({ success: true, message: 'Campagna creata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione campagna.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const campaign = normalizeCampaign(await readBody(request))

    if (!campaign.id || !campaign.title) {
      return json({ success: false, message: 'Dati campagna non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE marketing_campaigns
      SET
        title = ?,
        description = ?,
        starts_at = ?,
        ends_at = ?,
        active = ?,
        discount_code = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        campaign.title,
        campaign.description,
        campaign.starts_at,
        campaign.ends_at,
        campaign.active,
        campaign.discount_code,
        campaign.id,
      )
      .run()

    await logActivity(env, 'update', campaign.id, `Campagna ${campaign.title} aggiornata.`)

    return json({ success: true, message: 'Campagna aggiornata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento campagna.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID campagna mancante.' }, 400)

    await env.DB.prepare('UPDATE marketing_campaigns SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Campagna disattivata.')

    return json({ success: true, message: 'Campagna disattivata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione campagna.', error: error.message }, 500)
  }
}
