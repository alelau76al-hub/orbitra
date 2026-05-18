function csv(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function tableMissing(error) {
  return String(error && error.message ? error.message : error || "").toLowerCase().includes("no such table");
}

async function loadFeedSettings(env) {
  try {
    const row = await env.DB.prepare("SELECT * FROM product_feed_settings WHERE provider = 'meta' LIMIT 1").first();
    return row || { active: 0, title: "TakeOff Meta Catalog Feed", default_currency: "EUR", include_out_of_stock: 0 };
  } catch (error) {
    if (tableMissing(error)) return { active: 0, title: "TakeOff Meta Catalog Feed", default_currency: "EUR", include_out_of_stock: 0 };
    throw error;
  }
}

function priceValue(product) {
  const cents = Number(product.localized_price_cents ?? product.price_cents ?? product.price ?? 0);
  if (cents > 1000) return cents / 100;
  return cents;
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const settings = await loadFeedSettings(env);
    const includeOutOfStock = Number(settings.include_out_of_stock) === 1;
    const rows = await env.DB.prepare(
      `
        SELECT id, name, slug, description, image_url, price_cents, stock
        FROM products
        WHERE (? = 1 OR COALESCE(stock, 0) > 0)
        ORDER BY id DESC
        LIMIT 1000
      `,
    )
      .bind(includeOutOfStock ? 1 : 0)
      .all();

    const header = ["id", "title", "description", "availability", "condition", "price", "link", "image_link"];
    const lines = [header.join(",")];
    for (const product of rows.results || []) {
      const title = product.name || `Product ${product.id}`;
      lines.push(
        [
          product.id,
          title,
          product.description || title,
          Number(product.stock || 0) > 0 ? "in stock" : "out of stock",
          "new",
          `${priceValue(product).toFixed(2)} ${settings.default_currency || "EUR"}`,
          `${origin}/products/${encodeURIComponent(product.slug || product.id)}`,
          product.image_url || "",
        ]
          .map(csv)
          .join(","),
      );
    }

    return new Response(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("id,title,description,availability,condition,price,link,image_link\n", {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  }
}
