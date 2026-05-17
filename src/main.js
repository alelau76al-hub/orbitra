import './style.css'

const STOREFRONT_LANGUAGE_STORAGE_KEY = 'takeoff_storefront_language_v1'
const STOREFRONT_DEFAULT_LANGUAGE = 'it'
const STOREFRONT_SUPPORTED_LANGUAGES = ['it', 'en', 'fr', 'es', 'de']
const STOREFRONT_LOCALES = {
  it: 'it-IT',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
}
const STOREFRONT_TRANSLATIONS = {
  it: {
    languageLabel: 'Lingua',
    listAnd: ' e ',
    cart: 'Carrello',
    cartTitle: 'Il tuo carrello',
    cartClose: 'Chiudi',
    cartEmpty: 'Il carrello e vuoto.',
    cartTotal: 'Totale',
    cartCheckout: 'Vai al checkout',
    cartNote: 'Pagamento manuale o simulato. Nessun pagamento reale viene elaborato.',
    cartAddFirst: 'Aggiungi almeno un prodotto prima del checkout.',
    cartProductUnavailable: 'Prodotto non disponibile.',
    cartStockExceeded: 'Quantita richiesta superiore allo stock disponibile.',
    cartAdded: '{name} aggiunto al carrello.',
    cartRemove: 'Rimuovi',
    cartProductDetailsLoading: 'Dettagli prodotto non ancora caricati.',
    product: 'Prodotto',
    products: 'Prodotti',
    productFallback: 'Prodotto',
    productNoImage: 'Prodotto senza immagine',
    productNoDescription: 'Nessuna descrizione disponibile.',
    productLoading: 'Caricamento prodotto...',
    productLoadingText: 'Stiamo recuperando i dettagli dal catalogo.',
    productNotFound: 'Prodotto non trovato',
    productNotFoundText: 'Questo prodotto non esiste o non e piu disponibile.',
    productLoadError: 'Errore caricamento prodotto',
    productLoadErrorText: 'Non e stato possibile recuperare questo prodotto.',
    backToShop: 'Torna allo shop',
    addToCart: 'Aggiungi al carrello',
    unavailable: 'Non disponibile',
    details: 'Dettagli',
    soldOut: 'esaurita',
    variantsAvailable: '{count} varianti disponibili',
    stock: 'Stock',
    category: 'Categoria',
    collection: 'Collezione',
    noCategory: 'Senza categoria',
    noCollection: 'Senza collezione',
    variant: 'Variante',
    variantUnavailable: 'Questa variante non e disponibile.',
    variantAvailable: '{count} disponibili per la variante selezionata.',
    quantity: 'Quantita',
    view3d: 'Visualizza in 3D',
    trustCheckout: 'Checkout protetto',
    trustShipping: 'Spedizione tracciata',
    trustSupport: 'Assistenza post-acquisto',
    description: 'Descrizione',
    shippingReturns: 'Spedizione e resi',
    shippingReturnsText: 'Costi, tasse e metodi disponibili vengono calcolati al checkout con fallback sicuri.',
    specs: 'Specifiche',
    relatedProducts: 'Prodotti correlati',
    sameCollection: 'Dalla stessa collezione',
    relatedText: 'Altre scelte coerenti con questo prodotto.',
    collectionLoading: 'Caricamento collezione...',
    collectionLoadingText: 'Stiamo recuperando prodotti e contenuti dal CMS.',
    collectionNotFound: 'Collezione non trovata',
    collectionNotFoundText: 'Questa collezione non esiste o non e piu attiva.',
    collectionUnavailable: 'Questa collezione non e disponibile.',
    collectionLoadError: 'Errore caricamento collezione',
    collectionLoadErrorText: 'Non e stato possibile caricare questa pagina.',
    collectionProductsDefault: 'Prodotti selezionati da questa collezione.',
    collectionEmpty: 'Nessun prodotto disponibile in questa collezione.',
    noProducts: 'Nessun prodotto disponibile.',
    noCollections: 'Nessuna collezione disponibile.',
    productsLoadError: 'Errore caricamento prodotti.',
    collectionsLoadError: 'Errore caricamento collezioni.',
    viewCollection: 'Vedi collezione',
    discoverProduct: 'Scopri il prodotto',
    checkout: 'Checkout',
    checkoutLoading: 'Caricamento checkout...',
    checkoutLoadingText: 'Stiamo preparando riepilogo, spedizione e pagamento.',
    checkoutComplete: "Completa l'ordine.",
    checkoutIntro: 'Riepilogo validato lato server, pagamento manuale/test o Stripe test mode se configurato.',
    checkoutEmptyTitle: 'Il carrello e vuoto',
    checkoutEmptyText: "Aggiungi almeno un prodotto prima di completare l'ordine.",
    checkoutUnavailable: 'Checkout non disponibile',
    checkoutUnavailableText: 'Non e stato possibile preparare il checkout.',
    checkoutCustomer: 'Dati cliente',
    checkoutFullName: 'Nome completo',
    checkoutEmail: 'Email',
    checkoutPhone: 'Telefono opzionale',
    checkoutAddress: 'Indirizzo spedizione',
    checkoutAddressLine: 'Indirizzo',
    checkoutCity: 'Citta',
    checkoutPostal: 'CAP',
    checkoutCountry: 'Paese',
    checkoutShippingMethod: 'Metodo spedizione',
    checkoutPayment: 'Pagamento',
    checkoutPaymentMethod: 'Metodo pagamento',
    checkoutManual: 'Pagamento manuale / pending',
    checkoutStripe: 'Stripe test mode',
    checkoutTestPaid: 'Pagamento simulato riuscito',
    checkoutTestFailed: 'Pagamento simulato fallito',
    checkoutSubmit: 'Completa ordine',
    checkoutSummary: 'Riepilogo',
    checkoutDiscountCode: 'Codice sconto',
    checkoutApply: 'Applica',
    checkoutSubtotal: 'Subtotale',
    checkoutShipping: 'Spedizione',
    checkoutStandardShipping: 'Spedizione standard',
    checkoutStandardShippingText: 'Metodo standard disponibile come fallback.',
    checkoutFreeOver: 'sopra {amount}',
    checkoutDiscount: 'Sconto',
    checkoutTaxIncluded: 'IVA inclusa',
    checkoutTax: 'IVA',
    checkoutTotal: 'Totale',
    checkoutPolicyAccept: 'Accetto {links}.',
    checkoutEmptyMessage: 'Il carrello e vuoto.',
    checkoutCreating: 'Creazione ordine in corso...',
    checkoutError: 'Errore creazione ordine.',
    checkoutConnectionError: 'Errore di connessione durante il checkout.',
    checkoutGoToShop: 'Vai allo shop',
    discountInsert: 'Inserisci un codice sconto.',
    discountChecking: 'Verifica codice sconto...',
    discountInvalid: 'Codice sconto non valido.',
    discountApplied: '{code} applicato: -{amount}',
    discountUnavailable: 'Sconti non disponibili ora. Puoi completare senza coupon.',
    orderCreated: 'Ordine creato',
    thankYou: 'Grazie, ordine #{id} ricevuto.',
    paymentStatus: 'Stato pagamento',
    orderStatus: 'Stato ordine',
    orderTotal: 'Totale ordine',
    paymentMethod: 'Metodo pagamento',
    backToSite: 'Torna al sito',
    stripePreparing: 'Preparazione pagamento Stripe...',
    stripeUnavailable: 'Ordine #{id} creato, ma Stripe non e disponibile.',
    paymentCanceled: 'Pagamento Stripe annullato',
    paymentCanceledText: "L'ordine #{id} resta in attesa. Puoi riprovare o scegliere pagamento manuale.",
    backToCheckout: 'Torna al checkout',
  },
  en: {
    languageLabel: 'Language',
    listAnd: ' and ',
    cart: 'Cart',
    cartTitle: 'Your cart',
    cartClose: 'Close',
    cartEmpty: 'Your cart is empty.',
    cartTotal: 'Total',
    cartCheckout: 'Go to checkout',
    cartNote: 'Manual or simulated payment. No real payment is processed.',
    cartAddFirst: 'Add at least one product before checkout.',
    cartProductUnavailable: 'Product unavailable.',
    cartStockExceeded: 'Requested quantity exceeds available stock.',
    cartAdded: '{name} added to cart.',
    cartRemove: 'Remove',
    cartProductDetailsLoading: 'Product details not loaded yet.',
    product: 'Product',
    products: 'Products',
    productFallback: 'Product',
    productNoImage: 'Product without image',
    productNoDescription: 'No description available.',
    productLoading: 'Loading product...',
    productLoadingText: 'Retrieving details from the catalog.',
    productNotFound: 'Product not found',
    productNotFoundText: 'This product does not exist or is no longer available.',
    productLoadError: 'Product loading error',
    productLoadErrorText: 'We could not retrieve this product.',
    backToShop: 'Back to shop',
    addToCart: 'Add to cart',
    unavailable: 'Unavailable',
    details: 'Details',
    soldOut: 'sold out',
    variantsAvailable: '{count} variants available',
    stock: 'Stock',
    category: 'Category',
    collection: 'Collection',
    noCategory: 'No category',
    noCollection: 'No collection',
    variant: 'Variant',
    variantUnavailable: 'This variant is unavailable.',
    variantAvailable: '{count} available for the selected variant.',
    quantity: 'Quantity',
    view3d: 'View in 3D',
    trustCheckout: 'Secure checkout',
    trustShipping: 'Tracked shipping',
    trustSupport: 'Post-purchase support',
    description: 'Description',
    shippingReturns: 'Shipping and returns',
    shippingReturnsText: 'Costs, taxes and available methods are calculated at checkout with safe fallbacks.',
    specs: 'Specifications',
    relatedProducts: 'Related products',
    sameCollection: 'From the same collection',
    relatedText: 'Other choices aligned with this product.',
    collectionLoading: 'Loading collection...',
    collectionLoadingText: 'Retrieving products and content from the CMS.',
    collectionNotFound: 'Collection not found',
    collectionNotFoundText: 'This collection does not exist or is no longer active.',
    collectionUnavailable: 'This collection is not available.',
    collectionLoadError: 'Collection loading error',
    collectionLoadErrorText: 'We could not load this page.',
    collectionProductsDefault: 'Selected products from this collection.',
    collectionEmpty: 'No products available in this collection.',
    noProducts: 'No products available.',
    noCollections: 'No collections available.',
    productsLoadError: 'Product loading error.',
    collectionsLoadError: 'Collection loading error.',
    viewCollection: 'View collection',
    discoverProduct: 'Discover product',
    checkout: 'Checkout',
    checkoutLoading: 'Loading checkout...',
    checkoutLoadingText: 'Preparing summary, shipping and payment.',
    checkoutComplete: 'Complete your order.',
    checkoutIntro: 'Server-side validated summary, manual/test payment or Stripe test mode when configured.',
    checkoutEmptyTitle: 'Your cart is empty',
    checkoutEmptyText: 'Add at least one product before completing the order.',
    checkoutUnavailable: 'Checkout unavailable',
    checkoutUnavailableText: 'We could not prepare checkout.',
    checkoutCustomer: 'Customer details',
    checkoutFullName: 'Full name',
    checkoutEmail: 'Email',
    checkoutPhone: 'Phone optional',
    checkoutAddress: 'Shipping address',
    checkoutAddressLine: 'Address',
    checkoutCity: 'City',
    checkoutPostal: 'Postal code',
    checkoutCountry: 'Country',
    checkoutShippingMethod: 'Shipping method',
    checkoutPayment: 'Payment',
    checkoutPaymentMethod: 'Payment method',
    checkoutManual: 'Manual / pending payment',
    checkoutStripe: 'Stripe test mode',
    checkoutTestPaid: 'Simulated successful payment',
    checkoutTestFailed: 'Simulated failed payment',
    checkoutSubmit: 'Complete order',
    checkoutSummary: 'Summary',
    checkoutDiscountCode: 'Discount code',
    checkoutApply: 'Apply',
    checkoutSubtotal: 'Subtotal',
    checkoutShipping: 'Shipping',
    checkoutStandardShipping: 'Standard shipping',
    checkoutStandardShippingText: 'Standard method available as fallback.',
    checkoutFreeOver: 'over {amount}',
    checkoutDiscount: 'Discount',
    checkoutTaxIncluded: 'VAT included',
    checkoutTax: 'VAT',
    checkoutTotal: 'Total',
    checkoutPolicyAccept: 'I accept {links}.',
    checkoutEmptyMessage: 'Your cart is empty.',
    checkoutCreating: 'Creating order...',
    checkoutError: 'Order creation error.',
    checkoutConnectionError: 'Connection error during checkout.',
    checkoutGoToShop: 'Go to shop',
    discountInsert: 'Enter a discount code.',
    discountChecking: 'Checking discount code...',
    discountInvalid: 'Invalid discount code.',
    discountApplied: '{code} applied: -{amount}',
    discountUnavailable: 'Discounts are not available now. You can complete without coupon.',
    orderCreated: 'Order created',
    thankYou: 'Thank you, order #{id} received.',
    paymentStatus: 'Payment status',
    orderStatus: 'Order status',
    orderTotal: 'Order total',
    paymentMethod: 'Payment method',
    backToSite: 'Back to site',
    stripePreparing: 'Preparing Stripe payment...',
    stripeUnavailable: 'Order #{id} created, but Stripe is unavailable.',
    paymentCanceled: 'Stripe payment canceled',
    paymentCanceledText: 'Order #{id} remains pending. You can retry or choose manual payment.',
    backToCheckout: 'Back to checkout',
  },
}

function getStorefrontLanguage() {
  try {
    const saved = localStorage.getItem(STOREFRONT_LANGUAGE_STORAGE_KEY)
    return STOREFRONT_SUPPORTED_LANGUAGES.includes(saved) ? saved : STOREFRONT_DEFAULT_LANGUAGE
  } catch {
    return STOREFRONT_DEFAULT_LANGUAGE
  }
}

function setStorefrontLanguage(language) {
  const nextLanguage = STOREFRONT_SUPPORTED_LANGUAGES.includes(language) ? language : STOREFRONT_DEFAULT_LANGUAGE
  try {
    localStorage.setItem(STOREFRONT_LANGUAGE_STORAGE_KEY, nextLanguage)
  } catch {}
}

function sfT(key, replacements = {}) {
  const language = getStorefrontLanguage()
  const template =
    STOREFRONT_TRANSLATIONS[language]?.[key] ||
    STOREFRONT_TRANSLATIONS[STOREFRONT_DEFAULT_LANGUAGE]?.[key] ||
    key

  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  )
}

function getStorefrontLocale() {
  return STOREFRONT_LOCALES[getStorefrontLanguage()] || STOREFRONT_LOCALES.it
}

let publicTranslationsLocale = ''
let publicTranslationMap = new Map()

function getTranslationMapKey(entityType, entityId, fieldKey) {
  return `${entityType}:${Number(entityId || 0)}:${fieldKey}`
}

async function loadPublicTranslations(locale = getStorefrontLanguage()) {
  if (publicTranslationsLocale === locale) return

  publicTranslationsLocale = locale
  publicTranslationMap = new Map()

  if (!locale) return

  try {
    const response = await fetch(`/api/translations?locale=${encodeURIComponent(locale)}`)
    const data = await response.json()

    if (!response.ok || !data.success || !Array.isArray(data.translations)) return

    publicTranslationMap = data.translations.reduce((map, translation) => {
      if (translation.translated_value) {
        map.set(
          getTranslationMapKey(
            translation.entity_type,
            translation.entity_id,
            translation.field_key,
          ),
          translation.translated_value,
        )
      }

      return map
    }, new Map())
  } catch {
    publicTranslationMap = new Map()
  }
}

function getTranslatedField(entityType, entityId, fieldKey, fallback = '') {
  return publicTranslationMap.get(getTranslationMapKey(entityType, entityId, fieldKey)) || fallback || ''
}

function translateSeo(seo = {}, entityType, entityId) {
  return {
    ...seo,
    meta_title: getTranslatedField(entityType, entityId, 'seo.meta_title', seo.meta_title || ''),
    meta_description: getTranslatedField(
      entityType,
      entityId,
      'seo.meta_description',
      seo.meta_description || '',
    ),
  }
}

function translateContentEntity(entity = {}, entityType, fields = []) {
  if (!entity?.id) return entity

  const translated = {
    ...entity,
  }

  fields.forEach((fieldKey) => {
    translated[fieldKey] = getTranslatedField(entityType, entity.id, fieldKey, entity[fieldKey] || '')
  })

  if (translated.seo) {
    translated.seo = translateSeo(translated.seo, entityType, entity.id)
  }

  return translated
}

function translateProducts(products = []) {
  return products.map((product) => translateContentEntity(product, 'product', ['name', 'description']))
}

function translateCollections(collections = []) {
  return collections.map((collection) =>
    translateContentEntity(collection, 'collection', ['name', 'description']),
  )
}

