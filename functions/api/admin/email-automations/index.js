const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });

const AUTOMATION_TYPES = [
  "order_created",
  "payment_received",
  "order_fulfilled",
  "order_cancelled",
  "refund_created",
  "return_requested",
  "customer_invite",
  "abandoned_cart",
  "welcome_email",
  "newsletter",
];

function providerStatus(env) {
  return [
    { provider: "none", configured: true, status: "Mock / logging only" },
    { provider: "Resend", configured: Boolean(env.RESEND_API_KEY), required_env: "RESEND_API_KEY" },
    { provider: "SendGrid", configured: Boolean(env.SENDGRID_API_KEY), required_env: "SENDGRID_API_KEY" },
    { provider: "Brevo", configured: Boolean(env.BREVO_API_KEY), required_env: "BREVO_API_KEY" },
    { provider: "Mailgun", configured: Boolean(env.MAILGUN_API_KEY), required_env: "MAILGUN_API_KEY" },
  ];
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

async function loadTemplates(env) {
  try {
    const rows = await env.DB.prepare(
      `
        SELECT *
        FROM notification_templates
        ORDER BY type ASC, id ASC
      `,
    ).all();
    return rows.results || [];
  } catch (error) {
    if (tableMissing(error)) return [];
    throw error;
  }
}

async function loadLogs(env) {
  try {
    const rows = await env.DB.prepare(
      `
        SELECT *
        FROM notification_logs
        ORDER BY created_at DESC, id DESC
        LIMIT 100
      `,
    ).all();
    return rows.results || [];
  } catch (error) {
    if (tableMissing(error)) return [];
    throw error;
  }
}

export async function onRequestGet({ env }) {
  try {
    const templates = await loadTemplates(env);
    const logs = await loadLogs(env);
    return json({
      success: true,
      provider_status: providerStatus(env),
      automation_types: AUTOMATION_TYPES,
      templates,
      logs,
      sending_mode: providerStatus(env).some((provider) => provider.provider !== "none" && provider.configured)
        ? "provider_ready"
        : "mock_logging_only",
    });
  } catch {
    return json({ success: false, message: "Email Automations non disponibile." }, { status: 500 });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await readJson(request);
    const type = String(body.type || "").trim();
    if (!AUTOMATION_TYPES.includes(type)) {
      return json({ success: false, message: "Tipo automazione non valido." }, { status: 400 });
    }

    const now = new Date().toISOString();
    await env.DB.prepare(
      `
        INSERT INTO notification_templates (type, title, subject, body, active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(type) DO UPDATE SET
          title = excluded.title,
          subject = excluded.subject,
          body = excluded.body,
          active = excluded.active,
          updated_at = excluded.updated_at
      `,
    )
      .bind(
        type,
        type.replace(/_/g, " "),
        String(body.subject || "").trim() || type.replace(/_/g, " "),
        String(body.body || "").trim() || "Template ready for provider configuration.",
        body.active === false || body.active === 0 || body.active === "0" ? 0 : 1,
        now,
        now,
      )
      .run();

    return json({ success: true, message: "Automation template salvato." });
  } catch (error) {
    if (tableMissing(error)) {
      return json({ success: false, message: "Notification tables non disponibili." }, { status: 503 });
    }
    return json({ success: false, message: "Impossibile salvare l'automazione." }, { status: 500 });
  }
}
