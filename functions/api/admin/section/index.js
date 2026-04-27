const defaultDataByType = {
  hero: {
    eyebrow: 'Luxury Space Travel',
    title: 'Compra il tuo posto tra le stelle',
    subtitle: 'Viaggi spaziali privati, esperienze zero-g e missioni interplanetarie.',
    button_text: 'Prenota una missione',
  },
  banner: {
    title: 'Preparati al lancio',
    text: 'Kit, accessori e prodotti selezionati per la tua missione spaziale.',
    button_text: 'Scopri i prodotti',
  },
  product_grid: {
    eyebrow: 'Shop pre-lancio',
    title: 'Prodotti dal database',
    subtitle: 'Articoli gestiti dalla dashboard custom.',
  },
  faq: {
    title: 'Domande frequenti',
    question: 'È un sito modificabile?',
    answer: 'Sì, i contenuti vengono salvati nel database Cloudflare D1.',
  },
  cta: {
    title: 'Pronto a lasciare il pianeta?',
    text: 'Richiedi accesso alla prossima missione privata.',
    button_text: 'Richiedi accesso',
  },
}

function getPageSlugFromRequest(request) {
  const url = new URL(request.url)
  return url.searchParams.get('page_slug') || 'home'
}

export async function onRequestGet({ request, env }) {
  const pageSlug = getPageSlugFromRequest(request)

  const { results } = await env.DB.prepare(`
    SELECT id, page_slug, type, sort_order, data
    FROM sections
    WHERE page_slug = ?
    ORDER BY sort_order ASC, id ASC
  `)
    .bind(pageSlug)
    .all()

  return Response.json({
    success: true,
    page_slug: pageSlug,
    sections: results.map((section) => ({
      ...section,
      data: JSON.parse(section.data),
    })),
  })
}

export async function onRequestPost({ request, env }) {
  const body = await request.json()
  const type = body.type
  const pageSlug = body.page_slug || 'home'

  if (!defaultDataByType[type]) {
    return Response.json(
      { success: false, message: 'Tipo sezione non valido.' },
      { status: 400 },
    )
  }

  const last = await env.DB.prepare(`
    SELECT COALESCE(MAX(sort_order), 0) AS max_order
    FROM sections
    WHERE page_slug = ?
  `)
    .bind(pageSlug)
    .first()

  await env.DB.prepare(`
    INSERT INTO sections (page_slug, type, sort_order, data)
    VALUES (?, ?, ?, ?)
  `)
    .bind(
      pageSlug,
      type,
      Number(last.max_order) + 1,
      JSON.stringify(defaultDataByType[type]),
    )
    .run()

  return Response.json({
    success: true,
    page_slug: pageSlug,
  })
}

export async function onRequestPut({ request, env }) {
  const body = await request.json()

  if (!body.id) {
    return Response.json(
      { success: false, message: 'ID sezione mancante.' },
      { status: 400 },
    )
  }

  if (body.data) {
    await env.DB.prepare(`
      UPDATE sections
      SET data = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        JSON.stringify(body.data),
        Number(body.id),
      )
      .run()
  }

  if (typeof body.sort_order === 'number') {
    await env.DB.prepare(`
      UPDATE sections
      SET sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        body.sort_order,
        Number(body.id),
      )
      .run()
  }

  return Response.json({ success: true })
}

export async function onRequestDelete({ request, env }) {
  const body = await request.json()
  const id = Number(body.id)

  if (!id || Number.isNaN(id)) {
    return Response.json(
      { success: false, message: 'ID sezione non valido.' },
      { status: 400 },
    )
  }

  await env.DB.prepare(`
    DELETE FROM sections
    WHERE id = ?
  `)
    .bind(id)
    .run()

  return Response.json({ success: true })
}