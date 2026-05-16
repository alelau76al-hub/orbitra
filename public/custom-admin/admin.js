const adminAuthGate = document.querySelector('#adminAuthGate')
const adminApp = document.querySelector('#adminApp')
const adminLoginForm = document.querySelector('#adminLoginForm')
const adminBootstrapForm = document.querySelector('#adminBootstrapForm')
const adminAuthIntro = document.querySelector('#adminAuthIntro')
const adminAuthMessage = document.querySelector('#adminAuthMessage')
const adminSessionBar = document.querySelector('#adminSessionBar')
const adminSessionName = document.querySelector('#adminSessionName')
const adminSessionRole = document.querySelector('#adminSessionRole')
const adminCurrentView = document.querySelector('#adminCurrentView')
const adminLogoutButton = document.querySelector('#adminLogoutButton')
const nativeFetch = window.fetch.bind(window)

function setupAdminLogoFallbacks() {
  document.querySelectorAll('[data-admin-logo]').forEach((logo) => {
    logo.addEventListener('error', () => {
      const fallbackSrc = logo.dataset.fallbackSrc

      if (fallbackSrc && logo.dataset.fallbackUsed !== 'true') {
        logo.dataset.fallbackUsed = 'true'
        logo.src = fallbackSrc
        return
      }

      logo.hidden = true
      const fallbackText = logo
        .closest('.admin-logo-lockup')
        ?.querySelector('.admin-logo-fallback')

      if (fallbackText) fallbackText.hidden = false
    })
  })
}

setupAdminLogoFallbacks()

let adminCurrentUser = null
let adminAllowProtectedFetches = false
let adminAuditObserver = null

const ADMIN_AUDIT_MESSAGE = 'Audit mode: modifiche disabilitate.'

function isProtectedAdminRequest(resource) {
  const rawUrl = typeof resource === 'string' ? resource : resource?.url || ''

  try {
    const url = new URL(rawUrl, window.location.origin)
    return (
      url.origin === window.location.origin &&
      url.pathname.startsWith('/api/admin/') &&
      !url.pathname.startsWith('/api/admin/auth/')
    )
  } catch {
    return false
  }
}

function localAdminAuthResponse(message = 'Login admin richiesto.', status = 401) {
  return new Response(
    JSON.stringify({
      success: false,
      authenticated: false,
      message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

function localAdminAuditResponse() {
  return new Response(
    JSON.stringify({
      success: false,
      message: ADMIN_AUDIT_MESSAGE,
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

function isReadMethod(method = 'GET') {
  return ['GET', 'HEAD', 'OPTIONS'].includes(String(method || 'GET').toUpperCase())
}

function getRequestMethod(resource, options = {}) {
  if (options?.method) return options.method
  if (resource instanceof Request) return resource.method || 'GET'
  return 'GET'
}

function isAdminAuditMode() {
  return adminCurrentUser?.audit_mode === true
}

function getAdminRole() {
  return adminCurrentUser?.role || 'viewer'
}

function adminHasRole(roles = []) {
  return roles.includes(getAdminRole())
}

function canAdminManageUsers() {
  return adminHasRole(['owner'])
}

function canAdminViewSensitiveSettings() {
  return adminHasRole(['owner'])
}

function showAdminPermissionNotice(message = 'Permessi insufficienti.') {
  if (!adminSessionBar) return

  let notice = document.querySelector('#adminPermissionNotice')

  if (!notice) {
    notice = document.createElement('p')
    notice.id = 'adminPermissionNotice'
    notice.className = 'admin-permission-notice'
    adminSessionBar.appendChild(notice)
  }

  notice.textContent = message
}

function ensureAdminAuditBadge() {
  if (!adminSessionBar) return null

  let badge = document.querySelector('#adminAuditBadge')

  if (!badge) {
    badge = document.createElement('strong')
    badge.id = 'adminAuditBadge'
    badge.className = 'admin-audit-badge'
    badge.textContent = 'AUDIT MODE \u2014 READ ONLY'
    adminSessionBar.appendChild(badge)
  }

  return badge
}

function isAuditMutationControl(button) {
  if (!button) return false
  if (button.id === 'exportDataButton') return false
  if (button.id?.startsWith('refresh')) return false

  const text = button.textContent || ''
  const mutationText = /(salva|crea|elimina|disattiva|importa|upload|carica|aggiungi|rimuovi|bozza|valida import)/i

  return (
    button.type === 'submit' ||
    button.id === 'adminLogoutButton' ||
    button.id === 'importProductsButton' ||
    button.id === 'addVariantButton' ||
    button.id === 'saveSectionButton' ||
    button.id === 'saveThemeSettingsButton' ||
    button.matches(
      [
        '[data-delete-collection]',
        '[data-disable]',
        '[data-delete-media]',
        '[data-remove-variant]',
        '[data-unpublish-blog]',
        '[data-unpublish-policy]',
        '[data-disable-campaign]',
        '[data-delete-menu-item]',
        '[data-delete-section]',
        '[data-remove-section]',
      ].join(', '),
    ) ||
    mutationText.test(text)
  )
}

function applyAdminAuditUi() {
  const auditMode = isAdminAuditMode()
  document.body.dataset.adminAuditMode = auditMode ? 'true' : 'false'

  const badge = ensureAdminAuditBadge()
  if (badge) badge.hidden = !auditMode

  document.querySelectorAll('button').forEach((button) => {
    if (!isAuditMutationControl(button)) return

    button.disabled = auditMode
    button.classList.toggle('audit-disabled', auditMode)
    if (auditMode) {
      button.title = ADMIN_AUDIT_MESSAGE
      button.dataset.auditDisabled = 'true'
    } else if (button.dataset.auditDisabled === 'true') {
      button.title = ''
      delete button.dataset.auditDisabled
    }
  })

  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.disabled = auditMode
    input.classList.toggle('audit-disabled', auditMode)
  })
}

function startAdminAuditObserver() {
  if (adminAuditObserver || !adminApp) return

  adminAuditObserver = new MutationObserver(() => {
    if (isAdminAuditMode()) {
      window.requestAnimationFrame(applyAdminAuditUi)
    }
  })

  adminAuditObserver.observe(adminApp, {
    childList: true,
    subtree: true,
  })
}

function applyAdminPermissionUi() {
  document.body.dataset.adminRole = getAdminRole()

  const canManageUsers = canAdminManageUsers()
  const canViewSettings = canAdminViewSensitiveSettings()

  if (adminUserForm) adminUserForm.hidden = !canManageUsers
  if (refreshAdminUsersButton) refreshAdminUsersButton.disabled = !canManageUsers

  if (themeSettingsButton) {
    themeSettingsButton.disabled = !canViewSettings
    themeSettingsButton.title = canViewSettings
      ? ''
      : 'Permessi insufficienti per modificare impostazioni sensibili.'
  }

  applyAdminAuditUi()
}

window.fetch = async (resource, options) => {
  const protectedAdminRequest = isProtectedAdminRequest(resource)
  const requestMethod = getRequestMethod(resource, options)

  if (protectedAdminRequest && !adminAllowProtectedFetches) {
    return localAdminAuthResponse()
  }

  if (protectedAdminRequest && isAdminAuditMode() && !isReadMethod(requestMethod)) {
    showAdminPermissionNotice(ADMIN_AUDIT_MESSAGE)
    return localAdminAuditResponse()
  }

  const response = await nativeFetch(resource, options)

  if (protectedAdminRequest && response.status === 401) {
    showAdminLogin('Sessione scaduta. Effettua di nuovo il login.')
  }

  if (protectedAdminRequest && response.status === 403) {
    response
      .clone()
      .json()
      .then((data) => {
        showAdminPermissionNotice(data.message || 'Permessi insufficienti.')
      })
      .catch(() => {
        showAdminPermissionNotice()
      })
  }

  return response
}

document.addEventListener(
  'submit',
  (event) => {
    if (!isAdminAuditMode() || !event.target.closest('#adminApp')) return

    event.preventDefault()
    event.stopImmediatePropagation()
    showAdminPermissionNotice(ADMIN_AUDIT_MESSAGE)
  },
  true,
)

document.addEventListener(
  'click',
  (event) => {
    if (!isAdminAuditMode()) return

    const button = event.target.closest('button')
    if (!button || !isAuditMutationControl(button)) return

    event.preventDefault()
    event.stopImmediatePropagation()
    showAdminPermissionNotice(ADMIN_AUDIT_MESSAGE)
  },
  true,
)

function setAdminAuthMessage(message = '', isError = false) {
  if (!adminAuthMessage) return
  adminAuthMessage.textContent = message
  adminAuthMessage.classList.toggle('is-error', isError)
}

function showAdminAuthGate({ bootstrap = false, migration = false, message = '' } = {}) {
  adminAllowProtectedFetches = false
  adminCurrentUser = null

  if (adminApp) adminApp.hidden = true
  if (adminAuthGate) adminAuthGate.hidden = false
  if (adminLoginForm) adminLoginForm.hidden = bootstrap || migration
  if (adminBootstrapForm) adminBootstrapForm.hidden = !bootstrap || migration

  if (adminAuthIntro) {
    adminAuthIntro.textContent = migration
      ? 'Prima di accedere al CMS devi applicare la migration di autenticazione.'
      : bootstrap
        ? 'Crea il primo owner del TakeOff Control Panel. Dopo questa operazione il bootstrap verra disattivato.'
        : 'Inserisci le credenziali admin per gestire contenuti, catalogo e impostazioni del sito.'
  }

  setAdminAuthMessage(message, Boolean(migration))
}

function showAdminLogin(message = '') {
  showAdminAuthGate({ message })
}

function showAdminApp(user) {
  adminCurrentUser = user
  adminAllowProtectedFetches = true

  if (adminAuthGate) adminAuthGate.hidden = true
  if (adminApp) adminApp.hidden = false
  if (adminSessionName) adminSessionName.textContent = user?.name || user?.email || 'Admin'
  if (adminSessionRole) adminSessionRole.textContent = user?.role || 'viewer'

  applyAdminPermissionUi()
  startAdminAuditObserver()
  applyAdminAuditUi()
}

function refreshAdminDataAfterAuth() {
  const loaders = [
    loadProducts,
    loadCollections,
    loadPages,
    loadPoliciesAdmin,
    loadBlogPosts,
    loadMetaobjects,
    loadTaxSettingsAdmin,
    loadPaymentSettingsAdmin,
    loadDiscounts,
    loadCampaigns,
    loadMediaItems,
    loadMetafieldResources,
    loadMarketsAdmin,
    loadAnalyticsDashboard,
    loadIntegrations,
    loadAdminUsers,
    loadActivityLog,
    loadNotifications,
    loadDomainsAdmin,
    loadTenantsAdmin,
    loadPerformanceAdmin,
    loadOrders,
    loadCustomers,
    loadMenuResources,
    loadMenus,
    loadEditorPages,
    loadSections,
  ]

  loaders.forEach((loader) => {
    try {
      if (typeof loader === 'function') loader()
    } catch {}
  })
}

async function initAdminAuth() {
  showAdminAuthGate({ message: 'Verifica sessione admin...' })

  try {
    const response = await nativeFetch('/api/admin/auth/me', {
      credentials: 'same-origin',
    })
    const data = await response.json()

    if (data.migration_required) {
      showAdminAuthGate({
        migration: true,
        message: data.message || 'Applica la migration 0011 prima di usare il login admin.',
      })
      return
    }

    if (data.bootstrap_required) {
      showAdminAuthGate({
        bootstrap: true,
        message: data.message || 'Crea il primo owner.',
      })
      return
    }

    if (data.authenticated && data.user) {
      showAdminApp(data.user)
      refreshAdminDataAfterAuth()
      return
    }

    showAdminLogin(data.message || '')
  } catch {
    showAdminAuthGate({
      message: 'Non e stato possibile verificare la sessione admin.',
    })
  }
}

adminLoginForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  setAdminAuthMessage('Accesso in corso...')

  try {
    const response = await nativeFetch('/api/admin/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.querySelector('#adminLoginEmail')?.value.trim() || '',
        password: document.querySelector('#adminLoginPassword')?.value || '',
      }),
    })
    const data = await response.json()

    if (!data.success) {
      if (data.bootstrap_required) {
        showAdminAuthGate({ bootstrap: true, message: data.message || 'Crea il primo owner.' })
        return
      }

      setAdminAuthMessage(data.message || 'Credenziali non valide.', true)
      return
    }

    adminLoginForm.reset()
    showAdminApp(data.user)
    refreshAdminDataAfterAuth()
  } catch {
    setAdminAuthMessage('Login non riuscito. Riprova.', true)
  }
})

adminBootstrapForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  setAdminAuthMessage('Creazione owner...')

  try {
    const response = await nativeFetch('/api/admin/auth/bootstrap', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.querySelector('#adminBootstrapName')?.value.trim() || '',
        email: document.querySelector('#adminBootstrapEmail')?.value.trim() || '',
        password: document.querySelector('#adminBootstrapPassword')?.value || '',
      }),
    })
    const data = await response.json()

    if (!data.success) {
      setAdminAuthMessage(data.message || 'Bootstrap non riuscito.', true)
      return
    }

    adminBootstrapForm.reset()
    showAdminApp(data.user)
    refreshAdminDataAfterAuth()
  } catch {
    setAdminAuthMessage('Bootstrap non riuscito. Riprova.', true)
  }
})

adminLogoutButton?.addEventListener('click', async () => {
  try {
    await nativeFetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    })
  } catch {}

  showAdminLogin('Logout effettuato.')
})

const productsList = document.querySelector('#productsList')
const productForm = document.querySelector('#productForm')
const message = document.querySelector('#message')
const refreshButton = document.querySelector('#refreshButton')
const formTitle = document.querySelector('#formTitle')
const submitButton = document.querySelector('#submitButton')
const cancelEdit = document.querySelector('#cancelEdit')
const productVariantsList = document.querySelector('#productVariantsList')
const addVariantButton = document.querySelector('#addVariantButton')
const productAdminSearch = document.querySelector('#productAdminSearch')

let productVariantsDraft = []

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

function normalizeAdminSearch(value = '') {
  return String(value || '').trim().toLowerCase()
}

function adminItemMatchesSearch(item = {}, query = '', fields = []) {
  if (!query) return true

  return fields.some((field) => {
    const value = field.split('.').reduce((target, key) => target?.[key], item)
    return String(value ?? '').toLowerCase().includes(query)
  })
}

function renderAdminListState(target, message, state = 'empty') {
  if (!target) return
  target.innerHTML = `
    <div class="admin-list-state ${state}">
      <strong>${escapeHtml(message)}</strong>
      <span>${state === 'loading' ? 'Attendi qualche secondo.' : 'Puoi aggiornare o modificare la ricerca.'}</span>
    </div>
  `
}

