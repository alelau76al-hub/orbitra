function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

const nativeApps = [
  {
    id: 'takeoff-import-export',
    name: 'TakeOff Import Export',
    description: 'Importa, esporta e aggiorna in massa dati del sito senza app esterne.',
    status: 'active',
    status_label: 'Attiva',
    category: 'Operations',
    open_hash: '#import-export',
    badge: 'Native app',
  },
  {
    id: 'takeoff-translate',
    name: 'TakeOff Translate',
    description: 'Gestione traduzioni contenuti pubblici con fallback alla lingua originale.',
    status: 'configurable',
    status_label: 'Configurabile',
    category: 'Content',
    open_hash: '#traduzioni',
    badge: 'Native app',
  },
  {
    id: 'takeoff-seo',
    name: 'TakeOff SEO',
    description: 'Strumenti SEO nativi per metadati, contenuti e audit futuri.',
    status: 'in_development',
    status_label: 'In sviluppo',
    category: 'Growth',
    open_hash: '#seo',
    badge: 'Native app',
  },
  {
    id: 'takeoff-analytics',
    name: 'TakeOff Analytics',
    description: 'Eventi e metriche base per monitorare traffico, prodotti e conversioni.',
    status: 'configurable',
    status_label: 'Configurabile',
    category: 'Analytics',
    open_hash: '#analisi',
    badge: 'Native app',
  },
  {
    id: 'takeoff-3d-viewer',
    name: 'TakeOff 3D Viewer',
    description: 'Viewer prodotto 3D nativo per esperienze digitali premium.',
    status: 'in_development',
    status_label: 'In sviluppo',
    category: 'Experience',
    open_hash: '#editor',
    badge: 'Native app',
  },
  {
    id: 'takeoff-marketing',
    name: 'TakeOff Marketing',
    description: 'Campagne, sconti e strumenti promozionali integrati nel CMS.',
    status: 'configurable',
    status_label: 'Configurabile',
    category: 'Growth',
    open_hash: '#marketing',
    badge: 'Native app',
  },
  {
    id: 'takeoff-integrations',
    name: 'TakeOff Integrations',
    description: 'Integrazioni e webhook non sensibili gestiti dal pannello.',
    status: 'configurable',
    status_label: 'Configurabile',
    category: 'Platform',
    open_hash: '#integrazioni',
    badge: 'Native app',
  },
]

export async function onRequestGet() {
  return json({
    success: true,
    apps: nativeApps,
  })
}
