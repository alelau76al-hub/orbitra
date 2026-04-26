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
  document.querySelector('#collection_slug').value = product.collection_slug || ''
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
const sitePreview = document.querySelector('#sitePreview')
const sectionsList = document.querySelector('#sectionsList')
const sectionFields = document.querySelector('#sectionFields')
const selectedSectionTitle = document.querySelector('#selectedSectionTitle')
const saveSectionButton = document.querySelector('#saveSectionButton')
const addSectionButton = document.querySelector('#addSectionButton')
const newSectionType = document.querySelector('#newSectionType')
const sectionMessage = document.querySelector('#sectionMessage')

let pageSections = []
let selectedSectionId = null

const sectionLabels = {
  hero: 'Hero',
  banner: 'Banner',
  product_grid: 'Griglia prodotti',
  faq: 'FAQ',
  cta: 'CTA finale',
}

const fieldsByType = {
  hero: ['eyebrow', 'title', 'subtitle', 'button_text'],
  banner: ['title', 'text', 'button_text'],
  product_grid: ['eyebrow', 'title', 'subtitle'],
  faq: ['title', 'question', 'answer'],
  cta: ['title', 'text', 'button_text'],
}

const fieldLabels = {
  eyebrow: 'Eyebrow',
  title: 'Titolo',
  subtitle: 'Sottotitolo',
  button_text: 'Testo bottone',
  text: 'Testo',
  question: 'Domanda',
  answer: 'Risposta',
}

function selectedSection() {
  return pageSections.find((section) => section.id === selectedSectionId)
}

async function loadSections() {
  const response = await fetch('/api/admin/section')
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
      (section) => `
        <button
          type="button"
          class="section-button ${section.id === selectedSectionId ? 'active' : ''}"
          data-section-id="${section.id}"
        >
          ${sectionLabels[section.type] || section.type}
        </button>
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

loadSections()