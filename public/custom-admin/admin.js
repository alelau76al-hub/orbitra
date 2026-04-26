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
const heroEyebrow = document.querySelector('#heroEyebrow')
const heroTitle = document.querySelector('#heroTitle')
const heroSubtitle = document.querySelector('#heroSubtitle')
const heroButtonText = document.querySelector('#heroButtonText')
const saveHeroButton = document.querySelector('#saveHeroButton')
const heroMessage = document.querySelector('#heroMessage')

const sitePreview = document.querySelector('#sitePreview')

function getHeroValues() {
  return {
    eyebrow: heroEyebrow.value || 'Luxury Space Travel',
    title: heroTitle.value || 'Titolo hero',
    subtitle: heroSubtitle.value || 'Sottotitolo hero',
    button_text: heroButtonText.value || 'Scopri di più',
  }
}

function updateHeroPreview() {
  sitePreview.contentWindow?.postMessage(
    {
      type: 'ORBITRA_HERO_PREVIEW',
      hero: getHeroValues(),
    },
    window.location.origin,
  )
}

sitePreview.addEventListener('load', updateHeroPreview)

async function loadHeroEditor() {
  try {
    const response = await fetch('/api/admin/hero')
    const data = await response.json()

    if (!data.success || !data.hero) {
      heroMessage.textContent = 'Hero non trovata.'
      return
    }

    heroEyebrow.value = data.hero.eyebrow || ''
    heroTitle.value = data.hero.title || ''
    heroSubtitle.value = data.hero.subtitle || ''
    heroButtonText.value = data.hero.button_text || ''

    updateHeroPreview()
  } catch {
    heroMessage.textContent = 'Errore caricamento Hero.'
  }
}

async function saveHero() {
  heroMessage.textContent = 'Salvataggio...'

  const hero = {
    eyebrow: heroEyebrow.value.trim(),
    title: heroTitle.value.trim(),
    subtitle: heroSubtitle.value.trim(),
    button_text: heroButtonText.value.trim(),
  }

  try {
    const response = await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hero),
    })

    const data = await response.json()

    heroMessage.textContent = data.success
      ? 'Hero salvata correttamente.'
      : 'Errore nel salvataggio.'
  } catch {
    heroMessage.textContent = 'Errore di connessione.'
  }
}

;[heroEyebrow, heroTitle, heroSubtitle, heroButtonText].forEach((input) => {
  input.addEventListener('input', updateHeroPreview)
})

saveHeroButton.addEventListener('click', saveHero)

loadHeroEditor()