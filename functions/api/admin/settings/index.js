function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function groupSettings(settings = []) {
  return settings.reduce((groups, setting) => {
    const groupName = setting.group_name || 'general'

    if (!groups[groupName]) {
      groups[groupName] = []
    }

    groups[groupName].push(setting)

    return groups
  }, {})
}

const DEFAULT_SETTINGS = [
  {
    key: 'cookie_banner_status',
    value: 'disabled',
    group_name: 'privacy',
    type: 'select',
    label: 'Cookie banner status',
  },
  {
    key: 'cookie_consent_categories',
    value: 'necessary,analytics,marketing',
    group_name: 'privacy',
    type: 'text',
    label: 'Cookie consent categories',
  },
  {
    key: 'privacy_google_consent_note',
    value: 'Google tags are loaded only after visitor consent.',
    group_name: 'privacy',
    type: 'text',
    label: 'Google Consent note',
  },
]

const settingMeta = DEFAULT_SETTINGS.reduce((map, setting) => {
  map[setting.key] = setting
  return map
}, {})

function mergeDefaultSettings(settings = []) {
  const existing = new Set(settings.map((setting) => setting.key))
  return [
    ...settings,
    ...DEFAULT_SETTINGS.filter((setting) => !existing.has(setting.key)),
  ]
}

export async function onRequestGet({ env }) {
  try {
    const result = await env.DB.prepare(
      `
      SELECT
        key,
        value,
        group_name,
        type,
        label,
        created_at,
        updated_at
      FROM site_settings
      ORDER BY
        CASE group_name
          WHEN 'brand' THEN 1
          WHEN 'theme' THEN 2
          WHEN 'header' THEN 3
          WHEN 'footer' THEN 4
          WHEN 'social' THEN 5
          WHEN 'general' THEN 6
          ELSE 99
        END,
        key ASC
      `,
    ).all()

    const settings = mergeDefaultSettings(result.results || [])

    return json({
      success: true,
      settings,
      groups: groupSettings(settings),
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento impostazioni.',
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const settings = body.settings || {}

    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      return json(
        {
          success: false,
          message: 'Formato impostazioni non valido.',
        },
        400,
      )
    }

    const entries = Object.entries(settings)

    if (entries.length === 0) {
      return json(
        {
          success: false,
          message: 'Nessuna impostazione da salvare.',
        },
        400,
      )
    }

    for (const [key, value] of entries) {
      const meta = settingMeta[key] || {
        group_name: 'general',
        type: 'text',
        label: key,
      }

      await env.DB.prepare(
        `
        INSERT INTO site_settings (key, value, group_name, type, label, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          group_name = excluded.group_name,
          type = excluded.type,
          label = excluded.label,
          updated_at = CURRENT_TIMESTAMP
        `,
      )
        .bind(
          key,
          String(value ?? ''),
          meta.group_name,
          meta.type,
          meta.label,
        )
        .run()
    }

    return json({
      success: true,
      message: 'Impostazioni salvate.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore salvataggio impostazioni.',
      },
      500,
    )
  }
}
