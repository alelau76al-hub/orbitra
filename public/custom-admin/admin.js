const productsList = document.querySelector('#productsList')
const productForm = document.querySelector('#productForm')
const message = document.querySelector('#message')
const refreshButton = document.querySelector('#refreshButton')
const formTitle = document.querySelector('#formTitle')
const submitButton = document.querySelector('#submitButton')
const cancelEdit = document.querySelector('#cancelEdit')

function formatMoney(priceCents) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceCents / 100)
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function resetForm() {
  productForm.reset()
  document.querySelector('#productId').value = ''
  formTitle.textContent = 'Aggiungi prodotto'
  submitButton.textContent = 'Salva prodotto'
  cancelEdit.hidden = true
  message.textContent = ''
}

function fillForm(product) {
  document.querySelector('#productId').value = product.id
  document.querySelector('#name').value = product.name || ''
  document.querySelector('#slug').value = product.slug || ''
  document.querySelector('#description').value = product.description || ''
  document.querySelector('#price').value = product.price_cents / 100
  document.querySelector('#image_url').value = product.image_url || ''
  renderProductCollectionOptions(product.collection_slug || '')
  document.querySelector('#category').value = product.category || ''
  document.querySelector('#stock').value = product.stock || 0

  formTitle.textContent = 'Modifica prodotto'
  submitButton.textContent = 'Aggiorna prodotto'
  cancelEdit.hidden = false

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function getFormProduct() {
  return {
    id: document.querySelector('#productId').value,
    name: document.querySelector('#name').value.trim(),
    slug: document.querySelector('#slug').value.trim(),
    description: document.querySelector('#description').value.trim(),
    price_cents: Math.round(Number(document.querySelector('#price').value) * 100),
    image_url: document.querySelector('#image_url').value.trim(),
    collection_slug: document.querySelector('#collection_slug').value.trim(),
    category: document.querySelector('#category').value.trim(),
    stock: Number(document.querySelector('#stock').value),
  }
}

async function loadProducts() {
  productsList.textContent = 'Caricamento prodotti...'

  try {
    const response = await fetch('/api/products')
    const data = await response.json()

    if (!data.success) {
      productsList.textContent = 'Errore nel caricamento prodotti.'
      return
    }

    if (data.products.length === 0) {
      productsList.textContent = 'Nessun prodotto trovato.'
      return
    }

    productsList.innerHTML = data.products
      .map(
        (product) => `
          <article class="product-item">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description || 'Nessuna descrizione')}</p>

            <div class="meta">
              <span>${formatMoney(product.price_cents)}</span>
              <span>Stock: ${product.stock}</span>
              <span>${escapeHtml(product.category || 'Senza categoria')}</span>
              <span>${escapeHtml(product.collection_slug || 'Senza collezione')}</span>
            </div>

            <div class="product-actions">
              <button type="button" data-edit="${product.id}">Modifica</button>
              <button type="button" class="danger" data-disable="${product.id}">Disattiva</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = data.products.find((item) => item.id === Number(button.dataset.edit))
        fillForm(product)
      })
    })

    document.querySelectorAll('[data-disable]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm('Vuoi disattivare questo prodotto?')
        if (!confirmed) return

        const response = await fetch('/api/admin/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.disable),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || 'Errore durante la disattivazione.')
          return
        }

        loadProducts()
      })
    })
  } catch (error) {
    productsList.textContent = 'Errore di connessione alla API.'
  }
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  message.textContent = 'Salvataggio in corso...'

  const product = getFormProduct()
  const isEditing = Boolean(product.id)

  try {
    const response = await fetch('/api/admin/products', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    const data = await response.json()

    if (!data.success) {
      message.textContent = data.message || 'Errore nel salvataggio.'
      return
    }

    message.textContent = isEditing
      ? 'Prodotto aggiornato correttamente.'
      : 'Prodotto salvato correttamente.'

    resetForm()
    loadProducts()
  } catch (error) {
    message.textContent = 'Errore di connessione.'
  }
})

cancelEdit.addEventListener('click', resetForm)
refreshButton.addEventListener('click', loadProducts)

loadProducts()

// ===============================
// COLLEZIONI
// ===============================

const collectionsList = document.querySelector('#collectionsList')
const collectionForm = document.querySelector('#collectionForm')
const collectionMessage = document.querySelector('#collectionMessage')
const refreshCollectionsButton = document.querySelector('#refreshCollectionsButton')
const collectionFormTitle = document.querySelector('#collectionFormTitle')
const collectionSubmitButton = document.querySelector('#collectionSubmitButton')
const cancelCollectionEdit = document.querySelector('#cancelCollectionEdit')
const productCollectionSelect = document.querySelector('#collection_slug')

let collectionsCache = []

function renderProductCollectionOptions(selectedValue = '') {
  productCollectionSelect.innerHTML = `
    <option value="">Senza collezione</option>
    ${collectionsCache
      .map(
        (collection) => `
          <option value="${escapeHtml(collection.slug)}">
            ${escapeHtml(collection.name)}
          </option>
        `,
      )
      .join('')}
  `

  productCollectionSelect.value = selectedValue
}

function resetCollectionForm() {
  collectionForm.reset()
  document.querySelector('#collectionId').value = ''
  collectionFormTitle.textContent = 'Aggiungi collezione'
  collectionSubmitButton.textContent = 'Salva collezione'
  cancelCollectionEdit.hidden = true
  collectionMessage.textContent = ''
}

function fillCollectionForm(collection) {
  document.querySelector('#collectionId').value = collection.id
  document.querySelector('#collectionName').value = collection.name || ''
  document.querySelector('#collectionSlug').value = collection.slug || ''
  document.querySelector('#collectionDescription').value = collection.description || ''
  document.querySelector('#collectionImageUrl').value = collection.image_url || ''

  collectionFormTitle.textContent = 'Modifica collezione'
  collectionSubmitButton.textContent = 'Aggiorna collezione'
  cancelCollectionEdit.hidden = false
}

function getFormCollection() {
  return {
    id: document.querySelector('#collectionId').value,
    name: document.querySelector('#collectionName').value.trim(),
    slug: document.querySelector('#collectionSlug').value.trim(),
    description: document.querySelector('#collectionDescription').value.trim(),
    image_url: document.querySelector('#collectionImageUrl').value.trim(),
  }
}

async function loadCollections() {
  collectionsList.textContent = 'Caricamento collezioni...'

  try {
    const response = await fetch('/api/admin/collections')
    const data = await response.json()

    if (!data.success) {
      collectionsList.textContent = 'Errore nel caricamento collezioni.'
      return
    }

    collectionsCache = data.collections || []
    renderProductCollectionOptions(document.querySelector('#collection_slug').value)

    if (data.collections.length === 0) {
      collectionsList.textContent = 'Nessuna collezione trovata.'
      return
    }

    collectionsList.innerHTML = data.collections
      .map(
        (collection) => `
          <article class="product-item">
            <h3>${escapeHtml(collection.name)}</h3>
            <p>${escapeHtml(collection.description || 'Nessuna descrizione')}</p>

            <div class="meta">
              <span>Slug: ${escapeHtml(collection.slug)}</span>
              <span>ID: ${collection.id}</span>
            </div>

            <div class="product-actions">
              <button type="button" data-edit-collection="${collection.id}">Modifica</button>
              <button type="button" class="danger" data-delete-collection="${collection.id}">Elimina</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-collection]').forEach((button) => {
      button.addEventListener('click', () => {
        const collection = data.collections.find(
          (item) => item.id === Number(button.dataset.editCollection),
        )

        fillCollectionForm(collection)
      })
    })

    document.querySelectorAll('[data-delete-collection]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm('Vuoi eliminare questa collezione?')
        if (!confirmed) return

        const response = await fetch('/api/admin/collections', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.deleteCollection),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || 'Errore durante eliminazione collezione.')
          return
        }

        resetCollectionForm()
        loadCollections()
      })
    })
  } catch (error) {
    collectionsList.textContent = 'Errore di connessione alla API collezioni.'
  }
}

collectionForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  collectionMessage.textContent = 'Salvataggio in corso...'

  const collection = getFormCollection()
  const isEditing = Boolean(collection.id)

  try {
    const response = await fetch('/api/admin/collections', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collection),
    })

    const data = await response.json()

    if (!data.success) {
      collectionMessage.textContent = data.message || 'Errore nel salvataggio.'
      return
    }

    collectionMessage.textContent = isEditing
      ? 'Collezione aggiornata correttamente.'
      : 'Collezione salvata correttamente.'

    resetCollectionForm()
    loadCollections()
    loadMenuResources()
  } catch (error) {
    collectionMessage.textContent = 'Errore di connessione.'
  }
})

cancelCollectionEdit.addEventListener('click', resetCollectionForm)
refreshCollectionsButton.addEventListener('click', loadCollections)

loadCollections()

// ===============================
// PAGINE
// ===============================

const pagesList = document.querySelector('#pagesList')
const pageForm = document.querySelector('#pageForm')
const pageMessage = document.querySelector('#pageMessage')
const refreshPagesButton = document.querySelector('#refreshPagesButton')
const pageFormTitle = document.querySelector('#pageFormTitle')
const pageSubmitButton = document.querySelector('#pageSubmitButton')
const cancelPageEdit = document.querySelector('#cancelPageEdit')

function resetPageForm() {
  pageForm.reset()
  document.querySelector('#pageId').value = ''
  pageFormTitle.textContent = 'Aggiungi pagina'
  pageSubmitButton.textContent = 'Salva pagina'
  cancelPageEdit.hidden = true
  pageMessage.textContent = ''
}

function fillPageForm(page) {
  document.querySelector('#pageId').value = page.id
  document.querySelector('#pageTitle').value = page.title || ''
  document.querySelector('#pageSlug').value = page.slug || ''

  pageFormTitle.textContent = 'Modifica pagina'
  pageSubmitButton.textContent = 'Aggiorna pagina'
  cancelPageEdit.hidden = false
}

