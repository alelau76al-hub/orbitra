function json(data, status = 200) {
  return Response.json(data, { status })
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase()
}

function tableMissing(error) {
  return /no such table|no such column/i.test(String(error?.message || ''))
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const email = normalizeEmail(url.searchParams.get('email') || '')

  if (!email) {
    return json({
      success: true,
      addresses: [],
      message: 'Inserisci una email per vedere gli indirizzi disponibili.',
    })
  }

  try {
    const customer = await env.DB.prepare(`
      SELECT id, email, shipping_address_line1, shipping_address_city,
             shipping_address_postal_code, shipping_address_country
      FROM customers
      WHERE LOWER(email) = ?
      LIMIT 1
    `)
      .bind(email)
      .first()

    if (!customer) {
      return json({
        success: true,
        addresses: [],
        message: 'Nessun indirizzo cliente trovato.',
      })
    }

    const address = {
      customer_id: customer.id,
      email: customer.email,
      line1: customer.shipping_address_line1 || '',
      city: customer.shipping_address_city || '',
      postal_code: customer.shipping_address_postal_code || '',
      country: customer.shipping_address_country || '',
      type: 'shipping',
    }

    return json({
      success: true,
      addresses: address.line1 ? [address] : [],
    })
  } catch (error) {
    if (tableMissing(error)) {
      return json({
        success: true,
        addresses: [],
        setup_required: true,
        message: 'Customer account pronto: applica le migration ecommerce per leggere gli indirizzi.',
      })
    }

    return json(
      {
        success: false,
        addresses: [],
        message: 'Indirizzi cliente non disponibili.',
      },
      500,
    )
  }
}
