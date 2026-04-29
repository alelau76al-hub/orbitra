import './style.css'

const formatMoney = (value) =>
  new Intl.NumberFormat('it-IT', {
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
    <p>ORBITRA © 2026 — Space travel for the impossible generation.</p>
    <a href="#booking">Request launch access</a>
  </footer>
`

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

async function loadPublicMainMenu() {
  const menuContainer = document.querySelector('#mainMenuLinks')
  if (!menuContainer) return

  try {
    const response = await fetch('/api/menus?handle=main')
    const data = await response.json()

    if (!data.success || !data.menus?.[0]?.items?.length) {
      return
    }

    const menu = data.menus[0]

    menuContainer.innerHTML = menu.items
      .map(
        (item) => `
          <a href="${escapeCmsHtml(buildMenuItemUrl(item))}">
            ${escapeCmsHtml(item.label)}
          </a>
        `,
      )
      .join('')
  } catch (error) {
    console.error('Errore caricamento menu principale:', error)
  }
}

loadPublicMainMenu()

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
                  ? `<img src="${escapeCmsHtml(collection.image_url)}" alt="${escapeCmsHtml(collection.name)}">`
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

    container.innerHTML = data.products.map((product) => `
      <article class="store-card">
        <div class="store-image">
          ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}">` : '🚀'}
        </div>
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <div class="store-meta">
          <strong>${(product.price_cents / 100).toLocaleString('it-IT', {
            style: 'currency',
            currency: 'EUR'
          })}</strong>
          <span>Stock: ${product.stock}</span>
        </div>
        <button class="btn primary" type="button">Aggiungi al carrello</button>
      </article>
    `).join('')
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

async function hydrateProductGrids() {
  const grids = document.querySelectorAll('[data-products-grid]')
  if (grids.length === 0) return

  try {
    const response = await fetch('/api/products')
    const data = await response.json()

    if (!data.success || data.products.length === 0) {
      grids.forEach((grid) => {
        grid.textContent = 'Nessun prodotto disponibile.'
      })
      return
    }

    const html = data.products
      .map(
        (product) => `
          <article class="store-card">
            <div class="store-image">
              ${product.image_url ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}">` : '🚀'}
            </div>
            <h3>${escapeCmsHtml(product.name)}</h3>
            <p>${escapeCmsHtml(product.description || '')}</p>
            <div class="store-meta">
              <strong>${(product.price_cents / 100).toLocaleString('it-IT', {
                style: 'currency',
                currency: 'EUR',
              })}</strong>
              <span>Stock: ${product.stock}</span>
            </div>
            <button class="btn primary" type="button">Aggiungi al carrello</button>
          </article>
        `,
      )
      .join('')

    grids.forEach((grid) => {
      grid.innerHTML = html
    })
  } catch {
    grids.forEach((grid) => {
      grid.textContent = 'Errore caricamento prodotti.'
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
  const pageSlug = getCurrentPublicPageSlug()
  const isHome = pageSlug === 'home'

  const heroSection = sections.find((section) => section.type === 'hero')

  if (isHome && heroSection) {
    applyHeroPreview(heroSection.data)
  }

  const container = getCmsContainer()

  container.innerHTML = sections
    .filter((section) => !(isHome && section.type === 'hero'))
    .map(renderCmsSection)
    .join('')

  hydrateProductGrids()
}

async function loadCmsSectionsFromD1(pageSlug = getCurrentPublicPageSlug()) {
  if (!pageSlug) return

  try {
    const response = await fetch(
      `/api/sections?page_slug=${encodeURIComponent(pageSlug)}`,
    )
    const data = await response.json()

    if (!data.success) return

    renderCmsSections(data.sections)
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
        <p class="eyebrow">Collezione</p>
        <h2>Caricamento collezione...</h2>
        <p>Stiamo recuperando prodotti e contenuti dal CMS.</p>
      </div>

      <div id="collectionProducts" class="store-grid">
        Caricamento prodotti...
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

    const collection = collectionsData.collections?.find(
      (item) => item.slug === collectionSlug,
    )

    if (!collection) {
      title.textContent = 'Collezione non trovata'
      intro.textContent = 'Questa collezione non esiste o non è più attiva.'
      container.textContent = ''
      return
    }

    title.textContent = collection.name
    intro.textContent =
      collection.description || 'Prodotti selezionati da questa collezione.'

    const products = (productsData.products || []).filter(
      (product) => product.collection_slug === collection.slug,
    )

    if (products.length === 0) {
      container.textContent = 'Nessun prodotto disponibile in questa collezione.'
      return
    }

    container.innerHTML = products
      .map(
        (product) => `
          <article class="store-card">
            <div class="store-image">
              ${
                product.image_url
                  ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}">`
                  : '🚀'
              }
            </div>

            <h3>${escapeCmsHtml(product.name)}</h3>
            <p>${escapeCmsHtml(product.description || '')}</p>

            <div class="store-meta">
              <strong>${(product.price_cents / 100).toLocaleString('it-IT', {
                style: 'currency',
                currency: 'EUR',
              })}</strong>
              <span>Stock: ${product.stock}</span>
            </div>

            <button class="btn primary" type="button">Aggiungi al carrello</button>
          </article>
        `,
      )
      .join('')
  } catch (error) {
    title.textContent = 'Errore caricamento collezione'
    intro.textContent = 'Non è stato possibile caricare questa pagina.'
    container.textContent = ''
  }
}

async function renderPublicCmsPage() {
  const path = window.location.pathname

  if (path === '/') return
  if (path.startsWith('/collections/')) return
  if (path.startsWith('/products/')) return
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

    const page = data.pages.find((item) => item.slug === pageSlug)

    if (!page) {
      title.textContent = 'Pagina non trovata'
      intro.textContent = 'Questa pagina non esiste nel CMS.'
      return
    }

    title.textContent = page.title
    intro.textContent = 'Contenuti caricati dal CMS custom Orbitra.'

    await loadCmsSectionsFromD1(page.slug)
  } catch (error) {
    title.textContent = 'Errore caricamento pagina'
    intro.textContent = 'Non è stato possibile caricare questa pagina.'
  }
}

async function bootPublicRouting() {
  const path = window.location.pathname

  if (path.startsWith('/collections/')) {
    await renderPublicCollectionPage()
    return
  }

  if (path !== '/') {
    await renderPublicCmsPage()
    return
  }

  await loadCmsSectionsFromD1('home')
}

bootPublicRouting()