function getFormPage() {
  return {
    id: document.querySelector('#pageId').value,
    title: document.querySelector('#pageTitle').value.trim(),
    slug: document.querySelector('#pageSlug').value.trim(),
  }
}

async function loadPages() {
  pagesList.textContent = 'Caricamento pagine...'

  try {
    const response = await fetch('/api/admin/pages')
    const data = await response.json()

    if (!data.success) {
      pagesList.textContent = 'Errore nel caricamento pagine.'
      return
    }

    if (data.pages.length === 0) {
      pagesList.textContent = 'Nessuna pagina trovata.'
      return
    }

    pagesList.innerHTML = data.pages
      .map(
        (page) => `
          <article class="product-item">
            <h3>${escapeHtml(page.title)}</h3>

            <div class="meta">
              <span>Slug: ${escapeHtml(page.slug)}</span>
              <span>ID: ${page.id}</span>
            </div>

            <div class="product-actions">
              <button type="button" data-edit-page="${page.id}">Modifica</button>

              <button type="button" data-edit-page-sections="${escapeHtml(page.slug)}">
                Modifica sezioni
              </button>

              ${
                page.slug === 'home'
                  ? '<button type="button" class="secondary" disabled>Homepage protetta</button>'
                  : `<button type="button" class="danger" data-delete-page="${page.id}">Elimina</button>`
              }
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-page]').forEach((button) => {
      button.addEventListener('click', () => {
        const page = data.pages.find((item) => item.id === Number(button.dataset.editPage))
        fillPageForm(page)
      })
    })

    document.querySelectorAll('[data-edit-page-sections]').forEach((button) => {
      button.addEventListener('click', async () => {
        currentEditorPageSlug = button.dataset.editPageSections || 'home'

        if (editorPageSelect) {
          editorPageSelect.value = currentEditorPageSlug
        }

        selectedSectionId = null
        updateEditorPreviewUrl()
        await loadSections()

        window.location.hash = 'editor'
      })
    })

    document.querySelectorAll('[data-delete-page]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm('Vuoi eliminare questa pagina?')
        if (!confirmed) return

        const response = await fetch('/api/admin/pages', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.deletePage),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || 'Errore durante eliminazione pagina.')
          return
        }

        resetPageForm()
        loadPages()
        loadEditorPages()
        loadMenuResources()
      })
    })
  } catch (error) {
    pagesList.textContent = 'Errore di connessione alla API pagine.'
  }
}

pageForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  pageMessage.textContent = 'Salvataggio in corso...'

  const page = getFormPage()
  const isEditing = Boolean(page.id)

  try {
    const response = await fetch('/api/admin/pages', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(page),
    })

    const data = await response.json()

    if (!data.success) {
      pageMessage.textContent = data.message || 'Errore nel salvataggio.'
      return
    }

    pageMessage.textContent = isEditing
      ? 'Pagina aggiornata correttamente.'
      : 'Pagina salvata correttamente.'

    resetPageForm()
    loadPages()
    loadEditorPages()
    loadMenuResources()
  } catch (error) {
    pageMessage.textContent = 'Errore di connessione.'
  }
})

cancelPageEdit.addEventListener('click', resetPageForm)
refreshPagesButton.addEventListener('click', loadPages)

loadPages()

// ===============================
// NAVIGAZIONE ADMIN A VISTE
// ===============================

function setupAdminViews() {
  const views = document.querySelectorAll('[data-admin-view]')
  const hubLinks = document.querySelectorAll('.hub-card')

  function openViewFromHash() {
    const hash = window.location.hash.replace('#', '') || 'editor'
    const viewExists = document.querySelector(`[data-admin-view="${hash}"]`)
    const activeView = viewExists ? hash : 'editor'

    views.forEach((view) => {
      view.hidden = view.dataset.adminView !== activeView
    })

    const catalogoViews = ['prodotti', 'collezioni', 'stock']
    const contenutoViews = ['pagine', 'menu', 'media', 'seo']

    const activeHubHash = contenutoViews.includes(activeView)
      ? '#contenuto'
      : catalogoViews.includes(activeView)
        ? '#catalogo'
        : `#${activeView}`

    hubLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === activeHubHash)
    })

    const target = document.querySelector(`[data-admin-view="${activeView}"]`)
    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  window.addEventListener('hashchange', openViewFromHash)
  openViewFromHash()
}

setupAdminViews()

// ===============================
// MENU
// ===============================

const menuItemForm = document.querySelector('#menuItemForm')
const menuSelect = document.querySelector('#menuSelect')
const menuItemLabel = document.querySelector('#menuItemLabel')
const menuLinkType = document.querySelector('#menuLinkType')
const menuTargetSlug = document.querySelector('#menuTargetSlug')
const menuItemUrl = document.querySelector('#menuItemUrl')
const menuMessage = document.querySelector('#menuMessage')
const menusList = document.querySelector('#menusList')
const refreshMenusButton = document.querySelector('#refreshMenusButton')

