function json(data, status = 200) {
  return Response.json(data, { status })
}

const statuses = new Set(['active', 'paused', 'disabled'])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeHandle(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeTenant(body = {}) {
  return {
    id: body.id ? Number(body.id) : null,
    handle: normalizeHandle(body.handle || body.name),
    name: String(body.name || '').trim(),
    status: statuses.has(body.status) ? body.status : 'active',
    is_default: body.is_default === true || String(body.is_default) === '1' ? 1 : 0,
    notes: String(body.notes || '').trim(),
  }
}

async function ensureSingleDefault(env, id) {
  if (!id) return

  await env.DB.prepare(`
    UPDATE tenants
    SET is_default = CASE WHEN id = ? THEN 1 ELSE 0 END,
        updated_at = CURRENT_TIMESTAMP
  `)
    .bind(id)
    .run()
}

async function logActivity(env, action, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, 'tenant', ?, ?)
    `)
      .bind(action, String(entityId || ''), description)
      .run()
  } catch {}
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT id, handle, name, status, is_default, notes, created_at, updated_at
      FROM tenants
      ORDER BY is_default DESC, name ASC
    `).all()

    return json({
      success: true,
      tenants: results || [],
      default_tenant: (results || []).find((tenant) => tenant.is_default) || null,
      note: 'MVP predisposizione: le API esistenti continuano a usare lo store default senza tenant_id obbligatorio.',
    })
  } catch (error) {
    return json({ success: false, message: 'Errore caricamento tenants. Verifica la migration 0010.', error: error.message }, 500)
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const tenant = normalizeTenant(await readBody(request))

    if (!tenant.name || !tenant.handle) {
      return json({ success: false, message: 'Nome e handle tenant sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO tenants (handle, name, status, is_default, notes)
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(tenant.handle, tenant.name, tenant.status, tenant.is_default, tenant.notes)
      .run()

    if (tenant.is_default) await ensureSingleDefault(env, inserted.meta.last_row_id)
    await logActivity(env, 'create', inserted.meta.last_row_id, `Tenant ${tenant.name} creato.`)

    return json({ success: true, message: 'Tenant creato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore creazione tenant.', error: error.message }, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const tenant = normalizeTenant(await readBody(request))

    if (!tenant.id || !tenant.name || !tenant.handle) {
      return json({ success: false, message: 'Dati tenant non validi.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE tenants
      SET handle = ?, name = ?, status = ?, is_default = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(tenant.handle, tenant.name, tenant.status, tenant.is_default, tenant.notes, tenant.id)
      .run()

    if (tenant.is_default) await ensureSingleDefault(env, tenant.id)
    await logActivity(env, 'update', tenant.id, `Tenant ${tenant.name} aggiornato.`)

    return json({ success: true, message: 'Tenant aggiornato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento tenant.', error: error.message }, 500)
  }
}
