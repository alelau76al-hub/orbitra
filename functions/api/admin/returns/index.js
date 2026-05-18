const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

const RETURN_STATUS = new Set(["requested", "approved", "rejected", "received", "refunded", "closed"]);

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

function normalizeStatus(status) {
  return RETURN_STATUS.has(status) ? status : "requested";
}

function cents(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.round(numeric * 100));
}

async function appendOrderTimeline(env, orderId, eventType, title, description = "") {
  if (!orderId) return;
  try {
    await env.DB.prepare(
      `
        INSERT INTO order_timeline (order_id, event_type, title, description, metadata_json)
        VALUES (?, ?, ?, ?, ?)
      `,
    )
      .bind(orderId, eventType, title, description, JSON.stringify({ source: "returns" }))
      .run();
  } catch {}
}

async function logNotification(env, type, orderId, description) {
  try {
    await env.DB.prepare(
      `
        INSERT INTO notification_logs (type, status, description, metadata_json)
        VALUES (?, 'mocked', ?, ?)
      `,
    )
      .bind(type, description, JSON.stringify({ order_id: orderId || null, source: "returns" }))
      .run();
  } catch {}
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const params = [];
    const where = ["r.active = 1"];

    if (status && RETURN_STATUS.has(status)) {
      where.push("r.status = ?");
      params.push(status);
    }

    const rows = await env.DB.prepare(
      `
        SELECT
          r.*,
          o.total_cents,
          o.payment_status,
          o.order_status
        FROM return_requests r
        LEFT JOIN orders o ON o.id = r.order_id
        WHERE ${where.join(" AND ")}
        ORDER BY r.created_at DESC, r.id DESC
        LIMIT 250
      `,
    )
      .bind(...params)
      .all();

    return json({ success: true, returns: rows.results || [] });
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, returns: [], setup_required: true });
    return json({ success: false, message: "Returns non disponibili al momento." }, { status: 500 });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request);
    const email = String(body.customer_email || "").trim();
    if (!email) return json({ success: false, message: "Email cliente obbligatoria." }, { status: 400 });

    const createdAt = nowIso();
    const result = await env.DB.prepare(
      `
        INSERT INTO return_requests (
          order_id, customer_email, reason, note, internal_note, refund_amount_cents, status, active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `,
    )
      .bind(
        Number(body.order_id) || null,
        email,
        String(body.reason || "").trim() || null,
        String(body.note || "").trim() || null,
        String(body.internal_note || "").trim() || null,
        cents(body.refund_amount),
        normalizeStatus(body.status),
        createdAt,
        createdAt,
      )
      .run();

    await appendOrderTimeline(env, Number(body.order_id) || null, "return_requested", "Return requested", String(body.reason || "").trim());
    await logNotification(env, "return_requested", Number(body.order_id) || null, "Return requested notification mocked/logged.");

    return json({ success: true, id: result.meta.last_row_id, message: "Return request salvata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Returns richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile salvare il reso." }, { status: 500 });
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request);
    const id = Number(body.id);
    if (!id) return json({ success: false, message: "Return request non valida." }, { status: 400 });

    await env.DB.prepare(
      `
        UPDATE return_requests
        SET order_id = ?, customer_email = ?, reason = ?, note = ?, internal_note = ?,
            refund_amount_cents = ?, status = ?, updated_at = ?
        WHERE id = ?
      `,
    )
      .bind(
        Number(body.order_id) || null,
        String(body.customer_email || "").trim(),
        String(body.reason || "").trim() || null,
        String(body.note || "").trim() || null,
        String(body.internal_note || "").trim() || null,
        cents(body.refund_amount),
        normalizeStatus(body.status),
        nowIso(),
        id,
      )
      .run();

    await appendOrderTimeline(env, Number(body.order_id) || null, body.status === "refunded" ? "refund_marked_complete" : "return_updated", "Return updated", normalizeStatus(body.status));
    if (body.status === "refunded") {
      await logNotification(env, "refund_created", Number(body.order_id) || null, "Refund notification mocked/logged.");
    }

    return json({ success: true, message: "Return request aggiornata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Returns richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile aggiornare il reso." }, { status: 500 });
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));
    if (!id) return json({ success: false, message: "Return request non valida." }, { status: 400 });

    await env.DB.prepare("UPDATE return_requests SET active = 0, updated_at = ? WHERE id = ?")
      .bind(nowIso(), id)
      .run();

    return json({ success: true, message: "Return request disattivata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Returns richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile disattivare il reso." }, { status: 500 });
  }
}