function translatePages(pages = []) {
  return pages.map((page) => translateContentEntity(page, 'page', ['title']))
}

function translateBlogPost(post = {}) {
  return translateContentEntity(post, 'blog', [
    'title',
    'excerpt',
    'content',
    'meta_title',
    'meta_description',
  ])
}

function translatePolicy(policy = {}) {
  return translateContentEntity(policy, 'policy', ['title', 'content'])
}

function translateSection(section = {}) {
  if (!section?.id || !section.data) return section

  const data = {
    ...section.data,
  }

  ;['eyebrow', 'title', 'subtitle', 'text', 'button_text', 'question', 'answer'].forEach(
    (field) => {
      data[field] = getTranslatedField('section', section.id, `data.${field}`, data[field] || '')
    },
  )

  return {
    ...section,
    data,
  }
}

const formatMoney = (value) =>
  new Intl.NumberFormat(getStorefrontLocale(), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)

const destinations = [
  {
    id: 'moon',
    name: 'Luna',
    type: 'orbitale',
    duration: '3 giorni',
    price: 95000,
    badge: 'Best seller',
    icon: '🌙',
    description: 'Un viaggio oltre l’atmosfera con vista diretta sulla Terra e orbita lunare panoramica.',
  },
  {
    id: 'mars',
    name: 'Marte',
    type: 'interplanetario',
    duration: '21 giorni',
    price: 420000,
    badge: 'Elite',
    icon: '🔴',
    description: 'La missione definitiva per chi vuole atterrare virtualmente sul pianeta rosso.',
  },
  {
    id: 'station',
    name: 'Stazione Orbitale',
    type: 'orbitale',
    duration: '7 giorni',
    price: 180000,
    badge: 'Zero-G',
    icon: '🛰️',
    description: 'Esperienza in gravità zero con suite panoramica e allenamento astronautico incluso.',
  },
  {
    id: 'titan',
    name: 'Titano',
    type: 'deep-space',
    duration: '45 giorni',
    price: 890000,
    badge: 'Ultra luxury',
    icon: '🪐',
    description: 'Un’esperienza cinematografica verso le lune di Saturno, pensata per viaggiatori visionari.',
  },
]

document.querySelector('#app').innerHTML = `
  <div class="cursor-glow"></div>
  <div class="noise"></div>

  <header class="nav">
    <a class="logo" href="#">
      <span class="logo-mark">✦</span>
      ORBITRA
    </a>

    <nav class="nav-links" id="mainMenuLinks">
  <a href="#viaggi">Viaggi</a>
  <a href="#missione">Missione</a>
  <a href="#booking">Prenota</a>
  <a href="#faq">FAQ</a>
</nav>

    <a class="nav-cta" href="#booking">Launch Pass</a>
    <select class="market-selector" id="marketSelector" aria-label="Mercato" hidden></select>
    <select class="language-selector" id="languageSelector" aria-label="Lingua">
      <option value="it">IT</option>
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="es">ES</option>
      <option value="de">DE</option>
    </select>
    <button class="cart-toggle" type="button" data-cart-open>
      Carrello <span id="cartCount">0</span>
    </button>
  </header>

  <main>
    <section class="hero">
      <div class="stars"></div>
      <div class="orb orb-one"></div>
      <div class="orb orb-two"></div>
      <div class="orb orb-three"></div>

      <div class="hero-content reveal">
        <p class="eyebrow">Luxury Space Travel Agency</p>
        <h1>Compra il tuo posto tra le stelle.</h1>
        <p class="hero-text">
          Viaggi spaziali privati, esperienze in orbita, suite zero-g e missioni interplanetarie
          per chi non vuole semplicemente viaggiare, ma lasciare il pianeta.
        </p>

        <div class="hero-actions">
          <a class="btn primary" href="#booking">Prenota una missione</a>
          <a class="btn ghost" href="#viaggi">Esplora destinazioni</a>
        </div>

        <div class="trust-row">
          <span>NASA-grade simulation</span>
          <span>Zero-G training</span>
          <span>Concierge 24/7</span>
        </div>
      </div>

      <div class="ship-card reveal">
        <div class="ship-visual">
          <div class="planet"></div>
          <div class="orbit-line"></div>
          <div class="ship">🚀</div>
        </div>

        <div class="ship-info">
          <p>Next launch window</p>
          <h2 id="countdown">--:--:--:--</h2>
          <span>Missione Aurora-X / Orbita terrestre bassa</span>
        </div>
      </div>
    </section>

    <section class="stats reveal">
      <div>
        <strong>128k km</strong>
        <span>percorsi simulati</span>
      </div>
      <div>
        <strong>4.98/5</strong>
        <span>rating passeggeri</span>
      </div>
      <div>
        <strong>12</strong>
        <span>capsule premium</span>
      </div>
      <div>
        <strong>24h</strong>
        <span>training pre-volo</span>
      </div>
    </section>

    <section id="viaggi" class="section">
      <div class="section-head reveal">
        <p class="eyebrow">Destinazioni</p>
        <h2>Scegli la tua orbita.</h2>
        <p>
          Ogni pacchetto include simulazione, assistenza concierge, briefing tecnico,
          kit astronauta e accesso lounge pre-lancio.
        </p>
      </div>

      <div class="filters reveal">
        <button class="filter active" data-filter="all">Tutti</button>
        <button class="filter" data-filter="orbitale">Orbitale</button>
        <button class="filter" data-filter="interplanetario">Interplanetario</button>
        <button class="filter" data-filter="deep-space">Deep space</button>
      </div>

      <div id="destinationGrid" class="destination-grid"></div>
    </section>

    <section id="missione" class="section split">
      <div class="mission-copy reveal">
        <p class="eyebrow">Esperienza</p>
        <h2>Non vendiamo biglietti. Progettiamo decolli.</h2>
        <p>
          Dal primo colloquio alla simulazione zero-g, ogni dettaglio è costruito
          per trasformare il viaggio in un evento irripetibile.
        </p>

        <div class="timeline">
          <div>
            <span>01</span>
            <h3>Briefing privato</h3>
            <p>Analisi obiettivi, destinazione, budget e livello di adrenalina desiderato.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Training astronautico</h3>
            <p>Sessioni immersive, simulazione lancio, preparazione fisica e mentale.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Launch day</h3>
            <p>Accesso premium alla base, boarding assistito e decollo monitorato.</p>
          </div>
        </div>
      </div>

      <div class="holo-panel reveal">
        <div class="scan-line"></div>
        <p>Mission Control</p>
        <h3>Aurora-X Capsule</h3>

        <div class="system-row">
          <span>Oxygen</span>
          <strong>98%</strong>
        </div>
        <div class="bar"><span style="width:98%"></span></div>

        <div class="system-row">
          <span>Shield</span>
          <strong>91%</strong>
        </div>
        <div class="bar"><span style="width:91%"></span></div>

        <div class="system-row">
          <span>Luxury Mode</span>
          <strong>100%</strong>
        </div>
        <div class="bar"><span style="width:100%"></span></div>

        <div class="radar">
          <span></span>
        </div>
      </div>
    </section>

    <section id="booking" class="section booking">
      <div class="section-head reveal">
        <p class="eyebrow">Configuratore</p>
        <h2>Costruisci la tua missione.</h2>
        <p>
          Seleziona una destinazione, il numero di passeggeri e ricevi una stima immediata.
        </p>
      </div>

      <div class="booking-grid">
        <div class="booking-card reveal">
          <label>Destinazione</label>
          <select id="destinationSelect">
            ${destinations.map((item) => `<option value="${item.id}">${item.name} — ${formatMoney(item.price)}</option>`).join('')}
          </select>

          <label>Passeggeri</label>
          <input id="passengersRange" type="range" min="1" max="6" value="2">
          <div class="range-output">
            <span id="passengersOutput">2 passeggeri</span>
            <span>max 6</span>
          </div>

          <label>Pacchetto</label>
          <div class="packages">
            <button class="package active" data-multiplier="1">
              Standard Orbit
              <small>training + lounge</small>
            </button>
            <button class="package" data-multiplier="1.35">
              Neon Luxury
              <small>suite + concierge</small>
            </button>
            <button class="package" data-multiplier="1.85">
              Black Galaxy
              <small>full private mission</small>
            </button>
          </div>
        </div>

        <div class="price-card reveal">
          <p>Stima missione</p>
          <h3 id="totalPrice">€0</h3>
          <span id="priceDetails">Calcolo in corso...</span>

          <form id="leadForm">
            <input type="text" placeholder="Nome" required>
            <input type="email" placeholder="Email" required>
            <button class="btn primary" type="submit">Richiedi invito privato</button>
          </form>

          <p id="formMessage" class="form-message"></p>
        </div>
      </div>
    </section>

    <section id="faq" class="section faq">
      <div class="section-head reveal">
        <p class="eyebrow">FAQ</p>
        <h2>Domande prima del decollo.</h2>
      </div>

      <div class="faq-list reveal">
        <button class="faq-item">
          <span>È un sito reale o una demo?</span>
          <strong>+</strong>
          <p>Per ora è una demo futuristica. Può diventare un vero sito con pagine, checkout, form funzionanti e pubblicazione online.</p>
        </button>

        <button class="faq-item">
          <span>Posso aggiungere animazioni più avanzate?</span>
          <strong>+</strong>
          <p>Sì. Possiamo aggiungere effetti 3D, caroselli, login, dashboard, pagamenti, database e integrazione con Shopify o Cloudflare.</p>
        </button>

        <button class="faq-item">
          <span>Questo sito si può pubblicare?</span>
          <strong>+</strong>
          <p>Sì. Quando è pronto userai npm run build e potrai pubblicarlo su Cloudflare Pages, Netlify, Vercel o GitHub Pages.</p>
        </button>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-main">
      <p class="footer-text">ORBITRA © 2026 — Space travel for the impossible generation.</p>
      <a class="footer-cta" href="#booking">Request launch access</a>
    </div>

    <nav class="footer-links" id="footerMenuLinks" aria-label="Menu footer" hidden></nav>
    <div class="footer-social" id="footerSocialLinks" aria-label="Link social" hidden></div>
  </footer>

  <div class="cart-overlay" id="cartOverlay" hidden data-cart-close></div>
  <aside class="cart-panel" id="cartPanel" aria-hidden="true">
    <div class="cart-head">
      <div>
        <p class="eyebrow">Carrello</p>
        <h2>Il tuo carrello</h2>
      </div>
      <button type="button" class="cart-close" data-cart-close>Chiudi</button>
    </div>

    <div id="cartItems" class="cart-items"></div>

    <div class="cart-summary">
      <span>Totale</span>
      <strong id="cartTotal">€0</strong>
    </div>

    <a class="btn primary cart-checkout" href="/checkout">Vai al checkout</a>
    <p id="cartMessage" class="cart-message"></p>
    <p class="cart-note">Pagamento manuale o simulato. Nessun pagamento reale viene elaborato.</p>
  </aside>
`

function applyStorefrontLanguage() {
  const language = getStorefrontLanguage()
  document.documentElement.lang = language

  const selector = document.querySelector('#languageSelector')
  if (selector) {
    selector.value = language
    selector.setAttribute('aria-label', sfT('languageLabel'))
  }

  const cartToggle = document.querySelector('.cart-toggle')
  const countTarget = document.querySelector('#cartCount')
  if (cartToggle && countTarget) {
    cartToggle.innerHTML = `${sfT('cart')} <span id="cartCount">${escapeCmsHtml(countTarget.textContent || '0')}</span>`
  }

  const cartEyebrow = document.querySelector('.cart-head .eyebrow')
  if (cartEyebrow) cartEyebrow.textContent = sfT('cart')

  const cartTitle = document.querySelector('.cart-head h2')
  if (cartTitle) cartTitle.textContent = sfT('cartTitle')

  const cartClose = document.querySelector('.cart-close')
  if (cartClose) cartClose.textContent = sfT('cartClose')

  const cartSummaryLabel = document.querySelector('.cart-summary span')
  if (cartSummaryLabel) cartSummaryLabel.textContent = sfT('cartTotal')

  const cartCheckout = document.querySelector('.cart-checkout')
  if (cartCheckout) cartCheckout.textContent = sfT('cartCheckout')

  const cartNote = document.querySelector('.cart-note')
  if (cartNote) cartNote.textContent = sfT('cartNote')

  renderCart()
}

function setupStorefrontLanguageSelector() {
  const selector = document.querySelector('#languageSelector')
  if (!selector) return

  selector.value = getStorefrontLanguage()
  selector.addEventListener('change', () => {
    setStorefrontLanguage(selector.value)
    applyStorefrontLanguage()
    bootPublicRouting()
  })
}

function buildMenuItemUrl(item) {
  if (item.link_type === 'url') {
    return item.url || '#'
  }

  if (item.link_type === 'page') {
    if (item.target_slug === 'home') return '/'
    return `/${item.target_slug}`
  }

  if (item.link_type === 'collection') {
    return `/collections/${item.target_slug}`
  }

  if (item.link_type === 'product') {
    return `/products/${item.target_slug}`
  }

  return '#'
}

const CART_STORAGE_KEY = 'orbitra_cart_v1'
const ANALYTICS_SESSION_KEY = 'orbitra_analytics_session_v1'
const MARKET_STORAGE_KEY = 'orbitra_market_v1'
const productCache = new Map()

function formatPriceCents(priceCents = 0) {
  return (Number(priceCents || 0) / 100).toLocaleString(getStorefrontLocale(), {
    style: 'currency',
    currency: 'EUR',
  })
}

const DEFAULT_TAX_SETTINGS = {
  vat_rate: 22,
  prices_include_tax: true,
}

let activeCheckoutDiscount = null
let activeCheckoutIdempotencyKey = ''
let primaryCanonicalOrigin = ''

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    const data = await response.json()
    return { response, data }
  } finally {
    window.clearTimeout(timeout)
  }
}

function setMetaTag(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element.setAttribute(key, value)
  })
}

function applySeoMeta(seo = {}, fallback = {}) {
  const title = seo.meta_title || fallback.title || 'Orbitra'
  const description =
    seo.meta_description ||
    fallback.description ||
    'CMS ecommerce custom Orbitra.'
  const image = seo.og_image || fallback.image || ''
  const canonical =
    seo.canonical_url ||
    fallback.canonical ||
    (primaryCanonicalOrigin
      ? `${primaryCanonicalOrigin}${window.location.pathname}`
      : window.location.href)

  document.title = title

  setMetaTag('meta[name="description"]', {
    name: 'description',
    content: description,
  })
  setMetaTag('meta[property="og:title"]', {
    property: 'og:title',
    content: title,
  })
  setMetaTag('meta[property="og:description"]', {
    property: 'og:description',
    content: description,
  })

  if (image) {
    setMetaTag('meta[property="og:image"]', {
      property: 'og:image',
      content: image,
    })
  }

  setMetaTag('link[rel="canonical"]', {
    rel: 'canonical',
    href: canonical,
  })
}

async function loadTaxSettings() {
  try {
    const response = await fetch('/api/tax')
    const data = await response.json()

    if (!response.ok || !data.success) return DEFAULT_TAX_SETTINGS

    return {
      vat_rate: Number(data.settings?.vat_rate ?? DEFAULT_TAX_SETTINGS.vat_rate),
      prices_include_tax: data.settings?.prices_include_tax !== false,
    }
  } catch {
    return DEFAULT_TAX_SETTINGS
  }
}

function calculateTaxSummary(subtotalCents, shippingCents, discountCents, taxSettings) {
  const taxableCents = Math.max(0, subtotalCents - discountCents + shippingCents)
  const vatRate = Math.max(0, Number(taxSettings?.vat_rate || 0))
  const pricesIncludeTax = taxSettings?.prices_include_tax !== false

  if (vatRate <= 0) {
    return {
      tax_cents: 0,
      total_cents: taxableCents,
      prices_include_tax: pricesIncludeTax,
    }
  }

  if (pricesIncludeTax) {
    const netCents = Math.round(taxableCents / (1 + vatRate / 100))
    return {
      tax_cents: Math.max(0, taxableCents - netCents),
      total_cents: taxableCents,
      prices_include_tax: true,
    }
  }

  const taxCents = Math.round((taxableCents * vatRate) / 100)
  return {
    tax_cents: taxCents,
    total_cents: taxableCents + taxCents,
    prices_include_tax: false,
  }
}

function getAnalyticsSessionId() {
  try {
    let sessionId = localStorage.getItem(ANALYTICS_SESSION_KEY)

    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      localStorage.setItem(ANALYTICS_SESSION_KEY, sessionId)
    }

    return sessionId
  } catch {
    return ''
  }
}

function trackAnalyticsEvent(eventType, details = {}) {
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        path: window.location.pathname,
        entity_type: details.entity_type || '',
        entity_id: details.entity_id || '',
        session_id: getAnalyticsSessionId(),
        metadata: details.metadata || {},
      }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Analytics non deve mai bloccare navigazione o acquisto.
  }
}