let menusCache = []
let pagesCache = []
let productsCache = []

async function loadMenuResources() {
  try {
    const [pagesResponse, collectionsResponse, productsResponse] = await Promise.all([
      fetch('/api/admin/pages'),
      fetch('/api/admin/collections'),
      fetch('/api/products'),
    ])

    const pagesData = await pagesResponse.json()
    const collectionsData = await collectionsResponse.json()
    const productsData = await productsResponse.json()

    pagesCache = pagesData.success ? pagesData.pages : []
    collectionsCache = collectionsData.success ? collectionsData.collections : []
    productsCache = productsData.success ? productsData.products : []

    renderMenuTargetOptions()
  } catch {
    menuMessage.textContent = 'Errore caricamento destinazioni menu.'
  }
}

function renderMenuSelect() {
  menuSelect.innerHTML = menusCache
    .map(
      (menu) => `
        <option value="${menu.id}">
          ${escapeHtml(menu.name)}
        </option>
      `,
    )
    .join('')
}

function renderMenuTargetOptions() {
  const type = menuLinkType.value

  if (type === 'url') {
    menuTargetSlug.innerHTML = '<option value="">Usa il campo URL esterno</option>'
    menuTargetSlug.disabled = true
    menuItemUrl.disabled = false
    return
  }

  menuTargetSlug.disabled = false
  menuItemUrl.disabled = true
  menuItemUrl.value = ''

  let items = []

  if (type === 'page') {
    items = pagesCache.map((page) => ({
      label: page.title,
      value: page.slug,
    }))
  }

  if (type === 'collection') {
    items = collectionsCache.map((collection) => ({
      label: collection.name,
      value: collection.slug,
    }))
  }

  if (type === 'product') {
    items = productsCache.map((product) => ({
      label: product.name,
      value: product.slug,
    }))
  }

  menuTargetSlug.innerHTML =
    '<option value="">Seleziona destinazione</option>' +
    items
      .map(
        (item) => `
          <option value="${escapeHtml(item.value)}">
            ${escapeHtml(item.label)}
          </option>
        `,
      )
      .join('')
}

