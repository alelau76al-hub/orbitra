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
      await env.DB.prepare(
        `
        UPDATE site_settings
        SET
          value = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE key = ?
        `,
      )
        .bind(String(value ?? ''), key)
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
        error: error.message,
      },
      500,
    )
  }
}