function setInputValue(selector, value = '') {
  const input = document.querySelector(selector)
  if (input) input.value = value || ''
}

function readSeoFields(prefix) {
  return {
    meta_title: document.querySelector(`#${prefix}SeoTitle`)?.value.trim() || '',
    meta_description: document.querySelector(`#${prefix}SeoDescription`)?.value.trim() || '',
    og_image: document.querySelector(`#${prefix}SeoImage`)?.value.trim() || '',
    canonical_url: document.querySelector(`#${prefix}SeoCanonical`)?.value.trim() || '',
  }
}

function fillSeoFields(prefix, seo = {}) {
  setInputValue(`#${prefix}SeoTitle`, seo.meta_title)
  setInputValue(`#${prefix}SeoDescription`, seo.meta_description)
  setInputValue(`#${prefix}SeoImage`, seo.og_image)
  setInputValue(`#${prefix}SeoCanonical`, seo.canonical_url)
}

function resetForm() {
  productForm.reset()
  document.querySelector('#productId').value = ''
  fillSeoFields('product')
  productVariantsDraft = []
  renderVariantRows()
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
  fillSeoFields('product', product.seo || {})
  productVariantsDraft = (product.variants || []).map((variant) => ({
    id: variant.id || '',
    option_name: variant.option_name || '',
    option_value: variant.option_value || '',
    sku: variant.sku || '',
    price_cents: variant.price_cents ?? '',
    stock: variant.stock ?? '',
  }))
  renderVariantRows()

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
    variants: readVariantRows(),
    seo: readSeoFields('product'),
  }
}

function renderVariantRows() {
  if (!productVariantsList) return

  if (productVariantsDraft.length === 0) {
    productVariantsList.innerHTML = '<p class="empty-variants">Nessuna variante configurata.</p>'
    return
  }

  productVariantsList.innerHTML = productVariantsDraft
    .map(
      (variant, index) => `
        <div class="variant-row" data-variant-row="${index}">
          <label>
            Nome opzione
            <input
              type="text"
              data-variant-field="option_name"
              value="${escapeHtml(variant.option_name)}"
              placeholder="Colore"
            />
          </label>

          <label>
            Valore
            <input
              type="text"
              data-variant-field="option_value"
              value="${escapeHtml(variant.option_value)}"
              placeholder="Rosso"
            />
          </label>

          <label>
            SKU
            <input
              type="text"
              data-variant-field="sku"
              value="${escapeHtml(variant.sku)}"
              placeholder="SKU opzionale"
            />
          </label>

          <label>
            Prezzo variante
            <input
              type="number"
              step="0.01"
              data-variant-field="price"
              value="${variant.price_cents === '' ? '' : Number(variant.price_cents) / 100}"
              placeholder="Lascia vuoto"
            />
          </label>

          <label>
            Stock variante
            <input
              type="number"
              data-variant-field="stock"
              value="${variant.stock ?? ''}"
              placeholder="Lascia vuoto"
            />
          </label>

          <button class="danger" type="button" data-remove-variant="${index}">
            Rimuovi
          </button>
        </div>
      `,
    )
    .join('')

  document.querySelectorAll('[data-remove-variant]').forEach((button) => {
    button.addEventListener('click', () => {
      productVariantsDraft.splice(Number(button.dataset.removeVariant), 1)
      renderVariantRows()
    })
  })
}

function readVariantRows() {
  if (!productVariantsList) return []

  return [...productVariantsList.querySelectorAll('[data-variant-row]')]
    .map((row, index) => {
      const optionName = row.querySelector('[data-variant-field="option_name"]').value.trim()
      const optionValue = row.querySelector('[data-variant-field="option_value"]').value.trim()
      const sku = row.querySelector('[data-variant-field="sku"]').value.trim()
      const price = row.querySelector('[data-variant-field="price"]').value
      const stock = row.querySelector('[data-variant-field="stock"]').value

      return {
        option_name: optionName,
        option_value: optionValue,
        sku,
        price_cents: price === '' ? null : Math.round(Number(price) * 100),
        stock: stock === '' ? null : Number(stock),
        sort_order: index,
      }
    })
    .filter((variant) => variant.option_name || variant.option_value || variant.sku)
}

async function loadProducts() {
  renderAdminListState(productsList, 'Caricamento prodotti...', 'loading')

  try {
    const response = await fetch('/api/products')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(productsList, 'Errore nel caricamento prodotti.', 'error')
      return
    }

    if (data.products.length === 0) {
      renderAdminListState(productsList, 'Nessun prodotto trovato.')
      return
    }

    const search = normalizeAdminSearch(productAdminSearch?.value)
    const visibleProducts = data.products.filter((product) =>
      adminItemMatchesSearch(product, search, [
        'name',
        'slug',
        'description',
        'category',
        'collection_slug',
      ]),
    )

    if (!visibleProducts.length) {
      renderAdminListState(productsList, 'Nessun prodotto corrisponde alla ricerca.')
      return
    }

    productsList.innerHTML = visibleProducts
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
              <span>${product.variants?.length || 0} varianti</span>
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
    renderAdminListState(productsList, 'Errore di connessione alla API.', 'error')
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
productAdminSearch?.addEventListener('input', loadProducts)
addVariantButton?.addEventListener('click', () => {
  productVariantsDraft = readVariantRows()
  productVariantsDraft.push({
    option_name: '',
    option_value: '',
    sku: '',
    price_cents: '',
    stock: '',
  })
  renderVariantRows()
})

renderVariantRows()
loadProducts()

// ===============================
// IMPORT / EXPORT
// ===============================

const exportDataButton = document.querySelector('#exportDataButton')
const exportPreview = document.querySelector('#exportPreview')
const importProductsButton = document.querySelector('#importProductsButton')
const importPreview = document.querySelector('#importPreview')
const importExportMessage = document.querySelector('#importExportMessage')

exportDataButton?.addEventListener('click', async () => {
  const resource = document.querySelector('#exportResource').value
  const formatSelect = document.querySelector('#exportFormat')
  const format = resource === 'backup' ? 'json' : formatSelect.value

  if (resource === 'backup' && formatSelect) {
    formatSelect.value = 'json'
  }

  exportPreview.textContent = 'Preparazione export...'

  try {
    const response = await fetch(
      `/api/admin/import-export?resource=${encodeURIComponent(resource)}&format=${encodeURIComponent(format)}`,
    )

    if (format === 'csv') {
      exportPreview.textContent = await response.text()
      return
    }

    const data = await response.json()
    if (!response.ok || !data.success) {
      exportPreview.textContent = data.message || 'Export non disponibile.'
      return
    }

    exportPreview.textContent = JSON.stringify(data, null, 2)
  } catch {
    exportPreview.textContent = 'Errore export.'
  }
})

importProductsButton?.addEventListener('click', async () => {
  importExportMessage.textContent = 'Validazione import...'
  importPreview.textContent = ''

  try {
    const format = document.querySelector('#importFormat').value
    const content = document.querySelector('#importContent').value.trim()
    let rows = []

    if (format === 'json' && content) {
      rows = JSON.parse(content)
    }

    const response = await fetch('/api/admin/import-export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        format,
        content,
        rows,
        dry_run: document.querySelector('#importDryRun').checked,
      }),
    })
    const data = await response.json()

    importExportMessage.textContent = data.message || (data.success ? 'Import validato.' : 'Errore import.')
    importPreview.textContent = JSON.stringify(data, null, 2)

    if (data.success && !data.dry_run) {
      loadProducts()
    }
  } catch (error) {
    importExportMessage.textContent = 'Import non riuscito. Verifica formato e riprova.'
  }
})

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
const collectionAdminSearch = document.querySelector('#collectionAdminSearch')

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
  fillSeoFields('collection')
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
  fillSeoFields('collection', collection.seo || {})

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
    seo: readSeoFields('collection'),
  }
}

async function loadCollections() {
  renderAdminListState(collectionsList, 'Caricamento collezioni...', 'loading')

  try {
    const response = await fetch('/api/admin/collections')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(collectionsList, 'Errore nel caricamento collezioni.', 'error')
      return
    }

    collectionsCache = data.collections || []
    renderProductCollectionOptions(document.querySelector('#collection_slug').value)

    if (data.collections.length === 0) {
      renderAdminListState(collectionsList, 'Nessuna collezione trovata.')
      return
    }

    const search = normalizeAdminSearch(collectionAdminSearch?.value)
    const visibleCollections = data.collections.filter((collection) =>
      adminItemMatchesSearch(collection, search, ['name', 'slug', 'description']),
    )

    if (!visibleCollections.length) {
      renderAdminListState(collectionsList, 'Nessuna collezione corrisponde alla ricerca.')
      return
    }

    collectionsList.innerHTML = visibleCollections
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
    renderAdminListState(collectionsList, 'Errore di connessione alla API collezioni.', 'error')
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
collectionAdminSearch?.addEventListener('input', loadCollections)

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
  fillSeoFields('page')
  pageFormTitle.textContent = 'Aggiungi pagina'
  pageSubmitButton.textContent = 'Salva pagina'
  cancelPageEdit.hidden = true
  pageMessage.textContent = ''
}

function fillPageForm(page) {
  document.querySelector('#pageId').value = page.id
  document.querySelector('#pageTitle').value = page.title || ''
  document.querySelector('#pageSlug').value = page.slug || ''
  fillSeoFields('page', page.seo || {})

  pageFormTitle.textContent = 'Modifica pagina'
  pageSubmitButton.textContent = 'Aggiorna pagina'
  cancelPageEdit.hidden = false
}

function getFormPage() {
  return {
    id: document.querySelector('#pageId').value,
    title: document.querySelector('#pageTitle').value.trim(),
    slug: document.querySelector('#pageSlug').value.trim(),
    seo: readSeoFields('page'),
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

  function updateCurrentViewLabel(activeView) {
    if (!adminCurrentView) return

    const target = document.querySelector(`[data-admin-view="${activeView}"]`)
    const heading =
      target?.querySelector('.view-heading h2, .section-title h2, h2')?.textContent?.trim() ||
      'Editor sito'

    adminCurrentView.textContent = heading
  }

  function openViewFromHash() {
    const hash = window.location.hash.replace('#', '') || 'editor'
    const viewExists = document.querySelector(`[data-admin-view="${hash}"]`)
    const activeView = viewExists ? hash : 'editor'

    views.forEach((view) => {
      view.hidden = view.dataset.adminView !== activeView
    })

    const catalogoViews = ['prodotti', 'collezioni', 'inventario', 'import-export']
    const contenutoViews = ['pagine', 'menu', 'media', 'seo', 'blog-admin', 'metaobjects', 'policy']
    const marketingViews = [
      'marketing-campaigns',
      'marketing-discounts',
      'marketing-coupons',
      'marketing-newsletter',
    ]
    const marketsViews = [
      'markets-mercati',
      'markets-paesi',
      'markets-lingue',
      'markets-valute',
      'markets-prezzi',
    ]
    const analyticsViews = [
      'analytics-dashboard',
      'analytics-traffic',
      'analytics-sales',
      'analytics-products',
      'analytics-conversions',
    ]
    const checkoutViews = [
      'checkout-settings',
      'checkout-payments',
      'checkout-shipping',
      'checkout-taxes',
      'checkout-confirmation',
    ]
    const impostazioniViews = [
      'settings-general',
      'privacy-settings',
      'cookie-settings',
      'settings-import-export',
      'metafields',
      'integrazioni',
      'utenti',
      'activity',
      'notifiche',
      'domini',
      'tenants',
      'performance',
    ]

    const activeHubHash = contenutoViews.includes(activeView)
      ? '#contenuto'
      : catalogoViews.includes(activeView)
        ? '#catalogo'
        : marketingViews.includes(activeView)
          ? '#marketing'
          : marketsViews.includes(activeView)
            ? '#markets'
            : analyticsViews.includes(activeView)
              ? '#analisi'
              : checkoutViews.includes(activeView)
                ? '#checkout'
                : impostazioniViews.includes(activeView)
                  ? '#impostazioni'
                  : `#${activeView}`

    hubLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === activeHubHash)
    })

    const target = document.querySelector(`[data-admin-view="${activeView}"]`)
    updateCurrentViewLabel(activeView)
    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  window.addEventListener('hashchange', openViewFromHash)
  openViewFromHash()
}

setupAdminViews()

function readJsonTextarea(selector, fallback = {}) {
  const value = document.querySelector(selector)?.value.trim()
  if (!value) return fallback

  try {
    return JSON.parse(value)
  } catch {
    throw new Error('JSON non valido.')
  }
}

function stringifyForTextarea(value, fallback = {}) {
  return JSON.stringify(value || fallback, null, 2)
}

// ===============================
// POLICY
// ===============================

const policyForm = document.querySelector('#policyForm')
const policiesList = document.querySelector('#policiesList')
const policyMessage = document.querySelector('#policyMessage')
const refreshPoliciesButton = document.querySelector('#refreshPoliciesButton')
const policyFormTitle = document.querySelector('#policyFormTitle')
const policySubmitButton = document.querySelector('#policySubmitButton')
const cancelPolicyEdit = document.querySelector('#cancelPolicyEdit')

function resetPolicyForm() {
  if (!policyForm) return
  policyForm.reset()
  document.querySelector('#policyId').value = ''
  policyFormTitle.textContent = 'Aggiungi policy'
  policySubmitButton.textContent = 'Salva policy'
  cancelPolicyEdit.hidden = true
  policyMessage.textContent = ''
}

function fillPolicyForm(policy) {
  document.querySelector('#policyId').value = policy.id
  document.querySelector('#policyType').value = policy.type || 'privacy_policy'
  document.querySelector('#policyTitle').value = policy.title || ''
  document.querySelector('#policySlug').value = policy.slug || ''
  document.querySelector('#policyContent').value = policy.content || ''
  document.querySelector('#policyStatus').value = policy.status || 'draft'
  policyFormTitle.textContent = 'Modifica policy'
  policySubmitButton.textContent = 'Aggiorna policy'
  cancelPolicyEdit.hidden = false
}

function readPolicyPayload() {
  return {
    id: document.querySelector('#policyId').value,
    type: document.querySelector('#policyType').value,
    title: document.querySelector('#policyTitle').value.trim(),
    slug: document.querySelector('#policySlug').value.trim(),
    content: document.querySelector('#policyContent').value.trim(),
    status: document.querySelector('#policyStatus').value,
  }
}

