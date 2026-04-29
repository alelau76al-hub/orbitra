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

  text_image: {
    eyebrow: 'Contenuto',
    title: 'Titolo della sezione',
    text: 'Scrivi qui il testo principale della pagina.',
    image_url: '',
    button_text: 'Scopri di più',
    button_url: '#',
  },

  brand_manifesto: {
    eyebrow: 'Manifesto',
    title: 'Un brand costruito per lasciare il segno.',
    text: 'Racconta la visione, il carattere e il valore distintivo del brand con una sezione editoriale premium.',
    quote: 'Non creiamo semplici esperienze. Creiamo momenti che restano impressi.',
    image_url: '',
    button_text: 'Scopri la nostra storia',
    button_url: '#',
  },

  timeline_premium: {
    eyebrow: 'Percorso',
    title: 'Il nostro viaggio.',
    subtitle: 'Una timeline elegante per raccontare evoluzione, tappe, lanci o processo aziendale.',
    step_1_year: '2024',
    step_1_title: 'Fondazione',
    step_1_text: 'Nasce l’idea e vengono definite visione, identità e direzione del progetto.',
    step_2_year: '2025',
    step_2_title: 'Primo lancio',
    step_2_text: 'Il brand prende forma con una prima esperienza digitale completa.',
    step_3_year: '2026',
    step_3_title: 'Espansione',
    step_3_text: 'Il progetto evolve verso nuovi mercati, servizi e opportunità.',
  },

  process_steps: {
    eyebrow: 'Metodo',
    title: 'Un processo chiaro, premium e controllato.',
    subtitle: 'Mostra come lavori, quali step segue il cliente e perché il tuo metodo genera valore.',
    step_1_title: 'Analisi',
    step_1_text: 'Studiamo obiettivi, pubblico, posizionamento e necessità reali del progetto.',
    step_2_title: 'Strategia',
    step_2_text: 'Definiamo struttura, contenuti, esperienza utente e priorità operative.',
    step_3_title: 'Design',
    step_3_text: 'Costruiamo un’esperienza visiva custom, coerente e memorabile.',
    step_4_title: 'Lancio',
    step_4_text: 'Pubblichiamo, testiamo e prepariamo il progetto per crescere nel tempo.',
  },

  stats_numbers: {
    eyebrow: 'Numeri',
    title: 'Risultati che parlano.',
    subtitle: 'Una sezione perfetta per mostrare metriche, performance, clienti, vendite o risultati.',
    stat_1_value: '98%',
    stat_1_label: 'Clienti soddisfatti',
    stat_2_value: '24h',
    stat_2_label: 'Supporto operativo',
    stat_3_value: '120+',
    stat_3_label: 'Progetti gestiti',
    stat_4_value: '4.9/5',
    stat_4_label: 'Valutazione media',
  },

  gallery_editorial: {
    eyebrow: 'Gallery',
    title: 'Un racconto visivo editoriale.',
    subtitle: 'Mostra immagini, atmosfere, prodotti o dettagli del brand con un layout premium.',
    image_1_url: '',
    image_1_caption: 'Dettaglio editoriale',
    image_2_url: '',
    image_2_caption: 'Esperienza premium',
    image_3_url: '',
    image_3_caption: 'Identità visiva',
  },

  testimonials: {
    eyebrow: 'Testimonianze',
    title: 'Cosa dicono di noi.',
    quote_1: 'Un’esperienza curata nei minimi dettagli, con una qualità superiore alle aspettative.',
    author_1: 'Cliente Premium',
    role_1: 'Founder',
    quote_2: 'Il progetto ha trasformato completamente la percezione del nostro brand.',
    author_2: 'Cliente Business',
    role_2: 'CEO',
    quote_3: 'Design, strategia e tecnologia in un unico sistema estremamente solido.',
    author_3: 'Cliente Enterprise',
    role_3: 'Marketing Director',
  },

  featured_collection: {
    eyebrow: 'Collezione in evidenza',
    title: 'Scopri la collezione selezionata.',
    subtitle: 'Metti in evidenza una collezione specifica del catalogo e guida l’utente verso i prodotti.',
    collection_slug: '',
    button_text: 'Esplora collezione',
    button_url: '#',
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

function parseSectionData(value) {
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
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
      data: parseSectionData(section.data),
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