async function loadMenus() {
  menusList.textContent = 'Caricamento menu...'

  try {
    const response = await fetch('/api/admin/menus')
    const data = await response.json()

    if (!data.success) {
      menusList.textContent = 'Errore nel caricamento menu.'
      return
    }

    menusCache = data.menus || []
    renderMenuSelect()

    if (menusCache.length === 0) {
      menusList.textContent = 'Nessun menu trovato.'
      return
    }

    menusList.innerHTML = menusCache
      .map(
        (menu) => `
          <article class="product-item">
            <h3>${escapeHtml(menu.name)}</h3>

            <div class="meta">
              <span>Handle: ${escapeHtml(menu.handle)}</span>
              <span>ID: ${menu.id}</span>
              <span>Voci: ${menu.items.length}</span>
            </div>

            <div class="menu-items-list">
              ${
                menu.items.length === 0
                  ? '<p>Nessuna voce in questo menu.</p>'
                  : menu.items
                      .map(
                        (item) => `
                          <div class="menu-item-row">
                            <div>
                              <strong>${escapeHtml(item.label)}</strong>
                              <small>
                                ${escapeHtml(item.link_type)}
                                ${
                                  item.link_type === 'url'
                                    ? escapeHtml(item.url || '')
                                    : escapeHtml(item.target_slug || '')
                                }
                              </small>
                            </div>

                            <button
                              type="button"
                              class="danger"
                              data-delete-menu-item="${item.id}"
                            >
                              Elimina
                            </button>
                          </div>
                        `,
                      )
                      .join('')
              }
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-delete-menu-item]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm('Vuoi eliminare questa voce menu?')
        if (!confirmed) return

        const response = await fetch('/api/admin/menus', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'item',
            id: Number(button.dataset.deleteMenuItem),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || 'Errore eliminazione voce menu.')
          return
        }

        loadMenus()
      })
    })
  } catch {
    menusList.textContent = 'Errore di connessione alla API menu.'
  }
}

menuLinkType.addEventListener('change', renderMenuTargetOptions)

menuItemForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  menuMessage.textContent = 'Salvataggio voce menu...'

  const linkType = menuLinkType.value

  const payload = {
    type: 'item',
    menu_id: Number(menuSelect.value),
    label: menuItemLabel.value.trim(),
    link_type: linkType,
    target_slug: linkType === 'url' ? '' : menuTargetSlug.value,
    url: linkType === 'url' ? menuItemUrl.value.trim() : '',
  }

  try {
    const response = await fetch('/api/admin/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!data.success) {
      menuMessage.textContent = data.message || 'Errore salvataggio voce menu.'
      return
    }

    menuMessage.textContent = 'Voce menu salvata.'
    menuItemForm.reset()
    renderMenuTargetOptions()
    loadMenus()
  } catch {
    menuMessage.textContent = 'Errore di connessione.'
  }
})

refreshMenusButton.addEventListener('click', loadMenus)

loadMenuResources()
loadMenus()

// ===============================
// EDITOR SEZIONI
// ===============================

const sitePreview = document.querySelector('#sitePreview')
const editorPageSelect = document.querySelector('#editorPageSelect')
const sectionsList = document.querySelector('#sectionsList')
const sectionFields = document.querySelector('#sectionFields')
const selectedSectionTitle = document.querySelector('#selectedSectionTitle')
const saveSectionButton = document.querySelector('#saveSectionButton')
const addSectionButton = document.querySelector('#addSectionButton')
const newSectionType = document.querySelector('#newSectionType')
const sectionMessage = document.querySelector('#sectionMessage')

let pageSections = []
let selectedSectionId = null
let currentEditorPageSlug = 'home'

function getEditorPreviewUrl(pageSlug) {
  if (pageSlug === 'home') {
    return '/?preview=admin'
  }

  return `/${pageSlug}?preview=admin`
}

function updateEditorPreviewUrl() {
  const nextUrl = getEditorPreviewUrl(currentEditorPageSlug)

  if (sitePreview.getAttribute('src') !== nextUrl) {
    sitePreview.setAttribute('src', nextUrl)
  }
}

async function loadEditorPages() {
  try {
    const response = await fetch('/api/admin/pages')
    const data = await response.json()

    if (!data.success) return

    editorPageSelect.innerHTML = data.pages
      .map(
        (page) => `
          <option value="${escapeHtml(page.slug)}">
            ${escapeHtml(page.title)}
          </option>
        `,
      )
      .join('')

    editorPageSelect.value = currentEditorPageSlug
  } catch {
    sectionMessage.textContent = 'Errore caricamento pagine editor.'
  }
}

const sectionLabels = {
  hero: 'Hero',
  banner: 'Banner',
  text_image: 'Testo + immagine',

  brand_manifesto: 'Brand Manifesto',
  timeline_premium: 'Timeline Premium',
  process_steps: 'Process Steps',
  stats_numbers: 'Stats / Numeri',
  gallery_editorial: 'Gallery Editoriale',
  testimonials: 'Testimonials',
  featured_collection: 'Featured Collection',

  collection_grid: 'Griglia collezioni',
  featured_product: 'Featured Product',
  product_spotlight: 'Product Spotlight',
  product_carousel: 'Product Carousel',
  best_sellers: 'Best Sellers',
  new_arrivals: 'New Arrivals',

  trust_badges: 'Trust Badges',
  newsletter_signup: 'Newsletter Signup',
  promo_banner: 'Promo Banner',
  countdown_promo: 'Countdown Promo',

  logo_partners: 'Logo Partner / Clienti',
  press_mentions: 'Press / Media Mentions',
  awards_recognition: 'Awards / Riconoscimenti',
  team_section: 'Team Section',
  founder_section: 'Founder Section',
  services_grid: 'Services Grid',

  accordion_advanced: 'Accordion avanzato',
  tabs_section: 'Tabs Section',
  video_spotlight: 'Video Spotlight',
  full_width_image: 'Full-width Image',

  product_grid: 'Griglia prodotti',
  faq: 'FAQ',
  cta: 'CTA finale',
}

const fieldsByType = {
  hero: ['eyebrow', 'title', 'subtitle', 'button_text'],

  banner: ['title', 'text', 'button_text'],

  text_image: [
    'eyebrow',
    'title',
    'text',
    'image_url',
    'button_text',
    'button_url',
  ],

  brand_manifesto: [
    'eyebrow',
    'title',
    'text',
    'quote',
    'image_url',
    'button_text',
    'button_url',
  ],

  timeline_premium: [
    'eyebrow',
    'title',
    'subtitle',
    'step_1_year',
    'step_1_title',
    'step_1_text',
    'step_2_year',
    'step_2_title',
    'step_2_text',
    'step_3_year',
    'step_3_title',
    'step_3_text',
  ],

  process_steps: [
    'eyebrow',
    'title',
    'subtitle',
    'step_1_title',
    'step_1_text',
    'step_2_title',
    'step_2_text',
    'step_3_title',
    'step_3_text',
    'step_4_title',
    'step_4_text',
  ],

  stats_numbers: [
    'eyebrow',
    'title',
    'subtitle',
    'stat_1_value',
    'stat_1_label',
    'stat_2_value',
    'stat_2_label',
    'stat_3_value',
    'stat_3_label',
    'stat_4_value',
    'stat_4_label',
  ],

  gallery_editorial: [
    'eyebrow',
    'title',
    'subtitle',
    'image_1_url',
    'image_1_caption',
    'image_2_url',
    'image_2_caption',
    'image_3_url',
    'image_3_caption',
  ],

  testimonials: [
    'eyebrow',
    'title',
    'quote_1',
    'author_1',
    'role_1',
    'quote_2',
    'author_2',
    'role_2',
    'quote_3',
    'author_3',
    'role_3',
  ],

  featured_collection: [
    'eyebrow',
    'title',
    'subtitle',
    'collection_slug',
    'button_text',
    'button_url',
  ],

  collection_grid: [
    'eyebrow',
    'title',
    'subtitle',
  ],

  featured_product: [
    'eyebrow',
    'title',
    'subtitle',
    'product_slug',
    'button_text',
    'button_url',
  ],

  product_spotlight: [
    'eyebrow',
    'title',
    'text',
    'product_slug',
    'image_url',
    'button_text',
    'button_url',
  ],

  product_carousel: [
    'eyebrow',
    'title',
    'subtitle',
    'collection_slug',
  ],

  best_sellers: [
    'eyebrow',
    'title',
    'subtitle',
  ],

  new_arrivals: [
    'eyebrow',
    'title',
    'subtitle',
  ],

  trust_badges: [
    'eyebrow',
    'title',
    'badge_1_title',
    'badge_1_text',
    'badge_2_title',
    'badge_2_text',
    'badge_3_title',
    'badge_3_text',
    'badge_4_title',
    'badge_4_text',
  ],

  newsletter_signup: [
    'eyebrow',
    'title',
    'subtitle',
    'placeholder',
    'button_text',
    'privacy_text',
  ],

  promo_banner: [
    'eyebrow',
    'title',
    'text',
    'button_text',
    'button_url',
  ],

  countdown_promo: [
    'eyebrow',
    'title',
    'text',
    'target_date',
    'button_text',
    'button_url',
  ],

  logo_partners: [
    'eyebrow',
    'title',
    'subtitle',
    'logo_1_text',
    'logo_2_text',
    'logo_3_text',
    'logo_4_text',
    'logo_5_text',
  ],

  press_mentions: [
    'eyebrow',
    'title',
    'quote_1',
    'source_1',
    'quote_2',
    'source_2',
    'quote_3',
    'source_3',
  ],

  awards_recognition: [
    'eyebrow',
    'title',
    'award_1_title',
    'award_1_text',
    'award_2_title',
    'award_2_text',
    'award_3_title',
    'award_3_text',
  ],

  team_section: [
    'eyebrow',
    'title',
    'subtitle',
    'member_1_name',
    'member_1_role',
    'member_1_image_url',
    'member_2_name',
    'member_2_role',
    'member_2_image_url',
    'member_3_name',
    'member_3_role',
    'member_3_image_url',
  ],

  founder_section: [
    'eyebrow',
    'title',
    'text',
    'founder_name',
    'founder_role',
    'quote',
    'image_url',
  ],

  services_grid: [
    'eyebrow',
    'title',
    'subtitle',
    'service_1_title',
    'service_1_text',
    'service_2_title',
    'service_2_text',
    'service_3_title',
    'service_3_text',
    'service_4_title',
    'service_4_text',
  ],

  accordion_advanced: [
    'eyebrow',
    'title',
    'item_1_title',
    'item_1_text',
    'item_2_title',
    'item_2_text',
    'item_3_title',
    'item_3_text',
    'item_4_title',
    'item_4_text',
  ],

  tabs_section: [
    'eyebrow',
    'title',
    'tab_1_label',
    'tab_1_title',
    'tab_1_text',
    'tab_2_label',
    'tab_2_title',
    'tab_2_text',
    'tab_3_label',
    'tab_3_title',
    'tab_3_text',
  ],

  video_spotlight: [
    'eyebrow',
    'title',
    'text',
    'video_url',
    'poster_url',
    'button_text',
    'button_url',
  ],

  full_width_image: [
    'eyebrow',
    'title',
    'subtitle',
    'image_url',
    'caption',
  ],

  product_grid: ['eyebrow', 'title', 'subtitle'],

  faq: ['title', 'question', 'answer'],

  cta: ['title', 'text', 'button_text'],
}

const fieldLabels = {
  eyebrow: 'Eyebrow',
  title: 'Titolo',
  subtitle: 'Sottotitolo',
  text: 'Testo',
  quote: 'Citazione',
  image_url: 'URL immagine',
  button_text: 'Testo bottone',
  button_url: 'Link bottone',
  collection_slug: 'Slug collezione',
  product_slug: 'Slug prodotto',

  placeholder: 'Placeholder campo email',
  privacy_text: 'Testo privacy',
  target_date: 'Data fine countdown',
  video_url: 'URL video',
  poster_url: 'URL immagine anteprima video',
  caption: 'Caption',

  step_1_year: 'Step 1 - Anno',
  step_1_title: 'Step 1 - Titolo',
  step_1_text: 'Step 1 - Testo',
  step_2_year: 'Step 2 - Anno',
  step_2_title: 'Step 2 - Titolo',
  step_2_text: 'Step 2 - Testo',
  step_3_year: 'Step 3 - Anno',
  step_3_title: 'Step 3 - Titolo',
  step_3_text: 'Step 3 - Testo',
  step_4_title: 'Step 4 - Titolo',
  step_4_text: 'Step 4 - Testo',

  stat_1_value: 'Stat 1 - Valore',
  stat_1_label: 'Stat 1 - Etichetta',
  stat_2_value: 'Stat 2 - Valore',
  stat_2_label: 'Stat 2 - Etichetta',
  stat_3_value: 'Stat 3 - Valore',
  stat_3_label: 'Stat 3 - Etichetta',
  stat_4_value: 'Stat 4 - Valore',
  stat_4_label: 'Stat 4 - Etichetta',

  image_1_url: 'Immagine 1 - URL',
  image_1_caption: 'Immagine 1 - Caption',
  image_2_url: 'Immagine 2 - URL',
  image_2_caption: 'Immagine 2 - Caption',
  image_3_url: 'Immagine 3 - URL',
  image_3_caption: 'Immagine 3 - Caption',

  quote_1: 'Testimonianza / Citazione 1',
  author_1: 'Autore 1',
  role_1: 'Ruolo 1',
  quote_2: 'Testimonianza / Citazione 2',
  author_2: 'Autore 2',
  role_2: 'Ruolo 2',
  quote_3: 'Testimonianza / Citazione 3',
  author_3: 'Autore 3',
  role_3: 'Ruolo 3',

  badge_1_title: 'Badge 1 - Titolo',
  badge_1_text: 'Badge 1 - Testo',
  badge_2_title: 'Badge 2 - Titolo',
  badge_2_text: 'Badge 2 - Testo',
  badge_3_title: 'Badge 3 - Titolo',
  badge_3_text: 'Badge 3 - Testo',
  badge_4_title: 'Badge 4 - Titolo',
  badge_4_text: 'Badge 4 - Testo',

  logo_1_text: 'Logo 1 - Testo',
  logo_2_text: 'Logo 2 - Testo',
  logo_3_text: 'Logo 3 - Testo',
  logo_4_text: 'Logo 4 - Testo',
  logo_5_text: 'Logo 5 - Testo',

  source_1: 'Fonte 1',
  source_2: 'Fonte 2',
  source_3: 'Fonte 3',

  award_1_title: 'Award 1 - Titolo',
  award_1_text: 'Award 1 - Testo',
  award_2_title: 'Award 2 - Titolo',
  award_2_text: 'Award 2 - Testo',
  award_3_title: 'Award 3 - Titolo',
  award_3_text: 'Award 3 - Testo',

  member_1_name: 'Membro 1 - Nome',
  member_1_role: 'Membro 1 - Ruolo',
  member_1_image_url: 'Membro 1 - URL immagine',
  member_2_name: 'Membro 2 - Nome',
  member_2_role: 'Membro 2 - Ruolo',
  member_2_image_url: 'Membro 2 - URL immagine',
  member_3_name: 'Membro 3 - Nome',
  member_3_role: 'Membro 3 - Ruolo',
  member_3_image_url: 'Membro 3 - URL immagine',

  founder_name: 'Founder - Nome',
  founder_role: 'Founder - Ruolo',

  service_1_title: 'Servizio 1 - Titolo',
  service_1_text: 'Servizio 1 - Testo',
  service_2_title: 'Servizio 2 - Titolo',
  service_2_text: 'Servizio 2 - Testo',
  service_3_title: 'Servizio 3 - Titolo',
  service_3_text: 'Servizio 3 - Testo',
  service_4_title: 'Servizio 4 - Titolo',
  service_4_text: 'Servizio 4 - Testo',

  item_1_title: 'Item 1 - Titolo',
  item_1_text: 'Item 1 - Testo',
  item_2_title: 'Item 2 - Titolo',
  item_2_text: 'Item 2 - Testo',
  item_3_title: 'Item 3 - Titolo',
  item_3_text: 'Item 3 - Testo',
  item_4_title: 'Item 4 - Titolo',
  item_4_text: 'Item 4 - Testo',

  tab_1_label: 'Tab 1 - Etichetta',
  tab_1_title: 'Tab 1 - Titolo',
  tab_1_text: 'Tab 1 - Testo',
  tab_2_label: 'Tab 2 - Etichetta',
  tab_2_title: 'Tab 2 - Titolo',
  tab_2_text: 'Tab 2 - Testo',
  tab_3_label: 'Tab 3 - Etichetta',
  tab_3_title: 'Tab 3 - Titolo',
  tab_3_text: 'Tab 3 - Testo',

  question: 'Domanda',
  answer: 'Risposta',
}

function selectedSection() {
  return pageSections.find((section) => section.id === selectedSectionId)
}

function renderSelectedSection() {
  const section = selectedSection()

  if (!section) {
    selectedSectionTitle.textContent = 'Seleziona una sezione'
    sectionFields.innerHTML = '<p>Seleziona una sezione dalla lista.</p>'
    return
  }

  selectedSectionTitle.textContent = sectionLabels[section.type] || section.type

  const fields = fieldsByType[section.type] || []

  sectionFields.innerHTML = fields
    .map((field) => {
      const value = section.data?.[field] || ''

      return `
        <label>
          ${fieldLabels[field] || field}
          <textarea data-section-field="${field}">${escapeHtml(value)}</textarea>
        </label>
      `
    })
    .join('')

  document.querySelectorAll('[data-section-field]').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.dataset.sectionField

      section.data = {
        ...(section.data || {}),
        [field]: input.value,
      }

      updateSitePreview()
    })
  })
}

async function loadSections() {
  const response = await fetch(
    `/api/admin/section?page_slug=${encodeURIComponent(currentEditorPageSlug)}`,
  )
  const data = await response.json()

  if (!data.success) {
    sectionMessage.textContent = 'Errore caricamento sezioni.'
    return
  }

  pageSections = data.sections

  if (!selectedSectionId && pageSections.length > 0) {
    selectedSectionId = pageSections[0].id
  }

  renderSectionsList()
  renderSelectedSection()
  updateSitePreview()
}

function renderSectionsList() {
  sectionsList.innerHTML = pageSections
    .map(
      (section, index) => `
        <div class="section-row ${section.id === selectedSectionId ? 'active' : ''}">
          <button
            type="button"
            class="section-button"
            data-section-id="${section.id}"
          >
            ${sectionLabels[section.type] || section.type}
          </button>

          <div class="section-tools">
            <button type="button" data-up="${index}">↑</button>
            <button type="button" data-down="${index}">↓</button>
            <button type="button" class="danger" data-delete-section="${section.id}">×</button>
          </div>
        </div>
      `,
    )
    .join('')

  document.querySelectorAll('[data-section-id]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedSectionId = Number(button.dataset.sectionId)
      renderSectionsList()
      renderSelectedSection()
    })
  })

  document.querySelectorAll('[data-up]').forEach((button) => {
    button.addEventListener('click', async () => {
      const index = Number(button.dataset.up)
      if (index === 0) return

      const temp = pageSections[index]
      pageSections[index] = pageSections[index - 1]
      pageSections[index - 1] = temp

      await saveSectionOrder()
      renderSectionsList()
      updateSitePreview()
    })
  })

  document.querySelectorAll('[data-down]').forEach((button) => {
    button.addEventListener('click', async () => {
      const index = Number(button.dataset.down)
      if (index === pageSections.length - 1) return

      const temp = pageSections[index]
      pageSections[index] = pageSections[index + 1]
      pageSections[index + 1] = temp

      await saveSectionOrder()
      renderSectionsList()
      updateSitePreview()
    })
  })

  document.querySelectorAll('[data-delete-section]').forEach((button) => {
    button.addEventListener('click', async () => {
      const confirmed = confirm('Vuoi eliminare questa sezione?')
      if (!confirmed) return

      const id = Number(button.dataset.deleteSection)

      const response = await fetch('/api/admin/section', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (!data.success) {
        sectionMessage.textContent = data.message || 'Errore eliminazione sezione.'
        return
      }

      selectedSectionId = null
      await loadSections()
      sectionMessage.textContent = 'Sezione eliminata.'
    })
  })
}

async function saveSectionOrder() {
  await Promise.all(
    pageSections.map((section, index) =>
      fetch('/api/admin/section', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: section.id,
          sort_order: index,
        }),
      }),
    ),
  )
}

function updateSitePreview() {
  sitePreview.contentWindow?.postMessage(
    {
      type: 'ORBITRA_SECTIONS_PREVIEW',
      sections: pageSections,
    },
    window.location.origin,
  )
}

async function saveSelectedSection() {
  const section = selectedSection()
  if (!section) return

  sectionMessage.textContent = 'Salvataggio...'

  const response = await fetch('/api/admin/section', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: section.id,
      data: section.data,
    }),
  })

  const data = await response.json()
  sectionMessage.textContent = data.success
    ? 'Sezione salvata.'
    : 'Errore salvataggio.'
}

async function addSection() {
  sectionMessage.textContent = 'Aggiunta sezione...'

  const response = await fetch('/api/admin/section', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: newSectionType.value,
      page_slug: currentEditorPageSlug,
    }),
  })

  const data = await response.json()

  if (!data.success) {
    sectionMessage.textContent = data.message || 'Errore aggiunta sezione.'
    return
  }

  selectedSectionId = null
  await loadSections()
  sectionMessage.textContent = 'Sezione aggiunta.'
}

saveSectionButton.addEventListener('click', saveSelectedSection)
addSectionButton.addEventListener('click', addSection)
sitePreview.addEventListener('load', updateSitePreview)

editorPageSelect.addEventListener('change', async () => {
  currentEditorPageSlug = editorPageSelect.value || 'home'
  selectedSectionId = null
  updateEditorPreviewUrl()
  await loadSections()
})

loadEditorPages()
updateEditorPreviewUrl()
loadSections()