async function loadPoliciesAdmin() {
  if (!policiesList) return
  policiesList.textContent = 'Caricamento policy...'

  try {
    const response = await fetch('/api/admin/policies')
    const data = await response.json()

    if (!data.success) {
      policiesList.textContent = data.message || 'Errore caricamento policy.'
      return
    }

    policiesList.innerHTML = data.policies.length
      ? data.policies
          .map(
            (policy) => `
              <article class="product-item">
                <h3>${escapeHtml(policy.title)}</h3>
                <p>${escapeHtml(policy.type)} / ${escapeHtml(policy.slug)}</p>
                <div class="meta">
                  <span>${escapeHtml(policy.status)}</span>
                  <span>${escapeHtml(policy.updated_at || '')}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-policy="${policy.id}">Modifica</button>
                  <a class="button-link" href="/policies/${escapeHtml(policy.slug)}" target="_blank" rel="noreferrer">Apri</a>
                  <button type="button" class="danger" data-unpublish-policy="${policy.id}">Bozza</button>
                </div>
              </article>
            `,
          )
          .join('')
      : 'Nessuna policy.'

    document.querySelectorAll('[data-edit-policy]').forEach((button) => {
      button.addEventListener('click', () => {
        const policy = data.policies.find((item) => item.id === Number(button.dataset.editPolicy))
        fillPolicyForm(policy)
      })
    })

    document.querySelectorAll('[data-unpublish-policy]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/policies', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.unpublishPolicy) }),
        })
        resetPolicyForm()
        loadPoliciesAdmin()
      })
    })
  } catch {
    policiesList.textContent = 'Errore di connessione policy.'
  }
}

policyForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  policyMessage.textContent = 'Salvataggio policy...'
  const payload = readPolicyPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/policies', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    policyMessage.textContent = data.message || 'Policy salvata.'
    if (data.success) {
      resetPolicyForm()
      loadPoliciesAdmin()
    }
  } catch {
    policyMessage.textContent = 'Errore di connessione policy.'
  }
})

cancelPolicyEdit?.addEventListener('click', resetPolicyForm)
refreshPoliciesButton?.addEventListener('click', loadPoliciesAdmin)
loadPoliciesAdmin()

// ===============================
// BLOG
// ===============================

const blogPostForm = document.querySelector('#blogPostForm')
const blogPostsList = document.querySelector('#blogPostsList')
const blogMessage = document.querySelector('#blogMessage')
const refreshBlogButton = document.querySelector('#refreshBlogButton')
const blogPostFormTitle = document.querySelector('#blogPostFormTitle')
const blogSubmitButton = document.querySelector('#blogSubmitButton')
const cancelBlogEdit = document.querySelector('#cancelBlogEdit')
const blogAdminSearch = document.querySelector('#blogAdminSearch')

function resetBlogForm() {
  if (!blogPostForm) return
  blogPostForm.reset()
  document.querySelector('#blogPostId').value = ''
  blogPostFormTitle.textContent = 'Aggiungi articolo'
  blogSubmitButton.textContent = 'Salva articolo'
  cancelBlogEdit.hidden = true
  blogMessage.textContent = ''
}

function fillBlogForm(post) {
  document.querySelector('#blogPostId').value = post.id
  document.querySelector('#blogTitle').value = post.title || ''
  document.querySelector('#blogSlug').value = post.slug || ''
  document.querySelector('#blogExcerpt').value = post.excerpt || ''
  document.querySelector('#blogContent').value = post.content || ''
  document.querySelector('#blogImageUrl').value = post.image_url || ''
  document.querySelector('#blogAuthor').value = post.author || ''
  document.querySelector('#blogStatus').value = post.status || 'draft'
  document.querySelector('#blogMetaTitle').value = post.meta_title || ''
  document.querySelector('#blogMetaDescription').value = post.meta_description || ''
  document.querySelector('#blogOgImage').value = post.og_image || ''
  blogPostFormTitle.textContent = 'Modifica articolo'
  blogSubmitButton.textContent = 'Aggiorna articolo'
  cancelBlogEdit.hidden = false
}

function readBlogPayload() {
  return {
    id: document.querySelector('#blogPostId').value,
    title: document.querySelector('#blogTitle').value.trim(),
    slug: document.querySelector('#blogSlug').value.trim(),
    excerpt: document.querySelector('#blogExcerpt').value.trim(),
    content: document.querySelector('#blogContent').value.trim(),
    image_url: document.querySelector('#blogImageUrl').value.trim(),
    author: document.querySelector('#blogAuthor').value.trim(),
    status: document.querySelector('#blogStatus').value,
    meta_title: document.querySelector('#blogMetaTitle').value.trim(),
    meta_description: document.querySelector('#blogMetaDescription').value.trim(),
    og_image: document.querySelector('#blogOgImage').value.trim(),
  }
}