function getSelectedMarket() {
  try {
    return JSON.parse(localStorage.getItem(MARKET_STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

function saveSelectedMarket(market) {
  try {
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(market))
  } catch {
    // Market selector resta opzionale.
  }
}

function cacheProducts(products = []) {
  const translatedProducts = translateProducts(products)

  translatedProducts.forEach((product) => {
    if (product.slug) {
      productCache.set(product.slug, {
        ...product,
        variants: product.variants || [],
      })
    }
  })

  renderCart()

  return translatedProducts
}

function getProductVariant(product, variantId) {
  if (!product || !variantId) return null

  return (product.variants || []).find(
    (variant) => String(variant.id) === String(variantId),
  )
}

function getDefaultVariant(product) {
  if (!product?.variants?.length) return null

  return product.variants.find((variant) => getEffectiveStock(product, variant) > 0)
    || product.variants[0]
}

function getEffectivePriceCents(product, variant = null) {
  if (variant && variant.price_cents !== null && variant.price_cents !== undefined) {
    return Number(variant.price_cents)
  }

  return Number(product?.price_cents || 0)
}

function getEffectiveStock(product, variant = null) {
  if (variant && variant.stock !== null && variant.stock !== undefined) {
    return Number(variant.stock)
  }

  return Number(product?.stock || 0)
}

function getCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  renderCart()
}

function getCartItemKey(productSlug, variantId = '') {
  return `${productSlug}::${variantId || 'base'}`
}

function showCartMessage(message) {
  const target = document.querySelector('#cartMessage')
  if (!target) return

  target.textContent = message
}

function openCart() {
  document.querySelector('#cartPanel')?.setAttribute('aria-hidden', 'false')

  const overlay = document.querySelector('#cartOverlay')
  if (overlay) overlay.hidden = false
}

function closeCart() {
  document.querySelector('#cartPanel')?.setAttribute('aria-hidden', 'true')

  const overlay = document.querySelector('#cartOverlay')
  if (overlay) overlay.hidden = true
}

function addProductToCart(productSlug, variantId = '', quantity = 1) {
  const product = productCache.get(productSlug)

  if (!product) {
    showCartMessage(sfT('cartProductUnavailable'))
    return
  }

  const variant = getProductVariant(product, variantId)
  const selectedVariantId = variant?.id || ''
  const stock = getEffectiveStock(product, variant)

  if (stock <= 0) {
    showCartMessage(sfT('cartProductUnavailable'))
    openCart()
    return
  }

  const key = getCartItemKey(product.slug, selectedVariantId)
  const cart = getCart()
  const existing = cart.find((item) => item.key === key)
  const nextQuantity = (existing?.quantity || 0) + Number(quantity || 1)

  if (nextQuantity > stock) {
    showCartMessage(sfT('cartStockExceeded'))
    openCart()
    return
  }

  if (existing) {
    existing.quantity = nextQuantity
  } else {
    cart.push({
      key,
      productSlug: product.slug,
      variantId: selectedVariantId,
      quantity: Number(quantity || 1),
    })
  }

  saveCart(cart)
  showCartMessage(sfT('cartAdded', { name: product.name }))
  trackAnalyticsEvent('add_to_cart', {
    entity_type: 'product',
    entity_id: product.slug,
    metadata: {
      variant_id: selectedVariantId,
      quantity: Number(quantity || 1),
    },
  })
  openCart()
}

function updateCartQuantity(key, quantity) {
  const cart = getCart()
  const item = cart.find((entry) => entry.key === key)
  if (!item) return

  const product = productCache.get(item.productSlug)
  const variant = getProductVariant(product, item.variantId)
  const stock = getEffectiveStock(product, variant)
  const nextQuantity = Math.max(1, Number(quantity || 1))

  item.quantity = stock > 0 ? Math.min(nextQuantity, stock) : 1
  saveCart(cart)
}

function removeCartItem(key) {
  saveCart(getCart().filter((item) => item.key !== key))
}

function clearCart() {
  saveCart([])
}

async function loadProductsForCart() {
  if (productCache.size > 0) return [...productCache.values()]

  const response = await fetch('/api/products')
  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error('Errore caricamento prodotti')
  }

  return cacheProducts(data.products || [])
}

function getDetailedCartItems() {
  return getCart()
    .map((item) => {
      const product = productCache.get(item.productSlug)
      if (!product) return null

      const variant = getProductVariant(product, item.variantId)
      const priceCents = getEffectivePriceCents(product, variant)
      const stock = getEffectiveStock(product, variant)

      return {
        ...item,
        product,
        variant,
        price_cents: priceCents,
        stock,
        line_total_cents: priceCents * Number(item.quantity || 1),
      }
    })
    .filter(Boolean)
}

function calculateCartSubtotal(items = getDetailedCartItems()) {
  return items.reduce((sum, item) => sum + Number(item.line_total_cents || 0), 0)
}

function getAvailableShippingMethods(methods = [], subtotalCents = 0) {
  return methods.filter(
    (method) => !method.free_over_cents || subtotalCents >= Number(method.free_over_cents),
  )
}

function calculateShippingCost(methods = [], selectedHandle = '', subtotalCents = 0) {
  const available = getAvailableShippingMethods(methods, subtotalCents)
  const selected =
    available.find((method) => method.handle === selectedHandle) ||
    available[0] ||
    methods[0]

  return {
    method: selected,
    shipping_cents: selected ? Number(selected.price_cents || 0) : 0,
  }
}

function renderCart() {
  const itemsContainer = document.querySelector('#cartItems')
  const countTarget = document.querySelector('#cartCount')
  const totalTarget = document.querySelector('#cartTotal')
  const checkoutButton = document.querySelector('.cart-checkout')

  if (!itemsContainer || !countTarget || !totalTarget) return

  const cart = getCart()
  const totalQuantity = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  let totalCents = 0

  countTarget.textContent = String(totalQuantity)

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p class="cart-empty">Il carrello è vuoto.</p>'
    const emptyMessage = itemsContainer.querySelector('.cart-empty')
    if (emptyMessage) emptyMessage.textContent = sfT('cartEmpty')
    totalTarget.textContent = formatPriceCents(0)
    if (checkoutButton) checkoutButton.classList.add('disabled')
    return
  }

  if (checkoutButton) checkoutButton.classList.remove('disabled')

  itemsContainer.innerHTML = cart
    .map((item) => {
      const product = productCache.get(item.productSlug)

      if (!product) {
        return `
          <article class="cart-item">
            <div>
              <h3>${escapeCmsHtml(item.productSlug)}</h3>
              <p>${escapeCmsHtml(sfT('cartProductDetailsLoading'))}</p>
            </div>
            <button type="button" class="cart-remove" data-cart-remove="${escapeCmsHtml(item.key)}">${escapeCmsHtml(sfT('cartRemove'))}</button>
          </article>
        `
      }

      const variant = getProductVariant(product, item.variantId)
      const priceCents = getEffectivePriceCents(product, variant)
      totalCents += priceCents * Number(item.quantity || 1)

      return `
        <article class="cart-item">
          <div class="cart-item-image">
            ${
              product.image_url
                ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}" loading="lazy">`
                : `<span>${escapeCmsHtml(sfT('productFallback'))}</span>`
            }
          </div>

          <div>
            <h3>${escapeCmsHtml(product.name)}</h3>
            ${variant ? `<p>${escapeCmsHtml(variant.option_name)}: ${escapeCmsHtml(variant.option_value)}</p>` : ''}
            <strong>${formatPriceCents(priceCents)}</strong>
          </div>

          <div class="cart-quantity">
            <button type="button" data-cart-quantity="${escapeCmsHtml(item.key)}" data-cart-delta="-1">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-quantity="${escapeCmsHtml(item.key)}" data-cart-delta="1">+</button>
          </div>

          <button type="button" class="cart-remove" data-cart-remove="${escapeCmsHtml(item.key)}">${escapeCmsHtml(sfT('cartRemove'))}</button>
        </article>
      `
    })
    .join('')

  totalTarget.textContent = formatPriceCents(totalCents)
}

function renderAddToCartButton(product, variant = null, extraAttributes = '') {
  const stock = getEffectiveStock(product, variant)
  const variantId = variant?.id || ''

  if (stock <= 0) {
    return `<button class="btn primary" type="button" disabled>${escapeCmsHtml(sfT('unavailable'))}</button>`
  }

  return `
    <button
      class="btn primary"
      type="button"
      data-add-to-cart
      data-product-slug="${escapeCmsHtml(product.slug)}"
      data-variant-id="${escapeCmsHtml(variantId)}"
      ${extraAttributes}
    >
      ${escapeCmsHtml(sfT('addToCart'))}
    </button>
  `
}

function renderPublicMenuLinks(container, items = []) {
  if (!container || !items.length) return false

  container.innerHTML = items
    .map(
      (item) => `
        <a href="${escapeCmsHtml(buildMenuItemUrl(item))}">
          ${escapeCmsHtml(item.label)}
        </a>
      `,
    )
    .join('')

  container.hidden = false

  return true
}

function settingsToMap(settings = []) {
  return settings.reduce((map, setting) => {
    if (setting.key) {
      map[setting.key] = setting.value || ''
    }

    return map
  }, {})
}

function setThemeVariable(settings, key, cssVariable) {
  const value = settings[key]?.trim()
  if (!value) return

  document.documentElement.style.setProperty(cssVariable, value)
}

function applyPublicLogo(settings) {
  const logo = document.querySelector('.logo')
  if (!logo) return

  const logoText = settings.logo_text?.trim()
  const logoUrl = settings.logo_url?.trim()
  const logoWidth = Number(settings.logo_width)

  if (logoUrl) {
    logo.innerHTML = `
      <img class="logo-image" src="${escapeCmsHtml(logoUrl)}" alt="${escapeCmsHtml(logoText || 'Logo')}">
      ${logoText ? `<span class="logo-text">${escapeCmsHtml(logoText)}</span>` : ''}
    `
  } else if (logoText) {
    logo.innerHTML = `
      <span class="logo-mark">✦</span>
      <span class="logo-text">${escapeCmsHtml(logoText)}</span>
    `
  }

  if (Number.isFinite(logoWidth) && logoWidth > 0) {
    document.documentElement.style.setProperty('--logo-width', `${logoWidth}px`)
  }
}

function applyPublicHeaderCta(settings) {
  const headerCta = document.querySelector('.nav-cta')
  if (!headerCta) return

  const text = settings.header_cta_text?.trim()
  const url = settings.header_cta_url?.trim()

  if (text) headerCta.textContent = text
  if (url) headerCta.setAttribute('href', url)
}

function applyPublicFooter(settings) {
  const footer = document.querySelector('.footer')
  if (!footer) return

  const footerText = footer.querySelector('.footer-text')
  const footerCta = footer.querySelector('.footer-cta')
  const text = settings.footer_text?.trim()
  const ctaText = settings.footer_cta_text?.trim()
  const ctaUrl = settings.footer_cta_url?.trim()

  if (footerText && text) footerText.textContent = text
  if (footerCta && ctaText) footerCta.textContent = ctaText
  if (footerCta && ctaUrl) footerCta.setAttribute('href', ctaUrl)
}

function applyPublicSocialLinks(settings) {
  const socialContainer = document.querySelector('#footerSocialLinks')
  if (!socialContainer) return

  const socialLinks = [
    ['instagram_url', 'Instagram'],
    ['linkedin_url', 'LinkedIn'],
    ['youtube_url', 'YouTube'],
  ]
    .map(([key, label]) => ({
      label,
      url: settings[key]?.trim(),
    }))
    .filter((item) => item.url)

  if (!socialLinks.length) return

  socialContainer.innerHTML = socialLinks
    .map(
      (item) => `
        <a href="${escapeCmsHtml(item.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeCmsHtml(item.label)}
        </a>
      `,
    )
    .join('')

  socialContainer.hidden = false
}

function applyPublicThemeSettings(settings) {
  setThemeVariable(settings, 'primary_color', '--cyan')
  setThemeVariable(settings, 'accent_color', '--green')
  setThemeVariable(settings, 'background_color', '--bg')
  setThemeVariable(settings, 'text_color', '--text')
  setThemeVariable(settings, 'body_font_family', '--body-font')
  setThemeVariable(settings, 'heading_font_family', '--heading-font')

  applyPublicLogo(settings)
  applyPublicHeaderCta(settings)
  applyPublicFooter(settings)
  applyPublicSocialLinks(settings)
}

async function loadPublicThemeSettings() {
  try {
    const response = await fetch('/api/settings')
    const data = await response.json()

    if (!response.ok || !data.success || !Array.isArray(data.settings)) {
      return
    }

    applyPublicThemeSettings(settingsToMap(data.settings))
  } catch (error) {
    console.error('Errore caricamento impostazioni tema pubbliche:', error)
  }
}

loadPublicThemeSettings()

async function loadPublicMainMenu() {
  const menuContainer = document.querySelector('#mainMenuLinks')
  if (!menuContainer) return

  try {
    const response = await fetch('/api/menus?handle=main')
    const data = await response.json()

    if (!response.ok || !data.success || !data.menus?.[0]?.items?.length) {
      return
    }

    renderPublicMenuLinks(menuContainer, data.menus[0].items)
  } catch (error) {
    console.error('Errore caricamento menu principale:', error)
  }
}

loadPublicMainMenu()

async function loadPublicFooterMenu() {
  const menuContainer = document.querySelector('#footerMenuLinks')
  if (!menuContainer) return

  try {
    const response = await fetch('/api/menus?handle=footer')
    const data = await response.json()

    if (!response.ok || !data.success || !data.menus?.[0]?.items?.length) {
      return
    }

    renderPublicMenuLinks(menuContainer, data.menus[0].items)
  } catch (error) {
    console.error('Errore caricamento menu footer:', error)
  }
}

loadPublicFooterMenu()

async function loadPublicPolicyLinks() {
  const menuContainer = document.querySelector('#footerMenuLinks')
  if (!menuContainer) return

  try {
    const response = await fetch('/api/policies')
    const data = await response.json()

    if (!response.ok || !data.success || !data.policies?.length) return

    const links = data.policies
      .map(
        (policy) => `
          <a href="/policies/${escapeCmsHtml(policy.slug)}">
            ${escapeCmsHtml(policy.title)}
          </a>
        `,
      )
      .join('')

    menuContainer.insertAdjacentHTML('beforeend', links)
    menuContainer.hidden = false
  } catch {
    // Le policy nel footer sono additive: il footer esistente resta valido.
  }
}

loadPublicPolicyLinks()

async function loadPrimaryCanonicalDomain() {
  try {
    const response = await fetch('/api/domains')
    const data = await response.json()
    const domain = data.primary_domain?.domain

    if (response.ok && data.success && domain) {
      primaryCanonicalOrigin = `https://${domain}`
    }
  } catch {
    primaryCanonicalOrigin = ''
  }
}

async function loadPublicMarkets() {
  const selector = document.querySelector('#marketSelector')
  if (!selector) return

  try {
    const response = await fetch('/api/markets')
    const data = await response.json()
    const markets = data.success && Array.isArray(data.markets) ? data.markets : []

    if (!markets.length) return

    const selectedMarket = getSelectedMarket()
    const fallbackMarket = data.default_market || markets[0]
    const activeMarket =
      markets.find((market) => market.handle === selectedMarket?.handle) || fallbackMarket

    selector.innerHTML = markets
      .map(
        (market) => `
          <option value="${escapeCmsHtml(market.handle)}" ${market.handle === activeMarket.handle ? 'selected' : ''}>
            ${escapeCmsHtml(market.language_code?.toUpperCase() || 'IT')} / ${escapeCmsHtml(market.currency_code || 'EUR')}
          </option>
        `,
      )
      .join('')
    selector.hidden = false
    saveSelectedMarket(activeMarket)

    selector.addEventListener('change', () => {
      const market = markets.find((item) => item.handle === selector.value) || fallbackMarket
      saveSelectedMarket(market)
    })
  } catch {
    selector.hidden = true
  }
}

loadPublicMarkets()

