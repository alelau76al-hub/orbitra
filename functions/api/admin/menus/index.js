function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function handleify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function readBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

export async function onRequestGet({ env }) {
  try {
    const menusResult = await env.DB.prepare(
      `
      SELECT
        id,
        handle,
        name,
        created_at,
        updated_at
      FROM menus
      ORDER BY id ASC
      `,
    ).all()

    const itemsResult = await env.DB.prepare(
      `
      SELECT
        id,
        menu_id,
        label,
        link_type,
        target_slug,
        url,
        sort_order,
        parent_id,
        active,
        created_at,
        updated_at
      FROM menu_items
      WHERE active = 1
      ORDER BY menu_id ASC, sort_order ASC, id ASC
      `,
    ).all()

    const menus = (menusResult.results || []).map((menu) => ({
      ...menu,
      items: (itemsResult.results || []).filter((item) => item.menu_id === menu.id),
    }))

    return json({
      success: true,
      menus,
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore caricamento menu.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await readBody(request)
    const type = body.type || 'item'

    if (type === 'menu') {
      const name = String(body.name || '').trim()
      const handle = handleify(body.handle || name)

      if (!name) {
        return json(
          {
            success: false,
            message: 'Il nome menu è obbligatorio.',
          },
          400,
        )
      }

      if (!handle) {
        return json(
          {
            success: false,
            message: 'Handle menu obbligatorio.',
          },
          400,
        )
      }

      await env.DB.prepare(
        `
        INSERT INTO menus (
          handle,
          name
        )
        VALUES (?, ?)
        `,
      )
        .bind(handle, name)
        .run()

      return json({
        success: true,
        message: 'Menu creato.',
      })
    }

    const menu_id = Number(body.menu_id)
    const label = String(body.label || '').trim()
    const link_type = String(body.link_type || 'url').trim()
    const target_slug = String(body.target_slug || '').trim()
    const url = String(body.url || '').trim()
    const parent_id = body.parent_id ? Number(body.parent_id) : null

    if (!menu_id) {
      return json(
        {
          success: false,
          message: 'Menu mancante.',
        },
        400,
      )
    }

    if (!label) {
      return json(
        {
          success: false,
          message: 'Etichetta voce menu obbligatoria.',
        },
        400,
      )
    }

    if (link_type === 'url' && !url) {
      return json(
        {
          success: false,
          message: 'URL obbligatorio per link esterni.',
        },
        400,
      )
    }

    if (link_type !== 'url' && !target_slug) {
      return json(
        {
          success: false,
          message: 'Target obbligatorio per questo tipo di link.',
        },
        400,
      )
    }

    const orderResult = await env.DB.prepare(
      `
      SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
      FROM menu_items
      WHERE menu_id = ?
      `,
    )
      .bind(menu_id)
      .first()

    await env.DB.prepare(
      `
      INSERT INTO menu_items (
        menu_id,
        label,
        link_type,
        target_slug,
        url,
        sort_order,
        parent_id,
        active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `,
    )
      .bind(
        menu_id,
        label,
        link_type,
        target_slug,
        url,
        orderResult?.next_order || 0,
        parent_id,
      )
      .run()

    return json({
      success: true,
      message: 'Voce menu creata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore creazione menu.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const body = await readBody(request)
    const type = body.type || 'item'

    if (type === 'menu') {
      const id = Number(body.id)
      const name = String(body.name || '').trim()
      const handle = handleify(body.handle || name)

      if (!id) {
        return json(
          {
            success: false,
            message: 'ID menu mancante.',
          },
          400,
        )
      }

      if (!name) {
        return json(
          {
            success: false,
            message: 'Nome menu obbligatorio.',
          },
          400,
        )
      }

      await env.DB.prepare(
        `
        UPDATE menus
        SET
          handle = ?,
          name = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
      )
        .bind(handle, name, id)
        .run()

      return json({
        success: true,
        message: 'Menu aggiornato.',
      })
    }

    const id = Number(body.id)
    const label = String(body.label || '').trim()
    const link_type = String(body.link_type || 'url').trim()
    const target_slug = String(body.target_slug || '').trim()
    const url = String(body.url || '').trim()
    const sort_order = Number(body.sort_order || 0)
    const parent_id = body.parent_id ? Number(body.parent_id) : null

    if (!id) {
      return json(
        {
          success: false,
          message: 'ID voce menu mancante.',
        },
        400,
      )
    }

    if (!label) {
      return json(
        {
          success: false,
          message: 'Etichetta voce menu obbligatoria.',
        },
        400,
      )
    }

    await env.DB.prepare(
      `
      UPDATE menu_items
      SET
        label = ?,
        link_type = ?,
        target_slug = ?,
        url = ?,
        sort_order = ?,
        parent_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
    )
      .bind(label, link_type, target_slug, url, sort_order, parent_id, id)
      .run()

    return json({
      success: true,
      message: 'Voce menu aggiornata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore aggiornamento menu.',
        error: error.message,
      },
      500,
    )
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const body = await readBody(request)
    const type = body.type || 'item'
    const id = Number(body.id)

    if (!id) {
      return json(
        {
          success: false,
          message: 'ID mancante.',
        },
        400,
      )
    }

    if (type === 'menu') {
      const menu = await env.DB.prepare(
        `
        SELECT handle
        FROM menus
        WHERE id = ?
        `,
      )
        .bind(id)
        .first()

      if (!menu) {
        return json(
          {
            success: false,
            message: 'Menu non trovato.',
          },
          404,
        )
      }

      if (menu.handle === 'main' || menu.handle === 'footer') {
        return json(
          {
            success: false,
            message: 'I menu principali non possono essere eliminati.',
          },
          400,
        )
      }

      await env.DB.prepare(
        `
        DELETE FROM menu_items
        WHERE menu_id = ?
        `,
      )
        .bind(id)
        .run()

      await env.DB.prepare(
        `
        DELETE FROM menus
        WHERE id = ?
        `,
      )
        .bind(id)
        .run()

      return json({
        success: true,
        message: 'Menu eliminato.',
      })
    }

    await env.DB.prepare(
      `
      UPDATE menu_items
      SET active = 0
      WHERE id = ?
      `,
    )
      .bind(id)
      .run()

    return json({
      success: true,
      message: 'Voce menu eliminata.',
    })
  } catch (error) {
    return json(
      {
        success: false,
        message: 'Errore eliminazione menu.',
        error: error.message,
      },
      500,
    )
  }
}