async function loadBlogPosts() {
  if (!blogPostsList) return
  renderAdminListState(blogPostsList, 'Caricamento articoli...', 'loading')

  try {
    const response = await fetch('/api/admin/blog')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(blogPostsList, data.message || 'Errore caricamento blog.', 'error')
      return
    }

    if (!data.posts.length) {
      renderAdminListState(blogPostsList, 'Nessun articolo creato.')
      return
    }

    const search = normalizeAdminSearch(blogAdminSearch?.value)
    const visiblePosts = data.posts.filter((post) =>
      adminItemMatchesSearch(post, search, ['title', 'slug', 'excerpt', 'author', 'status']),
    )

    if (!visiblePosts.length) {
      renderAdminListState(blogPostsList, 'Nessun articolo corrisponde alla ricerca.')
      return
    }

    blogPostsList.innerHTML = visiblePosts
      .map(
        (post) => `
          <article class="product-item">
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.excerpt || 'Nessun excerpt')}</p>
            <div class="meta">
              <span>Slug: ${escapeHtml(post.slug)}</span>
              <span>${escapeHtml(post.status)}</span>
              <span>${escapeHtml(post.author || 'Autore N/D')}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-blog="${post.id}">Modifica</button>
              <a class="button-link" href="/blog/${escapeHtml(post.slug)}" target="_blank" rel="noreferrer">Apri</a>
              <button type="button" class="danger" data-unpublish-blog="${post.id}">Bozza</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-blog]').forEach((button) => {
      button.addEventListener('click', () => {
        const post = data.posts.find((item) => item.id === Number(button.dataset.editBlog))
        fillBlogForm(post)
      })
    })

    document.querySelectorAll('[data-unpublish-blog]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch('/api/admin/blog', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.unpublishBlog) }),
        })
        const result = await response.json()
        if (!result.success) alert(result.message || 'Errore articolo.')
        resetBlogForm()
        loadBlogPosts()
      })
    })
  } catch {
    renderAdminListState(blogPostsList, 'Errore di connessione blog.', 'error')
  }
}

blogPostForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  blogMessage.textContent = 'Salvataggio articolo...'
  const payload = readBlogPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/blog', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    blogMessage.textContent = data.message || (data.success ? 'Articolo salvato.' : 'Errore articolo.')
    if (data.success) {
      resetBlogForm()
      loadBlogPosts()
    }
  } catch {
    blogMessage.textContent = 'Errore di connessione blog.'
  }
})

cancelBlogEdit?.addEventListener('click', resetBlogForm)
refreshBlogButton?.addEventListener('click', loadBlogPosts)
blogAdminSearch?.addEventListener('input', loadBlogPosts)
loadBlogPosts()

// ===============================
// METAOBJECTS
// ===============================

const metaobjectDefinitionForm = document.querySelector('#metaobjectDefinitionForm')
const metaobjectEntryForm = document.querySelector('#metaobjectEntryForm')
const metaobjectsList = document.querySelector('#metaobjectsList')
const metaobjectEntryDefinition = document.querySelector('#metaobjectEntryDefinition')
const metaobjectDefinitionMessage = document.querySelector('#metaobjectDefinitionMessage')
const metaobjectEntryMessage = document.querySelector('#metaobjectEntryMessage')
const cancelMetaobjectEntryEdit = document.querySelector('#cancelMetaobjectEntryEdit')

let metaobjectDefinitionsCache = []
let metaobjectEntriesCache = []

function renderMetaobjectDefinitionOptions() {
  if (!metaobjectEntryDefinition) return
  metaobjectEntryDefinition.innerHTML = metaobjectDefinitionsCache
    .map((definition) => `<option value="${definition.id}">${escapeHtml(definition.name)}</option>`)
    .join('')
}

function resetMetaobjectEntryForm() {
  if (!metaobjectEntryForm) return
  metaobjectEntryForm.reset()
  document.querySelector('#metaobjectEntryId').value = ''
  document.querySelector('#metaobjectEntryDataJson').value = '{}'
  cancelMetaobjectEntryEdit.hidden = true
  metaobjectEntryMessage.textContent = ''
}

function fillMetaobjectEntryForm(entry) {
  document.querySelector('#metaobjectEntryId').value = entry.id
  document.querySelector('#metaobjectEntryDefinition').value = entry.definition_id
  document.querySelector('#metaobjectEntryTitle').value = entry.title || ''
  document.querySelector('#metaobjectEntrySlug').value = entry.slug || ''
  document.querySelector('#metaobjectEntryDataJson').value = stringifyForTextarea(entry.data, {})
  cancelMetaobjectEntryEdit.hidden = false
}

async function loadMetaobjects() {
  if (!metaobjectsList) return
  metaobjectsList.textContent = 'Caricamento metaobjects...'

  try {
    const response = await fetch('/api/admin/metaobjects')
    const data = await response.json()

    if (!data.success) {
      metaobjectsList.textContent = data.message || 'Errore metaobjects.'
      return
    }

    metaobjectDefinitionsCache = data.definitions || []
    metaobjectEntriesCache = data.entries || []
    renderMetaobjectDefinitionOptions()

    if (!metaobjectDefinitionsCache.length && !metaobjectEntriesCache.length) {
      metaobjectsList.textContent = 'Nessun metaobject creato.'
      return
    }

    metaobjectsList.innerHTML = `
      ${metaobjectDefinitionsCache
        .map(
          (definition) => `
            <article class="product-item">
              <h3>${escapeHtml(definition.name)}</h3>
              <p>Type key: ${escapeHtml(definition.type_key)}</p>
              <div class="meta">
                ${(definition.fields || [])
                  .map((field) => `<span>${escapeHtml(field.label)}: ${escapeHtml(field.type)}</span>`)
                  .join('')}
              </div>
            </article>
          `,
        )
        .join('')}
      ${metaobjectEntriesCache
        .map(
          (entry) => `
            <article class="product-item">
              <h3>${escapeHtml(entry.title)}</h3>
              <p>${escapeHtml(entry.type_key)} / ${escapeHtml(entry.slug)}</p>
              <div class="product-actions">
                <button type="button" data-edit-metaobject-entry="${entry.id}">Modifica</button>
                <button type="button" class="danger" data-delete-metaobject-entry="${entry.id}">Disattiva</button>
              </div>
            </article>
          `,
        )
        .join('')}
    `

    document.querySelectorAll('[data-edit-metaobject-entry]').forEach((button) => {
      button.addEventListener('click', () => {
        const entry = metaobjectEntriesCache.find((item) => item.id === Number(button.dataset.editMetaobjectEntry))
        fillMetaobjectEntryForm(entry)
      })
    })

    document.querySelectorAll('[data-delete-metaobject-entry]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/metaobjects', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'entry', id: Number(button.dataset.deleteMetaobjectEntry) }),
        })
        resetMetaobjectEntryForm()
        loadMetaobjects()
      })
    })
  } catch {
    metaobjectsList.textContent = 'Errore di connessione metaobjects.'
  }
}

metaobjectDefinitionForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  metaobjectDefinitionMessage.textContent = 'Salvataggio definizione...'

  try {
    const response = await fetch('/api/admin/metaobjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'definition',
        name: document.querySelector('#metaobjectName').value.trim(),
        type_key: document.querySelector('#metaobjectTypeKey').value.trim(),
        fields: readJsonTextarea('#metaobjectFieldsJson', []),
      }),
    })
    const data = await response.json()
    metaobjectDefinitionMessage.textContent = data.message || 'Definizione salvata.'
    if (data.success) {
      metaobjectDefinitionForm.reset()
      loadMetaobjects()
    }
  } catch (error) {
    metaobjectDefinitionMessage.textContent = 'Errore metaobject. Verifica il JSON dei campi e riprova.'
  }
})

metaobjectEntryForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  metaobjectEntryMessage.textContent = 'Salvataggio entry...'
  const id = document.querySelector('#metaobjectEntryId').value

  try {
    const response = await fetch('/api/admin/metaobjects', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'entry',
        id,
        definition_id: Number(document.querySelector('#metaobjectEntryDefinition').value),
        title: document.querySelector('#metaobjectEntryTitle').value.trim(),
        slug: document.querySelector('#metaobjectEntrySlug').value.trim(),
        data: readJsonTextarea('#metaobjectEntryDataJson', {}),
      }),
    })
    const data = await response.json()
    metaobjectEntryMessage.textContent = data.message || 'Entry salvata.'
    if (data.success) {
      resetMetaobjectEntryForm()
      loadMetaobjects()
    }
  } catch (error) {
    metaobjectEntryMessage.textContent = 'Errore entry. Verifica il JSON dei dati e riprova.'
  }
})

cancelMetaobjectEntryEdit?.addEventListener('click', resetMetaobjectEntryForm)
loadMetaobjects()

// ===============================
// TASSE
// ===============================

const taxSettingsForm = document.querySelector('#taxSettingsForm')
const taxVatRate = document.querySelector('#taxVatRate')
const taxPricesIncludeTax = document.querySelector('#taxPricesIncludeTax')
const taxSettingsMessage = document.querySelector('#taxSettingsMessage')

async function loadTaxSettingsAdmin() {
  if (!taxSettingsForm) return

  taxSettingsMessage.textContent = 'Caricamento impostazioni fiscali...'

  try {
    const response = await fetch('/api/admin/tax')
    const data = await response.json()

    if (!data.success) {
      taxSettingsMessage.textContent = data.message || 'Errore caricamento impostazioni fiscali.'
      return
    }

    taxVatRate.value = data.settings?.vat_rate ?? 22
    taxPricesIncludeTax.checked = data.settings?.prices_include_tax !== false
    taxSettingsMessage.textContent = ''
  } catch {
    taxSettingsMessage.textContent = 'Errore di connessione impostazioni fiscali.'
  }
}

taxSettingsForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  taxSettingsMessage.textContent = 'Salvataggio impostazioni fiscali...'

  try {
    const response = await fetch('/api/admin/tax', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vat_rate: Number(taxVatRate.value || 0),
        prices_include_tax: taxPricesIncludeTax.checked,
      }),
    })
    const data = await response.json()

    taxSettingsMessage.textContent = data.message || (data.success ? 'Impostazioni fiscali salvate.' : 'Errore impostazioni fiscali.')
  } catch {
    taxSettingsMessage.textContent = 'Errore di connessione impostazioni fiscali.'
  }
})

loadTaxSettingsAdmin()

// ===============================
// PAGAMENTI
// ===============================

const paymentSettingsForm = document.querySelector('#paymentSettingsForm')
const paymentProvider = document.querySelector('#paymentProvider')
const stripeEnabled = document.querySelector('#stripeEnabled')
const stripeMode = document.querySelector('#stripeMode')
const stripePublicKey = document.querySelector('#stripePublicKey')
const paymentProviderStatus = document.querySelector('#paymentProviderStatus')
const paymentSettingsMessage = document.querySelector('#paymentSettingsMessage')

function renderPaymentProviderStatus(settings = {}, message = '') {
  if (!paymentProviderStatus) return

  const stripeReady = settings.stripe_enabled && settings.stripe_secret_configured
  const webhookReady = settings.stripe_webhook_configured

  paymentProviderStatus.innerHTML = `
    <span class="status-badge">${stripeReady ? 'Stripe pronto' : 'Manual fallback'}</span>
    <p>${escapeHtml(message || 'Configura Stripe solo tramite variabili ambiente, mai nel repository.')}</p>
    <div class="meta">
      <span>Secret: ${settings.stripe_secret_configured ? 'configurata' : 'mancante'}</span>
      <span>Webhook: ${webhookReady ? 'configurato' : 'mancante/opzionale'}</span>
      <span>Modalita: ${escapeHtml(settings.stripe_mode || 'test')}</span>
    </div>
  `
}

async function loadPaymentSettingsAdmin() {
  if (!paymentSettingsForm) return

  paymentSettingsMessage.textContent = 'Caricamento pagamenti...'

  try {
    const response = await fetch('/api/admin/payments')
    const data = await response.json()

    if (!data.success) {
      paymentSettingsMessage.textContent = data.message || 'Errore caricamento pagamenti.'
      return
    }

    const settings = data.settings || {}
    paymentProvider.value = settings.payment_provider || 'manual'
    stripeEnabled.checked = Boolean(settings.stripe_enabled)
    stripeMode.value = settings.stripe_mode || 'test'
    stripePublicKey.value = settings.stripe_public_key || ''
    renderPaymentProviderStatus(settings, data.message)
    paymentSettingsMessage.textContent = ''
  } catch {
    paymentSettingsMessage.textContent = 'Errore di connessione pagamenti.'
  }
}

paymentSettingsForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  paymentSettingsMessage.textContent = 'Salvataggio pagamenti...'

  try {
    const response = await fetch('/api/admin/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_provider: paymentProvider.value,
        stripe_enabled: stripeEnabled.checked,
        stripe_mode: stripeMode.value,
        stripe_public_key: stripePublicKey.value.trim(),
      }),
    })
    const data = await response.json()

    paymentSettingsMessage.textContent = data.message || 'Impostazioni pagamento salvate.'

    if (data.success) {
      renderPaymentProviderStatus(data.settings || {}, data.message)
    }
  } catch {
    paymentSettingsMessage.textContent = 'Errore salvataggio pagamenti.'
  }
})

loadPaymentSettingsAdmin()

// ===============================
// SCONTI
// ===============================

const discountForm = document.querySelector('#discountForm')
const discountsList = document.querySelector('#discountsList')
const refreshDiscountsButton = document.querySelector('#refreshDiscountsButton')
const discountMessage = document.querySelector('#discountMessage')
const discountFormTitle = document.querySelector('#discountFormTitle')
const discountSubmitButton = document.querySelector('#discountSubmitButton')
const cancelDiscountEdit = document.querySelector('#cancelDiscountEdit')

function resetDiscountForm() {
  if (!discountForm) return
  discountForm.reset()
  document.querySelector('#discountId').value = ''
  document.querySelector('#discountActive').checked = true
  discountFormTitle.textContent = 'Aggiungi sconto'
  discountSubmitButton.textContent = 'Salva sconto'
  cancelDiscountEdit.hidden = true
  discountMessage.textContent = ''
}

function fillDiscountForm(discount) {
  document.querySelector('#discountId').value = discount.id
  document.querySelector('#discountCodeAdmin').value = discount.code || ''
  document.querySelector('#discountDescription').value = discount.description || ''
  document.querySelector('#discountType').value = discount.type || 'percentage'
  document.querySelector('#discountValue').value =
    discount.type === 'fixed' ? Number(discount.value || 0) / 100 : Number(discount.value || 0)
  document.querySelector('#discountMinimum').value = Number(discount.min_subtotal_cents || 0) / 100
  document.querySelector('#discountStartsAt').value = discount.starts_at || ''
  document.querySelector('#discountEndsAt').value = discount.ends_at || ''
  document.querySelector('#discountActive').checked = Number(discount.active) !== 0
  discountFormTitle.textContent = 'Modifica sconto'
  discountSubmitButton.textContent = 'Aggiorna sconto'
  cancelDiscountEdit.hidden = false
}

function getDiscountFormPayload() {
  const type = document.querySelector('#discountType').value
  const rawValue = Number(document.querySelector('#discountValue').value || 0)

  return {
    id: document.querySelector('#discountId').value,
    code: document.querySelector('#discountCodeAdmin').value.trim(),
    description: document.querySelector('#discountDescription').value.trim(),
    type,
    value: type === 'fixed' ? Math.round(rawValue * 100) : Math.round(rawValue),
    min_subtotal_cents: Math.round(Number(document.querySelector('#discountMinimum').value || 0) * 100),
    starts_at: document.querySelector('#discountStartsAt').value,
    ends_at: document.querySelector('#discountEndsAt').value,
    active: document.querySelector('#discountActive').checked,
  }
}

async function loadDiscounts() {
  if (!discountsList) return

  discountsList.textContent = 'Caricamento sconti...'

  try {
    const response = await fetch('/api/admin/discounts')
    const data = await response.json()

    if (!data.success) {
      discountsList.textContent = data.message || 'Errore caricamento sconti.'
      return
    }

    if (!data.discounts.length) {
      discountsList.textContent = 'Nessuno sconto creato.'
      return
    }

    discountsList.innerHTML = data.discounts
      .map((discount) => {
        const valueLabel =
          discount.type === 'fixed'
            ? formatMoney(discount.value || 0)
            : `${discount.value || 0}%`

        return `
          <article class="product-item">
            <h3>${escapeHtml(discount.code)}</h3>
            <p>${escapeHtml(discount.description || 'Nessuna descrizione')}</p>
            <div class="meta">
              <span>${escapeHtml(discount.type)}</span>
              <span>${valueLabel}</span>
              <span>Minimo: ${formatMoney(discount.min_subtotal_cents || 0)}</span>
              <span>${Number(discount.active) === 0 ? 'Disattivo' : 'Attivo'}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-discount="${discount.id}">Modifica</button>
              <button type="button" class="danger" data-disable-discount="${discount.id}">Disattiva</button>
            </div>
          </article>
        `
      })
      .join('')

    document.querySelectorAll('[data-edit-discount]').forEach((button) => {
      button.addEventListener('click', () => {
        const discount = data.discounts.find((item) => item.id === Number(button.dataset.editDiscount))
        fillDiscountForm(discount)
      })
    })

    document.querySelectorAll('[data-disable-discount]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm('Vuoi disattivare questo sconto?')
        if (!confirmed) return

        const response = await fetch('/api/admin/discounts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.disableDiscount),
          }),
        })
        const result = await response.json()

        if (!result.success) {
          alert(result.message || 'Errore disattivazione sconto.')
          return
        }

        resetDiscountForm()
        loadDiscounts()
      })
    })
  } catch {
    discountsList.textContent = 'Errore di connessione sconti.'
  }
}

discountForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  discountMessage.textContent = 'Salvataggio sconto...'

  const payload = getDiscountFormPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/discounts', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    if (!data.success) {
      discountMessage.textContent = data.message || 'Errore salvataggio sconto.'
      return
    }

    discountMessage.textContent = data.message || 'Sconto salvato.'
    resetDiscountForm()
    loadDiscounts()
  } catch {
    discountMessage.textContent = 'Errore di connessione sconti.'
  }
})

cancelDiscountEdit?.addEventListener('click', resetDiscountForm)
refreshDiscountsButton?.addEventListener('click', loadDiscounts)
loadDiscounts()

// ===============================
// CAMPAGNE MARKETING
// ===============================

const campaignForm = document.querySelector('#campaignForm')
const campaignsList = document.querySelector('#campaignsList')
const refreshCampaignsButton = document.querySelector('#refreshCampaignsButton')
const campaignMessage = document.querySelector('#campaignMessage')
const campaignFormTitle = document.querySelector('#campaignFormTitle')
const campaignSubmitButton = document.querySelector('#campaignSubmitButton')
const cancelCampaignEdit = document.querySelector('#cancelCampaignEdit')

function resetCampaignForm() {
  if (!campaignForm) return
  campaignForm.reset()
  document.querySelector('#campaignId').value = ''
  document.querySelector('#campaignActive').checked = true
  campaignFormTitle.textContent = 'Aggiungi campagna'
  campaignSubmitButton.textContent = 'Salva campagna'
  cancelCampaignEdit.hidden = true
  campaignMessage.textContent = ''
}

function fillCampaignForm(campaign) {
  document.querySelector('#campaignId').value = campaign.id
  document.querySelector('#campaignTitle').value = campaign.title || ''
  document.querySelector('#campaignDescription').value = campaign.description || ''
  document.querySelector('#campaignDiscountCode').value = campaign.discount_code || ''
  document.querySelector('#campaignStartsAt').value = campaign.starts_at || ''
  document.querySelector('#campaignEndsAt').value = campaign.ends_at || ''
  document.querySelector('#campaignActive').checked = Number(campaign.active) !== 0
  campaignFormTitle.textContent = 'Modifica campagna'
  campaignSubmitButton.textContent = 'Aggiorna campagna'
  cancelCampaignEdit.hidden = false
}

function readCampaignPayload() {
  return {
    id: document.querySelector('#campaignId').value,
    title: document.querySelector('#campaignTitle').value.trim(),
    description: document.querySelector('#campaignDescription').value.trim(),
    discount_code: document.querySelector('#campaignDiscountCode').value.trim(),
    starts_at: document.querySelector('#campaignStartsAt').value,
    ends_at: document.querySelector('#campaignEndsAt').value,
    active: document.querySelector('#campaignActive').checked,
  }
}

async function loadCampaigns() {
  if (!campaignsList) return
  campaignsList.textContent = 'Caricamento campagne...'

  try {
    const response = await fetch('/api/admin/marketing')
    const data = await response.json()

    if (!data.success) {
      campaignsList.textContent = data.message || 'Errore caricamento campagne.'
      return
    }

    if (!data.campaigns.length) {
      campaignsList.textContent = 'Nessuna campagna creata.'
      return
    }

    campaignsList.innerHTML = data.campaigns
      .map(
        (campaign) => `
          <article class="product-item">
            <h3>${escapeHtml(campaign.title)}</h3>
            <p>${escapeHtml(campaign.description || 'Nessuna descrizione')}</p>
            <div class="meta">
              <span>${Number(campaign.active) === 0 ? 'Disattiva' : 'Attiva'}</span>
              <span>Coupon: ${escapeHtml(campaign.discount_code || 'N/D')}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-campaign="${campaign.id}">Modifica</button>
              <button type="button" class="danger" data-disable-campaign="${campaign.id}">Disattiva</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-campaign]').forEach((button) => {
      button.addEventListener('click', () => {
        const campaign = data.campaigns.find((item) => item.id === Number(button.dataset.editCampaign))
        fillCampaignForm(campaign)
      })
    })

    document.querySelectorAll('[data-disable-campaign]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/marketing', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableCampaign) }),
        })
        resetCampaignForm()
        loadCampaigns()
      })
    })
  } catch {
    campaignsList.textContent = 'Errore di connessione campagne.'
  }
}

campaignForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  campaignMessage.textContent = 'Salvataggio campagna...'
  const payload = readCampaignPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/marketing', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    campaignMessage.textContent = data.message || 'Campagna salvata.'
    if (data.success) {
      resetCampaignForm()
      loadCampaigns()
    }
  } catch {
    campaignMessage.textContent = 'Errore di connessione campagne.'
  }
})

cancelCampaignEdit?.addEventListener('click', resetCampaignForm)
refreshCampaignsButton?.addEventListener('click', loadCampaigns)
loadCampaigns()

// ===============================
// MEDIA MANAGER
// ===============================

const mediaForm = document.querySelector('#mediaForm')
const mediaUploadForm = document.querySelector('#mediaUploadForm')
const mediaUploadFile = document.querySelector('#mediaUploadFile')
const mediaUploadName = document.querySelector('#mediaUploadName')
const mediaUploadAltText = document.querySelector('#mediaUploadAltText')
const mediaUploadMessage = document.querySelector('#mediaUploadMessage')
const mediaList = document.querySelector('#mediaList')
const refreshMediaButton = document.querySelector('#refreshMediaButton')
const mediaMessage = document.querySelector('#mediaMessage')
const mediaFormTitle = document.querySelector('#mediaFormTitle')
const mediaSubmitButton = document.querySelector('#mediaSubmitButton')
const cancelMediaEdit = document.querySelector('#cancelMediaEdit')
const mediaAdminSearch = document.querySelector('#mediaAdminSearch')

function resetMediaForm() {
  if (!mediaForm) return
  mediaForm.reset()
  document.querySelector('#mediaId').value = ''
  mediaFormTitle.textContent = 'Aggiungi media'
  mediaSubmitButton.textContent = 'Salva media'
  cancelMediaEdit.hidden = true
  mediaMessage.textContent = ''
}

function fillMediaForm(media) {
  document.querySelector('#mediaId').value = media.id
  document.querySelector('#mediaName').value = media.name || ''
  document.querySelector('#mediaUrl').value = media.url || ''
  document.querySelector('#mediaType').value = media.type || 'image'
  document.querySelector('#mediaAltText').value = media.alt_text || ''
  mediaFormTitle.textContent = 'Modifica media'
  mediaSubmitButton.textContent = 'Aggiorna media'
  cancelMediaEdit.hidden = false
}

function getMediaPayload() {
  return {
    id: document.querySelector('#mediaId').value,
    name: document.querySelector('#mediaName').value.trim(),
    url: document.querySelector('#mediaUrl').value.trim(),
    type: document.querySelector('#mediaType').value,
    alt_text: document.querySelector('#mediaAltText').value.trim(),
  }
}

