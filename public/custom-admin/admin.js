const productsList = document.querySelector('#productsList')
const productForm = document.querySelector('#productForm')
const message = document.querySelector('#message')
const refreshButton = document.querySelector('#refreshButton')

function formatMoney(priceCents) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceCents / 100)
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
            <h3>${product.name}</h3>
            <p>${product.description || 'Nessuna descrizione'}</p>
            <div class="meta">
              <span>${formatMoney(product.price_cents)}</span>
              <span>Stock: ${product.stock}</span>
              <span>${product.category || 'Senza categoria'}</span>
              <span>${product.collection_slug || 'Senza collezione'}</span>
            </div>
          </article>
        `,
      )
      .join('')
  } catch (error) {
    productsList.textContent = 'Errore di connessione alla API.'
  }
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  message.textContent = 'Salvataggio in corso...'

  const product = {
    name: document.querySelector('#name').value.trim(),
    slug: document.querySelector('#slug').value.trim(),
    description: document.querySelector('#description').value.trim(),
    price_cents: Math.round(Number(document.querySelector('#price').value) * 100),
    image_url: document.querySelector('#image_url').value.trim(),
    collection_slug: document.querySelector('#collection_slug').value.trim(),
    category: document.querySelector('#category').value.trim(),
    stock: Number(document.querySelector('#stock').value),
  }

  try {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
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

    message.textContent = 'Prodotto salvato correttamente.'
    productForm.reset()
    loadProducts()
  } catch (error) {
    message.textContent = 'Errore di connessione.'
  }
})

refreshButton.addEventListener('click', loadProducts)

loadProducts()