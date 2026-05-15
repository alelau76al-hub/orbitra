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
const productCache = new Map()

function formatPriceCents(priceCents = 0) {
  return (Number(priceCents || 0) / 100).toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
  })
}

function cacheProducts(products = []) {
  products.forEach((product) => {
    if (product.slug) {
      productCache.set(product.slug, {
        ...product,
        variants: product.variants || [],
      })
    }
  })

  renderCart()
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
    showCartMessage('Prodotto non disponibile.')
    return
  }

  const variant = getProductVariant(product, variantId)
  const selectedVariantId = variant?.id || ''
  const stock = getEffectiveStock(product, variant)

  if (stock <= 0) {
    showCartMessage('Prodotto non disponibile.')
    openCart()
    return
  }

  const key = getCartItemKey(product.slug, selectedVariantId)
  const cart = getCart()
  const existing = cart.find((item) => item.key === key)
  const nextQuantity = (existing?.quantity || 0) + Number(quantity || 1)

  if (nextQuantity > stock) {
    showCartMessage('Quantità richiesta superiore allo stock disponibile.')
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
  showCartMessage(`${product.name} aggiunto al carrello.`)
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

  cacheProducts(data.products || [])

  return data.products || []
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
              <p>Dettagli prodotto non ancora caricati.</p>
            </div>
            <button type="button" class="cart-remove" data-cart-remove="${escapeCmsHtml(item.key)}">Rimuovi</button>
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
                ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}">`
                : '<span>Prodotto</span>'
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

          <button type="button" class="cart-remove" data-cart-remove="${escapeCmsHtml(item.key)}">Rimuovi</button>
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
    return '<button class="btn primary" type="button" disabled>Non disponibile</button>'
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
      Aggiungi al carrello
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