async function loadMediaItems() {
  if (!mediaList) return

  renderAdminListState(mediaList, 'Caricamento media...', 'loading')

  try {
    const response = await fetch('/api/admin/media')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(mediaList, data.message || 'Errore caricamento media.', 'error')
      return
    }

    if (!data.media.length) {
      renderAdminListState(mediaList, 'Nessun media salvato.')
      return
    }

    const search = normalizeAdminSearch(mediaAdminSearch?.value)
    const visibleMedia = data.media.filter((media) =>
      adminItemMatchesSearch(media, search, ['name', 'url', 'type', 'alt_text', 'mime_type']),
    )

    if (!visibleMedia.length) {
      renderAdminListState(mediaList, 'Nessun media corrisponde alla ricerca.')
      return
    }

    mediaList.innerHTML = visibleMedia
      .map(
        (media) => `
          <article class="product-item media-item">
            ${
              media.type === 'image'
                ? `<img src="${escapeHtml(media.url)}" alt="${escapeHtml(media.alt_text || media.name)}">`
                : '<div class="media-file-preview">File</div>'
            }
            <h3>${escapeHtml(media.name)}</h3>
            <p>${escapeHtml(media.url)}</p>
            <div class="meta">
              <span>${escapeHtml(media.type)}</span>
              <span>${escapeHtml(media.alt_text || 'Alt text vuoto')}</span>
              <span>${escapeHtml(media.mime_type || 'mime N/D')}</span>
              <span>${media.size ? `${Math.round(Number(media.size) / 1024)} KB` : 'size N/D'}</span>
              <span>${escapeHtml(media.storage_provider || 'url')}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-media="${media.id}">Modifica</button>
              <a class="button-link" href="${escapeHtml(media.url)}" target="_blank" rel="noreferrer">Apri</a>
              <button type="button" data-copy-media="${escapeHtml(media.url)}">Copia URL</button>
              <button type="button" class="danger" data-delete-media="${media.id}">Elimina</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-media]').forEach((button) => {
      button.addEventListener('click', () => {
        const media = data.media.find((item) => item.id === Number(button.dataset.editMedia))
        fillMediaForm(media)
      })
    })

    document.querySelectorAll('[data-copy-media]').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copyMedia)
        } catch {
          alert(button.dataset.copyMedia)
        }
      })
    })

    document.querySelectorAll('[data-delete-media]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm('Vuoi eliminare questo media dalla libreria?')
        if (!confirmed) return

        const response = await fetch('/api/admin/media', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.deleteMedia),
          }),
        })
        const result = await response.json()

        if (!result.success) {
          alert(result.message || 'Errore eliminazione media.')
          return
        }

        resetMediaForm()
        loadMediaItems()
      })
    })
  } catch {
    renderAdminListState(mediaList, 'Errore di connessione media.', 'error')
  }
}

mediaForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  mediaMessage.textContent = 'Salvataggio media...'

  const payload = getMediaPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/media', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    if (!data.success) {
      mediaMessage.textContent = data.message || 'Errore salvataggio media.'
      return
    }

    mediaMessage.textContent = data.message || 'Media salvato.'
    resetMediaForm()
    loadMediaItems()
  } catch {
    mediaMessage.textContent = 'Errore di connessione media.'
  }
})

mediaUploadForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!mediaUploadFile?.files?.[0]) {
    mediaUploadMessage.textContent = 'Seleziona un file da caricare.'
    return
  }

  mediaUploadMessage.textContent = 'Upload in corso...'

  const formData = new FormData()
  formData.append('file', mediaUploadFile.files[0])
  formData.append('name', mediaUploadName?.value.trim() || mediaUploadFile.files[0].name)
  formData.append('alt_text', mediaUploadAltText?.value.trim() || '')

  try {
    const response = await fetch('/api/admin/media/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()

    if (!data.success) {
      mediaUploadMessage.textContent =
        data.message || 'Upload non disponibile. Usa URL manuale.'
      return
    }

    mediaUploadMessage.textContent = data.message || 'Media caricato.'

    if (data.media?.url) {
      document.querySelector('#mediaName').value = data.media.name || ''
      document.querySelector('#mediaUrl').value = data.media.url
      document.querySelector('#mediaType').value = data.media.type || 'image'
      document.querySelector('#mediaAltText').value = data.media.alt_text || ''
    }

    mediaUploadForm.reset()
    loadMediaItems()
  } catch {
    mediaUploadMessage.textContent =
      'Upload non riuscito. Usa URL manuale o verifica la configurazione storage.'
  }
})

cancelMediaEdit?.addEventListener('click', resetMediaForm)
refreshMediaButton?.addEventListener('click', loadMediaItems)
mediaAdminSearch?.addEventListener('input', loadMediaItems)
loadMediaItems()

// ===============================
// METAFIELDS
// ===============================

const metafieldDefinitionForm = document.querySelector('#metafieldDefinitionForm')
const metafieldDefinitionMessage = document.querySelector('#metafieldDefinitionMessage')
const metafieldValueEntityType = document.querySelector('#metafieldValueEntityType')
const metafieldEntitySelect = document.querySelector('#metafieldEntitySelect')
const metafieldValuesFields = document.querySelector('#metafieldValuesFields')
const metafieldValuesMessage = document.querySelector('#metafieldValuesMessage')
const saveMetafieldValuesButton = document.querySelector('#saveMetafieldValuesButton')

let metafieldResources = {
  product: [],
  collection: [],
  page: [],
}
let currentMetafieldDefinitions = []

function getMetafieldEntityLabel(entityType, record) {
  if (entityType === 'product') return record.name || record.slug || `Prodotto ${record.id}`
  if (entityType === 'collection') return record.name || record.slug || `Collezione ${record.id}`
  return record.title || record.slug || `Pagina ${record.id}`
}

async function loadMetafieldResources() {
  if (!metafieldDefinitionForm) return

  try {
    const [productsResponse, collectionsResponse, pagesResponse] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/admin/collections'),
      fetch('/api/admin/pages'),
    ])

    const productsData = await productsResponse.json()
    const collectionsData = await collectionsResponse.json()
    const pagesData = await pagesResponse.json()

    metafieldResources = {
      product: productsData.success ? productsData.products || [] : [],
      collection: collectionsData.success ? collectionsData.collections || [] : [],
      page: pagesData.success ? pagesData.pages || [] : [],
    }

    renderMetafieldEntityOptions()
    loadMetafieldValues()
  } catch {
    metafieldValuesFields.textContent = 'Errore caricamento record metafields.'
  }
}

function renderMetafieldEntityOptions() {
  if (!metafieldEntitySelect) return

  const entityType = metafieldValueEntityType.value
  const records = metafieldResources[entityType] || []

  metafieldEntitySelect.innerHTML =
    '<option value="">Seleziona record</option>' +
    records
      .map(
        (record) => `
          <option value="${record.id}">
            ${escapeHtml(getMetafieldEntityLabel(entityType, record))}
          </option>
        `,
      )
      .join('')
}

function renderMetafieldValueFields(definitions = []) {
  if (!metafieldValuesFields) return

  currentMetafieldDefinitions = definitions

  if (!definitions.length) {
    metafieldValuesFields.textContent = 'Nessuna definizione metafield per questa entita.'
    return
  }

  metafieldValuesFields.innerHTML = definitions
    .map((definition) => {
      if (definition.type === 'boolean') {
        return `
          <label class="inline-check">
            <input
              type="checkbox"
              data-metafield-key="${escapeHtml(definition.key)}"
              ${definition.value === true || definition.value === '1' ? 'checked' : ''}
            />
            ${escapeHtml(definition.label)}
          </label>
        `
      }

      const inputType = definition.type === 'url' ? 'url' : definition.type === 'number' ? 'number' : 'text'

      return `
        <label>
          ${escapeHtml(definition.label)}
          <input
            type="${inputType}"
            data-metafield-key="${escapeHtml(definition.key)}"
            value="${escapeHtml(definition.value || '')}"
          />
        </label>
      `
    })
    .join('')
}

async function loadMetafieldValues() {
  if (!metafieldValuesFields || !metafieldEntitySelect?.value) {
    renderMetafieldValueFields([])
    return
  }

  const entityType = metafieldValueEntityType.value
  const entityId = metafieldEntitySelect.value
  metafieldValuesFields.textContent = 'Caricamento metafields...'

  try {
    const response = await fetch(
      `/api/admin/metafields?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`,
    )
    const data = await response.json()

    if (!data.success) {
      metafieldValuesFields.textContent = data.message || 'Errore caricamento metafields.'
      return
    }

    renderMetafieldValueFields(data.definitions || [])
  } catch {
    metafieldValuesFields.textContent = 'Errore di connessione metafields.'
  }
}

function readMetafieldValueFields() {
  return currentMetafieldDefinitions.reduce((values, definition) => {
    const field = metafieldValuesFields.querySelector(`[data-metafield-key="${definition.key}"]`)
    values[definition.key] = definition.type === 'boolean' ? field?.checked || false : field?.value || ''
    return values
  }, {})
}

metafieldDefinitionForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  metafieldDefinitionMessage.textContent = 'Creazione metafield...'

  try {
    const response = await fetch('/api/admin/metafields', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_type: document.querySelector('#metafieldEntityType').value,
        key: document.querySelector('#metafieldKey').value.trim(),
        label: document.querySelector('#metafieldLabel').value.trim(),
        type: document.querySelector('#metafieldType').value,
      }),
    })
    const data = await response.json()

    if (!data.success) {
      metafieldDefinitionMessage.textContent = data.message || 'Errore creazione metafield.'
      return
    }

    metafieldDefinitionMessage.textContent = data.message || 'Metafield creato.'
    metafieldDefinitionForm.reset()
    await loadMetafieldValues()
  } catch {
    metafieldDefinitionMessage.textContent = 'Errore di connessione metafields.'
  }
})

metafieldValueEntityType?.addEventListener('change', () => {
  renderMetafieldEntityOptions()
  loadMetafieldValues()
})

metafieldEntitySelect?.addEventListener('change', loadMetafieldValues)

saveMetafieldValuesButton?.addEventListener('click', async () => {
  if (!metafieldEntitySelect.value) {
    metafieldValuesMessage.textContent = 'Seleziona un record.'
    return
  }

  metafieldValuesMessage.textContent = 'Salvataggio metafields...'

  try {
    const response = await fetch('/api/admin/metafields', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_type: metafieldValueEntityType.value,
        entity_id: Number(metafieldEntitySelect.value),
        values: readMetafieldValueFields(),
      }),
    })
    const data = await response.json()

    metafieldValuesMessage.textContent = data.message || (data.success ? 'Metafields salvati.' : 'Errore metafields.')
  } catch {
    metafieldValuesMessage.textContent = 'Errore di connessione metafields.'
  }
})

loadMetafieldResources()

// ===============================
// MARKETS
// ===============================

const marketForm = document.querySelector('#marketForm')
const marketsList = document.querySelector('#marketsList')
const marketMessage = document.querySelector('#marketMessage')
const refreshMarketsButton = document.querySelector('#refreshMarketsButton')
const marketFormTitle = document.querySelector('#marketFormTitle')
const marketSubmitButton = document.querySelector('#marketSubmitButton')
const cancelMarketEdit = document.querySelector('#cancelMarketEdit')

function resetMarketForm() {
  if (!marketForm) return
  marketForm.reset()
  document.querySelector('#marketId').value = ''
  document.querySelector('#marketActive').checked = true
  document.querySelector('#marketDefault').checked = false
  marketFormTitle.textContent = 'Aggiungi mercato'
  marketSubmitButton.textContent = 'Salva mercato'
  cancelMarketEdit.hidden = true
  marketMessage.textContent = ''
}

function fillMarketForm(market) {
  document.querySelector('#marketId').value = market.id
  document.querySelector('#marketName').value = market.name || ''
  document.querySelector('#marketHandle').value = market.handle || ''
  document.querySelector('#marketCountryCode').value = market.country_code || 'IT'
  document.querySelector('#marketLanguageCode').value = market.language_code || 'it'
  document.querySelector('#marketCurrencyCode').value = market.currency_code || 'EUR'
  document.querySelector('#marketActive').checked = Number(market.active) !== 0
  document.querySelector('#marketDefault').checked = Number(market.is_default) === 1
  marketFormTitle.textContent = 'Modifica mercato'
  marketSubmitButton.textContent = 'Aggiorna mercato'
  cancelMarketEdit.hidden = false
}

function readMarketPayload() {
  return {
    id: document.querySelector('#marketId').value,
    name: document.querySelector('#marketName').value.trim(),
    handle: document.querySelector('#marketHandle').value.trim(),
    country_code: document.querySelector('#marketCountryCode').value.trim(),
    language_code: document.querySelector('#marketLanguageCode').value.trim(),
    currency_code: document.querySelector('#marketCurrencyCode').value.trim(),
    active: document.querySelector('#marketActive').checked,
    is_default: document.querySelector('#marketDefault').checked,
  }
}

async function loadMarketsAdmin() {
  if (!marketsList) return
  marketsList.textContent = 'Caricamento markets...'

  try {
    const response = await fetch('/api/admin/markets')
    const data = await response.json()

    if (!data.success) {
      marketsList.textContent = data.message || 'Errore markets.'
      return
    }

    if (!data.markets.length) {
      marketsList.textContent = 'Nessun mercato.'
      return
    }

    marketsList.innerHTML = data.markets
      .map(
        (market) => `
          <article class="product-item">
            <h3>${escapeHtml(market.name)}</h3>
            <div class="meta">
              <span>${escapeHtml(market.handle)}</span>
              <span>${escapeHtml(market.country_code)} / ${escapeHtml(market.language_code)}</span>
              <span>${escapeHtml(market.currency_code)}</span>
              <span>${market.is_default ? 'Default' : 'Non default'}</span>
              <span>${market.active ? 'Attivo' : 'Disattivo'}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-market="${market.id}">Modifica</button>
              <button type="button" class="danger" data-disable-market="${market.id}">Disattiva</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-market]').forEach((button) => {
      button.addEventListener('click', () => {
        const market = data.markets.find((item) => item.id === Number(button.dataset.editMarket))
        fillMarketForm(market)
      })
    })

    document.querySelectorAll('[data-disable-market]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/markets', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableMarket) }),
        })
        resetMarketForm()
        loadMarketsAdmin()
      })
    })
  } catch {
    marketsList.textContent = 'Errore di connessione markets.'
  }
}

marketForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  marketMessage.textContent = 'Salvataggio mercato...'
  const payload = readMarketPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/markets', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    marketMessage.textContent = data.message || 'Mercato salvato.'
    if (data.success) {
      resetMarketForm()
      loadMarketsAdmin()
    }
  } catch {
    marketMessage.textContent = 'Errore di connessione markets.'
  }
})

