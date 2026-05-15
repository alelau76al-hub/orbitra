function json(data, status = 200) {
  return Response.json(data, { status })
}

const fieldTypes = new Set(['text', 'number', 'boolean', 'url'])

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
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeKey(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value || '')
  } catch {
    return fallback
  }
}

function normalizeFields(fields = []) {
  return (Array.isArray(fields) ? fields : [])
    .map((field) => ({
      key: normalizeKey(field.key),
      label: String(field.label || field.key || '').trim(),
      type: fieldTypes.has(field.type) ? field.type : 'text',
    }))
    .filter((field) => field.key && field.label)
}

async function logActivity(env, action, entityType, entityId, description) {
  try {
    await env.DB.prepare(`
      INSERT INTO activity_log (action, entity_type, entity_id, description)
      VALUES (?, ?, ?, ?)
    `)
      .bind(action, entityType, String(entityId || ''), description)
      .run()
  } catch {
    // Activity log e opzionale per mantenere compatibilita se la migration manca.
  }
}

async function loadDefinitions(env) {
  const { results } = await env.DB.prepare(`
    SELECT id, type_key, name, fields_json, active, created_at, updated_at
    FROM metaobject_definitions
    WHERE active = 1
    ORDER BY name ASC, id ASC
  `).all()

  return (results || []).map((definition) => ({
    ...definition,
    fields: safeJsonParse(definition.fields_json, []),
  }))
}

async function loadEntries(env) {
  const { results } = await env.DB.prepare(`
    SELECT
      metaobject_entries.id,
      metaobject_entries.definition_id,
      metaobject_definitions.type_key,
      metaobject_entries.slug,
      metaobject_entries.title,
      metaobject_entries.data_json,
      metaobject_entries.active,
      metaobject_entries.created_at,
      metaobject_entries.updated_at
    FROM metaobject_entries
    INNER JOIN metaobject_definitions
      ON metaobject_definitions.id = metaobject_entries.definition_id
    WHERE metaobject_entries.active = 1
    ORDER BY metaobject_entries.created_at DESC, metaobject_entries.id DESC
  `).all()

  return (results || []).map((entry) => ({
    ...entry,
    data: safeJsonParse(entry.data_json, {}),
  }))
}

export async function onRequestGet({ env }) {
  try {
    const [definitions, entries] = await Promise.all([
      loadDefinitions(env),
      loadEntries(env),
    ])

    return json({
      success: true,
      definitions,
      entries,
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento metaobjects. Verifica che la migration 0009 sia applicata.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)
    const mode = body.mode === 'entry' ? 'entry' : 'definition'

    if (mode === 'definition') {
      const typeKey = normalizeKey(body.type_key || body.name)
      const name = String(body.name || '').trim()
      const fields = normalizeFields(body.fields)

      if (!typeKey || !name || fields.length === 0) {
        return json({ success: false, message: 'Nome, type key e almeno un campo sono obbligatori.' }, 400)
      }

      const inserted = await env.DB.prepare(`
        INSERT INTO metaobject_definitions (type_key, name, fields_json, active)
        VALUES (?, ?, ?, 1)
      `)
        .bind(typeKey, name, JSON.stringify(fields))
        .run()

      await logActivity(env, 'create', 'metaobject_definition', inserted.meta.last_row_id, `Definizione ${name} creata.`)

      return json({ success: true, message: 'Definizione metaobject creata.' })
    }

    const definitionId = Number(body.definition_id)
    const title = String(body.title || '').trim()
    const slug = slugify(body.slug || title)
    const data = body.data && typeof body.data === 'object' ? body.data : {}

    if (!definitionId || !title || !slug) {
      return json({ success: false, message: 'Definizione, titolo e slug sono obbligatori.' }, 400)
    }

    const inserted = await env.DB.prepare(`
      INSERT INTO metaobject_entries (definition_id, slug, title, data_json, active)
      VALUES (?, ?, ?, ?, 1)
    `)
      .bind(definitionId, slug, title, JSON.stringify(data))
      .run()

    await logActivity(env, 'create', 'metaobject_entry', inserted.meta.last_row_id, `Entry ${title} creata.`)

    return json({ success: true, message: 'Entry metaobject creata.' })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore salvataggio metaobject.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const mode = body.mode === 'entry' ? 'entry' : 'definition'
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID mancante.' }, 400)

    if (mode === 'definition') {
      const name = String(body.name || '').trim()
      const typeKey = normalizeKey(body.type_key || name)
      const fields = normalizeFields(body.fields)

      if (!name || !typeKey || fields.length === 0) {
        return json({ success: false, message: 'Dati definizione non validi.' }, 400)
      }

      await env.DB.prepare(`
        UPDATE metaobject_definitions
        SET type_key = ?, name = ?, fields_json = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(typeKey, name, JSON.stringify(fields), id)
        .run()

      await logActivity(env, 'update', 'metaobject_definition', id, `Definizione ${name} aggiornata.`)
      return json({ success: true, message: 'Definizione aggiornata.' })
    }

    const title = String(body.title || '').trim()
    const slug = slugify(body.slug || title)
    const data = body.data && typeof body.data === 'object' ? body.data : {}

    if (!title || !slug) return json({ success: false, message: 'Dati entry non validi.' }, 400)

    await env.DB.prepare(`
      UPDATE metaobject_entries
      SET slug = ?, title = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(slug, title, JSON.stringify(data), id)
      .run()

    await logActivity(env, 'update', 'metaobject_entry', id, `Entry ${title} aggiornata.`)
    return json({ success: true, message: 'Entry aggiornata.' })
  } catch (error) {
    return json({ success: false, message: 'Errore aggiornamento metaobject.', error: error.message }, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const mode = body.mode === 'entry' ? 'entry' : 'definition'
    const id = Number(body.id)

    if (!id) return json({ success: false, message: 'ID mancante.' }, 400)

    if (mode === 'entry') {
      await env.DB.prepare('UPDATE metaobject_entries SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(id)
        .run()
      await logActivity(env, 'disable', 'metaobject_entry', id, 'Entry metaobject disattivata.')
    } else {
      await env.DB.prepare('UPDATE metaobject_definitions SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(id)
        .run()
      await logActivity(env, 'disable', 'metaobject_definition', id, 'Definizione metaobject disattivata.')
    }

    return json({ success: true, message: 'Metaobject disattivato.' })
  } catch (error) {
    return json({ success: false, message: 'Errore disattivazione metaobject.', error: error.message }, 500)
  }
}
