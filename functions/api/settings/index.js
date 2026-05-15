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

    const settings = result.results || []

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
        error: error.message,
      },
      500,
    )
  }
}