cancelMarketEdit?.addEventListener('click', resetMarketForm)
refreshMarketsButton?.addEventListener('click', loadMarketsAdmin)
loadMarketsAdmin()

// ===============================
// ANALYTICS
// ===============================

const analyticsDashboard = document.querySelector('#analyticsDashboard')
const refreshAnalyticsButton = document.querySelector('#refreshAnalyticsButton')

async function loadAnalyticsDashboard() {
  if (!analyticsDashboard) return
  analyticsDashboard.textContent = 'Caricamento analytics...'

  try {
    const response = await fetch('/api/admin/analytics')
    const data = await response.json()

    if (!data.success) {
      analyticsDashboard.textContent = data.message || 'Errore analytics.'
      return
    }

    analyticsDashboard.innerHTML = `
      <article class="admin-record">
        <div class="admin-record-head">
          <div>
            <h3>Conteggi eventi</h3>
            <p>Eventi registrati senza dati personali sensibili.</p>
          </div>
        </div>
        <div class="meta">
          ${(data.counts || [])
            .map((item) => `<span>${escapeHtml(item.event_type)}: ${item.count}</span>`)
            .join('') || '<span>Nessun evento</span>'}
        </div>
      </article>
      ${(data.recent || [])
        .map(
          (event) => `
            <article class="admin-record">
              <div class="admin-record-head">
                <div>
                  <h3>${escapeHtml(event.event_type)}</h3>
                  <p>${escapeHtml(event.path || '/')} ${event.entity_id ? `&middot; ${escapeHtml(event.entity_id)}` : ''}</p>
                </div>
                <strong>${escapeHtml(event.created_at || '')}</strong>
              </div>
            </article>
          `,
        )
        .join('')}
    `
  } catch {
    analyticsDashboard.textContent = 'Errore di connessione analytics.'
  }
}

refreshAnalyticsButton?.addEventListener('click', loadAnalyticsDashboard)
loadAnalyticsDashboard()

// ===============================
// INTEGRAZIONI
// ===============================

const integrationForm = document.querySelector('#integrationForm')
const integrationsList = document.querySelector('#integrationsList')
const integrationMessage = document.querySelector('#integrationMessage')
const refreshIntegrationsButton = document.querySelector('#refreshIntegrationsButton')
const integrationFormTitle = document.querySelector('#integrationFormTitle')
const integrationSubmitButton = document.querySelector('#integrationSubmitButton')
const cancelIntegrationEdit = document.querySelector('#cancelIntegrationEdit')

function resetIntegrationForm() {
  if (!integrationForm) return
  integrationForm.reset()
  document.querySelector('#integrationId').value = ''
  document.querySelector('#integrationConfigJson').value = '{}'
  document.querySelector('#integrationActive').checked = true
  integrationFormTitle.textContent = 'Aggiungi integrazione'
  integrationSubmitButton.textContent = 'Salva integrazione'
  cancelIntegrationEdit.hidden = true
  integrationMessage.textContent = ''
}

function fillIntegrationForm(integration) {
  document.querySelector('#integrationId').value = integration.id
  document.querySelector('#integrationName').value = integration.name || ''
  document.querySelector('#integrationType').value = integration.type || 'custom'
  document.querySelector('#integrationWebhookUrl').value = integration.webhook_url || ''
  document.querySelector('#integrationConfigJson').value = stringifyForTextarea(integration.config, {})
  document.querySelector('#integrationActive').checked = Number(integration.active) !== 0
  integrationFormTitle.textContent = 'Modifica integrazione'
  integrationSubmitButton.textContent = 'Aggiorna integrazione'
  cancelIntegrationEdit.hidden = false
}

async function loadIntegrations() {
  if (!integrationsList) return
  integrationsList.textContent = 'Caricamento integrazioni...'

  try {
    const response = await fetch('/api/admin/integrations')
    const data = await response.json()

    if (!data.success) {
      integrationsList.textContent = data.message || 'Errore integrazioni.'
      return
    }

    integrationsList.innerHTML = data.integrations.length
      ? data.integrations
          .map(
            (integration) => `
              <article class="product-item">
                <h3>${escapeHtml(integration.name)}</h3>
                <p>${escapeHtml(integration.webhook_url || 'Nessun webhook')}</p>
                <div class="meta">
                  <span>${escapeHtml(integration.type)}</span>
                  <span>${integration.active ? 'Attiva' : 'Disattiva'}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-integration="${integration.id}">Modifica</button>
                  <button type="button" class="danger" data-disable-integration="${integration.id}">Disattiva</button>
                </div>
              </article>
            `,
          )
          .join('')
      : 'Nessuna integrazione.'

    document.querySelectorAll('[data-edit-integration]').forEach((button) => {
      button.addEventListener('click', () => {
        const integration = data.integrations.find((item) => item.id === Number(button.dataset.editIntegration))
        fillIntegrationForm(integration)
      })
    })

    document.querySelectorAll('[data-disable-integration]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/integrations', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableIntegration) }),
        })
        resetIntegrationForm()
        loadIntegrations()
      })
    })
  } catch {
    integrationsList.textContent = 'Errore di connessione integrazioni.'
  }
}

integrationForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  integrationMessage.textContent = 'Salvataggio integrazione...'
  const id = document.querySelector('#integrationId').value

  try {
    const payload = {
      id,
      name: document.querySelector('#integrationName').value.trim(),
      type: document.querySelector('#integrationType').value.trim(),
      webhook_url: document.querySelector('#integrationWebhookUrl').value.trim(),
      config: readJsonTextarea('#integrationConfigJson', {}),
      active: document.querySelector('#integrationActive').checked,
    }
    const response = await fetch('/api/admin/integrations', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    integrationMessage.textContent = data.message || 'Integrazione salvata.'
    if (data.success) {
      resetIntegrationForm()
      loadIntegrations()
    }
  } catch (error) {
    integrationMessage.textContent = 'Errore integrazione. Verifica il JSON configurazione e riprova.'
  }
})

cancelIntegrationEdit?.addEventListener('click', resetIntegrationForm)
refreshIntegrationsButton?.addEventListener('click', loadIntegrations)
loadIntegrations()

// ===============================
// UTENTI / PERMESSI
// ===============================

const adminUserForm = document.querySelector('#adminUserForm')
const adminUsersList = document.querySelector('#adminUsersList')
const adminUserMessage = document.querySelector('#adminUserMessage')
const refreshAdminUsersButton = document.querySelector('#refreshAdminUsersButton')
const adminUserFormTitle = document.querySelector('#adminUserFormTitle')
const adminUserSubmitButton = document.querySelector('#adminUserSubmitButton')
const cancelAdminUserEdit = document.querySelector('#cancelAdminUserEdit')
const adminUserPasswordInput = document.querySelector('#adminUserPassword')

function resetAdminUserForm() {
  if (!adminUserForm) return
  adminUserForm.reset()
  document.querySelector('#adminUserId').value = ''
  document.querySelector('#adminUserActive').checked = true
  if (adminUserPasswordInput) {
    adminUserPasswordInput.value = ''
    adminUserPasswordInput.required = true
    adminUserPasswordInput.placeholder = 'Minimo 8 caratteri'
  }
  adminUserFormTitle.textContent = 'Aggiungi utente'
  adminUserSubmitButton.textContent = 'Salva utente'
  cancelAdminUserEdit.hidden = true
  adminUserMessage.textContent = ''
}

function fillAdminUserForm(user) {
  document.querySelector('#adminUserId').value = user.id
  document.querySelector('#adminUserName').value = user.name || ''
  document.querySelector('#adminUserEmail').value = user.email || ''
  document.querySelector('#adminUserRole').value = user.role || 'viewer'
  document.querySelector('#adminUserActive').checked = Number(user.active) !== 0
  if (adminUserPasswordInput) {
    adminUserPasswordInput.value = ''
    adminUserPasswordInput.required = false
    adminUserPasswordInput.placeholder = 'Lascia vuota per non cambiarla'
  }
  adminUserFormTitle.textContent = 'Modifica utente'
  adminUserSubmitButton.textContent = 'Aggiorna utente'
  cancelAdminUserEdit.hidden = false
}

async function loadAdminUsers() {
  if (!adminUsersList) return

  if (!canAdminManageUsers()) {
    adminUsersList.textContent = 'Permessi insufficienti per gestire gli utenti admin.'
    if (adminUserForm) adminUserForm.hidden = true
    return
  }

  if (adminUserForm) adminUserForm.hidden = false
  adminUsersList.textContent = 'Caricamento utenti...'

  try {
    const response = await fetch('/api/admin/users')
    const data = await response.json()

    if (!data.success) {
      adminUsersList.textContent = data.message || 'Errore utenti.'
      return
    }

    adminUsersList.innerHTML = data.users.length
      ? data.users
          .map(
            (user) => `
              <article class="product-item">
                <h3>${escapeHtml(user.name)}</h3>
                <p>${escapeHtml(user.email)}</p>
                <div class="meta">
                  <span>${escapeHtml(user.role)}</span>
                  <span>${user.active ? 'Attivo' : 'Disattivo'}</span>
                  <span>${user.has_password ? 'Login attivo' : 'Password mancante'}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-admin-user="${user.id}">Modifica</button>
                  <button type="button" class="danger" data-disable-admin-user="${user.id}">Disattiva</button>
                </div>
              </article>
            `,
          )
          .join('')
      : 'Nessun utente admin.'

    document.querySelectorAll('[data-edit-admin-user]').forEach((button) => {
      button.addEventListener('click', () => {
        const user = data.users.find((item) => item.id === Number(button.dataset.editAdminUser))
        fillAdminUserForm(user)
      })
    })

    document.querySelectorAll('[data-disable-admin-user]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableAdminUser) }),
        })
        resetAdminUserForm()
        loadAdminUsers()
      })
    })
  } catch {
    adminUsersList.textContent = 'Errore di connessione utenti.'
  }
}

adminUserForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!canAdminManageUsers()) {
    adminUserMessage.textContent = 'Permessi insufficienti.'
    return
  }

  adminUserMessage.textContent = 'Salvataggio utente...'
  const id = document.querySelector('#adminUserId').value

  try {
    const response = await fetch('/api/admin/users', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: document.querySelector('#adminUserName').value.trim(),
        email: document.querySelector('#adminUserEmail').value.trim(),
        password: document.querySelector('#adminUserPassword')?.value || '',
        role: document.querySelector('#adminUserRole').value,
        active: document.querySelector('#adminUserActive').checked,
      }),
    })
    const data = await response.json()
    adminUserMessage.textContent = data.message || 'Utente salvato.'
    if (data.success) {
      resetAdminUserForm()
      loadAdminUsers()
    }
  } catch {
    adminUserMessage.textContent = 'Errore di connessione utenti.'
  }
})

cancelAdminUserEdit?.addEventListener('click', resetAdminUserForm)
refreshAdminUsersButton?.addEventListener('click', loadAdminUsers)
loadAdminUsers()

// ===============================
// ACTIVITY LOG
// ===============================

const activityLogList = document.querySelector('#activityLogList')
const refreshActivityButton = document.querySelector('#refreshActivityButton')

async function loadActivityLog() {
  if (!activityLogList) return

  if (!canAdminViewSensitiveSettings()) {
    activityLogList.textContent = 'Permessi insufficienti per leggere l\'activity log.'
    return
  }

  activityLogList.textContent = 'Caricamento activity log...'

  try {
    const response = await fetch('/api/admin/activity')
    const data = await response.json()

    if (!data.success) {
      activityLogList.textContent = data.message || 'Errore activity log.'
      return
    }

    activityLogList.innerHTML = data.logs.length
      ? data.logs
          .map(
            (log) => `
              <article class="admin-record">
                <div class="admin-record-head">
                  <div>
                    <h3>${escapeHtml(log.action)} / ${escapeHtml(log.entity_type)}</h3>
                    <p>${escapeHtml(log.description || '')}</p>
                  </div>
                  <strong>${escapeHtml(log.created_at || '')}</strong>
                </div>
                <div class="meta"><span>ID: ${escapeHtml(log.entity_id || 'N/D')}</span></div>
              </article>
            `,
          )
          .join('')
      : 'Nessun log.'
  } catch {
    activityLogList.textContent = 'Errore di connessione activity log.'
  }
}

refreshActivityButton?.addEventListener('click', loadActivityLog)
loadActivityLog()

// ===============================
// NOTIFICHE
// ===============================

const notificationForm = document.querySelector('#notificationForm')
const notificationsList = document.querySelector('#notificationsList')
const notificationMessage = document.querySelector('#notificationMessage')
const refreshNotificationsButton = document.querySelector('#refreshNotificationsButton')
const notificationFormTitle = document.querySelector('#notificationFormTitle')
const notificationSubmitButton = document.querySelector('#notificationSubmitButton')
const cancelNotificationEdit = document.querySelector('#cancelNotificationEdit')

function resetNotificationForm() {
  if (!notificationForm) return
  notificationForm.reset()
  document.querySelector('#notificationId').value = ''
  document.querySelector('#notificationActive').checked = true
  notificationFormTitle.textContent = 'Aggiungi template'
  notificationSubmitButton.textContent = 'Salva template'
  cancelNotificationEdit.hidden = true
  notificationMessage.textContent = ''
}

function fillNotificationForm(template) {
  document.querySelector('#notificationId').value = template.id
  document.querySelector('#notificationType').value = template.type || 'generic'
  document.querySelector('#notificationTitle').value = template.title || ''
  document.querySelector('#notificationSubject').value = template.subject || ''
  document.querySelector('#notificationBody').value = template.body || ''
  document.querySelector('#notificationActive').checked = Number(template.active) !== 0
  notificationFormTitle.textContent = 'Modifica template'
  notificationSubmitButton.textContent = 'Aggiorna template'
  cancelNotificationEdit.hidden = false
}

