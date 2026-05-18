const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  })

const FORMATS = new Set(['csv', 'json', 'xml'])
const SCHEDULES = new Set(['manual', 'daily', 'weekly'])
const TARGETS = new Set(['products', 'stock', 'prices'])

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || error || ''))
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function normalize(body = {}) {
  return {
    name: String(body.name || '').trim(),
    source_url: String(body.source_url || '').trim() || null,
    format: FORMATS.has(body.format) ? body.format : 'json',
    schedule: SCHEDULES.has(body.schedule) ? body.schedule : 'manual',
    import_target: TARGETS.has(body.import_target) ? body.import_target : 'products',
    active: body.active === true ? 1 : 0,
  }
}

export async function onRequestGet({ env }) {
  try {
    const [feeds, runs] = await Promise.all([
      env.DB.prepare('SELECT * FROM supplier_feeds ORDER BY updated_at DESC, id DESC LIMIT 250').all(),
      env.DB.prepare('SELECT * FROM supplier_feed_runs ORDER BY created_at DESC, id DESC LIMIT 50').all(),
    ])
    return json({ success: true, feeds: feeds.results || [], runs: runs.results || [] })
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, feeds: [], runs: [], setup_required: true })
    return json({ success: false, message: 'Supplier Feeds non disponibile.' }, { status: 500 })
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request)
    if (body.action === 'dry_run') {
      const id = Number(body.id)
      if (!id) {
        const draft = normalize(body)
        const errors = []
        if (!draft.name) errors.push('Nome feed obbligatorio.')
        if (!draft.source_url || !/^https?:\/\//i.test(draft.source_url)) errors.push('Source URL mancante o non valido.')
        if (!FORMATS.has(draft.format)) errors.push('Formato non supportato.')
        return json({
          success: !errors.length,
          message: errors.join(' ') || 'Dry-run configurazione completato. Salva il feed per registrare una run.',
          records_found: 0,
          errors,
        }, errors.length ? { status: 400 } : {})
      }
      const feed = await env.DB.prepare('SELECT * FROM supplier_feeds WHERE id = ?').bind(id).first()
      if (!feed) return json({ success: false, message: 'Feed non trovato.' }, { status: 404 })
      const errors = []
      if (!feed.source_url || !/^https?:\/\//i.test(feed.source_url)) errors.push('Source URL mancante o non valido.')
      if (!FORMATS.has(feed.format)) errors.push('Formato non supportato.')
      const status = errors.length ? 'failed' : 'dry_run'
      await env.DB.prepare(`
        INSERT INTO supplier_feed_runs (feed_id, status, records_found, errors_json)
        VALUES (?, ?, ?, ?)
      `)
        .bind(id, status, 0, JSON.stringify(errors))
        .run()
      await env.DB.prepare(`
        UPDATE supplier_feeds
        SET last_run_at = CURRENT_TIMESTAMP, last_status = ?, last_message = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
        .bind(status, errors.join(' ') || 'Dry-run configurazione completato. Scheduler esterno richiesto per run automatici.', id)
        .run()
      return json({ success: !errors.length, message: errors.join(' ') || 'Dry-run completato.', errors })
    }

    const feed = normalize(body)
    if (!feed.name) return json({ success: false, message: 'Nome feed obbligatorio.' }, { status: 400 })
    await env.DB.prepare(`
      INSERT INTO supplier_feeds (name, source_url, format, active, schedule, import_target)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
      .bind(feed.name, feed.source_url, feed.format, feed.active, feed.schedule, feed.import_target)
      .run()
    return json({ success: true, message: 'Supplier feed creato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Supplier Feeds richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile salvare supplier feed.' }, { status: 500 })
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request)
    const id = Number(body.id)
    const feed = normalize(body)
    if (!id || !feed.name) return json({ success: false, message: 'Supplier feed non valido.' }, { status: 400 })
    await env.DB.prepare(`
      UPDATE supplier_feeds
      SET name = ?, source_url = ?, format = ?, active = ?, schedule = ?, import_target = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(feed.name, feed.source_url, feed.format, feed.active, feed.schedule, feed.import_target, id)
      .run()
    return json({ success: true, message: 'Supplier feed aggiornato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Supplier Feeds richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile aggiornare supplier feed.' }, { status: 500 })
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const id = Number(new URL(request.url).searchParams.get('id'))
    if (!id) return json({ success: false, message: 'Supplier feed non valido.' }, { status: 400 })
    await env.DB.prepare('UPDATE supplier_feeds SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(id).run()
    return json({ success: true, message: 'Supplier feed disattivato.' })
  } catch (error) {
    if (tableMissing(error)) return json({ success: false, message: 'Supplier Feeds richiede la migration 0017.' }, { status: 503 })
    return json({ success: false, message: 'Impossibile disattivare supplier feed.' }, { status: 500 })
  }
}
