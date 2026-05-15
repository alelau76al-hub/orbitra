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

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeMarket(body = {}) {
  const name = String(body.name || '').trim()

  return {
    id: body.id ? Number(body.id) : null,
    handle: slugify(body.handle || name),
    name,
    country_code: String(body.country_code || 'IT').trim().toUpperCase().slice(0, 2),
    language_code: String(body.language_code || 'it').trim().toLowerCase().slice(0, 5),
    currency_code: String(body.currency_code || 'EUR').trim().toUpperCase().slice(0, 3),
    active: body.active === false || String(body.active) === '0' ? 0 : 1,
    is_default: body.is_default === true || String(body.is_default) === '1' ? 1 : 0,
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'market', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

async function ensureSingleDefault(env, id) {
  if (!id) return

  await env.DB.prepare(`
    UPDATE markets
    SET is_default = CASE WHEN id = ? THEN 1 ELSE 0 END,
        updated_at = CURRENT_TIMESTAMP
  `)
    .bind(id)
    .run()
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, handle, name, country_code, language_code, currency_code, active, is_default, created_at, updated_at
      FROM markets
      ORDER BY is_default DESC, active DESC, name ASC
    `).all()

    return json({ success: true, markets: results || [] })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento markets. Verifica la migration 0009.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const market = normalizeMarket(await readBody(request))

    if (!market.name || !market.handle) {
      return json({ success: false, message: 'Nome e handle mercato sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO markets (handle, name, country_code, language_code, currency_code, active, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        market.handle,
        market.name,
        market.country_code,
        market.language_code,
        market.currency_code,
        market.active,
        market.is_default,
      )
      .run()

    if (market.is_default) await ensureSingleDefault(env, inserted.meta.last_row_id)
    await logActivity(env, 'create', inserted.meta.last_row_id, `Mercato ${market.name} creato.`)

    return json({ success: true, message: 'Mercato creato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione mercato.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const market = normalizeMarket(await readBody(request))

    if (!market.id || !market.name || !market.handle) {
      return json({ success: false, message: 'Dati mercato non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE markets
      SET
        handle = ?,
        name = ?,
        country_code = ?,
        language_code = ?,
        currency_code = ?,
        active = ?,
        is_default = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        market.handle,
        market.name,
        market.country_code,
        market.language_code,
        market.currency_code,
        market.active,
        market.is_default,
        market.id,
      )
      .run()

    if (market.is_default) await ensureSingleDefault(env, market.id)
    await logActivity(env, 'update', market.id, `Mercato ${market.name} aggiornato.`)

    return json({ success: true, message: 'Mercato aggiornato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento mercato.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID mercato mancante.' }, 400)

    await env.DB.prepare('UPDATE markets SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Mercato disattivato.')

    return json({ success: true, message: 'Mercato disattivato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione mercato.', error: error.message }, 500)
  }
}