async function loadNotifications() {
  if (!notificationsList) return
  notificationsList.textContent = 'Caricamento notifiche...'

  try {
    const response = await fetch('/api/admin/notifications')
    const data = await response.json()

    if (!data.success) {
      notificationsList.textContent = data.message || 'Errore notifiche.'
      return
    }

    notificationsList.innerHTML = `
      ${(data.templates || [])
        .map(
          (template) => `
            <article class="product-item">
              <h3>${escapeHtml(template.title)}</h3>
              <p>${escapeHtml(template.subject || '')}</p>
              <div class="meta">
                <span>${escapeHtml(template.type)}</span>
                <span>${template.active ? 'Attivo' : 'Disattivo'}</span>
              </div>
              <div class="product-actions">
                <button type="button" data-edit-notification="${template.id}">Modifica</button>
                <button type="button" data-send-notification-mock="${template.id}">Invio mock</button>
                <button type="button" class="danger" data-disable-notification="${template.id}">Disattiva</button>
              </div>
            </article>
          `,
        )
        .join('') || 'Nessun template.'}
      ${(data.logs || [])
        .slice(0, 5)
        .map(
          (log) => `
            <article class="admin-record">
              <div class="admin-record-head">
                <div>
                  <h3>Log ${escapeHtml(log.type)}</h3>
                  <p>${escapeHtml(log.description || '')}</p>
                </div>
                <strong>${escapeHtml(log.created_at || '')}</strong>
              </div>
            </article>
          `,
        )
        .join('')}
    `

    document.querySelectorAll('[data-edit-notification]').forEach((button) => {
      button.addEventListener('click', () => {
        const template = data.templates.find((item) => item.id === Number(button.dataset.editNotification))
        fillNotificationForm(template)
      })
    })

    document.querySelectorAll('[data-send-notification-mock]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send_mock', template_id: Number(button.dataset.sendNotificationMock) }),
        })
        loadNotifications()
        loadActivityLog()
      })
    })

    document.querySelectorAll('[data-disable-notification]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/notifications', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableNotification) }),
        })
        resetNotificationForm()
        loadNotifications()
      })
    })
  } catch {
    notificationsList.textContent = 'Errore di connessione notifiche.'
  }
}

notificationForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  notificationMessage.textContent = 'Salvataggio notifica...'
  const id = document.querySelector('#notificationId').value

  try {
    const response = await fetch('/api/admin/notifications', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        type: document.querySelector('#notificationType').value,
        title: document.querySelector('#notificationTitle').value.trim(),
        subject: document.querySelector('#notificationSubject').value.trim(),
        body: document.querySelector('#notificationBody').value.trim(),
        active: document.querySelector('#notificationActive').checked,
      }),
    })
    const data = await response.json()
    notificationMessage.textContent = data.message || 'Notifica salvata.'
    if (data.success) {
      resetNotificationForm()
      loadNotifications()
    }
  } catch {
    notificationMessage.textContent = 'Errore di connessione notifiche.'
  }
})

cancelNotificationEdit?.addEventListener('click', resetNotificationForm)
refreshNotificationsButton?.addEventListener('click', loadNotifications)
loadNotifications()

// ===============================
// DOMINI
// ===============================

const domainForm = document.querySelector('#domainForm')
const domainsList = document.querySelector('#domainsList')
const domainMessage = document.querySelector('#domainMessage')
const refreshDomainsButton = document.querySelector('#refreshDomainsButton')
const domainFormTitle = document.querySelector('#domainFormTitle')
const domainSubmitButton = document.querySelector('#domainSubmitButton')
const cancelDomainEdit = document.querySelector('#cancelDomainEdit')

function resetDomainForm() {
  if (!domainForm) return
  domainForm.reset()
  document.querySelector('#domainId').value = ''
  document.querySelector('#domainPrimary').checked = false
  domainFormTitle.textContent = 'Aggiungi dominio'
  domainSubmitButton.textContent = 'Salva dominio'
  cancelDomainEdit.hidden = true
  domainMessage.textContent = ''
}

function fillDomainForm(domain) {
  document.querySelector('#domainId').value = domain.id
  document.querySelector('#domainName').value = domain.domain || ''
  document.querySelector('#domainType').value = domain.type || 'preview'
  document.querySelector('#domainStatus').value = domain.status || 'pending'
  document.querySelector('#domainDnsNotes').value = domain.dns_notes || ''
  document.querySelector('#domainPrimary').checked = Number(domain.is_primary) === 1
  domainFormTitle.textContent = 'Modifica dominio'
  domainSubmitButton.textContent = 'Aggiorna dominio'
  cancelDomainEdit.hidden = false
}

function readDomainPayload() {
  return {
    id: document.querySelector('#domainId').value,
    domain: document.querySelector('#domainName').value.trim(),
    type: document.querySelector('#domainType').value,
    status: document.querySelector('#domainStatus').value,
    dns_notes: document.querySelector('#domainDnsNotes').value.trim(),
    is_primary: document.querySelector('#domainPrimary').checked,
  }
}

async function loadDomainsAdmin() {
  if (!domainsList) return
  domainsList.textContent = 'Caricamento domini...'

  try {
    const response = await fetch('/api/admin/domains')
    const data = await response.json()

    if (!data.success) {
      domainsList.textContent = data.message || 'Errore domini.'
      return
    }

    domainsList.innerHTML = data.domains.length
      ? data.domains
          .map(
            (domain) => `
              <article class="product-item">
                <h3>${escapeHtml(domain.domain)}</h3>
                <p>${escapeHtml(domain.dns_notes || 'Nessuna nota DNS')}</p>
                <div class="meta">
                  <span>${escapeHtml(domain.type)}</span>
                  <span>${escapeHtml(domain.status)}</span>
                  <span>${domain.is_primary ? 'Primario' : 'Non primario'}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-domain="${domain.id}">Modifica</button>
                  <button type="button" class="danger" data-disable-domain="${domain.id}">Disabilita</button>
                </div>
              </article>
            `,
          )
          .join('')
      : 'Nessun dominio configurato.'

    document.querySelectorAll('[data-edit-domain]').forEach((button) => {
      button.addEventListener('click', () => {
        const domain = data.domains.find((item) => item.id === Number(button.dataset.editDomain))
        fillDomainForm(domain)
      })
    })

    document.querySelectorAll('[data-disable-domain]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/domains', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableDomain) }),
        })
        resetDomainForm()
        loadDomainsAdmin()
      })
    })
  } catch {
    domainsList.textContent = 'Errore di connessione domini.'
  }
}

domainForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  domainMessage.textContent = 'Salvataggio dominio...'
  const payload = readDomainPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/domains', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    domainMessage.textContent = data.message || 'Dominio salvato.'
    if (data.success) {
      resetDomainForm()
      loadDomainsAdmin()
    }
  } catch {
    domainMessage.textContent = 'Errore di connessione domini.'
  }
})

cancelDomainEdit?.addEventListener('click', resetDomainForm)
refreshDomainsButton?.addEventListener('click', loadDomainsAdmin)
loadDomainsAdmin()

// ===============================
// TENANTS
// ===============================

const tenantForm = document.querySelector('#tenantForm')
const tenantsList = document.querySelector('#tenantsList')
const tenantMessage = document.querySelector('#tenantMessage')
const refreshTenantsButton = document.querySelector('#refreshTenantsButton')
const tenantFormTitle = document.querySelector('#tenantFormTitle')
const tenantSubmitButton = document.querySelector('#tenantSubmitButton')
const cancelTenantEdit = document.querySelector('#cancelTenantEdit')

function resetTenantForm() {
  if (!tenantForm) return
  tenantForm.reset()
  document.querySelector('#tenantId').value = ''
  document.querySelector('#tenantDefault').checked = false
  tenantFormTitle.textContent = 'Aggiungi tenant'
  tenantSubmitButton.textContent = 'Salva tenant'
  cancelTenantEdit.hidden = true
  tenantMessage.textContent = ''
}

function fillTenantForm(tenant) {
  document.querySelector('#tenantId').value = tenant.id
  document.querySelector('#tenantName').value = tenant.name || ''
  document.querySelector('#tenantHandle').value = tenant.handle || ''
  document.querySelector('#tenantStatus').value = tenant.status || 'active'
  document.querySelector('#tenantNotes').value = tenant.notes || ''
  document.querySelector('#tenantDefault').checked = Number(tenant.is_default) === 1
  tenantFormTitle.textContent = 'Modifica tenant'
  tenantSubmitButton.textContent = 'Aggiorna tenant'
  cancelTenantEdit.hidden = false
}

function readTenantPayload() {
  return {
    id: document.querySelector('#tenantId').value,
    name: document.querySelector('#tenantName').value.trim(),
    handle: document.querySelector('#tenantHandle').value.trim(),
    status: document.querySelector('#tenantStatus').value,
    notes: document.querySelector('#tenantNotes').value.trim(),
    is_default: document.querySelector('#tenantDefault').checked,
  }
}

async function loadTenantsAdmin() {
  if (!tenantsList) return
  tenantsList.textContent = 'Caricamento tenants...'

  try {
    const response = await fetch('/api/admin/tenants')
    const data = await response.json()

    if (!data.success) {
      tenantsList.textContent = data.message || 'Errore tenants.'
      return
    }

    tenantsList.innerHTML = `
      <article class="admin-record">
        <p>${escapeHtml(data.note || '')}</p>
      </article>
      ${
        data.tenants.length
          ? data.tenants
              .map(
                (tenant) => `
                  <article class="product-item">
                    <h3>${escapeHtml(tenant.name)}</h3>
                    <p>${escapeHtml(tenant.notes || 'Nessuna nota')}</p>
                    <div class="meta">
                      <span>${escapeHtml(tenant.handle)}</span>
                      <span>${escapeHtml(tenant.status)}</span>
                      <span>${tenant.is_default ? 'Default' : 'Non default'}</span>
                    </div>
                    <div class="product-actions">
                      <button type="button" data-edit-tenant="${tenant.id}">Modifica</button>
                    </div>
                  </article>
                `,
              )
              .join('')
          : 'Nessun tenant.'
      }
    `

    document.querySelectorAll('[data-edit-tenant]').forEach((button) => {
      button.addEventListener('click', () => {
        const tenant = data.tenants.find((item) => item.id === Number(button.dataset.editTenant))
        fillTenantForm(tenant)
      })
    })
  } catch {
    tenantsList.textContent = 'Errore di connessione tenants.'
  }
}

tenantForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  tenantMessage.textContent = 'Salvataggio tenant...'
  const payload = readTenantPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/tenants', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    tenantMessage.textContent = data.message || 'Tenant salvato.'
    if (data.success) {
      resetTenantForm()
      loadTenantsAdmin()
    }
  } catch {
    tenantMessage.textContent = 'Errore di connessione tenants.'
  }
})

cancelTenantEdit?.addEventListener('click', resetTenantForm)
refreshTenantsButton?.addEventListener('click', loadTenantsAdmin)
loadTenantsAdmin()

// ===============================
// PERFORMANCE
// ===============================

const performanceForm = document.querySelector('#performanceForm')
const performanceDashboard = document.querySelector('#performanceDashboard')
const performanceMessage = document.querySelector('#performanceMessage')
const refreshPerformanceButton = document.querySelector('#refreshPerformanceButton')

async function loadPerformanceAdmin() {
  if (!performanceDashboard) return
  performanceDashboard.textContent = 'Caricamento performance...'

  try {
    const response = await fetch('/api/admin/performance')
    const data = await response.json()

    if (!data.success) {
      performanceDashboard.textContent = data.message || 'Errore performance.'
      return
    }

    document.querySelector('#performanceCacheSeconds').value = data.map?.public_cache_seconds || 120
    document.querySelector('#performanceFetchTimeout').value = data.map?.fetch_timeout_ms || 8000
    document.querySelector('#performanceLazyImages').checked = String(data.map?.lazy_images ?? '1') !== '0'

    performanceDashboard.innerHTML = `
      <article class="admin-record">
        <div class="admin-record-head">
          <div>
            <h3>Checklist produzione</h3>
            <p>Stato base non invasivo.</p>
          </div>
        </div>
        <div class="admin-lines">
          ${(data.checklist || [])
            .map((item) => `<div><span>${escapeHtml(item)}</span><strong>OK</strong></div>`)
            .join('')}
        </div>
      </article>
      <article class="admin-record">
        <div class="admin-record-head">
          <div>
            <h3>Domini / Tenant</h3>
            <p>${data.domains?.length || 0} domini, ${data.tenants?.length || 0} tenants configurati.</p>
          </div>
        </div>
      </article>
    `
  } catch {
    performanceDashboard.textContent = 'Errore di connessione performance.'
  }
}

performanceForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  performanceMessage.textContent = 'Salvataggio performance...'

  try {
    const response = await fetch('/api/admin/performance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settings: {
          public_cache_seconds: document.querySelector('#performanceCacheSeconds').value,
          fetch_timeout_ms: document.querySelector('#performanceFetchTimeout').value,
          lazy_images: document.querySelector('#performanceLazyImages').checked ? '1' : '0',
        },
      }),
    })
    const data = await response.json()
    performanceMessage.textContent = data.message || 'Performance salvata.'
    if (data.success) loadPerformanceAdmin()
  } catch {
    performanceMessage.textContent = 'Errore di connessione performance.'
  }
})

refreshPerformanceButton?.addEventListener('click', loadPerformanceAdmin)
loadPerformanceAdmin()

// ===============================
// ORDINI
// ===============================

const ordersList = document.querySelector('#ordersList')
const refreshOrdersButton = document.querySelector('#refreshOrdersButton')
const orderAdminSearch = document.querySelector('#orderAdminSearch')

function renderOrderStatusSelect(order) {
  const statuses = [
    ['new', 'Nuovo'],
    ['paid', 'Pagato'],
    ['processing', 'In lavorazione'],
    ['shipped', 'Spedito'],
    ['completed', 'Completato'],
    ['cancelled', 'Annullato'],
  ]

  return `
    <select data-order-status="${order.id}">
      ${statuses
        .map(
          ([value, label]) => `
            <option value="${value}" ${order.order_status === value ? 'selected' : ''}>
              ${label}
            </option>
          `,
        )
        .join('')}
    </select>
  `
}

