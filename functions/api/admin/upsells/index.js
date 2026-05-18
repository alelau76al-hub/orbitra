const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

const RULE_TYPES = new Set(["bundle", "frequently_bought_together", "cart_upsell"]);
const DISCOUNT_TYPES = new Set(["percentage", "fixed"]);

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

function normalizeIds(value) {
  if (Array.isArray(value)) {
    return value.map((id) => Number(id)).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((id) => Number(id)).filter(Boolean);
    } catch {
      return value
        .split(",")
        .map((id) => Number(id.trim()))
        .filter(Boolean);
    }
  }
  return [];
}

function safeParseIds(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeRule(body) {
  return {
    type: RULE_TYPES.has(body.type) ? body.type : "frequently_bought_together",
    name: String(body.name || "").trim(),
    base_product_id: Number(body.base_product_id) || null,
    trigger_product_id: Number(body.trigger_product_id) || null,
    target_product_ids: JSON.stringify(normalizeIds(body.target_product_ids)),
    discount_type: DISCOUNT_TYPES.has(body.discount_type) ? body.discount_type : "percentage",
    discount_value: Math.max(0, Math.round(Number(body.discount_value) || 0)),
    message: String(body.message || "").trim() || null,
    active: body.active === false || body.active === 0 || body.active === "0" ? 0 : 1,
  };
}

export async function onRequestGet({ env }) {
  try {
    const rows = await env.DB.prepare(
      `
        SELECT
          u.*,
          bp.title AS base_product_title,
          bp.name AS base_product_name,
          tp.title AS trigger_product_title,
          tp.name AS trigger_product_name
        FROM upsell_rules u
        LEFT JOIN products bp ON bp.id = u.base_product_id
        LEFT JOIN products tp ON tp.id = u.trigger_product_id
        WHERE u.active = 1
        ORDER BY u.created_at DESC, u.id DESC
        LIMIT 250
      `,
    ).all();

    const rules = (rows.results || []).map((rule) => ({
      ...rule,
      target_product_ids: safeParseIds(rule.target_product_ids),
    }));

    return json({ success: true, rules });
  } catch (error) {
    if (tableMissing(error)) return json({ success: true, rules: [], setup_required: true });
    return json({ success: false, message: "Upsell non disponibile al momento." }, { status: 500 });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request);
    const rule = normalizeRule(body);
    if (!rule.name) return json({ success: false, message: "Nome regola obbligatorio." }, { status: 400 });

    const createdAt = nowIso();
    const result = await env.DB.prepare(
      `
        INSERT INTO upsell_rules (
          type, name, base_product_id, trigger_product_id, target_product_ids,
          discount_type, discount_value, message, active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
      .bind(
        rule.type,
        rule.name,
        rule.base_product_id,
        rule.trigger_product_id,
        rule.target_product_ids,
        rule.discount_type,
        rule.discount_value,
        rule.message,
        rule.active,
        createdAt,
        createdAt,
      )
      .run();

    return json({ success: true, id: result.meta.last_row_id, message: "Regola upsell salvata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Upsell richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile salvare la regola upsell." }, { status: 500 });
  }
}

export async function onRequestPut({ env, request }) {
  try {
    const body = await readJson(request);
    const id = Number(body.id);
    const rule = normalizeRule(body);
    if (!id || !rule.name) return json({ success: false, message: "Regola upsell non valida." }, { status: 400 });

    await env.DB.prepare(
      `
        UPDATE upsell_rules
        SET type = ?, name = ?, base_product_id = ?, trigger_product_id = ?, target_product_ids = ?,
            discount_type = ?, discount_value = ?, message = ?, active = ?, updated_at = ?
        WHERE id = ?
      `,
    )
      .bind(
        rule.type,
        rule.name,
        rule.base_product_id,
        rule.trigger_product_id,
        rule.target_product_ids,
        rule.discount_type,
        rule.discount_value,
        rule.message,
        rule.active,
        nowIso(),
        id,
      )
      .run();

    return json({ success: true, message: "Regola upsell aggiornata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Upsell richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile aggiornare la regola upsell." }, { status: 500 });
  }
}

export async function onRequestDelete({ env, request }) {
  try {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));
    if (!id) return json({ success: false, message: "Regola upsell non valida." }, { status: 400 });

    await env.DB.prepare("UPDATE upsell_rules SET active = 0, updated_at = ? WHERE id = ?")
      .bind(nowIso(), id)
      .run();

    return json({ success: true, message: "Regola upsell disattivata." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Upsell richiede la migration Native Apps Suite." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile disattivare la regola upsell." }, { status: 500 });
  }
}
