function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
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
  } catch {
    const settings = mergeDefaultSettings([])

    return json(
      {
        success: true,
        settings,
        groups: groupSettings(settings),
        fallback: true,
      },
    )
  }
}