document.addEventListener('click', (event) => {
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
    showCartMessage('Aggiungi almeno un prodotto prima del checkout.')
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
            ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}">`
            : '<span>Prodotto</span>'
        }
      </a>

      <h3><a href="${productHref}">${escapeCmsHtml(product.name)}</a></h3>
      <p>${escapeCmsHtml(product.description || '')}</p>

      <div class="store-meta">
        <strong>${formatPriceCents(priceCents)}</strong>
        <span>Stock: ${stock}</span>
      </div>

      ${
        product.variants?.length
          ? `<p class="variant-summary">${product.variants.length} varianti disponibili</p>`
          : ''
      }

      <div class="store-actions">
        <a class="btn ghost" href="${productHref}">Dettagli</a>
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
        container.textContent = 'Nessun prodotto disponibile.'
      })
      return
    }

    const products = data.products || []
    cacheProducts(products)

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
        grid.textContent = 'Nessun prodotto disponibile.'
        return
      }

      grid.innerHTML = visibleProducts.map(renderProductCard).join('')
    })

    document.querySelectorAll('[data-featured-product]').forEach((target) => {
      const productSlug = target.dataset.featuredProduct || ''
      const buttonText = target.dataset.buttonText || 'Scopri il prodotto'
      const buttonUrl = target.dataset.buttonUrl || '#'

      const product = productSlug
        ? products.find((item) => item.slug === productSlug)
        : products[0]

      if (!product) {
        target.textContent = 'Prodotto non trovato.'
        return
      }

      target.innerHTML = `
        <article class="cms-featured-product-card">
          <div class="store-image">
            ${
              product.image_url
                ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}">`
                : '🚀'
            }
          </div>

          <div>
            <h3>${escapeCmsHtml(product.name)}</h3>
            <p>${escapeCmsHtml(product.description || '')}</p>

            <div class="store-meta">
              <strong>${(product.price_cents / 100).toLocaleString('it-IT', {
                style: 'currency',
                currency: 'EUR',
              })}</strong>
              <span>Stock: ${product.stock}</span>
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
      container.textContent = 'Errore caricamento prodotti.'
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
        grid.textContent = 'Nessuna collezione disponibile.'
      })
      return
    }

    const html = data.collections
      .map(
        (collection) => `
          <article class="store-card cms-collection-card">
            <div class="store-image">
              ${
                collection.image_url
                  ? `<img src="${escapeCmsHtml(collection.image_url)}" alt="${escapeCmsHtml(collection.name)}">`
                  : '🪐'
              }
            </div>

            <h3>${escapeCmsHtml(collection.name)}</h3>
            <p>${escapeCmsHtml(collection.description || '')}</p>

            <a class="btn primary" href="/collections/${escapeCmsHtml(collection.slug)}">
              Vedi collezione
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
      grid.textContent = 'Errore caricamento collezioni.'
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
  hydrateCollectionGrids()
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

    cacheProducts(productsData.products || [])

    if (products.length === 0) {
      container.textContent = 'Nessun prodotto disponibile in questa collezione.'
      return
    }

    container.innerHTML = products.map(renderProductCard).join('')
  } catch (error) {
    title.textContent = 'Errore caricamento collezione'
    intro.textContent = 'Non è stato possibile caricare questa pagina.'
    container.textContent = ''
  }
}

function updateProductPageVariant(select) {
  const product = productCache.get(select.dataset.productSlug)
  if (!product) return

  const variant = getProductVariant(product, select.value)
  const priceTarget = document.querySelector('#productPagePrice')
  const stockTarget = document.querySelector('#productPageStock')
  const addButton = document.querySelector('#productAddToCartButton')
  const stock = getEffectiveStock(product, variant)

  if (priceTarget) {
    priceTarget.textContent = formatPriceCents(getEffectivePriceCents(product, variant))
  }

  if (stockTarget) {
    stockTarget.textContent = `Stock: ${stock}`
  }

  if (addButton) {
    addButton.dataset.variantId = variant?.id || ''
    addButton.disabled = stock <= 0
    addButton.textContent = stock <= 0 ? 'Non disponibile' : 'Aggiungi al carrello'
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
        <p class="eyebrow">Prodotto</p>
        <h2>Caricamento prodotto...</h2>
        <p>Stiamo recuperando i dettagli dal catalogo.</p>
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

    const products = productsData.products || []
    cacheProducts(products)

    const product = products.find((item) => item.slug === productSlug)

    if (!product) {
      main.innerHTML = `
        <section class="section product-detail-empty">
          <p class="eyebrow">Prodotto</p>
          <h1>Prodotto non trovato</h1>
          <p>Questo prodotto non esiste o non è più disponibile.</p>
          <a class="btn primary" href="/#shop">Torna allo shop</a>
        </section>
      `
      return
    }

    const collection = (collectionsData.collections || []).find(
      (item) => item.slug === product.collection_slug,
    )
    const defaultVariant = getDefaultVariant(product)
    const priceCents = getEffectivePriceCents(product, defaultVariant)
    const stock = getEffectiveStock(product, defaultVariant)

    main.innerHTML = `
      <section class="section product-detail">
        <div class="product-detail-media">
          ${
            product.image_url
              ? `<img src="${escapeCmsHtml(product.image_url)}" alt="${escapeCmsHtml(product.name)}">`
              : '<span>Prodotto senza immagine</span>'
          }
        </div>

        <div class="product-detail-info">
          <p class="eyebrow">${escapeCmsHtml(product.category || 'Prodotto')}</p>
          <h1>${escapeCmsHtml(product.name)}</h1>
          <p>${escapeCmsHtml(product.description || 'Nessuna descrizione disponibile.')}</p>

          <div class="product-detail-price" id="productPagePrice">
            ${formatPriceCents(priceCents)}
          </div>

          <div class="product-detail-meta">
            <span id="productPageStock">Stock: ${stock}</span>
            <span>Categoria: ${escapeCmsHtml(product.category || 'Senza categoria')}</span>
            <span>
              Collezione:
              ${
                product.collection_slug
                  ? `<a href="/collections/${escapeCmsHtml(product.collection_slug)}">${escapeCmsHtml(collection?.name || product.collection_slug)}</a>`
                  : 'Senza collezione'
              }
            </span>
          </div>

          ${
            product.variants?.length
              ? `
                <label class="product-variant-field">
                  Variante
                  <select id="productVariantSelect" data-product-slug="${escapeCmsHtml(product.slug)}">
                    ${product.variants
                      .map(
                        (variant) => `
                          <option value="${variant.id}" ${defaultVariant?.id === variant.id ? 'selected' : ''}>
                            ${escapeCmsHtml(variant.option_name)}: ${escapeCmsHtml(variant.option_value)}
                            ${variant.sku ? ` · ${escapeCmsHtml(variant.sku)}` : ''}
                          </option>
                        `,
                      )
                      .join('')}
                  </select>
                </label>
              `
              : ''
          }

          <label class="product-quantity-field">
            Quantità
            <input id="productQuantity" type="number" min="1" value="1">
          </label>

          ${renderAddToCartButton(
            product,
            defaultVariant,
            'id="productAddToCartButton" data-cart-quantity-input="#productQuantity"',
          )}
        </div>
      </section>
    `
  } catch (error) {
    main.innerHTML = `
      <section class="section product-detail-empty">
        <p class="eyebrow">Prodotto</p>
        <h1>Errore caricamento prodotto</h1>
        <p>Non è stato possibile recuperare questo prodotto.</p>
        <a class="btn primary" href="/#shop">Torna allo shop</a>
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

function renderCheckoutSummary(items, shippingMethods, selectedHandle) {
  const subtotalCents = calculateCartSubtotal(items)
  const shipping = calculateShippingCost(shippingMethods, selectedHandle, subtotalCents)
  const totalCents = subtotalCents + shipping.shipping_cents
  const subtotalTarget = document.querySelector('#checkoutSubtotal')
  const shippingTarget = document.querySelector('#checkoutShipping')
  const totalTarget = document.querySelector('#checkoutTotal')

  if (subtotalTarget) subtotalTarget.textContent = formatPriceCents(subtotalCents)
  if (shippingTarget) shippingTarget.textContent = formatPriceCents(shipping.shipping_cents)
  if (totalTarget) totalTarget.textContent = formatPriceCents(totalCents)
}

function renderOrderConfirmation(order) {
  const main = document.querySelector('main')
  if (!main) return

  main.innerHTML = `
    <section class="section checkout-confirmation">
      <p class="eyebrow">Ordine creato</p>
      <h1>Grazie, ordine #${escapeCmsHtml(order.id)} ricevuto.</h1>
      <p>
        Stato pagamento: ${escapeCmsHtml(order.payment_status)}.
        Stato ordine: ${escapeCmsHtml(order.order_status)}.
      </p>

      <div class="checkout-confirmation-box">
        <span>Totale ordine</span>
        <strong>${formatPriceCents(order.total_cents)}</strong>
        <small>Metodo pagamento: ${escapeCmsHtml(order.payment_method || 'manual')}</small>
      </div>

      <a class="btn primary" href="/">Torna al sito</a>
    </section>
  `
}

async function submitCheckoutForm(event, shippingMethods, detailedItems) {
  event.preventDefault()

  const form = event.currentTarget
  const message = document.querySelector('#checkoutMessage')

  if (!form.reportValidity()) return

  if (getCart().length === 0) {
    if (message) message.textContent = 'Il carrello è vuoto.'
    return
  }

  const formData = new FormData(form)
  const payload = {
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
    items: getCart().map((item) => ({
      productSlug: item.productSlug,
      variantId: item.variantId,
      quantity: item.quantity,
    })),
  }

  if (message) message.textContent = 'Creazione ordine in corso...'

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
      if (message) message.textContent = data.message || 'Errore creazione ordine.'
      renderCheckoutSummary(detailedItems, shippingMethods, payload.shipping_method)
      return
    }

    clearCart()
    closeCart()
    renderOrderConfirmation(data.order)
  } catch {
    if (message) message.textContent = 'Errore di connessione durante il checkout.'
  }
}

