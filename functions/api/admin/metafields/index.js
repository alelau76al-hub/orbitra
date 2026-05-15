function json(data, status = 200) {
  return Response.json(data, { status })
}

const entityTypes = new Set(['product', 'collection', 'page'])
const fieldTypes = new Set(['text', 'number', 'boolean', 'url'])

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalizeKey(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function normalizeEntityType(value = '') {
  return entityTypes.has(value) ? value : ''
}

function normalizeFieldType(value = '') {
  return fieldTypes.has(value) ? value : 'text'
}

function normalizeValue(value, type) {
  if (type === 'boolean') return value === true || String(value) === '1' ? '1' : '0'
  if (type === 'number') {
    const numeric = Number(value)
    return Number.isFinite(numeric) ? String(numeric) : ''
  }
  return String(value ?? '').trim()
}

async function loadDefinitions(env, entityType = '') {
  const result = entityType
    ? await env.DB.prepare(`
        SELECT id, entity_type, key, label, type, active, created_at, updated_at
        FROM metafield_definitions
        WHERE active = 1 AND entity_type = ?
        ORDER BY entity_type ASC, key ASC
      `)
        .bind(entityType)
        .all()
    : await env.DB.prepare(`
        SELECT id, entity_type, key, label, type, active, created_at, updated_at
        FROM metafield_definitions
        WHERE active = 1
        ORDER BY entity_type ASC, key ASC
      `).all()

  return result.results || []
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url)
    const entityType = normalizeEntityType(url.searchParams.get('entity_type') || '')
    const entityId = Number(url.searchParams.get('entity_id') || 0)
    const definitions = await loadDefinitions(env, entityType)
    let values = []

    if (entityType && entityId) {
      const valueResult = await env.DB.prepare(`
        SELECT
          metafield_values.definition_id,
          metafield_values.value
        FROM metafield_values
        INNER JOIN metafield_definitions
          ON metafield_definitions.id = metafield_values.definition_id
        WHERE
          metafield_values.entity_type = ?
          AND metafield_values.entity_id = ?
          AND metafield_definitions.active = 1
      `)
        .bind(entityType, entityId)
        .all()

      values = valueResult.results || []
    }

    const valuesByDefinitionId = values.reduce((map, row) => {
      map[row.definition_id] = row.value
      return map
    }, {})

    return json({
      success: true,
      definitions: definitions.map((definition) => ({
        ...definition,
        value: valuesByDefinitionId[definition.id] ?? '',
      })),
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento metafields. Verifica che la migration 0008 sia applicata.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)
    const entityType = normalizeEntityType(body.entity_type)
    const key = normalizeKey(body.key)
    const label = String(body.label || '').trim()
    const type = normalizeFieldType(body.type)

    if (!entityType || !key || !label) {
      return json({ success: false, message: 'Entita, key e label sono obbligatorie.' }, 400)
    }

    await env.DB.prepare(`
      INSERT INTO metafield_definitions (
        entity_type,
        key,
        label,
        type,
        active
      )
      VALUES (?, ?, ?, ?, 1)
    `)
      .bind(entityType, key, label, type)
      .run()

    return json({
      success: true,
      message: 'Definizione metafield creata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore creazione definizione metafield.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const entityType = normalizeEntityType(body.entity_type)
    const entityId = Number(body.entity_id)
    const values = body.values && typeof body.values === 'object' ? body.values : {}

    if (!entityType || !entityId) {
      return json({ success: false, message: 'Entita e ID record sono obbligatori.' }, 400)
    }

    const definitions = await loadDefinitions(env, entityType)

    for (const definition of definitions) {
      const rawValue = values[definition.key] ?? ''
      const value = normalizeValue(rawValue, definition.type)

      await env.DB.prepare(`
        INSERT INTO metafield_values (
          definition_id,
          entity_type,
          entity_id,
          value,
          updated_at
        )
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(definition_id, entity_type, entity_id)
        DO UPDATE SET
          value = excluded.value,
          updated_at = CURRENT_TIMESTAMP
      `)
        .bind(definition.id, entityType, entityId, value)
        .run()
    }

    return json({
      success: true,
      message: 'Valori metafield salvati.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore salvataggio metafields.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const id = Number(body.id)

    if (!id) {
      return json({ success: false, message: 'ID definizione mancante.' }, 400)
    }

    await env.DB.prepare(`
      UPDATE metafield_definitions
      SET active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(id)
      .run()

    return json({
      success: true,
      message: 'Definizione metafield disattivata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore disattivazione metafield.',
        error: error.message,
      },
      500,
    )
  }
}
