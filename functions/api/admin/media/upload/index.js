function json(data, status = 200) {
  return Response.json(data, { status })
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'application/pdf',
])

function readText(value = '') {
  return String(value || '').trim()
}

function mediaTypeFromMime(mimeType = '') {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'file'
}

function extensionFromFileName(name = '') {
  const match = String(name).toLowerCase().match(/\.([a-z0-9]+)$/)
  return match ? match[1] : 'bin'
}

function safeFileName(name = '') {
  return String(name || 'media')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'media'
}

function buildStorageKey(file) {
  const date = new Date()
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const random = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
  const extension = extensionFromFileName(file.name)

  return `media/${year}/${month}/${random}-${safeFileName(file.name || `upload.${extension}`)}`
}

async function hasExtendedMediaColumns(env) {
  try {
    await env.DB.prepare('SELECT size, mime_type, storage_provider, storage_key FROM media_items LIMIT 1').first()
    return true
  } catch {
    return false
  }
}

async function insertMedia(env, media, hasExtendedColumns) {
  if (hasExtendedColumns) {
    const inserted = await env.DB.prepare(`
      INSERT INTO media_items (
        name,
        url,
        type,
        alt_text,
        size,
        mime_type,
        storage_provider,
        storage_key,
        active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `)
      .bind(
        media.name,
        media.url,
        media.type,
        media.alt_text,
        media.size,
        media.mime_type,
        media.storage_provider,
        media.storage_key,
      )
      .run()

    return inserted.meta.last_row_id
  }

  const inserted = await env.DB.prepare(`
    INSERT INTO media_items (
      name,
      url,
      type,
      alt_text,
      active
    )
    VALUES (?, ?, ?, ?, 1)
  `)
    .bind(media.name, media.url, media.type, media.alt_text)
    .run()

  return inserted.meta.last_row_id
}

function validateUploadFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    return 'Seleziona un file da caricare.'
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return 'Tipo file non consentito. Usa JPEG, PNG, WebP, GIF, MP4 o PDF.'
  }

  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    return 'File troppo grande o vuoto. Limite massimo: 10 MB.'
  }

  return ''
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.MEDIA_BUCKET || typeof env.MEDIA_BUCKET.put !== 'function' || !env.MEDIA_PUBLIC_BASE_URL) {
      return json(
        {
          success: false,
          upload_configured: false,
          message: 'Upload reale non configurato. Imposta MEDIA_BUCKET e MEDIA_PUBLIC_BASE_URL, oppure usa URL manuale.',
        },
        503,
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const validationMessage = validateUploadFile(file)

    if (validationMessage) {
      return json({ success: false, message: validationMessage }, 400)
    }

    const storageKey = buildStorageKey(file)
    const publicBaseUrl = readText(env.MEDIA_PUBLIC_BASE_URL).replace(/\/+$/, '')
    const publicUrl = `${publicBaseUrl}/${storageKey}`
    const arrayBuffer = await file.arrayBuffer()

    await env.MEDIA_BUCKET.put(storageKey, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const media = {
      name: readText(formData.get('name')) || file.name || 'Media upload',
      url: publicUrl,
      type: mediaTypeFromMime(file.type),
      alt_text: readText(formData.get('alt_text')),
      size: Number(file.size || 0),
      mime_type: file.type,
      storage_provider: 'r2',
      storage_key: storageKey,
    }
    const id = await insertMedia(env, media, await hasExtendedMediaColumns(env))

    return json({
      success: true,
      message: 'Media caricato.',
      media: {
        id,
        ...media,
      },
    })
  } catch {
    return json(
      {
        success: false,
        message: 'Upload media non riuscito. Verifica configurazione storage e riprova.',
      },
      500,
    )
  }
}