async function renderPublicCheckoutPage() {
  const path = window.location.pathname
  if (path !== '/checkout') return

  const main = document.querySelector('main')
  if (!main) return

  main.innerHTML = `
    <section class="section checkout-page">
      <div class="section-head reveal visible">
        <p class="eyebrow">Checkout</p>
        <h2>Caricamento checkout...</h2>
        <p>Stiamo preparando riepilogo, spedizione e pagamento.</p>
      </div>
    </section>
  `

  try {
    await loadProductsForCart()
    const detailedItems = getDetailedCartItems()

    if (getCart().length === 0 || detailedItems.length === 0) {
      main.innerHTML = `
        <section class="section checkout-empty">
          <p class="eyebrow">Checkout</p>
          <h1>Il carrello è vuoto</h1>
          <p>Aggiungi almeno un prodotto prima di completare l'ordine.</p>
          <a class="btn primary" href="/#shop">Vai allo shop</a>
        </section>
      `
      return
    }

    const shippingMethods = await loadShippingMethods()
    const subtotalCents = calculateCartSubtotal(detailedItems)
    const methods = shippingMethods.length
      ? shippingMethods
      : [
          {
            handle: 'standard',
            name: 'Spedizione standard',
            description: 'Metodo standard disponibile come fallback.',
            price_cents: 990,
            free_over_cents: null,
          },
        ]
    const availableMethods = getAvailableShippingMethods(methods, subtotalCents)
    const defaultMethod = availableMethods[0] || methods[0]

    main.innerHTML = `
      <section class="section checkout-page">
        <div class="section-head reveal visible">
          <p class="eyebrow">Checkout</p>
          <h2>Completa l'ordine.</h2>
          <p>Pagamento manuale o simulato. Nessuna transazione reale viene eseguita.</p>
        </div>

        <div class="checkout-layout">
          <form id="checkoutForm" class="checkout-form">
            <section>
              <h3>Dati cliente</h3>
              <label>Nome completo<input name="name" type="text" required></label>
              <label>Email<input name="email" type="email" required></label>
              <label>Telefono opzionale<input name="phone" type="tel"></label>
            </section>

            <section>
              <h3>Indirizzo spedizione</h3>
              <label>Indirizzo<input name="address_line1" type="text" required></label>
              <label>Città<input name="city" type="text" required></label>
              <label>CAP<input name="postal_code" type="text" required></label>
              <label>Paese<input name="country" type="text" value="Italia" required></label>
            </section>

            <section>
              <h3>Metodo spedizione</h3>
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
                            ${method.free_over_cents ? ` · sopra ${formatPriceCents(method.free_over_cents)}` : ''}
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
              <h3>Pagamento</h3>
              <label>
                Metodo pagamento
                <select name="payment_method">
                  <option value="manual">Pagamento manuale / pending</option>
                  <option value="test_paid">Pagamento simulato riuscito</option>
                  <option value="test_failed">Pagamento simulato fallito</option>
                </select>
              </label>
            </section>

            <button class="btn primary" type="submit">Crea ordine</button>
            <p id="checkoutMessage" class="checkout-message"></p>
          </form>

          <aside class="checkout-summary">
            <h3>Riepilogo</h3>
            <div class="checkout-items">
              ${detailedItems
                .map(
                  (item) => `
                    <article>
                      <div>
                        <strong>${escapeCmsHtml(item.product.name)}</strong>
                        ${item.variant ? `<span>${escapeCmsHtml(item.variant.option_name)}: ${escapeCmsHtml(item.variant.option_value)}</span>` : ''}
                        <small>Quantità: ${item.quantity}</small>
                      </div>
                      <b>${formatPriceCents(item.line_total_cents)}</b>
                    </article>
                  `,
                )
                .join('')}
            </div>

            <div class="checkout-totals">
              <span>Subtotale <strong id="checkoutSubtotal">${formatPriceCents(subtotalCents)}</strong></span>
              <span>Spedizione <strong id="checkoutShipping">€0</strong></span>
              <span class="grand-total">Totale <strong id="checkoutTotal">€0</strong></span>
            </div>
          </aside>
        </div>
      </section>
    `

    renderCheckoutSummary(detailedItems, methods, defaultMethod?.handle)

    document.querySelectorAll('input[name="shipping_method"]').forEach((input) => {
      input.addEventListener('change', () => {
        renderCheckoutSummary(detailedItems, methods, input.value)
      })
    })

    document
      .querySelector('#checkoutForm')
      ?.addEventListener('submit', (event) =>
        submitCheckoutForm(event, methods, detailedItems),
      )
  } catch {
    main.innerHTML = `
      <section class="section checkout-empty">
        <p class="eyebrow">Checkout</p>
        <h1>Checkout non disponibile</h1>
        <p>Non è stato possibile preparare il checkout.</p>
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

  if (path.startsWith('/products/')) {
    await renderPublicProductPage()
    return
  }

  if (path === '/checkout') {
    await renderPublicCheckoutPage()
    return
  }

  if (path !== '/') {
    await renderPublicCmsPage()
    return
  }

  await loadCmsSectionsFromD1('home')
}

bootPublicRouting()