async function loadOrders() {
  if (!ordersList) return

  renderAdminListState(ordersList, 'Caricamento ordini...', 'loading')

  try {
    const response = await fetch('/api/admin/orders')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(ordersList, data.message || 'Errore caricamento ordini.', 'error')
      return
    }

    if (!data.orders.length) {
      renderAdminListState(ordersList, 'Nessun ordine trovato.')
      return
    }

    const search = normalizeAdminSearch(orderAdminSearch?.value)
    const visibleOrders = data.orders.filter((order) =>
      adminItemMatchesSearch(order, search, [
        'id',
        'customer_name',
        'email',
        'payment_status',
        'payment_method',
        'payment_provider',
        'order_status',
        'shipping_address_city',
        'shipping_address_country',
      ]),
    )

    if (!visibleOrders.length) {
      renderAdminListState(ordersList, 'Nessun ordine corrisponde alla ricerca.')
      return
    }

    ordersList.innerHTML = visibleOrders
      .map(
        (order) => `
          <article class="admin-record">
            <div class="admin-record-head">
              <div>
                <h3>Ordine #${order.id}</h3>
                <p>${escapeHtml(order.customer_name || order.email || 'Cliente')}</p>
              </div>
              <strong>${formatMoney(order.total_cents || 0)}</strong>
            </div>

            <div class="meta">
              <span>Pagamento: ${escapeHtml(order.payment_status || 'pending')}</span>
              <span>Metodo: ${escapeHtml(order.payment_method || 'manual')}</span>
              <span>Provider: ${escapeHtml(order.payment_provider || 'manual')}</span>
              <span>Ref: ${escapeHtml(order.provider_reference || 'N/D')}</span>
              <span>Valuta: ${escapeHtml(order.currency || 'EUR')}</span>
              <span>Spedizione: ${escapeHtml(order.shipping_method || 'standard')}</span>
              <span>Sconto: ${order.discount_cents ? `-${formatMoney(order.discount_cents)}` : formatMoney(0)}</span>
              <span>Tasse: ${formatMoney(order.tax_cents || 0)}</span>
              <span>${escapeHtml(order.created_at || '')}</span>
            </div>

            <div class="admin-record-address">
              ${escapeHtml(order.shipping_address_line1 || '')}
              ${escapeHtml(order.shipping_address_city || '')}
              ${escapeHtml(order.shipping_address_postal_code || '')}
              ${escapeHtml(order.shipping_address_country || '')}
            </div>

            <details>
              <summary>Righe ordine (${order.items?.length || 0})</summary>
              <div class="admin-lines">
                ${(order.items || [])
                  .map(
                    (item) => `
                      <div>
                        <span>
                          ${escapeHtml(item.product_name || item.product_slug || `Prodotto ${item.product_id}`)}
                          ${item.variant_label ? ` - ${escapeHtml(item.variant_label)}` : ''}
                        </span>
                        <strong>${item.quantity} x ${formatMoney(item.price_cents || 0)}</strong>
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            </details>

            <label class="admin-status-control">
              Stato ordine
              ${renderOrderStatusSelect(order)}
            </label>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-order-status]').forEach((select) => {
      select.addEventListener('change', async () => {
        const response = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(select.dataset.orderStatus),
            order_status: select.value,
          }),
        })
        const result = await response.json()

        if (!result.success) {
          alert(result.message || 'Errore aggiornamento ordine.')
          await loadOrders()
        }
      })
    })
  } catch {
    renderAdminListState(ordersList, 'Errore di connessione agli ordini.', 'error')
  }
}

refreshOrdersButton?.addEventListener('click', loadOrders)
orderAdminSearch?.addEventListener('input', loadOrders)
loadOrders()

// ===============================
// CLIENTI
// ===============================

const customersList = document.querySelector('#customersList')
const refreshCustomersButton = document.querySelector('#refreshCustomersButton')
const customerAdminSearch = document.querySelector('#customerAdminSearch')

async function loadCustomers() {
  if (!customersList) return

  renderAdminListState(customersList, 'Caricamento clienti...', 'loading')

  try {
    const response = await fetch('/api/admin/customers')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(customersList, data.message || 'Errore caricamento clienti.', 'error')
      return
    }

    if (!data.customers.length) {
      renderAdminListState(customersList, 'Nessun cliente trovato.')
      return
    }

    const search = normalizeAdminSearch(customerAdminSearch?.value)
    const visibleCustomers = data.customers.filter((customer) =>
      adminItemMatchesSearch(customer, search, [
        'name',
        'email',
        'phone',
        'shipping_address_city',
        'shipping_address_country',
      ]),
    )

    if (!visibleCustomers.length) {
      renderAdminListState(customersList, 'Nessun cliente corrisponde alla ricerca.')
      return
    }

    customersList.innerHTML = visibleCustomers
      .map(
        (customer) => `
          <article class="admin-record">
            <div class="admin-record-head">
              <div>
                <h3>${escapeHtml(customer.name || customer.email)}</h3>
                <p>${escapeHtml(customer.email)}</p>
              </div>
              <strong>${customer.orders?.length || 0} ordini</strong>
            </div>

            <div class="meta">
              <span>Telefono: ${escapeHtml(customer.phone || 'N/D')}</span>
              <span>${escapeHtml(customer.shipping_address_city || 'Citta N/D')}</span>
              <span>${escapeHtml(customer.shipping_address_country || 'Paese N/D')}</span>
            </div>

            <div class="admin-record-address">
              ${escapeHtml(customer.shipping_address_line1 || '')}
              ${escapeHtml(customer.shipping_address_postal_code || '')}
            </div>

            <details>
              <summary>Storico ordini</summary>
              <div class="admin-lines">
                ${(customer.orders || [])
                  .map(
                    (order) => `
                      <div>
                        <span>Ordine #${order.id} - ${escapeHtml(order.order_status || 'new')}</span>
                        <strong>${formatMoney(order.total_cents || 0)}</strong>
                      </div>
                    `,
                  )
                  .join('') || '<p>Nessun ordine collegato.</p>'}
              </div>
            </details>
          </article>
        `,
      )
      .join('')
  } catch {
    renderAdminListState(customersList, 'Errore di connessione ai clienti.', 'error')
  }
}

refreshCustomersButton?.addEventListener('click', loadCustomers)
customerAdminSearch?.addEventListener('input', loadCustomers)
loadCustomers()

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
// IMPOSTAZIONI TEMA EDITOR
// ===============================

const themeSettingsButton = document.querySelector('#themeSettingsButton')
const closeThemeSettingsButton = document.querySelector('#closeThemeSettingsButton')
const themeSettingsDrawer = document.querySelector('#themeSettingsDrawer')
const themeSettingsOverlay = document.querySelector('#themeSettingsOverlay')
const themeSettingsForm = document.querySelector('#themeSettingsForm')
const themeSettingsGroups = document.querySelector('#themeSettingsGroups')
const themeSettingsMessage = document.querySelector('#themeSettingsMessage')

const themeEditorSettingKeys = new Set([
  'site_name',
  'logo_text',
  'logo_url',
  'logo_width',

  'primary_color',
  'accent_color',
  'background_color',
  'text_color',
  'body_font_family',
  'heading_font_family',
  'font_scale',
  'button_radius',
  'container_width',
  'section_spacing',

  'header_cta_text',
  'header_cta_url',
  'header_style',

  'footer_text',
  'footer_cta_text',
  'footer_cta_url',
  'footer_layout',
])

const themeGroupLabels = {
  brand: 'Brand',
  theme: 'Tema',
  header: 'Header',
  footer: 'Footer',
}

const themeGroupDescriptions = {
  brand: 'Logo, nome sito e identita principale.',
  theme: 'Colori, tipografie, spaziature e stile generale.',
  header: 'Stile header e call to action principale.',
  footer: 'Testi e layout footer visibili sul sito.',
}

const settingOptions = {
  body_font_family: [
    ['Inter', 'Inter'],
    ['Arial', 'Arial'],
    ['Helvetica', 'Helvetica'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Verdana', 'Verdana'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['system-ui', 'System UI'],
  ],

  heading_font_family: [
    ['Inter', 'Inter'],
    ['Arial', 'Arial'],
    ['Helvetica', 'Helvetica'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Verdana', 'Verdana'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['system-ui', 'System UI'],
  ],

  font_scale: [
    ['compact', 'Compatta'],
    ['standard', 'Standard'],
    ['large', 'Grande'],
    ['editorial', 'Editoriale'],
  ],

  button_radius: [
    ['sharp', 'Spigoloso'],
    ['rounded', 'Arrotondato'],
    ['pill', 'Pillola'],
  ],

  container_width: [
    ['narrow', 'Stretta'],
    ['standard', 'Standard'],
    ['wide', 'Ampia'],
  ],

  section_spacing: [
    ['compact', 'Compatta'],
    ['standard', 'Standard'],
    ['large', 'Ampia'],
  ],

  header_style: [
    ['standard', 'Standard'],
    ['transparent', 'Trasparente'],
    ['centered', 'Centrato'],
  ],

  footer_layout: [
    ['simple', 'Semplice'],
    ['columns', 'Colonne'],
    ['editorial', 'Editoriale'],
  ],
}

function openThemeSettingsDrawer() {
  if (!canAdminViewSensitiveSettings()) {
    showAdminPermissionNotice('Permessi insufficienti per modificare impostazioni sensibili.')
    return
  }

  themeSettingsDrawer?.classList.add('open')

  if (themeSettingsOverlay) {
    themeSettingsOverlay.hidden = false
  }

  themeSettingsDrawer?.setAttribute('aria-hidden', 'false')
  loadThemeSettings()
}

function closeThemeSettingsDrawer() {
  themeSettingsDrawer?.classList.remove('open')

  if (themeSettingsOverlay) {
    themeSettingsOverlay.hidden = true
  }

  themeSettingsDrawer?.setAttribute('aria-hidden', 'true')
}

function renderThemeSettingInput(setting) {
  if (settingOptions[setting.key]) {
    return `
      <select data-theme-setting-key="${escapeHtml(setting.key)}">
        ${settingOptions[setting.key]
          .map(
            ([value, label]) => `
              <option value="${escapeHtml(value)}" ${
                setting.value === value ? 'selected' : ''
              }>
                ${escapeHtml(label)}
              </option>
            `,
          )
          .join('')}
      </select>
    `
  }

  const inputType =
    setting.type === 'color'
      ? 'color'
      : setting.type === 'url'
        ? 'url'
        : 'text'

  const isLongText = setting.key === 'footer_text'

  if (isLongText) {
    return `
      <textarea
        data-theme-setting-key="${escapeHtml(setting.key)}"
        rows="3"
      >${escapeHtml(setting.value || '')}</textarea>
    `
  }

  return `
    <input
      data-theme-setting-key="${escapeHtml(setting.key)}"
      type="${inputType}"
      value="${escapeHtml(setting.value || '')}"
      placeholder="${escapeHtml(setting.label || setting.key)}"
    />
  `
}

function renderThemeSettings(settings = []) {
  const filteredSettings = settings.filter((setting) =>
    themeEditorSettingKeys.has(setting.key),
  )

  const grouped = filteredSettings.reduce((groups, setting) => {
    const groupName = setting.group_name || 'theme'

    if (!groups[groupName]) {
      groups[groupName] = []
    }

    groups[groupName].push(setting)

    return groups
  }, {})

  const groupOrder = ['brand', 'theme', 'header', 'footer']

  themeSettingsGroups.innerHTML = groupOrder
    .filter((groupName) => grouped[groupName]?.length)
    .map((groupName) => {
      const settings = grouped[groupName]
      const title = themeGroupLabels[groupName] || groupName
      const description = themeGroupDescriptions[groupName] || ''

      return `
        <section class="theme-settings-group">
          <div class="theme-settings-group-head">
            <div>
              <h4>${escapeHtml(title)}</h4>
              <p>${escapeHtml(description)}</p>
            </div>

            <span>${escapeHtml(groupName)}</span>
          </div>

          <div class="theme-settings-fields">
            ${settings
              .map(
                (setting) => `
                  <label class="theme-setting-field">
                    <span>${escapeHtml(setting.label || setting.key)}</span>
                    ${renderThemeSettingInput(setting)}
                    <small>${escapeHtml(setting.key)}</small>
                  </label>
                `,
              )
              .join('')}
          </div>
        </section>
      `
    })
    .join('')
}

async function loadThemeSettings() {
  if (!themeSettingsGroups) return

  if (!canAdminViewSensitiveSettings()) {
    themeSettingsGroups.textContent = 'Permessi insufficienti per leggere impostazioni sensibili.'
    return
  }

  themeSettingsGroups.textContent = 'Caricamento impostazioni tema...'

  try {
    const response = await fetch('/api/admin/settings')
    const data = await response.json()

    if (!data.success) {
      themeSettingsGroups.textContent =
        data.message || 'Errore caricamento impostazioni tema.'
      return
    }

    renderThemeSettings(data.settings || [])
  } catch {
    themeSettingsGroups.textContent =
      'Errore di connessione alla API impostazioni.'
  }
}

async function saveThemeSettings(event) {
  event.preventDefault()

  if (!canAdminViewSensitiveSettings()) {
    themeSettingsMessage.textContent = 'Permessi insufficienti.'
    return
  }

  themeSettingsMessage.textContent = 'Salvataggio impostazioni tema...'

  const payload = {
    settings: {},
  }

  document.querySelectorAll('[data-theme-setting-key]').forEach((input) => {
    payload.settings[input.dataset.themeSettingKey] = input.value
  })

  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!data.success) {
      themeSettingsMessage.textContent =
        data.message || 'Errore salvataggio impostazioni tema.'
      return
    }

    themeSettingsMessage.textContent = 'Impostazioni tema salvate.'
    await loadThemeSettings()
  } catch {
    themeSettingsMessage.textContent = 'Errore di connessione.'
  }
}

themeSettingsButton?.addEventListener('click', openThemeSettingsDrawer)
closeThemeSettingsButton?.addEventListener('click', closeThemeSettingsDrawer)
themeSettingsOverlay?.addEventListener('click', closeThemeSettingsDrawer)

if (themeSettingsForm) {
  themeSettingsForm.addEventListener('submit', saveThemeSettings)
}

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
  product_3d_viewer: 'Product 3D Viewer',
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

  product_3d_viewer: [
    'eyebrow',
    'title',
    'text',
    'model_url',
    'poster_image_url',
    'button_text',
    'auto_rotate',
    'show_modal',
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
  model_url: 'URL modello 3D (.glb/.gltf)',
  poster_image_url: 'URL immagine fallback/poster',
  auto_rotate: 'Rotazione automatica',
  show_modal: 'Mostra bottone modal 3D',
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

const booleanSectionFields = new Set(['auto_rotate', 'show_modal'])

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
      const isBoolean = booleanSectionFields.has(field)

      if (isBoolean) {
        const checked = value === true || value === 'true' || value === '1'

        return `
          <label class="section-checkbox-field">
            <input
              type="checkbox"
              data-section-field="${field}"
              ${checked ? 'checked' : ''}
            />
            ${fieldLabels[field] || field}
          </label>
        `
      }

      return `
        <label>
          ${fieldLabels[field] || field}
          <textarea data-section-field="${field}">${escapeHtml(value)}</textarea>
        </label>
      `
    })
    .join('')

  document.querySelectorAll('[data-section-field]').forEach((input) => {
    input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => {
      const field = input.dataset.sectionField

      section.data = {
        ...(section.data || {}),
        [field]: input.type === 'checkbox' ? input.checked : input.value,
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
            <button type="button" data-up="${index}">Su</button>
            <button type="button" data-down="${index}">Giu</button>
            <button type="button" class="danger" data-delete-section="${section.id}">x</button>
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
initAdminAuth()
