const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

const PROVIDERS = ["google", "meta"];

function nowIso() {
  return new Date().toISOString();
}

function tableMissing(error) {
  return String(error && error.message ? error.message : error || "").toLowerCase().includes("no such table");
}

function defaults() {
  return PROVIDERS.map((provider) => ({
    provider,
    active: 0,
    title: provider === "google" ? "TakeOff Google Merchant Feed" : "TakeOff Meta Catalog Feed",
    default_currency: "EUR",
    default_language: "it",
    include_out_of_stock: 0,
    market_handle: "",
  }));
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function onRequestGet({ env }) {
  try {
    const rows = await env.DB.prepare(
      `
        SELECT *
        FROM product_feed_settings
        ORDER BY provider ASC
      `,
    ).all();
    const configured = rows.results || [];
    const merged = defaults().map((item) => configured.find((row) => row.provider === item.provider) || item);
    return json({ success: true, feeds: merged });
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, feeds: defaults(), setup_required: true });
    return json({ success: false, message: "Product Feed non disponibile." }, { status: 500 });
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request);
    const provider = String(body.provider || "").trim().toLowerCase();
    if (!PROVIDERS.includes(provider)) {
      return json({ success: false, message: "Provider feed non valido." }, { status: 400 });
    }

    const updatedAt = nowIso();
    await env.DB.prepare(
      `
        INSERT INTO product_feed_settings (
          provider, active, title, default_currency, default_language, include_out_of_stock, market_handle, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(provider) DO UPDATE SET
          active = excluded.active,
          title = excluded.title,
          default_currency = excluded.default_currency,
          default_language = excluded.default_language,
          include_out_of_stock = excluded.include_out_of_stock,
          market_handle = excluded.market_handle,
          updated_at = excluded.updated_at
      `,
    )
      .bind(
        provider,
        body.active ? 1 : 0,
        String(body.title || "").trim() || `${provider.toUpperCase()} product feed`,
        String(body.default_currency || "EUR").trim().toUpperCase(),
        String(body.default_language || "it").trim().toLowerCase(),
        body.include_out_of_stock ? 1 : 0,
        String(body.market_handle || "").trim() || null,
        updatedAt,
        updatedAt,
      )
      .run();

    return json({ success: true, message: "Feed configurato." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Product Feed richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile salvare il feed." }, { status: 500 });
  }
}
