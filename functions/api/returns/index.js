const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

function nowIso() {
  return new Date().toISOString();
}

function tableMissing(error) {
  return String(error && error.message ? error.message : error || "").toLowerCase().includes("no such table");
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request);
    const orderId = Number(body.order_id);
    const email = String(body.customer_email || "").trim();
    const reason = String(body.reason || "").trim();

    if (!orderId || !email || !reason) {
      return json({ success: false, message: "Ordine, email e motivo sono obbligatori." }, { status: 400 });
    }

    const createdAt = nowIso();
    const result = await env.DB.prepare(
      `
        INSERT INTO return_requests (
          order_id, customer_email, reason, note, status, active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'requested', 1, ?, ?)
      `,
    )
      .bind(orderId, email, reason, String(body.note || "").trim() || null, createdAt, createdAt)
      .run();

    return json({ success: true, id: result.meta.last_row_id, message: "Richiesta ricevuta." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Returns non ancora configurato." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile inviare la richiesta di reso." }, { status: 500 });
  }
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const orderId = Number(url.searchParams.get("order_id"));
    const email = String(url.searchParams.get("email") || "").trim();

    if (!orderId || !email) {
      return json({ success: false, message: "Ordine ed email sono obbligatori." }, { status: 400 });
    }

    const rows = await env.DB.prepare(
      `
        SELECT id, order_id, reason, status, created_at, updated_at
        FROM return_requests
        WHERE active = 1 AND order_id = ? AND customer_email = ?
        ORDER BY created_at DESC
        LIMIT 20
      `,
    )
      .bind(orderId, email)
      .all();

    return json({ success: true, returns: rows.results || [] });
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, returns: [], setup_required: true });
    return json({ success: false, returns: [], message: "Returns non disponibile." }, { status: 200 });
  }
}
