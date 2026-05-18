const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
      ...(init.headers || {}),
    },
  });

function tableMissing(error) {
  return String(error && error.message ? error.message : error || "").toLowerCase().includes("no such table");
}

function safeParseIds(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.map((id) => Number(id)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

async function loadProducts(env, ids) {
  const safeIds = [...new Set(ids.map((id) => Number(id)).filter(Boolean))];
  if (!safeIds.length) return [];

  const placeholders = safeIds.map(() => "?").join(", ");
  const rows = await env.DB.prepare(
    `
      SELECT id, name, slug, description, price_cents, image_url, stock
      FROM products
      WHERE id IN (${placeholders})
    `,
  )
    .bind(...safeIds)
    .all();

  return rows.results || [];
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const productId = Number(url.searchParams.get("product_id"));

    if (!productId) {
      return json({ success: true, bundles: [], frequently_bought_together: [], cart_upsells: [] });
    }

    const rows = await env.DB.prepare(
      `
        SELECT *
        FROM upsell_rules
        WHERE active = 1
          AND (
            base_product_id = ?
            OR trigger_product_id = ?
          )
        ORDER BY created_at DESC, id DESC
        LIMIT 20
      `,
    )
      .bind(productId, productId)
      .all();

    const rules = rows.results || [];
    const targetIds = rules.flatMap((rule) => safeParseIds(rule.target_product_ids));
    const products = await loadProducts(env, targetIds);
    const productMap = new Map(products.map((product) => [Number(product.id), product]));

    const hydrate = (rule) => ({
      ...rule,
      target_product_ids: safeParseIds(rule.target_product_ids),
      products: safeParseIds(rule.target_product_ids)
        .map((id) => productMap.get(Number(id)))
        .filter(Boolean),
    });

    return json({
      success: true,
      bundles: rules.filter((rule) => rule.type === "bundle").map(hydrate),
      frequently_bought_together: rules.filter((rule) => rule.type === "frequently_bought_together").map(hydrate),
      cart_upsells: rules.filter((rule) => rule.type === "cart_upsell").map(hydrate),
    });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: true, bundles: [], frequently_bought_together: [], cart_upsells: [], setup_required: true });
    }
    return json({ success: false, bundles: [], frequently_bought_together: [], cart_upsells: [], message: "Upsell non disponibile." }, { status: 200 });
  }
}
