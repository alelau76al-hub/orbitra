function json(data, status = 200) {
  return Response.json(data, { status })
}

const domainTypes = new Set(['primary', 'redirect', 'preview'])
const statuses = new Set(['active', 'pending', 'disabled'])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeDomainName(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
}

function normalizeDomain(body = {}) {
  const type = domainTypes.has(body.type) ? body.type : 'preview'
  const isPrimary = body.is_primary === true || String(body.is_primary) === '1' || type === 'primary'

  return {
    id: body.id ? Number(body.id) : null,
    domain: normalizeDomainName(body.domain),
    type: isPrimary ? 'primary' : type,
    status: statuses.has(body.status) ? body.status : 'pending',
    dns_notes: String(body.dns_notes || '').trim(),
    is_primary: isPrimary ? 1 : 0,
  }
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'domain', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

async function ensureSinglePrimary(env, id) {
  if (!id) return

  await env.DB.prepare(`
    UPDATE domains
    SET
      is_primary = CASE WHEN id = ? THEN 1 ELSE 0 END,
      type = CASE WHEN id = ? THEN 'primary' ELSE type END,
      updated_at = CURRENT_TIMESTAMP
  `)
    .bind(id, id)
    .run()
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, domain, type, status, dns_notes, is_primary, created_at, updated_at
      FROM domains
      ORDER BY is_primary DESC, status ASC, domain ASC
    `).all()

    return json({
      success: true,
      domains: results || [],
      primary_domain: (results || []).find((domain) => domain.is_primary && domain.status === 'active') || null,
    })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento domini. Verifica la migration 0010.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const domain = normalizeDomain(await readBody(request))

    if (!domain.domain || !domain.domain.includes('.')) {
      return json({ success: false, message: 'Dominio non valido.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO domains (domain, type, status, dns_notes, is_primary)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(domain.domain, domain.type, domain.status, domain.dns_notes, domain.is_primary)
      .run()

    if (domain.is_primary) await ensureSinglePrimary(env, inserted.meta.last_row_id)
    await logActivity(env, 'create', inserted.meta.last_row_id, `Dominio ${domain.domain} creato.`)

    return json({ success: true, message: 'Dominio creato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione dominio.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const domain = normalizeDomain(await readBody(request))

    if (!domain.id || !domain.domain || !domain.domain.includes('.')) {
      return json({ success: false, message: 'Dati dominio non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE domains
      SET domain = ?, type = ?, status = ?, dns_notes = ?, is_primary = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(domain.domain, domain.type, domain.status, domain.dns_notes, domain.is_primary, domain.id)
      .run()

    if (domain.is_primary) await ensureSinglePrimary(env, domain.id)
    await logActivity(env, 'update', domain.id, `Dominio ${domain.domain} aggiornato.`)

    return json({ success: true, message: 'Dominio aggiornato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento dominio.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID dominio mancante.' }, 400)

    await env.DB.prepare(`
      UPDATE domains
      SET status = 'disabled', is_primary = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    await logActivity(env, 'disable', id, 'Dominio disabilitato.')
    return json({ success: true, message: 'Dominio disabilitato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disabilitazione dominio.', error: error.message }, 500)
  }
}