document.addEventListener('click', (event) => {
  const openThreeDButton = event.target.closest('[data-open-3d-modal]')
  if (openThreeDButton) {
    const modal = document.querySelector(openThreeDButton.dataset.open3dModal || '')
    if (modal) {
      modal.hidden = false
      hydrateThreeDViewers()
    }
    return
  }

  if (event.target.closest('[data-close-3d-modal]')) {
    const modal = event.target.closest('.viewer-3d-modal')
    if (modal) modal.hidden = true
    return
  }

  const addButton = event.target.closest('[data-add-to-cart]')
  if (addButton) {
    const quantityInputSelector = addButton.dataset.cartQuantityInput
    const quantityInput = quantityInputSelector
      ? document.querySelector(quantityInputSelector)
      : null

    addProductToCart(
      addButton.dataset.productSlug,
      addButton.dataset.variantId || '',
      quantityInput ? Number(quantityInput.value || 1) : 1,
    )
    return
  }

  if (event.target.closest('[data-cart-open]')) {
    openCart()
    return
  }

  const checkoutLink = event.target.closest('.cart-checkout.disabled')
  if (checkoutLink) {
    event.preventDefault()
    showCartMessage(sfT('cartAddFirst'))
    return
  }

  if (event.target.closest('[data-cart-close]')) {
    closeCart()
    return
  }

  const removeButton = event.target.closest('[data-cart-remove]')
  if (removeButton) {
    removeCartItem(removeButton.dataset.cartRemove)
    return
  }

  const quantityButton = event.target.closest('[data-cart-quantity]')
  if (quantityButton) {
    const cart = getCart()
    const item = cart.find((entry) => entry.key === quantityButton.dataset.cartQuantity)
    if (!item) return

    updateCartQuantity(
      item.key,
      Number(item.quantity || 1) + Number(quantityButton.dataset.cartDelta || 0),
    )
  }
})

document.addEventListener('change', (event) => {
  if (event.target.matches('#productVariantSelect')) {
    updateProductPageVariant(event.target)
  }
})

renderCart()

const grid = document.querySelector('#destinationGrid')

function renderDestinations(filter = 'all') {
  const visibleDestinations =
    filter === 'all'
      ? destinations
      : destinations.filter((item) => item.type === filter)

  grid.innerHTML = visibleDestinations
    .map(
      (item) => `
        <article class="destination-card reveal">
          <div class="card-top">
            <span class="planet-icon">${item.icon}</span>
            <span class="badge">${item.badge}</span>
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="card-bottom">
            <span>${item.duration}</span>
            <strong>${formatMoney(item.price)}</strong>
          </div>
          <a href="#booking" class="card-link">Configura viaggio</a>
        </article>
      `,
    )
    .join('')

  observeReveals()
}

renderDestinations()

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'))
    button.classList.add('active')
    renderDestinations(button.dataset.filter)
  })
})

const destinationSelect = document.querySelector('#destinationSelect')
const passengersRange = document.querySelector('#passengersRange')
const passengersOutput = document.querySelector('#passengersOutput')
const totalPrice = document.querySelector('#totalPrice')
const priceDetails = document.querySelector('#priceDetails')
let packageMultiplier = 1

function updatePrice() {
  const selectedDestination = destinations.find((item) => item.id === destinationSelect.value)
  const passengers = Number(passengersRange.value)
  const total = selectedDestination.price * passengers * packageMultiplier

  passengersOutput.textContent = `${passengers} ${passengers === 1 ? 'passeggero' : 'passeggeri'}`
  totalPrice.textContent = formatMoney(total)
  priceDetails.textContent = `${selectedDestination.name} · ${passengers} passeggeri · pacchetto x${packageMultiplier}`
}

destinationSelect.addEventListener('change', updatePrice)
passengersRange.addEventListener('input', updatePrice)

document.querySelectorAll('.package').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.package').forEach((item) => item.classList.remove('active'))
    button.classList.add('active')
    packageMultiplier = Number(button.dataset.multiplier)
    updatePrice()
  })
})

updatePrice()

const targetDate = new Date()
targetDate.setDate(targetDate.getDate() + 42)

function updateCountdown() {
  const now = new Date()
  const distance = targetDate - now

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((distance / (1000 * 60)) % 60)
  const seconds = Math.floor((distance / 1000) % 60)

  document.querySelector('#countdown').textContent =
    `${days}d ${hours}h ${minutes}m ${seconds}s`
}

setInterval(updateCountdown, 1000)
updateCountdown()

document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('click', () => {
    item.classList.toggle('open')
  })
})

document.querySelector('#leadForm').addEventListener('submit', (event) => {
  event.preventDefault()
  document.querySelector('#formMessage').textContent =
    'Richiesta ricevuta. Il Mission Concierge ti contatterà prima del prossimo lancio.'
  event.target.reset()
})

const glow = document.querySelector('.cursor-glow')

window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`
  glow.style.top = `${event.clientY}px`
})

function observeReveals() {
  const reveals = document.querySelectorAll('.reveal')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.15 },
  )

  reveals.forEach((item) => observer.observe(item))
}

observeReveals()
async function loadStoreCollections() {
  const main = document.querySelector('main')

  const section = document.createElement('section')
  section.className = 'section'
  section.id = 'collections'
  section.innerHTML = `
    <div class="section-head reveal visible">
      <p class="eyebrow">Collezioni</p>
      <h2>Esplora le collezioni.</h2>
      <p>Queste collezioni arrivano da Cloudflare D1 e sono gestite dal CMS custom.</p>
    </div>

    <div id="storeCollections" class="store-grid">
      Caricamento collezioni...
    </div>
  `

  main.appendChild(section)

  const container = document.querySelector('#storeCollections')

  try {
    const response = await fetch('/api/collections')
    const data = await response.json()

    if (!data.success || data.collections.length === 0) {
      container.textContent = 'Nessuna collezione disponibile.'
      return
    }

    container.innerHTML = data.collections
      .map(
        (collection) => `
          <article class="store-card">
            <div class="store-image">
              ${
                collection.image_url
                  ? `<img src="${escapeCmsHtml(collection.image_url)}" alt="${escapeCmsHtml(collection.name)}" loading="lazy">`
                  : '🪐'
              }
            </div>

            <h3>${escapeCmsHtml(collection.name)}</h3>
            <p>${escapeCmsHtml(collection.description || '')}</p>

            <a class="btn primary" href="#shop" data-collection-link="${escapeCmsHtml(collection.slug)}">
              Vedi prodotti
            </a>
          </article>
        `,
      )
      .join('')
  } catch {
    container.textContent = 'Errore nel caricamento collezioni.'
  }
}

loadStoreCollections()
async function loadStoreProducts() {
  const main = document.querySelector('main')

  const section = document.createElement('section')
  section.className = 'section'
  section.id = 'shop'
  section.innerHTML = `
    <div class="section-head reveal visible">
      <p class="eyebrow">Shop pre-lancio</p>
      <h2>Prodotti dal database.</h2>
      <p>Questi prodotti arrivano da Cloudflare D1 e sono gestiti dalla dashboard custom.</p>
    </div>
    <div id="storeProducts" class="store-grid">Caricamento prodotti...</div>
  `

  main.appendChild(section)

  const container = document.querySelector('#storeProducts')

  try {
    const response = await fetch('/api/products')
    const data = await response.json()

    if (!data.success || data.products.length === 0) {
      container.textContent = 'Nessun prodotto disponibile.'
      return
    }

    cacheProducts(data.products)
    container.innerHTML = data.products.map(renderProductCard).join('')
  } catch {
    container.textContent = 'Errore nel caricamento prodotti.'
  }
}

loadStoreProducts()
async function loadEditableHero() {
  try {
    const response = await fetch('/api/admin/hero')
    const data = await response.json()

    if (!data.success || !data.hero) return

    const heroContent = document.querySelector('.hero-content')
    if (!heroContent) return

    const eyebrow = heroContent.querySelector('.eyebrow')
    const title = heroContent.querySelector('h1')
    const subtitle = heroContent.querySelector('.hero-text')
    const button = heroContent.querySelector('.btn.primary')

    if (eyebrow) eyebrow.textContent = data.hero.eyebrow
    if (title) title.textContent = data.hero.title
    if (subtitle) subtitle.textContent = data.hero.subtitle
    if (button) button.textContent = data.hero.button_text
  } catch (error) {
    console.error('Errore caricamento hero modificabile:', error)
  }
}

loadEditableHero()
function applyHeroPreview(hero) {
  const heroContent = document.querySelector('.hero-content')
  if (!heroContent) return

  const eyebrow = heroContent.querySelector('.eyebrow')
  const title = heroContent.querySelector('h1')
  const subtitle = heroContent.querySelector('.hero-text')
  const button = heroContent.querySelector('.btn.primary')

  if (eyebrow) eyebrow.textContent = hero.eyebrow
  if (title) title.textContent = hero.title
  if (subtitle) subtitle.textContent = hero.subtitle
  if (button) button.textContent = hero.button_text
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return
  if (event.data?.type !== 'ORBITRA_HERO_PREVIEW') return

  applyHeroPreview(event.data.hero)
})
function escapeCmsHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getCmsContainer() {
  let container = document.querySelector('#cmsSections')

  if (!container) {
    container = document.createElement('div')
    container.id = 'cmsSections'

    const hero = document.querySelector('.hero')
    const main = document.querySelector('main')

    if (hero) {
      hero.insertAdjacentElement('afterend', container)
    } else if (main) {
      main.appendChild(container)
    }
  }

  return container
}

const MODEL_VIEWER_SCRIPT_URL = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
let modelViewerScriptPromise = null

function splitListValue(value) {
  if (Array.isArray(value)) return value
  return String(value || '')
    .split(/[\n,|]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getMetafields(product = {}) {
  return product.metafields && typeof product.metafields === 'object'
    ? product.metafields
    : {}
}

function getProductModelUrl(product = {}) {
  const metafields = getMetafields(product)
  return (
    product.model_3d_url ||
    metafields.model_3d_url ||
    metafields.model_url ||
    metafields.three_d_model_url ||
    ''
  )
}

function getProductPosterImage(product = {}) {
  const metafields = getMetafields(product)
  return (
    product.poster_image_url ||
    metafields.poster_image_url ||
    metafields.model_poster_url ||
    product.image_url ||
    ''
  )
}

function getProductGalleryImages(product = {}) {
  const metafields = getMetafields(product)
  const images = [
    product.image_url,
    ...splitListValue(metafields.gallery_images || metafields.gallery || metafields.image_gallery),
  ]

  return [...new Set(images.filter(Boolean))]
}

function formatMetafieldLabel(key = '') {
  const label = String(key).replace(/[_-]+/g, ' ').trim()
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : 'Dettaglio'
}

function getDisplayableProductMetafields(product = {}) {
  const hiddenKeys = new Set([
    'gallery',
    'gallery_images',
    'image_gallery',
    'model_3d_url',
    'model_url',
    'three_d_model_url',
    'poster_image_url',
    'model_poster_url',
  ])

  return Object.entries(getMetafields(product))
    .filter(([key, value]) => !hiddenKeys.has(key) && value !== null && value !== undefined && value !== '')
    .slice(0, 12)
}

function renderThreeDViewer({ modelUrl = '', posterImageUrl = '', title = '', autoRotate = true } = {}) {
  if (modelUrl) {
    return `
      <model-viewer
        class="orbitra-model-viewer"
        src="${escapeCmsHtml(modelUrl)}"
        ${posterImageUrl ? `poster="${escapeCmsHtml(posterImageUrl)}"` : ''}
        alt="${escapeCmsHtml(title || 'Vista 3D prodotto')}"
        camera-controls
        loading="lazy"
        reveal="interaction"
        ${autoRotate ? 'auto-rotate' : ''}
      >
        <div slot="poster" class="model-viewer-poster">
          ${
            posterImageUrl
              ? `<img src="${escapeCmsHtml(posterImageUrl)}" alt="${escapeCmsHtml(title)}" loading="lazy">`
              : '<span>Vista 3D</span>'
          }
        </div>
      </model-viewer>
    `
  }

  if (posterImageUrl) {
    return `<img src="${escapeCmsHtml(posterImageUrl)}" alt="${escapeCmsHtml(title)}" loading="lazy">`
  }

  return '<span>Vista 3D non configurata</span>'
}

function renderThreeDModal({ id, modelUrl = '', posterImageUrl = '', title = '', autoRotate = true } = {}) {
  if (!id || !modelUrl) return ''

  return `
    <div class="viewer-3d-modal" id="${escapeCmsHtml(id)}" hidden>
      <div class="viewer-3d-backdrop" data-close-3d-modal></div>
      <div class="viewer-3d-dialog" role="dialog" aria-modal="true" aria-label="${escapeCmsHtml(title || 'Vista 3D')}">
        <button type="button" class="viewer-3d-close" data-close-3d-modal>Chiudi</button>
        ${renderThreeDViewer({ modelUrl, posterImageUrl, title, autoRotate })}
      </div>
    </div>
  `
}

function ensureModelViewerScript() {
  if (!document.querySelector('model-viewer')) return Promise.resolve()
  if (window.customElements?.get('model-viewer')) return Promise.resolve()
  if (modelViewerScriptPromise) return modelViewerScriptPromise

  modelViewerScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${MODEL_VIEWER_SCRIPT_URL}"]`)
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.type = 'module'
    script.src = MODEL_VIEWER_SCRIPT_URL
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  }).catch(() => {
    modelViewerScriptPromise = null
  })

  return modelViewerScriptPromise
}

function hydrateThreeDViewers() {
  ensureModelViewerScript()
}

function setProductJsonLd(product, variant, collection) {
  document.querySelector('#productJsonLd')?.remove()
  if (!product) return

  const image = getProductGalleryImages(product)[0] || product.image_url || ''
  const stock = getEffectiveStock(product, variant)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    sku: variant?.sku || product.slug,
    image: image ? [image] : undefined,
    category: product.category || collection?.name || undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (getEffectivePriceCents(product, variant) / 100).toFixed(2),
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href,
    },
  }

  const script = document.createElement('script')
  script.id = 'productJsonLd'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  document.head.appendChild(script)
}

