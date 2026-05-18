const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

const ALLOWED_STATUS = new Set(["pending", "approved", "rejected"]);

function nowIso() {
  return new Date().toISOString();
}

function tableMissing(error) {
  return String(error && error.message ? error.message : error || "").toLowerCase().includes("no such table");
}

function normalizeRating(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 5;
  return Math.max(1, Math.min(5, Math.round(rating)));
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const productId = url.searchParams.get("product_id");
    const params = [];
    const where = ["r.active = 1"];

    if (status && ALLOWED_STATUS.has(status)) {
      where.push("r.status = ?");
      params.push(status);
    }

    if (productId) {
      where.push("r.product_id = ?");
      params.push(Number(productId));
    }

    const rows = await env.DB.prepare(
      `
        SELECT
          r.*,
          p.name AS product_name
        FROM product_reviews r
        LEFT JOIN products p ON p.id = r.product_id
        WHERE ${where.join(" AND ")}
        ORDER BY r.created_at DESC, r.id DESC
        LIMIT 250
      `,
    )
      .bind(...params)
      .all();

    return json({ success: true, reviews: rows.results || [] });
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, reviews: [], setup_required: true });
    return json({ success: false, message: "Reviews non disponibili al momento." }, { status: 500 });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request);
    const productId = Number(body.product_id);
    const customerName = String(body.customer_name || "").trim();

    if (!productId || !customerName) {
      return json({ success: false, message: "Prodotto e nome cliente sono obbligatori." }, { status: 400 });
    }

    const status = ALLOWED_STATUS.has(body.status) ? body.status : "pending";
    const createdAt = nowIso();

    const result = await env.DB.prepare(
      `
        INSERT INTO product_reviews (
          product_id, customer_name, email, rating, title, body, status, active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `,
    )
      .bind(
        productId,
        customerName,
        String(body.email || "").trim() || null,
        normalizeRating(body.rating),
        String(body.title || "").trim() || null,
        String(body.body || "").trim() || null,
        status,
        createdAt,
        createdAt,
      )
      .run();

    return json({ success: true, id: result.meta.last_row_id, message: "Review salvata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Reviews richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile salvare la review." }, { status: 500 });
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request);
    const id = Number(body.id);
    if (!id) return json({ success: false, message: "Review non valida." }, { status: 400 });

    const status = ALLOWED_STATUS.has(body.status) ? body.status : "pending";
    await env.DB.prepare(
      `
        UPDATE product_reviews
        SET customer_name = ?, email = ?, rating = ?, title = ?, body = ?, status = ?, updated_at = ?
        WHERE id = ?
      `,
    )
      .bind(
        String(body.customer_name || "").trim(),
        String(body.email || "").trim() || null,
        normalizeRating(body.rating),
        String(body.title || "").trim() || null,
        String(body.body || "").trim() || null,
        status,
        nowIso(),
        id,
      )
      .run();

    return json({ success: true, message: "Review aggiornata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Reviews richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile aggiornare la review." }, { status: 500 });
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));
    if (!id) return json({ success: false, message: "Review non valida." }, { status: 400 });

    await env.DB.prepare("UPDATE product_reviews SET active = 0, updated_at = ? WHERE id = ?")
      .bind(nowIso(), id)
      .run();

    return json({ success: true, message: "Review disattivata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Reviews richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile disattivare la review." }, { status: 500 });
  }
}
