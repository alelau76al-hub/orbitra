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

  collection_grid: {
    eyebrow: 'Collezioni',
    title: 'Esplora le nostre collezioni.',
    subtitle: 'Mostra una selezione di collezioni del catalogo con un layout premium e navigabile.',
  },

  featured_product: {
    eyebrow: 'Prodotto in evidenza',
    title: 'Il prodotto protagonista.',
    subtitle: 'Metti in risalto un prodotto specifico con una sezione dedicata.',
    product_slug: '',
    button_text: 'Scopri il prodotto',
    button_url: '#',
  },

  product_spotlight: {
    eyebrow: 'Spotlight',
    title: 'Un prodotto pensato per distinguersi.',
    text: 'Racconta un prodotto con una sezione visuale forte, descrizione editoriale e call to action.',
    product_slug: '',
    image_url: '',
    button_text: 'Acquista ora',
    button_url: '#',
  },

  product_carousel: {
    eyebrow: 'Carousel prodotti',
    title: 'Prodotti selezionati.',
    subtitle: 'Una sezione per mostrare più prodotti in modo dinamico e commerciale.',
    collection_slug: '',
  },

  best_sellers: {
    eyebrow: 'Best sellers',
    title: 'I più scelti dai clienti.',
    subtitle: 'Evidenzia i prodotti più importanti, popolari o strategici del catalogo.',
  },

  new_arrivals: {
    eyebrow: 'Novità',
    title: 'Nuovi arrivi.',
    subtitle: 'Mostra i prodotti più recenti o le ultime uscite del catalogo.',
  },

  trust_badges: {
    eyebrow: 'Fiducia',
    title: 'Acquista con sicurezza.',
    badge_1_title: 'Pagamento sicuro',
    badge_1_text: 'Transazioni protette e sistemi di pagamento affidabili.',
    badge_2_title: 'Spedizione tracciata',
    badge_2_text: 'Ogni ordine può essere monitorato fino alla consegna.',
    badge_3_title: 'Supporto dedicato',
    badge_3_text: 'Assistenza rapida prima e dopo l’acquisto.',
    badge_4_title: 'Qualità garantita',
    badge_4_text: 'Prodotti selezionati e controllati con cura.',
  },

  newsletter_signup: {
    eyebrow: 'Newsletter',
    title: 'Resta aggiornato.',
    subtitle: 'Invita gli utenti a iscriversi per ricevere novità, offerte e contenuti esclusivi.',
    placeholder: 'La tua email',
    button_text: 'Iscriviti',
    privacy_text: 'Niente spam. Solo aggiornamenti selezionati.',
  },

  promo_banner: {
    eyebrow: 'Promo',
    title: 'Offerta speciale per un periodo limitato.',
    text: 'Usa questa sezione per evidenziare campagne, sconti, lanci o comunicazioni importanti.',
    button_text: 'Scopri l’offerta',
    button_url: '#',
  },

  countdown_promo: {
    eyebrow: 'Limited drop',
    title: 'La promo termina presto.',
    text: 'Crea urgenza con una sezione countdown per offerte, lanci o eventi.',
    target_date: '2026-12-31T23:59:00',
    button_text: 'Approfitta ora',
    button_url: '#',
  },

  logo_partners: {
    eyebrow: 'Partner',
    title: 'Scelto da brand e realtà ambiziose.',
    subtitle: 'Mostra loghi, partner, clienti o collaborazioni importanti.',
    logo_1_text: 'Partner One',
    logo_2_text: 'Partner Two',
    logo_3_text: 'Partner Three',
    logo_4_text: 'Partner Four',
    logo_5_text: 'Partner Five',
  },

  press_mentions: {
    eyebrow: 'Press',
    title: 'Parlano di noi.',
    quote_1: 'Un progetto digitale con una qualità visiva fuori dal comune.',
    source_1: 'Magazine One',
    quote_2: 'Una nuova esperienza premium per il brand.',
    source_2: 'Business Journal',
    quote_3: 'Design, contenuto e tecnologia lavorano insieme.',
    source_3: 'Digital Review',
  },

  awards_recognition: {
    eyebrow: 'Awards',
    title: 'Riconoscimenti e risultati.',
    award_1_title: 'Design Excellence',
    award_1_text: 'Premio o riconoscimento legato alla qualità visiva.',
    award_2_title: 'Customer Choice',
    award_2_text: 'Riconoscimento legato alla soddisfazione dei clienti.',
    award_3_title: 'Innovation Award',
    award_3_text: 'Risultato legato a innovazione, tecnologia o crescita.',
  },

  team_section: {
    eyebrow: 'Team',
    title: 'Le persone dietro il progetto.',
    subtitle: 'Presenta membri del team, ruoli e competenze.',
    member_1_name: 'Nome Cognome',
    member_1_role: 'Founder',
    member_1_image_url: '',
    member_2_name: 'Nome Cognome',
    member_2_role: 'Creative Director',
    member_2_image_url: '',
    member_3_name: 'Nome Cognome',
    member_3_role: 'Operations',
    member_3_image_url: '',
  },

  founder_section: {
    eyebrow: 'Founder',
    title: 'Una visione personale, trasformata in brand.',
    text: 'Racconta la storia del founder, la visione e il motivo per cui il progetto esiste.',
    founder_name: 'Nome Founder',
    founder_role: 'Founder & CEO',
    quote: 'Abbiamo creato questo progetto per offrire qualcosa che prima non esisteva.',
    image_url: '',
  },

  services_grid: {
    eyebrow: 'Servizi',
    title: 'Cosa possiamo fare per te.',
    subtitle: 'Mostra servizi, soluzioni o aree operative in una griglia ordinata.',
    service_1_title: 'Strategia',
    service_1_text: 'Analisi, posizionamento e direzione del progetto.',
    service_2_title: 'Design',
    service_2_text: 'Esperienza visiva custom e identità digitale premium.',
    service_3_title: 'Sviluppo',
    service_3_text: 'Codice, CMS, performance e integrazioni.',
    service_4_title: 'Crescita',
    service_4_text: 'Ottimizzazione, contenuti e miglioramento continuo.',
  },

  accordion_advanced: {
    eyebrow: 'Approfondimenti',
    title: 'Informazioni organizzate in modo chiaro.',
    item_1_title: 'Dettaglio principale',
    item_1_text: 'Testo espandibile per spiegare un punto importante.',
    item_2_title: 'Secondo dettaglio',
    item_2_text: 'Un altro contenuto organizzato in formato accordion.',
    item_3_title: 'Terzo dettaglio',
    item_3_text: 'Perfetto per FAQ avanzate, servizi o informazioni tecniche.',
    item_4_title: 'Quarto dettaglio',
    item_4_text: 'Aggiungi contenuti senza appesantire la pagina.',
  },

  tabs_section: {
    eyebrow: 'Tabs',
    title: 'Contenuti divisi per argomento.',
    tab_1_label: 'Strategia',
    tab_1_title: 'Strategia su misura',
    tab_1_text: 'Contenuto del primo tab.',
    tab_2_label: 'Design',
    tab_2_title: 'Design premium',
    tab_2_text: 'Contenuto del secondo tab.',
    tab_3_label: 'Tecnologia',
    tab_3_title: 'Tecnologia custom',
    tab_3_text: 'Contenuto del terzo tab.',
  },

  video_spotlight: {
    eyebrow: 'Video',
    title: 'Racconta il brand con un video.',
    text: 'Una sezione video premium per presentazioni, campagne, backstage o contenuti emozionali.',
    video_url: '',
    poster_url: '',
    button_text: 'Guarda il video',
    button_url: '#',
  },

  full_width_image: {
    eyebrow: 'Visual',
    title: 'Un’immagine a tutta larghezza.',
    subtitle: 'Usa questa sezione per creare impatto visivo con una grande immagine editoriale.',
    image_url: '',
    caption: 'Caption immagine',
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