function renderCmsSection(section) {
  const data = section.data || {}

  if (section.type === 'hero') {
    return `
      <section class="section cms-hero">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
          <a class="btn primary" href="#booking">${escapeCmsHtml(data.button_text)}</a>
        </div>
      </section>
    `
  }

  if (section.type === 'banner') {
    return `
      <section class="section cms-banner">
        <p class="eyebrow">Mission update</p>
        <h2>${escapeCmsHtml(data.title)}</h2>
        <p>${escapeCmsHtml(data.text)}</p>
        <a class="btn primary" href="#shop">${escapeCmsHtml(data.button_text)}</a>
      </section>
    `
  }

  if (section.type === 'text_image') {
    return `
      <section class="section cms-text-image">
        <div class="cms-text-image-grid">
          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
            <h2>${escapeCmsHtml(data.title)}</h2>
            <p>${escapeCmsHtml(data.text)}</p>
            ${
              data.button_text
                ? `<a class="btn primary" href="${escapeCmsHtml(data.button_url || '#')}">${escapeCmsHtml(data.button_text)}</a>`
                : ''
            }
          </div>

          <div class="cms-text-image-media">
            ${
              data.image_url
                ? `<img src="${escapeCmsHtml(data.image_url)}" alt="${escapeCmsHtml(data.title)}">`
                : '🪐'
            }
          </div>
        </div>
      </section>
    `
  }

  if (section.type === 'brand_manifesto') {
    return `
      <section class="section cms-brand-manifesto">
        <div class="cms-brand-manifesto-grid">
          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
            <h2>${escapeCmsHtml(data.title)}</h2>
            <p>${escapeCmsHtml(data.text)}</p>
            ${
              data.button_text
                ? `<a class="btn primary" href="${escapeCmsHtml(data.button_url || '#')}">${escapeCmsHtml(data.button_text)}</a>`
                : ''
            }
          </div>

          <div class="cms-brand-quote">
            <blockquote>“${escapeCmsHtml(data.quote)}”</blockquote>
            <div class="cms-brand-image">
              ${
                data.image_url
                  ? `<img src="${escapeCmsHtml(data.image_url)}" alt="${escapeCmsHtml(data.title)}">`
                  : '✦'
              }
            </div>
          </div>
        </div>
      </section>
    `
  }

  if (section.type === 'timeline_premium') {
    return `
      <section class="section cms-timeline-premium">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-timeline-list">
          <article>
            <span>${escapeCmsHtml(data.step_1_year)}</span>
            <h3>${escapeCmsHtml(data.step_1_title)}</h3>
            <p>${escapeCmsHtml(data.step_1_text)}</p>
          </article>

          <article>
            <span>${escapeCmsHtml(data.step_2_year)}</span>
            <h3>${escapeCmsHtml(data.step_2_title)}</h3>
            <p>${escapeCmsHtml(data.step_2_text)}</p>
          </article>

          <article>
            <span>${escapeCmsHtml(data.step_3_year)}</span>
            <h3>${escapeCmsHtml(data.step_3_title)}</h3>
            <p>${escapeCmsHtml(data.step_3_text)}</p>
          </article>
        </div>
      </section>
    `
  }

  if (section.type === 'process_steps') {
    return `
      <section class="section cms-process-steps">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-process-grid">
          <article><span>01</span><h3>${escapeCmsHtml(data.step_1_title)}</h3><p>${escapeCmsHtml(data.step_1_text)}</p></article>
          <article><span>02</span><h3>${escapeCmsHtml(data.step_2_title)}</h3><p>${escapeCmsHtml(data.step_2_text)}</p></article>
          <article><span>03</span><h3>${escapeCmsHtml(data.step_3_title)}</h3><p>${escapeCmsHtml(data.step_3_text)}</p></article>
          <article><span>04</span><h3>${escapeCmsHtml(data.step_4_title)}</h3><p>${escapeCmsHtml(data.step_4_text)}</p></article>
        </div>
      </section>
    `
  }

  if (section.type === 'stats_numbers') {
    return `
      <section class="section cms-stats-numbers">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-stats-grid">
          <article><strong>${escapeCmsHtml(data.stat_1_value)}</strong><span>${escapeCmsHtml(data.stat_1_label)}</span></article>
          <article><strong>${escapeCmsHtml(data.stat_2_value)}</strong><span>${escapeCmsHtml(data.stat_2_label)}</span></article>
          <article><strong>${escapeCmsHtml(data.stat_3_value)}</strong><span>${escapeCmsHtml(data.stat_3_label)}</span></article>
          <article><strong>${escapeCmsHtml(data.stat_4_value)}</strong><span>${escapeCmsHtml(data.stat_4_label)}</span></article>
        </div>
      </section>
    `
  }

  if (section.type === 'gallery_editorial') {
    return `
      <section class="section cms-gallery-editorial">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-gallery-grid">
          <article class="large">
            ${
              data.image_1_url
                ? `<img src="${escapeCmsHtml(data.image_1_url)}" alt="${escapeCmsHtml(data.image_1_caption)}">`
                : '<span>✦</span>'
            }
            <p>${escapeCmsHtml(data.image_1_caption)}</p>
          </article>

          <article>
            ${
              data.image_2_url
                ? `<img src="${escapeCmsHtml(data.image_2_url)}" alt="${escapeCmsHtml(data.image_2_caption)}">`
                : '<span>☾</span>'
            }
            <p>${escapeCmsHtml(data.image_2_caption)}</p>
          </article>

          <article>
            ${
              data.image_3_url
                ? `<img src="${escapeCmsHtml(data.image_3_url)}" alt="${escapeCmsHtml(data.image_3_caption)}">`
                : '<span>◌</span>'
            }
            <p>${escapeCmsHtml(data.image_3_caption)}</p>
          </article>
        </div>
      </section>
    `
  }

  if (section.type === 'testimonials') {
    return `
      <section class="section cms-testimonials">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
        </div>

        <div class="cms-testimonials-grid">
          <article><p>“${escapeCmsHtml(data.quote_1)}”</p><strong>${escapeCmsHtml(data.author_1)}</strong><span>${escapeCmsHtml(data.role_1)}</span></article>
          <article><p>“${escapeCmsHtml(data.quote_2)}”</p><strong>${escapeCmsHtml(data.author_2)}</strong><span>${escapeCmsHtml(data.role_2)}</span></article>
          <article><p>“${escapeCmsHtml(data.quote_3)}”</p><strong>${escapeCmsHtml(data.author_3)}</strong><span>${escapeCmsHtml(data.role_3)}</span></article>
        </div>
      </section>
    `
  }

  if (section.type === 'featured_collection') {
    const collectionHref = data.collection_slug
      ? `/collections/${escapeCmsHtml(data.collection_slug)}`
      : escapeCmsHtml(data.button_url || '#')

    return `
      <section class="section cms-featured-collection">
        <div class="cms-featured-collection-card">
          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
            <h2>${escapeCmsHtml(data.title)}</h2>
            <p>${escapeCmsHtml(data.subtitle)}</p>
          </div>

          <a class="btn primary" href="${collectionHref}">
            ${escapeCmsHtml(data.button_text)}
          </a>
        </div>
      </section>
    `
  }

  if (section.type === 'collection_grid') {
    return `
      <section class="section cms-collection-grid-section">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="store-grid cms-collection-grid" data-collections-grid>
          Caricamento collezioni...
        </div>
      </section>
    `
  }

  if (section.type === 'featured_product') {
    return `
      <section class="section cms-featured-product">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div
          class="cms-featured-product-target"
          data-featured-product="${escapeCmsHtml(data.product_slug || '')}"
          data-button-text="${escapeCmsHtml(data.button_text || 'Scopri il prodotto')}"
          data-button-url="${escapeCmsHtml(data.button_url || '#')}"
        >
          Caricamento prodotto...
        </div>
      </section>
    `
  }

  if (section.type === 'product_spotlight') {
    const productHref = data.product_slug
      ? `/products/${escapeCmsHtml(data.product_slug)}`
      : escapeCmsHtml(data.button_url || '#')

    return `
      <section class="section cms-product-spotlight">
        <div class="cms-product-spotlight-grid">
          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
            <h2>${escapeCmsHtml(data.title)}</h2>
            <p>${escapeCmsHtml(data.text)}</p>
            <a class="btn primary" href="${productHref}">
              ${escapeCmsHtml(data.button_text)}
            </a>
          </div>

          <div class="cms-product-spotlight-media">
            ${
              data.image_url
                ? `<img src="${escapeCmsHtml(data.image_url)}" alt="${escapeCmsHtml(data.title)}">`
                : '🚀'
            }
          </div>
        </div>
      </section>
    `
  }

  if (section.type === 'product_carousel') {
    return `
      <section class="section cms-product-carousel-section">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div
          class="store-grid cms-product-carousel"
          data-products-carousel
          data-collection-slug="${escapeCmsHtml(data.collection_slug || '')}"
        >
          Caricamento prodotti...
        </div>
      </section>
    `
  }

  if (section.type === 'product_3d_viewer') {
    const modalId = `cms-3d-viewer-${section.id}`
    const hasModel = Boolean(data.model_url)
    const showModal = data.show_modal === true || data.show_modal === 'true' || data.show_modal === '1'
    const autoRotate = data.auto_rotate !== false && data.auto_rotate !== 'false'

    return `
      <section class="section cms-product-3d-viewer">
        <div class="cms-product-3d-grid">
          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow || 'Next Generation')}</p>
            <h2>${escapeCmsHtml(data.title || 'Esplora il prodotto in 3D')}</h2>
            <p>${escapeCmsHtml(data.text || 'Aggiungi un modello 3D dal CMS per creare una vista interattiva.')}</p>
            ${
              hasModel && showModal
                ? `<button class="btn primary" type="button" data-open-3d-modal="#${escapeCmsHtml(modalId)}">
                    ${escapeCmsHtml(data.button_text || 'Apri vista 3D')}
                  </button>`
                : ''
            }
          </div>

          <div class="cms-product-3d-stage">
            ${renderThreeDViewer({
              modelUrl: data.model_url || '',
              posterImageUrl: data.poster_image_url || '',
              title: data.title || 'Vista 3D',
              autoRotate,
            })}
          </div>
        </div>
      </section>
      ${showModal
        ? renderThreeDModal({
            id: modalId,
            modelUrl: data.model_url || '',
            posterImageUrl: data.poster_image_url || '',
            title: data.title || 'Vista 3D',
            autoRotate,
          })
        : ''}
    `
  }

  if (section.type === 'best_sellers') {
    return `
      <section class="section cms-best-sellers">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="store-grid" data-products-grid data-products-mode="best_sellers">
          Caricamento prodotti...
        </div>
      </section>
    `
  }

  if (section.type === 'new_arrivals') {
    return `
      <section class="section cms-new-arrivals">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="store-grid" data-products-grid data-products-mode="new_arrivals">
          Caricamento prodotti...
        </div>
      </section>
    `
  }

  if (section.type === 'trust_badges') {
    return `
      <section class="section cms-trust-badges">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
        </div>

        <div class="cms-trust-grid">
          <article><span>🔒</span><h3>${escapeCmsHtml(data.badge_1_title)}</h3><p>${escapeCmsHtml(data.badge_1_text)}</p></article>
          <article><span>📦</span><h3>${escapeCmsHtml(data.badge_2_title)}</h3><p>${escapeCmsHtml(data.badge_2_text)}</p></article>
          <article><span>💬</span><h3>${escapeCmsHtml(data.badge_3_title)}</h3><p>${escapeCmsHtml(data.badge_3_text)}</p></article>
          <article><span>✦</span><h3>${escapeCmsHtml(data.badge_4_title)}</h3><p>${escapeCmsHtml(data.badge_4_text)}</p></article>
        </div>
      </section>
    `
  }

  if (section.type === 'newsletter_signup') {
    return `
      <section class="section cms-newsletter">
        <div class="cms-newsletter-card">
          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
            <h2>${escapeCmsHtml(data.title)}</h2>
            <p>${escapeCmsHtml(data.subtitle)}</p>
          </div>

          <form class="cms-newsletter-form">
            <input type="email" placeholder="${escapeCmsHtml(data.placeholder)}">
            <button class="btn primary" type="button">${escapeCmsHtml(data.button_text)}</button>
            <small>${escapeCmsHtml(data.privacy_text)}</small>
          </form>
        </div>
      </section>
    `
  }

  if (section.type === 'promo_banner') {
    return `
      <section class="section cms-promo-banner">
        <div>
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.text)}</p>
        </div>

        <a class="btn primary" href="${escapeCmsHtml(data.button_url || '#')}">
          ${escapeCmsHtml(data.button_text)}
        </a>
      </section>
    `
  }

  if (section.type === 'countdown_promo') {
    const targetDate = data.target_date
      ? new Date(data.target_date).toLocaleString('it-IT')
      : ''

    return `
      <section class="section cms-countdown-promo">
        <div>
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.text)}</p>
        </div>

        <div class="cms-countdown-box">
          <span>Termina il</span>
          <strong>${escapeCmsHtml(targetDate)}</strong>
          <a class="btn primary" href="${escapeCmsHtml(data.button_url || '#')}">
            ${escapeCmsHtml(data.button_text)}
          </a>
        </div>
      </section>
    `
  }

  if (section.type === 'logo_partners') {
    return `
      <section class="section cms-logo-partners">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-logo-row">
          <span>${escapeCmsHtml(data.logo_1_text)}</span>
          <span>${escapeCmsHtml(data.logo_2_text)}</span>
          <span>${escapeCmsHtml(data.logo_3_text)}</span>
          <span>${escapeCmsHtml(data.logo_4_text)}</span>
          <span>${escapeCmsHtml(data.logo_5_text)}</span>
        </div>
      </section>
    `
  }

  if (section.type === 'press_mentions') {
    return `
      <section class="section cms-press-mentions">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
        </div>

        <div class="cms-press-grid">
          <article><p>“${escapeCmsHtml(data.quote_1)}”</p><strong>${escapeCmsHtml(data.source_1)}</strong></article>
          <article><p>“${escapeCmsHtml(data.quote_2)}”</p><strong>${escapeCmsHtml(data.source_2)}</strong></article>
          <article><p>“${escapeCmsHtml(data.quote_3)}”</p><strong>${escapeCmsHtml(data.source_3)}</strong></article>
        </div>
      </section>
    `
  }

  if (section.type === 'awards_recognition') {
    return `
      <section class="section cms-awards">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
        </div>

        <div class="cms-awards-grid">
          <article><span>01</span><h3>${escapeCmsHtml(data.award_1_title)}</h3><p>${escapeCmsHtml(data.award_1_text)}</p></article>
          <article><span>02</span><h3>${escapeCmsHtml(data.award_2_title)}</h3><p>${escapeCmsHtml(data.award_2_text)}</p></article>
          <article><span>03</span><h3>${escapeCmsHtml(data.award_3_title)}</h3><p>${escapeCmsHtml(data.award_3_text)}</p></article>
        </div>
      </section>
    `
  }

  if (section.type === 'team_section') {
    return `
      <section class="section cms-team-section">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-team-grid">
          <article>
            <div>${data.member_1_image_url ? `<img src="${escapeCmsHtml(data.member_1_image_url)}" alt="${escapeCmsHtml(data.member_1_name)}">` : '👤'}</div>
            <h3>${escapeCmsHtml(data.member_1_name)}</h3>
            <p>${escapeCmsHtml(data.member_1_role)}</p>
          </article>

          <article>
            <div>${data.member_2_image_url ? `<img src="${escapeCmsHtml(data.member_2_image_url)}" alt="${escapeCmsHtml(data.member_2_name)}">` : '👤'}</div>
            <h3>${escapeCmsHtml(data.member_2_name)}</h3>
            <p>${escapeCmsHtml(data.member_2_role)}</p>
          </article>

          <article>
            <div>${data.member_3_image_url ? `<img src="${escapeCmsHtml(data.member_3_image_url)}" alt="${escapeCmsHtml(data.member_3_name)}">` : '👤'}</div>
            <h3>${escapeCmsHtml(data.member_3_name)}</h3>
            <p>${escapeCmsHtml(data.member_3_role)}</p>
          </article>
        </div>
      </section>
    `
  }

  if (section.type === 'founder_section') {
    return `
      <section class="section cms-founder-section">
        <div class="cms-founder-grid">
          <div class="cms-founder-image">
            ${
              data.image_url
                ? `<img src="${escapeCmsHtml(data.image_url)}" alt="${escapeCmsHtml(data.founder_name)}">`
                : '👤'
            }
          </div>

          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
            <h2>${escapeCmsHtml(data.title)}</h2>
            <p>${escapeCmsHtml(data.text)}</p>
            <blockquote>“${escapeCmsHtml(data.quote)}”</blockquote>
            <strong>${escapeCmsHtml(data.founder_name)}</strong>
            <span>${escapeCmsHtml(data.founder_role)}</span>
          </div>
        </div>
      </section>
    `
  }

  if (section.type === 'services_grid') {
    return `
      <section class="section cms-services-grid-section">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-services-grid">
          <article><h3>${escapeCmsHtml(data.service_1_title)}</h3><p>${escapeCmsHtml(data.service_1_text)}</p></article>
          <article><h3>${escapeCmsHtml(data.service_2_title)}</h3><p>${escapeCmsHtml(data.service_2_text)}</p></article>
          <article><h3>${escapeCmsHtml(data.service_3_title)}</h3><p>${escapeCmsHtml(data.service_3_text)}</p></article>
          <article><h3>${escapeCmsHtml(data.service_4_title)}</h3><p>${escapeCmsHtml(data.service_4_text)}</p></article>
        </div>
      </section>
    `
  }

  if (section.type === 'accordion_advanced') {
    return `
      <section class="section cms-accordion-advanced">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
        </div>

        <div class="cms-accordion-list">
          <details open><summary>${escapeCmsHtml(data.item_1_title)}</summary><p>${escapeCmsHtml(data.item_1_text)}</p></details>
          <details><summary>${escapeCmsHtml(data.item_2_title)}</summary><p>${escapeCmsHtml(data.item_2_text)}</p></details>
          <details><summary>${escapeCmsHtml(data.item_3_title)}</summary><p>${escapeCmsHtml(data.item_3_text)}</p></details>
          <details><summary>${escapeCmsHtml(data.item_4_title)}</summary><p>${escapeCmsHtml(data.item_4_text)}</p></details>
        </div>
      </section>
    `
  }

  if (section.type === 'tabs_section') {
    return `
      <section class="section cms-tabs-section">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
        </div>

        <div class="cms-tabs-grid">
          <article><span>${escapeCmsHtml(data.tab_1_label)}</span><h3>${escapeCmsHtml(data.tab_1_title)}</h3><p>${escapeCmsHtml(data.tab_1_text)}</p></article>
          <article><span>${escapeCmsHtml(data.tab_2_label)}</span><h3>${escapeCmsHtml(data.tab_2_title)}</h3><p>${escapeCmsHtml(data.tab_2_text)}</p></article>
          <article><span>${escapeCmsHtml(data.tab_3_label)}</span><h3>${escapeCmsHtml(data.tab_3_title)}</h3><p>${escapeCmsHtml(data.tab_3_text)}</p></article>
        </div>
      </section>
    `
  }

  if (section.type === 'video_spotlight') {
    return `
      <section class="section cms-video-spotlight">
        <div class="cms-video-grid">
          <div>
            <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
            <h2>${escapeCmsHtml(data.title)}</h2>
            <p>${escapeCmsHtml(data.text)}</p>
            <a class="btn primary" href="${escapeCmsHtml(data.button_url || '#')}">
              ${escapeCmsHtml(data.button_text)}
            </a>
          </div>

          <div class="cms-video-box">
            ${
              data.video_url
                ? `<video controls ${data.poster_url ? `poster="${escapeCmsHtml(data.poster_url)}"` : ''} src="${escapeCmsHtml(data.video_url)}"></video>`
                : '<span>▶</span>'
            }
          </div>
        </div>
      </section>
    `
  }

  if (section.type === 'full_width_image') {
    return `
      <section class="section cms-full-width-image">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="cms-full-image">
          ${
            data.image_url
              ? `<img src="${escapeCmsHtml(data.image_url)}" alt="${escapeCmsHtml(data.caption)}">`
              : '✦'
          }
        </div>

        <p class="cms-full-image-caption">${escapeCmsHtml(data.caption)}</p>
      </section>
    `
  }

  if (section.type === 'product_grid') {
    return `
      <section class="section">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(data.eyebrow)}</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
          <p>${escapeCmsHtml(data.subtitle)}</p>
        </div>

        <div class="store-grid cms-product-grid" data-products-grid>
          Caricamento prodotti...
        </div>
      </section>
    `
  }

  if (section.type === 'faq') {
    return `
      <section class="section cms-faq">
        <div class="section-head reveal visible">
          <p class="eyebrow">FAQ</p>
          <h2>${escapeCmsHtml(data.title)}</h2>
        </div>

        <div class="faq-item open">
          <span>${escapeCmsHtml(data.question)}</span>
          <strong>+</strong>
          <p>${escapeCmsHtml(data.answer)}</p>
        </div>
      </section>
    `
  }

  if (section.type === 'cta') {
    return `
      <section class="section cms-cta">
        <h2>${escapeCmsHtml(data.title)}</h2>
        <p>${escapeCmsHtml(data.text)}</p>
        <a class="btn primary" href="#booking">${escapeCmsHtml(data.button_text)}</a>
      </section>
    `
  }

  return ''
}

