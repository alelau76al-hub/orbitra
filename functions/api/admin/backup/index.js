const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

async function safeAll(env, table, orderBy = "id") {
  try {
    const rows = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY ${orderBy} ASC LIMIT 5000`).all();
    return rows.results || [];
  } catch {
    return [];
  }
}

export async function onRequestGet({ env }) {
  try {
    const generatedAt = new Date().toISOString();
    const backup = {
      meta: {
        generated_at: generatedAt,
        generator: "TakeOff Backup",
        format_version: 1,
        restore_mode: "partial_import_only",
      },
      settings: await safeAll(env, "site_settings", "key"),
      pages: await safeAll(env, "pages"),
      sections: await safeAll(env, "sections"),
      menus: await safeAll(env, "menus"),
      menu_items: await safeAll(env, "menu_items"),
      products: await safeAll(env, "products"),
      product_variants: await safeAll(env, "product_variants"),
      inventory: await safeAll(env, "inventory"),
      collections: await safeAll(env, "collections"),
      media_items: await safeAll(env, "media_items"),
      blog_posts: await safeAll(env, "blog_posts"),
      policies: await safeAll(env, "policies"),
      translations: await safeAll(env, "translations"),
      markets: await safeAll(env, "markets"),
      localized_prices: await safeAll(env, "localized_prices"),
      shipping_methods: await safeAll(env, "shipping_methods"),
      seo_metadata: await safeAll(env, "seo_metadata"),
      metafield_definitions: await safeAll(env, "metafield_definitions"),
      metafield_values: await safeAll(env, "metafield_values"),
      metaobject_definitions: await safeAll(env, "metaobject_definitions"),
      metaobject_entries: await safeAll(env, "metaobject_entries"),
      product_reviews: await safeAll(env, "product_reviews"),
      return_requests: await safeAll(env, "return_requests"),
      upsell_rules: await safeAll(env, "upsell_rules"),
      product_feed_settings: await safeAll(env, "product_feed_settings", "provider"),
    };

    return json({ success: true, backup });
  } catch {
    return json({ success: false, message: "Backup non disponibile al momento." }, { status: 500 });
  }
}