function renderProductCard(product) {
  const defaultVariant = getDefaultVariant(product)
  const priceCents = getEffectivePriceCents(product, defaultVariant)
  const stock = getEffectiveStock(product, defaultVariant)
  const productHref = `/products/${escapeCmsHtml(product.slug)}`

  return `
    <article class="store-card">
      <a class="store-image" href="${productHref}">
        ${
          product.image_url
            ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}" loading="lazy">`
            : `<span>${escapeCmsHtml(sfT('productFallback'))}</span>`
        }
      </a>

      <h3><a href="${productHref}">${escapeCmsHtml(product.name)}</a></h3>
      <p>${escapeCmsHtml(product.description || '')}</p>

      <div class="store-meta">
        <strong>${formatPriceCents(priceCents)}</strong>
        <span>${escapeCmsHtml(sfT('stock'))}: ${stock}</span>
      </div>

      ${
        product.variants?.length
          ? `<p class="variant-summary">${escapeCmsHtml(sfT('variantsAvailable', { count: product.variants.length }))}</p>`
          : ''
      }

      <div class="store-actions">
        <a class="btn ghost" href="${productHref}">${escapeCmsHtml(sfT('details'))}</a>
        ${renderAddToCartButton(product, defaultVariant)}
      </div>
    </article>
  `
}

async function hydrateProductGrids() {
  const productContainers = document.querySelectorAll(
    '[data-products-grid], [data-products-carousel], [data-featured-product]',
  )

  if (productContainers.length === 0) return

  try {
    const response = await fetch('/api/products')
    const data = await response.json()

    if (!data.success || data.products.length === 0) {
      productContainers.forEach((container) => {
        container.textContent = sfT('noProducts')
      })
      return
    }

    const products = cacheProducts(data.products || [])

    document.querySelectorAll('[data-products-grid], [data-products-carousel]').forEach((grid) => {
      const collectionSlug = grid.dataset.collectionSlug || ''
      const mode = grid.dataset.productsMode || ''

      let visibleProducts = [...products]

      if (collectionSlug) {
        visibleProducts = visibleProducts.filter(
          (product) => product.collection_slug === collectionSlug,
        )
      }

      if (mode === 'best_sellers') {
        visibleProducts = visibleProducts.slice(0, 4)
      }

      if (mode === 'new_arrivals') {
        visibleProducts = visibleProducts.slice(0, 4)
      }

      if (grid.hasAttribute('data-products-carousel')) {
        visibleProducts = visibleProducts.slice(0, 6)
      }

      if (visibleProducts.length === 0) {
        grid.textContent = sfT('noProducts')
        return
      }

      grid.innerHTML = visibleProducts.map(renderProductCard).join('')
    })

    document.querySelectorAll('[data-featured-product]').forEach((target) => {
      const productSlug = target.dataset.featuredProduct || ''
      const buttonText = target.dataset.buttonText || sfT('discoverProduct')
      const buttonUrl = target.dataset.buttonUrl || '#'

      const product = productSlug
        ? products.find((item) => item.slug === productSlug)
        : products[0]

      if (!product) {
        target.textContent = sfT('productNotFound')
        return
      }

      target.innerHTML = `
        <article class="cms-featured-product-card">
          <div class="store-image">
            ${
              product.image_url
                ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}" loading="lazy">`
                : '🚀'
            }
          </div>

          <div>
            <h3>${escapeCmsHtml(product.name)}</h3>
            <p>${escapeCmsHtml(product.description || '')}</p>

            <div class="store-meta">
              <strong>${formatPriceCents(product.price_cents)}</strong>
              <span>${escapeCmsHtml(sfT('stock'))}: ${product.stock}</span>
            </div>

            <a class="btn primary" href="${escapeCmsHtml(buttonUrl)}">
              ${escapeCmsHtml(buttonText)}
            </a>
          </div>
        </article>
      `
    })
  } catch {
    productContainers.forEach((container) => {
      container.textContent = sfT('productsLoadError')
    })
  }
}

async function hydrateCollectionGrids() {
  const collectionGrids = document.querySelectorAll('[data-collections-grid]')
  if (collectionGrids.length === 0) return

  try {
    const response = await fetch('/api/collections')
    const data = await response.json()

    if (!data.success || data.collections.length === 0) {
      collectionGrids.forEach((grid) => {
        grid.textContent = sfT('noCollections')
      })
      return
    }

    const collections = translateCollections(data.collections || [])
    const html = collections
      .map(
        (collection) => `
          <article class="store-card cms-collection-card">
            <div class="store-image">
              ${
                collection.image_url
                  ? `<img src="${escapeCmsHtml(collection.image_url)}" alt="${escapeCmsHtml(collection.name)}" loading="lazy">`
                  : '🪐'
              }
            </div>

            <h3>${escapeCmsHtml(collection.name)}</h3>
            <p>${escapeCmsHtml(collection.description || '')}</p>

            <a class="btn primary" href="/collections/${escapeCmsHtml(collection.slug)}">
              ${escapeCmsHtml(sfT('viewCollection'))}
            </a>
          </article>
        `,
      )
      .join('')

    collectionGrids.forEach((grid) => {
      grid.innerHTML = html
    })
  } catch {
    collectionGrids.forEach((grid) => {
      grid.textContent = sfT('collectionsLoadError')
    })
  }
}

function getCurrentPublicPageSlug() {
  const path = window.location.pathname

  if (path === '/') return 'home'
  if (path.startsWith('/collections/')) return null
  if (path.startsWith('/products/')) return null
  if (path.startsWith('/api/')) return null

  return decodeURIComponent(path.replace('/', '').replaceAll('/', ''))
}

function renderCmsSections(sections) {
  const translatedSections = (sections || []).map(translateSection)
  const pageSlug = getCurrentPublicPageSlug()
  const isHome = pageSlug === 'home'

  const heroSection = translatedSections.find((section) => section.type === 'hero')

  if (isHome && heroSection) {
    applyHeroPreview(heroSection.data)
  }

  const container = getCmsContainer()

  container.innerHTML = translatedSections
    .filter((section) => !(isHome && section.type === 'hero'))
    .map(renderCmsSection)
    .join('')

  hydrateProductGrids()
  hydrateCollectionGrids()
  hydrateThreeDViewers()
}

async function loadCmsSectionsFromD1(pageSlug = getCurrentPublicPageSlug()) {
  if (!pageSlug) return

  try {
    const response = await fetch(
      `/api/sections?page_slug=${encodeURIComponent(pageSlug)}`,
    )
    const data = await response.json()

    if (!data.success) return

    renderCmsSections((data.sections || []).map(translateSection))
  } catch (error) {
    console.error('Errore caricamento sezioni CMS:', error)
  }
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return
  if (event.data?.type !== 'ORBITRA_SECTIONS_PREVIEW') return

  renderCmsSections(event.data.sections)
})

async function renderPublicCollectionPage() {
  const path = window.location.pathname

  if (!path.startsWith('/collections/')) return

  const collectionSlug = decodeURIComponent(
    path.replace('/collections/', '').replaceAll('/', ''),
  )
  const main = document.querySelector('main')

  if (!main || !collectionSlug) return

  main.innerHTML = `
    <section class="section">
      <div class="section-head reveal visible">
        <p class="eyebrow">${escapeCmsHtml(sfT('collection'))}</p>
        <h2>${escapeCmsHtml(sfT('collectionLoading'))}</h2>
        <p>${escapeCmsHtml(sfT('collectionLoadingText'))}</p>
      </div>

      <div id="collectionProducts" class="store-grid">
        ${escapeCmsHtml(sfT('collectionLoadingText'))}
      </div>
    </section>
  `

  const title = main.querySelector('h2')
  const intro = main.querySelector('.section-head p:last-child')
  const container = document.querySelector('#collectionProducts')

  try {
    const [collectionsResponse, productsResponse] = await Promise.all([
      fetch('/api/collections'),
      fetch('/api/products'),
    ])

    const collectionsData = await collectionsResponse.json()
    const productsData = await productsResponse.json()

    const collections = translateCollections(collectionsData.collections || [])
    const allProducts = cacheProducts(productsData.products || [])

    const collection = collections.find(
      (item) => item.slug === collectionSlug,
    )

    if (!collection) {
      title.textContent = sfT('collectionNotFound')
      intro.textContent = sfT('collectionNotFoundText')
      container.textContent = ''
      intro.textContent = sfT('collectionNotFoundText')
      applySeoMeta(
        {},
        {
          title: `${sfT('collectionNotFound')} | Orbitra`,
          description: sfT('collectionUnavailable'),
        },
      )
      return
    }

    applySeoMeta(collection.seo || {}, {
      title: `${collection.name} | Orbitra`,
      description: collection.description || 'Collezione prodotti Orbitra.',
      image: collection.image_url || '',
    })

    title.textContent = collection.name
    intro.textContent =
      collection.description || sfT('collectionProductsDefault')

    const products = allProducts.filter(
      (product) => product.collection_slug === collection.slug,
    )

    if (products.length === 0) {
      container.textContent = sfT('collectionEmpty')
      return
    }

    container.innerHTML = products.map(renderProductCard).join('')
  } catch (error) {
    title.textContent = sfT('collectionLoadError')
    intro.textContent = 'Non è stato possibile caricare questa pagina.'
    container.textContent = ''
    intro.textContent = sfT('collectionLoadErrorText')
  }
}

function renderProductGallery(product = {}) {
  const images = getProductGalleryImages(product)
  const modelUrl = getProductModelUrl(product)
  const posterImageUrl = getProductPosterImage(product)

  if (!images.length && !modelUrl) {
    return `
      <div class="product-gallery-placeholder">
        <span>${escapeCmsHtml(sfT('productNoImage'))}</span>
      </div>
    `
  }

  const mainImage = images[0] || posterImageUrl

  return `
    <div class="product-gallery">
      <div class="product-gallery-main">
        ${
          modelUrl
            ? renderThreeDViewer({
                modelUrl,
                posterImageUrl,
                title: product.name || sfT('product'),
                autoRotate: true,
              })
            : `<img src="${escapeCmsHtml(mainImage)}" alt="${escapeCmsHtml(product.name)}" loading="lazy">`
        }
      </div>

      ${
        images.length > 1
          ? `
            <div class="product-gallery-thumbs">
              ${images
                .slice(0, 6)
                .map(
                  (image, index) => `
                    <a href="${escapeCmsHtml(image)}" target="_blank" rel="noreferrer" aria-label="Apri immagine ${index + 1}">
                      <img src="${escapeCmsHtml(image)}" alt="${escapeCmsHtml(product.name)} ${index + 1}" loading="lazy">
                    </a>
                  `,
                )
                .join('')}
            </div>
          `
          : ''
      }
    </div>
  `
}

function renderProductSpecs(product = {}) {
  const metafields = getDisplayableProductMetafields(product)
  if (!metafields.length) return ''

  return `
    <section class="product-info-panel product-specs">
      <h2>${escapeCmsHtml(sfT('specs'))}</h2>
      <dl>
        ${metafields
          .map(
            ([key, value]) => `
              <div>
                <dt>${escapeCmsHtml(formatMetafieldLabel(key))}</dt>
                <dd>${escapeCmsHtml(String(value))}</dd>
              </div>
            `,
          )
          .join('')}
      </dl>
    </section>
  `
}

function renderRelatedProducts(products = [], product = {}) {
  const related = products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        product.collection_slug &&
        item.collection_slug === product.collection_slug,
    )
    .slice(0, 3)

  if (!related.length) return ''

  return `
    <section class="section related-products">
      <div class="section-head reveal visible">
        <p class="eyebrow">${escapeCmsHtml(sfT('relatedProducts'))}</p>
        <h2>${escapeCmsHtml(sfT('sameCollection'))}</h2>
        <p>${escapeCmsHtml(sfT('relatedText'))}</p>
      </div>
      <div class="store-grid">
        ${related.map(renderProductCard).join('')}
      </div>
    </section>
  `
}

function updateProductPageVariant(select) {
  const product = productCache.get(select.dataset.productSlug)
  if (!product) return

  const variant = getProductVariant(product, select.value)
  const priceTarget = document.querySelector('#productPagePrice')
  const stockTarget = document.querySelector('#productPageStock')
  const variantStockTarget = document.querySelector('#productPageVariantStock')
  const addButton = document.querySelector('#productAddToCartButton')
  const stock = getEffectiveStock(product, variant)

  if (priceTarget) {
    priceTarget.textContent = formatPriceCents(getEffectivePriceCents(product, variant))
  }

  if (stockTarget) {
    stockTarget.textContent = `${sfT('stock')}: ${stock}`
  }

  if (variantStockTarget) {
    variantStockTarget.textContent = stock <= 0
      ? sfT('variantUnavailable')
      : sfT('variantAvailable', { count: stock })
  }

  if (addButton) {
    addButton.dataset.variantId = variant?.id || ''
    addButton.disabled = stock <= 0
    addButton.textContent = stock <= 0 ? sfT('unavailable') : sfT('addToCart')
  }
}

async function renderPublicProductPage() {
  const path = window.location.pathname

  if (!path.startsWith('/products/')) return

  const productSlug = decodeURIComponent(
    path.replace('/products/', '').replaceAll('/', ''),
  )
  const main = document.querySelector('main')

  if (!main || !productSlug) return

  main.innerHTML = `
    <section class="section">
      <div class="section-head reveal visible">
        <p class="eyebrow">${escapeCmsHtml(sfT('product'))}</p>
        <h2>${escapeCmsHtml(sfT('productLoading'))}</h2>
        <p>${escapeCmsHtml(sfT('productLoadingText'))}</p>
      </div>
    </section>
  `

  try {
    const [productsResponse, collectionsResponse] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/collections'),
    ])

    const productsData = await productsResponse.json()
    const collectionsData = await collectionsResponse.json()

    if (!productsResponse.ok || !productsData.success) {
      throw new Error('Errore caricamento prodotti')
    }

    const products = cacheProducts(productsData.products || [])

    const product = products.find((item) => item.slug === productSlug)

    if (!product) {
      document.querySelector('#productJsonLd')?.remove()
      main.innerHTML = `
        <section class="section product-detail-empty">
          <p class="eyebrow">${escapeCmsHtml(sfT('product'))}</p>
          <h1>${escapeCmsHtml(sfT('productNotFound'))}</h1>
          <p>${escapeCmsHtml(sfT('productNotFoundText'))}</p>
          <a class="btn primary" href="/#shop">${escapeCmsHtml(sfT('backToShop'))}</a>
        </section>
      `
      applySeoMeta(
        {},
        {
          title: `${sfT('productNotFound')} | Orbitra`,
          description: sfT('cartProductUnavailable'),
        },
      )
      return
    }

    applySeoMeta(product.seo || {}, {
      title: `${product.name} | Orbitra`,
      description: product.description || 'Scheda prodotto Orbitra.',
      image: product.image_url || '',
    })
    trackAnalyticsEvent('product_view', {
      entity_type: 'product',
      entity_id: product.slug,
    })

    const collections = translateCollections(collectionsData.collections || [])
    const collection = collections.find(
      (item) => item.slug === product.collection_slug,
    )
    const defaultVariant = getDefaultVariant(product)
    const priceCents = getEffectivePriceCents(product, defaultVariant)
    const stock = getEffectiveStock(product, defaultVariant)
    const modelUrl = getProductModelUrl(product)
    const posterImageUrl = getProductPosterImage(product)
    const product3dModalId = `product-3d-viewer-${product.id}`
    const productSpecsHtml = renderProductSpecs(product)
    const relatedProductsHtml = renderRelatedProducts(products, product)
    setProductJsonLd(product, defaultVariant, collection)

    main.innerHTML = `
      <section class="section product-detail product-detail-premium">
        <div class="product-detail-media">
          ${renderProductGallery(product)}
        </div>

        <div class="product-detail-info">
          <p class="eyebrow">${escapeCmsHtml(product.category || 'Prodotto')}</p>
          <h1>${escapeCmsHtml(product.name)}</h1>
          <p>${escapeCmsHtml(product.description || sfT('productNoDescription'))}</p>

          <div class="product-detail-price" id="productPagePrice">
            ${formatPriceCents(priceCents)}
          </div>

          <div class="product-detail-meta">
            <span id="productPageStock">${escapeCmsHtml(sfT('stock'))}: ${stock}</span>
            <span>${escapeCmsHtml(sfT('category'))}: ${escapeCmsHtml(product.category || sfT('noCategory'))}</span>
            <span>
              ${escapeCmsHtml(sfT('collection'))}:
              ${
                product.collection_slug
                  ? `<a href="/collections/${escapeCmsHtml(product.collection_slug)}">${escapeCmsHtml(collection?.name || product.collection_slug)}</a>`
                  : escapeCmsHtml(sfT('noCollection'))
              }
            </span>
          </div>

          ${
            product.variants?.length
              ? `
                <label class="product-variant-field">
                  ${escapeCmsHtml(sfT('variant'))}
                  <select id="productVariantSelect" data-product-slug="${escapeCmsHtml(product.slug)}">
                    ${product.variants
                      .map(
                        (variant) => {
                          const variantStock = getEffectiveStock(product, variant)

                          return `
                          <option value="${variant.id}" ${defaultVariant?.id === variant.id ? 'selected' : ''} ${variantStock <= 0 ? 'disabled' : ''}>
                            ${escapeCmsHtml(variant.option_name)}: ${escapeCmsHtml(variant.option_value)}
                            ${variant.sku ? ` · ${escapeCmsHtml(variant.sku)}` : ''}
                            ${variantStock <= 0 ? ` - ${escapeCmsHtml(sfT('soldOut'))}` : ''}
                          </option>
                        `
                        },
                      )
                      .join('')}
                  </select>
                  <span id="productPageVariantStock" class="product-variant-stock">
                    ${escapeCmsHtml(stock <= 0 ? sfT('variantUnavailable') : sfT('variantAvailable', { count: stock }))}
                  </span>
                </label>
              `
              : ''
          }

          <label class="product-quantity-field">
            ${escapeCmsHtml(sfT('quantity'))}
            <input id="productQuantity" type="number" min="1" value="1">
          </label>

          ${renderAddToCartButton(
            product,
            defaultVariant,
            'id="productAddToCartButton" data-cart-quantity-input="#productQuantity"',
          )}

          ${
            modelUrl
              ? `<button class="btn ghost product-3d-trigger" type="button" data-open-3d-modal="#${escapeCmsHtml(product3dModalId)}">
                  ${escapeCmsHtml(sfT('view3d'))}
                </button>`
              : ''
          }

          <div class="product-trust-row">
            <span>${escapeCmsHtml(sfT('trustCheckout'))}</span>
            <span>${escapeCmsHtml(sfT('trustShipping'))}</span>
            <span>${escapeCmsHtml(sfT('trustSupport'))}</span>
          </div>

          <div class="product-accordion">
            <details open>
              <summary>${escapeCmsHtml(sfT('description'))}</summary>
              <p>${escapeCmsHtml(product.description || sfT('productNoDescription'))}</p>
            </details>
            <details>
              <summary>${escapeCmsHtml(sfT('shippingReturns'))}</summary>
              <p>${escapeCmsHtml(sfT('shippingReturnsText'))}</p>
            </details>
          </div>
        </div>
      </section>
      ${productSpecsHtml}
      ${relatedProductsHtml}
      ${renderThreeDModal({
        id: product3dModalId,
        modelUrl,
        posterImageUrl,
        title: product.name,
        autoRotate: true,
      })}
    `
    hydrateThreeDViewers()
  } catch (error) {
    document.querySelector('#productJsonLd')?.remove()
    main.innerHTML = `
      <section class="section product-detail-empty">
        <p class="eyebrow">${escapeCmsHtml(sfT('product'))}</p>
        <h1>${escapeCmsHtml(sfT('productLoadError'))}</h1>
        <p>${escapeCmsHtml(sfT('productLoadErrorText'))}</p>
        <a class="btn primary" href="/#shop">${escapeCmsHtml(sfT('backToShop'))}</a>
      </section>
    `
  }
}

async function loadShippingMethods() {
  try {
    const response = await fetch('/api/shipping')
    const data = await response.json()

    if (!response.ok || !data.success || !Array.isArray(data.methods)) {
      return []
    }

    return data.methods
  } catch {
    return []
  }
}

async function loadCheckoutPolicies() {
  try {
    const response = await fetch('/api/policies')
    const data = await response.json()

    if (!response.ok || !data.success || !Array.isArray(data.policies)) {
      return []
    }

    return data.policies.filter((policy) =>
      ['privacy_policy', 'terms_conditions'].includes(policy.type),
    )
  } catch {
    return []
  }
}

function createCheckoutIdempotencyKey() {
  if (window.crypto?.randomUUID) {
    return `checkout:${window.crypto.randomUUID()}`
  }

  return `checkout:${Date.now()}:${Math.random().toString(16).slice(2)}`
}

function renderPolicyAcceptance(policies = []) {
  if (!policies.length) return ''

  const links = policies
    .map(
      (policy) => `
        <a href="/policies/${escapeCmsHtml(policy.slug)}" target="_blank" rel="noreferrer">
          ${escapeCmsHtml(policy.title)}
        </a>
      `,
    )
    .join(sfT('listAnd'))

  return `
    <section class="checkout-policy">
      <label class="checkout-policy-check">
        <input name="policy_accepted" type="checkbox" required>
        <span>${sfT('checkoutPolicyAccept', { links })}</span>
      </label>
    </section>
  `
}

function renderCheckoutSummary(
  items,
  shippingMethods,
  selectedHandle,
  taxSettings = DEFAULT_TAX_SETTINGS,
  discount = activeCheckoutDiscount,
) {
  const subtotalCents = calculateCartSubtotal(items)
  const shipping = calculateShippingCost(shippingMethods, selectedHandle, subtotalCents)
  const discountCents = Math.min(subtotalCents, Math.max(0, Number(discount?.discount_cents || 0)))
  const taxSummary = calculateTaxSummary(
    subtotalCents,
    shipping.shipping_cents,
    discountCents,
    taxSettings,
  )
  const subtotalTarget = document.querySelector('#checkoutSubtotal')
  const shippingTarget = document.querySelector('#checkoutShipping')
  const discountRow = document.querySelector('#checkoutDiscountRow')
  const discountTarget = document.querySelector('#checkoutDiscount')
  const taxLabel = document.querySelector('#checkoutTaxLabel')
  const taxTarget = document.querySelector('#checkoutTax')
  const totalTarget = document.querySelector('#checkoutTotal')

  if (subtotalTarget) subtotalTarget.textContent = formatPriceCents(subtotalCents)
  if (shippingTarget) shippingTarget.textContent = formatPriceCents(shipping.shipping_cents)
  if (discountRow) discountRow.hidden = discountCents <= 0
  if (discountTarget) discountTarget.textContent = `-${formatPriceCents(discountCents)}`
  if (taxLabel) {
    taxLabel.textContent = taxSummary.prices_include_tax
      ? `${sfT('checkoutTaxIncluded')} (${Number(taxSettings.vat_rate || 0)}%)`
      : `${sfT('checkoutTax')} (${Number(taxSettings.vat_rate || 0)}%)`
  }
  if (taxTarget) taxTarget.textContent = formatPriceCents(taxSummary.tax_cents)
  if (totalTarget) totalTarget.textContent = formatPriceCents(taxSummary.total_cents)
}

async function applyCheckoutDiscount(items, shippingMethods, taxSettings) {
  const input = document.querySelector('#discountCode')
  const message = document.querySelector('#checkoutDiscountMessage')
  const selectedHandle = document.querySelector('input[name="shipping_method"]:checked')?.value
  const code = input?.value.trim() || ''

  if (!code) {
    activeCheckoutDiscount = null
    if (message) message.textContent = sfT('discountInsert')
    renderCheckoutSummary(items, shippingMethods, selectedHandle, taxSettings)
    return
  }

  if (message) message.textContent = sfT('discountChecking')

  try {
    const response = await fetch('/api/discounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        subtotal_cents: calculateCartSubtotal(items),
      }),
    })
    const data = await response.json()

    if (!response.ok || !data.success || !data.discount) {
      activeCheckoutDiscount = null
      if (message) message.textContent = data.message || sfT('discountInvalid')
      renderCheckoutSummary(items, shippingMethods, selectedHandle, taxSettings)
      return
    }

    activeCheckoutDiscount = data.discount
    if (input) input.value = data.discount.code
    if (message) {
      message.textContent = sfT('discountApplied', {
        code: data.discount.code,
        amount: formatPriceCents(data.discount.discount_cents),
      })
    }
    renderCheckoutSummary(items, shippingMethods, selectedHandle, taxSettings)
  } catch {
    activeCheckoutDiscount = null
    if (message) message.textContent = sfT('discountUnavailable')
    renderCheckoutSummary(items, shippingMethods, selectedHandle, taxSettings)
  }
}

function renderOrderConfirmation(order) {
  const main = document.querySelector('main')
  if (!main) return

  main.innerHTML = `
    <section class="section checkout-confirmation">
      <p class="eyebrow">${escapeCmsHtml(sfT('orderCreated'))}</p>
      <h1>${escapeCmsHtml(sfT('thankYou', { id: order.id }))}</h1>
      <p>
        ${escapeCmsHtml(sfT('paymentStatus'))}: ${escapeCmsHtml(order.payment_status)}.
        ${escapeCmsHtml(sfT('orderStatus'))}: ${escapeCmsHtml(order.order_status)}.
      </p>

      <div class="checkout-confirmation-box">
        <span>${escapeCmsHtml(sfT('orderTotal'))}</span>
        <strong>${formatPriceCents(order.total_cents)}</strong>
        ${
          order.discount_cents
            ? `<small>${escapeCmsHtml(sfT('checkoutDiscount'))} ${escapeCmsHtml(order.discount_code || '')}: -${formatPriceCents(order.discount_cents)}</small>`
            : ''
        }
        <small>${escapeCmsHtml(sfT('checkoutTax'))}: ${formatPriceCents(order.tax_cents || 0)}</small>
        <small>${escapeCmsHtml(sfT('paymentMethod'))}: ${escapeCmsHtml(order.payment_method || 'manual')}</small>
      </div>

      <a class="btn primary" href="/">${escapeCmsHtml(sfT('backToSite'))}</a>
    </section>
  `
}

async function submitCheckoutForm(event, shippingMethods, detailedItems, taxSettings) {
  event.preventDefault()

  const form = event.currentTarget
  const message = document.querySelector('#checkoutMessage')
  const submitButton = form.querySelector('[type="submit"]')

  if (!form.reportValidity()) return
  if (form.dataset.submitting === 'true') return

  if (getCart().length === 0) {
    if (message) message.textContent = sfT('checkoutEmptyMessage')
    return
  }

  form.dataset.submitting = 'true'
  if (submitButton) submitButton.disabled = true

  const formData = new FormData(form)
  const payload = {
    idempotency_key: activeCheckoutIdempotencyKey || createCheckoutIdempotencyKey(),
    customer: {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    },
    shipping_address: {
      line1: formData.get('address_line1'),
      city: formData.get('city'),
      postal_code: formData.get('postal_code'),
      country: formData.get('country'),
    },
    shipping_method: formData.get('shipping_method'),
    payment_method: formData.get('payment_method'),
    discount_code: activeCheckoutDiscount?.code || document.querySelector('#discountCode')?.value.trim() || '',
    policy_accepted: Boolean(formData.get('policy_accepted')),
    items: getCart().map((item) => ({
      productSlug: item.productSlug,
      variantId: item.variantId,
      quantity: item.quantity,
    })),
  }

  activeCheckoutIdempotencyKey = payload.idempotency_key

  if (message) message.textContent = sfT('checkoutCreating')

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    if (!response.ok || !data.success) {
      if (message) message.textContent = data.message || sfT('checkoutError')
      renderCheckoutSummary(
        detailedItems,
        shippingMethods,
        payload.shipping_method,
        taxSettings,
      )
      return
    }

    if (data.order?.payment_method === 'stripe' && data.order?.requires_payment_redirect) {
      if (message) message.textContent = sfT('stripePreparing')

      const stripeResponse = await fetch('/api/payments/stripe/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: data.order.id,
          email: payload.customer.email,
          success_url: `${window.location.origin}/checkout?payment=stripe_success&order_id=${data.order.id}&total_cents=${data.order.total_cents || 0}`,
          cancel_url: `${window.location.origin}/checkout?payment=stripe_cancel&order_id=${data.order.id}`,
        }),
      })
      const stripeData = await stripeResponse.json()

      if (!stripeResponse.ok || !stripeData.success || !stripeData.checkout_url) {
        if (message) {
          message.textContent =
            stripeData.message ||
            sfT('stripeUnavailable', { id: data.order.id })
        }
        return
      }

      clearCart()
      closeCart()
      window.location.href = stripeData.checkout_url
      return
    }

    clearCart()
    closeCart()
    trackAnalyticsEvent('order_created', {
      entity_type: 'order',
      entity_id: data.order?.id,
      metadata: {
        total_cents: data.order?.total_cents || 0,
        payment_status: data.order?.payment_status || 'pending',
      },
    })
    renderOrderConfirmation(data.order)
  } catch {
    if (message) message.textContent = sfT('checkoutConnectionError')
  } finally {
    form.dataset.submitting = 'false'
    if (submitButton) submitButton.disabled = false
  }
}

async function renderPublicCheckoutPage() {
  const path = window.location.pathname
  if (path !== '/checkout') return

  const main = document.querySelector('main')
  if (!main) return

  const checkoutParams = new URLSearchParams(window.location.search)
  const paymentReturn = checkoutParams.get('payment')
  const returnOrderId = checkoutParams.get('order_id')
  const returnTotalCents = Math.max(0, Number(checkoutParams.get('total_cents') || 0))

  if (paymentReturn === 'stripe_success') {
    clearCart()
    renderOrderConfirmation({
      id: returnOrderId || 'Stripe',
      total_cents: returnTotalCents,
      tax_cents: 0,
      payment_status: 'paid',
      payment_method: 'stripe',
      order_status: 'paid',
    })
    return
  }

  if (paymentReturn === 'stripe_cancel') {
    main.innerHTML = `
      <section class="section checkout-empty">
        <p class="eyebrow">${escapeCmsHtml(sfT('checkoutPayment'))}</p>
        <h1>${escapeCmsHtml(sfT('paymentCanceled'))}</h1>
        <p>${escapeCmsHtml(sfT('paymentCanceledText', { id: returnOrderId || '' }))}</p>
        <a class="btn primary" href="/checkout">${escapeCmsHtml(sfT('backToCheckout'))}</a>
      </section>
    `
    return
  }

  main.innerHTML = `
    <section class="section checkout-page">
      <div class="section-head reveal visible">
        <p class="eyebrow">${escapeCmsHtml(sfT('checkout'))}</p>
        <h2>${escapeCmsHtml(sfT('checkoutLoading'))}</h2>
        <p>${escapeCmsHtml(sfT('checkoutLoadingText'))}</p>
      </div>
    </section>
  `

  try {
    await loadProductsForCart()
    const detailedItems = getDetailedCartItems()

    if (getCart().length === 0 || detailedItems.length === 0) {
      main.innerHTML = `
        <section class="section checkout-empty">
          <p class="eyebrow">${escapeCmsHtml(sfT('checkout'))}</p>
          <h1>${escapeCmsHtml(sfT('checkoutEmptyTitle'))}</h1>
          <p>${escapeCmsHtml(sfT('checkoutEmptyText'))}</p>
          <a class="btn primary" href="/#shop">${escapeCmsHtml(sfT('checkoutGoToShop'))}</a>
        </section>
      `
      return
    }

    activeCheckoutDiscount = null
    activeCheckoutIdempotencyKey = createCheckoutIdempotencyKey()
    const [shippingMethods, taxSettings, checkoutPolicies] = await Promise.all([
      loadShippingMethods(),
      loadTaxSettings(),
      loadCheckoutPolicies(),
    ])
    const subtotalCents = calculateCartSubtotal(detailedItems)
    trackAnalyticsEvent('checkout_start', {
      entity_type: 'checkout',
      metadata: {
        subtotal_cents: subtotalCents,
        items_count: detailedItems.length,
      },
    })
    const methods = shippingMethods.length
      ? shippingMethods
      : [
          {
            handle: 'standard',
            name: sfT('checkoutStandardShipping'),
            description: sfT('checkoutStandardShippingText'),
            price_cents: 990,
            free_over_cents: null,
          },
        ]
    const availableMethods = getAvailableShippingMethods(methods, subtotalCents)
    const defaultMethod = availableMethods[0] || methods[0]

    main.innerHTML = `
      <section class="section checkout-page">
        <div class="section-head reveal visible">
          <p class="eyebrow">${escapeCmsHtml(sfT('checkout'))}</p>
          <h2>${escapeCmsHtml(sfT('checkoutComplete'))}</h2>
          <p>${escapeCmsHtml(sfT('checkoutIntro'))}</p>
        </div>

        <div class="checkout-layout">
          <form id="checkoutForm" class="checkout-form">
            <section>
              <h3>${escapeCmsHtml(sfT('checkoutCustomer'))}</h3>
              <label>${escapeCmsHtml(sfT('checkoutFullName'))}<input name="name" type="text" required></label>
              <label>${escapeCmsHtml(sfT('checkoutEmail'))}<input name="email" type="email" required></label>
              <label>${escapeCmsHtml(sfT('checkoutPhone'))}<input name="phone" type="tel"></label>
            </section>

            <section>
              <h3>${escapeCmsHtml(sfT('checkoutAddress'))}</h3>
              <label>${escapeCmsHtml(sfT('checkoutAddressLine'))}<input name="address_line1" type="text" required></label>
              <label>${escapeCmsHtml(sfT('checkoutCity'))}<input name="city" type="text" required></label>
              <label>${escapeCmsHtml(sfT('checkoutPostal'))}<input name="postal_code" type="text" required></label>
              <label>${escapeCmsHtml(sfT('checkoutCountry'))}<input name="country" type="text" value="Italia" required></label>
            </section>

            <section>
              <h3>${escapeCmsHtml(sfT('checkoutShippingMethod'))}</h3>
              <div class="checkout-shipping-options">
                ${methods
                  .map((method) => {
                    const isAvailable =
                      !method.free_over_cents || subtotalCents >= Number(method.free_over_cents)
                    return `
                      <label class="checkout-option ${isAvailable ? '' : 'disabled'}">
                        <input
                          name="shipping_method"
                          type="radio"
                          value="${escapeCmsHtml(method.handle)}"
                          ${defaultMethod?.handle === method.handle ? 'checked' : ''}
                          ${isAvailable ? '' : 'disabled'}
                        >
                        <span>
                          <strong>${escapeCmsHtml(method.name)}</strong>
                          <small>
                            ${escapeCmsHtml(method.description || '')}
                            ${method.free_over_cents ? ` - ${escapeCmsHtml(sfT('checkoutFreeOver', { amount: formatPriceCents(method.free_over_cents) }))}` : ''}
                          </small>
                        </span>
                        <em>${formatPriceCents(method.price_cents)}</em>
                      </label>
                    `
                  })
                  .join('')}
              </div>
            </section>

            <section>
              <h3>${escapeCmsHtml(sfT('checkoutPayment'))}</h3>
              <label>
                ${escapeCmsHtml(sfT('checkoutPaymentMethod'))}
                <select name="payment_method">
                  <option value="manual">${escapeCmsHtml(sfT('checkoutManual'))}</option>
                  <option value="stripe">${escapeCmsHtml(sfT('checkoutStripe'))}</option>
                  <option value="test_paid">${escapeCmsHtml(sfT('checkoutTestPaid'))}</option>
                  <option value="test_failed">${escapeCmsHtml(sfT('checkoutTestFailed'))}</option>
                </select>
              </label>
            </section>

            ${renderPolicyAcceptance(checkoutPolicies)}

            <button class="btn primary" type="submit">${escapeCmsHtml(sfT('checkoutSubmit'))}</button>
            <p id="checkoutMessage" class="checkout-message"></p>
          </form>

          <aside class="checkout-summary">
            <h3>${escapeCmsHtml(sfT('checkoutSummary'))}</h3>
            <div class="checkout-items">
              ${detailedItems
                .map(
                  (item) => `
                    <article>
                      <div>
                        <strong>${escapeCmsHtml(item.product.name)}</strong>
                        ${item.variant ? `<span>${escapeCmsHtml(item.variant.option_name)}: ${escapeCmsHtml(item.variant.option_value)}</span>` : ''}
                        <small>${escapeCmsHtml(sfT('quantity'))}: ${item.quantity}</small>
                      </div>
                      <b>${formatPriceCents(item.line_total_cents)}</b>
                    </article>
                  `,
                )
                .join('')}
            </div>

            <div class="checkout-discount">
              <label>
                ${escapeCmsHtml(sfT('checkoutDiscountCode'))}
                <input id="discountCode" name="discount_code" type="text" placeholder="WELCOME10">
              </label>
              <button id="applyDiscountButton" class="btn ghost" type="button">${escapeCmsHtml(sfT('checkoutApply'))}</button>
              <p id="checkoutDiscountMessage" class="checkout-message"></p>
            </div>

            <div class="checkout-totals">
              <span>${escapeCmsHtml(sfT('checkoutSubtotal'))} <strong id="checkoutSubtotal">${formatPriceCents(subtotalCents)}</strong></span>
              <span>${escapeCmsHtml(sfT('checkoutShipping'))} <strong id="checkoutShipping">${formatPriceCents(0)}</strong></span>
              <span id="checkoutDiscountRow" hidden>${escapeCmsHtml(sfT('checkoutDiscount'))} <strong id="checkoutDiscount">-${formatPriceCents(0)}</strong></span>
              <span><span id="checkoutTaxLabel">${escapeCmsHtml(sfT('checkoutTaxIncluded'))}</span> <strong id="checkoutTax">${formatPriceCents(0)}</strong></span>
              <span class="grand-total">${escapeCmsHtml(sfT('checkoutTotal'))} <strong id="checkoutTotal">${formatPriceCents(0)}</strong></span>
            </div>
          </aside>
        </div>
      </section>
    `

    renderCheckoutSummary(detailedItems, methods, defaultMethod?.handle, taxSettings)

    document.querySelectorAll('input[name="shipping_method"]').forEach((input) => {
      input.addEventListener('change', () => {
        renderCheckoutSummary(detailedItems, methods, input.value, taxSettings)
      })
    })

    document
      .querySelector('#applyDiscountButton')
      ?.addEventListener('click', () => applyCheckoutDiscount(detailedItems, methods, taxSettings))

    document
      .querySelector('#checkoutForm')
      ?.addEventListener('submit', (event) =>
        submitCheckoutForm(event, methods, detailedItems, taxSettings),
      )
  } catch {
    main.innerHTML = `
      <section class="section checkout-empty">
        <p class="eyebrow">${escapeCmsHtml(sfT('checkout'))}</p>
        <h1>${escapeCmsHtml(sfT('checkoutUnavailable'))}</h1>
        <p>${escapeCmsHtml(sfT('checkoutUnavailableText'))}</p>
        <a class="btn primary" href="/">${escapeCmsHtml(sfT('backToSite'))}</a>
      </section>
    `
  }
}

function renderBlogDate(value = '') {
  if (!value) return ''

  try {
    return new Date(value).toLocaleDateString(getStorefrontLocale(), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function renderBlogContent(content = '') {
  return escapeCmsHtml(content)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

async function renderPublicBlogPage() {
  const path = window.location.pathname
  if (path !== '/blog' && path !== '/blog/' && !path.startsWith('/blog/')) return

  const main = document.querySelector('main')
  if (!main) return

  const slug = path.startsWith('/blog/') ? decodeURIComponent(path.replace('/blog/', '').replaceAll('/', '')) : ''

  main.innerHTML = `
    <section class="section blog-page">
      <div class="section-head reveal visible">
        <p class="eyebrow">Blog</p>
        <h1>${slug ? 'Caricamento articolo...' : 'Caricamento blog...'}</h1>
        <p>Contenuti editoriali dal CMS.</p>
      </div>
    </section>
  `

  try {
    const response = await fetch(slug ? `/api/blog?slug=${encodeURIComponent(slug)}` : '/api/blog')
    const data = await response.json()

    if (slug) {
      if (!response.ok || !data.success || !data.post) {
        main.innerHTML = `
          <section class="section blog-empty">
            <p class="eyebrow">Blog</p>
            <h1>Articolo non trovato</h1>
            <p>Questo articolo non esiste o non e pubblicato.</p>
            <a class="btn primary" href="/blog">Torna al blog</a>
          </section>
        `
        applySeoMeta({}, {
          title: 'Articolo non trovato | Orbitra',
          description: 'Articolo blog non disponibile.',
        })
        return
      }

      const post = translateBlogPost(data.post)
      applySeoMeta(
        {
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          og_image: post.og_image || post.image_url,
        },
        {
          title: `${post.title} | Orbitra Blog`,
          description: post.excerpt || 'Articolo blog Orbitra.',
          image: post.image_url || '',
        },
      )

      trackAnalyticsEvent('page_view', {
        entity_type: 'blog_post',
        entity_id: post.slug,
      })

      main.innerHTML = `
        <article class="section blog-article">
          ${
            post.image_url
              ? `<img class="blog-hero-image" src="${escapeCmsHtml(post.image_url)}" alt="${escapeCmsHtml(post.title)}" loading="lazy">`
              : ''
          }
          <p class="eyebrow">Blog ${post.author ? `&middot; ${escapeCmsHtml(post.author)}` : ''}</p>
          <h1>${escapeCmsHtml(post.title)}</h1>
          <p class="blog-date">${escapeCmsHtml(renderBlogDate(post.created_at))}</p>
          <div class="blog-content">
            ${renderBlogContent(post.content || post.excerpt || '')}
          </div>
          <a class="btn ghost" href="/blog">Tutti gli articoli</a>
        </article>
      `
      return
    }

    const posts = (data.posts || []).map(translateBlogPost)
    applySeoMeta({}, {
      title: 'Blog | Orbitra',
      description: 'Articoli e aggiornamenti dal CMS Orbitra.',
    })

    main.innerHTML = `
      <section class="section blog-page">
        <div class="section-head reveal visible">
          <p class="eyebrow">Blog</p>
          <h1>Articoli e aggiornamenti.</h1>
          <p>Una vista editoriale minima gestita dal CMS.</p>
        </div>

        ${
          posts.length
            ? `<div class="blog-grid">
                ${posts
                  .map(
                    (post) => `
                      <article class="blog-card">
                        <a class="blog-card-image" href="/blog/${escapeCmsHtml(post.slug)}">
                          ${
                            post.image_url
                              ? `<img src="${escapeCmsHtml(post.image_url)}" alt="${escapeCmsHtml(post.title)}" loading="lazy">`
                              : '<span>Blog</span>'
                          }
                        </a>
                        <p class="eyebrow">${escapeCmsHtml(renderBlogDate(post.created_at))}</p>
                        <h2><a href="/blog/${escapeCmsHtml(post.slug)}">${escapeCmsHtml(post.title)}</a></h2>
                        <p>${escapeCmsHtml(post.excerpt || '')}</p>
                        <a class="btn ghost" href="/blog/${escapeCmsHtml(post.slug)}">Leggi</a>
                      </article>
                    `,
                  )
                  .join('')}
              </div>`
            : '<p class="blog-empty-text">Nessun articolo pubblicato.</p>'
        }
      </section>
    `
  } catch {
    main.innerHTML = `
      <section class="section blog-empty">
        <p class="eyebrow">Blog</p>
        <h1>Blog non disponibile</h1>
        <p>Non e stato possibile caricare gli articoli.</p>
        <a class="btn primary" href="/">Torna al sito</a>
      </section>
    `
  }
}

async function renderPublicPolicyPage() {
  const path = window.location.pathname
  if (!path.startsWith('/policies/')) return

  const slug = decodeURIComponent(path.replace('/policies/', '').replaceAll('/', ''))
  const main = document.querySelector('main')
  if (!main || !slug) return

  main.innerHTML = `
    <section class="section policy-page">
      <div class="section-head reveal visible">
        <p class="eyebrow">Policy</p>
        <h1>Caricamento policy...</h1>
        <p>Stiamo recuperando il contenuto dal CMS.</p>
      </div>
    </section>
  `

  try {
    const response = await fetch(`/api/policies?slug=${encodeURIComponent(slug)}`)
    const data = await response.json()

    if (!response.ok || !data.success || !data.policy) {
      main.innerHTML = `
        <section class="section policy-page policy-empty">
          <p class="eyebrow">Policy</p>
          <h1>Policy non trovata</h1>
          <p>Questa policy non esiste o non e pubblicata.</p>
          <a class="btn primary" href="/">Torna al sito</a>
        </section>
      `
      applySeoMeta({}, {
        title: 'Policy non trovata | Orbitra',
        description: 'Policy non disponibile.',
      })
      return
    }

    const policy = translatePolicy(data.policy)
    applySeoMeta({}, {
      title: `${policy.title} | Orbitra`,
      description: `${policy.title} aggiornata dal CMS.`,
    })

    main.innerHTML = `
      <article class="section policy-page">
        <p class="eyebrow">Policy</p>
        <h1>${escapeCmsHtml(policy.title)}</h1>
        <p class="policy-date">Ultimo aggiornamento: ${escapeCmsHtml(policy.updated_at || '')}</p>
        <div class="policy-content">
          ${renderBlogContent(policy.content || '')}
        </div>
      </article>
    `
  } catch {
    main.innerHTML = `
      <section class="section policy-page policy-empty">
        <p class="eyebrow">Policy</p>
        <h1>Policy non disponibile</h1>
        <p>Non e stato possibile caricare questa policy.</p>
        <a class="btn primary" href="/">Torna al sito</a>
      </section>
    `
  }
}

async function renderPublicCmsPage() {
  const path = window.location.pathname

  if (path === '/') return
  if (path.startsWith('/collections/')) return
  if (path.startsWith('/products/')) return
  if (path.startsWith('/policies/')) return
  if (path.startsWith('/api/')) return

  const pageSlug = decodeURIComponent(path.replace('/', '').replaceAll('/', ''))
  const main = document.querySelector('main')

  if (!main || !pageSlug) return

  main.innerHTML = `
    <section class="section">
      <div class="section-head reveal visible">
        <p class="eyebrow">Pagina CMS</p>
        <h2>Caricamento pagina...</h2>
        <p>Stiamo recuperando questa pagina dal CMS.</p>
      </div>
    </section>
  `

  const title = main.querySelector('h2')
  const intro = main.querySelector('.section-head p:last-child')

  try {
    const response = await fetch('/api/pages')
    const data = await response.json()

    if (!data.success) {
      title.textContent = 'Errore caricamento pagina'
      intro.textContent = 'Non è stato possibile leggere questa pagina dal CMS.'
      return
    }

    const pages = translatePages(data.pages || [])
    const page = pages.find((item) => item.slug === pageSlug)

    if (!page) {
      title.textContent = 'Pagina non trovata'
      intro.textContent = 'Questa pagina non esiste nel CMS.'
      return
    }

    title.textContent = page.title
    intro.textContent = 'Contenuti caricati dal CMS custom Orbitra.'
    applySeoMeta(page.seo || {}, {
      title: `${page.title} | Orbitra`,
      description: 'Pagina CMS Orbitra.',
    })

    await loadCmsSectionsFromD1(page.slug)
  } catch (error) {
    title.textContent = 'Errore caricamento pagina'
    intro.textContent = 'Non è stato possibile caricare questa pagina.'
  }
}

async function applyHomeSeoMeta() {
  try {
    const response = await fetch('/api/pages')
    const data = await response.json()
    const pages = translatePages(data.pages || [])
    const homePage = pages.find((page) => page.slug === 'home')

    applySeoMeta(homePage?.seo || {}, {
      title: `${homePage?.title || 'Orbitra'} | Luxury Space Travel`,
      description: 'Store e CMS custom Orbitra.',
    })
  } catch {
    applySeoMeta(
      {},
      {
        title: 'Orbitra | Luxury Space Travel',
        description: 'Store e CMS custom Orbitra.',
      },
    )
  }
}

async function bootPublicRouting() {
  const path = window.location.pathname
  await loadPrimaryCanonicalDomain()
  await loadPublicTranslations()
  trackAnalyticsEvent('page_view')

  if (path.startsWith('/collections/')) {
    await renderPublicCollectionPage()
    return
  }

  if (path.startsWith('/products/')) {
    await renderPublicProductPage()
    return
  }

  if (path === '/checkout') {
    await renderPublicCheckoutPage()
    return
  }

  if (path === '/blog' || path === '/blog/' || path.startsWith('/blog/')) {
    await renderPublicBlogPage()
    return
  }

  if (path.startsWith('/policies/')) {
    await renderPublicPolicyPage()
    return
  }

  if (path !== '/') {
    await renderPublicCmsPage()
    return
  }

  await applyHomeSeoMeta()
  await loadCmsSectionsFromD1('home')
}

setupStorefrontLanguageSelector()
applyStorefrontLanguage()
bootPublicRouting()
