const adminAuthGate = document.querySelector('#adminAuthGate')
const adminApp = document.querySelector('#adminApp')
const adminLoginForm = document.querySelector('#adminLoginForm')
const adminBootstrapForm = document.querySelector('#adminBootstrapForm')
const adminAuthIntro = document.querySelector('#adminAuthIntro')
const adminAuthMessage = document.querySelector('#adminAuthMessage')
const adminSessionBar = document.querySelector('#adminSessionBar')
const adminSessionName = document.querySelector('#adminSessionName')
const adminSessionRole = document.querySelector('#adminSessionRole')
const adminCurrentView = document.querySelector('#adminCurrentView')
const adminLogoutButton = document.querySelector('#adminLogoutButton')
const adminThemeToggle = document.querySelector('#adminThemeToggle')
const adminEntryScreen = document.querySelector('#adminEntryScreen')
const adminEntryEnterButton = document.querySelector('#adminEntryEnterButton')
const adminEntryCountdownLabel = document.querySelector('#adminEntryCountdownLabel')
const adminEntryCountdownNumber = document.querySelector('#adminEntryCountdownNumber')
const adminDashboardCounters = {
  products: document.querySelector('#dashboardProductsCount'),
  collections: document.querySelector('#dashboardCollectionsCount'),
  orders: document.querySelector('#dashboardOrdersCount'),
  media: document.querySelector('#dashboardMediaCount'),
}
const nativeFetch = window.fetch.bind(window)

function setupAdminLogoFallbacks() {
  document.querySelectorAll('[data-admin-logo]').forEach((logo) => {
    logo.addEventListener('error', () => {
      const fallbackSrc = logo.dataset.fallbackSrc

      if (fallbackSrc && logo.dataset.fallbackUsed !== 'true') {
        logo.dataset.fallbackUsed = 'true'
        logo.src = fallbackSrc
        return
      }

      logo.hidden = true
      const fallbackText = logo
        .closest('.admin-logo-lockup')
        ?.querySelector('.admin-logo-fallback')

      if (fallbackText) fallbackText.hidden = false
    })
  })
}

setupAdminLogoFallbacks()

const ADMIN_LANGUAGE_STORAGE_KEY = 'takeoff_admin_language_v1'
const ADMIN_DEFAULT_LANGUAGE = 'it'
const ADMIN_THEME_STORAGE_KEY = 'takeoff_admin_theme_v1'
const ADMIN_DEFAULT_THEME = 'dark'
const ADMIN_ENTRY_STORAGE_KEY = 'takeoff_admin_entry_seen_v1'
const ADMIN_ENTRY_DURATION_SECONDS = 5
const ADMIN_DEMO_MODE = true
const ADMIN_DEMO_USER = {
  id: 'demo-admin',
  name: 'Demo Admin',
  email: 'demo@takeoffmilan.local',
  role: 'owner',
  audit_mode: false,
}
const ADMIN_TRANSLATIONS = {
  it: {
    documentTitle: 'TakeOffMilan CMS',
    languageLabel: 'Lingua',
    languageAriaLabel: 'Lingua admin',
    auditBadge: 'AUDIT MODE - READ ONLY',
    auditMessage: 'Audit mode: modifiche disabilitate.',
    authEyebrow: 'TakeOffMilan CMS',
    authTitle: 'TakeOff Control Panel',
    authLoginIntro: 'Inserisci le credenziali admin per gestire contenuti, catalogo e impostazioni del sito.',
    authBootstrapIntro: 'Crea il primo owner del TakeOff Control Panel. Dopo questa operazione il bootstrap verra disattivato.',
    authMigrationIntro: 'Prima di accedere al CMS devi applicare la migration di autenticazione.',
    authChecking: 'Verifica sessione admin...',
    authLoginButton: 'Accedi',
    authBootstrapButton: 'Crea primo owner',
    authNameOwner: 'Nome owner',
    authEmailOwner: 'Email owner',
    authEmail: 'Email',
    authPassword: 'Password',
    entryTitle: 'TakeOffMilan CMS',
    entrySubtitle: 'Il futuro dei siti web',
    entryClaim: 'Powerful. Flexible. Custom.',
    entryCountdown: 'Il tuo CMS si aprira tra',
    entryButton: 'Enter CMS',
    themeLight: 'Light mode',
    themeDark: 'Dark mode',
    navDashboard: 'Dashboard',
    navDashboardDesc: 'Panoramica e azioni rapide',
    navEditor: 'Editor sito',
    navEditorDesc: 'Homepage, sezioni visuali, tema e preview live',
    navCatalog: 'Catalogo',
    navCatalogDesc: 'Prodotti, collezioni, varianti e inventario',
    navOrders: 'Ordini',
    navOrdersDesc: 'Pagamenti, stato ordine e clienti',
    navCustomers: 'Clienti',
    navCustomersDesc: 'Profili, email, storico acquisti',
    navContent: 'Contenuto',
    navContentDesc: 'Pagine, menu, media e SEO',
    navMarketing: 'Marketing',
    navMarketingDesc: 'Campagne, sconti, coupon e promo',
    navMarkets: 'Markets',
    navMarketsDesc: 'Mercati, paesi, lingue, valute e prezzi',
    navAnalytics: 'Analisi',
    navAnalyticsDesc: 'Vendite, traffico, conversioni e report',
    navCheckout: 'Check-out',
    navCheckoutDesc: 'Checkout, pagamenti, spedizioni, tasse e conferma',
    navSettings: 'Impostazioni',
    navSettingsDesc: 'Generali, domini, utenti, privacy e operativita',
    navApps: 'Apps',
    navAppsDesc: 'App native TakeOff e moduli interni del CMS',
    navGoogleSuite: 'Google Suite',
    navGoogleSuiteDesc: 'GA4, Ads, GTM, Search',
    navMediaLibrary: 'Media Library',
    navMediaLibraryDesc: 'Upload, URL, alt text',
    navImportExport: 'Import Export',
    navImportExportDesc: 'DataFlow e package',
    navTranslations: 'Traduzioni',
    navTranslationsDesc: 'Contenuti multilingua',
    navUsers: 'Utenti e permessi',
    navUsersDesc: 'Accessi e ruoli',
    navPerformance: 'Performance',
    navPerformanceDesc: 'Produzione e checklist',
    heroEyebrow: 'TakeOffMilan CMS',
    heroTitle: 'TakeOff Control Panel',
    heroText: 'Next Generation Website CMS per controllare contenuti, catalogo, checkout e impostazioni da un pannello proprietario.',
    editorTitle: 'Editor visuale sito',
    editorDesc: 'Personalizza sezioni, contenuti e impostazioni del sito cliente senza toccare codice.',
    previewDesktop: 'Desktop preview',
    previewTablet: 'Tablet preview',
    previewMobile: 'Mobile preview',
    catalogTitle: 'Catalogo',
    catalogDesc: 'Gestisci prodotti, collezioni, stock, immagini e struttura commerciale del sito.',
    productsTitle: 'Prodotti',
    collectionsTitle: 'Collezioni',
    ordersTitle: 'Ordini',
    customersTitle: 'Clienti',
    contentTitle: 'Contenuto',
    mediaTitle: 'Media',
    blogTitle: 'Blog',
    policyTitle: 'Policy',
    translationsTitle: 'Traduzioni',
    marketingTitle: 'Marketing',
    marketsTitle: 'Markets',
    analyticsTitle: 'Analisi',
    checkoutTitle: 'Check-out',
    settingsTitle: 'Impostazioni admin',
    usersTitle: 'Utenti / permessi',
    performanceTitle: 'Performance produzione',
    appsTitle: 'App Hub',
    appsDesc: 'Moduli nativi TakeOff integrati nel CMS, senza marketplace esterno o abbonamenti aggiuntivi.',
    googleSuiteTitle: 'TakeOff Google Suite',
    googleSuiteDesc: 'Configura GA4, Google Ads, Search Console e Tag Manager senza salvare secrets.',
    importExportTitle: 'TakeOff Import Export',
    importExportDesc: 'Importa, esporta e aggiorna in massa dati del sito senza app esterne.',
    googleConsentNote: 'Google tags restano conservativi: gli script di tracking partono solo dopo consenso analytics o marketing sul sito pubblico.',
    mediaPickerButton: 'Scegli da Media Library',
    mediaPickerTitle: 'Scegli un media',
    mediaPickerSearch: 'Cerca per nome, alt text o URL...',
    mediaPickerEmpty: 'Nessun media disponibile. Il campo URL manuale resta sempre utilizzabile.',
    mediaPickerLoading: 'Caricamento media...',
    mediaPickerManualFallback: 'Se la libreria non carica, inserisci o incolla un URL manualmente nel campo.',
    mediaPickerClose: 'Chiudi',
    mediaPickerSelect: 'Seleziona',
    prepareExport: 'Prepara export',
    validateImport: 'Valida / importa',
    downloadTemplate: 'Scarica template',
    exportTranslationPackage: 'Esporta package',
    importTranslationPackage: 'Importa translation package',
    exportSitePackage: 'Esporta site package',
    refreshHistory: 'Aggiorna history',
    statusOperational: 'Operativo',
    statusArea: 'Area',
    statusBaseConfig: 'Configurazione base',
    statusDevelopment: 'Advanced tools in progress',
    logout: 'Logout',
  },
  en: {
    documentTitle: 'TakeOffMilan CMS',
    languageLabel: 'Language',
    languageAriaLabel: 'Admin language',
    auditBadge: 'AUDIT MODE - READ ONLY',
    auditMessage: 'Audit mode: changes are disabled.',
    authEyebrow: 'TakeOffMilan CMS',
    authTitle: 'TakeOff Control Panel',
    authLoginIntro: 'Sign in to manage site content, catalog and settings.',
    authBootstrapIntro: 'Create the first owner for the TakeOff Control Panel. Bootstrap will be disabled after this step.',
    authMigrationIntro: 'Apply the authentication migration before accessing the CMS.',
    authChecking: 'Checking admin session...',
    authLoginButton: 'Sign in',
    authBootstrapButton: 'Create first owner',
    authNameOwner: 'Owner name',
    authEmailOwner: 'Owner email',
    authEmail: 'Email',
    authPassword: 'Password',
    entryTitle: 'TakeOffMilan CMS',
    entrySubtitle: 'The future of websites',
    entryClaim: 'Powerful. Flexible. Custom.',
    entryCountdown: 'Your CMS opens in',
    entryButton: 'Enter CMS',
    themeLight: 'Light mode',
    themeDark: 'Dark mode',
    navDashboard: 'Dashboard',
    navDashboardDesc: 'Overview and quick actions',
    navEditor: 'Site editor',
    navEditorDesc: 'Homepage, visual sections, theme and live preview',
    navCatalog: 'Catalog',
    navCatalogDesc: 'Products, collections, variants and inventory',
    navOrders: 'Orders',
    navOrdersDesc: 'Payments, order status and customers',
    navCustomers: 'Customers',
    navCustomersDesc: 'Profiles, emails and order history',
    navContent: 'Content',
    navContentDesc: 'Pages, menus, media and SEO',
    navMarketing: 'Marketing',
    navMarketingDesc: 'Campaigns, discounts, coupons and promos',
    navMarkets: 'Markets',
    navMarketsDesc: 'Markets, countries, languages, currencies and pricing',
    navAnalytics: 'Analytics',
    navAnalyticsDesc: 'Sales, traffic, conversions and reports',
    navCheckout: 'Checkout',
    navCheckoutDesc: 'Checkout, payments, shipping, taxes and confirmation',
    navSettings: 'Settings',
    navSettingsDesc: 'General, domains, users, privacy and operations',
    navApps: 'Apps',
    navAppsDesc: 'TakeOff native apps and internal CMS modules',
    navGoogleSuite: 'Google Suite',
    navGoogleSuiteDesc: 'GA4, Ads, GTM, Search',
    navMediaLibrary: 'Media Library',
    navMediaLibraryDesc: 'Upload, URLs, alt text',
    navImportExport: 'Import Export',
    navImportExportDesc: 'DataFlow and packages',
    navTranslations: 'Translations',
    navTranslationsDesc: 'Multilingual content',
    navUsers: 'Users and permissions',
    navUsersDesc: 'Access and roles',
    navPerformance: 'Performance',
    navPerformanceDesc: 'Production and checklist',
    heroEyebrow: 'TakeOffMilan CMS',
    heroTitle: 'TakeOff Control Panel',
    heroText: 'Next Generation Website CMS to control content, catalog, checkout and settings from a proprietary panel.',
    editorTitle: 'Visual site editor',
    editorDesc: 'Customize sections, content and client site settings without touching code.',
    previewDesktop: 'Desktop preview',
    previewTablet: 'Tablet preview',
    previewMobile: 'Mobile preview',
    catalogTitle: 'Catalog',
    catalogDesc: 'Manage products, collections, stock, images and commercial structure.',
    productsTitle: 'Products',
    collectionsTitle: 'Collections',
    ordersTitle: 'Orders',
    customersTitle: 'Customers',
    contentTitle: 'Content',
    mediaTitle: 'Media',
    blogTitle: 'Blog',
    policyTitle: 'Policies',
    translationsTitle: 'Translations',
    marketingTitle: 'Marketing',
    marketsTitle: 'Markets',
    analyticsTitle: 'Analytics',
    checkoutTitle: 'Checkout',
    settingsTitle: 'Admin settings',
    usersTitle: 'Users / permissions',
    performanceTitle: 'Production performance',
    appsTitle: 'App Hub',
    appsDesc: 'TakeOff native modules integrated into the CMS without an external marketplace or extra subscriptions.',
    googleSuiteTitle: 'TakeOff Google Suite',
    googleSuiteDesc: 'Configure GA4, Google Ads, Search Console and Tag Manager without storing secrets.',
    importExportTitle: 'TakeOff Import Export',
    importExportDesc: 'Import, export and bulk update site data without external apps.',
    googleConsentNote: 'Google tags stay conservative: tracking scripts start only after analytics or marketing consent on the storefront.',
    mediaPickerButton: 'Choose from Media Library',
    mediaPickerTitle: 'Choose media',
    mediaPickerSearch: 'Search by name, alt text or URL...',
    mediaPickerEmpty: 'No media available. The manual URL field always remains usable.',
    mediaPickerLoading: 'Loading media...',
    mediaPickerManualFallback: 'If the library cannot load, paste or type a URL manually in the field.',
    mediaPickerClose: 'Close',
    mediaPickerSelect: 'Select',
    prepareExport: 'Prepare export',
    validateImport: 'Validate / import',
    downloadTemplate: 'Download template',
    exportTranslationPackage: 'Export package',
    importTranslationPackage: 'Import translation package',
    exportSitePackage: 'Export site package',
    refreshHistory: 'Refresh history',
    statusOperational: 'Operational',
    statusArea: 'Area',
    statusBaseConfig: 'Basic configuration',
    statusDevelopment: 'Advanced tools in progress',
    logout: 'Logout',
  },
}

Object.assign(ADMIN_TRANSLATIONS.it, {
  'dashboard.title': 'Benvenuto nel CMS',
  'dashboard.claim': 'Crea, gestisci e fai crescere siti custom da un unico sistema operativo.',
  'dashboard.quickAction': 'Azione rapida',
  'dashboard.editSite.title': 'Modifica il sito',
  'dashboard.editSite.description': 'Apri editor visuale, sezioni e tema.',
  'dashboard.manageProducts.title': 'Gestisci prodotti',
  'dashboard.manageProducts.description': 'Catalogo, varianti, immagini e stock.',
  'dashboard.uploadMedia.title': 'Carica media',
  'dashboard.uploadMedia.description': 'Libreria visuale, upload e URL.',
  'dashboard.configureMarkets.title': 'Configura markets',
  'dashboard.configureMarkets.description': 'Lingue, valute e prezzi localizzati.',
  'dashboard.summary.products': 'Prodotti',
  'dashboard.summary.productsDescription': 'Catalogo attivo e varianti.',
  'dashboard.summary.collections': 'Collezioni',
  'dashboard.summary.collectionsDescription': 'Struttura catalogo.',
  'dashboard.summary.orders': 'Ordini',
  'dashboard.summary.ordersDescription': 'Stato operativo commerce.',
  'dashboard.summary.media': 'Media',
  'dashboard.summary.mediaDescription': 'Asset disponibili nel CMS.',
  'editor.mainFeature': 'Funzione principale',
  'editor.visualEditor': 'Visual Editor',
  'editor.description': 'Il cuore del CMS: costruisci, controlla e verifica il sito in tempo reale su desktop, tablet e mobile.',
  'editor.previewFormat': 'Formato preview',
  'editor.pageToEdit': 'Pagina da modificare',
  'editor.sectionLibrary': 'Libreria sezioni CMS',
  'editor.sectionLibraryDescription': 'Scegli una sezione gia pronta e personalizzala nella pagina selezionata.',
  'editor.sectionLibraryLabel': 'Libreria sezioni',
  'editor.themeSettings': 'Impostazioni tema',
  'editor.themeSettingsDescription': 'Logo, colori, tipografie, header e footer.',
  'editor.closeThemeSettings': 'Chiudi impostazioni tema',
  'editor.loadingThemeSettings': 'Caricamento impostazioni tema...',
  'editor.saveSettings': 'Salva impostazioni',
  'editor.saveSection': 'Salva sezione',
  'editor.addSection': 'Aggiungi',
  'editor.pageSections': 'Sezioni pagina',
  'editor.selectSection': 'Seleziona una sezione',
  'editor.selectSectionHelp': 'Seleziona una sezione dalla lista.',
  'editor.pagesLoadError': 'Errore caricamento pagine editor.',
  'editor.sectionsLoadError': 'Errore caricamento sezioni.',
  'editor.sectionDeleteConfirm': 'Vuoi eliminare questa sezione?',
  'editor.sectionDeleteError': 'Errore eliminazione sezione.',
  'editor.sectionDeleted': 'Sezione eliminata.',
  'editor.sectionSaving': 'Salvataggio...',
  'editor.sectionSaved': 'Sezione salvata.',
  'editor.sectionSaveError': 'Errore salvataggio.',
  'editor.sectionAdding': 'Aggiunta sezione...',
  'editor.sectionAddError': 'Errore aggiunta sezione.',
  'editor.sectionAdded': 'Sezione aggiunta.',
  'editor.up': 'Su',
  'editor.down': 'Giu',
  'editor.desktop': 'Desktop',
  'editor.tablet': 'Tablet',
  'editor.mobile': 'Mobile',
  'editor.liveCanvas': 'Live canvas',
  'editor.sitePreviewTitle': 'Anteprima sito',
  'content.title': 'Contenuto',
  'content.pages.title': 'Pagine',
  'content.pages.description': 'Crea e modifica pagine istituzionali, landing e contenuti custom.',
  'content.menu.title': 'Menu',
  'content.menu.description': 'Crea menu collegati a pagine, collezioni, prodotti o URL esterni.',
  'content.media.description': 'Gestisci upload predisposto, URL media, anteprime, alt text e asset riutilizzabili.',
  'content.blog.description': 'Articoli pubblici, bozze, contenuti e SEO base.',
  'content.metaobjects.description': 'Oggetti contenuto riutilizzabili e API pubblica read-only.',
  'content.policy.description': 'Privacy, termini, resi, spedizioni e cookie policy pubblicabili.',
  'content.translations.description': 'Adatta prodotti, pagine, sezioni, blog e policy per mercati internazionali.',
  'content.seo.description': 'Dashboard SEO centrale per metadati, snippet, canonical e priorita di intervento.',
  'catalog.products.description': 'Gestisci schede prodotto, immagini, prezzi e disponibilita.',
  'catalog.collections.description': 'Raggruppa prodotti in collezioni cliccabili e pagine dedicate.',
  'catalog.variants.location': 'Nel prodotto',
  'catalog.variants.title': 'Varianti',
  'catalog.variants.description': 'Gestisci opzioni, SKU, prezzo e stock variante nel form prodotto.',
  'catalog.inventory.active': 'Funzione attiva',
  'catalog.inventory.title': 'Inventario',
  'catalog.inventory.description': 'Scorte prodotto e variante, filtri, soglie low stock e aggiornamento rapido.',
  'pages.title': 'Pagine',
  'pages.description': 'Crea, modifica e organizza le pagine del sito.',
  'pages.addTitle': 'Aggiungi pagina',
  'pages.editTitle': 'Modifica pagina',
  'pages.updateTitle': 'Aggiorna pagina',
  'pages.titleLabel': 'Titolo pagina',
  'pages.save': 'Salva pagina',
  'pages.update': 'Aggiorna pagina',
  'pages.archive': 'Pagine nel CMS',
  'pages.loading': 'Caricamento pagine...',
  'pages.loadError': 'Errore nel caricamento pagine.',
  'pages.empty': 'Nessuna pagina trovata.',
  'pages.editSections': 'Modifica sezioni',
  'pages.protectedHomepage': 'Homepage protetta',
  'pages.deleteConfirm': 'Vuoi eliminare questa pagina?',
  'pages.deleteError': 'Errore durante eliminazione pagina.',
  'pages.connectionError': 'Errore di connessione alla API pagine.',
  'pages.saveProgress': 'Salvataggio in corso...',
  'pages.saveError': 'Errore nel salvataggio.',
  'pages.saved': 'Pagina salvata correttamente.',
  'pages.updated': 'Pagina aggiornata correttamente.',
  'catalog.products.manage': 'Gestisci prodotti',
  'products.add': 'Aggiungi prodotto',
  'products.description': 'Gestisci prodotti, varianti, prezzo, stock e dati SEO del catalogo cliente.',
  'products.save': 'Salva prodotto',
  'products.edit': 'Modifica prodotto',
  'products.update': 'Aggiorna prodotto',
  'products.archive': 'Archivio prodotti',
  'products.searchPlaceholder': 'Cerca prodotti...',
  'products.loading': 'Caricamento prodotti...',
  'products.loadError': 'Errore nel caricamento prodotti.',
  'products.empty': 'Nessun prodotto trovato.',
  'products.noSearchResults': 'Nessun prodotto corrisponde alla ricerca.',
  'products.noDescription': 'Nessuna descrizione',
  'products.noCategory': 'Senza categoria',
  'products.noCollection': 'Senza collezione',
  'products.disableConfirm': 'Vuoi disattivare questo prodotto?',
  'products.disableError': 'Errore durante la disattivazione.',
  'products.connectionError': 'Errore di connessione alla API.',
  'products.stock': 'Stock',
  'products.variants': 'varianti',
  'products.outOfStock': 'Esaurito',
  'products.lowStock': 'Stock basso',
  'products.variant.empty': 'Nessuna variante configurata.',
  'products.variant.optionName': 'Nome opzione',
  'products.variant.optionValue': 'Valore',
  'products.variant.optionNamePlaceholder': 'Colore',
  'products.variant.optionValuePlaceholder': 'Rosso',
  'products.variant.price': 'Prezzo variante',
  'products.variant.stock': 'Stock variante',
  'products.variant.optionalSku': 'SKU opzionale',
  'products.variant.emptyValue': 'Lascia vuoto',
  'collections.title': 'Collezioni',
  'collections.description': 'Crea e modifica le collezioni del catalogo.',
  'collections.backToCatalog': 'Torna a Catalogo',
  'collections.add': 'Aggiungi collezione',
  'collections.save': 'Salva collezione',
  'collections.edit': 'Modifica collezione',
  'collections.update': 'Aggiorna collezione',
  'collections.name': 'Nome collezione',
  'collections.namePlaceholder': 'Collezione premium',
  'collections.archive': 'Archivio collezioni',
  'collections.searchPlaceholder': 'Cerca collezioni...',
  'collections.noCollection': 'Senza collezione',
  'collections.loadError': 'Errore nel caricamento collezioni.',
  'collections.empty': 'Nessuna collezione trovata.',
  'collections.noSearchResults': 'Nessuna collezione corrisponde alla ricerca.',
  'collections.noDescription': 'Nessuna descrizione',
  'collections.deleteConfirm': 'Vuoi eliminare questa collezione?',
  'collections.deleteError': 'Errore durante eliminazione collezione.',
  'collections.saved': 'Collezione salvata correttamente.',
  'collections.updated': 'Collezione aggiornata correttamente.',
  'collections.loading': 'Caricamento collezioni...',
  'collections.saving': 'Salvataggio in corso...',
  'collections.connectionError': 'Errore di connessione collezioni.',
  'common.wait': 'Attendi qualche secondo.',
  'common.updateOrSearch': 'Puoi aggiornare o modificare la ricerca.',
  'common.edit': 'Modifica',
  'common.disable': 'Disattiva',
  'common.delete': 'Elimina',
  'common.remove': 'Rimuovi',
  'common.refresh': 'Aggiorna',
  'common.loading': 'Caricamento',
  'common.error': 'Errore',
  'common.connectionError': 'Errore di connessione.',
  'common.noResults': 'Nessun risultato',
  'common.operationCompleted': 'Operazione completata',
  'common.cancelEdit': 'Annulla modifica',
  'status.active': 'Attiva',
  'status.configurable': 'Configurabile',
  'status.basicConfiguration': 'Configurazione base',
  'status.requiresExternalConfiguration': 'Richiede configurazione esterna',
  'status.advancedToolsInProgress': 'Strumenti avanzati in corso',
  statusNativeApp: 'App nativa',
  'apps.open': 'Apri',
  'dataflow.import': 'Importa',
  'dataflow.export': 'Esporta',
  'dataflow.templates': 'Templates',
  'dataflow.translationPackage': 'Translation package',
  'dataflow.sitePackage': 'Site package',
  'dataflow.history': 'History',
  'dataflow.stockUpdate': 'Stock update',
  'dataflow.dryRun': 'Dry run',
  'dataflow.preview': 'Preview',
  'dataflow.created': 'Creati',
  'dataflow.updated': 'Aggiornati',
  'dataflow.skipped': 'Saltati',
  'dataflow.errors': 'Errori',
  'dataflow.backToAppHub': 'Torna ad App Hub',
  'dataflow.heroTitle': 'Operativita centralizzata per dati, contenuti e traduzioni.',
  'dataflow.heroDescription': 'Gestisci prodotti, collezioni, contenuti, menu e traduzioni in modo centralizzato. Nessun abbonamento mensile ad app esterne.',
  'seo.dashboardNote': 'Sitemap, robots, canonical e hreflang sono predisposti a livello contenuto/setting. Search Console API e audit AI restano advanced tools in progress.',
  'translations.noItems': 'Nessun elemento disponibile',
  'translations.selectItem': 'Seleziona un elemento da tradurre.',
  'translations.present': 'Traduzione presente',
  'translations.missing': 'Mancante',
})

Object.assign(ADMIN_TRANSLATIONS.en, {
  'dashboard.title': 'Welcome to the CMS',
  'dashboard.claim': 'Build, manage and scale custom websites from one operating system.',
  'dashboard.quickAction': 'Quick action',
  'dashboard.editSite.title': 'Edit site',
  'dashboard.editSite.description': 'Open the visual editor, sections and theme.',
  'dashboard.manageProducts.title': 'Manage products',
  'dashboard.manageProducts.description': 'Catalog, variants, images and stock.',
  'dashboard.uploadMedia.title': 'Upload media',
  'dashboard.uploadMedia.description': 'Visual library, uploads and URLs.',
  'dashboard.configureMarkets.title': 'Configure markets',
  'dashboard.configureMarkets.description': 'Languages, currencies and localized prices.',
  'dashboard.summary.products': 'Products',
  'dashboard.summary.productsDescription': 'Active catalog and variants.',
  'dashboard.summary.collections': 'Collections',
  'dashboard.summary.collectionsDescription': 'Catalog structure.',
  'dashboard.summary.orders': 'Orders',
  'dashboard.summary.ordersDescription': 'Commerce operational status.',
  'dashboard.summary.media': 'Media',
  'dashboard.summary.mediaDescription': 'Assets available in the CMS.',
  'editor.mainFeature': 'Main feature',
  'editor.visualEditor': 'Visual Editor',
  'editor.description': 'The CMS core: build, control and verify the site in real time across desktop, tablet and mobile.',
  'editor.previewFormat': 'Preview format',
  'editor.pageToEdit': 'Page to edit',
  'editor.sectionLibrary': 'CMS section library',
  'editor.sectionLibraryDescription': 'Choose a ready-made section and customize it on the selected page.',
  'editor.sectionLibraryLabel': 'Section library',
  'editor.themeSettings': 'Theme settings',
  'editor.themeSettingsDescription': 'Logo, colors, typography, header and footer.',
  'editor.closeThemeSettings': 'Close theme settings',
  'editor.loadingThemeSettings': 'Loading theme settings...',
  'editor.saveSettings': 'Save settings',
  'editor.saveSection': 'Save section',
  'editor.addSection': 'Add',
  'editor.pageSections': 'Page sections',
  'editor.selectSection': 'Select a section',
  'editor.selectSectionHelp': 'Select a section from the list.',
  'editor.pagesLoadError': 'Editor pages loading error.',
  'editor.sectionsLoadError': 'Section loading error.',
  'editor.sectionDeleteConfirm': 'Do you want to delete this section?',
  'editor.sectionDeleteError': 'Section delete failed.',
  'editor.sectionDeleted': 'Section deleted.',
  'editor.sectionSaving': 'Saving...',
  'editor.sectionSaved': 'Section saved.',
  'editor.sectionSaveError': 'Save failed.',
  'editor.sectionAdding': 'Adding section...',
  'editor.sectionAddError': 'Section add failed.',
  'editor.sectionAdded': 'Section added.',
  'editor.up': 'Up',
  'editor.down': 'Down',
  'editor.desktop': 'Desktop',
  'editor.tablet': 'Tablet',
  'editor.mobile': 'Mobile',
  'editor.liveCanvas': 'Live canvas',
  'editor.sitePreviewTitle': 'Site preview',
  'content.title': 'Content',
  'content.pages.title': 'Pages',
  'content.pages.description': 'Create and edit institutional pages, landing pages and custom content.',
  'content.menu.title': 'Menu',
  'content.menu.description': 'Create menus linked to pages, collections, products or external URLs.',
  'content.media.description': 'Manage prepared uploads, media URLs, previews, alt text and reusable assets.',
  'content.blog.description': 'Public articles, drafts, content and base SEO.',
  'content.metaobjects.description': 'Reusable content objects and read-only public API.',
  'content.policy.description': 'Privacy, terms, returns, shipping and cookie policies ready to publish.',
  'content.translations.description': 'Adapt products, pages, sections, blog and policies for international markets.',
  'content.seo.description': 'Central SEO dashboard for metadata, snippets, canonical URLs and intervention priorities.',
  'catalog.products.description': 'Manage product cards, images, prices and availability.',
  'catalog.collections.description': 'Group products into clickable collections and dedicated pages.',
  'catalog.variants.location': 'In product',
  'catalog.variants.title': 'Variants',
  'catalog.variants.description': 'Manage options, SKU, price and variant stock in the product form.',
  'catalog.inventory.active': 'Active feature',
  'catalog.inventory.title': 'Inventory',
  'catalog.inventory.description': 'Product and variant stock, filters, low-stock thresholds and quick updates.',
  'pages.title': 'Pages',
  'pages.description': 'Create, edit and organize site pages.',
  'pages.addTitle': 'Add page',
  'pages.editTitle': 'Edit page',
  'pages.updateTitle': 'Update page',
  'pages.titleLabel': 'Page title',
  'pages.save': 'Save page',
  'pages.update': 'Update page',
  'pages.archive': 'CMS pages',
  'pages.loading': 'Loading pages...',
  'pages.loadError': 'Page loading error.',
  'pages.empty': 'No pages found.',
  'pages.editSections': 'Edit sections',
  'pages.protectedHomepage': 'Protected homepage',
  'pages.deleteConfirm': 'Do you want to delete this page?',
  'pages.deleteError': 'Page delete failed.',
  'pages.connectionError': 'Page API connection error.',
  'pages.saveProgress': 'Saving...',
  'pages.saveError': 'Save failed.',
  'pages.saved': 'Page saved successfully.',
  'pages.updated': 'Page updated successfully.',
  'catalog.products.manage': 'Manage products',
  'products.add': 'Add product',
  'products.description': 'Manage products, variants, price, stock and SEO data for the client catalog.',
  'products.save': 'Save product',
  'products.edit': 'Edit product',
  'products.update': 'Update product',
  'products.archive': 'Product archive',
  'products.searchPlaceholder': 'Search products...',
  'products.loading': 'Loading products...',
  'products.loadError': 'Product loading error.',
  'products.empty': 'No products found.',
  'products.noSearchResults': 'No product matches the search.',
  'products.noDescription': 'No description',
  'products.noCategory': 'No category',
  'products.noCollection': 'No collection',
  'products.disableConfirm': 'Do you want to disable this product?',
  'products.disableError': 'Disable failed.',
  'products.connectionError': 'API connection error.',
  'products.stock': 'Stock',
  'products.variants': 'variants',
  'products.outOfStock': 'Out of stock',
  'products.lowStock': 'Low stock',
  'products.variant.empty': 'No variants configured.',
  'products.variant.optionName': 'Option name',
  'products.variant.optionValue': 'Value',
  'products.variant.optionNamePlaceholder': 'Color',
  'products.variant.optionValuePlaceholder': 'Red',
  'products.variant.price': 'Variant price',
  'products.variant.stock': 'Variant stock',
  'products.variant.optionalSku': 'Optional SKU',
  'products.variant.emptyValue': 'Leave empty',
  'collections.title': 'Collections',
  'collections.description': 'Create and edit catalog collections.',
  'collections.backToCatalog': 'Back to Catalog',
  'collections.add': 'Add collection',
  'collections.save': 'Save collection',
  'collections.edit': 'Edit collection',
  'collections.update': 'Update collection',
  'collections.name': 'Collection name',
  'collections.namePlaceholder': 'Premium collection',
  'collections.archive': 'Collection archive',
  'collections.searchPlaceholder': 'Search collections...',
  'collections.noCollection': 'No collection',
  'collections.loadError': 'Collection loading error.',
  'collections.empty': 'No collections found.',
  'collections.noSearchResults': 'No collection matches the search.',
  'collections.noDescription': 'No description',
  'collections.deleteConfirm': 'Do you want to delete this collection?',
  'collections.deleteError': 'Collection delete failed.',
  'collections.saved': 'Collection saved successfully.',
  'collections.updated': 'Collection updated successfully.',
  'collections.loading': 'Loading collections...',
  'collections.saving': 'Saving...',
  'collections.connectionError': 'Collections connection error.',
  'common.wait': 'Wait a few seconds.',
  'common.updateOrSearch': 'You can refresh or adjust the search.',
  'common.edit': 'Edit',
  'common.disable': 'Disable',
  'common.delete': 'Delete',
  'common.remove': 'Remove',
  'common.refresh': 'Refresh',
  'common.loading': 'Loading',
  'common.error': 'Error',
  'common.connectionError': 'Connection error.',
  'common.noResults': 'No results',
  'common.operationCompleted': 'Operation completed',
  'common.cancelEdit': 'Cancel edit',
  'status.active': 'Active',
  'status.configurable': 'Configurable',
  'status.basicConfiguration': 'Basic configuration',
  'status.requiresExternalConfiguration': 'Requires external configuration',
  'status.advancedToolsInProgress': 'Advanced tools in progress',
  statusNativeApp: 'Native app',
  'apps.open': 'Open',
  'dataflow.import': 'Import',
  'dataflow.export': 'Export',
  'dataflow.templates': 'Templates',
  'dataflow.translationPackage': 'Translation package',
  'dataflow.sitePackage': 'Site package',
  'dataflow.history': 'History',
  'dataflow.stockUpdate': 'Stock update',
  'dataflow.dryRun': 'Dry run',
  'dataflow.preview': 'Preview',
  'dataflow.created': 'Created',
  'dataflow.updated': 'Updated',
  'dataflow.skipped': 'Skipped',
  'dataflow.errors': 'Errors',
  'dataflow.backToAppHub': 'Back to App Hub',
  'dataflow.heroTitle': 'Centralized operations for data, content and translations.',
  'dataflow.heroDescription': 'Manage products, collections, content, menus and translations in one place. No monthly subscriptions to external apps.',
  'seo.dashboardNote': 'Sitemap, robots, canonical URLs and hreflang are prepared at content/settings level. Search Console API and AI audit remain advanced tools in progress.',
  'translations.noItems': 'No items available',
  'translations.selectItem': 'Select an item to translate.',
  'translations.present': 'Translation available',
  'translations.missing': 'Missing',
})

Object.assign(ADMIN_TRANSLATIONS.it, {
  'dashboard.welcome': 'Benvenuto nel CMS',
  'dashboard.editSite': 'Modifica il sito',
  'dashboard.editSiteDesc': 'Apri editor visuale, sezioni e tema.',
  'dashboard.manageProducts': 'Gestisci prodotti',
  'dashboard.manageProductsDesc': 'Catalogo, varianti, immagini e stock.',
  'dashboard.uploadMedia': 'Carica media',
  'dashboard.uploadMediaDesc': 'Libreria visuale, upload e URL.',
  'dashboard.configureMarkets': 'Configura markets',
  'dashboard.configureMarketsDesc': 'Lingue, valute e prezzi localizzati.',
  'dashboard.products': 'Prodotti',
  'dashboard.collections': 'Collezioni',
  'dashboard.orders': 'Ordini',
  'dashboard.media': 'Media',
  'catalog.title': 'Catalogo',
  'catalog.description': 'Gestisci prodotti, collezioni, stock, immagini e struttura commerciale.',
  'catalog.products': 'Prodotti',
  'catalog.productsDesc': 'Gestisci schede prodotto, immagini, prezzi e disponibilita.',
  'catalog.collections': 'Collezioni',
  'catalog.collectionsDesc': 'Raggruppa prodotti in collezioni cliccabili e pagine dedicate.',
  'catalog.variants': 'Varianti',
  'catalog.variantsDesc': 'Gestisci opzioni, SKU, prezzo e stock variante nel form prodotto.',
  'catalog.inventory': 'Inventario',
  'catalog.inventoryDesc': 'Scorte prodotto e variante, filtri, soglie low stock e aggiornamento rapido.',
  'content.pages': 'Pagine',
  'content.pagesDesc': 'Crea e modifica pagine istituzionali, landing e contenuti custom.',
  'content.menu': 'Menu',
  'content.menuDesc': 'Crea menu collegati a pagine, collezioni, prodotti o URL esterni.',
  'content.media': 'Media',
  'content.mediaDesc': 'Gestisci upload predisposto, URL media, anteprime, alt text e asset riutilizzabili.',
  'content.blog': 'Blog',
  'content.blogDesc': 'Articoli pubblici, bozze, contenuti e SEO base.',
  'content.metaobjects': 'Metaobjects',
  'content.metaobjectsDesc': 'Oggetti contenuto riutilizzabili e API pubblica read-only.',
  'content.policy': 'Policy',
  'content.policyDesc': 'Privacy, termini, resi, spedizioni e cookie policy pubblicabili.',
  'content.translations': 'Traduzioni',
  'content.translationsDesc': 'Adatta prodotti, pagine, sezioni, blog e policy per mercati internazionali.',
  'editor.title': 'Editor visuale sito',
  'editor.sectionLibraryDesc': 'Scegli una sezione gia pronta e personalizzala nella pagina selezionata.',
  'editor.desktopPreview': 'Anteprima desktop',
  'editor.add': 'Aggiungi',
  'editor.remove': 'Rimuovi',
  'orders.title': 'Ordini',
  'orders.description': 'Monitora ordini, stato pagamento, spedizione e avanzamento operativo.',
  'orders.order': 'Ordine',
  'orders.orderLines': 'Righe ordine',
  'orders.payment': 'Pagamento',
  'orders.method': 'Metodo',
  'orders.provider': 'Provider',
  'orders.currency': 'Valuta',
  'orders.shipping': 'Spedizione',
  'orders.fulfillment': 'Fulfillment',
  'orders.refund': 'Rimborso',
  'orders.discount': 'Sconto',
  'orders.taxes': 'Tasse',
  'orders.orderStatus': 'Stato ordine',
  'orders.paymentStatus': 'Stato pagamento',
  'orders.pendingOrders': 'Ordini in attesa',
  'orders.unfulfilled': 'Da spedire',
  'orders.refundQueue': 'Coda rimborsi',
  'orders.returnQueue': 'Coda resi',
  'orders.confirm': 'Conferma ordine',
  'orders.markPaid': 'Marca pagato',
  'orders.addTracking': 'Aggiungi tracking',
  'orders.markFulfilled': 'Marca come spedito',
  'orders.saveNote': 'Salva nota',
  'orders.cancel': 'Cancella ordine',
  'orders.cancelConfirm': 'Confermi cancellazione ordine?',
  'orders.loading': 'Caricamento ordini...',
  'orders.loadError': 'Errore caricamento ordini.',
  'orders.empty': 'Nessun ordine trovato.',
  'orders.noSearchResults': 'Nessun ordine corrisponde alla ricerca.',
  'orders.updateError': 'Errore aggiornamento ordine.',
  'orders.operationError': 'Operazione ordine non riuscita.',
  'customers.customer': 'Cliente',
  'common.open': 'Apri',
  'common.close': 'Chiudi',
  'common.save': 'Salva',
  'common.create': 'Crea',
  'common.search': 'Cerca',
  'common.filter': 'Filtra',
  'common.success': 'Operazione completata',
  'common.status': 'Stato',
  'common.price': 'Prezzo',
  'common.stock': 'Stock',
  'common.active': 'Attivo',
  'common.inactive': 'Inattivo',
  'common.draft': 'Bozza',
  'common.available': 'Disponibile',
  'common.unavailable': 'Non disponibile',
  'common.basicConfiguration': 'Configurazione base',
  'common.requiresExternalConfiguration': 'Richiede configurazione esterna',
  'common.advancedToolsInProgress': 'Strumenti avanzati in corso',
  'common.availableInThisRelease': 'Disponibile in questa release',
  'common.nativeApp': 'App nativa',
  'common.readOnly': 'Sola lettura',
  'common.auditDisabled': 'Audit mode: modifiche disabilitate.',
  'analytics.loading': 'Caricamento analytics...',
  'analytics.empty': 'Nessun dato analytics ancora disponibile.',
  'analytics.overview': 'Overview eventi',
  'analytics.overviewDesc': 'Eventi raccolti senza dati personali sensibili.',
  'analytics.noEvents': 'Nessun evento',
  'analytics.ordersCreated': 'Ordini creati',
  'analytics.averageOrder': 'Valore medio',
  'analytics.noPageViews': 'Nessuna page view ancora registrata.',
  'analytics.noProductEvents': 'Nessun evento prodotto ancora registrato.',
  'analytics.noRecentEvents': 'Nessun evento recente.',
  'apps.openCta': 'Apri',
  'apps.module': 'Modulo',
  'apps.ready': 'Pronto',
  'apps.notConfigured': 'Non configurato',
  'apps.providerRequired': 'Provider richiesto per invio reale',
  'settings.permissionDenied': 'Permessi insufficienti.',
  'settings.permissionReadDenied': 'Permessi insufficienti per leggere impostazioni sensibili.',
  'marketing.campaigns': 'Campagne',
  'marketing.campaignsDesc': 'Crea e modifica campagne con date, stato e coupon opzionale.',
  'marketing.discounts': 'Sconti',
  'marketing.discountsDesc': 'Gestisci codici sconto percentuali o a importo fisso.',
  'dataflow.prices': 'Prezzi',
})

Object.assign(ADMIN_TRANSLATIONS.en, {
  'dashboard.welcome': 'Welcome to the CMS',
  'dashboard.editSite': 'Edit site',
  'dashboard.editSiteDesc': 'Open the visual editor, sections and theme.',
  'dashboard.manageProducts': 'Manage products',
  'dashboard.manageProductsDesc': 'Catalog, variants, images and stock.',
  'dashboard.uploadMedia': 'Upload media',
  'dashboard.uploadMediaDesc': 'Visual library, uploads and URLs.',
  'dashboard.configureMarkets': 'Configure markets',
  'dashboard.configureMarketsDesc': 'Languages, currencies and localized prices.',
  'dashboard.products': 'Products',
  'dashboard.collections': 'Collections',
  'dashboard.orders': 'Orders',
  'dashboard.media': 'Media',
  'catalog.title': 'Catalog',
  'catalog.description': 'Manage products, collections, stock, images and commercial structure.',
  'catalog.products': 'Products',
  'catalog.productsDesc': 'Manage product records, images, prices and availability.',
  'catalog.collections': 'Collections',
  'catalog.collectionsDesc': 'Group products into clickable collections and dedicated pages.',
  'catalog.variants': 'Variants',
  'catalog.variantsDesc': 'Manage options, SKUs, price and variant stock in the product form.',
  'catalog.inventory': 'Inventory',
  'catalog.inventoryDesc': 'Product and variant stock, filters, low-stock thresholds and quick updates.',
  'content.pages': 'Pages',
  'content.pagesDesc': 'Create and edit institutional pages, landing pages and custom content.',
  'content.menu': 'Menus',
  'content.menuDesc': 'Create menus linked to pages, collections, products or external URLs.',
  'content.media': 'Media',
  'content.mediaDesc': 'Manage uploads, media URLs, previews, alt text and reusable assets.',
  'content.blog': 'Blog',
  'content.blogDesc': 'Public articles, drafts, content and basic SEO.',
  'content.metaobjects': 'Metaobjects',
  'content.metaobjectsDesc': 'Reusable content objects and read-only public API.',
  'content.policy': 'Policies',
  'content.policyDesc': 'Privacy, terms, returns, shipping and cookie policies ready to publish.',
  'content.translations': 'Translations',
  'content.translationsDesc': 'Adapt products, pages, sections, blog and policies for international markets.',
  'editor.title': 'Visual site editor',
  'editor.sectionLibraryDesc': 'Choose a ready-made section and customize it on the selected page.',
  'editor.desktopPreview': 'Desktop preview',
  'editor.add': 'Add',
  'editor.remove': 'Remove',
  'orders.title': 'Orders',
  'orders.description': 'Monitor orders, payment status, shipping and operational progress.',
  'orders.order': 'Order',
  'orders.orderLines': 'Order lines',
  'orders.payment': 'Payment',
  'orders.method': 'Method',
  'orders.provider': 'Provider',
  'orders.currency': 'Currency',
  'orders.shipping': 'Shipping',
  'orders.fulfillment': 'Fulfillment',
  'orders.refund': 'Refund',
  'orders.discount': 'Discount',
  'orders.taxes': 'Taxes',
  'orders.orderStatus': 'Order status',
  'orders.paymentStatus': 'Payment status',
  'orders.pendingOrders': 'Pending orders',
  'orders.unfulfilled': 'Unfulfilled',
  'orders.refundQueue': 'Refund queue',
  'orders.returnQueue': 'Return queue',
  'orders.confirm': 'Confirm order',
  'orders.markPaid': 'Mark as paid',
  'orders.addTracking': 'Add tracking',
  'orders.markFulfilled': 'Mark as fulfilled',
  'orders.saveNote': 'Save note',
  'orders.cancel': 'Cancel order',
  'orders.cancelConfirm': 'Confirm order cancellation?',
  'orders.loading': 'Loading orders...',
  'orders.loadError': 'Order loading error.',
  'orders.empty': 'No orders found.',
  'orders.noSearchResults': 'No order matches the search.',
  'orders.updateError': 'Order update error.',
  'orders.operationError': 'Order operation failed.',
  'customers.customer': 'Customer',
  'common.open': 'Open',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.create': 'Create',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.success': 'Operation completed',
  'common.status': 'Status',
  'common.price': 'Price',
  'common.stock': 'Stock',
  'common.active': 'Active',
  'common.inactive': 'Inactive',
  'common.draft': 'Draft',
  'common.available': 'Available',
  'common.unavailable': 'Unavailable',
  'common.basicConfiguration': 'Basic configuration',
  'common.requiresExternalConfiguration': 'Requires external configuration',
  'common.advancedToolsInProgress': 'Advanced tools in progress',
  'common.availableInThisRelease': 'Available in this release',
  'common.nativeApp': 'Native app',
  'common.readOnly': 'Read only',
  'common.auditDisabled': 'Audit mode: changes are disabled.',
  'analytics.loading': 'Loading analytics...',
  'analytics.empty': 'No analytics data available yet.',
  'analytics.overview': 'Event overview',
  'analytics.overviewDesc': 'Events collected without sensitive personal data.',
  'analytics.noEvents': 'No events',
  'analytics.ordersCreated': 'Orders created',
  'analytics.averageOrder': 'Average order value',
  'analytics.noPageViews': 'No page views recorded yet.',
  'analytics.noProductEvents': 'No product events recorded yet.',
  'analytics.noRecentEvents': 'No recent events.',
  'apps.openCta': 'Open',
  'apps.module': 'Module',
  'apps.ready': 'Ready',
  'apps.notConfigured': 'Not configured',
  'apps.providerRequired': 'Provider required for real sending',
  'settings.permissionDenied': 'Insufficient permissions.',
  'settings.permissionReadDenied': 'Insufficient permissions to read sensitive settings.',
  'marketing.campaigns': 'Campaigns',
  'marketing.campaignsDesc': 'Create and edit campaigns with dates, status and optional coupon.',
  'marketing.discounts': 'Discounts',
  'marketing.discountsDesc': 'Manage percentage or fixed-amount discount codes.',
  'dataflow.prices': 'Prices',
})

Object.assign(ADMIN_TRANSLATIONS.it, {
  'products.variant.add': 'Aggiungi variante',
  'reviews.add': 'Aggiungi review',
  'reviews.edit': 'Modifica review',
  'reviews.save': 'Salva review',
  'reviews.update': 'Aggiorna review',
  'policies.add': 'Aggiungi policy',
  'policies.edit': 'Modifica policy',
  'policies.save': 'Salva policy',
  'policies.update': 'Aggiorna policy',
  'blog.add': 'Aggiungi articolo',
  'blog.edit': 'Modifica articolo',
  'blog.save': 'Salva articolo',
  'blog.update': 'Aggiorna articolo',
  'media.add': 'Aggiungi media',
  'media.edit': 'Modifica media',
  'media.save': 'Salva media',
  'media.update': 'Aggiorna media',
  'menu.addItem': 'Aggiungi voce menu',
  'menu.saveItem': 'Salva voce menu',
  'discounts.add': 'Aggiungi sconto',
  'discounts.edit': 'Modifica sconto',
  'discounts.save': 'Salva sconto',
  'discounts.update': 'Aggiorna sconto',
  'campaigns.add': 'Aggiungi campagna',
  'campaigns.edit': 'Modifica campagna',
  'campaigns.save': 'Salva campagna',
  'campaigns.update': 'Aggiorna campagna',
  'markets.add': 'Aggiungi mercato',
  'markets.edit': 'Modifica mercato',
  'markets.addFromPreset': 'Aggiungi mercato da preset',
  'markets.save': 'Salva mercato',
  'markets.update': 'Aggiorna mercato',
  'shipping.add': 'Aggiungi metodo',
  'shipping.edit': 'Modifica metodo',
  'shipping.save': 'Salva spedizione',
  'shipping.update': 'Aggiorna spedizione',
  'integrations.add': 'Aggiungi integrazione',
  'integrations.edit': 'Modifica integrazione',
  'integrations.save': 'Salva integrazione',
  'integrations.update': 'Aggiorna integrazione',
  'users.add': 'Aggiungi utente',
  'users.edit': 'Modifica utente',
  'users.save': 'Salva utente',
  'users.update': 'Aggiorna utente',
  'notifications.add': 'Aggiungi template',
  'notifications.edit': 'Modifica template',
  'notifications.save': 'Salva template',
  'notifications.update': 'Aggiorna template',
  'domains.add': 'Aggiungi dominio',
  'domains.edit': 'Modifica dominio',
  'domains.save': 'Salva dominio',
  'domains.update': 'Aggiorna dominio',
  'tenants.add': 'Aggiungi tenant',
  'tenants.edit': 'Modifica tenant',
  'tenants.save': 'Salva tenant',
  'tenants.update': 'Aggiorna tenant',
})

Object.assign(ADMIN_TRANSLATIONS.en, {
  'products.variant.add': 'Add variant',
  'reviews.add': 'Add review',
  'reviews.edit': 'Edit review',
  'reviews.save': 'Save review',
  'reviews.update': 'Update review',
  'policies.add': 'Add policy',
  'policies.edit': 'Edit policy',
  'policies.save': 'Save policy',
  'policies.update': 'Update policy',
  'blog.add': 'Add article',
  'blog.edit': 'Edit article',
  'blog.save': 'Save article',
  'blog.update': 'Update article',
  'media.add': 'Add media',
  'media.edit': 'Edit media',
  'media.save': 'Save media',
  'media.update': 'Update media',
  'menu.addItem': 'Add menu item',
  'menu.saveItem': 'Save menu item',
  'discounts.add': 'Add discount',
  'discounts.edit': 'Edit discount',
  'discounts.save': 'Save discount',
  'discounts.update': 'Update discount',
  'campaigns.add': 'Add campaign',
  'campaigns.edit': 'Edit campaign',
  'campaigns.save': 'Save campaign',
  'campaigns.update': 'Update campaign',
  'markets.add': 'Add market',
  'markets.edit': 'Edit market',
  'markets.addFromPreset': 'Add market from preset',
  'markets.save': 'Save market',
  'markets.update': 'Update market',
  'shipping.add': 'Add method',
  'shipping.edit': 'Edit method',
  'shipping.save': 'Save shipping',
  'shipping.update': 'Update shipping',
  'integrations.add': 'Add integration',
  'integrations.edit': 'Edit integration',
  'integrations.save': 'Save integration',
  'integrations.update': 'Update integration',
  'users.add': 'Add user',
  'users.edit': 'Edit user',
  'users.save': 'Save user',
  'users.update': 'Update user',
  'notifications.add': 'Add template',
  'notifications.edit': 'Edit template',
  'notifications.save': 'Save template',
  'notifications.update': 'Update template',
  'domains.add': 'Add domain',
  'domains.edit': 'Edit domain',
  'domains.save': 'Save domain',
  'domains.update': 'Update domain',
  'tenants.add': 'Add tenant',
  'tenants.edit': 'Edit tenant',
  'tenants.save': 'Save tenant',
  'tenants.update': 'Update tenant',
})

Object.assign(ADMIN_TRANSLATIONS.it, {
  'nav.mainAreas': 'Aree principali',
  'sidebar.systemName': 'Website Operating System',
  'sidebar.systemDesc': 'Next Generation Website CMS',
  navWebsite: 'Sito',
  navWebsiteDesc: 'Editor, pagine, menu e media',
  navCatalogDesc: 'Prodotti, collezioni e stock',
  navCommerce: 'Commercio',
  navCommerceDesc: 'Ordini, clienti e checkout',
  navGrowth: 'Crescita',
  navGrowthDesc: 'Marketing, SEO e analytics',
  navTakeOffTools: 'TakeOff Tools',
  navTakeOffToolsDesc: 'Import massivi, backup e controlli',
  navApps: 'App',
  navAppsDesc: 'Moduli nativi opzionali',
  navSettingsDesc: 'Store, accessi e sistema',
  settingsTitle: 'Impostazioni',
  'breadcrumb.admin': 'Admin',
  'common.back': 'Torna',
  appsTitle: 'App',
  appsDesc: 'Moduli nativi inclusi nel CMS TakeOff. Nessun marketplace esterno. Nessun abbonamento mensile.',
  'apps.heroTitle': 'Moduli avanzati, attivabili quando servono.',
  'apps.heroDesc': 'Funzioni native per estendere il CMS senza installare app esterne.',
  'apps.reviewsDesc': 'Recensioni prodotto e moderazione.',
  'apps.emailDesc': 'Template email, provider status e log.',
  'apps.upsellDesc': 'Regole native per bundle e cross-sell.',
  'apps.abandonedCartDesc': 'Recovery carrello con email provider-ready.',
  'apps.customerAccountsDesc': 'Account cliente e inviti controllati.',
  'apps.webhooksDesc': 'Eventi developer per integrazioni custom.',
  'apps.gdprDesc': 'Consensi, cookie e privacy tools.',
  'apps.subscriptionsDesc': 'Abbonamenti e ricorrenze provider-ready.',
  'dashboard.controlPanelTitle': 'TakeOff Control Panel',
  'dashboard.controlPanelClaim': 'Gestisci sito, catalogo e operazioni da un pannello pulito.',
  'dashboard.editWebsite': 'Modifica sito',
  'dashboard.editWebsiteDesc': 'Apri editor visuale e sezioni.',
  'dashboard.addProduct': 'Aggiungi prodotto',
  'dashboard.addProductDesc': 'Crea o aggiorna schede catalogo.',
  'dashboard.importData': 'Importa dati',
  'dashboard.importDataDesc': 'Bulk update senza app esterne.',
  'dashboard.viewOrders': 'Vedi ordini',
  'dashboard.viewOrdersDesc': 'Controlla pagamento e fulfillment.',
  'dashboard.summary.siteHealth': 'Stato sito',
  'dashboard.summary.siteHealthDescription': 'Controlli in TakeOff Tools.',
  'dashboard.summary.setup': 'Setup',
  'dashboard.summary.setupDescription': 'Step prioritari prima del go-live.',
  'dashboard.launchChecklistMini': 'Launch checklist',
  'dashboard.checklist.products': 'Aggiungi prodotti',
  'dashboard.checklist.checkout': 'Configura checkout',
  'dashboard.checklist.domain': 'Collega dominio',
  'dashboard.checklist.seo': 'Rivedi SEO',
  'dashboard.recentActivity': 'Ultimi eventi',
  'dashboard.recentActivityDesc': 'Activity log, warning e audit restano nelle rispettive sezioni di dettaglio.',
  'website.title': 'Sito',
  'website.description': 'Gestisci esperienza, pagine, menu, tema e asset del sito.',
  'website.visualEditor': 'Editor visuale',
  'website.visualEditorDesc': 'Sezioni, preview e contenuti di pagina.',
  'website.pages': 'Pagine',
  'website.pagesDesc': 'Pagine istituzionali, landing e SEO base.',
  'website.menus': 'Menu',
  'website.menusDesc': 'Header, footer e navigazione pubblica.',
  'website.themeSettings': 'Impostazioni tema',
  'website.themeSettingsDesc': 'Logo, colori, font e layout globali.',
  'website.headerFooter': 'Header / Footer',
  'website.headerFooterDesc': 'Menu e link globali del sito.',
  'website.mediaLibrary': 'Libreria media',
  'website.mediaLibraryDesc': 'Asset, URL, anteprime e alt text.',
  'catalog.productMetafields': 'Metafields prodotto',
  'catalog.productMetafieldsDesc': 'Campi custom per schede prodotto.',
  'commerce.title': 'Commercio',
  'commerce.description': 'Gestisci ordini, clienti, checkout, pagamenti e operativita commerciale.',
  'commerce.ordersDesc': 'Stati, pagamenti, spedizione e timeline.',
  'commerce.customersDesc': 'Profili, storico ordini e account status.',
  'commerce.checkoutDesc': 'Impostazioni, conferma e flusso operativo.',
  'commerce.payments': 'Pagamenti',
  'commerce.paymentsDesc': 'Manuale o provider test via ambiente.',
  'commerce.shipping': 'Spedizioni',
  'commerce.shippingDesc': 'Metodi, soglie e stato attivo.',
  'commerce.taxes': 'Tasse',
  'commerce.taxesDesc': 'IVA base e prezzi inclusi/esclusi.',
  'commerce.giftCardsDesc': 'Crediti cliente e codici regalo nativi.',
  'commerce.returnsDesc': 'Resi e rimborsi con workflow controllato.',
  'commerce.backToCommerce': 'Torna a Commercio',
  'growth.title': 'Crescita',
  'growth.description': 'Marketing, SEO, analytics e strumenti di crescita in un hub unico.',
  'growth.campaignsDesc': 'Promozioni, finestre temporali e coupon.',
  'growth.discountsDesc': 'Codici percentuali o importo fisso.',
  'growth.seoDesc': 'Audit, snippet e metadati.',
  'growth.analyticsDesc': 'Traffico, vendite e conversioni.',
  'growth.googleSuiteDesc': 'GA4, Ads, GTM e Search Console.',
  'growth.searchFiltersDesc': 'Ricerca e filtri catalogo.',
  'growth.productFeedDesc': 'Feed Google Merchant e Meta Catalog.',
  'growth.backToGrowth': 'Torna a Crescita',
  'tools.title': 'TakeOff Tools',
  'tools.description': 'Strumenti operativi inclusi per ridurre costi e app esterne.',
  'tools.importExportDesc': 'Importa, esporta e aggiorna prodotti, collezioni, menu, traduzioni e stock in bulk senza app esterne a pagamento.',
  'tools.openTool': 'Apri tool',
  'tools.backupDesc': 'Export JSON sicuro prima di import massivi.',
  'tools.translationPackageDesc': 'Pacchetti traduzione per workflow agenzia.',
  'tools.supplierFeedsDesc': 'Feed fornitori e dry-run controllati.',
  'tools.storeHealthDesc': 'Controlli operativi su store e provider.',
  'tools.launchChecklistDesc': 'Checklist go-live per test e produzione.',
  'tools.dataflowHistoryDesc': 'Storico job, report e preview import.',
  'tools.backToTools': 'Torna a TakeOff Tools',
  'tools.openDataFlow': 'Apri DataFlow',
  'settings.description': 'Configurazioni store, accessi, domini, privacy e sistema.',
  'settings.general': 'Generali',
  'settings.generalDesc': 'Store, azienda, email e dati sito.',
  'settings.usersPermissions': 'Utenti e permessi',
  'settings.usersPermissionsDesc': 'Utenti admin, ruoli e accessi.',
  'settings.domains': 'Domini',
  'settings.domainsDesc': 'Dominio primario, preview e DNS.',
  'settings.privacy': 'Privacy',
  'settings.privacyDesc': 'Consensi, GDPR e policy pubbliche.',
  'settings.cookieSettings': 'Impostazioni cookie',
  'settings.cookieSettingsDesc': 'Categorie consenso e Google Consent.',
  'settings.metafields': 'Metafields',
  'settings.metafieldsDesc': 'Dati custom per risorse CMS.',
  'settings.notifications': 'Notifiche',
  'settings.notificationsDesc': 'Template, log e invii mock.',
  'settings.integrations': 'Integrazioni',
  'settings.integrationsDesc': 'Provider e configurazioni non sensibili.',
  'settings.multiClient': 'Multi-client / Store',
  'settings.multiClientDesc': 'Tenant default e predisposizione store.',
  'settings.activityLog': 'Activity log',
  'settings.activityLogDesc': 'Azioni admin e modifiche recenti.',
  'settings.performance': 'Performance',
  'settings.performanceDesc': 'Cache, fallback e produzione.',
  'markets.description': 'Gestisci mercati, paesi, lingue, valute e prezzi localizzati.',
  'markets.markets': 'Mercati',
  'markets.marketsDesc': 'Default, paese, lingua, valuta e stato.',
  'markets.countries': 'Paesi',
  'markets.countriesDesc': 'Paesi abilitati per mercato.',
  'markets.languages': 'Lingue',
  'markets.languagesDesc': 'Lingue storefront e fallback contenuti.',
  'markets.currencies': 'Valute',
  'markets.currenciesDesc': 'Valute e fallback monetario.',
  'markets.localizedPrices': 'Prezzi localizzati',
  'markets.localizedPricesDesc': 'Listini per mercato e valuta.',
  'status.ready': 'Pronto',
  'status.needsSetup': 'Richiede setup',
  'status.providerReady': 'Provider-ready',
  'status.advanced': 'Avanzato',
  'status.comingSoon': 'In arrivo',
  'status.locked': 'Bloccato',
  'status.inProgress': 'In corso',
  'status.included': 'Incluso',
  'status.nativeApp': 'App nativa',
  'common.configure': 'Configura',
  'common.review': 'Rivedi',
})

Object.assign(ADMIN_TRANSLATIONS.en, {
  'nav.mainAreas': 'Main areas',
  'sidebar.systemName': 'Website Operating System',
  'sidebar.systemDesc': 'Next Generation Website CMS',
  navWebsite: 'Website',
  navWebsiteDesc: 'Editor, pages, menus and media',
  navCatalogDesc: 'Products, collections and stock',
  navCommerce: 'Commerce',
  navCommerceDesc: 'Orders, customers and checkout',
  navGrowth: 'Growth',
  navGrowthDesc: 'Marketing, SEO and analytics',
  navTakeOffTools: 'TakeOff Tools',
  navTakeOffToolsDesc: 'Bulk, backup and health',
  navAppsDesc: 'Optional native modules',
  navSettingsDesc: 'Store, access and system',
  'breadcrumb.admin': 'Admin',
  'common.back': 'Back',
  appsTitle: 'Apps',
  appsDesc: 'Native modules included in your TakeOff CMS. No external marketplace. No monthly app fees.',
  'apps.heroTitle': 'Advanced modules, enabled when needed.',
  'apps.heroDesc': 'Native features that extend the CMS without installing external apps.',
  'apps.reviewsDesc': 'Product reviews and moderation.',
  'apps.emailDesc': 'Email templates, provider status and logs.',
  'apps.upsellDesc': 'Native rules for bundles and cross-sell.',
  'apps.abandonedCartDesc': 'Cart recovery with provider-ready email.',
  'apps.customerAccountsDesc': 'Customer accounts and controlled invites.',
  'apps.webhooksDesc': 'Developer events for custom integrations.',
  'apps.gdprDesc': 'Consent, cookies and privacy tools.',
  'apps.subscriptionsDesc': 'Subscriptions and recurring billing provider-ready.',
  'dashboard.controlPanelTitle': 'TakeOff Control Panel',
  'dashboard.controlPanelClaim': 'Manage site, catalog and operations from a clean control panel.',
  'dashboard.editWebsite': 'Edit website',
  'dashboard.editWebsiteDesc': 'Open the visual editor and sections.',
  'dashboard.addProduct': 'Add product',
  'dashboard.addProductDesc': 'Create or update catalog records.',
  'dashboard.importData': 'Import data',
  'dashboard.importDataDesc': 'Bulk updates without external apps.',
  'dashboard.viewOrders': 'View orders',
  'dashboard.viewOrdersDesc': 'Check payment and fulfillment.',
  'dashboard.summary.siteHealth': 'Site health',
  'dashboard.summary.siteHealthDescription': 'Checks live in TakeOff Tools.',
  'dashboard.summary.setup': 'Setup',
  'dashboard.summary.setupDescription': 'Priority steps before go-live.',
  'dashboard.launchChecklistMini': 'Launch checklist',
  'dashboard.checklist.products': 'Add products',
  'dashboard.checklist.checkout': 'Configure checkout',
  'dashboard.checklist.domain': 'Connect domain',
  'dashboard.checklist.seo': 'Review SEO',
  'dashboard.recentActivity': 'Recent activity',
  'dashboard.recentActivityDesc': 'Activity log, warnings and audit stay in their detail sections.',
  'website.title': 'Website',
  'website.description': 'Manage site experience, pages, menus, theme and assets.',
  'website.visualEditor': 'Visual editor',
  'website.visualEditorDesc': 'Sections, preview and page content.',
  'website.pages': 'Pages',
  'website.pagesDesc': 'Institutional pages, landing pages and basic SEO.',
  'website.menus': 'Menus',
  'website.menusDesc': 'Header, footer and public navigation.',
  'website.themeSettings': 'Theme settings',
  'website.themeSettingsDesc': 'Logo, colors, fonts and global layout.',
  'website.headerFooter': 'Header / Footer',
  'website.headerFooterDesc': 'Global site menus and links.',
  'website.mediaLibrary': 'Media Library',
  'website.mediaLibraryDesc': 'Assets, URLs, previews and alt text.',
  'catalog.productMetafields': 'Product metafields',
  'catalog.productMetafieldsDesc': 'Custom fields for product records.',
  'commerce.title': 'Commerce',
  'commerce.description': 'Manage orders, customers, checkout, payments and commerce operations.',
  'commerce.ordersDesc': 'Statuses, payments, shipping and timeline.',
  'commerce.customersDesc': 'Profiles, order history and account status.',
  'commerce.checkoutDesc': 'Settings, confirmation and operational flow.',
  'commerce.payments': 'Payments',
  'commerce.paymentsDesc': 'Manual or test provider via environment.',
  'commerce.shipping': 'Shipping',
  'commerce.shippingDesc': 'Methods, thresholds and active status.',
  'commerce.taxes': 'Taxes',
  'commerce.taxesDesc': 'Base VAT and included/excluded prices.',
  'commerce.giftCardsDesc': 'Native customer credits and gift codes.',
  'commerce.returnsDesc': 'Returns and refunds with a controlled workflow.',
  'commerce.backToCommerce': 'Back to Commerce',
  'growth.title': 'Growth',
  'growth.description': 'Marketing, SEO, analytics and growth tools in one hub.',
  'growth.campaignsDesc': 'Promotions, date windows and coupons.',
  'growth.discountsDesc': 'Percentage or fixed-amount codes.',
  'growth.seoDesc': 'Audits, snippets and metadata.',
  'growth.analyticsDesc': 'Traffic, sales and conversions.',
  'growth.googleSuiteDesc': 'GA4, Ads, GTM and Search Console.',
  'growth.searchFiltersDesc': 'Catalog search and filters.',
  'growth.productFeedDesc': 'Google Merchant and Meta Catalog feeds.',
  'growth.backToGrowth': 'Back to Growth',
  'tools.title': 'TakeOff Tools',
  'tools.description': 'Included operational tools that reduce external app costs.',
  'tools.importExportDesc': 'Import, export and update products, collections, menus, translations and stock in bulk without paid external apps.',
  'tools.openTool': 'Open tool',
  'tools.backupDesc': 'Safe JSON export before bulk imports.',
  'tools.translationPackageDesc': 'Translation packages for agency workflows.',
  'tools.supplierFeedsDesc': 'Supplier feeds and controlled dry-runs.',
  'tools.storeHealthDesc': 'Operational checks across store and providers.',
  'tools.launchChecklistDesc': 'Go-live checklist for testing and production.',
  'tools.dataflowHistoryDesc': 'Job history, reports and import previews.',
  'tools.backToTools': 'Back to TakeOff Tools',
  'tools.openDataFlow': 'Open DataFlow',
  'settings.description': 'Store, access, domains, privacy and system settings.',
  'settings.general': 'General',
  'settings.generalDesc': 'Store, company, email and site data.',
  'settings.usersPermissions': 'Users & permissions',
  'settings.usersPermissionsDesc': 'Admin users, roles and access.',
  'settings.domains': 'Domains',
  'settings.domainsDesc': 'Primary domain, preview and DNS.',
  'settings.privacy': 'Privacy',
  'settings.privacyDesc': 'Consent, GDPR and public policies.',
  'settings.cookieSettings': 'Cookie settings',
  'settings.cookieSettingsDesc': 'Consent categories and Google Consent.',
  'settings.metafields': 'Metafields',
  'settings.metafieldsDesc': 'Custom data for CMS resources.',
  'settings.notifications': 'Notifications',
  'settings.notificationsDesc': 'Templates, logs and mock sends.',
  'settings.integrations': 'Integrations',
  'settings.integrationsDesc': 'Providers and non-sensitive settings.',
  'settings.multiClient': 'Multi-client / Store',
  'settings.multiClientDesc': 'Default tenant and store readiness.',
  'settings.activityLog': 'Activity log',
  'settings.activityLogDesc': 'Admin actions and recent changes.',
  'settings.performance': 'Performance',
  'settings.performanceDesc': 'Cache, fallback and production.',
  'markets.description': 'Manage markets, countries, languages, currencies and localized prices.',
  'markets.markets': 'Markets',
  'markets.marketsDesc': 'Default, country, language, currency and status.',
  'markets.countries': 'Countries',
  'markets.countriesDesc': 'Countries enabled by market.',
  'markets.languages': 'Languages',
  'markets.languagesDesc': 'Storefront languages and content fallback.',
  'markets.currencies': 'Currencies',
  'markets.currenciesDesc': 'Currencies and monetary fallback.',
  'markets.localizedPrices': 'Localized prices',
  'markets.localizedPricesDesc': 'Price lists by market and currency.',
  'status.ready': 'Ready',
  'status.needsSetup': 'Needs setup',
  'status.providerReady': 'Provider-ready',
  'status.advanced': 'Advanced',
  'status.comingSoon': 'Coming soon',
  'status.locked': 'Locked',
  'status.inProgress': 'In progress',
  'status.included': 'Included',
  'status.nativeApp': 'Native app',
  'common.configure': 'Configure',
  'common.review': 'Review',
})

function getAdminLanguage() {
  try {
    const saved = localStorage.getItem(ADMIN_LANGUAGE_STORAGE_KEY)
    return ADMIN_TRANSLATIONS[saved] ? saved : ADMIN_DEFAULT_LANGUAGE
  } catch {
    return ADMIN_DEFAULT_LANGUAGE
  }
}

function setAdminLanguage(language) {
  const nextLanguage = ADMIN_TRANSLATIONS[language] ? language : ADMIN_DEFAULT_LANGUAGE
  try {
    localStorage.setItem(ADMIN_LANGUAGE_STORAGE_KEY, nextLanguage)
  } catch {}
  document.documentElement.lang = nextLanguage
  rerenderActiveAdminView()
  applyAdminLanguage()
}

function getAdminTheme() {
  try {
    const saved = localStorage.getItem(ADMIN_THEME_STORAGE_KEY)
    return ['dark', 'light'].includes(saved) ? saved : ADMIN_DEFAULT_THEME
  } catch {
    return ADMIN_DEFAULT_THEME
  }
}

function applyAdminTheme(theme = getAdminTheme()) {
  const nextTheme = ['dark', 'light'].includes(theme) ? theme : ADMIN_DEFAULT_THEME
  document.body.dataset.adminTheme = nextTheme

  if (adminThemeToggle) {
    adminThemeToggle.textContent = nextTheme === 'light' ? adminT('themeDark') : adminT('themeLight')
    adminThemeToggle.setAttribute(
      'aria-label',
      nextTheme === 'light' ? adminT('themeDark') : adminT('themeLight'),
    )
  }
}

function setAdminTheme(theme) {
  const nextTheme = ['dark', 'light'].includes(theme) ? theme : ADMIN_DEFAULT_THEME
  try {
    localStorage.setItem(ADMIN_THEME_STORAGE_KEY, nextTheme)
  } catch {}
  applyAdminTheme(nextTheme)
}

function adminT(key, fallback = '') {
  const language = getAdminLanguage()
  const value =
    ADMIN_TRANSLATIONS[language]?.[key] ??
    ADMIN_TRANSLATIONS[ADMIN_DEFAULT_LANGUAGE]?.[key] ??
    fallback ??
    ''

  if (value === null || value === undefined || typeof value === 'object') {
    return fallback ? String(fallback) : ''
  }

  return String(value)
}

function t(key, fallback = '') {
  return adminT(key, fallback)
}

function setAdminText(selector, key) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = adminT(key)
  })
}

function setAdminPlaceholder(selector, key) {
  document.querySelectorAll(selector).forEach((element) => {
    element.placeholder = adminT(key)
  })
}

const ADMIN_STATIC_TRANSLATIONS = [
  ['Apri', 'Open'],
  ['Salva', 'Save'],
  ['Crea', 'Create'],
  ['Modifica', 'Edit'],
  ['Disattiva', 'Disable'],
  ['Elimina', 'Delete'],
  ['Aggiorna', 'Refresh'],
  ['Annulla modifica', 'Cancel edit'],
  ['Configurazione base', 'Basic configuration'],
  ['Funzione attiva', 'Available in this release'],
  ['Requires external configuration', 'Requires external configuration'],
  ['Advanced tools in progress', 'Advanced tools in progress'],
  ['Native app', 'Native app'],
  ['Active', 'Active'],
  ['Inactive', 'Inactive'],
  ['Disabled', 'Disabled'],
  ['Secret set', 'Secret set'],
  ['No secret', 'No secret'],
  ['Prodotti', 'Products'],
  ['Collezioni', 'Collections'],
  ['Ordini', 'Orders'],
  ['Clienti', 'Customers'],
  ['Inventario', 'Inventory'],
  ['Checkout', 'Checkout'],
  ['Spedizioni', 'Shipping'],
  ['Markets', 'Markets'],
  ['Prezzi localizzati', 'Localized pricing'],
  ['Traduzioni', 'Translations'],
  ['Media Library', 'Media Library'],
  ['Google Suite', 'Google Suite'],
  ['Import Export', 'Import Export'],
  ['SEO', 'SEO'],
  ['Analytics', 'Analytics'],
  ['Reviews', 'Reviews'],
  ['Returns', 'Returns'],
  ['Product Feed', 'Product Feed'],
  ['Backup', 'Backup'],
  ['Store Health', 'Store Health'],
  ['Launch Checklist', 'Launch Checklist'],
  ['Gift Cards', 'Gift Cards'],
  ['Store Credit', 'Store Credit'],
  ['Carrelli abbandonati', 'Abandoned carts'],
  ['Search & Filters', 'Search & Filters'],
  ['SEO Technical', 'SEO Technical'],
  ['Webhooks', 'Webhooks'],
  ['Supplier Feeds', 'Supplier Feeds'],
  ['Subscriptions', 'Subscriptions'],
  ['Utenti e permessi', 'Users and permissions'],
  ['Impostazioni', 'Settings'],
  ['Nome', 'Name'],
  ['Codice', 'Code'],
  ['Descrizione', 'Description'],
  ['Tipo', 'Type'],
  ['Valore', 'Value'],
  ['Stato', 'Status'],
  ['Note', 'Notes'],
  ['Email cliente', 'Customer email'],
  ['Scadenza opzionale', 'Optional expiry'],
  ['Saldo iniziale in euro', 'Initial balance in euros'],
  ['Credito in euro', 'Credit in euros'],
  ['Gestisci gift card', 'Manage gift cards'],
  ['Store credit cliente', 'Customer store credit'],
  ['Crediti cliente', 'Customer credits'],
  ['Configurazione ricerca', 'Search configuration'],
  ['Campi ricercabili', 'Searchable fields'],
  ['Filtri abilitati', 'Enabled filters'],
  ['Salva configurazione', 'Save configuration'],
  ['Redirect manager', 'Redirect manager'],
  ['From path', 'From path'],
  ['To path', 'To path'],
  ['Salva redirect', 'Save redirect'],
  ['Configurazione endpoint', 'Endpoint configuration'],
  ['Evento', 'Event'],
  ['Target URL', 'Target URL'],
  ['Secret opzionale', 'Optional secret'],
  ['Salva webhook', 'Save webhook'],
  ['Test log', 'Test delivery'],
  ['Nome feed', 'Feed name'],
  ['Source URL', 'Source URL'],
  ['Formato', 'Format'],
  ['Schedule', 'Schedule'],
  ['Target import', 'Import target'],
  ['Salva feed', 'Save feed'],
  ['Dry-run manuale', 'Manual dry-run'],
  ['Subscription product config', 'Subscription product config'],
  ['Frequenza', 'Frequency'],
  ['Prezzo subscription in euro', 'Subscription price in euros'],
  ['Trial days opzionali', 'Optional trial days'],
  ['Salva subscription', 'Save subscription'],
  ['Salvataggio gift card...', 'Saving gift card...'],
  ['Gift card salvata.', 'Gift card saved.'],
  ['Salvataggio gift card non riuscito.', 'Gift card save failed.'],
  ['Salvataggio webhook...', 'Saving webhook...'],
  ['Webhook salvato.', 'Webhook saved.'],
  ['Salvataggio webhook non riuscito.', 'Webhook save failed.'],
  ['Salvataggio subscription...', 'Saving subscription...'],
  ['Subscription salvata.', 'Subscription saved.'],
  ['Salvataggio subscription non riuscito.', 'Subscription save failed.'],
  ['Nessuna gift card presente.', 'No gift cards yet.'],
  ['Nessun webhook configurato.', 'No webhooks configured.'],
  ['Nessun prodotto subscription configurato.', 'No subscription products configured.'],
  ['Audit mode: modifiche disabilitate.', 'Audit mode: changes are disabled.'],
]

ADMIN_STATIC_TRANSLATIONS.push(
  ['Login non riuscito. Riprova.', 'Sign-in failed. Try again.'],
  ['Bootstrap non riuscito.', 'Bootstrap failed.'],
  ['Bootstrap non riuscito. Riprova.', 'Bootstrap failed. Try again.'],
  ['Crea il primo owner.', 'Create the first owner.'],
  ['Aggiungi prodotto', 'Add product'],
  ['Salva prodotto', 'Save product'],
  ['Modifica prodotto', 'Edit product'],
  ['Aggiorna prodotto', 'Update product'],
  ['Nessuna variante configurata.', 'No variants configured.'],
  ['Caricamento prodotti...', 'Loading products...'],
  ['Errore nel caricamento prodotti.', 'Product loading error.'],
  ['Nessun prodotto trovato.', 'No products found.'],
  ['Nessun prodotto corrisponde alla ricerca.', 'No product matches the search.'],
  ['Nessuna descrizione', 'No description'],
  ['Errore durante la disattivazione.', 'Disable failed.'],
  ['Errore di connessione alla API.', 'API connection error.'],
  ['Stock basso', 'Low stock'],
  ['Stock prodotto base', 'Base product stock'],
  ['Stock non valido.', 'Invalid stock.'],
  ['Aggiornamento stock non riuscito.', 'Stock update failed.'],
  ['Errore di connessione inventario.', 'Inventory connection error.'],
  ['Salvataggio in corso...', 'Saving...'],
  ['Errore nel salvataggio.', 'Save failed.'],
  ['Prodotto aggiornato correttamente.', 'Product updated successfully.'],
  ['Prodotto salvato correttamente.', 'Product saved successfully.'],
  ['Errore di connessione.', 'Connection error.'],
  ['Dettaglio tecnico:', 'Technical detail:'],
  ['Errore caricamento Google Suite.', 'Google Suite loading error.'],
  ['Salvataggio Google Suite...', 'Saving Google Suite...'],
  ['Google Suite salvata.', 'Google Suite saved.'],
  ['Errore Google Suite.', 'Google Suite error.'],
  ['Salvataggio Google Suite non riuscito.', 'Google Suite save failed.'],
  ['Errore caricamento cookie settings.', 'Cookie settings loading error.'],
  ['Salvataggio cookie settings...', 'Saving cookie settings...'],
  ['Salvataggio cookie settings non riuscito.', 'Cookie settings save failed.'],
  ['Export non disponibile.', 'Export unavailable.'],
  ['Export non riuscito. Riprova.', 'Export failed. Try again.'],
  ['Caricamento history...', 'Loading history...'],
  ['History non disponibile.', 'History unavailable.'],
  ['Nessun job DataFlow registrato. Le prossime esportazioni/importazioni appariranno qui.', 'No DataFlow job yet. Future exports/imports will appear here.'],
  ['Import completato.', 'Import completed.'],
  ['Import non disponibile.', 'Import unavailable.'],
  ['Import non riuscito. Verifica formato e riprova.', 'Import failed. Check the format and try again.'],
  ['Seleziona prodotto', 'Select product'],
  ['Email Automations non disponibile.', 'Email Automations unavailable.'],
  ['Nessun template configurato.', 'No templates configured.'],
  ['Nessun log email.', 'No email logs.'],
  ['Salvataggio template...', 'Saving template...'],
  ['Template salvato.', 'Template saved.'],
  ['Salvataggio non riuscito.', 'Save failed.'],
  ['Caricamento reviews...', 'Loading reviews...'],
  ['Nessun testo', 'No text'],
  ['Cliente', 'Customer'],
  ['Nessuna review presente.', 'No reviews yet.'],
  ['Salvataggio review...', 'Saving review...'],
  ['Salvataggio review non riuscito.', 'Review save failed.'],
  ['Caricamento resi...', 'Loading returns...'],
  ['Nessun motivo', 'No reason'],
  ['Nessun reso presente.', 'No returns yet.'],
  ['Return aggiornato.', 'Return updated.'],
  ['Salvataggio reso...', 'Saving return...'],
  ['Reso salvato.', 'Return saved.'],
  ['Salvataggio reso non riuscito.', 'Return save failed.'],
  ['Caricamento upsell...', 'Loading upsells...'],
  ['Upsell non disponibile.', 'Upsell unavailable.'],
  ['Nessun messaggio', 'No message'],
  ['Nessuna regola upsell presente.', 'No upsell rules yet.'],
  ['Upsell aggiornato.', 'Upsell updated.'],
  ['Salvataggio upsell...', 'Saving upsell...'],
  ['Upsell salvato.', 'Upsell saved.'],
  ['Salvataggio upsell non riuscito.', 'Upsell save failed.'],
  ['Caricamento product feeds...', 'Loading product feeds...'],
  ['Product Feed non disponibile.', 'Product Feed unavailable.'],
  ['Salvataggio feed...', 'Saving feed...'],
  ['Feed salvato.', 'Feed saved.'],
  ['Salvataggio feed non riuscito.', 'Feed save failed.'],
  ['Caricamento gift cards...', 'Loading gift cards...'],
  ['Nessun cliente associato', 'No linked customer'],
  ['Gift card aggiornata.', 'Gift card updated.'],
  ['Caricamento crediti...', 'Loading credits...'],
  ['Store credit non disponibile.', 'Store credit unavailable.'],
  ['Nessuna nota', 'No notes'],
  ['Nessun credito cliente presente.', 'No customer credit yet.'],
  ['Credito aggiornato.', 'Credit updated.'],
  ['Salvataggio credito...', 'Saving credit...'],
  ['Credito salvato.', 'Credit saved.'],
  ['Salvataggio credito non riuscito.', 'Credit save failed.'],
  ['Caricamento carrelli...', 'Loading carts...'],
  ['Nessun carrello abbandonato tracciato.', 'No abandoned carts tracked.'],
  ['Search config non disponibile.', 'Search config unavailable.'],
  ['Salvataggio ricerca...', 'Saving search config...'],
  ['Configurazione salvata.', 'Configuration saved.'],
  ['Salvataggio ricerca non riuscito.', 'Search config save failed.'],
  ['SEO Technical non disponibile.', 'SEO Technical unavailable.'],
  ['Nessun redirect configurato.', 'No redirects configured.'],
  ['Redirect aggiornato.', 'Redirect updated.'],
  ['Salvataggio redirect...', 'Saving redirect...'],
  ['Redirect salvato.', 'Redirect saved.'],
  ['Salvataggio redirect non riuscito.', 'Redirect save failed.'],
  ['Webhook aggiornato.', 'Webhook updated.'],
  ['Nessun delivery log.', 'No delivery logs.'],
  ['Nessun feed fornitore configurato.', 'No supplier feeds configured.'],
  ['Feed aggiornato.', 'Feed updated.'],
  ['Nessun dry-run ancora registrato.', 'No dry-run recorded yet.'],
  ['Dry-run non riuscito.', 'Dry-run failed.'],
  ['Caricamento subscriptions...', 'Loading subscriptions...'],
  ['Backup non disponibile.', 'Backup unavailable.'],
  ['Backup non riuscito.', 'Backup failed.'],
  ['Aggiungi collezione', 'Add collection'],
  ['Salva collezione', 'Save collection'],
  ['Modifica collezione', 'Edit collection'],
  ['Aggiorna collezione', 'Update collection'],
  ['Caricamento collezioni...', 'Loading collections...'],
  ['Errore nel caricamento collezioni.', 'Collection loading error.'],
  ['Nessuna collezione trovata.', 'No collections found.'],
  ['Nessuna collezione corrisponde alla ricerca.', 'No collection matches the search.'],
  ['Errore durante eliminazione collezione.', 'Collection delete failed.'],
  ['Errore di connessione alla API collezioni.', 'Collection API connection error.'],
  ['Aggiungi pagina', 'Add page'],
  ['Salva pagina', 'Save page'],
  ['Modifica pagina', 'Edit page'],
  ['Aggiorna pagina', 'Update page'],
  ['Caricamento pagine...', 'Loading pages...'],
  ['Errore nel caricamento pagine.', 'Page loading error.'],
  ['Nessuna pagina trovata.', 'No pages found.'],
  ['Errore durante eliminazione pagina.', 'Page delete failed.'],
  ['Errore di connessione alla API pagine.', 'Page API connection error.'],
  ['Aggiungi policy', 'Add policy'],
  ['Salva policy', 'Save policy'],
  ['Modifica policy', 'Edit policy'],
  ['Aggiorna policy', 'Update policy'],
  ['Caricamento policy...', 'Loading policies...'],
  ['Errore caricamento policy.', 'Policy loading error.'],
  ['Nessuna policy.', 'No policies.'],
  ['Errore di connessione policy.', 'Policy connection error.'],
  ['Salvataggio policy...', 'Saving policy...'],
  ['Nessun elemento disponibile', 'No items available'],
  ['Seleziona un elemento da tradurre.', 'Select an item to translate.'],
  ['Errore caricamento traduzioni.', 'Translation loading error.'],
  ['Caricamento traduzioni...', 'Loading translations...'],
  ['Seleziona contenuto e campo da tradurre.', 'Select content and field to translate.'],
  ['Salvataggio traduzione...', 'Saving translation...'],
  ['Errore di connessione traduzioni.', 'Translation connection error.'],
  ['Disattivazione traduzione...', 'Disabling translation...'],
  ['Errore disattivazione traduzione.', 'Translation disable failed.'],
  ['Aggiungi articolo', 'Add article'],
  ['Salva articolo', 'Save article'],
  ['Modifica articolo', 'Edit article'],
  ['Aggiorna articolo', 'Update article'],
  ['Caricamento articoli...', 'Loading articles...'],
  ['Errore caricamento blog.', 'Blog loading error.'],
  ['Nessun articolo creato.', 'No articles yet.'],
  ['Nessun articolo corrisponde alla ricerca.', 'No article matches the search.'],
  ['Nessun excerpt', 'No excerpt'],
  ['Errore articolo.', 'Article error.'],
  ['Errore di connessione blog.', 'Blog connection error.'],
  ['Salvataggio articolo...', 'Saving article...'],
  ['Articolo salvato.', 'Article saved.'],
  ['Caricamento metaobjects...', 'Loading metaobjects...'],
  ['Errore metaobjects.', 'Metaobjects error.'],
  ['Nessun metaobject creato.', 'No metaobjects yet.'],
  ['Errore di connessione metaobjects.', 'Metaobjects connection error.'],
  ['Salvataggio definizione...', 'Saving definition...'],
  ['Definizione salvata.', 'Definition saved.'],
  ['Errore metaobject. Verifica il JSON dei campi e riprova.', 'Metaobject error. Check field JSON and try again.'],
  ['Salvataggio entry...', 'Saving entry...'],
  ['Errore entry. Verifica il JSON dei dati e riprova.', 'Entry error. Check data JSON and try again.'],
  ['Caricamento impostazioni fiscali...', 'Loading tax settings...'],
  ['Errore caricamento impostazioni fiscali.', 'Tax settings loading error.'],
  ['Errore di connessione impostazioni fiscali.', 'Tax settings connection error.'],
  ['Salvataggio impostazioni fiscali...', 'Saving tax settings...'],
  ['Impostazioni fiscali salvate.', 'Tax settings saved.'],
  ['Errore impostazioni fiscali.', 'Tax settings error.'],
  ['Caricamento pagamenti...', 'Loading payments...'],
  ['Errore caricamento pagamenti.', 'Payment loading error.'],
  ['Errore di connessione pagamenti.', 'Payment connection error.'],
  ['Salvataggio pagamenti...', 'Saving payments...'],
  ['Errore salvataggio pagamenti.', 'Payment save failed.'],
  ['Aggiungi metodo', 'Add method'],
  ['Salva spedizione', 'Save shipping'],
  ['Modifica metodo', 'Edit method'],
  ['Aggiorna spedizione', 'Update shipping'],
  ['Caricamento spedizioni...', 'Loading shipping...'],
  ['Nessun metodo spedizione configurato.', 'No shipping methods configured.'],
  ['Errore di connessione spedizioni.', 'Shipping connection error.'],
  ['Salvataggio spedizione...', 'Saving shipping...'],
  ['Metodo spedizione salvato.', 'Shipping method saved.'],
  ['Errore salvataggio spedizione.', 'Shipping save failed.'],
  ['Aggiungi sconto', 'Add discount'],
  ['Salva sconto', 'Save discount'],
  ['Modifica sconto', 'Edit discount'],
  ['Aggiorna sconto', 'Update discount'],
  ['Caricamento sconti...', 'Loading discounts...'],
  ['Errore caricamento sconti.', 'Discount loading error.'],
  ['Nessuno sconto creato.', 'No discounts yet.'],
  ['Errore disattivazione sconto.', 'Discount disable failed.'],
  ['Errore di connessione sconti.', 'Discount connection error.'],
  ['Salvataggio sconto...', 'Saving discount...'],
  ['Errore salvataggio sconto.', 'Discount save failed.'],
  ['Sconto salvato.', 'Discount saved.'],
  ['Aggiungi campagna', 'Add campaign'],
  ['Salva campagna', 'Save campaign'],
  ['Modifica campagna', 'Edit campaign'],
  ['Aggiorna campagna', 'Update campaign'],
  ['Caricamento campagne...', 'Loading campaigns...'],
  ['Errore caricamento campagne.', 'Campaign loading error.'],
  ['Nessuna campagna creata.', 'No campaigns yet.'],
  ['Salvataggio campagna...', 'Saving campaign...'],
  ['Aggiungi media', 'Add media'],
  ['Salva media', 'Save media'],
  ['Modifica media', 'Edit media'],
  ['Aggiorna media', 'Update media'],
  ['Nessun media salvato. Usa upload o URL manuale per popolare la libreria.', 'No media saved yet. Use upload or manual URL to populate the library.'],
  ['Nessun media corrisponde a ricerca o filtri.', 'No media matches search or filters.'],
  ['Errore eliminazione media.', 'Media delete failed.'],
  ['Errore caricamento media.', 'Media loading error.'],
  ['Errore di connessione media.', 'Media connection error.'],
  ['Salvataggio media...', 'Saving media...'],
  ['Errore salvataggio media.', 'Media save failed.'],
  ['Media salvato.', 'Media saved.'],
  ['Seleziona un file da caricare.', 'Select a file to upload.'],
  ['Upload non disponibile. Usa URL manuale.', 'Upload unavailable. Use a manual URL.'],
  ['Upload non riuscito. Usa URL manuale o verifica la configurazione storage.', 'Upload failed. Use a manual URL or check storage configuration.'],
  ['Seleziona record', 'Select record'],
  ['Caricamento analytics...', 'Loading analytics...'],
  ['Errore analytics.', 'Analytics error.'],
  ['Caricamento SEO...', 'Loading SEO...'],
  ['Nessun controllo disponibile.', 'No checks available.'],
  ['Caricamento Store Health...', 'Loading Store Health...'],
  ['Store Health non disponibile.', 'Store Health unavailable.'],
  ['Caricamento checklist...', 'Loading checklist...'],
  ['Launch checklist non disponibile.', 'Launch checklist unavailable.'],
  ['Seleziona una sezione', 'Select a section'],
  ['Seleziona una sezione dalla lista.', 'Select a section from the list.'],
  ['Salvataggio...', 'Saving...'],
)

ADMIN_STATIC_TRANSLATIONS.push(
  ['Stato operativo commerce.', 'Commerce operational status.'],
  ['Salva sezione', 'Save section'],
  ['Pagina da modificare', 'Page to edit'],
  ['Libreria sezioni CMS', 'CMS section library'],
  ['Scegli una sezione gia pronta e personalizzala nella pagina selezionata.', 'Choose a ready-made section and customize it on the selected page.'],
  ['Caricamento impostazioni tema...', 'Loading theme settings...'],
  ['Salva impostazioni', 'Save settings'],
  ['Salva solo ID pubblici e codici di verifica. OAuth, API private e credenziali restano fuori dal repository.', 'Save only public IDs and verification codes. OAuth, private APIs and credentials stay out of the repository.'],
  ['Conversion ID e label purchase/order. Nessuna chiave privata viene salvata.', 'Conversion ID and purchase/order label. No private key is saved.'],
  ['Salva Google Suite', 'Save Google Suite'],
  ['Cerca prodotto, SKU, categoria...', 'Search product, SKU, category...'],
  ['Prezzo in euro', 'Price in euros'],
  ['Aggiungi variante', 'Add variant'],
  ['Cerca collezioni...', 'Search collections...'],
  ['Cerca prodotti...', 'Search products...'],
  ['Importa, esporta e aggiorna in massa dati del sito senza app esterne.', 'Import, export and bulk update site data without external apps.'],
  ['Gestisci prodotti, collezioni, contenuti, menu e traduzioni in modo centralizzato.', 'Manage products, collections, content, menus and translations in one place.'],
  ['Nessun abbonamento mensile ad app esterne.', 'No monthly subscription to external apps.'],
  ['Export', 'Export'],
  ['Import', 'Import'],
  ['Templates', 'Templates'],
  ['Stock update', 'Stock update'],
  ['Translation package', 'Translation package'],
  ['Site package', 'Site package'],
  ['History', 'History'],
  ['Advanced tools', 'Advanced tools'],
  ['Nessun export ancora.', 'No export yet.'],
  ['Nessuna preview.', 'No preview.'],
  ['Nessun template preparato.', 'No template prepared.'],
  ['Nessun package preparato.', 'No package prepared.'],
  ['Nessun site package esportato.', 'No site package exported.'],
  ['Nessun job caricato.', 'No jobs loaded.'],
  ['Salva template', 'Save template'],
  ['Aggiungi review', 'Add review'],
  ['Salva review', 'Save review'],
  ['Salva reso', 'Save return'],
  ['Salva upsell', 'Save upsell'],
  ['Include out of stock', 'Include out of stock'],
  ['Usa la scheda clienti per storico ordini, note, tag e invito mock. Nessuna password cliente viene gestita in questa fase.', 'Use the customer view for order history, notes, tags and mock invites. No customer password is managed here.'],
  ['Salva gift card', 'Save gift card'],
  ['Salva store credit', 'Save store credit'],
  ['Stato: active, scheduled, expired, disabled', 'Status: active, scheduled, expired, disabled'],
  ['Configurazione avanzata', 'Advanced configuration'],
  ['Tracking leggero e recovery email mock/provider-ready. Nessun dato sensibile viene esposto.', 'Light tracking and mock/provider-ready recovery email. No sensitive data is exposed.'],
  ['Salva configurazione', 'Save configuration'],
  ['Caricamento status ricerca...', 'Loading search status...'],
  ['Caricamento SEO technical...', 'Loading SEO technical...'],
  ['Caricamento redirects...', 'Loading redirects...'],
  ['Caricamento delivery log...', 'Loading delivery log...'],
  ['Caricamento log feed...', 'Loading feed log...'],
  ['Prezzo subscription in euro', 'Subscription price in euros'],
  ['Checkout abbonamenti richiede setup provider ricorrente. Nessuna subscription Stripe reale viene creata in questa fase.', 'Subscription checkout requires a recurring provider setup. No real Stripe subscription is created at this stage.'],
  ['Nessun invio email reale viene configurato qui finche non esiste un provider sicuro.', 'No real email sending is configured here until a secure provider exists.'],
  ['Stato traduzioni', 'Translation status'],
  ['Aggiungi voce menu', 'Add menu item'],
  ['Salva voce menu', 'Save menu item'],
  ['Caricamento menu...', 'Loading menus...'],
  ['Configurazione base dei paesi collegabili ai mercati.', 'Basic configuration for countries connected to markets.'],
  ['Configurazione base delle valute usate da mercati e prezzi localizzati.', 'Basic configuration for currencies used by markets and localized pricing.'],
  ['Nessun cambio live esterno: se manca un prezzo localizzato, il sito usa il prezzo base.', 'No external live exchange rates: if localized pricing is missing, the site uses the base price.'],
  ['Prezzo localizzato', 'Localized price'],
  ['Prezzo prodotto base', 'Base product price'],
  ['Caricamento prezzi localizzati...', 'Loading localized prices...'],
  ['Salva prezzo localizzato', 'Save localized price'],
  ['Caricamento traffico...', 'Loading traffic...'],
  ['Caricamento vendite...', 'Loading sales...'],
  ['Caricamento conversioni...', 'Loading conversions...'],
  ['Caricamento eventi...', 'Loading events...'],
  ['Configurazione fiscale usata dal riepilogo checkout.', 'Tax configuration used by the checkout summary.'],
  ['Salva impostazioni fiscali', 'Save tax settings'],
  ['Caricamento stato Stripe...', 'Loading Stripe status...'],
  ['Salva pagamenti', 'Save payments'],
  ['Spedizione standard', 'Standard shipping'],
  ['Prezzo', 'Price'],
  ['Ordine visualizzazione', 'Display order'],
  ['Caricamento stato privacy...', 'Loading privacy status...'],
  ['Stato banner', 'Banner status'],
  ['Salva cookie settings', 'Save cookie settings'],
  ['Seleziona un record.', 'Select a record.'],
  ['Salva valori', 'Save values'],
  ['Aggiungi integrazione', 'Add integration'],
  ['Salva integrazione', 'Save integration'],
  ['Aggiungi utente', 'Add user'],
  ['Salva utente', 'Save user'],
  ['Aggiungi template', 'Add template'],
  ['Salva notifica', 'Save notification'],
  ['Caricamento stato provider...', 'Loading provider status...'],
  ['Registro domini per primario, redirect, preview e note DNS. Nessun DNS reale viene modificato.', 'Domain registry for primary, redirect, preview and DNS notes. No real DNS record is modified.'],
  ['Aggiungi dominio', 'Add domain'],
  ['Salva dominio', 'Save domain'],
  ['Aggiungi tenant', 'Add tenant'],
  ['Salva tenant', 'Save tenant'],
  ['Salva performance', 'Save performance'],
  ['Prezzo localizzato salvato.', 'Localized price saved.'],
  ['Prezzo caricato nel form.', 'Price loaded into the form.'],
  ['Nessun dato analytics ancora disponibile.', 'No analytics data available yet.'],
  ['Nessun evento', 'No events'],
  ['Nessuna page view ancora registrata.', 'No page views recorded yet.'],
  ['Nessun evento prodotto ancora registrato.', 'No product events recorded yet.'],
  ['Nessun evento recente.', 'No recent events.'],
  ['Nessun contenuto disponibile per l audit SEO.', 'No content available for the SEO audit.'],
  ['Nessun webhook', 'No webhook'],
  ['Nessuna integrazione.', 'No integrations.'],
  ['Errore integrazione. Verifica il JSON configurazione e riprova.', 'Integration error. Check the configuration JSON and try again.'],
  ['Nessun utente admin.', 'No admin users.'],
  ['Nessun log.', 'No logs.'],
  ['Nessun template.', 'No templates.'],
  ['Nessuna nota DNS', 'No DNS notes'],
  ['Nessun dominio configurato.', 'No domains configured.'],
  ['Nessun tenant.', 'No tenants.'],
  ['Stato base non invasivo.', 'Non-invasive base status.'],
  ['Nessuna notifica loggata per questo ordine.', 'No notifications logged for this order.'],
  ['Nessun ordine collegato.', 'No linked orders.'],
  ['Salva cliente', 'Save customer'],
  ['Seleziona destinazione', 'Select destination'],
  ['Errore caricamento destinazioni menu.', 'Menu destination loading error.'],
  ['Errore nel caricamento menu.', 'Menu loading error.'],
  ['Nessun menu trovato.', 'No menus found.'],
  ['Nessuna voce in questo menu.', 'No items in this menu.'],
  ['Errore eliminazione voce menu.', 'Menu item delete failed.'],
  ['Errore salvataggio voce menu.', 'Menu item save failed.'],
  ['Nessun controllo disponibile.', 'No checks available.'],
  ['Errore caricamento pagine editor.', 'Editor pages loading error.'],
  ['Errore caricamento sezioni.', 'Section loading error.'],
  ['Errore eliminazione sezione.', 'Section delete failed.'],
  ['Errore salvataggio.', 'Save failed.'],
  ['Errore aggiunta sezione.', 'Section add failed.'],
)

ADMIN_STATIC_TRANSLATIONS.push(
  ['Lingua admin', 'Admin language'],
  ['Cambia tema', 'Change theme'],
  ['Navigazione TakeOffMilan CMS', 'TakeOffMilan CMS navigation'],
  ['Aree CMS', 'CMS areas'],
  ['Website Operating System', 'Website Operating System'],
  ['Next Generation Website CMS', 'Next Generation Website CMS'],
  ['Benvenuto nel CMS', 'Welcome to the CMS'],
  ['Crea, gestisci e fai crescere siti custom da un unico sistema operativo.', 'Build, manage and scale custom websites from one operating system.'],
  ['Quick action', 'Quick action'],
  ['Modifica il sito', 'Edit site'],
  ['Apri editor visuale, sezioni e tema.', 'Open the visual editor, sections and theme.'],
  ['Gestisci prodotti', 'Manage products'],
  ['Catalogo, varianti, immagini e stock.', 'Catalog, variants, images and stock.'],
  ['Carica media', 'Upload media'],
  ['Libreria visuale, upload e URL.', 'Visual library, uploads and URLs.'],
  ['Configura markets', 'Configure markets'],
  ['Lingue, valute e prezzi localizzati.', 'Languages, currencies and localized prices.'],
  ['Catalogo attivo e varianti.', 'Active catalog and variants.'],
  ['Struttura catalogo.', 'Catalog structure.'],
  ['Asset disponibili nel CMS.', 'Assets available in the CMS.'],
  ['Main feature', 'Main feature'],
  ['Visual Editor', 'Visual Editor'],
  ['Il cuore del CMS: costruisci, controlla e verifica il sito in tempo reale su desktop, tablet e mobile.', 'The CMS core: build, control and verify the site in real time across desktop, tablet and mobile.'],
  ['Formato preview', 'Preview format'],
  ['Desktop', 'Desktop'],
  ['Tablet', 'Tablet'],
  ['Mobile', 'Mobile'],
  ['Desktop preview', 'Desktop preview'],
  ['Tablet preview', 'Tablet preview'],
  ['Mobile preview', 'Mobile preview'],
  ['Live canvas', 'Live canvas'],
  ['Anteprima sito', 'Site preview'],
  ['Theme settings', 'Theme settings'],
  ['Logo, colori, tipografie, header e footer.', 'Logo, colors, typography, header and footer.'],
  ['Chiudi impostazioni tema', 'Close theme settings'],
  ['Base', 'Base'],
  ['Premium', 'Premium'],
  ['Ecommerce', 'Ecommerce'],
  ['Conversione', 'Conversion'],
  ['Brand', 'Brand'],
  ['Layout', 'Layout'],
  ['Sezioni base', 'Base sections'],
  ['Sezioni premium', 'Premium sections'],
  ['Fiducia e conversione', 'Trust and conversion'],
  ['Brand e contenuto', 'Brand and content'],
  ['Layout avanzati', 'Advanced layouts'],
  ['Testo + immagine', 'Text + image'],
  ['Griglia prodotti', 'Product grid'],
  ['Griglia collezioni', 'Collection grid'],
  ['Stats / Numeri', 'Stats / Numbers'],
  ['Gallery Editoriale', 'Editorial gallery'],
  ['Logo Partner / Clienti', 'Partner / Customer logos'],
  ['Awards / Riconoscimenti', 'Awards / Recognition'],
  ['Accordion avanzato', 'Advanced accordion'],
  ['Sezioni pagina', 'Page sections'],
  ['Operativo', 'Operational'],
  ['Native apps', 'Native apps'],
  ['Attiva', 'Active'],
  ['Attivo', 'Active'],
  ['Configurabile', 'Configurable'],
  ['Configurable', 'Configurable'],
  ['Nel prodotto', 'In product'],
  ['Gestisci schede prodotto, immagini, prezzi e disponibilita.', 'Manage product pages, images, prices and availability.'],
  ['Raggruppa prodotti in collezioni cliccabili e pagine dedicate.', 'Group products into clickable collections and dedicated pages.'],
  ['Gestisci opzioni, SKU, prezzo e stock variante nel form prodotto.', 'Manage options, SKU, price and variant stock in the product form.'],
  ['Scorte prodotto e variante, filtri, soglie low stock e aggiornamento rapido.', 'Product and variant stock, filters, low-stock thresholds and quick updates.'],
  ["Apri l'app nativa per export, import controllati e workflow traduzioni.", 'Open the native app for exports, controlled imports and translation workflows.'],
  ['App native per gestire operativita, contenuti e crescita del sito.', 'Native apps to manage operations, content and site growth.'],
  ['Ogni modulo resta interno al TakeOffMilan CMS: stessa sicurezza admin, stessi permessi, stesso flusso di lavoro.', 'Every module stays inside TakeOffMilan CMS: same admin security, same permissions, same workflow.'],
  ['Gestione traduzioni contenuti pubblici con fallback alla lingua originale.', 'Public content translation management with fallback to the original language.'],
  ['Centro SEO nativo per audit, metadati e contenuti ottimizzati.', 'Native SEO center for audits, metadata and optimized content.'],
  ['Metriche base, eventi e dati operativi integrati nel CMS.', 'Base metrics, events and operational data integrated in the CMS.'],
  ['Configura GA4, Google Ads, Search Console e Tag Manager.', 'Configure GA4, Google Ads, Search Console and Tag Manager.'],
  ['Libreria visuale per upload, URL fallback, anteprime e alt text.', 'Visual library for uploads, fallback URLs, previews and alt text.'],
  ['Viewer prodotto 3D nativo per esperienze premium e interattive.', 'Native 3D product viewer for premium interactive experiences.'],
  ['Campagne, sconti e strumenti promozionali collegati al catalogo.', 'Campaigns, discounts and promotional tools connected to the catalog.'],
  ['Webhook e integrazioni non sensibili gestiti da pannello.', 'Webhooks and non-sensitive integrations managed from the panel.'],
  ['Collega strumenti Google per analytics, advertising, verifica SEO e tag management senza salvare secrets.', 'Connect Google tools for analytics, advertising, SEO verification and tag management without saving secrets.'],
  ['Google stack configurabile dal CMS.', 'Google stack configurable from the CMS.'],
  ['Inserisci un Measurement ID tipo G-XXXXXXXXXX. Se attivo, il sito carica gtag.js.', 'Enter a Measurement ID such as G-XXXXXXXXXX. When active, the site loads gtag.js.'],
  ['GA4 attivo', 'GA4 active'],
  ['Google Ads attivo', 'Google Ads active'],
  ['Copia il valore del meta tag di verifica da Search Console e salvalo qui.', 'Copy the verification meta tag value from Search Console and save it here.'],
  ['Verification content o meta tag completo', 'Verification content or full meta tag'],
  ['GTM usa un Container ID tipo GTM-XXXXXXX. Google Tag puo usare G- oppure AW-.', 'GTM uses a Container ID like GTM-XXXXXXX. Google Tag can use G- or AW-.'],
  ['GTM attivo', 'GTM active'],
  ['Google Tag attivo', 'Google Tag active'],
  ['Google Tag ID opzionale', 'Optional Google Tag ID'],
  ['Privacy e stato', 'Privacy and status'],
  ['Gli eventi ecommerce base sono predisposti: view_item, add_to_cart, begin_checkout e purchase. Il sito usa un consenso conservativo: analytics e marketing partono solo dopo scelta del visitatore.', 'Base ecommerce events are ready: view_item, add_to_cart, begin_checkout and purchase. The site uses conservative consent: analytics and marketing start only after the visitor chooses.'],
  ['Torna ad App Hub', 'Back to App Hub'],
  ['Torna a Catalogo', 'Back to Catalog'],
  ['Torna a Marketing', 'Back to Marketing'],
  ['Torna a TakeOff SEO', 'Back to TakeOff SEO'],
  ['Torna a Import Export', 'Back to Import Export'],
  ['Torna a Contenuto', 'Back to Content'],
  ['Tutto lo stock', 'All stock'],
  ['Out of stock', 'Out of stock'],
  ['Soglia low stock', 'Low-stock threshold'],
  ['Caricamento inventario...', 'Loading inventory...'],
  ['Crea e modifica le collezioni del catalogo.', 'Create and edit catalog collections.'],
  ['Nome collezione', 'Collection name'],
  ['Archivio collezioni', 'Collection archive'],
  ['Nome prodotto', 'Product name'],
  ['Senza collezione', 'No collection'],
  ['Varianti prodotto', 'Product variants'],
  ['Opzioni semplici come taglia, colore o formato. Lascia vuoto se il prodotto non ha varianti.', 'Simple options such as size, color or format. Leave empty if the product has no variants.'],
  ['Archivio prodotti', 'Product archive'],
  ['Operativita centralizzata per dati, contenuti e traduzioni.', 'Centralized operations for data, content and translations.'],
  ['Scarica risorse singole in JSON o CSV senza modificare il database.', 'Download individual resources as JSON or CSV without modifying the database.'],
  ["Usa prima il dry-run per validare il file. L'import crea o aggiorna record e non elimina dati esistenti.", 'Use dry-run first to validate the file. Import creates or updates records and does not delete existing data.'],
  ['Valida / importa', 'Validate / import'],
  ['Template scaricabili', 'Downloadable templates'],
  ['Template con struttura consigliata e campi compatibili per prodotti, collezioni, traduzioni e prezzi localizzati.', 'Templates with recommended structure and compatible fields for products, collections, translations and localized prices.'],
  ['Aggiorna stock prodotti o varianti tramite product_slug, product_id, variant_id o SKU.', 'Update product or variant stock through product_slug, product_id, variant_id or SKU.'],
  ["Il dry-run valida le righe prima di scrivere. L'import aggiorna solo stock, senza cancellare prodotti o varianti.", 'Dry-run validates rows before writing. Import updates stock only, without deleting products or variants.'],
  ['Agency workflow: esporta testi traducibili, compila translated_value e reimporta senza modificare i contenuti originali.', 'Agency workflow: export translatable text, fill translated_value and reimport without changing original content.'],
  ['Lingua target', 'Target language'],
  ['Export sicuro dei contenuti configurabili del sito. Non include codice JS/CSS o file eseguibili.', 'Safe export of configurable site content. It does not include JS/CSS code or executable files.'],
  ['Import site package completo non attivo per sicurezza: ora e disponibile export sicuro dei contenuti configurabili.', 'Full site package import is disabled for safety: safe export of configurable content is available now.'],
  ['Supplier feed, scheduled import/export e restore completo saranno attivati solo con controlli dedicati e backup obbligatorio.', 'Supplier feed, scheduled import/export and full restore will be enabled only with dedicated checks and mandatory backups.'],
  ['Caricamento automazioni...', 'Loading automations...'],
  ['Recensioni prodotto native con moderazione e rating pubblico.', 'Native product reviews with moderation and public rating.'],
  ['Prodotto', 'Product'],
  ['Nome cliente', 'Customer name'],
  ['Nota cliente', 'Customer note'],
  ['Bundle, frequently bought together e cart upsell in configurazione base.', 'Bundles, frequently bought together and cart upsells in basic configuration.'],
  ['Prodotto base', 'Base product'],
  ['Prodotto trigger', 'Trigger product'],
  ['Prodotti consigliati (ID separati da virgola)', 'Recommended products (comma-separated IDs)'],
  ['Configura feed', 'Configure feed'],
  ['Valuta default', 'Default currency'],
  ['Lingua default', 'Default language'],
  ['Customer portal base, inviti provider-ready e stato account senza introdurre auth cliente complessa.', 'Base customer portal, provider-ready invites and account status without introducing complex customer auth.'],
  ['Pagina pubblica /account pianificata per ordini cliente, indirizzi e account status. In questa release resta fallback sicuro se il login cliente non e configurato.', 'Public /account page planned for customer orders, addresses and account status. In this release it remains a safe fallback when customer login is not configured.'],
  ['Apri clienti', 'Open customers'],
  ['Gift cards e store credit gestibili da admin con saldo, stato, cliente e note operative.', 'Gift cards and store credit manageable by admin with balance, status, customer and operational notes.'],
  ['Email cliente opzionale', 'Optional customer email'],
  ['Saldo', 'Balance'],
  ['Saldo residuo', 'Remaining balance'],
  ['Scadenza', 'Expiry'],
  ['Regole sconto Shopify-like con stato chiaro e compatibilita checkout progressiva.', 'Shopify-like discount rules with clear status and progressive checkout compatibility.'],
  ['Disponibile ora', 'Available now'],
  ['Apri sconti', 'Open discounts'],
  ['Limit, customer eligibility, market/currency e combinabilita sono tracciati come configurazione avanzata dove il checkout non applica ancora la regola.', 'Limit, customer eligibility, market/currency and combinability are tracked as advanced configuration when checkout does not yet apply the rule.'],
  ['Send recovery email crea un log/mock se il provider email non e configurato.', 'Send recovery email creates a log/mock if the email provider is not configured.'],
  ['Apri Email Automations', 'Open Email Automations'],
  ['Ricerca prodotti e filtri catalogo configurabili senza motore esterno.', 'Product search and catalog filters configurable without an external engine.'],
  ['Title, description, SKU, categoria, collezione, tag/metafields disponibili e brand/vendor quando presenti.', 'Title, description, SKU, category, collection, available tags/metafields and brand/vendor when present.'],
  ['Endpoint pubblico /api/search?q= attivo con fallback nessun risultato e senza dipendenze esterne.', 'Public /api/search?q= endpoint active with no-results fallback and no external dependencies.'],
  ['Organization, Website, Product e Breadcrumb possono essere generati dal contenuto esistente con fallback quando campi SEO sono vuoti.', 'Organization, Website, Product and Breadcrumb can be generated from existing content with fallbacks when SEO fields are empty.'],
  ['Il dry-run valida la configurazione e registra l esecuzione. Scheduler reale richiede Cloudflare cron o provider esterno.', 'Dry-run validates the configuration and logs the run. A real scheduler requires Cloudflare cron or an external provider.'],
  ['Prodotti in abbonamento predisposti senza avviare billing ricorrente reale.', 'Subscription products prepared without starting real recurring billing.'],
  ['Cookie categories, Google Consent Mode base e strumenti privacy provider-ready.', 'Cookie categories, base Google Consent Mode and provider-ready privacy tools.'],
  ['Cookie categories', 'Cookie categories'],
  ['Privacy tools', 'Privacy tools'],
  ['Apri Cookie settings', 'Open Cookie settings'],
  ['Dettaglio ordine', 'Order detail'],
  ['Stato ordine', 'Order status'],
  ['Stato pagamento', 'Payment status'],
  ['Stato spedizione', 'Shipping status'],
  ['Fulfillment', 'Fulfillment'],
  ['Tracking', 'Tracking'],
  ['Carrier', 'Carrier'],
  ['Note interne', 'Internal notes'],
  ['Timeline', 'Timeline'],
  ['Marca come pagato', 'Mark as paid'],
  ['Marca come spedito', 'Mark as shipped'],
  ['Aggiungi tracking', 'Add tracking'],
  ['Cancella ordine', 'Cancel order'],
  ['Rimborso', 'Refund'],
  ['Reso', 'Return'],
  ['Indirizzo', 'Address'],
  ['Ordini cliente', 'Customer orders'],
  ['Account cliente', 'Customer account'],
  ['Send invite', 'Send invite'],
  ['Lifetime value', 'Lifetime value'],
  ['Ultimo ordine', 'Last order'],
  ['Nessun ordine', 'No orders'],
  ['Nessun cliente', 'No customers'],
  ['Mercati', 'Markets'],
  ['Paesi', 'Countries'],
  ['Lingue', 'Languages'],
  ['Valute', 'Currencies'],
  ['Domini per mercato', 'Domains by market'],
  ['Aggiungi mercato', 'Add market'],
  ['Mercati consigliati', 'Recommended markets'],
  ['Valuta', 'Currency'],
  ['Paese', 'Country'],
  ['Path', 'Path'],
  ['Dominio', 'Domain'],
  ['Prezzo base', 'Base price'],
  ['Fallback', 'Fallback'],
  ['Salva mercato', 'Save market'],
  ['Esporta', 'Export'],
  ['Importa', 'Import'],
  ['Scarica template', 'Download template'],
  ['Report', 'Report'],
  ['Creati', 'Created'],
  ['Aggiornati', 'Updated'],
  ['Saltati', 'Skipped'],
  ['Errori', 'Errors'],
  ['Nessun errore', 'No errors'],
  ['Carica file', 'Upload file'],
  ['Scegli file', 'Choose file'],
  ['Formato CSV', 'CSV format'],
  ['Formato JSON', 'JSON format'],
  ['Backup prima di import', 'Backup before import'],
  ['Scheduled import/export', 'Scheduled import/export'],
  ['Supplier feed', 'Supplier feed'],
  ['Measurement ID', 'Measurement ID'],
  ['Conversion ID', 'Conversion ID'],
  ['Verification tag', 'Verification tag'],
  ['Salva impostazioni', 'Save settings'],
  ['Alt text', 'Alt text'],
  ['Copia URL', 'Copy URL'],
  ['Apri file', 'Open file'],
  ['Dimensione', 'Size'],
  ['SEO dashboard', 'SEO dashboard'],
  ['Missing meta', 'Missing meta'],
  ['Google snippet', 'Google snippet'],
  ['Sitemap', 'Sitemap'],
  ['Robots', 'Robots'],
  ['Redirects', 'Redirects'],
  ['Analytics overview', 'Analytics overview'],
  ['Traffic', 'Traffic'],
  ['Sales', 'Sales'],
  ['Products', 'Products'],
  ['Conversions', 'Conversions'],
  ['Events', 'Events'],
  ['Empty state', 'Empty state'],
  ['Carrello abbandonato', 'Abandoned cart'],
  ['Recovery email', 'Recovery email'],
  ['Ricerca', 'Search'],
  ['Filtri', 'Filters'],
  ['Sitemap status', 'Sitemap status'],
  ['Robots status', 'Robots status'],
  ['Event', 'Event'],
  ['Delivery log', 'Delivery log'],
  ['Feed fornitori', 'Supplier feeds'],
  ['Abbonamenti', 'Subscriptions'],
  ['Prezzo abbonamento', 'Subscription price'],
  ['Generali', 'General'],
  ['Pagamenti', 'Payments'],
  ['Tasse', 'Taxes'],
  ['Notifiche', 'Notifications'],
  ['Cookie', 'Cookie'],
  ['Domini', 'Domains'],
  ['Ruoli', 'Roles'],
  ['Permessi', 'Permissions'],
  ['Activity Log', 'Activity Log'],
  ['Conferma', 'Confirm'],
  ['Annulla', 'Cancel'],
  ['Continua', 'Continue'],
  ['Riprova', 'Try again'],
  ['Operazione completata', 'Operation completed'],
  ['Errore durante il salvataggio', 'Save error'],
  ['Caricamento', 'Loading'],
  ['Nessun risultato', 'No results'],
  ['Read only', 'Read only'],
  ['Mock / logging only', 'Mock / logging only'],
  ['Provider required', 'Provider required'],
  ['Checkout support in progress', 'Checkout support in progress'],
  ['Basic configuration', 'Basic configuration'],
  ['Available in this release', 'Available in this release'],
  ['Mancante', 'Missing'],
  ['Traduzione presente', 'Translation available'],
  ['Traduzioni non disponibili.', 'Translations unavailable.'],
  ['Traduzione salvata.', 'Translation saved.'],
  ['Traduzione disattivata.', 'Translation disabled.'],
  ['undefined', ''],
  ['null', ''],
)

const ADMIN_STATIC_TRANSLATION_PATTERNS = [
  { it: /^Iniziale: (.+)$/, en: 'Initial: $1', enRegex: /^Initial: (.+)$/, itText: 'Iniziale: $1' },
  { it: /^Mercato: (.+)$/, en: 'Market: $1', enRegex: /^Market: (.+)$/, itText: 'Mercato: $1' },
  { it: /^Webhook: configurato$/, en: 'Webhook: configured', enRegex: /^Webhook: configured$/, itText: 'Webhook: configurato' },
  { it: /^Webhook: mancante\/opzionale$/, en: 'Webhook: missing/optional', enRegex: /^Webhook: missing\/optional$/, itText: 'Webhook: mancante/opzionale' },
  { it: /^\u2190 Torna ad App Hub$/, en: '\u2190 Back to App Hub', enRegex: /^\u2190 Back to App Hub$/, itText: '\u2190 Torna ad App Hub' },
  { it: /^\u2190 Torna a Catalogo$/, en: '\u2190 Back to Catalog', enRegex: /^\u2190 Back to Catalog$/, itText: '\u2190 Torna a Catalogo' },
  { it: /^\u2190 Torna a Marketing$/, en: '\u2190 Back to Marketing', enRegex: /^\u2190 Back to Marketing$/, itText: '\u2190 Torna a Marketing' },
  { it: /^\u2190 Torna a TakeOff SEO$/, en: '\u2190 Back to TakeOff SEO', enRegex: /^\u2190 Back to TakeOff SEO$/, itText: '\u2190 Torna a TakeOff SEO' },
  { it: /^\u2190 Torna a Import Export$/, en: '\u2190 Back to Import Export', enRegex: /^\u2190 Back to Import Export$/, itText: '\u2190 Torna a Import Export' },
  { it: /^\u2190 Torna a Contenuto$/, en: '\u2190 Back to Content', enRegex: /^\u2190 Back to Content$/, itText: '\u2190 Torna a Contenuto' },
]

ADMIN_STATIC_TRANSLATIONS.push(
  ['Core', 'Core'],
  ['Commerce', 'Commerce'],
  ['Growth', 'Growth'],
  ['System', 'System'],
  ['Modulo', 'Module'],
  ['Pronto', 'Ready'],
  ['Non configurato', 'Not configured'],
  ['Provider ready', 'Provider ready'],
  ['Provider richiesto per invio reale', 'Provider required for real sending'],
  ['Visualizzazioni pagina', 'Page views'],
  ['Visualizzazioni prodotto', 'Product views'],
  ['Aggiunta al carrello', 'Add to cart'],
  ['Avvio checkout', 'Checkout start'],
  ['Conversione checkout', 'Checkout conversion'],
  ['Ricavi', 'Revenue'],
  ['Vista', 'View'],
  ['Page views aggregate', 'Page views aggregate'],
  ['Product to cart', 'Product to cart'],
  ['Checkout to order', 'Checkout to order'],
  ['Pending', 'Pending'],
  ['Confirmed', 'Confirmed'],
  ['Fulfilled', 'Fulfilled'],
  ['Cancelled', 'Cancelled'],
  ['manual', 'manual'],
  ['pending', 'pending'],
  ['standard', 'standard'],
  ['unfulfilled', 'unfulfilled'],
  ['none', 'none'],
  ['Operations workflow', 'Operations workflow'],
  ['Nota spedizione', 'Shipping note'],
  ['Nota interna', 'Internal note'],
  ['Importo rimborso EUR', 'Refund amount EUR'],
  ['Nota rimborso', 'Refund note'],
  ['Refund requested', 'Refund requested'],
  ['Refund complete', 'Refund complete'],
  ['Returns / refunds', 'Returns / refunds'],
  ['Manual refund / provider required. Nessun reso collegato.', 'Manual refund / provider required. No returns linked.'],
  ['Notification log', 'Notification log'],
  ['Nessuna notifica loggata per questo ordine.', 'No notifications logged for this order.'],
  ['Righe stock', 'Stock rows'],
  ['Esaurito', 'Out of stock'],
  ['Stock basso', 'Low stock'],
  ['Nessun prodotto disponibile per l inventario.', 'No products available for inventory.'],
  ['Nessuna riga inventario corrisponde ai filtri.', 'No inventory row matches the filters.'],
  ['Variante', 'Variant'],
  ['Stock prodotto base', 'Base product stock'],
  ['Aggiorna stock', 'Update stock'],
  ['Buono', 'Good'],
  ['Richiede attenzione', 'Needs attention'],
  ['Totale contenuti', 'Total content'],
  ['Gia presente', 'Already added'],
  ['Preset consigliato', 'Recommended preset'],
  ['Fallback consigliato', 'Recommended fallback'],
  ['Configurato', 'Configured'],
  ['Configurata', 'Configured'],
  ['Rate manuale', 'Manual rate'],
)

const ADMIN_PLACEHOLDER_TRANSLATIONS = [
  ['cliente@example.com', 'customer@example.com'],
  ['Uso interno', 'Internal use'],
  ['Cerca prodotto, SKU, categoria...', 'Search product, SKU, category...'],
  ['Collezione premium', 'Premium collection'],
  ['Descrizione della collezione...', 'Collection description...'],
  ['Titolo SEO collezione', 'Collection SEO title'],
  ['Descrizione SEO...', 'SEO description...'],
  ['Cerca collezioni...', 'Search collections...'],
  ['Prodotto premium', 'Premium product'],
  ['Descrizione prodotto...', 'Product description...'],
  ['Categoria', 'Category'],
  ['Titolo SEO prodotto', 'Product SEO title'],
  ['Cerca prodotti...', 'Search products...'],
  ['Template email...', 'Email template...'],
  ['Motivo credito', 'Credit reason'],
  ['Non viene mostrato dopo il salvataggio', 'Not shown after saving'],
  ['Catalogo fornitore', 'Supplier catalog'],
  ['Cerca ordini...', 'Search orders...'],
  ['Cerca clienti...', 'Search customers...'],
  ['Inserisci la traduzione...', 'Enter translation...'],
  ['Testo policy...', 'Policy text...'],
  ['Nuovo articolo', 'New article'],
  ['Sintesi articolo', 'Article summary'],
  ['Testo articolo', 'Article text'],
  ['Team editoriale', 'Editorial team'],
  ['Titolo SEO', 'SEO title'],
  ['Descrizione SEO', 'SEO description'],
  ['Cerca articoli...', 'Search articles...'],
  ['Materiali', 'Materials'],
  ['materiali', 'materials'],
  ['Descrizione immagine', 'Image description'],
  ['Cerca media...', 'Search media...'],
  ['Chi siamo', 'About us'],
  ['chi-siamo', 'about-us'],
  ['Titolo SEO pagina', 'Page SEO title'],
  ['Sconto benvenuto', 'Welcome discount'],
  ['0 = illimitato', '0 = unlimited'],
  ['Campagna stagionale', 'Seasonal campaign'],
  ['Descrizione campagna', 'Campaign description'],
  ['Italia / EUR', 'Italy / EUR'],
  ['Note su DNS, pubblico target, fallback lingua o pricing...', 'Notes on DNS, target audience, language fallback or pricing...'],
  ['Spedizione standard', 'Standard shipping'],
  ['Consegna stimata, note operative...', 'Estimated delivery, operational notes...'],
  ['Google tags partono solo dopo consenso.', 'Google tags start only after consent.'],
  ['CNAME, TXT verification, note operative', 'CNAME, TXT verification, operational notes'],
  ['Note tecniche isolamento dati', 'Technical data isolation notes'],
  ['https://example.com/webhook', 'https://example.com/webhook'],
  ['/old-url', '/old-url'],
  ['/new-url', '/new-url'],
]

ADMIN_PLACEHOLDER_TRANSLATIONS.push(
  ['Cerca per nome, alt text o URL...', 'Search by name, alt text or URL...'],
  ['Cerca prodotto, SKU, categoria...', 'Search product, SKU, category...'],
  ['Cerca prodotto, titolo, cliente...', 'Search product, title, customer...'],
  ['Cerca ordini...', 'Search orders...'],
  ['Cerca clienti...', 'Search customers...'],
  ['Cerca collezioni...', 'Search collections...'],
  ['Cerca prodotti...', 'Search products...'],
  ['Cerca articoli...', 'Search articles...'],
  ['Cerca media...', 'Search media...'],
  ['Cerca menu...', 'Search menus...'],
  ['Cerca log...', 'Search logs...'],
  ['Inserisci un codice sconto', 'Enter a discount code'],
  ['Inserisci URL media...', 'Enter media URL...'],
  ['Aggiungi note interne...', 'Add internal notes...'],
  ['Aggiungi tracking...', 'Add tracking...'],
  ['Codice gift card', 'Gift card code'],
  ['Codice sconto', 'Discount code'],
  ['Cliente email', 'Customer email'],
  ['Saldo residuo', 'Remaining balance'],
  ['Recovery email', 'Recovery email'],
  ['Target URL', 'Target URL'],
  ['Feed fornitori', 'Supplier feeds'],
  ['Frequenza', 'Frequency'],
  ['Prezzo abbonamento', 'Subscription price'],
  ['Trial days', 'Trial days'],
)

let adminStaticTranslationQueued = false
let adminStaticTranslationRunning = false
const adminRuntimeTranslationMapCache = new Map()

function normalizeAdminRuntimeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ')
}

function getAdminPairMap(pairs, cacheName) {
  const language = getAdminLanguage()
  const cacheKey = `${cacheName}:${language}`
  if (adminRuntimeTranslationMapCache.has(cacheKey)) return adminRuntimeTranslationMapCache.get(cacheKey)

  const sourceIndex = language === 'en' ? 0 : 1
  const targetIndex = language === 'en' ? 1 : 0
  const map = new Map(pairs.map((pair) => [pair[sourceIndex], pair[targetIndex]]))
  adminRuntimeTranslationMapCache.set(cacheKey, map)
  return map
}

function getAdminStaticTranslation(text) {
  const normalized = normalizeAdminRuntimeText(text)
  if (!normalized) return null
  if (/^(undefined|null)$/i.test(normalized)) return ''

  const language = getAdminLanguage()
  const copyMap = getAdminPairMap(ADMIN_STATIC_TRANSLATIONS, 'static')
  if (copyMap.has(normalized)) return copyMap.get(normalized)

  for (const pattern of ADMIN_STATIC_TRANSLATION_PATTERNS) {
    if (language === 'en' && pattern.it.test(normalized)) return normalized.replace(pattern.it, pattern.en)
    if (language === 'it' && pattern.enRegex.test(normalized)) {
      return normalized.replace(pattern.enRegex, pattern.itText)
    }
  }

  return null
}

function adminUiText(text, fallback = text) {
  const translated = getAdminStaticTranslation(text)
  if (translated !== null && translated !== undefined) return translated

  const safeFallback =
    fallback === null || fallback === undefined || typeof fallback === 'object' ? '' : String(fallback)
  const safeText = text === null || text === undefined || typeof text === 'object' ? safeFallback : String(text)
  return safeText || safeFallback
}

function adminUiHtml(text, fallback = text) {
  return escapeHtml(adminUiText(text, fallback))
}

function setAdminUiText(element, text, fallback = text) {
  if (!element) return
  element.textContent = adminUiText(text, fallback)
}

function shouldSkipAdminRuntimeElement(element) {
  if (!element) return true
  return Boolean(
    element.closest(
      '[data-admin-no-translate], [contenteditable="true"], script, style, noscript, pre, code',
    ),
  )
}

function setAdminTranslatedText(element, value) {
  if (!element || value === null || value === undefined) return
  const text = String(value)
  if (element.textContent !== text) element.textContent = text
}

function translateAdminDataI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    if (shouldSkipAdminRuntimeElement(element)) return
    setAdminTranslatedText(
      element,
      t(element.dataset.i18n, element.getAttribute('data-i18n-fallback') || element.textContent),
    )
  })

  root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    if (shouldSkipAdminRuntimeElement(element)) return
    const translated = t(
      element.dataset.i18nPlaceholder,
      element.getAttribute('data-i18n-placeholder-fallback') || element.getAttribute('placeholder') || '',
    )
    if (translated) element.setAttribute('placeholder', translated)
  })

  root.querySelectorAll('[data-i18n-title]').forEach((element) => {
    if (shouldSkipAdminRuntimeElement(element)) return
    const translated = t(
      element.dataset.i18nTitle,
      element.getAttribute('data-i18n-title-fallback') || element.getAttribute('title') || '',
    )
    if (translated) element.setAttribute('title', translated)
  })

  root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    if (shouldSkipAdminRuntimeElement(element)) return
    const translated = t(
      element.dataset.i18nAriaLabel,
      element.getAttribute('data-i18n-aria-label-fallback') || element.getAttribute('aria-label') || '',
    )
    if (translated) element.setAttribute('aria-label', translated)
  })
}

function translateDynamicText() {
  const roots = [adminAuthGate, adminApp].filter(Boolean)
  const ignoredParents = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'PRE', 'CODE'])

  roots.forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const textNodes = []
    let node = walker.nextNode()
    while (node) {
      textNodes.push(node)
      node = walker.nextNode()
    }

    textNodes.forEach((textNode) => {
      const parentName = textNode.parentElement?.tagName
      if (!parentName || ignoredParents.has(parentName)) return
      if (shouldSkipAdminRuntimeElement(textNode.parentElement)) return

      const original = textNode.nodeValue || ''
      const trimmed = original.trim().replace(/\s+/g, ' ')
      if (!trimmed) return

      const translated = getAdminStaticTranslation(trimmed)
      if (translated === null || translated === undefined || translated === trimmed) return

      const leading = original.match(/^\s*/)?.[0] || ''
      const trailing = original.match(/\s*$/)?.[0] || ''
      textNode.nodeValue = `${leading}${translated}${trailing}`
    })
  })
}

function translatePlaceholders() {
  const placeholderMap = getAdminPairMap(ADMIN_PLACEHOLDER_TRANSLATIONS, 'placeholder')

  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((element) => {
    if (shouldSkipAdminRuntimeElement(element)) return
    if (element.dataset.i18nPlaceholder) return

    const placeholder = element.getAttribute('placeholder') || ''
    const normalized = normalizeAdminRuntimeText(placeholder)
    const translated = placeholderMap.has(normalized)
      ? placeholderMap.get(normalized)
      : getAdminStaticTranslation(normalized)

    if (translated !== null && translated !== undefined && translated !== placeholder) {
      element.setAttribute('placeholder', translated)
    }
  })
}

function translateButtons() {
  document
    .querySelectorAll('input[type="button"][value], input[type="submit"][value], input[type="reset"][value]')
    .forEach((element) => {
      if (shouldSkipAdminRuntimeElement(element)) return
      const value = element.getAttribute('value') || ''
      const translated = getAdminStaticTranslation(value)
      if (translated !== null && translated !== undefined && translated !== value) {
        element.setAttribute('value', translated)
      }
    })
}

function translateStatusBadges() {
  document
    .querySelectorAll(
      '.status-badge, .mini-card-status, .translation-status-pill, .admin-current-view, .admin-auth-message',
    )
    .forEach((element) => {
      if (shouldSkipAdminRuntimeElement(element)) return
      const text = normalizeAdminRuntimeText(element.textContent)
      const translated = getAdminStaticTranslation(text)
      if (translated !== null && translated !== undefined && translated !== text) {
        setAdminTranslatedText(element, translated)
      }
    })
}

function translateAdminAttributes() {
  document.querySelectorAll('[title], [aria-label]').forEach((element) => {
    if (shouldSkipAdminRuntimeElement(element)) return

    ;['title', 'aria-label'].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return
      if (attribute === 'title' && element.dataset.i18nTitle) return
      if (attribute === 'aria-label' && element.dataset.i18nAriaLabel) return

      const value = element.getAttribute(attribute) || ''
      const translated = getAdminStaticTranslation(value)
      if (translated !== null && translated !== undefined && translated !== value) {
        element.setAttribute(attribute, translated)
      }
    })
  })
}

function translateAdminUI() {
  if (adminStaticTranslationRunning) return
  adminStaticTranslationRunning = true
  translateAdminDataI18n()
  translateDynamicText()
  translatePlaceholders()
  translateButtons()
  translateStatusBadges()
  translateAdminAttributes()
  adminStaticTranslationRunning = false
}

function translateAdminStaticCopy() {
  translateAdminUI()
}

function applyAdminLanguage() {
  applyAdminTranslations()
}

function queueAdminStaticTranslation() {
  if (adminStaticTranslationQueued) return
  adminStaticTranslationQueued = true
  window.setTimeout(() => {
    adminStaticTranslationQueued = false
    translateAdminStaticCopy()
  }, 40)
}

function setupAdminStaticTranslationObserver() {
  const roots = [adminAuthGate, adminApp].filter(Boolean)
  if (!roots.length || !window.MutationObserver) return

  const observer = new MutationObserver(() => queueAdminStaticTranslation())
  roots.forEach((root) => {
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        'aria-label',
        'data-i18n',
        'data-i18n-aria-label',
        'data-i18n-placeholder',
        'data-i18n-title',
        'placeholder',
        'title',
        'value',
      ],
    })
  })
}

function setupAdminAlertTranslation() {
  if (!window.alert || window.__takeoffAlertTranslationReady) return
  const nativeAlert = window.alert.bind(window)
  window.alert = (message) => {
    if (typeof message !== 'string') {
      nativeAlert(message)
      return
    }
    const normalized = message.trim().replace(/\s+/g, ' ')
    nativeAlert(getAdminStaticTranslation(normalized) || message)
  }
  window.__takeoffAlertTranslationReady = true
}

function applyAdminTranslations() {
  const language = getAdminLanguage()
  document.documentElement.lang = language
  document.title = adminT('documentTitle')

  document.querySelectorAll('[data-admin-language-select]').forEach((select) => {
    select.value = language
    select.setAttribute('aria-label', adminT('languageAriaLabel'))
  })

  setAdminText('.admin-language-control span', 'languageLabel')
  setAdminText('.auth-eyebrow', 'authEyebrow')
  setAdminText('.admin-auth-card h1', 'authTitle')
  setAdminText('#adminLoginForm label:nth-of-type(1)', 'authEmail')
  setAdminText('#adminLoginForm label:nth-of-type(2)', 'authPassword')
  setAdminText('#adminBootstrapForm label:nth-of-type(1)', 'authNameOwner')
  setAdminText('#adminBootstrapForm label:nth-of-type(2)', 'authEmailOwner')
  setAdminText('#adminBootstrapForm label:nth-of-type(3)', 'authPassword')
  setAdminText('#adminLoginForm button[type="submit"]', 'authLoginButton')
  setAdminText('#adminBootstrapForm button[type="submit"]', 'authBootstrapButton')
  setAdminText('#adminLogoutButton', 'logout')
  setAdminText('.admin-entry-kicker', 'entryClaim')
  setAdminText('.admin-entry-content h1', 'entryTitle')
  setAdminText('.admin-entry-content h2', 'entrySubtitle')
  setAdminText('#adminEntryCountdownLabel', 'entryCountdown')
  setAdminText('#adminEntryEnterButton', 'entryButton')
  setAdminText('.hero.admin-hero p', 'heroEyebrow')
  setAdminText('.hero.admin-hero h1', 'heroTitle')
  setAdminText('.hero.admin-hero span', 'heroText')
  setAdminText('#exportDataButton', 'prepareExport')
  setAdminText('#importProductsButton', 'validateImport')
  setAdminText('#downloadTemplateButton', 'downloadTemplate')
  setAdminText('#exportTranslationPackageButton', 'exportTranslationPackage')
  setAdminText('#importTranslationPackageButton', 'importTranslationPackage')
  setAdminText('#exportSitePackageButton', 'exportSitePackage')
  setAdminText('#refreshImportExportHistoryButton', 'refreshHistory')
  setAdminText('.media-picker-trigger', 'mediaPickerButton')
  setAdminText('.media-picker-title', 'mediaPickerTitle')
  setAdminText('.media-picker-close', 'mediaPickerClose')
  setAdminText('.media-picker-help', 'mediaPickerManualFallback')
  setAdminPlaceholder('#mediaPickerSearch', 'mediaPickerSearch')

  const navTranslations = [
    ['#dashboard', 'navDashboard', 'navDashboardDesc'],
    ['#editor', 'navEditor', 'navEditorDesc'],
    ['#catalogo', 'navCatalog', 'navCatalogDesc'],
    ['#ordini', 'navOrders', 'navOrdersDesc'],
    ['#clienti', 'navCustomers', 'navCustomersDesc'],
    ['#contenuto', 'navContent', 'navContentDesc'],
    ['#marketing', 'navMarketing', 'navMarketingDesc'],
    ['#markets', 'navMarkets', 'navMarketsDesc'],
    ['#analisi', 'navAnalytics', 'navAnalyticsDesc'],
    ['#checkout', 'navCheckout', 'navCheckoutDesc'],
    ['#impostazioni', 'navSettings', 'navSettingsDesc'],
    ['#apps', 'navApps', 'navAppsDesc'],
    ['#google-suite', 'navGoogleSuite', 'navGoogleSuiteDesc'],
    ['#media', 'navMediaLibrary', 'navMediaLibraryDesc'],
    ['#import-export', 'navImportExport', 'navImportExportDesc'],
    ['#traduzioni', 'navTranslations', 'navTranslationsDesc'],
    ['#utenti', 'navUsers', 'navUsersDesc'],
    ['#performance', 'navPerformance', 'navPerformanceDesc'],
  ]

  navTranslations.forEach(([href, titleKey, descKey]) => {
    setAdminText(`.hub-card[href="${href}"] strong`, titleKey)
    setAdminText(`.hub-card[href="${href}"] small`, descKey)
  })

  const viewTranslations = [
    ['editor', 'editorTitle', 'editorDesc'],
    ['catalogo', 'catalogTitle', 'catalogDesc'],
    ['prodotti', 'productsTitle'],
    ['collezioni', 'collectionsTitle'],
    ['ordini', 'ordersTitle'],
    ['clienti', 'customersTitle'],
    ['contenuto', 'contentTitle'],
    ['media', 'mediaTitle'],
    ['blog-admin', 'blogTitle'],
    ['policy', 'policyTitle'],
    ['traduzioni', 'translationsTitle'],
    ['marketing', 'marketingTitle'],
    ['markets', 'marketsTitle'],
    ['analisi', 'analyticsTitle'],
    ['checkout', 'checkoutTitle'],
    ['impostazioni', 'settingsTitle'],
    ['utenti', 'usersTitle'],
    ['performance', 'performanceTitle'],
    ['apps', 'appsTitle', 'appsDesc'],
    ['google-suite', 'googleSuiteTitle', 'googleSuiteDesc'],
    ['import-export', 'importExportTitle', 'importExportDesc'],
  ]

  viewTranslations.forEach(([view, titleKey, descKey]) => {
    const viewElement = document.querySelector(`[data-admin-view="${view}"]`)
    const title = viewElement?.querySelector('.section-title h2, .view-heading h2')
    const subtitle = viewElement?.querySelector('.section-subtitle')

    if (title) title.textContent = adminT(titleKey)
    if (subtitle && descKey) subtitle.textContent = adminT(descKey)
  })

  document.querySelectorAll('.status-badge').forEach((badge) => {
    const text = badge.textContent.trim().toLowerCase()
    if (text === 'operativo' || text === 'operational') badge.textContent = adminT('statusOperational')
    if (text === 'area') badge.textContent = adminT('statusArea')
    if (text === 'configurazione base' || text === 'base configuration') badge.textContent = adminT('statusBaseConfig')
    if (text === 'in sviluppo' || text === 'in development') badge.textContent = adminT('statusDevelopment')
  })

  document.querySelectorAll('.mini-card-status').forEach((badge) => {
    const text = badge.textContent.trim().toLowerCase()
    if (text === 'configurazione base' || text === 'base configuration') badge.textContent = adminT('statusBaseConfig')
    if (text === 'in sviluppo' || text === 'in development') badge.textContent = adminT('statusDevelopment')
  })

  const auditBadge = document.querySelector('#adminAuditBadge')
  if (auditBadge) auditBadge.textContent = adminT('auditBadge')

  translateAdminUI()
  applyAdminTheme()
  updateAdminAuthIntro()
  updateAdminCurrentViewLabel()
  applyAdminDemoModeUi()
}

function setupAdminLanguageControls() {
  document.querySelectorAll('[data-admin-language-select]').forEach((select) => {
    select.value = getAdminLanguage()
    select.addEventListener('change', () => setAdminLanguage(select.value))
  })
}

function setupAdminThemeControls() {
  applyAdminTheme()
  adminThemeToggle?.addEventListener('click', () => {
    setAdminTheme(getAdminTheme() === 'light' ? 'dark' : 'light')
  })
}

function getAdminAuditMessage() {
  return adminT('auditMessage')
}

function updateAdminAuthIntro() {
  if (!adminAuthIntro || adminAuthGate?.hidden) return
  const state = adminAuthGate?.dataset.authState || 'login'
  if (state === 'migration') {
    adminAuthIntro.textContent = adminT('authMigrationIntro')
    return
  }
  if (adminBootstrapForm && !adminBootstrapForm.hidden) {
    adminAuthIntro.textContent = adminT('authBootstrapIntro')
    return
  }
  adminAuthIntro.textContent = adminT('authLoginIntro')
}

function updateAdminCurrentViewLabel() {
  if (!adminCurrentView) return
  const activeView = getActiveAdminViewId()
  const target = adminViewRegistry.get(activeView) || document.querySelector(`[data-admin-view="${activeView}"]`)
  const heading = target?.querySelector('h2')?.textContent?.trim()
  if (heading) adminCurrentView.textContent = heading
}

setupAdminLanguageControls()
setupAdminThemeControls()
setupAdminStaticTranslationObserver()
setupAdminAlertTranslation()
applyAdminTranslations()

let adminCurrentUser = null
let adminAllowProtectedFetches = false
let adminAuditObserver = null
let adminEntryCountdownTimer = null
let adminEntryCountdownInterval = null

function isProtectedAdminRequest(resource) {
  const rawUrl = typeof resource === 'string' ? resource : resource?.url || ''

  try {
    const url = new URL(rawUrl, window.location.origin)
    return (
      url.origin === window.location.origin &&
      url.pathname.startsWith('/api/admin/') &&
      !url.pathname.startsWith('/api/admin/auth/')
    )
  } catch {
    return false
  }
}

function localAdminAuthResponse(message = 'Login admin richiesto.', status = 401) {
  return new Response(
    JSON.stringify({
      success: false,
      authenticated: false,
      message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

function localAdminAuditResponse() {
  return new Response(
    JSON.stringify({
      success: false,
      message: getAdminAuditMessage(),
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

function isReadMethod(method = 'GET') {
  return ['GET', 'HEAD', 'OPTIONS'].includes(String(method || 'GET').toUpperCase())
}

function getRequestMethod(resource, options = {}) {
  if (options?.method) return options.method
  if (resource instanceof Request) return resource.method || 'GET'
  return 'GET'
}

function isAdminAuditMode() {
  return adminCurrentUser?.audit_mode === true
}

function getAdminRole() {
  return adminCurrentUser?.role || 'viewer'
}

function adminHasRole(roles = []) {
  return roles.includes(getAdminRole())
}

function canAdminManageUsers() {
  return adminHasRole(['owner'])
}

function canAdminViewSensitiveSettings() {
  return adminHasRole(['owner'])
}

function showAdminPermissionNotice(message = 'Permessi insufficienti.') {
  if (!adminSessionBar) return

  let notice = document.querySelector('#adminPermissionNotice')

  if (!notice) {
    notice = document.createElement('p')
    notice.id = 'adminPermissionNotice'
    notice.className = 'admin-permission-notice'
    adminSessionBar.appendChild(notice)
  }

  notice.textContent = message
}

function ensureAdminAuditBadge() {
  if (!adminSessionBar) return null

  let badge = document.querySelector('#adminAuditBadge')

  if (!badge) {
    badge = document.createElement('strong')
    badge.id = 'adminAuditBadge'
    badge.className = 'admin-audit-badge'
    badge.textContent = adminT('auditBadge')
    adminSessionBar.appendChild(badge)
  }

  return badge
}

function isAuditMutationControl(button) {
  if (!button) return false
  if (button.id === 'exportDataButton') return false
  if (button.id?.startsWith('refresh')) return false

  const text = button.textContent || ''
  const mutationText = /(salva|crea|elimina|disattiva|importa|upload|carica|aggiungi|rimuovi|bozza|valida import)/i

  return (
    button.type === 'submit' ||
    button.id === 'adminLogoutButton' ||
    button.id === 'importProductsButton' ||
    button.id === 'addVariantButton' ||
    button.id === 'saveSectionButton' ||
    button.id === 'saveThemeSettingsButton' ||
    button.matches(
      [
        '[data-delete-collection]',
        '[data-disable]',
        '[data-delete-media]',
        '[data-remove-variant]',
        '[data-unpublish-blog]',
        '[data-unpublish-policy]',
        '[data-disable-campaign]',
        '[data-delete-menu-item]',
        '[data-delete-section]',
        '[data-remove-section]',
      ].join(', '),
    ) ||
    mutationText.test(text)
  )
}

function applyAdminAuditUi() {
  const auditMode = isAdminAuditMode()
  document.body.dataset.adminAuditMode = auditMode ? 'true' : 'false'

  const badge = ensureAdminAuditBadge()
  if (badge) badge.hidden = !auditMode

  document.querySelectorAll('button').forEach((button) => {
    if (!isAuditMutationControl(button)) return

    button.disabled = auditMode
    button.classList.toggle('audit-disabled', auditMode)
    if (auditMode) {
      button.title = getAdminAuditMessage()
      button.dataset.auditDisabled = 'true'
    } else if (button.dataset.auditDisabled === 'true') {
      button.title = ''
      delete button.dataset.auditDisabled
    }
  })

  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.disabled = auditMode
    input.classList.toggle('audit-disabled', auditMode)
  })
}

function startAdminAuditObserver() {
  if (adminAuditObserver || !adminApp) return

  adminAuditObserver = new MutationObserver(() => {
    if (isAdminAuditMode()) {
      window.requestAnimationFrame(applyAdminAuditUi)
    }
  })

  adminAuditObserver.observe(adminApp, {
    childList: true,
    subtree: true,
  })
}

function applyAdminPermissionUi() {
  document.body.dataset.adminRole = getAdminRole()

  const canManageUsers = canAdminManageUsers()
  const canViewSettings = canAdminViewSensitiveSettings()

  if (adminUserForm) adminUserForm.hidden = !canManageUsers
  if (refreshAdminUsersButton) refreshAdminUsersButton.disabled = !canManageUsers

  if (themeSettingsButton) {
    themeSettingsButton.disabled = !canViewSettings
    themeSettingsButton.title = canViewSettings
      ? ''
      : 'Permessi insufficienti per modificare impostazioni sensibili.'
  }

  applyAdminAuditUi()
}

window.fetch = async (resource, options) => {
  const protectedAdminRequest = isProtectedAdminRequest(resource)
  const requestMethod = getRequestMethod(resource, options)

  if (protectedAdminRequest && !adminAllowProtectedFetches) {
    return localAdminAuthResponse()
  }

  if (protectedAdminRequest && isAdminAuditMode() && !isReadMethod(requestMethod)) {
    showAdminPermissionNotice(getAdminAuditMessage())
    return localAdminAuditResponse()
  }

  const response = await nativeFetch(resource, options)

  if (protectedAdminRequest && response.status === 401 && !ADMIN_DEMO_MODE) {
    showAdminLogin('Sessione scaduta. Effettua di nuovo il login.')
  }

  if (protectedAdminRequest && response.status === 403) {
    response
      .clone()
      .json()
      .then((data) => {
        showAdminPermissionNotice(data.message || adminUiText('Permessi insufficienti.'))
      })
      .catch(() => {
        showAdminPermissionNotice()
      })
  }

  return response
}

document.addEventListener(
  'submit',
  (event) => {
    if (!isAdminAuditMode() || !event.target.closest('#adminApp')) return

    event.preventDefault()
    event.stopImmediatePropagation()
    showAdminPermissionNotice(getAdminAuditMessage())
  },
  true,
)

document.addEventListener(
  'click',
  (event) => {
    if (!isAdminAuditMode()) return

    const button = event.target.closest('button')
    if (!button || !isAuditMutationControl(button)) return

    event.preventDefault()
    event.stopImmediatePropagation()
    showAdminPermissionNotice(getAdminAuditMessage())
  },
  true,
)

adminEntryEnterButton?.addEventListener('click', hideAdminEntryScreen)

function setAdminAuthMessage(message = '', isError = false) {
  if (!adminAuthMessage) return
  adminAuthMessage.textContent = message
  adminAuthMessage.classList.toggle('is-error', isError)
}

function showAdminAuthGate({ bootstrap = false, migration = false, message = '' } = {}) {
  if (ADMIN_DEMO_MODE) {
    showAdminApp(ADMIN_DEMO_USER)
    return
  }

  adminAllowProtectedFetches = false
  adminCurrentUser = null

  if (adminEntryScreen) adminEntryScreen.hidden = true
  if (adminApp) adminApp.hidden = true
  if (adminAuthGate) adminAuthGate.hidden = false
  if (adminAuthGate) {
    adminAuthGate.dataset.authState = migration ? 'migration' : bootstrap ? 'bootstrap' : 'login'
  }
  if (adminLoginForm) adminLoginForm.hidden = bootstrap || migration
  if (adminBootstrapForm) adminBootstrapForm.hidden = !bootstrap || migration

  if (adminAuthIntro) {
    adminAuthIntro.textContent = migration
      ? adminT('authMigrationIntro')
      : bootstrap
        ? adminT('authBootstrapIntro')
        : adminT('authLoginIntro')
  }

  setAdminAuthMessage(message, Boolean(migration))
}

function showAdminLogin(message = '') {
  if (ADMIN_DEMO_MODE) {
    showAdminApp(ADMIN_DEMO_USER)
    return
  }

  showAdminAuthGate({ message })
}

function hideAdminEntryScreen() {
  if (!adminEntryScreen) return
  if (adminEntryCountdownTimer) window.clearTimeout(adminEntryCountdownTimer)
  if (adminEntryCountdownInterval) window.clearInterval(adminEntryCountdownInterval)
  adminEntryCountdownTimer = null
  adminEntryCountdownInterval = null
  adminEntryScreen.hidden = true
  adminEntryScreen.classList.remove('is-visible')
  try {
    sessionStorage.setItem(ADMIN_ENTRY_STORAGE_KEY, '1')
  } catch {}
}

function shouldShowAdminEntryScreen() {
  try {
    return sessionStorage.getItem(ADMIN_ENTRY_STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

function showAdminEntryScreen() {
  if (!adminEntryScreen || !shouldShowAdminEntryScreen()) return

  if (adminEntryCountdownTimer) window.clearTimeout(adminEntryCountdownTimer)
  if (adminEntryCountdownInterval) window.clearInterval(adminEntryCountdownInterval)

  let secondsLeft = ADMIN_ENTRY_DURATION_SECONDS
  if (adminEntryCountdownNumber) adminEntryCountdownNumber.textContent = String(secondsLeft)
  if (adminEntryCountdownLabel) adminEntryCountdownLabel.textContent = adminT('entryCountdown')

  adminEntryScreen.hidden = false
  window.requestAnimationFrame(() => {
    adminEntryScreen.classList.add('is-visible')
  })

  adminEntryCountdownInterval = window.setInterval(() => {
    secondsLeft = Math.max(1, secondsLeft - 1)
    if (adminEntryCountdownNumber) adminEntryCountdownNumber.textContent = String(secondsLeft)
  }, 1000)

  adminEntryCountdownTimer = window.setTimeout(() => {
    if (!adminEntryScreen.hidden) hideAdminEntryScreen()
  }, ADMIN_ENTRY_DURATION_SECONDS * 1000)
}

function applyAdminDemoModeUi() {
  if (!ADMIN_DEMO_MODE) return

  if (adminAuthGate) adminAuthGate.hidden = true
  if (adminEntryScreen) adminEntryScreen.hidden = true
  if (adminLogoutButton) {
    adminLogoutButton.textContent = 'Demo mode'
    adminLogoutButton.disabled = true
    adminLogoutButton.setAttribute('aria-disabled', 'true')
  }
}

function showAdminApp(user) {
  adminCurrentUser = user
  adminAllowProtectedFetches = true

  hideAdminEntryScreen()
  if (adminAuthGate) adminAuthGate.hidden = true
  if (adminApp) adminApp.hidden = false
  if (adminSessionName) adminSessionName.textContent = user?.name || user?.email || 'Admin'
  if (adminSessionRole) adminSessionRole.textContent = user?.role || 'viewer'
  applyAdminDemoModeUi()

  applyAdminPermissionUi()
  startAdminAuditObserver()
  applyAdminAuditUi()
  showAdminEntryScreen()
}

function refreshAdminDataAfterAuth() {
  rerenderActiveAdminView()
}

const ADMIN_ROUTE_TO_VIEW = {
  dashboard: 'dashboard',
  website: 'website',
  'website/editor': 'editor',
  'website/pages': 'pagine',
  'website/menus': 'menu',
  'website/theme': 'editor',
  'website/header-footer': 'menu',
  'website/media': 'media',
  'website/blog': 'blog-admin',
  'website/policies': 'policy',
  'website/metaobjects': 'metaobjects',
  catalog: 'catalogo',
  catalogo: 'catalogo',
  'catalog/products': 'prodotti',
  'catalog/collections': 'collezioni',
  'catalog/inventory': 'inventario',
  'catalog/variants': 'prodotti',
  'catalog/metafields': 'metafields',
  commerce: 'commerce',
  'commerce/orders': 'ordini',
  'commerce/customers': 'clienti',
  'commerce/checkout': 'checkout',
  'commerce/payments': 'checkout-payments',
  'commerce/shipping': 'checkout-shipping',
  'commerce/taxes': 'checkout-taxes',
  'commerce/returns': 'returns',
  'commerce/gift-cards': 'gift-cards',
  'commerce/store-credit': 'gift-cards',
  growth: 'growth',
  'growth/marketing': 'marketing',
  'growth/campaigns': 'marketing-campaigns',
  'growth/discounts': 'marketing-discounts',
  'growth/coupons': 'marketing-coupons',
  'growth/newsletter': 'marketing-newsletter',
  'growth/seo': 'seo',
  'growth/seo-technical': 'seo-technical',
  'growth/analytics': 'analytics-dashboard',
  'growth/analytics/traffic': 'analytics-traffic',
  'growth/analytics/sales': 'analytics-sales',
  'growth/analytics/products': 'analytics-products',
  'growth/analytics/conversions': 'analytics-conversions',
  'growth/analytics/events': 'analytics-events',
  'growth/google-suite': 'google-suite',
  'growth/search-filters': 'search-filters',
  'growth/product-feed': 'product-feeds',
  'growth/advanced-discounts': 'advanced-discounts',
  'growth/abandoned-cart': 'abandoned-carts',
  markets: 'markets',
  'markets/markets': 'markets-mercati',
  'markets/countries': 'markets-paesi',
  'markets/languages': 'markets-lingue',
  'markets/currencies': 'markets-valute',
  'markets/prices': 'markets-prezzi',
  tools: 'takeoff-tools',
  'takeoff-tools': 'takeoff-tools',
  'tools/import-export': 'import-export',
  'tools/backup': 'backup',
  'tools/translations': 'traduzioni',
  'tools/supplier-feeds': 'supplier-feeds',
  'tools/store-health': 'store-health',
  'tools/launch-checklist': 'launch-checklist',
  'tools/dataflow': 'import-export',
  'tools/import-history': 'import-export',
  apps: 'apps',
  'apps/reviews': 'reviews',
  'apps/email-automations': 'email-automations',
  'apps/upsell-bundles': 'upsells',
  'apps/abandoned-cart': 'abandoned-carts',
  'apps/customer-accounts': 'customer-accounts',
  'apps/webhooks': 'webhooks',
  'apps/gdpr-cookie': 'gdpr-cookie',
  'apps/subscriptions': 'subscriptions',
  settings: 'impostazioni',
  impostazioni: 'impostazioni',
  'settings/general': 'settings-general',
  'settings/users': 'utenti',
  'settings/domains': 'domini',
  'settings/privacy': 'privacy-settings',
  'settings/cookies': 'cookie-settings',
  'settings/notifications': 'notifiche',
  'settings/integrations': 'integrazioni',
  'settings/metafields': 'metafields',
  'settings/multi-client': 'tenants',
  'settings/activity-log': 'activity',
  'settings/performance': 'performance',
  'settings/import-export': 'settings-import-export',
}

const ADMIN_VIEW_TO_ROUTE = {
  dashboard: 'dashboard',
  website: 'website',
  editor: 'website/editor',
  pagine: 'website/pages',
  menu: 'website/menus',
  media: 'website/media',
  'blog-admin': 'website/blog',
  policy: 'website/policies',
  metaobjects: 'website/metaobjects',
  contenuto: 'website',
  catalogo: 'catalog',
  prodotti: 'catalog/products',
  collezioni: 'catalog/collections',
  inventario: 'catalog/inventory',
  commerce: 'commerce',
  ordini: 'commerce/orders',
  clienti: 'commerce/customers',
  checkout: 'commerce/checkout',
  'checkout-settings': 'commerce/checkout',
  'checkout-payments': 'commerce/payments',
  'checkout-shipping': 'commerce/shipping',
  'checkout-taxes': 'commerce/taxes',
  'checkout-confirmation': 'commerce/checkout',
  returns: 'commerce/returns',
  'gift-cards': 'commerce/gift-cards',
  growth: 'growth',
  marketing: 'growth/marketing',
  'marketing-campaigns': 'growth/campaigns',
  'marketing-discounts': 'growth/discounts',
  'marketing-coupons': 'growth/coupons',
  'marketing-newsletter': 'growth/newsletter',
  seo: 'growth/seo',
  'seo-technical': 'growth/seo-technical',
  analisi: 'growth/analytics',
  'analytics-dashboard': 'growth/analytics',
  'analytics-traffic': 'growth/analytics/traffic',
  'analytics-sales': 'growth/analytics/sales',
  'analytics-products': 'growth/analytics/products',
  'analytics-conversions': 'growth/analytics/conversions',
  'analytics-events': 'growth/analytics/events',
  'google-suite': 'growth/google-suite',
  'search-filters': 'growth/search-filters',
  'product-feeds': 'growth/product-feed',
  'advanced-discounts': 'growth/advanced-discounts',
  'abandoned-carts': 'apps/abandoned-cart',
  markets: 'markets',
  'markets-mercati': 'markets/markets',
  'markets-paesi': 'markets/countries',
  'markets-lingue': 'markets/languages',
  'markets-valute': 'markets/currencies',
  'markets-prezzi': 'markets/prices',
  'takeoff-tools': 'tools',
  'import-export': 'tools/import-export',
  backup: 'tools/backup',
  traduzioni: 'tools/translations',
  'supplier-feeds': 'tools/supplier-feeds',
  'store-health': 'tools/store-health',
  'launch-checklist': 'tools/launch-checklist',
  apps: 'apps',
  reviews: 'apps/reviews',
  'email-automations': 'apps/email-automations',
  upsells: 'apps/upsell-bundles',
  'customer-accounts': 'apps/customer-accounts',
  webhooks: 'apps/webhooks',
  'gdpr-cookie': 'apps/gdpr-cookie',
  subscriptions: 'apps/subscriptions',
  impostazioni: 'settings',
  'settings-general': 'settings/general',
  utenti: 'settings/users',
  domini: 'settings/domains',
  'privacy-settings': 'settings/privacy',
  'cookie-settings': 'settings/cookies',
  notifiche: 'settings/notifications',
  integrazioni: 'settings/integrations',
  metafields: 'settings/metafields',
  tenants: 'settings/multi-client',
  activity: 'settings/activity-log',
  performance: 'settings/performance',
  'settings-import-export': 'settings/import-export',
}

const ADMIN_PRIMARY_ROUTE_KEYS = {
  dashboard: 'navDashboard',
  website: 'navWebsite',
  catalog: 'navCatalog',
  commerce: 'navCommerce',
  growth: 'navGrowth',
  markets: 'navMarkets',
  tools: 'navTakeOffTools',
  apps: 'navApps',
  settings: 'navSettings',
}

let adminViewRegistry = new Map()

function normalizeAdminRoutePath(rawHash = window.location.hash) {
  let raw = String(rawHash || '')
    .replace(/^#/, '')
    .trim()

  if (!raw) return 'dashboard'
  if (raw.startsWith('/')) raw = raw.slice(1)
  raw = raw.replace(/^\/+|\/+$/g, '').toLowerCase()

  if (!raw) return 'dashboard'
  if (ADMIN_VIEW_TO_ROUTE[raw]) return ADMIN_VIEW_TO_ROUTE[raw]
  if (ADMIN_ROUTE_TO_VIEW[raw]) return raw
  return 'dashboard'
}

function getAdminViewForRoute(routePath = normalizeAdminRoutePath()) {
  return ADMIN_ROUTE_TO_VIEW[routePath] || 'dashboard'
}

function getAdminRouteForView(viewId = 'dashboard') {
  return ADMIN_VIEW_TO_ROUTE[viewId] || 'dashboard'
}

function getAdminRouteHashForView(viewId = 'dashboard') {
  return `#/${getAdminRouteForView(viewId)}`
}

function getCanonicalAdminHref(href = '') {
  if (!href.startsWith('#')) return ''
  const path = normalizeAdminRoutePath(href)
  return `#/${path}`
}

function upgradeAdminRouteLinks(scope = document) {
  scope.querySelectorAll?.('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href') || ''
    const canonical = getCanonicalAdminHref(href)
    if (canonical && canonical !== href) link.setAttribute('href', canonical)
  })
}

function getAdminPrimaryRouteForView(viewId = 'dashboard') {
  const route = getAdminRouteForView(viewId)
  return route.split('/')[0] || 'dashboard'
}

function getActiveAdminViewId() {
  return getAdminViewForRoute(normalizeAdminRoutePath())
}

function runAdminViewLoader(loader) {
  try {
    if (typeof loader === 'function') loader()
  } catch {}
}

function rerenderActiveAdminView() {
  if (!adminApp || adminApp.hidden) return

  const activeView = getActiveAdminViewId()
  const loadersByView = {
    dashboard: [loadProducts, loadOrders],
    website: [loadEditorPages, loadMediaItems],
    editor: [loadEditorPages, loadSections, loadThemeSettings],
    catalogo: [loadProducts, loadCollections],
    prodotti: [loadProducts],
    inventario: [loadProducts],
    collezioni: [loadCollections],
    commerce: [loadOperationsSummary, loadCustomerAccountsSummary],
    ordini: [loadOrders, loadOperationsSummary],
    clienti: [loadCustomers, loadCustomerAccountsSummary],
    contenuto: [],
    media: [loadMediaItems],
    'blog-admin': [loadBlogPosts],
    policy: [loadPoliciesAdmin],
    pagine: [loadPages],
    menu: [loadMenuResources, loadMenus],
    traduzioni: [loadTranslationManager],
    metaobjects: [loadMetaobjects],
    growth: [loadAnalyticsDashboard],
    marketing: [loadDiscounts, loadCampaigns],
    sconti: [loadDiscounts],
    campagne: [loadCampaigns],
    markets: [loadMarketsAdmin, loadLocalizedPricingAdmin],
    'markets-mercati': [loadMarketsAdmin, loadLocalizedPricingAdmin],
    'markets-paesi': [loadMarketsAdmin],
    'markets-lingue': [loadMarketsAdmin],
    'markets-valute': [loadMarketsAdmin],
    'markets-prezzi': [loadMarketsAdmin, loadLocalizedPricingAdmin],
    'localized-pricing': [loadLocalizedPricingAdmin],
    analisi: [loadAnalyticsDashboard],
    'analytics-dashboard': [loadAnalyticsDashboard],
    'analytics-traffic': [loadAnalyticsDashboard],
    'analytics-sales': [loadAnalyticsDashboard],
    'analytics-products': [loadAnalyticsDashboard],
    'analytics-conversions': [loadAnalyticsDashboard],
    'analytics-events': [loadAnalyticsDashboard],
    traffico: [loadAnalyticsDashboard],
    vendite: [loadAnalyticsDashboard],
    'analytics-prodotti': [loadAnalyticsDashboard],
    conversioni: [loadAnalyticsDashboard],
    'takeoff-tools': [loadImportExportHistory, loadStoreHealth, loadLaunchChecklist],
    apps: [loadNativeApps],
    'app-hub': [loadNativeApps],
    'import-export': [loadImportExportHistory],
    'google-suite': [loadGoogleSuiteSettings],
    reviews: [loadReviews],
    returns: [loadReturns],
    upsells: [loadUpsells],
    'product-feeds': [loadProductFeeds],
    'gift-cards': [loadGiftCards],
    'store-credit': [loadStoreCredits],
    'abandoned-carts': [loadAbandonedCarts],
    'search-filters': [loadSearchFilters],
    'seo-technical': [loadSeoTechnical],
    webhooks: [loadWebhooks],
    'supplier-feeds': [loadSupplierFeeds],
    subscriptions: [loadSubscriptions],
    checkout: [loadTaxSettingsAdmin, loadPaymentSettingsAdmin, loadShippingMethodsAdmin],
    'checkout-settings': [],
    'checkout-payments': [loadPaymentSettingsAdmin],
    'checkout-shipping': [loadShippingMethodsAdmin],
    'checkout-taxes': [loadTaxSettingsAdmin],
    'checkout-confirmation': [],
    tasse: [loadTaxSettingsAdmin],
    pagamenti: [loadPaymentSettingsAdmin],
    spedizioni: [loadShippingMethodsAdmin],
    impostazioni: [loadCookiePrivacySettings],
    'settings-general': [],
    'privacy-settings': [loadCookiePrivacySettings],
    'cookie-settings': [loadCookiePrivacySettings],
    'settings-import-export': [],
    metafields: [loadMetafieldResources],
    integrazioni: [loadIntegrations],
    utenti: [loadAdminUsers],
    activity: [loadActivityLog],
    'activity-log': [loadActivityLog],
    notifiche: [loadNotifications],
    domini: [loadDomainsAdmin],
    tenants: [loadTenantsAdmin],
    performance: [loadPerformanceAdmin],
    'store-health': [loadStoreHealth],
    'launch-checklist': [loadLaunchChecklist],
    seo: [loadSeoDashboard],
  }

  ;(loadersByView[activeView] || []).forEach(runAdminViewLoader)
}

async function initAdminAuth() {
  if (ADMIN_DEMO_MODE) {
    showAdminApp(ADMIN_DEMO_USER)
    refreshAdminDataAfterAuth()
    return
  }

  showAdminAuthGate({ message: adminT('authChecking') })

  try {
    const response = await nativeFetch('/api/admin/auth/me', {
      credentials: 'same-origin',
    })
    const data = await response.json()

    if (data.migration_required) {
      showAdminAuthGate({
        migration: true,
        message: data.message || adminUiText('Applica la migration 0011 prima di usare il login admin.'),
      })
      return
    }

    if (data.bootstrap_required) {
      showAdminAuthGate({
        bootstrap: true,
        message: data.message || adminUiText('Crea il primo owner.'),
      })
      return
    }

    if (data.authenticated && data.user) {
      showAdminApp(data.user)
      refreshAdminDataAfterAuth()
      return
    }

    showAdminLogin(data.message || adminUiText(''))
  } catch {
    showAdminAuthGate({
      message: 'Non e stato possibile verificare la sessione admin.',
    })
  }
}

adminLoginForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  setAdminAuthMessage('Accesso in corso...')

  try {
    const response = await nativeFetch('/api/admin/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.querySelector('#adminLoginEmail')?.value.trim() || '',
        password: document.querySelector('#adminLoginPassword')?.value || '',
      }),
    })
    const data = await response.json()

    if (!data.success) {
      if (data.bootstrap_required) {
        showAdminAuthGate({ bootstrap: true, message: data.message || adminUiText('Crea il primo owner.') })
        return
      }

      setAdminAuthMessage(data.message || adminUiText('Credenziali non valide.'), true)
      return
    }

    adminLoginForm.reset()
    showAdminApp(data.user)
    refreshAdminDataAfterAuth()
  } catch {
    setAdminAuthMessage('Login non riuscito. Riprova.', true)
  }
})

adminBootstrapForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  setAdminAuthMessage('Creazione owner...')

  try {
    const response = await nativeFetch('/api/admin/auth/bootstrap', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.querySelector('#adminBootstrapName')?.value.trim() || '',
        email: document.querySelector('#adminBootstrapEmail')?.value.trim() || '',
        password: document.querySelector('#adminBootstrapPassword')?.value || '',
      }),
    })
    const data = await response.json()

    if (!data.success) {
      setAdminAuthMessage(data.message || adminUiText('Bootstrap non riuscito.'), true)
      return
    }

    adminBootstrapForm.reset()
    showAdminApp(data.user)
    refreshAdminDataAfterAuth()
  } catch {
    setAdminAuthMessage('Bootstrap non riuscito. Riprova.', true)
  }
})

adminLogoutButton?.addEventListener('click', async () => {
  if (ADMIN_DEMO_MODE) return

  try {
    await nativeFetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    })
  } catch {}

  showAdminLogin('Logout effettuato.')
})

const productsList = document.querySelector('#productsList')
const productForm = document.querySelector('#productForm')
const message = document.querySelector('#message')
const refreshButton = document.querySelector('#refreshButton')
const formTitle = document.querySelector('#formTitle')
const submitButton = document.querySelector('#submitButton')
const cancelEdit = document.querySelector('#cancelEdit')
const productVariantsList = document.querySelector('#productVariantsList')
const addVariantButton = document.querySelector('#addVariantButton')
const productAdminSearch = document.querySelector('#productAdminSearch')
const inventorySearch = document.querySelector('#inventorySearch')
const inventoryFilter = document.querySelector('#inventoryFilter')
const inventoryLowStockThreshold = document.querySelector('#inventoryLowStockThreshold')
const refreshInventoryButton = document.querySelector('#refreshInventoryButton')
const inventorySummary = document.querySelector('#inventorySummary')
const inventoryList = document.querySelector('#inventoryList')

let productVariantsDraft = []
let adminProductsCache = []

function formatMoney(priceCents) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceCents / 100)
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function normalizeAdminSearch(value = '') {
  return String(value || '').trim().toLowerCase()
}

function adminItemMatchesSearch(item = {}, query = '', fields = []) {
  if (!query) return true

  return fields.some((field) => {
    const value = field.split('.').reduce((target, key) => target?.[key], item)
    return String(value ?? '').toLowerCase().includes(query)
  })
}

function renderAdminListState(target, message, state = 'empty') {
  if (!target) return
  const translatedMessage = getAdminStaticTranslation(message) ?? message
  const helperText = state === 'loading'
    ? t('common.wait', 'Attendi qualche secondo.')
    : t('common.updateOrSearch', 'Puoi aggiornare o modificare la ricerca.')
  target.innerHTML = `
    <div class="admin-list-state ${state}">
      <strong>${escapeHtml(translatedMessage)}</strong>
      <span>${escapeHtml(helperText)}</span>
    </div>
  `
  applyAdminLanguage()
}

function setAdminDashboardCount(key, value) {
  const target = adminDashboardCounters[key]
  if (!target) return
  target.textContent = Number.isFinite(Number(value)) ? String(value) : '-'
}

function setInputValue(selector, value = '') {
  const input = document.querySelector(selector)
  if (input) input.value = value || ''
}

function readSeoFields(prefix) {
  return {
    meta_title: document.querySelector(`#${prefix}SeoTitle`)?.value.trim() || '',
    meta_description: document.querySelector(`#${prefix}SeoDescription`)?.value.trim() || '',
    og_image: document.querySelector(`#${prefix}SeoImage`)?.value.trim() || '',
    canonical_url: document.querySelector(`#${prefix}SeoCanonical`)?.value.trim() || '',
  }
}

function fillSeoFields(prefix, seo = {}) {
  setInputValue(`#${prefix}SeoTitle`, seo.meta_title)
  setInputValue(`#${prefix}SeoDescription`, seo.meta_description)
  setInputValue(`#${prefix}SeoImage`, seo.og_image)
  setInputValue(`#${prefix}SeoCanonical`, seo.canonical_url)
}

function resetForm() {
  productForm.reset()
  document.querySelector('#productId').value = ''
  fillSeoFields('product')
  productVariantsDraft = []
  renderVariantRows()
  formTitle.textContent = t('products.add', 'Aggiungi prodotto')
  submitButton.textContent = t('products.save', 'Salva prodotto')
  cancelEdit.hidden = true
  message.textContent = adminUiText('')
}

function fillForm(product) {
  document.querySelector('#productId').value = product.id
  document.querySelector('#name').value = product.name || ''
  document.querySelector('#slug').value = product.slug || ''
  document.querySelector('#description').value = product.description || ''
  document.querySelector('#price').value = product.price_cents / 100
  document.querySelector('#image_url').value = product.image_url || ''
  renderProductCollectionOptions(product.collection_slug || '')
  document.querySelector('#category').value = product.category || ''
  document.querySelector('#stock').value = product.stock || 0
  fillSeoFields('product', product.seo || {})
  productVariantsDraft = (product.variants || []).map((variant) => ({
    id: variant.id || '',
    option_name: variant.option_name || '',
    option_value: variant.option_value || '',
    sku: variant.sku || '',
    price_cents: variant.price_cents ?? '',
    stock: variant.stock ?? '',
  }))
  renderVariantRows()

  formTitle.textContent = t('products.edit', 'Modifica prodotto')
  submitButton.textContent = t('products.update', 'Aggiorna prodotto')
  cancelEdit.hidden = false

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function getFormProduct() {
  return {
    id: document.querySelector('#productId').value,
    name: document.querySelector('#name').value.trim(),
    slug: document.querySelector('#slug').value.trim(),
    description: document.querySelector('#description').value.trim(),
    price_cents: Math.round(Number(document.querySelector('#price').value) * 100),
    image_url: document.querySelector('#image_url').value.trim(),
    collection_slug: document.querySelector('#collection_slug').value.trim(),
    category: document.querySelector('#category').value.trim(),
    stock: Number(document.querySelector('#stock').value),
    variants: readVariantRows(),
    seo: readSeoFields('product'),
  }
}

function renderVariantRows() {
  if (!productVariantsList) return

  if (productVariantsDraft.length === 0) {
    productVariantsList.innerHTML = `<p class="empty-variants">${escapeHtml(t('products.variant.empty', 'Nessuna variante configurata.'))}</p>`
    return
  }

  productVariantsList.innerHTML = productVariantsDraft
    .map(
      (variant, index) => `
        <div class="variant-row" data-variant-row="${index}">
          <label>
            ${escapeHtml(t('products.variant.optionName', 'Nome opzione'))}
            <input
              type="text"
              data-variant-field="option_name"
              value="${escapeHtml(variant.option_name)}"
              placeholder="${escapeHtml(t('products.variant.optionNamePlaceholder', 'Colore'))}"
            />
          </label>

          <label>
            ${escapeHtml(t('products.variant.optionValue', 'Valore'))}
            <input
              type="text"
              data-variant-field="option_value"
              value="${escapeHtml(variant.option_value)}"
              placeholder="${escapeHtml(t('products.variant.optionValuePlaceholder', 'Rosso'))}"
            />
          </label>

          <label>
            SKU
            <input
              type="text"
              data-variant-field="sku"
              value="${escapeHtml(variant.sku)}"
              placeholder="${escapeHtml(t('products.variant.optionalSku', 'SKU opzionale'))}"
            />
          </label>

          <label>
            ${escapeHtml(t('products.variant.price', 'Prezzo variante'))}
            <input
              type="number"
              step="0.01"
              data-variant-field="price"
              value="${variant.price_cents === '' ? '' : Number(variant.price_cents) / 100}"
              placeholder="${escapeHtml(t('products.variant.emptyValue', 'Lascia vuoto'))}"
            />
          </label>

          <label>
            ${escapeHtml(t('products.variant.stock', 'Stock variante'))}
            <input
              type="number"
              data-variant-field="stock"
              value="${variant.stock ?? ''}"
              placeholder="${escapeHtml(t('products.variant.emptyValue', 'Lascia vuoto'))}"
            />
          </label>

          <button class="danger" type="button" data-remove-variant="${index}">
            ${escapeHtml(t('common.remove', 'Rimuovi'))}
          </button>
        </div>
      `,
    )
    .join('')

  document.querySelectorAll('[data-remove-variant]').forEach((button) => {
    button.addEventListener('click', () => {
      productVariantsDraft.splice(Number(button.dataset.removeVariant), 1)
      renderVariantRows()
    })
  })
}

function readVariantRows() {
  if (!productVariantsList) return []

  return [...productVariantsList.querySelectorAll('[data-variant-row]')]
    .map((row, index) => {
      const optionName = row.querySelector('[data-variant-field="option_name"]').value.trim()
      const optionValue = row.querySelector('[data-variant-field="option_value"]').value.trim()
      const sku = row.querySelector('[data-variant-field="sku"]').value.trim()
      const price = row.querySelector('[data-variant-field="price"]').value
      const stock = row.querySelector('[data-variant-field="stock"]').value

      return {
        option_name: optionName,
        option_value: optionValue,
        sku,
        price_cents: price === '' ? null : Math.round(Number(price) * 100),
        stock: stock === '' ? null : Number(stock),
        sort_order: index,
      }
    })
    .filter((variant) => variant.option_name || variant.option_value || variant.sku)
}

async function loadProducts() {
  renderAdminListState(productsList, t('products.loading', 'Caricamento prodotti...'), 'loading')

  try {
    const response = await fetch('/api/products')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(productsList, t('products.loadError', 'Errore nel caricamento prodotti.'), 'error')
      return
    }

    setAdminDashboardCount('products', data.products?.length || 0)
    adminProductsCache = data.products || []
    renderInventory()
    populateNativeAppProductSelects()

    if (data.products.length === 0) {
      renderAdminListState(productsList, t('products.empty', 'Nessun prodotto trovato.'))
      return
    }

    const search = normalizeAdminSearch(productAdminSearch?.value)
    const visibleProducts = data.products.filter((product) =>
      adminItemMatchesSearch(product, search, [
        'name',
        'slug',
        'description',
        'category',
        'collection_slug',
      ]),
    )

    if (!visibleProducts.length) {
      renderAdminListState(productsList, t('products.noSearchResults', 'Nessun prodotto corrisponde alla ricerca.'))
      return
    }

    productsList.innerHTML = visibleProducts
      .map(
        (product) => `
          <article class="product-item">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description || t('products.noDescription', 'Nessuna descrizione'))}</p>

            <div class="meta">
              <span>${formatMoney(product.price_cents)}</span>
              <span>${escapeHtml(t('products.stock', 'Stock'))}: ${product.stock}</span>
              <span>${escapeHtml(product.category || t('products.noCategory', 'Senza categoria'))}</span>
              <span>${escapeHtml(product.collection_slug || t('products.noCollection', 'Senza collezione'))}</span>
              <span>${product.variants?.length || 0} ${escapeHtml(t('products.variants', 'varianti'))}</span>
            </div>

            <div class="product-actions">
              <button type="button" data-edit="${product.id}">${escapeHtml(t('common.edit', 'Modifica'))}</button>
              <button type="button" class="danger" data-disable="${product.id}">${escapeHtml(t('common.disable', 'Disattiva'))}</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = data.products.find((item) => item.id === Number(button.dataset.edit))
        fillForm(product)
      })
    })

    document.querySelectorAll('[data-disable]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm(t('products.disableConfirm', 'Vuoi disattivare questo prodotto?'))
        if (!confirmed) return

        const response = await fetch('/api/admin/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.disable),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || t('products.disableError', 'Errore durante la disattivazione.'))
          return
        }

        loadProducts()
      })
    })
    applyAdminLanguage()
  } catch (error) {
    renderAdminListState(productsList, t('products.connectionError', 'Errore di connessione alla API.'), 'error')
  }
}

function getInventoryRows() {
  return adminProductsCache.flatMap((product) => {
    const baseRow = {
      id: `product-${product.id}`,
      product_id: product.id,
      variant_id: 0,
      name: product.name,
      detail: product.slug || 'Prodotto',
      sku: '',
      category: product.category || '',
      collection: product.collection_slug || '',
      stock: Number(product.stock || 0),
      type: 'product',
      price_cents: product.price_cents,
    }
    const variantRows = (product.variants || []).map((variant) => ({
      id: `variant-${variant.id}`,
      product_id: product.id,
      variant_id: variant.id,
      name: `${product.name} - ${variant.option_name || 'Opzione'}: ${variant.option_value || 'Valore'}`,
      detail: product.slug || 'Variante',
      sku: variant.sku || '',
      category: product.category || '',
      collection: product.collection_slug || '',
      stock: variant.stock === null || variant.stock === undefined ? Number(product.stock || 0) : Number(variant.stock || 0),
      type: 'variant',
      price_cents: variant.price_cents || product.price_cents,
    }))

    return [baseRow, ...variantRows]
  })
}

function inventoryStatus(row, threshold) {
  if (row.stock <= 0) return { key: 'out', label: t('products.outOfStock', 'Esaurito') }
  if (row.stock <= threshold) return { key: 'low', label: t('products.lowStock', 'Stock basso') }
  return { key: 'ok', label: t('common.available', 'Disponibile') }
}

function renderInventory() {
  if (!inventoryList) return

  const threshold = Math.max(1, Number(inventoryLowStockThreshold?.value || 5))
  const filter = inventoryFilter?.value || 'all'
  const search = normalizeAdminSearch(inventorySearch?.value)
  const rows = getInventoryRows()
  const enrichedRows = rows.map((row) => ({
    ...row,
    status: inventoryStatus(row, threshold),
  }))
  const visibleRows = enrichedRows.filter((row) => {
    const matchesFilter = filter === 'all' || row.status.key === filter
    const matchesSearch = !search || adminItemMatchesSearch(row, search, ['name', 'detail', 'sku', 'category', 'collection'])
    return matchesFilter && matchesSearch
  })

  if (inventorySummary) {
    const lowCount = enrichedRows.filter((row) => row.status.key === 'low').length
    const outCount = enrichedRows.filter((row) => row.status.key === 'out').length
    const availableCount = enrichedRows.filter((row) => row.status.key === 'ok').length

    inventorySummary.innerHTML = `
      <article><strong>${enrichedRows.length}</strong><span>${adminUiHtml('Righe stock')}</span></article>
      <article><strong>${availableCount}</strong><span>${escapeHtml(t('common.available', 'Disponibile'))}</span></article>
      <article><strong>${lowCount}</strong><span>${escapeHtml(t('products.lowStock', 'Stock basso'))}</span></article>
      <article><strong>${outCount}</strong><span>${escapeHtml(t('products.outOfStock', 'Esaurito'))}</span></article>
    `
  }

  if (!enrichedRows.length) {
    inventoryList.innerHTML = `<p class="admin-empty">${adminUiHtml('Nessun prodotto disponibile per l inventario.')}</p>`
    return
  }

  if (!visibleRows.length) {
    inventoryList.innerHTML = `<p class="admin-empty">${adminUiHtml('Nessuna riga inventario corrisponde ai filtri.')}</p>`
    return
  }

  inventoryList.innerHTML = visibleRows
    .map((row) => `
      <article class="product-item inventory-item" data-inventory-row="${escapeHtml(row.id)}">
        <div>
          <h3>${escapeHtml(row.name)}</h3>
          <p>${row.type === 'variant' ? `${adminUiHtml('Variante')} - SKU ${escapeHtml(row.sku || 'N/D')}` : adminUiHtml('Stock prodotto base')}</p>
        </div>
        <div class="meta">
          <span>${escapeHtml(row.status.label)}</span>
          <span>${escapeHtml(row.category || t('products.noCategory', 'Senza categoria'))}</span>
          <span>${escapeHtml(row.collection || t('products.noCollection', 'Senza collezione'))}</span>
          <span>${formatMoney(row.price_cents || 0)}</span>
        </div>
        <div class="inventory-actions">
          <label>Stock
            <input type="number" min="0" step="1" value="${row.stock}" data-inventory-stock="${escapeHtml(row.id)}" />
          </label>
          <button type="button" data-save-stock="${escapeHtml(row.id)}">${adminUiHtml('Aggiorna stock')}</button>
        </div>
      </article>
    `)
    .join('')

  document.querySelectorAll('[data-save-stock]').forEach((button) => {
    button.addEventListener('click', async () => {
      const row = visibleRows.find((item) => item.id === button.dataset.saveStock)
      const input = document.querySelector(`[data-inventory-stock="${button.dataset.saveStock}"]`)
      const stock = Number(input?.value || 0)

      if (!row || Number.isNaN(stock) || stock < 0) {
        alert(adminUiText('Stock non valido.'))
        return
      }

      try {
        const response = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_stock',
            product_id: row.product_id,
            variant_id: row.variant_id,
            stock,
          }),
        })
        const data = await response.json()

        if (!data.success) {
          alert(data.message || adminUiText('Aggiornamento stock non riuscito.'))
          return
        }

        await loadProducts()
      } catch {
        alert(adminUiText('Errore di connessione inventario.'))
      }
    })
  })

  applyAdminAuditUi()
}

inventorySearch?.addEventListener('input', renderInventory)
inventoryFilter?.addEventListener('change', renderInventory)
inventoryLowStockThreshold?.addEventListener('input', renderInventory)
refreshInventoryButton?.addEventListener('click', loadProducts)

productForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  message.textContent = adminUiText('Salvataggio in corso...')

  const product = getFormProduct()
  const isEditing = Boolean(product.id)

  try {
    const response = await fetch('/api/admin/products', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    const data = await response.json()

    if (!data.success) {
      message.textContent = data.message || adminUiText('Errore nel salvataggio.')
      return
    }

    message.textContent = isEditing
      ? 'Prodotto aggiornato correttamente.'
      : 'Prodotto salvato correttamente.'

    resetForm()
    loadProducts()
  } catch (error) {
    message.textContent = adminUiText('Errore di connessione.')
  }
})

cancelEdit.addEventListener('click', resetForm)
refreshButton.addEventListener('click', loadProducts)
productAdminSearch?.addEventListener('input', loadProducts)
addVariantButton?.addEventListener('click', () => {
  productVariantsDraft = readVariantRows()
  productVariantsDraft.push({
    option_name: '',
    option_value: '',
    sku: '',
    price_cents: '',
    stock: '',
  })
  renderVariantRows()
})

renderVariantRows()
loadProducts()

// ===============================
// IMPORT / EXPORT
// ===============================

const exportDataButton = document.querySelector('#exportDataButton')
const exportPreview = document.querySelector('#exportPreview')
const importProductsButton = document.querySelector('#importProductsButton')
const importPreview = document.querySelector('#importPreview')
const importExportMessage = document.querySelector('#importExportMessage')
const appsList = document.querySelector('#appsList')
const downloadTemplateButton = document.querySelector('#downloadTemplateButton')
const templatePreview = document.querySelector('#templatePreview')
const exportTranslationPackageButton = document.querySelector('#exportTranslationPackageButton')
const importTranslationPackageButton = document.querySelector('#importTranslationPackageButton')
const translationPackagePreview = document.querySelector('#translationPackagePreview')
const exportSitePackageButton = document.querySelector('#exportSitePackageButton')
const sitePackagePreview = document.querySelector('#sitePackagePreview')
const refreshImportExportHistoryButton = document.querySelector('#refreshImportExportHistoryButton')
const importExportHistoryPreview = document.querySelector('#importExportHistoryPreview')
const googleSuiteForm = document.querySelector('#googleSuiteForm')
const googleSuiteMessage = document.querySelector('#googleSuiteMessage')

const googleFields = {
  google_ga4_measurement_id: document.querySelector('#googleGa4MeasurementId'),
  google_ga4_active: document.querySelector('#googleGa4Active'),
  google_ads_conversion_id: document.querySelector('#googleAdsConversionId'),
  google_ads_purchase_label: document.querySelector('#googleAdsPurchaseLabel'),
  google_ads_active: document.querySelector('#googleAdsActive'),
  google_search_console_verification: document.querySelector('#googleSearchConsoleVerification'),
  google_gtm_container_id: document.querySelector('#googleGtmContainerId'),
  google_gtm_active: document.querySelector('#googleGtmActive'),
  google_tag_id: document.querySelector('#googleTagId'),
  google_tag_active: document.querySelector('#googleTagActive'),
}
const cookieSettingsForm = document.querySelector('#cookieSettingsForm')
const cookieBannerStatus = document.querySelector('#cookieBannerStatus')
const cookieConsentCategories = document.querySelector('#cookieConsentCategories')
const privacyGoogleConsentNote = document.querySelector('#privacyGoogleConsentNote')
const cookieSettingsMessage = document.querySelector('#cookieSettingsMessage')
const privacySettingsStatus = document.querySelector('#privacySettingsStatus')

function stringifyPreview(data) {
  return typeof data === 'string' ? data : JSON.stringify(data, null, 2)
}

function formatImportPreview(data = {}) {
  const report = data.report || data.summary || {}
  const created = Number(report.created || data.created || 0)
  const updated = Number(report.updated || data.updated || 0)
  const skipped = Number(report.skipped || data.skipped || 0)
  const rawErrors = report.errors || data.errors || []
  const errors = Array.isArray(rawErrors) ? rawErrors : []
  const mode = data.dry_run ? 'Dry-run: nessuna scrittura eseguita.' : 'Import reale: modifiche applicate dove consentito.'
  const lines = [
    mode,
    `Creati: ${created}`,
    `Aggiornati: ${updated}`,
    `Saltati: ${skipped}`,
    `Errori: ${errors.length}`,
  ]

  if (errors.length) {
    lines.push('')
    lines.push('Errori principali:')
    errors.slice(0, 8).forEach((error, index) => {
      const row = error.row || error.index || index + 1
      const message = error.message || error.error || String(error)
      lines.push(`- Riga ${row}: ${message}`)
    })
  }

  lines.push('')
  lines.push('Dettaglio tecnico:')
  lines.push(stringifyPreview(data))
  return lines.join('\n')
}

function downloadTextFile(filename, content, type = 'application/json') {
  try {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch {}
}

function parseAdminCsvLine(line = '') {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]
    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      index += 1
      continue
    }
    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }
    current += char
  }
  values.push(current.trim())
  return values
}

function parseAdminCsv(text = '') {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []
  const headers = parseAdminCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseAdminCsvLine(line)
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || ''
      return row
    }, {})
  })
}

function parseImportRows(format, content) {
  if (!content) return []
  if (format === 'csv') return parseAdminCsv(content)
  const parsed = JSON.parse(content)
  if (Array.isArray(parsed)) return parsed
  if (Array.isArray(parsed.rows)) return parsed.rows
  if (Array.isArray(parsed.translations)) return parsed.translations
  if (Array.isArray(parsed.resources?.translations)) return parsed.resources.translations
  return []
}

const APP_VISUALS = {
  Core: { icon: 'CO', tone: 'core' },
  Commerce: { icon: 'CM', tone: 'commerce' },
  Growth: { icon: 'GR', tone: 'growth' },
  System: { icon: 'SY', tone: 'system' },
}

const APP_ICON_MAP = {
  'takeoff-editor': 'ED',
  'takeoff-media-library': 'ML',
  'takeoff-import-export': 'IE',
  'takeoff-translate': 'Aa',
  'takeoff-markets': 'MK',
  'takeoff-seo': 'SEO',
  'takeoff-orders': 'OR',
  'takeoff-checkout': 'CK',
  'takeoff-shipping-rules': 'SH',
  'takeoff-customer-accounts': 'CA',
  'takeoff-returns': 'RT',
  'takeoff-reviews': 'RV',
  'takeoff-upsells': '+',
  'takeoff-analytics': 'AN',
  'takeoff-google-suite': 'G',
  'takeoff-email-automations': '@',
  'takeoff-product-feed': 'PF',
  'takeoff-search-filters': 'SF',
  'takeoff-abandoned-cart': 'AC',
  'takeoff-subscriptions': 'SB',
  'takeoff-gift-cards': 'GC',
  'takeoff-marketing': 'MA',
  'takeoff-backup': 'BK',
  'takeoff-gdpr-cookie': 'GD',
  'takeoff-webhooks': 'WH',
  'takeoff-supplier-feeds': 'SF',
  'takeoff-seo-technical': 'ST',
  'takeoff-store-health': 'HT',
  'takeoff-launch-checklist': 'LC',
  'takeoff-integrations': 'IN',
  'takeoff-3d-viewer': '3D',
}

const APP_VIEW_VISUALS = {
  editor: { icon: 'ED', category: 'Core', status: 'Active' },
  apps: { icon: 'AP', category: 'System', status: 'Active' },
  'import-export': { icon: 'IE', category: 'Core', status: 'Active' },
  'google-suite': { icon: 'G', category: 'Growth', status: 'Requires external configuration' },
  traduzioni: { icon: 'Aa', category: 'Core', status: 'Configurable' },
  media: { icon: 'ML', category: 'Core', status: 'Configurable' },
  seo: { icon: 'SEO', category: 'Core', status: 'Configurable' },
  analisi: { icon: 'AN', category: 'Growth', status: 'Configurable' },
  'analytics-dashboard': { icon: 'AN', category: 'Growth', status: 'Active' },
  'analytics-traffic': { icon: 'TR', category: 'Growth', status: 'Active' },
  'analytics-sales': { icon: 'SL', category: 'Commerce', status: 'Active' },
  'analytics-products': { icon: 'PR', category: 'Commerce', status: 'Active' },
  'analytics-conversions': { icon: 'CV', category: 'Growth', status: 'Active' },
  'analytics-events': { icon: 'EV', category: 'Growth', status: 'Active' },
  markets: { icon: 'MK', category: 'Core', status: 'Configurable' },
  'markets-mercati': { icon: 'MK', category: 'Core', status: 'Configurable' },
  'markets-paesi': { icon: 'PA', category: 'Core', status: 'Basic configuration' },
  'markets-lingue': { icon: 'LG', category: 'Core', status: 'Basic configuration' },
  'markets-valute': { icon: 'FX', category: 'Core', status: 'Basic configuration' },
  'markets-prezzi': { icon: 'LP', category: 'Commerce', status: 'Configurable' },
  reviews: { icon: 'RV', category: 'Commerce', status: 'Configurable' },
  returns: { icon: 'RT', category: 'Commerce', status: 'Basic configuration' },
  upsells: { icon: 'UP', category: 'Commerce', status: 'Configurable' },
  'product-feeds': { icon: 'PF', category: 'Growth', status: 'Configurable' },
  'customer-accounts': { icon: 'CA', category: 'Commerce', status: 'Basic configuration' },
  'gift-cards': { icon: 'GC', category: 'Commerce', status: 'Basic configuration' },
  'advanced-discounts': { icon: 'AD', category: 'Growth', status: 'Configurable' },
  'abandoned-carts': { icon: 'AC', category: 'Growth', status: 'Basic configuration' },
  'search-filters': { icon: 'SF', category: 'Growth', status: 'Basic configuration' },
  'seo-technical': { icon: 'ST', category: 'Core', status: 'Configurable' },
  webhooks: { icon: 'WH', category: 'System', status: 'Basic configuration' },
  'supplier-feeds': { icon: 'SF', category: 'System', status: 'Advanced tools in progress' },
  subscriptions: { icon: 'SB', category: 'Commerce', status: 'Basic configuration' },
  backup: { icon: 'BK', category: 'System', status: 'Active' },
  'gdpr-cookie': { icon: 'GD', category: 'System', status: 'Basic configuration' },
  'email-automations': { icon: '@', category: 'Growth', status: 'Requires external configuration' },
  'store-health': { icon: 'HT', category: 'System', status: 'Active' },
  'launch-checklist': { icon: 'LC', category: 'System', status: 'Active' },
  ordini: { icon: 'OR', category: 'Commerce', status: 'Active' },
  clienti: { icon: 'CA', category: 'Commerce', status: 'Active' },
  'checkout-shipping': { icon: 'SH', category: 'Commerce', status: 'Configurable' },
  notifiche: { icon: 'EM', category: 'Growth', status: 'Requires external configuration' },
  performance: { icon: 'PF', category: 'System', status: 'Configurable' },
}

const APP_HUB_OPTIONAL_MODULE_IDS = new Set([
  'takeoff-reviews',
  'takeoff-email-automations',
  'takeoff-upsells',
  'takeoff-abandoned-cart',
  'takeoff-customer-accounts',
  'takeoff-webhooks',
  'takeoff-gdpr-cookie',
  'takeoff-subscriptions',
])

const APP_HUB_OPTIONAL_MODULE_VIEWS = new Set([
  'reviews',
  'email-automations',
  'upsells',
  'abandoned-carts',
  'customer-accounts',
  'webhooks',
  'gdpr-cookie',
  'subscriptions',
])

function slugifyCss(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function appStatusClass(value = '') {
  const text = String(value).toLowerCase()
  if (text.includes('external')) return 'requires-external'
  if (text.includes('basic')) return 'basic'
  if (text.includes('advanced') || text.includes('progress')) return 'progress'
  if (text.includes('disabled')) return 'disabled'
  if (text.includes('configurable')) return 'configurable'
  return 'active'
}

function renderNativeApps(apps = []) {
  if (!appsList || !apps.length) return

  const visibleApps = apps.filter((app) => {
    const viewId = String(app.open_hash || '').replace('#', '')
    return APP_HUB_OPTIONAL_MODULE_IDS.has(app.id) || APP_HUB_OPTIONAL_MODULE_VIEWS.has(viewId)
  })

  if (!visibleApps.length) return

  const groups = ['Commerce', 'Growth', 'System']
  appsList.innerHTML = groups
    .map((group) => {
      const groupApps = visibleApps.filter((app) => app.category === group)
      if (!groupApps.length) return ''
      const groupVisual = APP_VISUALS[group] || APP_VISUALS.Core
      return `
        <div class="app-group app-group--${escapeHtml(groupVisual.tone)}">
          <div class="app-group-heading">
            <span>${escapeHtml(groupVisual.icon)}</span>
            <h3>${adminUiHtml(group)}</h3>
          </div>
          <div class="app-group-grid">
            ${groupApps
              .map((app) => {
                const progress = app.status === 'in_development' || /progress/i.test(app.status_label || '')
                const tone = (APP_VISUALS[app.category] || APP_VISUALS.Core).tone
                const icon = app.icon || APP_ICON_MAP[app.id] || (APP_VISUALS[app.category] || APP_VISUALS.Core).icon
                const statusLabel = app.status_label || app.status || 'Active'
                const appHref = getCanonicalAdminHref(app.open_hash || '#apps') || '#/apps'
                return `
                  <a class="mini-card app-card app-card--${escapeHtml(tone)} app-card--${escapeHtml(slugifyCss(app.id || app.name))} ${progress ? 'placeholder-card' : ''}" href="${escapeHtml(appHref)}">
                    <div class="app-card-topline">
                      <span class="app-card-icon" aria-hidden="true">${escapeHtml(icon)}</span>
                      <span class="mini-card-status status-badge--${escapeHtml(appStatusClass(statusLabel))}">${adminUiHtml(app.badge || 'Native app')}</span>
                    </div>
                    <h3>${escapeHtml(app.name)}</h3>
                    <p>${adminUiHtml(app.description)}</p>
                    <div class="meta app-card-meta">
                      <span class="category-chip category-chip--${escapeHtml(tone)}">${adminUiHtml(app.category || t('apps.module', 'Modulo'))}</span>
                      <span class="status-chip status-chip--${escapeHtml(appStatusClass(statusLabel))}">${adminUiHtml(statusLabel)}</span>
                    </div>
                    <strong>${escapeHtml(t('apps.openCta', 'Apri'))} <span aria-hidden="true">-&gt;</span></strong>
                  </a>
                `
              })
              .join('')}
          </div>
        </div>
      `
    })
    .join('')
  upgradeAdminRouteLinks(appsList)
}

function enhanceAppDetailShells() {
  Object.entries(APP_VIEW_VISUALS).forEach(([viewId, visual]) => {
    const section = document.querySelector(`[data-admin-view="${viewId}"]`)
    if (!section) return

    const tone = (APP_VISUALS[visual.category] || APP_VISUALS.Core).tone
    section.classList.add('app-detail-view', `app-detail-view--${tone}`, `app-detail-view--${slugifyCss(viewId)}`)
    section.dataset.appStatus = visual.status
    section.dataset.appCategory = visual.category

    const title = section.querySelector('.section-title')
    if (!title || title.querySelector('.app-detail-symbol')) return

    const symbol = document.createElement('span')
    symbol.className = 'app-detail-symbol'
    symbol.textContent = visual.icon
    title.prepend(symbol)

    const meta = document.createElement('div')
    meta.className = 'app-detail-meta'
    meta.innerHTML = `
      <span class="category-chip category-chip--${tone}">${adminUiHtml(visual.category)}</span>
      <span class="status-chip status-chip--${appStatusClass(visual.status)}">${adminUiHtml(visual.status)}</span>
    `
    const heading = title.querySelector('div')
    if (heading) heading.append(meta)
  })
}

function fillGoogleSuiteForm(settings = {}) {
  Object.entries(googleFields).forEach(([key, input]) => {
    if (!input) return

    if (input.type === 'checkbox') {
      input.checked = settings[key] === '1' || settings[key] === true
      return
    }

    input.value = settings[key] || ''
  })
}

function readGoogleSuitePayload() {
  return Object.entries(googleFields).reduce((payload, [key, input]) => {
    if (!input) return payload
    payload[key] = input.type === 'checkbox' ? input.checked : input.value.trim()
    return payload
  }, {})
}

async function loadGoogleSuiteSettings() {
  if (!googleSuiteForm) return

  try {
    const response = await fetch('/api/admin/google')
    const data = await response.json()

    if (!response.ok || !data.success) {
      if (googleSuiteMessage) googleSuiteMessage.textContent = data.message || adminUiText('Google Suite non disponibile.')
      return
    }

    fillGoogleSuiteForm(data.settings || {})
  } catch {
    if (googleSuiteMessage) googleSuiteMessage.textContent = adminUiText('Errore caricamento Google Suite.')
  }
}

googleSuiteForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (googleSuiteMessage) googleSuiteMessage.textContent = adminUiText('Salvataggio Google Suite...')

  try {
    const response = await fetch('/api/admin/google', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: readGoogleSuitePayload() }),
    })
    const data = await response.json()

    if (googleSuiteMessage) {
      googleSuiteMessage.textContent = data.message || (data.success ? 'Google Suite salvata.' : 'Errore Google Suite.')
    }

    if (data.success) fillGoogleSuiteForm(data.settings || readGoogleSuitePayload())
  } catch {
    if (googleSuiteMessage) googleSuiteMessage.textContent = adminUiText('Salvataggio Google Suite non riuscito.')
  }
})

function settingsListToMap(settings = []) {
  return settings.reduce((map, setting) => {
    map[setting.key] = setting.value || ''
    return map
  }, {})
}

function fillCookieSettings(settings = {}) {
  if (cookieBannerStatus) cookieBannerStatus.value = settings.cookie_banner_status || 'disabled'
  if (cookieConsentCategories) {
    cookieConsentCategories.value = settings.cookie_consent_categories || 'necessary,analytics,marketing'
  }
  if (privacyGoogleConsentNote) {
    privacyGoogleConsentNote.value =
      settings.privacy_google_consent_note || 'Google tags partono solo dopo consenso analytics o marketing.'
  }
  if (privacySettingsStatus) {
    privacySettingsStatus.textContent =
      `Cookie banner: ${settings.cookie_banner_status || 'disabled'} - categorie: ${settings.cookie_consent_categories || 'necessary,analytics,marketing'}`
  }
}

async function loadCookiePrivacySettings() {
  if (!cookieSettingsForm && !privacySettingsStatus) return

  if (!canAdminViewSensitiveSettings()) {
    if (privacySettingsStatus) privacySettingsStatus.textContent = adminUiText('Permessi insufficienti per leggere impostazioni privacy.')
    if (cookieSettingsMessage) cookieSettingsMessage.textContent = adminUiText('Permessi insufficienti.')
    return
  }

  try {
    const response = await fetch('/api/admin/settings')
    const data = await response.json()

    if (!data.success) {
      if (cookieSettingsMessage) cookieSettingsMessage.textContent = data.message || adminUiText('Cookie settings non disponibili.')
      return
    }

    fillCookieSettings(settingsListToMap(data.settings || []))
  } catch {
    if (cookieSettingsMessage) cookieSettingsMessage.textContent = adminUiText('Errore caricamento cookie settings.')
  }
}

cookieSettingsForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!canAdminViewSensitiveSettings()) {
    cookieSettingsMessage.textContent = adminUiText('Permessi insufficienti.')
    return
  }

  cookieSettingsMessage.textContent = adminUiText('Salvataggio cookie settings...')

  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settings: {
          cookie_banner_status: cookieBannerStatus?.value || 'disabled',
          cookie_consent_categories: cookieConsentCategories?.value || 'necessary,analytics,marketing',
          privacy_google_consent_note: privacyGoogleConsentNote?.value.trim() || '',
        },
      }),
    })
    const data = await response.json()

    cookieSettingsMessage.textContent = data.message || adminUiText('Cookie settings salvate.')
    if (data.success) loadCookiePrivacySettings()
  } catch {
    cookieSettingsMessage.textContent = adminUiText('Salvataggio cookie settings non riuscito.')
  }
})

async function loadNativeApps() {
  if (!appsList) return

  try {
    const response = await fetch('/api/admin/apps')
    const data = await response.json()

    if (response.ok && data.success && Array.isArray(data.apps)) {
      renderNativeApps(data.apps)
    }
  } catch {
    // Il markup statico resta come fallback se l'endpoint app hub non risponde.
  }
}

async function prepareExport(resource, format, previewElement, filenameBase, extraParams = {}) {
  if (!previewElement) return

  previewElement.textContent = adminUiText('Preparazione export...')

  try {
    const params = new URLSearchParams({
      resource,
      format,
      ...extraParams,
    })
    const response = await fetch(`/api/admin/import-export?${params.toString()}`)

    if (format === 'csv' && response.ok) {
      const text = await response.text()
      previewElement.textContent = text || 'Export vuoto.'
      downloadTextFile(`${filenameBase}.csv`, text, 'text/csv;charset=utf-8')
      return
    }

    const data = await response.json()
    if (!response.ok || !data.success) {
      previewElement.textContent = data.message || adminUiText('Export non disponibile.')
      return
    }

    const text = JSON.stringify(data, null, 2)
    previewElement.textContent = text
    downloadTextFile(`${filenameBase}.json`, text)
  } catch {
    previewElement.textContent = adminUiText('Export non riuscito. Riprova.')
  }
}

async function loadImportExportHistory() {
  if (!importExportHistoryPreview) return

  importExportHistoryPreview.textContent = adminUiText('Caricamento history...')

  try {
    const response = await fetch('/api/admin/import-export?resource=history&format=json')
    const data = await response.json()

    if (!response.ok || !data.success) {
      importExportHistoryPreview.textContent = data.message || adminUiText('History non disponibile.')
      return
    }

    const rows = data.rows || []
    importExportHistoryPreview.textContent = rows.length
      ? rows
          .map((job) => `${job.created_at || ''} - ${job.type || 'job'} - ${job.status || 'status'} - ${job.summary || ''}`)
          .join('\n')
      : 'Nessun job DataFlow registrato. Le prossime esportazioni/importazioni appariranno qui.'
  } catch {
    importExportHistoryPreview.textContent = adminUiText('History non disponibile.')
  }
}

async function runImport({ resource, format, content, dryRun, previewElement, messageElement }) {
  if (messageElement) messageElement.textContent = dryRun ? 'Validazione import...' : 'Import in corso...'
  if (previewElement) previewElement.textContent = adminUiText('')

  try {
    const rows = parseImportRows(format, content)
    const response = await fetch('/api/admin/import-export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource,
        format,
        content,
        rows,
        dry_run: dryRun,
      }),
    })
    const data = await response.json()

    if (messageElement) {
      messageElement.textContent = data.message || (data.success ? 'Import completato.' : 'Import non disponibile.')
    }
    if (previewElement) previewElement.textContent = formatImportPreview(data)

    if (data.success && !data.dry_run) {
      if (resource === 'products') loadProducts()
      if (resource === 'collections') loadCollections()
      if (resource === 'translations' || resource === 'translation_package') loadTranslationManager()
    }
  } catch {
    if (messageElement) messageElement.textContent = adminUiText('Import non riuscito. Verifica formato e riprova.')
    if (previewElement) previewElement.textContent = adminUiText('Il contenuto deve essere JSON valido o CSV coerente con il template.')
  }
}

exportDataButton?.addEventListener('click', async () => {
  const resource = document.querySelector('#exportResource').value
  const formatSelect = document.querySelector('#exportFormat')
  const format = resource === 'backup' ? 'json' : formatSelect.value

  if (resource === 'backup' && formatSelect) {
    formatSelect.value = 'json'
  }

  prepareExport(resource, format, exportPreview, resource)
})

importProductsButton?.addEventListener('click', async () => {
  runImport({
    resource: document.querySelector('#importResource')?.value || 'products',
    format: document.querySelector('#importFormat')?.value || 'json',
    content: document.querySelector('#importContent')?.value.trim() || '',
    dryRun: document.querySelector('#importDryRun')?.checked !== false,
    previewElement: importPreview,
    messageElement: importExportMessage,
  })
})

downloadTemplateButton?.addEventListener('click', () => {
  const target = document.querySelector('#templateResource')?.value || 'products'
  const format = document.querySelector('#templateFormat')?.value || 'json'
  prepareExport('template', format, templatePreview, `${target}-template`, { target })
})

exportTranslationPackageButton?.addEventListener('click', () => {
  const locale = document.querySelector('#translationPackageLocale')?.value || 'en'
  const format = document.querySelector('#translationPackageFormat')?.value || 'json'
  prepareExport('translation_package', format, translationPackagePreview, `translation-package-${locale}`, { locale })
})

importTranslationPackageButton?.addEventListener('click', () => {
  runImport({
    resource: 'translation_package',
    format: document.querySelector('#translationPackageFormat')?.value || 'json',
    content: document.querySelector('#translationPackageContent')?.value.trim() || '',
    dryRun: document.querySelector('#translationPackageDryRun')?.checked !== false,
    previewElement: translationPackagePreview,
    messageElement: null,
  })
})

exportSitePackageButton?.addEventListener('click', () => {
  prepareExport('site_package', 'json', sitePackagePreview, 'site-package')
})

refreshImportExportHistoryButton?.addEventListener('click', loadImportExportHistory)
document.querySelectorAll('[data-fill-import-resource]').forEach((button) => {
  button.addEventListener('click', () => {
    const importResource = document.querySelector('#importResource')
    if (importResource) importResource.value = button.dataset.fillImportResource
    document.querySelector('#importContent')?.focus()
  })
})
loadGoogleSuiteSettings()
loadCookiePrivacySettings()

// ===============================
// NATIVE APPS SUITE
// ===============================

const emailAutomationForm = document.querySelector('#emailAutomationForm')
const emailAutomationsProviderStatus = document.querySelector('#emailAutomationsProviderStatus')
const emailAutomationsList = document.querySelector('#emailAutomationsList')
const emailAutomationMessage = document.querySelector('#emailAutomationMessage')
const refreshEmailAutomationsButton = document.querySelector('#refreshEmailAutomationsButton')

const reviewForm = document.querySelector('#reviewForm')
const reviewsList = document.querySelector('#reviewsList')
const reviewMessage = document.querySelector('#reviewMessage')
const refreshReviewsButton = document.querySelector('#refreshReviewsButton')
const reviewStatusFilter = document.querySelector('#reviewStatusFilter')
const cancelReviewEdit = document.querySelector('#cancelReviewEdit')

const returnForm = document.querySelector('#returnForm')
const returnsList = document.querySelector('#returnsList')
const returnMessage = document.querySelector('#returnMessage')
const refreshReturnsButton = document.querySelector('#refreshReturnsButton')
const cancelReturnEdit = document.querySelector('#cancelReturnEdit')

const upsellForm = document.querySelector('#upsellForm')
const upsellsList = document.querySelector('#upsellsList')
const upsellMessage = document.querySelector('#upsellMessage')
const refreshUpsellsButton = document.querySelector('#refreshUpsellsButton')
const cancelUpsellEdit = document.querySelector('#cancelUpsellEdit')

const productFeedForm = document.querySelector('#productFeedForm')
const productFeedsList = document.querySelector('#productFeedsList')
const productFeedMessage = document.querySelector('#productFeedMessage')
const refreshProductFeedsButton = document.querySelector('#refreshProductFeedsButton')

const giftCardForm = document.querySelector('#giftCardForm')
const giftCardsList = document.querySelector('#giftCardsList')
const giftCardMessage = document.querySelector('#giftCardMessage')
const refreshGiftCardsButton = document.querySelector('#refreshGiftCardsButton')
const cancelGiftCardEdit = document.querySelector('#cancelGiftCardEdit')

const storeCreditForm = document.querySelector('#storeCreditForm')
const storeCreditsList = document.querySelector('#storeCreditsList')
const storeCreditMessage = document.querySelector('#storeCreditMessage')
const refreshStoreCreditsButton = document.querySelector('#refreshStoreCreditsButton')
const cancelStoreCreditEdit = document.querySelector('#cancelStoreCreditEdit')

const abandonedCartsList = document.querySelector('#abandonedCartsList')
const refreshAbandonedCartsButton = document.querySelector('#refreshAbandonedCartsButton')

const searchFiltersForm = document.querySelector('#searchFiltersForm')
const searchFiltersStatus = document.querySelector('#searchFiltersStatus')
const searchFiltersMessage = document.querySelector('#searchFiltersMessage')

const seoRedirectForm = document.querySelector('#seoRedirectForm')
const seoTechnicalStatus = document.querySelector('#seoTechnicalStatus')
const seoRedirectsList = document.querySelector('#seoRedirectsList')
const seoRedirectMessage = document.querySelector('#seoRedirectMessage')
const cancelSeoRedirectEdit = document.querySelector('#cancelSeoRedirectEdit')

const webhookForm = document.querySelector('#webhookForm')
const webhooksList = document.querySelector('#webhooksList')
const webhookDeliveriesList = document.querySelector('#webhookDeliveriesList')
const webhookMessage = document.querySelector('#webhookMessage')
const refreshWebhooksButton = document.querySelector('#refreshWebhooksButton')
const cancelWebhookEdit = document.querySelector('#cancelWebhookEdit')

const supplierFeedForm = document.querySelector('#supplierFeedForm')
const supplierFeedsList = document.querySelector('#supplierFeedsList')
const supplierFeedRunsList = document.querySelector('#supplierFeedRunsList')
const supplierFeedMessage = document.querySelector('#supplierFeedMessage')
const runSupplierFeedDryRunButton = document.querySelector('#runSupplierFeedDryRunButton')
const cancelSupplierFeedEdit = document.querySelector('#cancelSupplierFeedEdit')

const subscriptionForm = document.querySelector('#subscriptionForm')
const subscriptionsList = document.querySelector('#subscriptionsList')
const subscriptionMessage = document.querySelector('#subscriptionMessage')

const downloadBackupButton = document.querySelector('#downloadBackupButton')
const backupPreview = document.querySelector('#backupPreview')

function populateProductSelect(selector, includeEmpty = true) {
  const select = document.querySelector(selector)
  if (!select) return
  const current = select.value
  select.innerHTML = `${includeEmpty ? '<option value="">Seleziona prodotto</option>' : ''}${adminProductsCache
    .map((product) => `<option value="${product.id}">${escapeHtml(product.name || product.slug || `Product ${product.id}`)}</option>`)
    .join('')}`
  if (current) select.value = current
}

function populateNativeAppProductSelects() {
  populateProductSelect('#reviewProductId', false)
  populateProductSelect('#upsellBaseProductId')
  populateProductSelect('#upsellTriggerProductId')
  populateProductSelect('#subscriptionProductId')
}

function renderProviderStatus(container, providers = []) {
  if (!container) return
  container.innerHTML = providers
    .map(
      (provider) => `
        <article class="metric-card">
          <span>${escapeHtml(provider.provider)}</span>
          <strong>${escapeHtml(provider.configured ? t('apps.ready', 'Pronto') : t('apps.notConfigured', 'Non configurato'))}</strong>
          <small>${adminUiHtml(provider.status || provider.required_env || t('apps.providerRequired', 'Provider richiesto per invio reale'))}</small>
        </article>
      `,
    )
    .join('')
}

async function loadEmailAutomations() {
  if (!emailAutomationsList && !emailAutomationsProviderStatus) return
  try {
    const response = await fetch('/api/admin/email-automations')
    const data = await response.json()
    if (!response.ok || !data.success) {
      if (emailAutomationsList) emailAutomationsList.textContent = data.message || adminUiText('Email Automations non disponibile.')
      return
    }
    renderProviderStatus(emailAutomationsProviderStatus, data.provider_status || [])
    const templates = data.templates || []
    const logs = data.logs || []
    emailAutomationsList.innerHTML = `
      <div class="placeholder-panel compact-panel">
        <span class="status-badge">${adminUiHtml(data.sending_mode === 'provider_ready' ? 'Provider ready' : 'Mock / logging only')}</span>
        <p>Provider required for real sending. Nessuna chiave viene salvata nel repository.</p>
      </div>
      ${templates.length ? templates.map((item) => `
        <article class="product-item">
          <h3>${escapeHtml(item.type || 'template')}</h3>
          <p>${escapeHtml(item.subject || 'No subject')}</p>
          <div class="meta"><span>${Number(item.active) ? 'Active' : 'Inactive'}</span></div>
        </article>
      `).join('') : '<p>Nessun template configurato.</p>'}
      <pre class="admin-pre">${logs.length ? logs.slice(0, 10).map((log) => `${log.created_at || ''} - ${log.type || ''} - ${log.status || ''}`).join('\n') : 'Nessun log email.'}</pre>
    `
  } catch {
    if (emailAutomationsList) emailAutomationsList.textContent = adminUiText('Email Automations non disponibile.')
  }
}

emailAutomationForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (emailAutomationMessage) emailAutomationMessage.textContent = adminUiText('Salvataggio template...')
  try {
    const response = await fetch('/api/admin/email-automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: document.querySelector('#emailAutomationType')?.value,
        subject: document.querySelector('#emailAutomationSubject')?.value.trim(),
        body: document.querySelector('#emailAutomationBody')?.value.trim(),
        active: document.querySelector('#emailAutomationActive')?.checked,
      }),
    })
    const data = await response.json()
    if (emailAutomationMessage) emailAutomationMessage.textContent = data.message || adminUiText('Template salvato.')
    if (data.success) loadEmailAutomations()
  } catch {
    if (emailAutomationMessage) emailAutomationMessage.textContent = adminUiText('Salvataggio non riuscito.')
  }
})
refreshEmailAutomationsButton?.addEventListener('click', loadEmailAutomations)

function reviewPayload() {
  return {
    id: Number(document.querySelector('#reviewId')?.value || 0) || undefined,
    product_id: Number(document.querySelector('#reviewProductId')?.value || 0),
    customer_name: document.querySelector('#reviewCustomerName')?.value.trim(),
    email: document.querySelector('#reviewEmail')?.value.trim(),
    rating: Number(document.querySelector('#reviewRating')?.value || 5),
    title: document.querySelector('#reviewTitle')?.value.trim(),
    body: document.querySelector('#reviewBody')?.value.trim(),
    status: document.querySelector('#reviewStatus')?.value || 'pending',
  }
}

function resetReviewForm() {
  reviewForm?.reset()
  document.querySelector('#reviewId').value = ''
  cancelReviewEdit.hidden = true
}

function fillReviewForm(review) {
  document.querySelector('#reviewId').value = review.id || ''
  document.querySelector('#reviewProductId').value = review.product_id || ''
  document.querySelector('#reviewCustomerName').value = review.customer_name || ''
  document.querySelector('#reviewEmail').value = review.email || ''
  document.querySelector('#reviewRating').value = review.rating || 5
  document.querySelector('#reviewTitle').value = review.title || ''
  document.querySelector('#reviewBody').value = review.body || ''
  document.querySelector('#reviewStatus').value = review.status || 'pending'
  cancelReviewEdit.hidden = false
}

async function loadReviews() {
  if (!reviewsList) return
  reviewsList.textContent = adminUiText('Caricamento reviews...')
  try {
    const status = reviewStatusFilter?.value || ''
    const response = await fetch(`/api/admin/reviews${status ? `?status=${encodeURIComponent(status)}` : ''}`)
    const data = await response.json()
    if (!response.ok || !data.success) {
      reviewsList.textContent = data.message || adminUiText('Reviews non disponibili.')
      return
    }
    const reviews = data.reviews || []
    reviewsList.innerHTML = reviews.length
      ? reviews.map((review) => `
        <article class="product-item">
          <h3>${escapeHtml(review.title || `Review #${review.id}`)}</h3>
          <p>${escapeHtml(review.body || 'Nessun testo')}</p>
          <div class="meta">
            <span>${escapeHtml(review.customer_name || 'Cliente')}</span>
            <span>${'★'.repeat(Number(review.rating || 0))}</span>
            <span>${escapeHtml(review.status || 'pending')}</span>
            <span>${escapeHtml(review.product_title || review.product_name || `Product ${review.product_id}`)}</span>
          </div>
          <div class="product-actions">
            <button type="button" data-edit-review="${review.id}">Modifica</button>
            <button type="button" class="danger" data-delete-review="${review.id}">Disattiva</button>
          </div>
        </article>
      `).join('')
      : '<p>Nessuna review presente.</p>'
    reviewsList.querySelectorAll('[data-edit-review]').forEach((button) => {
      button.addEventListener('click', () => {
        const review = reviews.find((item) => item.id === Number(button.dataset.editReview))
        if (review) fillReviewForm(review)
      })
    })
    reviewsList.querySelectorAll('[data-delete-review]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch(`/api/admin/reviews?id=${button.dataset.deleteReview}`, { method: 'DELETE' })
        const data = await response.json()
        if (reviewMessage) reviewMessage.textContent = data.message || adminUiText('Review aggiornata.')
        loadReviews()
      })
    })
  } catch {
    reviewsList.textContent = adminUiText('Reviews non disponibili.')
  }
}

reviewForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  const payload = reviewPayload()
  if (reviewMessage) reviewMessage.textContent = adminUiText('Salvataggio review...')
  try {
    const response = await fetch('/api/admin/reviews', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (reviewMessage) reviewMessage.textContent = data.message || adminUiText('Review salvata.')
    if (data.success) {
      resetReviewForm()
      loadReviews()
    }
  } catch {
    if (reviewMessage) reviewMessage.textContent = adminUiText('Salvataggio review non riuscito.')
  }
})
refreshReviewsButton?.addEventListener('click', loadReviews)
reviewStatusFilter?.addEventListener('change', loadReviews)
cancelReviewEdit?.addEventListener('click', resetReviewForm)

function returnPayload() {
  return {
    id: Number(document.querySelector('#returnId')?.value || 0) || undefined,
    order_id: Number(document.querySelector('#returnOrderId')?.value || 0) || null,
    customer_email: document.querySelector('#returnCustomerEmail')?.value.trim(),
    reason: document.querySelector('#returnReason')?.value.trim(),
    note: document.querySelector('#returnNote')?.value.trim(),
    internal_note: document.querySelector('#returnInternalNote')?.value.trim(),
    refund_amount: Number(document.querySelector('#returnRefundAmount')?.value || 0),
    status: document.querySelector('#returnStatus')?.value || 'requested',
  }
}

function resetReturnForm() {
  returnForm?.reset()
  document.querySelector('#returnId').value = ''
  cancelReturnEdit.hidden = true
}

function fillReturnForm(item) {
  document.querySelector('#returnId').value = item.id || ''
  document.querySelector('#returnOrderId').value = item.order_id || ''
  document.querySelector('#returnCustomerEmail').value = item.customer_email || ''
  document.querySelector('#returnReason').value = item.reason || ''
  document.querySelector('#returnNote').value = item.note || ''
  document.querySelector('#returnInternalNote').value = item.internal_note || ''
  document.querySelector('#returnRefundAmount').value = Number(item.refund_amount_cents || 0) / 100
  document.querySelector('#returnStatus').value = item.status || 'requested'
  cancelReturnEdit.hidden = false
}

async function loadReturns() {
  if (!returnsList) return
  returnsList.textContent = adminUiText('Caricamento resi...')
  try {
    const response = await fetch('/api/admin/returns')
    const data = await response.json()
    if (!response.ok || !data.success) {
      returnsList.textContent = data.message || adminUiText('Returns non disponibili.')
      return
    }
    const returns = data.returns || []
    returnsList.innerHTML = returns.length
      ? returns.map((item) => `
        <article class="product-item">
          <h3>Return #${item.id} - Order ${escapeHtml(item.order_id || 'N/A')}</h3>
          <p>${escapeHtml(item.reason || 'Nessun motivo')}</p>
          <div class="meta">
            <span>${escapeHtml(item.customer_email || '')}</span>
            <span>${escapeHtml(item.status || 'requested')}</span>
            <span>${formatMoney(item.refund_amount_cents || 0)}</span>
          </div>
          <div class="product-actions">
            <button type="button" data-edit-return="${item.id}">Modifica</button>
            <button type="button" class="danger" data-delete-return="${item.id}">Disattiva</button>
          </div>
        </article>
      `).join('')
      : '<p>Nessun reso presente.</p>'
    returnsList.querySelectorAll('[data-edit-return]').forEach((button) => {
      button.addEventListener('click', () => {
        const item = returns.find((row) => row.id === Number(button.dataset.editReturn))
        if (item) fillReturnForm(item)
      })
    })
    returnsList.querySelectorAll('[data-delete-return]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch(`/api/admin/returns?id=${button.dataset.deleteReturn}`, { method: 'DELETE' })
        const data = await response.json()
        if (returnMessage) returnMessage.textContent = data.message || adminUiText('Return aggiornato.')
        loadReturns()
      })
    })
  } catch {
    returnsList.textContent = adminUiText('Returns non disponibili.')
  }
}

returnForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  const payload = returnPayload()
  if (returnMessage) returnMessage.textContent = adminUiText('Salvataggio reso...')
  try {
    const response = await fetch('/api/admin/returns', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (returnMessage) returnMessage.textContent = data.message || adminUiText('Reso salvato.')
    if (data.success) {
      resetReturnForm()
      loadReturns()
    }
  } catch {
    if (returnMessage) returnMessage.textContent = adminUiText('Salvataggio reso non riuscito.')
  }
})
refreshReturnsButton?.addEventListener('click', loadReturns)
cancelReturnEdit?.addEventListener('click', resetReturnForm)

function upsellPayload() {
  return {
    id: Number(document.querySelector('#upsellId')?.value || 0) || undefined,
    type: document.querySelector('#upsellType')?.value,
    name: document.querySelector('#upsellName')?.value.trim(),
    base_product_id: Number(document.querySelector('#upsellBaseProductId')?.value || 0) || null,
    trigger_product_id: Number(document.querySelector('#upsellTriggerProductId')?.value || 0) || null,
    target_product_ids: document.querySelector('#upsellTargetProductIds')?.value.trim(),
    discount_type: document.querySelector('#upsellDiscountType')?.value,
    discount_value: Number(document.querySelector('#upsellDiscountValue')?.value || 0),
    message: document.querySelector('#upsellMessageInput')?.value.trim(),
    active: document.querySelector('#upsellActive')?.checked,
  }
}

function resetUpsellForm() {
  upsellForm?.reset()
  document.querySelector('#upsellId').value = ''
  document.querySelector('#upsellActive').checked = true
  cancelUpsellEdit.hidden = true
}

function fillUpsellForm(rule) {
  document.querySelector('#upsellId').value = rule.id || ''
  document.querySelector('#upsellType').value = rule.type || 'frequently_bought_together'
  document.querySelector('#upsellName').value = rule.name || ''
  document.querySelector('#upsellBaseProductId').value = rule.base_product_id || ''
  document.querySelector('#upsellTriggerProductId').value = rule.trigger_product_id || ''
  document.querySelector('#upsellTargetProductIds').value = Array.isArray(rule.target_product_ids) ? rule.target_product_ids.join(',') : rule.target_product_ids || ''
  document.querySelector('#upsellDiscountType').value = rule.discount_type || 'percentage'
  document.querySelector('#upsellDiscountValue').value = rule.discount_value || 0
  document.querySelector('#upsellMessageInput').value = rule.message || ''
  document.querySelector('#upsellActive').checked = Number(rule.active) !== 0
  cancelUpsellEdit.hidden = false
}

async function loadUpsells() {
  if (!upsellsList) return
  upsellsList.textContent = adminUiText('Caricamento upsell...')
  try {
    const response = await fetch('/api/admin/upsells')
    const data = await response.json()
    if (!response.ok || !data.success) {
      upsellsList.textContent = data.message || adminUiText('Upsell non disponibile.')
      return
    }
    const rules = data.rules || []
    upsellsList.innerHTML = rules.length
      ? rules.map((rule) => `
        <article class="product-item">
          <h3>${escapeHtml(rule.name || `Rule #${rule.id}`)}</h3>
          <p>${escapeHtml(rule.message || 'Nessun messaggio')}</p>
          <div class="meta">
            <span>${escapeHtml(rule.type || '')}</span>
            <span>${escapeHtml(rule.base_product_title || rule.base_product_name || 'Base product')}</span>
            <span>${escapeHtml((rule.target_product_ids || []).join(', ') || 'No targets')}</span>
          </div>
          <div class="product-actions">
            <button type="button" data-edit-upsell="${rule.id}">Modifica</button>
            <button type="button" class="danger" data-delete-upsell="${rule.id}">Disattiva</button>
          </div>
        </article>
      `).join('')
      : '<p>Nessuna regola upsell presente.</p>'
    upsellsList.querySelectorAll('[data-edit-upsell]').forEach((button) => {
      button.addEventListener('click', () => {
        const rule = rules.find((item) => item.id === Number(button.dataset.editUpsell))
        if (rule) fillUpsellForm(rule)
      })
    })
    upsellsList.querySelectorAll('[data-delete-upsell]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch(`/api/admin/upsells?id=${button.dataset.deleteUpsell}`, { method: 'DELETE' })
        const data = await response.json()
        if (upsellMessage) upsellMessage.textContent = data.message || adminUiText('Upsell aggiornato.')
        loadUpsells()
      })
    })
  } catch {
    upsellsList.textContent = adminUiText('Upsell non disponibile.')
  }
}

upsellForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  const payload = upsellPayload()
  if (upsellMessage) upsellMessage.textContent = adminUiText('Salvataggio upsell...')
  try {
    const response = await fetch('/api/admin/upsells', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (upsellMessage) upsellMessage.textContent = data.message || adminUiText('Upsell salvato.')
    if (data.success) {
      resetUpsellForm()
      loadUpsells()
    }
  } catch {
    if (upsellMessage) upsellMessage.textContent = adminUiText('Salvataggio upsell non riuscito.')
  }
})
refreshUpsellsButton?.addEventListener('click', loadUpsells)
cancelUpsellEdit?.addEventListener('click', resetUpsellForm)

function fillProductFeedForm(feed) {
  if (!feed) return
  document.querySelector('#productFeedProvider').value = feed.provider || 'google'
  document.querySelector('#productFeedTitle').value = feed.title || ''
  document.querySelector('#productFeedCurrency').value = feed.default_currency || 'EUR'
  document.querySelector('#productFeedLanguage').value = feed.default_language || 'it'
  document.querySelector('#productFeedMarket').value = feed.market_handle || ''
  document.querySelector('#productFeedIncludeOutOfStock').checked = Number(feed.include_out_of_stock) === 1
  document.querySelector('#productFeedActive').checked = Number(feed.active) === 1
}

async function loadProductFeeds() {
  if (!productFeedsList) return
  productFeedsList.textContent = adminUiText('Caricamento product feeds...')
  try {
    const response = await fetch('/api/admin/product-feeds')
    const data = await response.json()
    if (!response.ok || !data.success) {
      productFeedsList.textContent = data.message || adminUiText('Product Feed non disponibile.')
      return
    }
    const feeds = data.feeds || []
    fillProductFeedForm(feeds[0])
    productFeedsList.innerHTML = feeds.map((feed) => `
      <article class="product-item">
        <h3>${escapeHtml(feed.provider || 'feed')}</h3>
        <p>${escapeHtml(feed.title || 'Product feed')}</p>
        <div class="meta">
          <span>${Number(feed.active) ? 'Active' : 'Inactive'}</span>
          <span>${escapeHtml(feed.default_currency || 'EUR')}</span>
          <span>${escapeHtml(feed.default_language || 'it')}</span>
        </div>
        <button type="button" data-edit-feed="${escapeHtml(feed.provider)}">Modifica</button>
      </article>
    `).join('')
    productFeedsList.querySelectorAll('[data-edit-feed]').forEach((button) => {
      button.addEventListener('click', () => fillProductFeedForm(feeds.find((feed) => feed.provider === button.dataset.editFeed)))
    })
  } catch {
    productFeedsList.textContent = adminUiText('Product Feed non disponibile.')
  }
}

productFeedForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (productFeedMessage) productFeedMessage.textContent = adminUiText('Salvataggio feed...')
  try {
    const response = await fetch('/api/admin/product-feeds', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: document.querySelector('#productFeedProvider')?.value,
        title: document.querySelector('#productFeedTitle')?.value.trim(),
        default_currency: document.querySelector('#productFeedCurrency')?.value.trim(),
        default_language: document.querySelector('#productFeedLanguage')?.value.trim(),
        market_handle: document.querySelector('#productFeedMarket')?.value.trim(),
        include_out_of_stock: document.querySelector('#productFeedIncludeOutOfStock')?.checked,
        active: document.querySelector('#productFeedActive')?.checked,
      }),
    })
    const data = await response.json()
    if (productFeedMessage) productFeedMessage.textContent = data.message || adminUiText('Feed salvato.')
    if (data.success) loadProductFeeds()
  } catch {
    if (productFeedMessage) productFeedMessage.textContent = adminUiText('Salvataggio feed non riuscito.')
  }
})
refreshProductFeedsButton?.addEventListener('click', loadProductFeeds)

function resetGiftCardForm() {
  giftCardForm?.reset()
  const id = document.querySelector('#giftCardId')
  if (id) id.value = ''
  if (cancelGiftCardEdit) cancelGiftCardEdit.hidden = true
}

function fillGiftCardForm(card) {
  document.querySelector('#giftCardId').value = card.id || ''
  document.querySelector('#giftCardCode').value = card.code || ''
  document.querySelector('#giftCardInitialBalance').value = Number(card.initial_balance_cents || 0) / 100
  document.querySelector('#giftCardCustomerEmail').value = card.customer_email || ''
  document.querySelector('#giftCardExpiresAt').value = card.expires_at || ''
  document.querySelector('#giftCardNote').value = card.note || ''
  document.querySelector('#giftCardStatus').value = card.status || 'active'
  document.querySelector('#giftCardActive').checked = Number(card.active) !== 0
  if (cancelGiftCardEdit) cancelGiftCardEdit.hidden = false
}

async function loadGiftCards() {
  if (!giftCardsList) return
  giftCardsList.textContent = adminUiText('Caricamento gift cards...')
  try {
    const response = await fetch('/api/admin/gift-cards')
    const data = await response.json()
    if (!response.ok || !data.success) {
      giftCardsList.textContent = data.message || adminUiText('Gift cards non disponibili.')
      return
    }
    const cards = data.gift_cards || []
    giftCardsList.innerHTML = cards.length
      ? cards.map((card) => `
        <article class="product-item">
          <h3>${escapeHtml(card.code)}</h3>
          <p>${escapeHtml(card.customer_email || 'Nessun cliente associato')}</p>
          <div class="meta">
            <span>Saldo: ${formatMoney(card.balance_cents || 0)}</span>
            <span>Iniziale: ${formatMoney(card.initial_balance_cents || 0)}</span>
            <span>${escapeHtml(card.status || 'active')}</span>
            <span>${Number(card.active) ? 'Active' : 'Inactive'}</span>
          </div>
          <div class="product-actions">
            <button type="button" data-edit-gift-card="${card.id}">Modifica</button>
            <button type="button" class="danger" data-disable-gift-card="${card.id}">Disattiva</button>
          </div>
        </article>
      `).join('')
      : '<p>Nessuna gift card presente.</p>'
    giftCardsList.querySelectorAll('[data-edit-gift-card]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = cards.find((item) => item.id === Number(button.dataset.editGiftCard))
        if (card) fillGiftCardForm(card)
      })
    })
    giftCardsList.querySelectorAll('[data-disable-gift-card]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch('/api/admin/gift-cards', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableGiftCard) }),
        })
        const data = await response.json()
        if (giftCardMessage) giftCardMessage.textContent = data.message || adminUiText('Gift card aggiornata.')
        loadGiftCards()
      })
    })
  } catch {
    giftCardsList.textContent = adminUiText('Gift cards non disponibili.')
  }
}

giftCardForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (giftCardMessage) giftCardMessage.textContent = adminUiText('Salvataggio gift card...')
  const payload = {
    id: Number(document.querySelector('#giftCardId')?.value || 0) || undefined,
    code: document.querySelector('#giftCardCode')?.value.trim(),
    initial_balance: Number(document.querySelector('#giftCardInitialBalance')?.value || 0),
    customer_email: document.querySelector('#giftCardCustomerEmail')?.value.trim(),
    expires_at: document.querySelector('#giftCardExpiresAt')?.value,
    note: document.querySelector('#giftCardNote')?.value.trim(),
    status: document.querySelector('#giftCardStatus')?.value,
    active: document.querySelector('#giftCardActive')?.checked,
  }
  try {
    const response = await fetch('/api/admin/gift-cards', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (giftCardMessage) giftCardMessage.textContent = data.message || adminUiText('Gift card salvata.')
    if (data.success) {
      resetGiftCardForm()
      loadGiftCards()
    }
  } catch {
    if (giftCardMessage) giftCardMessage.textContent = adminUiText('Salvataggio gift card non riuscito.')
  }
})
refreshGiftCardsButton?.addEventListener('click', loadGiftCards)
cancelGiftCardEdit?.addEventListener('click', resetGiftCardForm)

function resetStoreCreditForm() {
  storeCreditForm?.reset()
  const id = document.querySelector('#storeCreditId')
  if (id) id.value = ''
  if (cancelStoreCreditEdit) cancelStoreCreditEdit.hidden = true
}

function fillStoreCreditForm(credit) {
  document.querySelector('#storeCreditId').value = credit.id || ''
  document.querySelector('#storeCreditCustomerEmail').value = credit.customer_email || ''
  document.querySelector('#storeCreditAmount').value = Number(credit.amount_cents || 0) / 100
  document.querySelector('#storeCreditNote').value = credit.note || ''
  document.querySelector('#storeCreditStatus').value = credit.status || 'active'
  if (cancelStoreCreditEdit) cancelStoreCreditEdit.hidden = false
}

async function loadStoreCredits() {
  if (!storeCreditsList) return
  storeCreditsList.textContent = adminUiText('Caricamento crediti...')
  try {
    const response = await fetch('/api/admin/store-credit')
    const data = await response.json()
    if (!response.ok || !data.success) {
      storeCreditsList.textContent = data.message || adminUiText('Store credit non disponibile.')
      return
    }
    const credits = data.store_credits || []
    storeCreditsList.innerHTML = credits.length
      ? credits.map((credit) => `
        <article class="product-item">
          <h3>${escapeHtml(credit.customer_email || `Credit #${credit.id}`)}</h3>
          <p>${escapeHtml(credit.note || 'Nessuna nota')}</p>
          <div class="meta">
            <span>${formatMoney(credit.remaining_amount_cents || credit.amount_cents || 0)}</span>
            <span>${escapeHtml(credit.status || 'active')}</span>
            <span>${escapeHtml(credit.created_at || '')}</span>
          </div>
          <div class="product-actions">
            <button type="button" data-edit-store-credit="${credit.id}">Modifica</button>
            <button type="button" class="danger" data-disable-store-credit="${credit.id}">Disattiva</button>
          </div>
        </article>
      `).join('')
      : '<p>Nessun credito cliente presente.</p>'
    storeCreditsList.querySelectorAll('[data-edit-store-credit]').forEach((button) => {
      button.addEventListener('click', () => {
        const credit = credits.find((item) => item.id === Number(button.dataset.editStoreCredit))
        if (credit) fillStoreCreditForm(credit)
      })
    })
    storeCreditsList.querySelectorAll('[data-disable-store-credit]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch('/api/admin/store-credit', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableStoreCredit) }),
        })
        const data = await response.json()
        if (storeCreditMessage) storeCreditMessage.textContent = data.message || adminUiText('Credito aggiornato.')
        loadStoreCredits()
      })
    })
  } catch {
    storeCreditsList.textContent = adminUiText('Store credit non disponibile.')
  }
}

storeCreditForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (storeCreditMessage) storeCreditMessage.textContent = adminUiText('Salvataggio credito...')
  const payload = {
    id: Number(document.querySelector('#storeCreditId')?.value || 0) || undefined,
    customer_email: document.querySelector('#storeCreditCustomerEmail')?.value.trim(),
    amount: Number(document.querySelector('#storeCreditAmount')?.value || 0),
    note: document.querySelector('#storeCreditNote')?.value.trim(),
    status: document.querySelector('#storeCreditStatus')?.value,
  }
  try {
    const response = await fetch('/api/admin/store-credit', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (storeCreditMessage) storeCreditMessage.textContent = data.message || adminUiText('Credito salvato.')
    if (data.success) {
      resetStoreCreditForm()
      loadStoreCredits()
    }
  } catch {
    if (storeCreditMessage) storeCreditMessage.textContent = adminUiText('Salvataggio credito non riuscito.')
  }
})
refreshStoreCreditsButton?.addEventListener('click', loadStoreCredits)
cancelStoreCreditEdit?.addEventListener('click', resetStoreCreditForm)

async function loadAbandonedCarts() {
  if (!abandonedCartsList) return
  abandonedCartsList.textContent = adminUiText('Caricamento carrelli...')
  try {
    const response = await fetch('/api/admin/abandoned-carts')
    const data = await response.json()
    if (!response.ok || !data.success) {
      abandonedCartsList.textContent = data.message || adminUiText('Abandoned carts non disponibili.')
      return
    }
    const carts = data.carts || []
    abandonedCartsList.innerHTML = carts.length
      ? carts.map((cart) => `
        <article class="product-item">
          <h3>${escapeHtml(cart.email || cart.session_id || `Cart #${cart.id}`)}</h3>
          <p>${escapeHtml(cart.status || 'open')} - ${escapeHtml(cart.last_activity_at || '')}</p>
          <div class="meta">
            <span>${formatMoney(cart.total_cents || 0)}</span>
            <span>${escapeHtml(cart.currency || 'EUR')}</span>
            <span>${escapeHtml(cart.recovery_sent_at ? 'Recovery sent' : 'Recovery ready')}</span>
          </div>
          <div class="product-actions">
            <button type="button" data-send-recovery="${cart.id}">Send recovery email</button>
          </div>
        </article>
      `).join('')
      : '<p>Nessun carrello abbandonato tracciato.</p>'
    abandonedCartsList.querySelectorAll('[data-send-recovery]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch('/api/admin/abandoned-carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send_recovery', id: Number(button.dataset.sendRecovery) }),
        })
        await response.json()
        loadAbandonedCarts()
      })
    })
  } catch {
    abandonedCartsList.textContent = adminUiText('Abandoned carts non disponibili.')
  }
}
refreshAbandonedCartsButton?.addEventListener('click', loadAbandonedCarts)

async function loadSearchFilters() {
  if (!searchFiltersStatus && !searchFiltersForm) return
  try {
    const response = await fetch('/api/admin/search-filters')
    const data = await response.json()
    if (!response.ok || !data.success) {
      if (searchFiltersStatus) searchFiltersStatus.textContent = data.message || adminUiText('Search config non disponibile.')
      return
    }
    const suggestionsEnabled = String(data.settings?.search_suggestions_enabled ?? '1') !== '0'
    document.querySelector('#searchSuggestionsEnabled').checked = suggestionsEnabled
    document.querySelector('#searchableFields').value = data.settings?.searchable_fields || 'name,description,slug,category'
    document.querySelector('#enabledFilters').value = data.settings?.enabled_filters || 'collection,price,stock'
    if (searchFiltersStatus) {
      searchFiltersStatus.innerHTML = `
        <span>Endpoint pubblico: /api/search?q=</span>
        <span>Suggestions: ${suggestionsEnabled ? 'Active' : 'Disabled'}</span>
        <span>Engine: internal SQL search</span>
      `
    }
  } catch {
    if (searchFiltersStatus) searchFiltersStatus.textContent = adminUiText('Search config non disponibile.')
  }
}

searchFiltersForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (searchFiltersMessage) searchFiltersMessage.textContent = adminUiText('Salvataggio ricerca...')
  try {
    const response = await fetch('/api/admin/search-filters', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        search_suggestions_enabled: document.querySelector('#searchSuggestionsEnabled')?.checked,
        searchable_fields: document.querySelector('#searchableFields')?.value.trim(),
        enabled_filters: document.querySelector('#enabledFilters')?.value.trim(),
      }),
    })
    const data = await response.json()
    if (searchFiltersMessage) searchFiltersMessage.textContent = data.message || adminUiText('Configurazione salvata.')
    if (data.success) loadSearchFilters()
  } catch {
    if (searchFiltersMessage) searchFiltersMessage.textContent = adminUiText('Salvataggio ricerca non riuscito.')
  }
})

function resetSeoRedirectForm() {
  seoRedirectForm?.reset()
  const id = document.querySelector('#seoRedirectId')
  if (id) id.value = ''
  if (cancelSeoRedirectEdit) cancelSeoRedirectEdit.hidden = true
}

function fillSeoRedirectForm(redirect) {
  document.querySelector('#seoRedirectId').value = redirect.id || ''
  document.querySelector('#seoRedirectFrom').value = redirect.from_path || ''
  document.querySelector('#seoRedirectTo').value = redirect.to_path || ''
  document.querySelector('#seoRedirectStatusCode').value = redirect.status_code || 301
  document.querySelector('#seoRedirectActive').checked = Number(redirect.active) !== 0
  if (cancelSeoRedirectEdit) cancelSeoRedirectEdit.hidden = false
}

async function loadSeoTechnical() {
  if (!seoTechnicalStatus && !seoRedirectsList) return
  try {
    const response = await fetch('/api/admin/seo-technical')
    const data = await response.json()
    if (!response.ok || !data.success) {
      if (seoTechnicalStatus) seoTechnicalStatus.textContent = data.message || adminUiText('SEO Technical non disponibile.')
      return
    }
    if (seoTechnicalStatus) {
      seoTechnicalStatus.innerHTML = `
        <span>Sitemap: ${escapeHtml(data.status?.sitemap || 'Ready')}</span>
        <span>Robots: ${escapeHtml(data.status?.robots || 'Ready')}</span>
        <span>Missing meta: ${Number(data.missing_meta?.length || 0)}</span>
        <span>Missing image alt: ${Number(data.missing_alt?.length || 0)}</span>
      `
    }
    const redirects = data.redirects || []
    if (seoRedirectsList) {
      seoRedirectsList.innerHTML = redirects.length
        ? redirects.map((redirect) => `
          <article class="product-item">
            <h3>${escapeHtml(redirect.from_path)} -> ${escapeHtml(redirect.to_path)}</h3>
            <div class="meta">
              <span>${escapeHtml(String(redirect.status_code || 301))}</span>
              <span>${Number(redirect.active) ? 'Active' : 'Inactive'}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-redirect="${redirect.id}">Modifica</button>
              <button type="button" class="danger" data-disable-redirect="${redirect.id}">Disattiva</button>
            </div>
          </article>
        `).join('')
        : '<p>Nessun redirect configurato.</p>'
      seoRedirectsList.querySelectorAll('[data-edit-redirect]').forEach((button) => {
        button.addEventListener('click', () => {
          const redirect = redirects.find((item) => item.id === Number(button.dataset.editRedirect))
          if (redirect) fillSeoRedirectForm(redirect)
        })
      })
      seoRedirectsList.querySelectorAll('[data-disable-redirect]').forEach((button) => {
        button.addEventListener('click', async () => {
          const response = await fetch(`/api/admin/seo-technical?id=${button.dataset.disableRedirect}`, { method: 'DELETE' })
          const data = await response.json()
          if (seoRedirectMessage) seoRedirectMessage.textContent = data.message || adminUiText('Redirect aggiornato.')
          loadSeoTechnical()
        })
      })
    }
  } catch {
    if (seoTechnicalStatus) seoTechnicalStatus.textContent = adminUiText('SEO Technical non disponibile.')
  }
}

seoRedirectForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (seoRedirectMessage) seoRedirectMessage.textContent = adminUiText('Salvataggio redirect...')
  const payload = {
    id: Number(document.querySelector('#seoRedirectId')?.value || 0) || undefined,
    from_path: document.querySelector('#seoRedirectFrom')?.value.trim(),
    to_path: document.querySelector('#seoRedirectTo')?.value.trim(),
    status_code: Number(document.querySelector('#seoRedirectStatusCode')?.value || 301),
    active: document.querySelector('#seoRedirectActive')?.checked,
  }
  try {
    const response = await fetch('/api/admin/seo-technical', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (seoRedirectMessage) seoRedirectMessage.textContent = data.message || adminUiText('Redirect salvato.')
    if (data.success) {
      resetSeoRedirectForm()
      loadSeoTechnical()
    }
  } catch {
    if (seoRedirectMessage) seoRedirectMessage.textContent = adminUiText('Salvataggio redirect non riuscito.')
  }
})
cancelSeoRedirectEdit?.addEventListener('click', resetSeoRedirectForm)

function resetWebhookForm() {
  webhookForm?.reset()
  const id = document.querySelector('#webhookId')
  if (id) id.value = ''
  if (cancelWebhookEdit) cancelWebhookEdit.hidden = true
}

function fillWebhookForm(webhook) {
  document.querySelector('#webhookId').value = webhook.id || ''
  document.querySelector('#webhookEvent').value = webhook.event || 'order.created'
  document.querySelector('#webhookTargetUrl').value = webhook.target_url || ''
  document.querySelector('#webhookSecret').value = ''
  document.querySelector('#webhookActive').checked = Number(webhook.active) !== 0
  if (cancelWebhookEdit) cancelWebhookEdit.hidden = false
}

async function loadWebhooks() {
  if (!webhooksList && !webhookDeliveriesList) return
  try {
    const response = await fetch('/api/admin/webhooks')
    const data = await response.json()
    if (!response.ok || !data.success) {
      if (webhooksList) webhooksList.textContent = data.message || adminUiText('Webhooks non disponibili.')
      return
    }
    const webhooks = data.webhooks || []
    if (webhooksList) {
      webhooksList.innerHTML = webhooks.length
        ? webhooks.map((webhook) => `
          <article class="product-item">
            <h3>${escapeHtml(webhook.event)}</h3>
            <p>${escapeHtml(webhook.target_url || '')}</p>
            <div class="meta">
              <span>${Number(webhook.active) ? 'Active' : 'Inactive'}</span>
              <span>${webhook.has_secret ? 'Secret set' : 'No secret'}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-webhook="${webhook.id}">Modifica</button>
              <button type="button" data-test-webhook="${webhook.id}">Test log</button>
              <button type="button" class="danger" data-disable-webhook="${webhook.id}">Disattiva</button>
            </div>
          </article>
        `).join('')
        : '<p>Nessun webhook configurato.</p>'
      webhooksList.querySelectorAll('[data-edit-webhook]').forEach((button) => {
        button.addEventListener('click', () => {
          const webhook = webhooks.find((item) => item.id === Number(button.dataset.editWebhook))
          if (webhook) fillWebhookForm(webhook)
        })
      })
      webhooksList.querySelectorAll('[data-test-webhook]').forEach((button) => {
        button.addEventListener('click', async () => {
          await fetch('/api/admin/webhooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'test', id: Number(button.dataset.testWebhook) }),
          })
          loadWebhooks()
        })
      })
      webhooksList.querySelectorAll('[data-disable-webhook]').forEach((button) => {
        button.addEventListener('click', async () => {
          const response = await fetch(`/api/admin/webhooks?id=${button.dataset.disableWebhook}`, { method: 'DELETE' })
          const data = await response.json()
          if (webhookMessage) webhookMessage.textContent = data.message || adminUiText('Webhook aggiornato.')
          loadWebhooks()
        })
      })
    }
    if (webhookDeliveriesList) {
      webhookDeliveriesList.textContent = (data.deliveries || [])
        .map((delivery) => `${delivery.created_at || ''} - ${delivery.event || ''} - ${delivery.status || ''}`)
        .join('\n') || 'Nessun delivery log.'
    }
  } catch {
    if (webhooksList) webhooksList.textContent = adminUiText('Webhooks non disponibili.')
  }
}

webhookForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (webhookMessage) webhookMessage.textContent = adminUiText('Salvataggio webhook...')
  const payload = {
    id: Number(document.querySelector('#webhookId')?.value || 0) || undefined,
    event: document.querySelector('#webhookEvent')?.value,
    target_url: document.querySelector('#webhookTargetUrl')?.value.trim(),
    secret: document.querySelector('#webhookSecret')?.value,
    active: document.querySelector('#webhookActive')?.checked,
  }
  try {
    const response = await fetch('/api/admin/webhooks', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (webhookMessage) webhookMessage.textContent = data.message || adminUiText('Webhook salvato.')
    if (data.success) {
      resetWebhookForm()
      loadWebhooks()
    }
  } catch {
    if (webhookMessage) webhookMessage.textContent = adminUiText('Salvataggio webhook non riuscito.')
  }
})
refreshWebhooksButton?.addEventListener('click', loadWebhooks)
cancelWebhookEdit?.addEventListener('click', resetWebhookForm)

function resetSupplierFeedForm() {
  supplierFeedForm?.reset()
  const id = document.querySelector('#supplierFeedId')
  if (id) id.value = ''
  if (cancelSupplierFeedEdit) cancelSupplierFeedEdit.hidden = true
}

function fillSupplierFeedForm(feed) {
  document.querySelector('#supplierFeedId').value = feed.id || ''
  document.querySelector('#supplierFeedName').value = feed.name || ''
  document.querySelector('#supplierFeedSourceUrl').value = feed.source_url || ''
  document.querySelector('#supplierFeedFormat').value = feed.format || 'csv'
  document.querySelector('#supplierFeedSchedule').value = feed.schedule || 'manual'
  document.querySelector('#supplierFeedTarget').value = feed.import_target || 'products'
  document.querySelector('#supplierFeedActive').checked = Number(feed.active) !== 0
  if (cancelSupplierFeedEdit) cancelSupplierFeedEdit.hidden = false
}

async function loadSupplierFeeds() {
  if (!supplierFeedsList && !supplierFeedRunsList) return
  try {
    const response = await fetch('/api/admin/supplier-feeds')
    const data = await response.json()
    if (!response.ok || !data.success) {
      if (supplierFeedsList) supplierFeedsList.textContent = data.message || adminUiText('Supplier feeds non disponibili.')
      return
    }
    const feeds = data.feeds || []
    if (supplierFeedsList) {
      supplierFeedsList.innerHTML = feeds.length
        ? feeds.map((feed) => `
          <article class="product-item">
            <h3>${escapeHtml(feed.name)}</h3>
            <p>${escapeHtml(feed.source_url || '')}</p>
            <div class="meta">
              <span>${escapeHtml(feed.format || 'csv')}</span>
              <span>${escapeHtml(feed.schedule || 'manual')}</span>
              <span>${escapeHtml(feed.import_target || 'products')}</span>
              <span>${Number(feed.active) ? 'Active' : 'Inactive'}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-supplier-feed="${feed.id}">Modifica</button>
              <button type="button" class="danger" data-disable-supplier-feed="${feed.id}">Disattiva</button>
            </div>
          </article>
        `).join('')
        : '<p>Nessun feed fornitore configurato.</p>'
      supplierFeedsList.querySelectorAll('[data-edit-supplier-feed]').forEach((button) => {
        button.addEventListener('click', () => {
          const feed = feeds.find((item) => item.id === Number(button.dataset.editSupplierFeed))
          if (feed) fillSupplierFeedForm(feed)
        })
      })
      supplierFeedsList.querySelectorAll('[data-disable-supplier-feed]').forEach((button) => {
        button.addEventListener('click', async () => {
          const response = await fetch(`/api/admin/supplier-feeds?id=${button.dataset.disableSupplierFeed}`, { method: 'DELETE' })
          const data = await response.json()
          if (supplierFeedMessage) supplierFeedMessage.textContent = data.message || adminUiText('Feed aggiornato.')
          loadSupplierFeeds()
        })
      })
    }
    if (supplierFeedRunsList) {
      supplierFeedRunsList.textContent = (data.runs || [])
        .map((run) => `${run.created_at || ''} - feed ${run.feed_id || ''} - ${run.status || ''} - ${run.message || ''}`)
        .join('\n') || 'Nessun dry-run ancora registrato.'
    }
  } catch {
    if (supplierFeedsList) supplierFeedsList.textContent = adminUiText('Supplier feeds non disponibili.')
  }
}

function supplierFeedPayload() {
  return {
    id: Number(document.querySelector('#supplierFeedId')?.value || 0) || undefined,
    name: document.querySelector('#supplierFeedName')?.value.trim(),
    source_url: document.querySelector('#supplierFeedSourceUrl')?.value.trim(),
    format: document.querySelector('#supplierFeedFormat')?.value,
    schedule: document.querySelector('#supplierFeedSchedule')?.value,
    import_target: document.querySelector('#supplierFeedTarget')?.value,
    active: document.querySelector('#supplierFeedActive')?.checked,
  }
}

supplierFeedForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (supplierFeedMessage) supplierFeedMessage.textContent = adminUiText('Salvataggio feed...')
  const payload = supplierFeedPayload()
  try {
    const response = await fetch('/api/admin/supplier-feeds', {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (supplierFeedMessage) supplierFeedMessage.textContent = data.message || adminUiText('Feed salvato.')
    if (data.success) {
      resetSupplierFeedForm()
      loadSupplierFeeds()
    }
  } catch {
    if (supplierFeedMessage) supplierFeedMessage.textContent = adminUiText('Salvataggio feed non riuscito.')
  }
})

runSupplierFeedDryRunButton?.addEventListener('click', async () => {
  if (supplierFeedMessage) supplierFeedMessage.textContent = adminUiText('Dry-run feed...')
  const payload = supplierFeedPayload()
  try {
    const response = await fetch('/api/admin/supplier-feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dry_run', ...payload }),
    })
    const data = await response.json()
    if (supplierFeedMessage) supplierFeedMessage.textContent = data.message || adminUiText('Dry-run completato.')
    loadSupplierFeeds()
  } catch {
    if (supplierFeedMessage) supplierFeedMessage.textContent = adminUiText('Dry-run non riuscito.')
  }
})
cancelSupplierFeedEdit?.addEventListener('click', resetSupplierFeedForm)

async function loadSubscriptions() {
  if (!subscriptionsList) return
  subscriptionsList.textContent = adminUiText('Caricamento subscriptions...')
  try {
    const response = await fetch('/api/admin/subscriptions')
    const data = await response.json()
    if (!response.ok || !data.success) {
      subscriptionsList.textContent = data.message || adminUiText('Subscriptions non disponibili.')
      return
    }
    const subscriptions = data.subscriptions || []
    subscriptionsList.innerHTML = subscriptions.length
      ? subscriptions.map((item) => `
        <article class="product-item">
          <h3>${escapeHtml(item.product_name || `Product ${item.product_id}`)}</h3>
          <p>${escapeHtml(item.frequency || 'monthly')} - ${formatMoney(item.subscription_price_cents || 0)}</p>
          <div class="meta">
            <span>${Number(item.active) ? 'Active' : 'Inactive'}</span>
            <span>Trial ${Number(item.trial_days || 0)} days</span>
          </div>
        </article>
      `).join('')
      : '<p>Nessun prodotto subscription configurato.</p>'
  } catch {
    subscriptionsList.textContent = adminUiText('Subscriptions non disponibili.')
  }
}

subscriptionForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (subscriptionMessage) subscriptionMessage.textContent = adminUiText('Salvataggio subscription...')
  try {
    const response = await fetch('/api/admin/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: Number(document.querySelector('#subscriptionProductId')?.value || 0),
        frequency: document.querySelector('#subscriptionFrequency')?.value,
        subscription_price: Number(document.querySelector('#subscriptionPrice')?.value || 0),
        trial_days: Number(document.querySelector('#subscriptionTrialDays')?.value || 0),
        active: document.querySelector('#subscriptionActive')?.checked,
      }),
    })
    const data = await response.json()
    if (subscriptionMessage) subscriptionMessage.textContent = data.message || adminUiText('Subscription salvata.')
    if (data.success) loadSubscriptions()
  } catch {
    if (subscriptionMessage) subscriptionMessage.textContent = adminUiText('Salvataggio subscription non riuscito.')
  }
})

downloadBackupButton?.addEventListener('click', async () => {
  if (!backupPreview) return
  backupPreview.textContent = adminUiText('Generazione backup...')
  try {
    const response = await fetch('/api/admin/backup')
    const data = await response.json()
    if (!response.ok || !data.success) {
      backupPreview.textContent = data.message || adminUiText('Backup non disponibile.')
      return
    }
    const text = JSON.stringify(data.backup, null, 2)
    backupPreview.textContent = text
    downloadTextFile(`takeoff-backup-${new Date().toISOString().slice(0, 10)}.json`, text)
  } catch {
    backupPreview.textContent = adminUiText('Backup non riuscito.')
  }
})

// ===============================
// COLLEZIONI
// ===============================

const collectionsList = document.querySelector('#collectionsList')
const collectionForm = document.querySelector('#collectionForm')
const collectionMessage = document.querySelector('#collectionMessage')
const refreshCollectionsButton = document.querySelector('#refreshCollectionsButton')
const collectionFormTitle = document.querySelector('#collectionFormTitle')
const collectionSubmitButton = document.querySelector('#collectionSubmitButton')
const cancelCollectionEdit = document.querySelector('#cancelCollectionEdit')
const productCollectionSelect = document.querySelector('#collection_slug')
const collectionAdminSearch = document.querySelector('#collectionAdminSearch')

let collectionsCache = []

function renderProductCollectionOptions(selectedValue = '') {
  productCollectionSelect.innerHTML = `
    <option value="">${escapeHtml(t('collections.noCollection', 'Senza collezione'))}</option>
    ${collectionsCache
      .map(
        (collection) => `
          <option value="${escapeHtml(collection.slug)}">
            ${escapeHtml(collection.name)}
          </option>
        `,
      )
      .join('')}
  `

  productCollectionSelect.value = selectedValue
}

function resetCollectionForm() {
  collectionForm.reset()
  document.querySelector('#collectionId').value = ''
  fillSeoFields('collection')
  collectionFormTitle.textContent = t('collections.add', 'Aggiungi collezione')
  collectionSubmitButton.textContent = t('collections.save', 'Salva collezione')
  cancelCollectionEdit.hidden = true
  collectionMessage.textContent = adminUiText('')
}

function fillCollectionForm(collection) {
  document.querySelector('#collectionId').value = collection.id
  document.querySelector('#collectionName').value = collection.name || ''
  document.querySelector('#collectionSlug').value = collection.slug || ''
  document.querySelector('#collectionDescription').value = collection.description || ''
  document.querySelector('#collectionImageUrl').value = collection.image_url || ''
  fillSeoFields('collection', collection.seo || {})

  collectionFormTitle.textContent = t('collections.edit', 'Modifica collezione')
  collectionSubmitButton.textContent = t('collections.update', 'Aggiorna collezione')
  cancelCollectionEdit.hidden = false
}

function getFormCollection() {
  return {
    id: document.querySelector('#collectionId').value,
    name: document.querySelector('#collectionName').value.trim(),
    slug: document.querySelector('#collectionSlug').value.trim(),
    description: document.querySelector('#collectionDescription').value.trim(),
    image_url: document.querySelector('#collectionImageUrl').value.trim(),
    seo: readSeoFields('collection'),
  }
}

async function loadCollections() {
  renderAdminListState(collectionsList, t('collections.loading', 'Caricamento collezioni...'), 'loading')

  try {
    const response = await fetch('/api/admin/collections')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(collectionsList, t('collections.loadError', 'Errore nel caricamento collezioni.'), 'error')
      return
    }

    collectionsCache = data.collections || []
    setAdminDashboardCount('collections', collectionsCache.length)
    renderProductCollectionOptions(document.querySelector('#collection_slug').value)

    if (data.collections.length === 0) {
      renderAdminListState(collectionsList, t('collections.empty', 'Nessuna collezione trovata.'))
      return
    }

    const search = normalizeAdminSearch(collectionAdminSearch?.value)
    const visibleCollections = data.collections.filter((collection) =>
      adminItemMatchesSearch(collection, search, ['name', 'slug', 'description']),
    )

    if (!visibleCollections.length) {
      renderAdminListState(collectionsList, t('collections.noSearchResults', 'Nessuna collezione corrisponde alla ricerca.'))
      return
    }

    collectionsList.innerHTML = visibleCollections
      .map(
        (collection) => `
          <article class="product-item">
            <h3>${escapeHtml(collection.name)}</h3>
            <p>${escapeHtml(collection.description || t('collections.noDescription', 'Nessuna descrizione'))}</p>

            <div class="meta">
              <span>Slug: ${escapeHtml(collection.slug)}</span>
              <span>ID: ${collection.id}</span>
            </div>

            <div class="product-actions">
              <button type="button" data-edit-collection="${collection.id}">${escapeHtml(t('common.edit', 'Modifica'))}</button>
              <button type="button" class="danger" data-delete-collection="${collection.id}">${escapeHtml(t('common.delete', 'Elimina'))}</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-collection]').forEach((button) => {
      button.addEventListener('click', () => {
        const collection = data.collections.find(
          (item) => item.id === Number(button.dataset.editCollection),
        )

        fillCollectionForm(collection)
      })
    })

    document.querySelectorAll('[data-delete-collection]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm(t('collections.deleteConfirm', 'Vuoi eliminare questa collezione?'))
        if (!confirmed) return

        const response = await fetch('/api/admin/collections', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.deleteCollection),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || t('collections.deleteError', 'Errore durante eliminazione collezione.'))
          return
        }

        resetCollectionForm()
        loadCollections()
      })
    })
    applyAdminLanguage()
  } catch (error) {
    renderAdminListState(collectionsList, t('collections.connectionError', 'Errore di connessione collezioni.'), 'error')
  }
}

collectionForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  collectionMessage.textContent = t('collections.saving', 'Salvataggio in corso...')

  const collection = getFormCollection()
  const isEditing = Boolean(collection.id)

  try {
    const response = await fetch('/api/admin/collections', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collection),
    })

    const data = await response.json()

    if (!data.success) {
      collectionMessage.textContent = data.message || t('pages.saveError', 'Errore nel salvataggio.')
      return
    }

    collectionMessage.textContent = isEditing
      ? t('collections.updated', 'Collezione aggiornata correttamente.')
      : t('collections.saved', 'Collezione salvata correttamente.')

    resetCollectionForm()
    loadCollections()
    loadMenuResources()
  } catch (error) {
    collectionMessage.textContent = t('collections.connectionError', 'Errore di connessione collezioni.')
  }
})

cancelCollectionEdit.addEventListener('click', resetCollectionForm)
refreshCollectionsButton.addEventListener('click', loadCollections)
collectionAdminSearch?.addEventListener('input', loadCollections)

loadCollections()

// ===============================
// PAGINE
// ===============================

const pagesList = document.querySelector('#pagesList')
const pageForm = document.querySelector('#pageForm')
const pageMessage = document.querySelector('#pageMessage')
const refreshPagesButton = document.querySelector('#refreshPagesButton')
const pageFormTitle = document.querySelector('#pageFormTitle')
const pageSubmitButton = document.querySelector('#pageSubmitButton')
const cancelPageEdit = document.querySelector('#cancelPageEdit')

function resetPageForm() {
  pageForm.reset()
  document.querySelector('#pageId').value = ''
  fillSeoFields('page')
  pageFormTitle.textContent = t('pages.addTitle', 'Aggiungi pagina')
  pageSubmitButton.textContent = t('pages.save', 'Salva pagina')
  cancelPageEdit.hidden = true
  pageMessage.textContent = adminUiText('')
}

function fillPageForm(page) {
  document.querySelector('#pageId').value = page.id
  document.querySelector('#pageTitle').value = page.title || ''
  document.querySelector('#pageSlug').value = page.slug || ''
  fillSeoFields('page', page.seo || {})

  pageFormTitle.textContent = t('pages.editTitle', 'Modifica pagina')
  pageSubmitButton.textContent = t('pages.update', 'Aggiorna pagina')
  cancelPageEdit.hidden = false
}

function getFormPage() {
  return {
    id: document.querySelector('#pageId').value,
    title: document.querySelector('#pageTitle').value.trim(),
    slug: document.querySelector('#pageSlug').value.trim(),
    seo: readSeoFields('page'),
  }
}

async function loadPages() {
  pagesList.textContent = t('pages.loading', 'Caricamento pagine...')

  try {
    const response = await fetch('/api/admin/pages')
    const data = await response.json()

    if (!data.success) {
      pagesList.textContent = t('pages.loadError', 'Errore nel caricamento pagine.')
      return
    }

    if (data.pages.length === 0) {
      pagesList.textContent = t('pages.empty', 'Nessuna pagina trovata.')
      return
    }

    pagesList.innerHTML = data.pages
      .map(
        (page) => `
          <article class="product-item">
            <h3>${escapeHtml(page.title)}</h3>

            <div class="meta">
              <span>Slug: ${escapeHtml(page.slug)}</span>
              <span>ID: ${page.id}</span>
            </div>

            <div class="product-actions">
              <button type="button" data-edit-page="${page.id}">${escapeHtml(t('common.edit', 'Modifica'))}</button>

              <button type="button" data-edit-page-sections="${escapeHtml(page.slug)}">
                ${escapeHtml(t('pages.editSections', 'Modifica sezioni'))}
              </button>

              ${
                page.slug === 'home'
                  ? `<button type="button" class="secondary" disabled>${escapeHtml(t('pages.protectedHomepage', 'Homepage protetta'))}</button>`
                  : `<button type="button" class="danger" data-delete-page="${page.id}">${escapeHtml(t('common.delete', 'Elimina'))}</button>`
              }
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-page]').forEach((button) => {
      button.addEventListener('click', () => {
        const page = data.pages.find((item) => item.id === Number(button.dataset.editPage))
        fillPageForm(page)
      })
    })

    document.querySelectorAll('[data-edit-page-sections]').forEach((button) => {
      button.addEventListener('click', async () => {
        currentEditorPageSlug = button.dataset.editPageSections || 'home'

        if (editorPageSelect) {
          editorPageSelect.value = currentEditorPageSlug
        }

        selectedSectionId = null
        updateEditorPreviewUrl()
        await loadSections()

        window.location.hash = 'editor'
      })
    })

    document.querySelectorAll('[data-delete-page]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm(t('pages.deleteConfirm', 'Vuoi eliminare questa pagina?'))
        if (!confirmed) return

        const response = await fetch('/api/admin/pages', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.deletePage),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || t('pages.deleteError', 'Errore durante eliminazione pagina.'))
          return
        }

        resetPageForm()
        loadPages()
        loadEditorPages()
        loadMenuResources()
      })
    })
    applyAdminLanguage()
  } catch (error) {
    pagesList.textContent = t('pages.connectionError', 'Errore di connessione alla API pagine.')
  }
}

pageForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  pageMessage.textContent = t('pages.saveProgress', 'Salvataggio in corso...')

  const page = getFormPage()
  const isEditing = Boolean(page.id)

  try {
    const response = await fetch('/api/admin/pages', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(page),
    })

    const data = await response.json()

    if (!data.success) {
      pageMessage.textContent = data.message || t('pages.saveError', 'Errore nel salvataggio.')
      return
    }

    pageMessage.textContent = isEditing
      ? t('pages.updated', 'Pagina aggiornata correttamente.')
      : t('pages.saved', 'Pagina salvata correttamente.')

    resetPageForm()
    loadPages()
    loadEditorPages()
    loadMenuResources()
  } catch (error) {
    pageMessage.textContent = t('common.connectionError', 'Errore di connessione.')
  }
})

cancelPageEdit.addEventListener('click', resetPageForm)
refreshPagesButton.addEventListener('click', loadPages)

loadPages()

// ===============================
// NAVIGAZIONE ADMIN A VISTE
// ===============================

function setupAdminViews() {
  const views = Array.from(document.querySelectorAll('[data-admin-view]'))
  const viewHost = views[0]?.parentElement || adminApp
  const hubLinks = document.querySelectorAll('.hub-card')
  let singlePageMounted = false

  adminViewRegistry = new Map(views.map((view) => [view.dataset.adminView, view]))
  upgradeAdminRouteLinks(document)

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#"]')
    if (!link) return

    const href = link.getAttribute('href') || ''
    const canonical = getCanonicalAdminHref(href)
    if (!canonical || canonical === href) return

    event.preventDefault()
    window.location.hash = canonical
  })

  function getRegisteredView(viewId) {
    return adminViewRegistry.get(viewId) || document.querySelector(`[data-admin-view="${viewId}"]`)
  }

  function updateCurrentViewLabel(activeView) {
    if (!adminCurrentView) return

    const target = getRegisteredView(activeView)
    const heading =
      target?.querySelector('.view-heading h2, .section-title h2, h2')?.textContent?.trim() ||
      'Dashboard'

    adminCurrentView.textContent = heading
  }

  function renderAdminPageChrome(target, activeView, routePath) {
    if (!target) return

    const primaryRoute = getAdminPrimaryRouteForView(activeView)
    const isDashboard = activeView === 'dashboard'
    const isHubPage = getAdminRouteForView(activeView) === primaryRoute
    let chrome = target.querySelector(':scope > .admin-page-chrome')

    target.classList.toggle('admin-hub-page', isHubPage && !isDashboard)
    target.classList.toggle('admin-detail-page', !isHubPage && !isDashboard)

    if (isDashboard) {
      chrome?.remove()
      return
    }

    if (!chrome) {
      chrome = document.createElement('div')
      chrome.className = 'admin-page-chrome'
      target.prepend(chrome)
    }

    const title =
      target.querySelector('.view-heading h2, .section-title h2, h2')?.textContent?.trim() ||
      adminT(ADMIN_PRIMARY_ROUTE_KEYS[primaryRoute] || 'navDashboard', 'Dashboard')
    const areaLabel = adminT(ADMIN_PRIMARY_ROUTE_KEYS[primaryRoute] || 'navDashboard', primaryRoute)
    const backLink = !isHubPage
      ? `<a class="admin-page-back" href="#/${escapeHtml(primaryRoute)}">${escapeHtml(adminT('common.back', 'Torna'))}</a>`
      : ''

    chrome.innerHTML = `
      <nav class="admin-breadcrumb" aria-label="Breadcrumb">
        <span>${escapeHtml(adminT('breadcrumb.admin', 'Admin'))}</span>
        <span>${escapeHtml(areaLabel)}</span>
        ${!isHubPage ? `<span>${escapeHtml(title)}</span>` : ''}
      </nav>
      ${backLink}
    `
  }

  function mountActiveView(activeView) {
    const activeElement = getRegisteredView(activeView) || getRegisteredView('dashboard')
    if (!activeElement || !viewHost) return activeElement

    views.forEach((view) => {
      const isActive = view === activeElement
      view.hidden = !isActive

      if (singlePageMounted && !isActive && view.parentElement === viewHost) {
        view.remove()
      }
    })

    if (singlePageMounted && activeElement.parentElement !== viewHost) {
      viewHost.appendChild(activeElement)
    }

    activeElement.hidden = false
    return activeElement
  }

  function openViewFromHash({ skipScroll = false, load = true } = {}) {
    const routePath = normalizeAdminRoutePath()
    const activeView = getAdminViewForRoute(routePath)
    const canonicalHash = `#/${routePath}`

    if (window.location.hash !== canonicalHash) {
      window.history.replaceState(null, '', canonicalHash)
    }

    const target = mountActiveView(activeView)
    const activeHubHash = `#/${getAdminPrimaryRouteForView(activeView)}`

    hubLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === activeHubHash)
    })

    applyAdminLanguage()
    renderAdminPageChrome(target, activeView, routePath)
    updateCurrentViewLabel(activeView)
    upgradeAdminRouteLinks(target || document)
    applyAdminAuditUi()
    if (load) rerenderActiveAdminView()
    if (!skipScroll) {
      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  window.addEventListener('hashchange', openViewFromHash)
  openViewFromHash({ load: false, skipScroll: true })
  window.setTimeout(() => {
    singlePageMounted = true
    openViewFromHash({ load: false, skipScroll: true })
  }, 0)
}

setupAdminViews()
enhanceAppDetailShells()

function readJsonTextarea(selector, fallback = {}) {
  const value = document.querySelector(selector)?.value.trim()
  if (!value) return fallback

  try {
    return JSON.parse(value)
  } catch {
    throw new Error('JSON non valido.')
  }
}

function stringifyForTextarea(value, fallback = {}) {
  return JSON.stringify(value || fallback, null, 2)
}

// ===============================
// POLICY
// ===============================

const policyForm = document.querySelector('#policyForm')
const policiesList = document.querySelector('#policiesList')
const policyMessage = document.querySelector('#policyMessage')
const refreshPoliciesButton = document.querySelector('#refreshPoliciesButton')
const policyFormTitle = document.querySelector('#policyFormTitle')
const policySubmitButton = document.querySelector('#policySubmitButton')
const cancelPolicyEdit = document.querySelector('#cancelPolicyEdit')

function resetPolicyForm() {
  if (!policyForm) return
  policyForm.reset()
  document.querySelector('#policyId').value = ''
  policyFormTitle.textContent = t('policies.add', 'Aggiungi policy')
  policySubmitButton.textContent = t('policies.save', 'Salva policy')
  cancelPolicyEdit.hidden = true
  policyMessage.textContent = adminUiText('')
}

function fillPolicyForm(policy) {
  document.querySelector('#policyId').value = policy.id
  document.querySelector('#policyType').value = policy.type || 'privacy_policy'
  document.querySelector('#policyTitle').value = policy.title || ''
  document.querySelector('#policySlug').value = policy.slug || ''
  document.querySelector('#policyContent').value = policy.content || ''
  document.querySelector('#policyStatus').value = policy.status || 'draft'
  policyFormTitle.textContent = t('policies.edit', 'Modifica policy')
  policySubmitButton.textContent = t('policies.update', 'Aggiorna policy')
  cancelPolicyEdit.hidden = false
}

function readPolicyPayload() {
  return {
    id: document.querySelector('#policyId').value,
    type: document.querySelector('#policyType').value,
    title: document.querySelector('#policyTitle').value.trim(),
    slug: document.querySelector('#policySlug').value.trim(),
    content: document.querySelector('#policyContent').value.trim(),
    status: document.querySelector('#policyStatus').value,
  }
}

async function loadPoliciesAdmin() {
  if (!policiesList) return
  policiesList.textContent = adminUiText('Caricamento policy...')

  try {
    const response = await fetch('/api/admin/policies')
    const data = await response.json()

    if (!data.success) {
      policiesList.textContent = data.message || adminUiText('Errore caricamento policy.')
      return
    }

    policiesList.innerHTML = data.policies.length
      ? data.policies
          .map(
            (policy) => `
              <article class="product-item">
                <h3>${escapeHtml(policy.title)}</h3>
                <p>${escapeHtml(policy.type)} / ${escapeHtml(policy.slug)}</p>
                <div class="meta">
                  <span>${escapeHtml(policy.status)}</span>
                  <span>${escapeHtml(policy.updated_at || '')}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-policy="${policy.id}">${escapeHtml(t('common.edit', 'Modifica'))}</button>
                  <a class="button-link" href="/policies/${escapeHtml(policy.slug)}" target="_blank" rel="noreferrer">${escapeHtml(t('common.open', 'Apri'))}</a>
                  <button type="button" class="danger" data-unpublish-policy="${policy.id}">${escapeHtml(t('common.draft', 'Bozza'))}</button>
                </div>
              </article>
            `,
          )
          .join('')
      : adminUiText('Nessuna policy.')

    document.querySelectorAll('[data-edit-policy]').forEach((button) => {
      button.addEventListener('click', () => {
        const policy = data.policies.find((item) => item.id === Number(button.dataset.editPolicy))
        fillPolicyForm(policy)
      })
    })

    document.querySelectorAll('[data-unpublish-policy]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/policies', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.unpublishPolicy) }),
        })
        resetPolicyForm()
        loadPoliciesAdmin()
      })
    })
  } catch {
    policiesList.textContent = adminUiText('Errore di connessione policy.')
  }
}

policyForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  policyMessage.textContent = adminUiText('Salvataggio policy...')
  const payload = readPolicyPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/policies', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    policyMessage.textContent = data.message || adminUiText('Policy salvata.')
    if (data.success) {
      resetPolicyForm()
      loadPoliciesAdmin()
    }
  } catch {
    policyMessage.textContent = adminUiText('Errore di connessione policy.')
  }
})

cancelPolicyEdit?.addEventListener('click', resetPolicyForm)
refreshPoliciesButton?.addEventListener('click', loadPoliciesAdmin)
loadPoliciesAdmin()

// ===============================
// TRANSLATION MANAGER
// ===============================

const translationForm = document.querySelector('#translationForm')
const translationLocale = document.querySelector('#translationLocale')
const translationEntityType = document.querySelector('#translationEntityType')
const translationEntitySelect = document.querySelector('#translationEntitySelect')
const translationFieldSelect = document.querySelector('#translationFieldSelect')
const translationId = document.querySelector('#translationId')
const translationSourceValue = document.querySelector('#translationSourceValue')
const translationTranslatedValue = document.querySelector('#translationTranslatedValue')
const translationStatus = document.querySelector('#translationStatus')
const translationMessage = document.querySelector('#translationMessage')
const translationsList = document.querySelector('#translationsList')
const refreshTranslationsButton = document.querySelector('#refreshTranslationsButton')
const deleteTranslationButton = document.querySelector('#deleteTranslationButton')

const translationConfigs = {
  product: {
    label: 'Prodotti',
    endpoint: '/api/products',
    listKey: 'products',
    fields: [
      ['name', 'Nome'],
      ['description', 'Descrizione'],
      ['seo.meta_title', 'SEO title'],
      ['seo.meta_description', 'SEO description'],
    ],
    title: (item) => item.name || item.slug || `Prodotto #${item.id}`,
  },
  collection: {
    label: 'Collezioni',
    endpoint: '/api/collections',
    listKey: 'collections',
    fields: [
      ['name', 'Nome'],
      ['description', 'Descrizione'],
      ['seo.meta_title', 'SEO title'],
      ['seo.meta_description', 'SEO description'],
    ],
    title: (item) => item.name || item.slug || `Collezione #${item.id}`,
  },
  page: {
    label: 'Pagine',
    endpoint: '/api/pages',
    listKey: 'pages',
    fields: [
      ['title', 'Titolo'],
      ['seo.meta_title', 'SEO title'],
      ['seo.meta_description', 'SEO description'],
    ],
    title: (item) => item.title || item.slug || `Pagina #${item.id}`,
  },
  section: {
    label: 'Sezioni',
    fields: [
      ['data.eyebrow', 'Eyebrow'],
      ['data.title', 'Titolo'],
      ['data.subtitle', 'Sottotitolo'],
      ['data.text', 'Testo'],
      ['data.button_text', 'Testo bottone'],
      ['data.question', 'FAQ domanda'],
      ['data.answer', 'FAQ risposta'],
    ],
    title: (item) => `${item.page_slug || 'home'} / ${item.type || 'section'} #${item.id}`,
  },
  blog: {
    label: 'Blog',
    endpoint: '/api/admin/blog',
    listKey: 'posts',
    fields: [
      ['title', 'Titolo'],
      ['excerpt', 'Excerpt'],
      ['content', 'Contenuto'],
      ['meta_title', 'SEO title'],
      ['meta_description', 'SEO description'],
    ],
    title: (item) => item.title || item.slug || `Blog #${item.id}`,
  },
  policy: {
    label: 'Policy',
    endpoint: '/api/admin/policies',
    listKey: 'policies',
    fields: [
      ['title', 'Titolo'],
      ['content', 'Contenuto'],
    ],
    title: (item) => item.title || item.slug || `Policy #${item.id}`,
  },
}

const translationState = {
  resources: [],
  translations: [],
}

function getNestedValue(source = {}, path = '') {
  return path.split('.').reduce((value, key) => {
    if (value === null || value === undefined) return ''
    return value[key]
  }, source) || ''
}

function getTranslationConfig() {
  return translationConfigs[translationEntityType?.value || 'product'] || translationConfigs.product
}

function translateAdminConfigLabel(label = '') {
  return getAdminStaticTranslation(label) ?? label
}

function getCurrentTranslationResource() {
  const id = Number(translationEntitySelect?.value || 0)
  return translationState.resources.find((item) => Number(item.id) === id)
}

function getCurrentTranslationRecord(fieldKey = translationFieldSelect?.value || '') {
  const locale = translationLocale?.value || 'en'
  const entityType = translationEntityType?.value || 'product'
  const resource = getCurrentTranslationResource()
  if (!resource || !fieldKey) return null

  return translationState.translations.find(
    (translation) =>
      translation.locale === locale &&
      translation.entity_type === entityType &&
      Number(translation.entity_id) === Number(resource.id) &&
      translation.field_key === fieldKey,
  )
}

function renderTranslationFields() {
  if (!translationFieldSelect) return
  const config = getTranslationConfig()

  translationFieldSelect.innerHTML = config.fields
    .map(([key, label]) => `<option value="${escapeHtml(key)}">${escapeHtml(translateAdminConfigLabel(label))}</option>`)
    .join('')
}

function renderTranslationResources() {
  if (!translationEntitySelect) return
  const config = getTranslationConfig()

  translationEntitySelect.innerHTML = translationState.resources.length
    ? translationState.resources
        .map(
          (item) => `
            <option value="${escapeHtml(item.id)}">${escapeHtml(config.title(item))}</option>
          `,
        )
        .join('')
    : `<option value="">${escapeHtml(t('translations.noItems', 'Nessun elemento disponibile'))}</option>`
}

function renderTranslationEditor() {
  const resource = getCurrentTranslationResource()
  const fieldKey = translationFieldSelect?.value || ''
  const record = getCurrentTranslationRecord(fieldKey)

  if (!resource || !fieldKey) {
    if (translationId) translationId.value = ''
    if (translationSourceValue) translationSourceValue.value = ''
    if (translationTranslatedValue) translationTranslatedValue.value = ''
    if (deleteTranslationButton) deleteTranslationButton.disabled = true
    return
  }

  if (translationId) translationId.value = record?.id || ''
  if (translationSourceValue) translationSourceValue.value = String(getNestedValue(resource, fieldKey) || '')
  if (translationTranslatedValue) translationTranslatedValue.value = record?.translated_value || ''
  if (translationStatus) translationStatus.value = record?.status || 'active'
  if (deleteTranslationButton) deleteTranslationButton.disabled = !record?.id
}

function renderTranslationsList() {
  if (!translationsList) return
  const config = getTranslationConfig()
  const resource = getCurrentTranslationResource()

  if (!resource) {
    translationsList.textContent = t('translations.selectItem', 'Seleziona un elemento da tradurre.')
    return
  }

  translationsList.innerHTML = config.fields
    .map(([fieldKey, label]) => {
      const record = getCurrentTranslationRecord(fieldKey)
      const present = record?.status === 'active' && record?.translated_value
      const statusLabel = present
        ? t('translations.present', 'Traduzione presente')
        : t('translations.missing', 'Mancante')

      return `
        <article class="product-item">
          <h3>${escapeHtml(translateAdminConfigLabel(label))}</h3>
          <p>${escapeHtml(fieldKey)}</p>
          <span class="translation-status-pill">${escapeHtml(statusLabel)}</span>
        </article>
      `
    })
    .join('')
}

async function loadSectionTranslationResources() {
  try {
    const pagesResponse = await fetch('/api/pages')
    const pagesData = await pagesResponse.json()
    const pages = pagesData.success && pagesData.pages?.length
      ? pagesData.pages
      : [{ slug: 'home', title: 'Home' }]

    const groups = await Promise.all(
      pages.map(async (page) => {
        try {
          const response = await fetch(`/api/sections?page_slug=${encodeURIComponent(page.slug || 'home')}`)
          const data = await response.json()
          return data.success ? data.sections || [] : []
        } catch {
          return []
        }
      }),
    )

    return groups.flat()
  } catch {
    return []
  }
}

async function loadTranslationResources() {
  const config = getTranslationConfig()

  if (translationEntityType?.value === 'section') {
    translationState.resources = await loadSectionTranslationResources()
    return
  }

  try {
    const response = await fetch(config.endpoint)
    const data = await response.json()
    translationState.resources = data.success ? data[config.listKey] || [] : []
  } catch {
    translationState.resources = []
  }
}

async function loadTranslationRecords() {
  const locale = translationLocale?.value || 'en'
  const entityType = translationEntityType?.value || 'product'

  try {
    const response = await fetch(
      `/api/admin/translations?locale=${encodeURIComponent(locale)}&entity_type=${encodeURIComponent(entityType)}`,
    )
    const data = await response.json()

    if (!data.success) {
      translationState.translations = []
      if (translationMessage) translationMessage.textContent = data.message || adminUiText('Traduzioni non disponibili.')
      return
    }

    translationState.translations = data.translations || []
  } catch {
    translationState.translations = []
    if (translationMessage) translationMessage.textContent = adminUiText('Errore caricamento traduzioni.')
  }
}

async function loadTranslationManager() {
  if (!translationForm) return
  if (translationsList) translationsList.textContent = adminUiText('Caricamento traduzioni...')

  renderTranslationFields()
  await Promise.all([loadTranslationResources(), loadTranslationRecords()])
  renderTranslationResources()
  renderTranslationEditor()
  renderTranslationsList()
  applyAdminAuditUi()
}

async function saveTranslation(event) {
  event.preventDefault()
  const resource = getCurrentTranslationResource()
  const fieldKey = translationFieldSelect?.value || ''

  if (!resource || !fieldKey) {
    if (translationMessage) translationMessage.textContent = adminUiText('Seleziona contenuto e campo da tradurre.')
    return
  }

  if (translationMessage) translationMessage.textContent = adminUiText('Salvataggio traduzione...')

  const payload = {
    id: translationId?.value || '',
    locale: translationLocale?.value || 'en',
    entity_type: translationEntityType?.value || 'product',
    entity_id: Number(resource.id),
    entity_key: resource.slug || resource.handle || '',
    field_key: fieldKey,
    source_value: translationSourceValue?.value || '',
    translated_value: translationTranslatedValue?.value || '',
    status: translationStatus?.value || 'active',
  }

  try {
    const response = await fetch('/api/admin/translations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (translationMessage) translationMessage.textContent = data.message || adminUiText('Traduzione salvata.')
    if (response.ok && data.success) {
      await loadTranslationRecords()
      renderTranslationEditor()
      renderTranslationsList()
    }
  } catch {
    if (translationMessage) translationMessage.textContent = adminUiText('Errore di connessione traduzioni.')
  }
}

async function disableCurrentTranslation() {
  const id = Number(translationId?.value || 0)
  if (!id) return
  if (translationMessage) translationMessage.textContent = adminUiText('Disattivazione traduzione...')

  try {
    const response = await fetch('/api/admin/translations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await response.json()
    if (translationMessage) translationMessage.textContent = data.message || adminUiText('Traduzione disattivata.')
    if (response.ok && data.success) {
      await loadTranslationRecords()
      renderTranslationEditor()
      renderTranslationsList()
    }
  } catch {
    if (translationMessage) translationMessage.textContent = adminUiText('Errore disattivazione traduzione.')
  }
}

translationLocale?.addEventListener('change', loadTranslationManager)
translationEntityType?.addEventListener('change', loadTranslationManager)
translationEntitySelect?.addEventListener('change', () => {
  renderTranslationEditor()
  renderTranslationsList()
})
translationFieldSelect?.addEventListener('change', renderTranslationEditor)
refreshTranslationsButton?.addEventListener('click', loadTranslationManager)
translationForm?.addEventListener('submit', saveTranslation)
deleteTranslationButton?.addEventListener('click', disableCurrentTranslation)

// ===============================
// BLOG
// ===============================

const blogPostForm = document.querySelector('#blogPostForm')
const blogPostsList = document.querySelector('#blogPostsList')
const blogMessage = document.querySelector('#blogMessage')
const refreshBlogButton = document.querySelector('#refreshBlogButton')
const blogPostFormTitle = document.querySelector('#blogPostFormTitle')
const blogSubmitButton = document.querySelector('#blogSubmitButton')
const cancelBlogEdit = document.querySelector('#cancelBlogEdit')
const blogAdminSearch = document.querySelector('#blogAdminSearch')

function resetBlogForm() {
  if (!blogPostForm) return
  blogPostForm.reset()
  document.querySelector('#blogPostId').value = ''
  blogPostFormTitle.textContent = t('blog.add', 'Aggiungi articolo')
  blogSubmitButton.textContent = t('blog.save', 'Salva articolo')
  cancelBlogEdit.hidden = true
  blogMessage.textContent = adminUiText('')
}

function fillBlogForm(post) {
  document.querySelector('#blogPostId').value = post.id
  document.querySelector('#blogTitle').value = post.title || ''
  document.querySelector('#blogSlug').value = post.slug || ''
  document.querySelector('#blogExcerpt').value = post.excerpt || ''
  document.querySelector('#blogContent').value = post.content || ''
  document.querySelector('#blogImageUrl').value = post.image_url || ''
  document.querySelector('#blogAuthor').value = post.author || ''
  document.querySelector('#blogStatus').value = post.status || 'draft'
  document.querySelector('#blogMetaTitle').value = post.meta_title || ''
  document.querySelector('#blogMetaDescription').value = post.meta_description || ''
  document.querySelector('#blogOgImage').value = post.og_image || ''
  blogPostFormTitle.textContent = t('blog.edit', 'Modifica articolo')
  blogSubmitButton.textContent = t('blog.update', 'Aggiorna articolo')
  cancelBlogEdit.hidden = false
}

function readBlogPayload() {
  return {
    id: document.querySelector('#blogPostId').value,
    title: document.querySelector('#blogTitle').value.trim(),
    slug: document.querySelector('#blogSlug').value.trim(),
    excerpt: document.querySelector('#blogExcerpt').value.trim(),
    content: document.querySelector('#blogContent').value.trim(),
    image_url: document.querySelector('#blogImageUrl').value.trim(),
    author: document.querySelector('#blogAuthor').value.trim(),
    status: document.querySelector('#blogStatus').value,
    meta_title: document.querySelector('#blogMetaTitle').value.trim(),
    meta_description: document.querySelector('#blogMetaDescription').value.trim(),
    og_image: document.querySelector('#blogOgImage').value.trim(),
  }
}

async function loadBlogPosts() {
  if (!blogPostsList) return
  renderAdminListState(blogPostsList, 'Caricamento articoli...', 'loading')

  try {
    const response = await fetch('/api/admin/blog')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(blogPostsList, data.message || adminUiText('Errore caricamento blog.'), 'error')
      return
    }

    if (!data.posts.length) {
      renderAdminListState(blogPostsList, 'Nessun articolo creato.')
      return
    }

    const search = normalizeAdminSearch(blogAdminSearch?.value)
    const visiblePosts = data.posts.filter((post) =>
      adminItemMatchesSearch(post, search, ['title', 'slug', 'excerpt', 'author', 'status']),
    )

    if (!visiblePosts.length) {
      renderAdminListState(blogPostsList, 'Nessun articolo corrisponde alla ricerca.')
      return
    }

    blogPostsList.innerHTML = visiblePosts
      .map(
        (post) => `
          <article class="product-item">
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.excerpt || adminUiText('Nessun excerpt'))}</p>
            <div class="meta">
              <span>Slug: ${escapeHtml(post.slug)}</span>
              <span>${adminUiHtml(post.status)}</span>
              <span>${escapeHtml(post.author || adminUiText('Autore N/D'))}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-blog="${post.id}">${escapeHtml(t('common.edit', 'Modifica'))}</button>
              <a class="button-link" href="/blog/${escapeHtml(post.slug)}" target="_blank" rel="noreferrer">${escapeHtml(t('common.open', 'Apri'))}</a>
              <button type="button" class="danger" data-unpublish-blog="${post.id}">${escapeHtml(t('common.draft', 'Bozza'))}</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-blog]').forEach((button) => {
      button.addEventListener('click', () => {
        const post = data.posts.find((item) => item.id === Number(button.dataset.editBlog))
        fillBlogForm(post)
      })
    })

    document.querySelectorAll('[data-unpublish-blog]').forEach((button) => {
      button.addEventListener('click', async () => {
        const response = await fetch('/api/admin/blog', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.unpublishBlog) }),
        })
        const result = await response.json()
        if (!result.success) alert(result.message || adminUiText('Errore articolo.'))
        resetBlogForm()
        loadBlogPosts()
      })
    })
  } catch {
    renderAdminListState(blogPostsList, 'Errore di connessione blog.', 'error')
  }
}

blogPostForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  blogMessage.textContent = adminUiText('Salvataggio articolo...')
  const payload = readBlogPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/blog', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    blogMessage.textContent = data.message || (data.success ? adminUiText('Articolo salvato.') : adminUiText('Errore articolo.'))
    if (data.success) {
      resetBlogForm()
      loadBlogPosts()
    }
  } catch {
    blogMessage.textContent = adminUiText('Errore di connessione blog.')
  }
})

cancelBlogEdit?.addEventListener('click', resetBlogForm)
refreshBlogButton?.addEventListener('click', loadBlogPosts)
blogAdminSearch?.addEventListener('input', loadBlogPosts)
loadBlogPosts()

// ===============================
// METAOBJECTS
// ===============================

const metaobjectDefinitionForm = document.querySelector('#metaobjectDefinitionForm')
const metaobjectEntryForm = document.querySelector('#metaobjectEntryForm')
const metaobjectsList = document.querySelector('#metaobjectsList')
const metaobjectEntryDefinition = document.querySelector('#metaobjectEntryDefinition')
const metaobjectDefinitionMessage = document.querySelector('#metaobjectDefinitionMessage')
const metaobjectEntryMessage = document.querySelector('#metaobjectEntryMessage')
const cancelMetaobjectEntryEdit = document.querySelector('#cancelMetaobjectEntryEdit')

let metaobjectDefinitionsCache = []
let metaobjectEntriesCache = []

function renderMetaobjectDefinitionOptions() {
  if (!metaobjectEntryDefinition) return
  metaobjectEntryDefinition.innerHTML = metaobjectDefinitionsCache
    .map((definition) => `<option value="${definition.id}">${escapeHtml(definition.name)}</option>`)
    .join('')
}

function resetMetaobjectEntryForm() {
  if (!metaobjectEntryForm) return
  metaobjectEntryForm.reset()
  document.querySelector('#metaobjectEntryId').value = ''
  document.querySelector('#metaobjectEntryDataJson').value = '{}'
  cancelMetaobjectEntryEdit.hidden = true
  metaobjectEntryMessage.textContent = adminUiText('')
}

function fillMetaobjectEntryForm(entry) {
  document.querySelector('#metaobjectEntryId').value = entry.id
  document.querySelector('#metaobjectEntryDefinition').value = entry.definition_id
  document.querySelector('#metaobjectEntryTitle').value = entry.title || ''
  document.querySelector('#metaobjectEntrySlug').value = entry.slug || ''
  document.querySelector('#metaobjectEntryDataJson').value = stringifyForTextarea(entry.data, {})
  cancelMetaobjectEntryEdit.hidden = false
}

async function loadMetaobjects() {
  if (!metaobjectsList) return
  metaobjectsList.textContent = adminUiText('Caricamento metaobjects...')

  try {
    const response = await fetch('/api/admin/metaobjects')
    const data = await response.json()

    if (!data.success) {
      metaobjectsList.textContent = data.message || adminUiText('Errore metaobjects.')
      return
    }

    metaobjectDefinitionsCache = data.definitions || []
    metaobjectEntriesCache = data.entries || []
    renderMetaobjectDefinitionOptions()

    if (!metaobjectDefinitionsCache.length && !metaobjectEntriesCache.length) {
      metaobjectsList.textContent = adminUiText('Nessun metaobject creato.')
      return
    }

    metaobjectsList.innerHTML = `
      ${metaobjectDefinitionsCache
        .map(
          (definition) => `
            <article class="product-item">
              <h3>${escapeHtml(definition.name)}</h3>
              <p>Type key: ${escapeHtml(definition.type_key)}</p>
              <div class="meta">
                ${(definition.fields || [])
                  .map((field) => `<span>${escapeHtml(field.label)}: ${escapeHtml(field.type)}</span>`)
                  .join('')}
              </div>
            </article>
          `,
        )
        .join('')}
      ${metaobjectEntriesCache
        .map(
          (entry) => `
            <article class="product-item">
              <h3>${escapeHtml(entry.title)}</h3>
              <p>${escapeHtml(entry.type_key)} / ${escapeHtml(entry.slug)}</p>
              <div class="product-actions">
                <button type="button" data-edit-metaobject-entry="${entry.id}">Modifica</button>
                <button type="button" class="danger" data-delete-metaobject-entry="${entry.id}">Disattiva</button>
              </div>
            </article>
          `,
        )
        .join('')}
    `

    document.querySelectorAll('[data-edit-metaobject-entry]').forEach((button) => {
      button.addEventListener('click', () => {
        const entry = metaobjectEntriesCache.find((item) => item.id === Number(button.dataset.editMetaobjectEntry))
        fillMetaobjectEntryForm(entry)
      })
    })

    document.querySelectorAll('[data-delete-metaobject-entry]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/metaobjects', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'entry', id: Number(button.dataset.deleteMetaobjectEntry) }),
        })
        resetMetaobjectEntryForm()
        loadMetaobjects()
      })
    })
  } catch {
    metaobjectsList.textContent = adminUiText('Errore di connessione metaobjects.')
  }
}

metaobjectDefinitionForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  metaobjectDefinitionMessage.textContent = adminUiText('Salvataggio definizione...')

  try {
    const response = await fetch('/api/admin/metaobjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'definition',
        name: document.querySelector('#metaobjectName').value.trim(),
        type_key: document.querySelector('#metaobjectTypeKey').value.trim(),
        fields: readJsonTextarea('#metaobjectFieldsJson', []),
      }),
    })
    const data = await response.json()
    metaobjectDefinitionMessage.textContent = data.message || adminUiText('Definizione salvata.')
    if (data.success) {
      metaobjectDefinitionForm.reset()
      loadMetaobjects()
    }
  } catch (error) {
    metaobjectDefinitionMessage.textContent = adminUiText('Errore metaobject. Verifica il JSON dei campi e riprova.')
  }
})

metaobjectEntryForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  metaobjectEntryMessage.textContent = adminUiText('Salvataggio entry...')
  const id = document.querySelector('#metaobjectEntryId').value

  try {
    const response = await fetch('/api/admin/metaobjects', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'entry',
        id,
        definition_id: Number(document.querySelector('#metaobjectEntryDefinition').value),
        title: document.querySelector('#metaobjectEntryTitle').value.trim(),
        slug: document.querySelector('#metaobjectEntrySlug').value.trim(),
        data: readJsonTextarea('#metaobjectEntryDataJson', {}),
      }),
    })
    const data = await response.json()
    metaobjectEntryMessage.textContent = data.message || adminUiText('Entry salvata.')
    if (data.success) {
      resetMetaobjectEntryForm()
      loadMetaobjects()
    }
  } catch (error) {
    metaobjectEntryMessage.textContent = adminUiText('Errore entry. Verifica il JSON dei dati e riprova.')
  }
})

cancelMetaobjectEntryEdit?.addEventListener('click', resetMetaobjectEntryForm)
loadMetaobjects()

// ===============================
// TASSE
// ===============================

const taxSettingsForm = document.querySelector('#taxSettingsForm')
const taxVatRate = document.querySelector('#taxVatRate')
const taxPricesIncludeTax = document.querySelector('#taxPricesIncludeTax')
const taxSettingsMessage = document.querySelector('#taxSettingsMessage')

async function loadTaxSettingsAdmin() {
  if (!taxSettingsForm) return

  taxSettingsMessage.textContent = adminUiText('Caricamento impostazioni fiscali...')

  try {
    const response = await fetch('/api/admin/tax')
    const data = await response.json()

    if (!data.success) {
      taxSettingsMessage.textContent = data.message || adminUiText('Errore caricamento impostazioni fiscali.')
      return
    }

    taxVatRate.value = data.settings?.vat_rate ?? 22
    taxPricesIncludeTax.checked = data.settings?.prices_include_tax !== false
    taxSettingsMessage.textContent = adminUiText('')
  } catch {
    taxSettingsMessage.textContent = adminUiText('Errore di connessione impostazioni fiscali.')
  }
}

taxSettingsForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  taxSettingsMessage.textContent = adminUiText('Salvataggio impostazioni fiscali...')

  try {
    const response = await fetch('/api/admin/tax', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vat_rate: Number(taxVatRate.value || 0),
        prices_include_tax: taxPricesIncludeTax.checked,
      }),
    })
    const data = await response.json()

    taxSettingsMessage.textContent = data.message || (data.success ? 'Impostazioni fiscali salvate.' : 'Errore impostazioni fiscali.')
  } catch {
    taxSettingsMessage.textContent = adminUiText('Errore di connessione impostazioni fiscali.')
  }
})

loadTaxSettingsAdmin()

// ===============================
// PAGAMENTI
// ===============================

const paymentSettingsForm = document.querySelector('#paymentSettingsForm')
const paymentProvider = document.querySelector('#paymentProvider')
const stripeEnabled = document.querySelector('#stripeEnabled')
const stripeMode = document.querySelector('#stripeMode')
const stripePublicKey = document.querySelector('#stripePublicKey')
const paymentProviderStatus = document.querySelector('#paymentProviderStatus')
const paymentSettingsMessage = document.querySelector('#paymentSettingsMessage')

function renderPaymentProviderStatus(settings = {}, message = '') {
  if (!paymentProviderStatus) return

  const stripeReady = settings.stripe_enabled && settings.stripe_secret_configured
  const webhookReady = settings.stripe_webhook_configured

  paymentProviderStatus.innerHTML = `
    <span class="status-badge">${stripeReady ? 'Stripe pronto' : 'Manual fallback'}</span>
    <p>${escapeHtml(message || 'Configura Stripe solo tramite variabili ambiente, mai nel repository.')}</p>
    <div class="meta">
      <span>Secret: ${settings.stripe_secret_configured ? 'configurata' : 'mancante'}</span>
      <span>Webhook: ${webhookReady ? 'configurato' : 'mancante/opzionale'}</span>
      <span>Modalita: ${escapeHtml(settings.stripe_mode || 'test')}</span>
    </div>
  `
}

async function loadPaymentSettingsAdmin() {
  if (!paymentSettingsForm) return

  paymentSettingsMessage.textContent = adminUiText('Caricamento pagamenti...')

  try {
    const response = await fetch('/api/admin/payments')
    const data = await response.json()

    if (!data.success) {
      paymentSettingsMessage.textContent = data.message || adminUiText('Errore caricamento pagamenti.')
      return
    }

    const settings = data.settings || {}
    paymentProvider.value = settings.payment_provider || 'manual'
    stripeEnabled.checked = Boolean(settings.stripe_enabled)
    stripeMode.value = settings.stripe_mode || 'test'
    stripePublicKey.value = settings.stripe_public_key || ''
    renderPaymentProviderStatus(settings, data.message)
    paymentSettingsMessage.textContent = adminUiText('')
  } catch {
    paymentSettingsMessage.textContent = adminUiText('Errore di connessione pagamenti.')
  }
}

paymentSettingsForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  paymentSettingsMessage.textContent = adminUiText('Salvataggio pagamenti...')

  try {
    const response = await fetch('/api/admin/payments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_provider: paymentProvider.value,
        stripe_enabled: stripeEnabled.checked,
        stripe_mode: stripeMode.value,
        stripe_public_key: stripePublicKey.value.trim(),
      }),
    })
    const data = await response.json()

    paymentSettingsMessage.textContent = data.message || adminUiText('Impostazioni pagamento salvate.')

    if (data.success) {
      renderPaymentProviderStatus(data.settings || {}, data.message)
    }
  } catch {
    paymentSettingsMessage.textContent = adminUiText('Errore salvataggio pagamenti.')
  }
})

loadPaymentSettingsAdmin()

// ===============================
// SPEDIZIONI ADMIN
// ===============================

const shippingMethodForm = document.querySelector('#shippingMethodForm')
const shippingMethodsList = document.querySelector('#shippingMethodsList')
const shippingMethodMessage = document.querySelector('#shippingMethodMessage')
const refreshShippingMethodsButton = document.querySelector('#refreshShippingMethodsButton')
const shippingMethodFormTitle = document.querySelector('#shippingMethodFormTitle')
const shippingMethodSubmitButton = document.querySelector('#shippingMethodSubmitButton')
const cancelShippingMethodEdit = document.querySelector('#cancelShippingMethodEdit')

function resetShippingMethodForm() {
  if (!shippingMethodForm) return
  shippingMethodForm.reset()
  document.querySelector('#shippingMethodId').value = ''
  document.querySelector('#shippingMethodActive').checked = true
  shippingMethodFormTitle.textContent = t('shipping.add', 'Aggiungi metodo')
  shippingMethodSubmitButton.textContent = t('shipping.save', 'Salva spedizione')
  cancelShippingMethodEdit.hidden = true
  shippingMethodMessage.textContent = adminUiText('')
}

function fillShippingMethodForm(method) {
  document.querySelector('#shippingMethodId').value = method.id || ''
  document.querySelector('#shippingMethodName').value = method.name || ''
  document.querySelector('#shippingMethodHandle').value = method.handle || ''
  document.querySelector('#shippingMethodDescription').value = method.description || ''
  document.querySelector('#shippingMethodPrice').value = ((method.price_cents || 0) / 100).toFixed(2)
  document.querySelector('#shippingMethodFreeOver').value =
    method.free_over_cents === null || method.free_over_cents === undefined
      ? ''
      : ((method.free_over_cents || 0) / 100).toFixed(2)
  document.querySelector('#shippingMethodSortOrder').value = method.sort_order || 0
  document.querySelector('#shippingMethodActive').checked = Number(method.active) !== 0
  shippingMethodFormTitle.textContent = t('shipping.edit', 'Modifica metodo')
  shippingMethodSubmitButton.textContent = t('shipping.update', 'Aggiorna spedizione')
  cancelShippingMethodEdit.hidden = false
}

function readShippingMethodPayload() {
  return {
    id: document.querySelector('#shippingMethodId').value,
    name: document.querySelector('#shippingMethodName').value.trim(),
    handle: document.querySelector('#shippingMethodHandle').value.trim(),
    description: document.querySelector('#shippingMethodDescription').value.trim(),
    price: document.querySelector('#shippingMethodPrice').value,
    free_over: document.querySelector('#shippingMethodFreeOver').value,
    sort_order: document.querySelector('#shippingMethodSortOrder').value,
    active: document.querySelector('#shippingMethodActive').checked,
  }
}

async function loadShippingMethodsAdmin() {
  if (!shippingMethodsList) return
  shippingMethodsList.textContent = adminUiText('Caricamento spedizioni...')

  try {
    const response = await fetch('/api/admin/shipping')
    const data = await response.json()

    if (!data.success) {
      shippingMethodsList.textContent = data.message || adminUiText('Spedizioni non disponibili.')
      return
    }

    const methods = data.methods || []
    shippingMethodsList.innerHTML = methods.length
      ? methods
          .map((method) => `
            <article class="product-item">
              <h3>${escapeHtml(method.name)}</h3>
              <p>${escapeHtml(method.description || 'Nessuna descrizione')}</p>
              <div class="meta">
                <span>Codice: ${escapeHtml(method.handle)}</span>
                <span>Prezzo: ${formatMoney(method.price_cents || 0)}</span>
                <span>Gratis sopra: ${method.free_over_cents ? formatMoney(method.free_over_cents) : 'N/D'}</span>
                <span>${Number(method.active) === 0 ? 'Disattivo' : 'Attivo'}</span>
                ${method.fallback ? '<span>Fallback</span>' : ''}
              </div>
              <div class="product-actions">
                ${method.id ? `<button type="button" data-edit-shipping="${method.id}">Modifica</button>` : ''}
                ${method.id ? `<button type="button" class="danger" data-disable-shipping="${method.id}">Disattiva</button>` : ''}
              </div>
            </article>
          `)
          .join('')
      : '<p class="admin-empty">Nessun metodo spedizione configurato.</p>'

    document.querySelectorAll('[data-edit-shipping]').forEach((button) => {
      button.addEventListener('click', () => {
        const method = methods.find((item) => item.id === Number(button.dataset.editShipping))
        if (method) fillShippingMethodForm(method)
      })
    })

    document.querySelectorAll('[data-disable-shipping]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/shipping', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableShipping) }),
        })
        resetShippingMethodForm()
        loadShippingMethodsAdmin()
      })
    })

    applyAdminAuditUi()
  } catch {
    shippingMethodsList.textContent = adminUiText('Errore di connessione spedizioni.')
  }
}

shippingMethodForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  shippingMethodMessage.textContent = adminUiText('Salvataggio spedizione...')
  const payload = readShippingMethodPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/shipping', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    shippingMethodMessage.textContent = data.message || adminUiText('Metodo spedizione salvato.')
    if (data.success) {
      resetShippingMethodForm()
      loadShippingMethodsAdmin()
    }
  } catch {
    shippingMethodMessage.textContent = adminUiText('Errore salvataggio spedizione.')
  }
})

cancelShippingMethodEdit?.addEventListener('click', resetShippingMethodForm)
refreshShippingMethodsButton?.addEventListener('click', loadShippingMethodsAdmin)
loadShippingMethodsAdmin()

// ===============================
// SCONTI
// ===============================

const discountForm = document.querySelector('#discountForm')
const discountsList = document.querySelector('#discountsList')
const refreshDiscountsButton = document.querySelector('#refreshDiscountsButton')
const discountMessage = document.querySelector('#discountMessage')
const discountFormTitle = document.querySelector('#discountFormTitle')
const discountSubmitButton = document.querySelector('#discountSubmitButton')
const cancelDiscountEdit = document.querySelector('#cancelDiscountEdit')

function resetDiscountForm() {
  if (!discountForm) return
  discountForm.reset()
  document.querySelector('#discountId').value = ''
  document.querySelector('#discountActive').checked = true
  document.querySelector('#discountKind').value = 'standard'
  document.querySelector('#discountCustomerEligibility').value = 'all'
  document.querySelector('#discountCombinable').checked = false
  discountFormTitle.textContent = t('discounts.add', 'Aggiungi sconto')
  discountSubmitButton.textContent = t('discounts.save', 'Salva sconto')
  cancelDiscountEdit.hidden = true
  discountMessage.textContent = adminUiText('')
}

function fillDiscountForm(discount) {
  document.querySelector('#discountId').value = discount.id
  document.querySelector('#discountCodeAdmin').value = discount.code || ''
  document.querySelector('#discountDescription').value = discount.description || ''
  document.querySelector('#discountType').value = discount.type || 'percentage'
  document.querySelector('#discountKind').value = discount.discount_kind || 'standard'
  document.querySelector('#discountValue').value =
    discount.type === 'fixed' ? Number(discount.value || 0) / 100 : Number(discount.value || 0)
  document.querySelector('#discountMinimum').value = Number(discount.min_subtotal_cents || 0) / 100
  document.querySelector('#discountUsageLimit').value = Number(discount.usage_limit || 0)
  document.querySelector('#discountCustomerEligibility').value = discount.customer_eligibility || 'all'
  document.querySelector('#discountMarketHandle').value = discount.market_handle || ''
  document.querySelector('#discountCurrencyCode').value = discount.currency_code || ''
  document.querySelector('#discountStartsAt').value = discount.starts_at || ''
  document.querySelector('#discountEndsAt').value = discount.ends_at || ''
  document.querySelector('#discountActive').checked = Number(discount.active) !== 0
  document.querySelector('#discountCombinable').checked = Number(discount.combinable || 0) === 1
  discountFormTitle.textContent = t('discounts.edit', 'Modifica sconto')
  discountSubmitButton.textContent = t('discounts.update', 'Aggiorna sconto')
  cancelDiscountEdit.hidden = false
}

function getDiscountFormPayload() {
  const type = document.querySelector('#discountType').value
  const rawValue = Number(document.querySelector('#discountValue').value || 0)

  return {
    id: document.querySelector('#discountId').value,
    code: document.querySelector('#discountCodeAdmin').value.trim(),
    description: document.querySelector('#discountDescription').value.trim(),
    type,
    value: type === 'fixed' ? Math.round(rawValue * 100) : Math.round(rawValue),
    discount_kind: document.querySelector('#discountKind').value,
    min_subtotal_cents: Math.round(Number(document.querySelector('#discountMinimum').value || 0) * 100),
    usage_limit: Number(document.querySelector('#discountUsageLimit').value || 0),
    customer_eligibility: document.querySelector('#discountCustomerEligibility').value,
    market_handle: document.querySelector('#discountMarketHandle').value.trim(),
    currency_code: document.querySelector('#discountCurrencyCode').value.trim(),
    combinable: document.querySelector('#discountCombinable').checked,
    starts_at: document.querySelector('#discountStartsAt').value,
    ends_at: document.querySelector('#discountEndsAt').value,
    active: document.querySelector('#discountActive').checked,
  }
}

async function loadDiscounts() {
  if (!discountsList) return

  discountsList.textContent = adminUiText('Caricamento sconti...')

  try {
    const response = await fetch('/api/admin/discounts')
    const data = await response.json()

    if (!data.success) {
      discountsList.textContent = data.message || adminUiText('Errore caricamento sconti.')
      return
    }

    if (!data.discounts.length) {
      discountsList.textContent = adminUiText('Nessuno sconto creato.')
      return
    }

    discountsList.innerHTML = data.discounts
      .map((discount) => {
        const valueLabel =
          discount.type === 'fixed'
            ? formatMoney(discount.value || 0)
            : `${discount.value || 0}%`

        return `
          <article class="product-item">
            <h3>${escapeHtml(discount.code)}</h3>
            <p>${escapeHtml(discount.description || 'Nessuna descrizione')}</p>
            <div class="meta">
              <span>${escapeHtml(discount.type)}</span>
              <span>${escapeHtml(discount.discount_kind || 'standard')}</span>
              <span>${valueLabel}</span>
              <span>Minimo: ${formatMoney(discount.min_subtotal_cents || 0)}</span>
              <span>Uso: ${Number(discount.usage_count || 0)} / ${Number(discount.usage_limit || 0) || 'illimitato'}</span>
              <span>${escapeHtml(discount.status || (Number(discount.active) === 0 ? 'disabled' : 'active'))}</span>
              <span>${escapeHtml(discount.checkout_support || 'Available in checkout')}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-discount="${discount.id}">Modifica</button>
              <button type="button" class="danger" data-disable-discount="${discount.id}">Disattiva</button>
            </div>
          </article>
        `
      })
      .join('')

    document.querySelectorAll('[data-edit-discount]').forEach((button) => {
      button.addEventListener('click', () => {
        const discount = data.discounts.find((item) => item.id === Number(button.dataset.editDiscount))
        fillDiscountForm(discount)
      })
    })

    document.querySelectorAll('[data-disable-discount]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm(adminUiText('Vuoi disattivare questo sconto?'))
        if (!confirmed) return

        const response = await fetch('/api/admin/discounts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.disableDiscount),
          }),
        })
        const result = await response.json()

        if (!result.success) {
          alert(result.message || adminUiText('Errore disattivazione sconto.'))
          return
        }

        resetDiscountForm()
        loadDiscounts()
      })
    })
  } catch {
    discountsList.textContent = adminUiText('Errore di connessione sconti.')
  }
}

discountForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  discountMessage.textContent = adminUiText('Salvataggio sconto...')

  const payload = getDiscountFormPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/discounts', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    if (!data.success) {
      discountMessage.textContent = data.message || adminUiText('Errore salvataggio sconto.')
      return
    }

    discountMessage.textContent = data.message || adminUiText('Sconto salvato.')
    resetDiscountForm()
    loadDiscounts()
  } catch {
    discountMessage.textContent = adminUiText('Errore di connessione sconti.')
  }
})

cancelDiscountEdit?.addEventListener('click', resetDiscountForm)
refreshDiscountsButton?.addEventListener('click', loadDiscounts)
loadDiscounts()

// ===============================
// CAMPAGNE MARKETING
// ===============================

const campaignForm = document.querySelector('#campaignForm')
const campaignsList = document.querySelector('#campaignsList')
const refreshCampaignsButton = document.querySelector('#refreshCampaignsButton')
const campaignMessage = document.querySelector('#campaignMessage')
const campaignFormTitle = document.querySelector('#campaignFormTitle')
const campaignSubmitButton = document.querySelector('#campaignSubmitButton')
const cancelCampaignEdit = document.querySelector('#cancelCampaignEdit')

function resetCampaignForm() {
  if (!campaignForm) return
  campaignForm.reset()
  document.querySelector('#campaignId').value = ''
  document.querySelector('#campaignActive').checked = true
  campaignFormTitle.textContent = t('campaigns.add', 'Aggiungi campagna')
  campaignSubmitButton.textContent = t('campaigns.save', 'Salva campagna')
  cancelCampaignEdit.hidden = true
  campaignMessage.textContent = adminUiText('')
}

function fillCampaignForm(campaign) {
  document.querySelector('#campaignId').value = campaign.id
  document.querySelector('#campaignTitle').value = campaign.title || ''
  document.querySelector('#campaignDescription').value = campaign.description || ''
  document.querySelector('#campaignDiscountCode').value = campaign.discount_code || ''
  document.querySelector('#campaignStartsAt').value = campaign.starts_at || ''
  document.querySelector('#campaignEndsAt').value = campaign.ends_at || ''
  document.querySelector('#campaignActive').checked = Number(campaign.active) !== 0
  campaignFormTitle.textContent = t('campaigns.edit', 'Modifica campagna')
  campaignSubmitButton.textContent = t('campaigns.update', 'Aggiorna campagna')
  cancelCampaignEdit.hidden = false
}

function readCampaignPayload() {
  return {
    id: document.querySelector('#campaignId').value,
    title: document.querySelector('#campaignTitle').value.trim(),
    description: document.querySelector('#campaignDescription').value.trim(),
    discount_code: document.querySelector('#campaignDiscountCode').value.trim(),
    starts_at: document.querySelector('#campaignStartsAt').value,
    ends_at: document.querySelector('#campaignEndsAt').value,
    active: document.querySelector('#campaignActive').checked,
  }
}

async function loadCampaigns() {
  if (!campaignsList) return
  campaignsList.textContent = adminUiText('Caricamento campagne...')

  try {
    const response = await fetch('/api/admin/marketing')
    const data = await response.json()

    if (!data.success) {
      campaignsList.textContent = data.message || adminUiText('Errore caricamento campagne.')
      return
    }

    if (!data.campaigns.length) {
      campaignsList.textContent = adminUiText('Nessuna campagna creata.')
      return
    }

    campaignsList.innerHTML = data.campaigns
      .map(
        (campaign) => `
          <article class="product-item">
            <h3>${escapeHtml(campaign.title)}</h3>
            <p>${escapeHtml(campaign.description || 'Nessuna descrizione')}</p>
            <div class="meta">
              <span>${Number(campaign.active) === 0 ? 'Disattiva' : 'Attiva'}</span>
              <span>Coupon: ${escapeHtml(campaign.discount_code || 'N/D')}</span>
            </div>
            <div class="product-actions">
              <button type="button" data-edit-campaign="${campaign.id}">Modifica</button>
              <button type="button" class="danger" data-disable-campaign="${campaign.id}">Disattiva</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-campaign]').forEach((button) => {
      button.addEventListener('click', () => {
        const campaign = data.campaigns.find((item) => item.id === Number(button.dataset.editCampaign))
        fillCampaignForm(campaign)
      })
    })

    document.querySelectorAll('[data-disable-campaign]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/marketing', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableCampaign) }),
        })
        resetCampaignForm()
        loadCampaigns()
      })
    })
  } catch {
    campaignsList.textContent = adminUiText('Errore di connessione campagne.')
  }
}

campaignForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  campaignMessage.textContent = adminUiText('Salvataggio campagna...')
  const payload = readCampaignPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/marketing', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    campaignMessage.textContent = data.message || adminUiText('Campagna salvata.')
    if (data.success) {
      resetCampaignForm()
      loadCampaigns()
    }
  } catch {
    campaignMessage.textContent = adminUiText('Errore di connessione campagne.')
  }
})

cancelCampaignEdit?.addEventListener('click', resetCampaignForm)
refreshCampaignsButton?.addEventListener('click', loadCampaigns)
loadCampaigns()

// ===============================
// MEDIA MANAGER
// ===============================

const mediaForm = document.querySelector('#mediaForm')
const mediaUploadForm = document.querySelector('#mediaUploadForm')
const mediaUploadFile = document.querySelector('#mediaUploadFile')
const mediaUploadName = document.querySelector('#mediaUploadName')
const mediaUploadAltText = document.querySelector('#mediaUploadAltText')
const mediaUploadMessage = document.querySelector('#mediaUploadMessage')
const mediaList = document.querySelector('#mediaList')
const refreshMediaButton = document.querySelector('#refreshMediaButton')
const mediaMessage = document.querySelector('#mediaMessage')
const mediaFormTitle = document.querySelector('#mediaFormTitle')
const mediaSubmitButton = document.querySelector('#mediaSubmitButton')
const cancelMediaEdit = document.querySelector('#cancelMediaEdit')
const mediaAdminSearch = document.querySelector('#mediaAdminSearch')
const mediaTypeFilter = document.querySelector('#mediaTypeFilter')
const mediaProviderFilter = document.querySelector('#mediaProviderFilter')
let mediaItemsCache = []
let mediaPickerTargetInput = null
let mediaPickerSearchValue = ''

const mediaPickerStaticSelectors = [
  '#collectionImageUrl',
  '#collectionSeoImage',
  '#image_url',
  '#productSeoImage',
  '#blogImageUrl',
  '#blogOgImage',
  '#pageSeoImage',
]

function isMediaPickerField(input) {
  if (!input) return false

  const sectionField = input.dataset?.sectionField || ''
  const fieldName = input.id || input.name || sectionField
  return /(^image_|_image_url$|image_url|og_image|poster_image_url|model_url|video_url|background_image|media_url)/i.test(fieldName)
}

function ensureMediaPickerModal() {
  let modal = document.querySelector('#mediaPickerModal')
  if (modal) return modal

  modal = document.createElement('div')
  modal.id = 'mediaPickerModal'
  modal.className = 'media-picker-modal'
  modal.hidden = true
  modal.innerHTML = `
    <div class="media-picker-backdrop" data-close-media-picker></div>
    <section class="media-picker-panel" role="dialog" aria-modal="true" aria-labelledby="mediaPickerTitle">
      <div class="section-title compact-title">
        <div>
          <h3 id="mediaPickerTitle" class="media-picker-title">${adminT('mediaPickerTitle')}</h3>
          <p class="section-subtitle media-picker-help">${adminT('mediaPickerManualFallback')}</p>
        </div>
        <button id="closeMediaPickerButton" class="secondary media-picker-close" type="button" data-close-media-picker>
          ${adminT('mediaPickerClose')}
        </button>
      </div>
      <input id="mediaPickerSearch" type="search" placeholder="${adminT('mediaPickerSearch')}" />
      <div id="mediaPickerGrid" class="media-picker-grid">${adminT('mediaPickerLoading')}</div>
    </section>
  `

  document.body.appendChild(modal)

  modal.querySelector('#mediaPickerSearch')?.addEventListener('input', (event) => {
    mediaPickerSearchValue = event.target.value || ''
    renderMediaPickerItems()
  })

  modal.querySelectorAll('[data-close-media-picker]').forEach((control) => {
    control.addEventListener('click', closeMediaPicker)
  })

  modal.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-pick-media-id]')
    if (!button) return

    const media = mediaItemsCache.find((item) => String(item.id) === button.dataset.pickMediaId)
    if (!media?.url || !mediaPickerTargetInput) return

    mediaPickerTargetInput.value = media.url
    mediaPickerTargetInput.dispatchEvent(new Event('input', { bubbles: true }))
    mediaPickerTargetInput.dispatchEvent(new Event('change', { bubbles: true }))
    closeMediaPicker()
  })

  return modal
}

function closeMediaPicker() {
  const modal = document.querySelector('#mediaPickerModal')
  if (modal) modal.hidden = true
  mediaPickerTargetInput = null
  mediaPickerSearchValue = ''
}

function renderMediaPickerItems() {
  const grid = document.querySelector('#mediaPickerGrid')
  if (!grid) return

  const search = normalizeAdminSearch(mediaPickerSearchValue)
  const visibleMedia = mediaItemsCache.filter((media) =>
    adminItemMatchesSearch(media, search, ['name', 'url', 'alt_text', 'type', 'storage_provider']),
  )

  if (!visibleMedia.length) {
    grid.innerHTML = `<p class="admin-empty-state">${adminT('mediaPickerEmpty')}</p>`
    return
  }

  grid.innerHTML = visibleMedia
    .map(
      (media) => `
        <article class="media-picker-item">
          <div class="media-preview-frame">
            ${
              media.type === 'image'
                ? `<img src="${escapeHtml(media.url)}" alt="${escapeHtml(media.alt_text || media.name || 'Media')}" loading="lazy">`
                : `<div class="media-file-preview">${escapeHtml(media.type || 'File')}</div>`
            }
          </div>
          <h4>${escapeHtml(media.name || 'Media')}</h4>
          <p>${escapeHtml(media.alt_text || media.url || '')}</p>
          <button type="button" class="secondary" data-pick-media-id="${escapeHtml(media.id)}">
            ${adminT('mediaPickerSelect')}
          </button>
        </article>
      `,
    )
    .join('')
}

async function openMediaPicker(input) {
  if (!input) return
  const modal = ensureMediaPickerModal()
  const grid = modal.querySelector('#mediaPickerGrid')
  const search = modal.querySelector('#mediaPickerSearch')

  mediaPickerTargetInput = input
  mediaPickerSearchValue = ''
  if (search) search.value = ''
  modal.hidden = false
  if (grid) grid.textContent = adminT('mediaPickerLoading')

  if (!mediaItemsCache.length) await loadMediaItems()
  renderMediaPickerItems()
}

function attachMediaPickerButton(input) {
  if (!input || input.dataset.mediaPickerAttached === 'true' || !isMediaPickerField(input)) return

  input.dataset.mediaPickerAttached = 'true'
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'secondary media-picker-trigger'
  button.textContent = adminT('mediaPickerButton')
  button.addEventListener('click', () => openMediaPicker(input))
  input.insertAdjacentElement('afterend', button)
}

function enhanceMediaPickerFields(root = document) {
  mediaPickerStaticSelectors.forEach((selector) => {
    const input = document.querySelector(selector)
    if (input) attachMediaPickerButton(input)
  })

  root.querySelectorAll?.('[data-section-field]').forEach((input) => {
    attachMediaPickerButton(input)
  })
}

function resetMediaForm() {
  if (!mediaForm) return
  mediaForm.reset()
  document.querySelector('#mediaId').value = ''
  mediaFormTitle.textContent = t('media.add', 'Aggiungi media')
  mediaSubmitButton.textContent = t('media.save', 'Salva media')
  cancelMediaEdit.hidden = true
  mediaMessage.textContent = adminUiText('')
}

function fillMediaForm(media) {
  if (!media) return
  document.querySelector('#mediaId').value = media.id
  document.querySelector('#mediaName').value = media.name || ''
  document.querySelector('#mediaUrl').value = media.url || ''
  document.querySelector('#mediaType').value = media.type || 'image'
  document.querySelector('#mediaAltText').value = media.alt_text || ''
  mediaFormTitle.textContent = t('media.edit', 'Modifica media')
  mediaSubmitButton.textContent = t('media.update', 'Aggiorna media')
  cancelMediaEdit.hidden = false
}

function getMediaPayload() {
  return {
    id: document.querySelector('#mediaId').value,
    name: document.querySelector('#mediaName').value.trim(),
    url: document.querySelector('#mediaUrl').value.trim(),
    type: document.querySelector('#mediaType').value,
    alt_text: document.querySelector('#mediaAltText').value.trim(),
  }
}

function providerFilterValue(provider = '') {
  const value = String(provider || 'url').toLowerCase()
  if (value === 'url' || value === 'r2') return value
  return 'other'
}

function renderMediaItems(mediaItems = mediaItemsCache) {
  if (!mediaList) return

  if (!mediaItems.length) {
    renderAdminListState(mediaList, 'Nessun media salvato. Usa upload o URL manuale per popolare la libreria.')
    return
  }

  const search = normalizeAdminSearch(mediaAdminSearch?.value)
  const typeFilter = mediaTypeFilter?.value || ''
  const providerFilter = mediaProviderFilter?.value || ''
  const visibleMedia = mediaItems.filter((media) => {
    const matchesSearch = adminItemMatchesSearch(media, search, ['name', 'url', 'type', 'alt_text', 'mime_type', 'storage_provider'])
    const matchesType = !typeFilter || media.type === typeFilter
    const matchesProvider = !providerFilter || providerFilterValue(media.storage_provider) === providerFilter

    return matchesSearch && matchesType && matchesProvider
  })

  if (!visibleMedia.length) {
    renderAdminListState(mediaList, 'Nessun media corrisponde a ricerca o filtri.')
    return
  }

  mediaList.innerHTML = visibleMedia
    .map(
      (media) => `
        <article class="product-item media-item">
          <div class="media-preview-frame">
            ${
              media.type === 'image'
                ? `<img src="${escapeHtml(media.url)}" alt="${escapeHtml(media.alt_text || media.name)}" loading="lazy">`
                : `<div class="media-file-preview">${escapeHtml(media.type || 'File')}</div>`
            }
          </div>
          <h3>${escapeHtml(media.name)}</h3>
          <p title="${escapeHtml(media.url)}">${escapeHtml(media.url)}</p>
          <div class="meta">
            <span>${escapeHtml(media.type)}</span>
            <span>${escapeHtml(media.alt_text || 'Alt text vuoto')}</span>
            <span>${escapeHtml(media.mime_type || 'mime N/D')}</span>
            <span>${media.size ? `${Math.round(Number(media.size) / 1024)} KB` : 'size N/D'}</span>
            <span>${escapeHtml(media.storage_provider || 'url')}</span>
            ${media.created_at ? `<span>${escapeHtml(media.created_at)}</span>` : ''}
          </div>
          <div class="product-actions">
            <button type="button" data-edit-media="${media.id}">Modifica</button>
            <a class="button-link" href="${escapeHtml(media.url)}" target="_blank" rel="noreferrer">Apri</a>
            <button type="button" data-copy-media="${escapeHtml(media.url)}">Copia URL</button>
            <button type="button" class="danger" data-delete-media="${media.id}">Elimina</button>
          </div>
        </article>
      `,
    )
    .join('')

    document.querySelectorAll('[data-edit-media]').forEach((button) => {
      button.addEventListener('click', () => {
        const media = mediaItemsCache.find((item) => item.id === Number(button.dataset.editMedia))
        fillMediaForm(media)
      })
    })

    document.querySelectorAll('[data-copy-media]').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copyMedia)
        } catch {
          alert(button.dataset.copyMedia)
        }
      })
    })

    document.querySelectorAll('[data-delete-media]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm(adminUiText('Vuoi eliminare questo media dalla libreria?'))
        if (!confirmed) return

        const response = await fetch('/api/admin/media', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(button.dataset.deleteMedia),
          }),
        })
        const result = await response.json()

        if (!result.success) {
          alert(result.message || adminUiText('Errore eliminazione media.'))
          return
        }

        resetMediaForm()
        loadMediaItems()
      })
    })
  applyAdminAuditUi()
}

async function loadMediaItems() {
  if (!mediaList) return

  renderAdminListState(mediaList, 'Caricamento media...', 'loading')

  try {
    const response = await fetch('/api/admin/media')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(mediaList, data.message || adminUiText('Errore caricamento media.'), 'error')
      return
    }

    mediaItemsCache = data.media || []
    setAdminDashboardCount('media', mediaItemsCache.length)
    renderMediaItems(mediaItemsCache)
  } catch {
    renderAdminListState(mediaList, 'Errore di connessione media.', 'error')
  }
}

mediaForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  mediaMessage.textContent = adminUiText('Salvataggio media...')

  const payload = getMediaPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/media', {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    if (!data.success) {
      mediaMessage.textContent = data.message || adminUiText('Errore salvataggio media.')
      return
    }

    mediaMessage.textContent = data.message || adminUiText('Media salvato.')
    resetMediaForm()
    loadMediaItems()
  } catch {
    mediaMessage.textContent = adminUiText('Errore di connessione media.')
  }
})

mediaUploadForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!mediaUploadFile?.files?.[0]) {
    mediaUploadMessage.textContent = adminUiText('Seleziona un file da caricare.')
    return
  }

  mediaUploadMessage.textContent = adminUiText('Upload in corso...')

  const formData = new FormData()
  formData.append('file', mediaUploadFile.files[0])
  formData.append('name', mediaUploadName?.value.trim() || mediaUploadFile.files[0].name)
  formData.append('alt_text', mediaUploadAltText?.value.trim() || '')

  try {
    const response = await fetch('/api/admin/media/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()

    if (!data.success) {
      mediaUploadMessage.textContent =
        data.message || adminUiText('Upload non disponibile. Usa URL manuale.')
      return
    }

    mediaUploadMessage.textContent = data.message || adminUiText('Media caricato.')

    if (data.media?.url) {
      document.querySelector('#mediaName').value = data.media.name || ''
      document.querySelector('#mediaUrl').value = data.media.url
      document.querySelector('#mediaType').value = data.media.type || 'image'
      document.querySelector('#mediaAltText').value = data.media.alt_text || ''
    }

    mediaUploadForm.reset()
    loadMediaItems()
  } catch {
    mediaUploadMessage.textContent =
      'Upload non riuscito. Usa URL manuale o verifica la configurazione storage.'
  }
})

cancelMediaEdit?.addEventListener('click', resetMediaForm)
refreshMediaButton?.addEventListener('click', loadMediaItems)
mediaAdminSearch?.addEventListener('input', () => renderMediaItems())
mediaTypeFilter?.addEventListener('change', () => renderMediaItems())
mediaProviderFilter?.addEventListener('change', () => renderMediaItems())
loadMediaItems()
enhanceMediaPickerFields()

// ===============================
// METAFIELDS
// ===============================

const metafieldDefinitionForm = document.querySelector('#metafieldDefinitionForm')
const metafieldDefinitionMessage = document.querySelector('#metafieldDefinitionMessage')
const metafieldValueEntityType = document.querySelector('#metafieldValueEntityType')
const metafieldEntitySelect = document.querySelector('#metafieldEntitySelect')
const metafieldValuesFields = document.querySelector('#metafieldValuesFields')
const metafieldValuesMessage = document.querySelector('#metafieldValuesMessage')
const saveMetafieldValuesButton = document.querySelector('#saveMetafieldValuesButton')

let metafieldResources = {
  product: [],
  collection: [],
  page: [],
}
let currentMetafieldDefinitions = []

function getMetafieldEntityLabel(entityType, record) {
  if (entityType === 'product') return record.name || record.slug || `Prodotto ${record.id}`
  if (entityType === 'collection') return record.name || record.slug || `Collezione ${record.id}`
  return record.title || record.slug || `Pagina ${record.id}`
}

async function loadMetafieldResources() {
  if (!metafieldDefinitionForm) return

  try {
    const [productsResponse, collectionsResponse, pagesResponse] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/admin/collections'),
      fetch('/api/admin/pages'),
    ])

    const productsData = await productsResponse.json()
    const collectionsData = await collectionsResponse.json()
    const pagesData = await pagesResponse.json()

    metafieldResources = {
      product: productsData.success ? productsData.products || [] : [],
      collection: collectionsData.success ? collectionsData.collections || [] : [],
      page: pagesData.success ? pagesData.pages || [] : [],
    }

    renderMetafieldEntityOptions()
    loadMetafieldValues()
  } catch {
    metafieldValuesFields.textContent = adminUiText('Errore caricamento record metafields.')
  }
}

function renderMetafieldEntityOptions() {
  if (!metafieldEntitySelect) return

  const entityType = metafieldValueEntityType.value
  const records = metafieldResources[entityType] || []

  metafieldEntitySelect.innerHTML =
    '<option value="">Seleziona record</option>' +
    records
      .map(
        (record) => `
          <option value="${record.id}">
            ${escapeHtml(getMetafieldEntityLabel(entityType, record))}
          </option>
        `,
      )
      .join('')
}

function renderMetafieldValueFields(definitions = []) {
  if (!metafieldValuesFields) return

  currentMetafieldDefinitions = definitions

  if (!definitions.length) {
    metafieldValuesFields.textContent = adminUiText('Nessuna definizione metafield per questa entita.')
    return
  }

  metafieldValuesFields.innerHTML = definitions
    .map((definition) => {
      if (definition.type === 'boolean') {
        return `
          <label class="inline-check">
            <input
              type="checkbox"
              data-metafield-key="${escapeHtml(definition.key)}"
              ${definition.value === true || definition.value === '1' ? 'checked' : ''}
            />
            ${escapeHtml(definition.label)}
          </label>
        `
      }

      const inputType = definition.type === 'url' ? 'url' : definition.type === 'number' ? 'number' : 'text'

      return `
        <label>
          ${escapeHtml(definition.label)}
          <input
            type="${inputType}"
            data-metafield-key="${escapeHtml(definition.key)}"
            value="${escapeHtml(definition.value || '')}"
          />
        </label>
      `
    })
    .join('')
}

async function loadMetafieldValues() {
  if (!metafieldValuesFields || !metafieldEntitySelect?.value) {
    renderMetafieldValueFields([])
    return
  }

  const entityType = metafieldValueEntityType.value
  const entityId = metafieldEntitySelect.value
  metafieldValuesFields.textContent = adminUiText('Caricamento metafields...')

  try {
    const response = await fetch(
      `/api/admin/metafields?entity_type=${encodeURIComponent(entityType)}&entity_id=${encodeURIComponent(entityId)}`,
    )
    const data = await response.json()

    if (!data.success) {
      metafieldValuesFields.textContent = data.message || adminUiText('Errore caricamento metafields.')
      return
    }

    renderMetafieldValueFields(data.definitions || [])
  } catch {
    metafieldValuesFields.textContent = adminUiText('Errore di connessione metafields.')
  }
}

function readMetafieldValueFields() {
  return currentMetafieldDefinitions.reduce((values, definition) => {
    const field = metafieldValuesFields.querySelector(`[data-metafield-key="${definition.key}"]`)
    values[definition.key] = definition.type === 'boolean' ? field?.checked || false : field?.value || ''
    return values
  }, {})
}

metafieldDefinitionForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  metafieldDefinitionMessage.textContent = adminUiText('Creazione metafield...')

  try {
    const response = await fetch('/api/admin/metafields', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_type: document.querySelector('#metafieldEntityType').value,
        key: document.querySelector('#metafieldKey').value.trim(),
        label: document.querySelector('#metafieldLabel').value.trim(),
        type: document.querySelector('#metafieldType').value,
      }),
    })
    const data = await response.json()

    if (!data.success) {
      metafieldDefinitionMessage.textContent = data.message || adminUiText('Errore creazione metafield.')
      return
    }

    metafieldDefinitionMessage.textContent = data.message || adminUiText('Metafield creato.')
    metafieldDefinitionForm.reset()
    await loadMetafieldValues()
  } catch {
    metafieldDefinitionMessage.textContent = adminUiText('Errore di connessione metafields.')
  }
})

metafieldValueEntityType?.addEventListener('change', () => {
  renderMetafieldEntityOptions()
  loadMetafieldValues()
})

metafieldEntitySelect?.addEventListener('change', loadMetafieldValues)

saveMetafieldValuesButton?.addEventListener('click', async () => {
  if (!metafieldEntitySelect.value) {
    metafieldValuesMessage.textContent = adminUiText('Seleziona un record.')
    return
  }

  metafieldValuesMessage.textContent = adminUiText('Salvataggio metafields...')

  try {
    const response = await fetch('/api/admin/metafields', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_type: metafieldValueEntityType.value,
        entity_id: Number(metafieldEntitySelect.value),
        values: readMetafieldValueFields(),
      }),
    })
    const data = await response.json()

    metafieldValuesMessage.textContent = data.message || (data.success ? 'Metafields salvati.' : 'Errore metafields.')
  } catch {
    metafieldValuesMessage.textContent = adminUiText('Errore di connessione metafields.')
  }
})

loadMetafieldResources()

// ===============================
// MARKETS
// ===============================

const marketForm = document.querySelector('#marketForm')
const marketsList = document.querySelector('#marketsList')
const marketMessage = document.querySelector('#marketMessage')
const refreshMarketsButton = document.querySelector('#refreshMarketsButton')
const marketFormTitle = document.querySelector('#marketFormTitle')
const marketSubmitButton = document.querySelector('#marketSubmitButton')
const cancelMarketEdit = document.querySelector('#cancelMarketEdit')
const marketPresetList = document.querySelector('#marketPresetList')
const marketCountriesList = document.querySelector('#marketCountriesList')
const marketLanguagesList = document.querySelector('#marketLanguagesList')
const marketCurrenciesList = document.querySelector('#marketCurrenciesList')
const localizedPriceForm = document.querySelector('#localizedPriceForm')
const localizedPriceProduct = document.querySelector('#localizedPriceProduct')
const localizedPriceVariant = document.querySelector('#localizedPriceVariant')
const localizedPriceMarket = document.querySelector('#localizedPriceMarket')
const localizedPriceCurrency = document.querySelector('#localizedPriceCurrency')
const localizedPriceAmount = document.querySelector('#localizedPriceAmount')
const localizedPriceActive = document.querySelector('#localizedPriceActive')
const localizedPriceMessage = document.querySelector('#localizedPriceMessage')
const localizedPricesList = document.querySelector('#localizedPricesList')
const refreshLocalizedPricesButton = document.querySelector('#refreshLocalizedPricesButton')

let adminMarketsData = {
  markets: [],
  languages: [],
  currencies: [],
  countries: [],
}
let localizedPricingData = {
  products: [],
  variants: [],
  markets: [],
  prices: [],
}

const MARKET_PRESETS = [
  {
    name: 'Italy / Italia',
    handle: 'it',
    country_code: 'IT',
    language_code: 'it',
    currency_code: 'EUR',
    path_prefix: '/it',
    notes: 'Mercato consigliato per Italia con lingua italiana e valuta Euro.',
    is_default: true,
  },
  {
    name: 'Europe / Europa',
    handle: 'eu',
    country_code: 'EU',
    language_code: 'en',
    currency_code: 'EUR',
    path_prefix: '/eu',
    notes: 'Mercato europeo generico con lingua inglese e valuta Euro.',
  },
  {
    name: 'United States',
    handle: 'us',
    country_code: 'US',
    language_code: 'en',
    currency_code: 'USD',
    path_prefix: '/us',
    notes: 'Mercato Stati Uniti con valuta USD.',
  },
  {
    name: 'United Kingdom',
    handle: 'uk',
    country_code: 'GB',
    language_code: 'en',
    currency_code: 'GBP',
    path_prefix: '/uk',
    notes: 'Mercato Regno Unito con valuta GBP.',
  },
  {
    name: 'Switzerland',
    handle: 'ch',
    country_code: 'CH',
    language_code: 'de',
    currency_code: 'CHF',
    path_prefix: '/ch',
    notes: 'Mercato Svizzera con lingua tedesca e valuta CHF.',
  },
  {
    name: 'France',
    handle: 'fr',
    country_code: 'FR',
    language_code: 'fr',
    currency_code: 'EUR',
    path_prefix: '/fr',
    notes: 'Mercato Francia con lingua francese e valuta Euro.',
  },
  {
    name: 'Germany',
    handle: 'de',
    country_code: 'DE',
    language_code: 'de',
    currency_code: 'EUR',
    path_prefix: '/de',
    notes: 'Mercato Germania con lingua tedesca e valuta Euro.',
  },
  {
    name: 'Spain',
    handle: 'es',
    country_code: 'ES',
    language_code: 'es',
    currency_code: 'EUR',
    path_prefix: '/es',
    notes: 'Mercato Spagna con lingua spagnola e valuta Euro.',
  },
  {
    name: 'Sweden',
    handle: 'se',
    country_code: 'SE',
    language_code: 'en',
    currency_code: 'SEK',
    path_prefix: '/se',
    notes: 'Mercato Svezia con fallback inglese e valuta SEK.',
  },
  {
    name: 'Global',
    handle: 'global',
    country_code: 'GLOBAL',
    language_code: 'en',
    currency_code: 'EUR',
    path_prefix: '/',
    notes: 'Mercato globale di fallback per clienti internazionali.',
  },
]

function resetMarketForm() {
  if (!marketForm) return
  marketForm.reset()
  document.querySelector('#marketId').value = ''
  document.querySelector('#marketActive').checked = true
  document.querySelector('#marketDefault').checked = false
  marketFormTitle.textContent = t('markets.add', 'Aggiungi mercato')
  marketSubmitButton.textContent = t('markets.save', 'Salva mercato')
  cancelMarketEdit.hidden = true
  marketMessage.textContent = adminUiText('')
}

function fillMarketForm(market) {
  document.querySelector('#marketId').value = market.id || ''
  document.querySelector('#marketName').value = market.name || ''
  document.querySelector('#marketHandle').value = market.handle || ''
  document.querySelector('#marketCountryCode').value = market.country_code || 'IT'
  document.querySelector('#marketLanguageCode').value = market.language_code || 'it'
  document.querySelector('#marketCurrencyCode').value = market.currency_code || 'EUR'
  document.querySelector('#marketDomain').value = market.domain || ''
  document.querySelector('#marketPathPrefix').value = market.path_prefix || ''
  document.querySelector('#marketNotes').value = market.notes || ''
  document.querySelector('#marketActive').checked = Number(market.active) !== 0
  document.querySelector('#marketDefault').checked = Number(market.is_default) === 1
  marketFormTitle.textContent = market.id
    ? t('markets.edit', 'Modifica mercato')
    : t('markets.addFromPreset', 'Aggiungi mercato da preset')
  marketSubmitButton.textContent = market.id
    ? t('markets.update', 'Aggiorna mercato')
    : t('markets.save', 'Salva mercato')
  cancelMarketEdit.hidden = !market.id
}

function readMarketPayload() {
  return {
    id: document.querySelector('#marketId').value,
    name: document.querySelector('#marketName').value.trim(),
    handle: document.querySelector('#marketHandle').value.trim(),
    country_code: document.querySelector('#marketCountryCode').value.trim(),
    language_code: document.querySelector('#marketLanguageCode').value.trim(),
    currency_code: document.querySelector('#marketCurrencyCode').value.trim(),
    domain: document.querySelector('#marketDomain').value.trim(),
    path_prefix: document.querySelector('#marketPathPrefix').value.trim(),
    notes: document.querySelector('#marketNotes').value.trim(),
    active: document.querySelector('#marketActive').checked,
    is_default: document.querySelector('#marketDefault').checked,
  }
}

function renderMarketConfigList(target, items, config) {
  if (!target) return

  if (!items.length) {
    target.innerHTML = `<p class="admin-empty">${adminUiHtml('Nessun dato configurato. Applica la migration Markets 2.0 per abilitare questa lista.')}</p>`
    return
  }

  target.innerHTML = items
    .map(
      (item) => `
        <article class="market-config-item">
          <div>
            <strong>${escapeHtml(config.title(item))}</strong>
            <span>${escapeHtml(config.subtitle(item))}</span>
          </div>
          <div class="meta">
            ${config.meta(item)
              .map((value) => `<span>${adminUiHtml(value)}</span>`)
              .join('')}
          </div>
        </article>
      `,
    )
    .join('')
}

function renderMarketsMetadata(data = adminMarketsData) {
  renderMarketConfigList(marketCountriesList, data.countries || [], {
    title: (item) => `${item.country_code} - ${item.name}`,
    subtitle: (item) => item.market_handle ? `Mercato: ${item.market_handle}` : 'Nessun mercato dedicato',
    meta: (item) => [
      Number(item.active) === 0 ? 'Disattivo' : 'Attivo',
      item.recommended ? 'Fallback consigliato' : 'Configurato',
    ],
  })

  renderMarketConfigList(marketLanguagesList, data.languages || [], {
    title: (item) => `${item.locale?.toUpperCase()} - ${item.name}`,
    subtitle: (item) => item.native_name || item.name,
    meta: (item) => [
      Number(item.is_default) === 1 ? 'Default' : 'Fallback disponibile',
      Number(item.active) === 0 ? 'Disattiva' : 'Attiva',
      item.recommended ? 'Fallback consigliato' : 'Configurata',
    ],
  })

  renderMarketConfigList(marketCurrenciesList, data.currencies || [], {
    title: (item) => `${item.code} - ${item.name}`,
    subtitle: (item) => item.symbol || item.code,
    meta: (item) => [
      Number(item.is_default) === 1 ? 'Default' : `Rate manuale: ${item.manual_rate || 1}`,
      Number(item.active) === 0 ? 'Disattiva' : 'Attiva',
      item.recommended ? 'Fallback consigliato' : 'Configurata',
    ],
  })
}

function renderMarketPresets(markets = []) {
  if (!marketPresetList) return

  const existingHandles = new Set(markets.map((market) => String(market.handle || '').toLowerCase()))

  marketPresetList.innerHTML = MARKET_PRESETS.map((preset) => {
    const exists = existingHandles.has(preset.handle)

    return `
      <article class="market-preset-card ${exists ? 'is-added' : ''}">
        <div>
          <span class="mini-card-status">${adminUiHtml(exists ? 'Gia presente' : 'Preset consigliato')}</span>
          <h4>${escapeHtml(preset.name)}</h4>
          <p>${escapeHtml(preset.country_code)} / ${escapeHtml(preset.language_code)} / ${escapeHtml(preset.currency_code)}</p>
          <p class="market-preset-path">${escapeHtml(preset.path_prefix || '/')}</p>
        </div>
        <button type="button" data-market-preset="${escapeHtml(preset.handle)}" ${exists ? 'disabled' : ''}>
          ${escapeHtml(t('markets.add', 'Aggiungi mercato'))}
        </button>
      </article>
    `
  }).join('')

  document.querySelectorAll('[data-market-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = MARKET_PRESETS.find((item) => item.handle === button.dataset.marketPreset)
      if (!preset) return

      if (existingHandles.has(preset.handle)) {
        marketMessage.textContent = adminUiText('Questo mercato e gia configurato.')
        return
      }

      fillMarketForm({
        ...preset,
        active: 1,
        is_default: preset.is_default && !markets.some((market) => Number(market.is_default) === 1) ? 1 : 0,
        domain: '',
      })
      marketMessage.textContent = adminUiText('Preset caricato nel form. Controlla i dati e salva il mercato.')
      marketForm?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  applyAdminAuditUi()
}

async function loadMarketsAdmin() {
  if (!marketsList) return
  marketsList.textContent = adminUiText('Caricamento markets...')
  renderMarketPresets(adminMarketsData.markets || [])

  try {
    const response = await fetch('/api/admin/markets')
    const data = await response.json()

    if (!data.success) {
      marketsList.textContent = data.message || adminUiText('Errore markets.')
      renderMarketPresets([])
      return
    }

    adminMarketsData = {
      markets: data.markets || [],
      languages: data.languages || [],
      currencies: data.currencies || [],
      countries: data.countries || [],
    }
    renderMarketsMetadata(adminMarketsData)

    const markets = data.markets || []
    renderMarketPresets(markets)

    if (!markets.length) {
      marketsList.innerHTML = `
        <div class="admin-empty market-empty-state">
          <strong>Nessun mercato configurato.</strong>
          <span>Compila il form manualmente oppure usa un preset consigliato per iniziare.</span>
        </div>
      `
      return
    }

    marketsList.innerHTML = markets
      .map(
        (market) => `
          <article class="product-item">
            <h3>${escapeHtml(market.name)}</h3>
            <div class="meta">
              <span>${escapeHtml(market.handle)}</span>
              <span>${escapeHtml(market.country_code)} / ${escapeHtml(market.language_code)}</span>
              <span>${escapeHtml(market.currency_code)}</span>
              ${market.path_prefix ? `<span>Path: ${escapeHtml(market.path_prefix)}</span>` : ''}
              ${market.domain ? `<span>Dominio: ${escapeHtml(market.domain)}</span>` : ''}
              <span>${market.is_default ? 'Default' : 'Non default'}</span>
              <span>${market.active ? 'Attivo' : 'Disattivo'}</span>
            </div>
            ${market.notes ? `<p>${escapeHtml(market.notes)}</p>` : ''}
            <div class="product-actions">
              <button type="button" data-edit-market="${market.id}">Modifica</button>
              <button type="button" class="danger" data-disable-market="${market.id}">Disattiva</button>
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-edit-market]').forEach((button) => {
      button.addEventListener('click', () => {
        const market = markets.find((item) => item.id === Number(button.dataset.editMarket))
        fillMarketForm(market)
      })
    })

    document.querySelectorAll('[data-disable-market]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/markets', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableMarket) }),
        })
        resetMarketForm()
        loadMarketsAdmin()
      })
    })

    loadLocalizedPricingAdmin()
  } catch {
    marketsList.textContent = adminUiText('Errore di connessione markets.')
    renderMarketPresets([])
  }
}

marketForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  marketMessage.textContent = adminUiText('Salvataggio mercato...')
  const payload = readMarketPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/markets', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    marketMessage.textContent = data.message || adminUiText('Mercato salvato.')
    if (data.success) {
      resetMarketForm()
      loadMarketsAdmin()
      loadLocalizedPricingAdmin()
    }
  } catch {
    marketMessage.textContent = adminUiText('Errore di connessione markets.')
  }
})

cancelMarketEdit?.addEventListener('click', resetMarketForm)
refreshMarketsButton?.addEventListener('click', loadMarketsAdmin)
loadMarketsAdmin()

function resetLocalizedPriceForm() {
  localizedPriceForm?.reset()
  const idField = document.querySelector('#localizedPriceId')
  if (idField) idField.value = ''
  if (localizedPriceActive) localizedPriceActive.checked = true
  if (localizedPriceMessage) localizedPriceMessage.textContent = adminUiText('')
  updateLocalizedVariantOptions()
}

function centsToAdminPrice(priceCents = 0) {
  return Number(priceCents || 0) / 100
}

function localizedPriceLabel(price) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: price.currency_code || 'EUR',
  }).format(Number(price.price_cents || 0) / 100)
}

function updateLocalizedVariantOptions() {
  if (!localizedPriceProduct || !localizedPriceVariant) return

  const productId = Number(localizedPriceProduct.value || 0)
  const variants = localizedPricingData.variants.filter((variant) => Number(variant.product_id) === productId)

  localizedPriceVariant.innerHTML = [
    '<option value="0">Prezzo prodotto base</option>',
    ...variants.map(
      (variant) => `
        <option value="${variant.id}">
          ${escapeHtml(variant.option_name)}: ${escapeHtml(variant.option_value)}
        </option>
      `,
    ),
  ].join('')
}

function renderLocalizedPriceOptions() {
  if (!localizedPriceProduct || !localizedPriceMarket || !localizedPriceCurrency) return

  localizedPriceProduct.innerHTML = localizedPricingData.products.length
    ? localizedPricingData.products
        .map(
          (product) => `
            <option value="${product.id}">
              ${escapeHtml(product.name)} - ${formatMoney(product.price_cents || 0)}
            </option>
          `,
        )
        .join('')
    : '<option value="">Nessun prodotto disponibile</option>'

  localizedPriceMarket.innerHTML = localizedPricingData.markets.length
    ? localizedPricingData.markets
        .map(
          (market) => `
            <option value="${escapeHtml(market.handle)}" data-currency="${escapeHtml(market.currency_code || 'EUR')}">
              ${escapeHtml(market.name)} (${escapeHtml(market.currency_code || 'EUR')})
            </option>
          `,
        )
        .join('')
    : '<option value="it-eur" data-currency="EUR">Italia / EUR</option>'

  localizedPriceCurrency.innerHTML = (adminMarketsData.currencies.length
    ? adminMarketsData.currencies
    : [{ code: 'EUR', name: 'Euro' }]
  )
    .map(
      (currency) => `
        <option value="${escapeHtml(currency.code)}">
          ${escapeHtml(currency.code)} - ${escapeHtml(currency.name || currency.code)}
        </option>
      `,
    )
    .join('')

  const selectedMarketOption = localizedPriceMarket.selectedOptions?.[0]
  if (selectedMarketOption?.dataset.currency) {
    localizedPriceCurrency.value = selectedMarketOption.dataset.currency
  }

  updateLocalizedVariantOptions()
}

function renderLocalizedPricesList() {
  if (!localizedPricesList) return

  if (!localizedPricingData.prices.length) {
    localizedPricesList.innerHTML = '<p class="admin-empty">Nessun prezzo localizzato configurato. Lo storefront usera il prezzo base.</p>'
    return
  }

  localizedPricesList.innerHTML = localizedPricingData.prices
    .map((price) => {
      const variantLabel = price.variant_id
        ? `${price.variant_option_name || 'Variante'}: ${price.variant_option_value || price.variant_id}`
        : 'Prodotto base'

      return `
        <article class="product-item">
          <h3>${escapeHtml(price.product_name || `Prodotto ${price.product_id}`)}</h3>
          <p>${escapeHtml(variantLabel)}</p>
          <div class="meta">
            <span>${escapeHtml(price.market_handle || 'market')}</span>
            <span>${escapeHtml(price.currency_code || 'EUR')}</span>
            <span>${escapeHtml(localizedPriceLabel(price))}</span>
            <span>${Number(price.active) === 0 ? 'Disattivo' : 'Attivo'}</span>
          </div>
          <div class="product-actions">
            <button type="button" data-edit-localized-price="${price.id}">Modifica</button>
            <button type="button" class="danger" data-disable-localized-price="${price.id}">Disattiva</button>
          </div>
        </article>
      `
    })
    .join('')

  document.querySelectorAll('[data-edit-localized-price]').forEach((button) => {
    button.addEventListener('click', () => {
      const price = localizedPricingData.prices.find((item) => item.id === Number(button.dataset.editLocalizedPrice))
      if (!price) return

      document.querySelector('#localizedPriceId').value = price.id
      localizedPriceProduct.value = price.product_id
      updateLocalizedVariantOptions()
      localizedPriceVariant.value = String(price.variant_id || 0)
      localizedPriceMarket.value = price.market_handle || ''
      localizedPriceCurrency.value = price.currency_code || 'EUR'
      localizedPriceAmount.value = centsToAdminPrice(price.price_cents)
      localizedPriceActive.checked = Number(price.active) !== 0
      localizedPriceMessage.textContent = adminUiText('Prezzo caricato nel form.')
    })
  })

  document.querySelectorAll('[data-disable-localized-price]').forEach((button) => {
    button.addEventListener('click', async () => {
      await fetch('/api/admin/localized-pricing', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(button.dataset.disableLocalizedPrice) }),
      })
      loadLocalizedPricingAdmin()
    })
  })
}

async function loadLocalizedPricingAdmin() {
  if (!localizedPricesList && !localizedPriceForm) return
  if (localizedPricesList) localizedPricesList.textContent = adminUiText('Caricamento prezzi localizzati...')

  try {
    const response = await fetch('/api/admin/localized-pricing')
    const data = await response.json()

    if (!data.success) {
      if (localizedPricesList) localizedPricesList.textContent = data.message || adminUiText('Prezzi localizzati non disponibili.')
      return
    }

    localizedPricingData = {
      products: data.products || [],
      variants: data.variants || [],
      markets: data.markets || adminMarketsData.markets || [],
      prices: data.prices || [],
    }
    renderLocalizedPriceOptions()
    renderLocalizedPricesList()
  } catch {
    if (localizedPricesList) localizedPricesList.textContent = adminUiText('Errore di connessione prezzi localizzati.')
  }
}

localizedPriceProduct?.addEventListener('change', updateLocalizedVariantOptions)
localizedPriceMarket?.addEventListener('change', () => {
  const option = localizedPriceMarket.selectedOptions?.[0]
  if (option?.dataset.currency && localizedPriceCurrency) localizedPriceCurrency.value = option.dataset.currency
})

localizedPriceForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  localizedPriceMessage.textContent = adminUiText('Salvataggio prezzo localizzato...')

  const payload = {
    id: document.querySelector('#localizedPriceId').value,
    product_id: Number(localizedPriceProduct.value || 0),
    variant_id: Number(localizedPriceVariant.value || 0),
    market_handle: localizedPriceMarket.value,
    currency_code: localizedPriceCurrency.value,
    price: localizedPriceAmount.value,
    active: localizedPriceActive.checked,
  }

  try {
    const response = await fetch('/api/admin/localized-pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    localizedPriceMessage.textContent = data.message || adminUiText('Prezzo localizzato salvato.')

    if (data.success) {
      resetLocalizedPriceForm()
      loadLocalizedPricingAdmin()
    }
  } catch {
    localizedPriceMessage.textContent = adminUiText('Errore di connessione prezzi localizzati.')
  }
})

refreshLocalizedPricesButton?.addEventListener('click', loadLocalizedPricingAdmin)
loadLocalizedPricingAdmin()

// ===============================
// ANALYTICS
// ===============================

const analyticsDashboard = document.querySelector('#analyticsDashboard')
const refreshAnalyticsButton = document.querySelector('#refreshAnalyticsButton')
const analyticsTrafficPanel = document.querySelector('#analyticsTrafficPanel')
const analyticsSalesPanel = document.querySelector('#analyticsSalesPanel')
const analyticsProductsPanel = document.querySelector('#analyticsProductsPanel')
const analyticsConversionsPanel = document.querySelector('#analyticsConversionsPanel')
const analyticsEventsPanel = document.querySelector('#analyticsEventsPanel')
const seoDashboard = document.querySelector('#seoDashboard')

function renderAnalyticsEmpty(target, text = t('analytics.empty', 'Nessun dato analytics ancora disponibile.')) {
  if (target) target.innerHTML = `<p class="admin-empty">${adminUiHtml(text)}</p>`
}

function renderAnalyticsMetricGrid(summary = {}) {
  return `
    <div class="analytics-metric-grid">
      <article><strong>${summary.page_views || 0}</strong><span>${adminUiHtml('Page views')}</span></article>
      <article><strong>${summary.product_views || 0}</strong><span>${adminUiHtml('Product views')}</span></article>
      <article><strong>${summary.add_to_cart || 0}</strong><span>${adminUiHtml('Add to cart')}</span></article>
      <article><strong>${summary.checkout_starts || 0}</strong><span>${adminUiHtml('Checkout start')}</span></article>
      <article><strong>${summary.orders_created || 0}</strong><span>${escapeHtml(t('analytics.ordersCreated', 'Ordini creati'))}</span></article>
      <article><strong>${summary.conversion_rate || 0}%</strong><span>${adminUiHtml('Checkout conversion')}</span></article>
      <article><strong>${formatMoney(summary.revenue_cents || 0)}</strong><span>${adminUiHtml('Revenue')}</span></article>
    </div>
  `
}

function renderAnalyticsPanels(data = {}) {
  const summary = data.summary || {}

  if (analyticsDashboard) {
    analyticsDashboard.innerHTML = `
      ${renderAnalyticsMetricGrid(summary)}
      <article class="admin-record">
        <div class="admin-record-head">
          <div>
            <h3>${escapeHtml(t('analytics.overview', 'Overview eventi'))}</h3>
            <p>${escapeHtml(t('analytics.overviewDesc', 'Eventi raccolti senza dati personali sensibili.'))}</p>
          </div>
        </div>
        <div class="meta">
          ${(data.counts || [])
            .map((item) => `<span>${escapeHtml(item.event_type)}: ${item.count}</span>`)
            .join('') || `<span>${escapeHtml(t('analytics.noEvents', 'Nessun evento'))}</span>`}
        </div>
      </article>
    `
  }

  if (analyticsTrafficPanel) {
    const rows = data.traffic || []
    analyticsTrafficPanel.innerHTML = rows.length
      ? rows
          .map((row) => `
            <article class="admin-record">
              <div class="admin-record-head">
                <div>
                  <h3>${escapeHtml(row.path || '/')}</h3>
                  <p>${adminUiHtml('Page views aggregate')}</p>
                </div>
                <strong>${row.views || 0}</strong>
              </div>
            </article>
          `)
          .join('')
      : `<p class="admin-empty">${escapeHtml(t('analytics.noPageViews', 'Nessuna page view ancora registrata.'))}</p>`
  }

  if (analyticsSalesPanel) {
    const sales = data.sales || {}
    analyticsSalesPanel.innerHTML = `
      <div class="analytics-metric-grid">
        <article><strong>${sales.orders_count || 0}</strong><span>${escapeHtml(t('orders.title', 'Ordini'))}</span></article>
        <article><strong>${formatMoney(sales.revenue_cents || 0)}</strong><span>${adminUiHtml('Revenue')}</span></article>
        <article><strong>${formatMoney(sales.average_order_cents || 0)}</strong><span>${escapeHtml(t('analytics.averageOrder', 'Valore medio'))}</span></article>
      </div>
    `
  }

  if (analyticsProductsPanel) {
    const rows = data.products || []
    analyticsProductsPanel.innerHTML = rows.length
      ? rows
          .map((product) => `
            <article class="admin-record">
              <div class="admin-record-head">
                <div>
                  <h3>${escapeHtml(product.product_name || product.product_ref || 'Prodotto')}</h3>
                  <p>${escapeHtml(product.product_ref || '')}</p>
                </div>
              </div>
              <div class="meta">
                <span>${adminUiHtml('View')}: ${product.product_views || 0}</span>
                <span>${adminUiHtml('Add to cart')}: ${product.add_to_cart || 0}</span>
              </div>
            </article>
          `)
          .join('')
      : `<p class="admin-empty">${escapeHtml(t('analytics.noProductEvents', 'Nessun evento prodotto ancora registrato.'))}</p>`
  }

  if (analyticsConversionsPanel) {
    const conversions = data.conversions || {}
    analyticsConversionsPanel.innerHTML = `
      <div class="analytics-metric-grid">
        <article><strong>${conversions.add_to_cart_rate || 0}%</strong><span>${adminUiHtml('Product to cart')}</span></article>
        <article><strong>${conversions.checkout_to_order_rate || 0}%</strong><span>${adminUiHtml('Checkout to order')}</span></article>
        <article><strong>${summary.checkout_starts || 0}</strong><span>${adminUiHtml('Checkout start')}</span></article>
        <article><strong>${summary.orders_created || 0}</strong><span>${escapeHtml(t('analytics.ordersCreated', 'Ordini creati'))}</span></article>
      </div>
    `
  }

  if (analyticsEventsPanel) {
    const rows = data.recent || []
    analyticsEventsPanel.innerHTML = rows.length
      ? rows
          .map((event) => `
            <article class="admin-record">
              <div class="admin-record-head">
                <div>
                  <h3>${escapeHtml(event.event_type)}</h3>
                  <p>${escapeHtml(event.path || '/')} ${event.entity_id ? `&middot; ${escapeHtml(event.entity_id)}` : ''}</p>
                </div>
                <strong>${escapeHtml(event.created_at || '')}</strong>
              </div>
            </article>
          `)
          .join('')
      : `<p class="admin-empty">${escapeHtml(t('analytics.noRecentEvents', 'Nessun evento recente.'))}</p>`
  }
}

async function loadAnalyticsDashboard() {
  if (analyticsDashboard) analyticsDashboard.textContent = t('analytics.loading', 'Caricamento analytics...')
  ;[analyticsTrafficPanel, analyticsSalesPanel, analyticsProductsPanel, analyticsConversionsPanel, analyticsEventsPanel].forEach((panel) => {
    if (panel) panel.textContent = t('analytics.loading', 'Caricamento analytics...')
  })

  try {
    const response = await fetch('/api/admin/analytics')
    const data = await response.json()

    if (!data.success) {
      renderAnalyticsEmpty(analyticsDashboard, data.message || adminUiText('Errore analytics.'))
      return
    }

    renderAnalyticsPanels(data)
  } catch {
    renderAnalyticsEmpty(analyticsDashboard, 'Errore di connessione analytics.')
  }
}

refreshAnalyticsButton?.addEventListener('click', loadAnalyticsDashboard)
loadAnalyticsDashboard()

function seoStatusForItem(item = {}, type = '') {
  const seo = item.seo || item
  const title = seo.meta_title || item.meta_title || item.title || item.name || ''
  const description = seo.meta_description || item.meta_description || item.excerpt || item.description || ''
  const missing = []

  if (!title || String(title).length < 20) missing.push('title')
  if (!description || String(description).length < 70) missing.push('description')

  if (!missing.length) return { key: 'good', label: adminUiText('Good'), missing }
  if (missing.length === 2) return { key: 'missing', label: adminUiText('Missing'), missing }
  return { key: 'attention', label: adminUiText('Needs attention'), missing }
}

function renderGoogleSnippet(item = {}, type = '') {
  const seo = item.seo || item
  const title = seo.meta_title || item.meta_title || item.title || item.name || 'Titolo pagina'
  const description =
    seo.meta_description ||
    item.meta_description ||
    item.excerpt ||
    item.description ||
    'Descrizione SEO non configurata: verra usato il contenuto principale come fallback.'
  const slug = item.slug || item.handle || ''

  return `
    <div class="seo-snippet">
      <strong>${escapeHtml(String(title).slice(0, 70))}</strong>
      <span>takeoffmilan.site/${escapeHtml(type)}/${escapeHtml(slug)}</span>
      <p>${escapeHtml(String(description).slice(0, 160))}</p>
    </div>
  `
}

async function fetchSeoResource(url, key) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data.success && Array.isArray(data[key]) ? data[key] : []
  } catch {
    return []
  }
}

async function loadSeoDashboard() {
  if (!seoDashboard) return
  seoDashboard.textContent = adminUiText('Caricamento SEO...')

  const [productsData, collectionsData, pages, posts, policies] = await Promise.all([
    fetch('/api/products').then((response) => response.json()).catch(() => ({ success: false, products: [] })),
    fetch('/api/collections').then((response) => response.json()).catch(() => ({ success: false, collections: [] })),
    fetchSeoResource('/api/pages', 'pages'),
    fetchSeoResource('/api/blog', 'posts'),
    fetchSeoResource('/api/policies', 'policies'),
  ])

  const resources = [
    ...((productsData.products || []).map((item) => ({ ...item, seo_type: 'product', seo_label: t('product', 'Prodotto') }))),
    ...((collectionsData.collections || []).map((item) => ({ ...item, seo_type: 'collection', seo_label: t('collections.title', 'Collezione') }))),
    ...(pages.map((item) => ({ ...item, seo_type: 'page', seo_label: t('pages.title', 'Pagina') }))),
    ...(posts.map((item) => ({ ...item, seo_type: 'blog', seo_label: 'Blog' }))),
    ...(policies.map((item) => ({ ...item, seo_type: 'policy', seo_label: 'Policy' }))),
  ]

  if (!resources.length) {
    seoDashboard.innerHTML = `<p class="admin-empty">${adminUiHtml('Nessun contenuto disponibile per l audit SEO.')}</p>`
    return
  }

  const enriched = resources.map((item) => ({
    ...item,
    status: seoStatusForItem(item, item.seo_type),
  }))
  const counts = enriched.reduce(
    (acc, item) => {
      acc[item.status.key] += 1
      return acc
    },
    { good: 0, attention: 0, missing: 0 },
  )

  seoDashboard.innerHTML = `
    <div class="analytics-metric-grid">
      <article><strong>${counts.good}</strong><span>${adminUiHtml('Good')}</span></article>
      <article><strong>${counts.attention}</strong><span>${adminUiHtml('Needs attention')}</span></article>
      <article><strong>${counts.missing}</strong><span>${adminUiHtml('Missing')}</span></article>
      <article><strong>${resources.length}</strong><span>${adminUiHtml('Totale contenuti')}</span></article>
    </div>
    <div class="placeholder-panel compact-panel">
      <span class="status-badge">${escapeHtml(t('status.basicConfiguration', 'Configurazione base'))}</span>
      <p>${escapeHtml(t('seo.dashboardNote', 'Sitemap, robots, canonical e hreflang sono predisposti a livello contenuto/setting. Search Console API e audit AI restano advanced tools in progress.'))}</p>
    </div>
    ${enriched
      .map((item) => `
        <article class="admin-record seo-record">
          <div class="admin-record-head">
            <div>
              <h3>${escapeHtml(item.name || item.title || item.slug || 'Contenuto')}</h3>
              <p>${escapeHtml(item.seo_label)} - ${escapeHtml(item.slug || '')}</p>
            </div>
            <span class="status-badge ${item.status.key === 'good' ? '' : 'status-badge--future'}">${escapeHtml(item.status.label)}</span>
          </div>
          ${renderGoogleSnippet(item, item.seo_type)}
          <div class="meta">
            <span>${item.status.missing.length ? `Da completare: ${escapeHtml(item.status.missing.join(', '))}` : 'Metadati principali presenti'}</span>
          </div>
        </article>
      `)
      .join('')}
  `
}

loadSeoDashboard()

// ===============================
// INTEGRAZIONI
// ===============================

const integrationForm = document.querySelector('#integrationForm')
const integrationsList = document.querySelector('#integrationsList')
const integrationMessage = document.querySelector('#integrationMessage')
const refreshIntegrationsButton = document.querySelector('#refreshIntegrationsButton')
const integrationFormTitle = document.querySelector('#integrationFormTitle')
const integrationSubmitButton = document.querySelector('#integrationSubmitButton')
const cancelIntegrationEdit = document.querySelector('#cancelIntegrationEdit')

function resetIntegrationForm() {
  if (!integrationForm) return
  integrationForm.reset()
  document.querySelector('#integrationId').value = ''
  document.querySelector('#integrationConfigJson').value = '{}'
  document.querySelector('#integrationActive').checked = true
  integrationFormTitle.textContent = t('integrations.add', 'Aggiungi integrazione')
  integrationSubmitButton.textContent = t('integrations.save', 'Salva integrazione')
  cancelIntegrationEdit.hidden = true
  integrationMessage.textContent = adminUiText('')
}

function fillIntegrationForm(integration) {
  document.querySelector('#integrationId').value = integration.id
  document.querySelector('#integrationName').value = integration.name || ''
  document.querySelector('#integrationType').value = integration.type || 'custom'
  document.querySelector('#integrationWebhookUrl').value = integration.webhook_url || ''
  document.querySelector('#integrationConfigJson').value = stringifyForTextarea(integration.config, {})
  document.querySelector('#integrationActive').checked = Number(integration.active) !== 0
  integrationFormTitle.textContent = t('integrations.edit', 'Modifica integrazione')
  integrationSubmitButton.textContent = t('integrations.update', 'Aggiorna integrazione')
  cancelIntegrationEdit.hidden = false
}

async function loadIntegrations() {
  if (!integrationsList) return
  integrationsList.textContent = adminUiText('Caricamento integrazioni...')

  try {
    const response = await fetch('/api/admin/integrations')
    const data = await response.json()

    if (!data.success) {
      integrationsList.textContent = data.message || adminUiText('Errore integrazioni.')
      return
    }

    integrationsList.innerHTML = data.integrations.length
      ? data.integrations
          .map(
            (integration) => `
              <article class="product-item">
                <h3>${escapeHtml(integration.name)}</h3>
                <p>${escapeHtml(integration.webhook_url || 'Nessun webhook')}</p>
                <div class="meta">
                  <span>${escapeHtml(integration.type)}</span>
                  <span>${integration.active ? 'Attiva' : 'Disattiva'}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-integration="${integration.id}">Modifica</button>
                  <button type="button" class="danger" data-disable-integration="${integration.id}">Disattiva</button>
                </div>
              </article>
            `,
          )
          .join('')
      : 'Nessuna integrazione.'

    document.querySelectorAll('[data-edit-integration]').forEach((button) => {
      button.addEventListener('click', () => {
        const integration = data.integrations.find((item) => item.id === Number(button.dataset.editIntegration))
        fillIntegrationForm(integration)
      })
    })

    document.querySelectorAll('[data-disable-integration]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/integrations', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableIntegration) }),
        })
        resetIntegrationForm()
        loadIntegrations()
      })
    })
  } catch {
    integrationsList.textContent = adminUiText('Errore di connessione integrazioni.')
  }
}

integrationForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  integrationMessage.textContent = adminUiText('Salvataggio integrazione...')
  const id = document.querySelector('#integrationId').value

  try {
    const payload = {
      id,
      name: document.querySelector('#integrationName').value.trim(),
      type: document.querySelector('#integrationType').value.trim(),
      webhook_url: document.querySelector('#integrationWebhookUrl').value.trim(),
      config: readJsonTextarea('#integrationConfigJson', {}),
      active: document.querySelector('#integrationActive').checked,
    }
    const response = await fetch('/api/admin/integrations', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    integrationMessage.textContent = data.message || adminUiText('Integrazione salvata.')
    if (data.success) {
      resetIntegrationForm()
      loadIntegrations()
    }
  } catch (error) {
    integrationMessage.textContent = adminUiText('Errore integrazione. Verifica il JSON configurazione e riprova.')
  }
})

cancelIntegrationEdit?.addEventListener('click', resetIntegrationForm)
refreshIntegrationsButton?.addEventListener('click', loadIntegrations)
loadIntegrations()

// ===============================
// UTENTI / PERMESSI
// ===============================

const adminUserForm = document.querySelector('#adminUserForm')
const adminUsersList = document.querySelector('#adminUsersList')
const adminUserMessage = document.querySelector('#adminUserMessage')
const refreshAdminUsersButton = document.querySelector('#refreshAdminUsersButton')
const adminUserFormTitle = document.querySelector('#adminUserFormTitle')
const adminUserSubmitButton = document.querySelector('#adminUserSubmitButton')
const cancelAdminUserEdit = document.querySelector('#cancelAdminUserEdit')
const adminUserPasswordInput = document.querySelector('#adminUserPassword')

function resetAdminUserForm() {
  if (!adminUserForm) return
  adminUserForm.reset()
  document.querySelector('#adminUserId').value = ''
  document.querySelector('#adminUserActive').checked = true
  if (adminUserPasswordInput) {
    adminUserPasswordInput.value = ''
    adminUserPasswordInput.required = true
    adminUserPasswordInput.placeholder = adminUiText('Minimo 8 caratteri')
  }
  adminUserFormTitle.textContent = t('users.add', 'Aggiungi utente')
  adminUserSubmitButton.textContent = t('users.save', 'Salva utente')
  cancelAdminUserEdit.hidden = true
  adminUserMessage.textContent = adminUiText('')
}

function fillAdminUserForm(user) {
  document.querySelector('#adminUserId').value = user.id
  document.querySelector('#adminUserName').value = user.name || ''
  document.querySelector('#adminUserEmail').value = user.email || ''
  document.querySelector('#adminUserRole').value = user.role || 'viewer'
  document.querySelector('#adminUserActive').checked = Number(user.active) !== 0
  if (adminUserPasswordInput) {
    adminUserPasswordInput.value = ''
    adminUserPasswordInput.required = false
    adminUserPasswordInput.placeholder = adminUiText('Lascia vuota per non cambiarla')
  }
  adminUserFormTitle.textContent = t('users.edit', 'Modifica utente')
  adminUserSubmitButton.textContent = t('users.update', 'Aggiorna utente')
  cancelAdminUserEdit.hidden = false
}

async function loadAdminUsers() {
  if (!adminUsersList) return

  if (!canAdminManageUsers()) {
    adminUsersList.textContent = adminUiText('Permessi insufficienti per gestire gli utenti admin.')
    if (adminUserForm) adminUserForm.hidden = true
    return
  }

  if (adminUserForm) adminUserForm.hidden = false
  adminUsersList.textContent = adminUiText('Caricamento utenti...')

  try {
    const response = await fetch('/api/admin/users')
    const data = await response.json()

    if (!data.success) {
      adminUsersList.textContent = data.message || adminUiText('Errore utenti.')
      return
    }

    adminUsersList.innerHTML = data.users.length
      ? data.users
          .map(
            (user) => `
              <article class="product-item">
                <h3>${escapeHtml(user.name)}</h3>
                <p>${escapeHtml(user.email)}</p>
                <div class="meta">
                  <span>${escapeHtml(user.role)}</span>
                  <span>${user.active ? 'Attivo' : 'Disattivo'}</span>
                  <span>${user.has_password ? 'Login attivo' : 'Password mancante'}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-admin-user="${user.id}">Modifica</button>
                  <button type="button" class="danger" data-disable-admin-user="${user.id}">Disattiva</button>
                </div>
              </article>
            `,
          )
          .join('')
      : 'Nessun utente admin.'

    document.querySelectorAll('[data-edit-admin-user]').forEach((button) => {
      button.addEventListener('click', () => {
        const user = data.users.find((item) => item.id === Number(button.dataset.editAdminUser))
        fillAdminUserForm(user)
      })
    })

    document.querySelectorAll('[data-disable-admin-user]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableAdminUser) }),
        })
        resetAdminUserForm()
        loadAdminUsers()
      })
    })
  } catch {
    adminUsersList.textContent = adminUiText('Errore di connessione utenti.')
  }
}

adminUserForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!canAdminManageUsers()) {
    adminUserMessage.textContent = adminUiText('Permessi insufficienti.')
    return
  }

  adminUserMessage.textContent = adminUiText('Salvataggio utente...')
  const id = document.querySelector('#adminUserId').value

  try {
    const response = await fetch('/api/admin/users', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: document.querySelector('#adminUserName').value.trim(),
        email: document.querySelector('#adminUserEmail').value.trim(),
        password: document.querySelector('#adminUserPassword')?.value || '',
        role: document.querySelector('#adminUserRole').value,
        active: document.querySelector('#adminUserActive').checked,
      }),
    })
    const data = await response.json()
    adminUserMessage.textContent = data.message || adminUiText('Utente salvato.')
    if (data.success) {
      resetAdminUserForm()
      loadAdminUsers()
    }
  } catch {
    adminUserMessage.textContent = adminUiText('Errore di connessione utenti.')
  }
})

cancelAdminUserEdit?.addEventListener('click', resetAdminUserForm)
refreshAdminUsersButton?.addEventListener('click', loadAdminUsers)
loadAdminUsers()

// ===============================
// ACTIVITY LOG
// ===============================

const activityLogList = document.querySelector('#activityLogList')
const refreshActivityButton = document.querySelector('#refreshActivityButton')

async function loadActivityLog() {
  if (!activityLogList) return

  if (!canAdminViewSensitiveSettings()) {
    activityLogList.textContent = adminUiText('Permessi insufficienti per leggere l\'activity log.')
    return
  }

  activityLogList.textContent = adminUiText('Caricamento activity log...')

  try {
    const response = await fetch('/api/admin/activity')
    const data = await response.json()

    if (!data.success) {
      activityLogList.textContent = data.message || adminUiText('Errore activity log.')
      return
    }

    activityLogList.innerHTML = data.logs.length
      ? data.logs
          .map(
            (log) => `
              <article class="admin-record">
                <div class="admin-record-head">
                  <div>
                    <h3>${escapeHtml(log.action)} / ${escapeHtml(log.entity_type)}</h3>
                    <p>${escapeHtml(log.description || '')}</p>
                  </div>
                  <strong>${escapeHtml(log.created_at || '')}</strong>
                </div>
                <div class="meta"><span>ID: ${escapeHtml(log.entity_id || 'N/D')}</span></div>
              </article>
            `,
          )
          .join('')
      : 'Nessun log.'
  } catch {
    activityLogList.textContent = adminUiText('Errore di connessione activity log.')
  }
}

refreshActivityButton?.addEventListener('click', loadActivityLog)
loadActivityLog()

// ===============================
// NOTIFICHE
// ===============================

const notificationForm = document.querySelector('#notificationForm')
const notificationsList = document.querySelector('#notificationsList')
const notificationMessage = document.querySelector('#notificationMessage')
const refreshNotificationsButton = document.querySelector('#refreshNotificationsButton')
const notificationFormTitle = document.querySelector('#notificationFormTitle')
const notificationSubmitButton = document.querySelector('#notificationSubmitButton')
const cancelNotificationEdit = document.querySelector('#cancelNotificationEdit')
const notificationProviderStatus = document.querySelector('#notificationProviderStatus')

function resetNotificationForm() {
  if (!notificationForm) return
  notificationForm.reset()
  document.querySelector('#notificationId').value = ''
  document.querySelector('#notificationActive').checked = true
  notificationFormTitle.textContent = t('notifications.add', 'Aggiungi template')
  notificationSubmitButton.textContent = t('notifications.save', 'Salva template')
  cancelNotificationEdit.hidden = true
  notificationMessage.textContent = adminUiText('')
}

function fillNotificationForm(template) {
  document.querySelector('#notificationId').value = template.id
  document.querySelector('#notificationType').value = template.type || 'generic'
  document.querySelector('#notificationTitle').value = template.title || ''
  document.querySelector('#notificationSubject').value = template.subject || ''
  document.querySelector('#notificationBody').value = template.body || ''
  document.querySelector('#notificationActive').checked = Number(template.active) !== 0
  notificationFormTitle.textContent = t('notifications.edit', 'Modifica template')
  notificationSubmitButton.textContent = t('notifications.update', 'Aggiorna template')
  cancelNotificationEdit.hidden = false
}

async function loadNotifications() {
  if (!notificationsList) return
  notificationsList.textContent = adminUiText('Caricamento notifiche...')

  try {
    const response = await fetch('/api/admin/notifications')
    const data = await response.json()

    if (!data.success) {
      notificationsList.textContent = data.message || adminUiText('Errore notifiche.')
      return
    }

    if (notificationProviderStatus) {
      const provider = data.provider_status || {}
      notificationProviderStatus.innerHTML = `
        <span class="status-badge">${escapeHtml(provider.active_provider === 'none' ? 'Mock / logging only' : provider.active_provider)}</span>
        <p>${escapeHtml(provider.message || 'Provider email non configurato.')}</p>
        <small>Env supportate: RESEND_API_KEY, SENDGRID_API_KEY, BREVO_API_KEY, MAILGUN_API_KEY.</small>
      `
    }

    notificationsList.innerHTML = `
      ${(data.templates || [])
        .map(
          (template) => `
            <article class="product-item">
              <h3>${escapeHtml(template.title)}</h3>
              <p>${escapeHtml(template.subject || '')}</p>
              <div class="meta">
                <span>${escapeHtml(template.type)}</span>
                <span>${template.active ? 'Attivo' : 'Disattivo'}</span>
                ${template.fallback ? '<span>Template fallback</span>' : ''}
              </div>
              <div class="product-actions">
                <button type="button" data-edit-notification="${template.id}">Modifica</button>
                <button type="button" data-send-notification-mock="${template.id}" data-notification-type="${escapeHtml(template.type)}">Invio mock</button>
                ${template.id ? `<button type="button" class="danger" data-disable-notification="${template.id}">Disattiva</button>` : ''}
              </div>
            </article>
          `,
        )
        .join('') || 'Nessun template.'}
      ${(data.logs || [])
        .slice(0, 5)
        .map(
          (log) => `
            <article class="admin-record">
              <div class="admin-record-head">
                <div>
                  <h3>Log ${escapeHtml(log.type)}</h3>
                  <p>${escapeHtml(log.description || '')}</p>
                </div>
                <strong>${escapeHtml(log.created_at || '')}</strong>
              </div>
            </article>
          `,
        )
        .join('')}
    `

    document.querySelectorAll('[data-edit-notification]').forEach((button) => {
      button.addEventListener('click', () => {
        const template = data.templates.find((item) => item.id === Number(button.dataset.editNotification))
        fillNotificationForm(template)
      })
    })

    document.querySelectorAll('[data-send-notification-mock]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send_mock',
            template_id: Number(button.dataset.sendNotificationMock),
            type: button.dataset.notificationType || 'generic',
          }),
        })
        loadNotifications()
        loadActivityLog()
      })
    })

    document.querySelectorAll('[data-disable-notification]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/notifications', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableNotification) }),
        })
        resetNotificationForm()
        loadNotifications()
      })
    })
  } catch {
    notificationsList.textContent = adminUiText('Errore di connessione notifiche.')
  }
}

notificationForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  notificationMessage.textContent = adminUiText('Salvataggio notifica...')
  const id = document.querySelector('#notificationId').value

  try {
    const response = await fetch('/api/admin/notifications', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        type: document.querySelector('#notificationType').value,
        title: document.querySelector('#notificationTitle').value.trim(),
        subject: document.querySelector('#notificationSubject').value.trim(),
        body: document.querySelector('#notificationBody').value.trim(),
        active: document.querySelector('#notificationActive').checked,
      }),
    })
    const data = await response.json()
    notificationMessage.textContent = data.message || adminUiText('Notifica salvata.')
    if (data.success) {
      resetNotificationForm()
      loadNotifications()
    }
  } catch {
    notificationMessage.textContent = adminUiText('Errore di connessione notifiche.')
  }
})

cancelNotificationEdit?.addEventListener('click', resetNotificationForm)
refreshNotificationsButton?.addEventListener('click', loadNotifications)
loadNotifications()

// ===============================
// DOMINI
// ===============================

const domainForm = document.querySelector('#domainForm')
const domainsList = document.querySelector('#domainsList')
const domainMessage = document.querySelector('#domainMessage')
const refreshDomainsButton = document.querySelector('#refreshDomainsButton')
const domainFormTitle = document.querySelector('#domainFormTitle')
const domainSubmitButton = document.querySelector('#domainSubmitButton')
const cancelDomainEdit = document.querySelector('#cancelDomainEdit')

function resetDomainForm() {
  if (!domainForm) return
  domainForm.reset()
  document.querySelector('#domainId').value = ''
  document.querySelector('#domainPrimary').checked = false
  domainFormTitle.textContent = t('domains.add', 'Aggiungi dominio')
  domainSubmitButton.textContent = t('domains.save', 'Salva dominio')
  cancelDomainEdit.hidden = true
  domainMessage.textContent = adminUiText('')
}

function fillDomainForm(domain) {
  document.querySelector('#domainId').value = domain.id
  document.querySelector('#domainName').value = domain.domain || ''
  document.querySelector('#domainType').value = domain.type || 'preview'
  document.querySelector('#domainStatus').value = domain.status || 'pending'
  document.querySelector('#domainDnsNotes').value = domain.dns_notes || ''
  document.querySelector('#domainPrimary').checked = Number(domain.is_primary) === 1
  domainFormTitle.textContent = t('domains.edit', 'Modifica dominio')
  domainSubmitButton.textContent = t('domains.update', 'Aggiorna dominio')
  cancelDomainEdit.hidden = false
}

function readDomainPayload() {
  return {
    id: document.querySelector('#domainId').value,
    domain: document.querySelector('#domainName').value.trim(),
    type: document.querySelector('#domainType').value,
    status: document.querySelector('#domainStatus').value,
    dns_notes: document.querySelector('#domainDnsNotes').value.trim(),
    is_primary: document.querySelector('#domainPrimary').checked,
  }
}

async function loadDomainsAdmin() {
  if (!domainsList) return
  domainsList.textContent = adminUiText('Caricamento domini...')

  try {
    const response = await fetch('/api/admin/domains')
    const data = await response.json()

    if (!data.success) {
      domainsList.textContent = data.message || adminUiText('Errore domini.')
      return
    }

    domainsList.innerHTML = data.domains.length
      ? data.domains
          .map(
            (domain) => `
              <article class="product-item">
                <h3>${escapeHtml(domain.domain)}</h3>
                <p>${escapeHtml(domain.dns_notes || 'Nessuna nota DNS')}</p>
                <div class="meta">
                  <span>${escapeHtml(domain.type)}</span>
                  <span>${escapeHtml(domain.status)}</span>
                  <span>${domain.is_primary ? 'Primario' : 'Non primario'}</span>
                </div>
                <div class="product-actions">
                  <button type="button" data-edit-domain="${domain.id}">Modifica</button>
                  <button type="button" class="danger" data-disable-domain="${domain.id}">Disabilita</button>
                </div>
              </article>
            `,
          )
          .join('')
      : 'Nessun dominio configurato.'

    document.querySelectorAll('[data-edit-domain]').forEach((button) => {
      button.addEventListener('click', () => {
        const domain = data.domains.find((item) => item.id === Number(button.dataset.editDomain))
        fillDomainForm(domain)
      })
    })

    document.querySelectorAll('[data-disable-domain]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch('/api/admin/domains', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: Number(button.dataset.disableDomain) }),
        })
        resetDomainForm()
        loadDomainsAdmin()
      })
    })
  } catch {
    domainsList.textContent = adminUiText('Errore di connessione domini.')
  }
}

domainForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  domainMessage.textContent = adminUiText('Salvataggio dominio...')
  const payload = readDomainPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/domains', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    domainMessage.textContent = data.message || adminUiText('Dominio salvato.')
    if (data.success) {
      resetDomainForm()
      loadDomainsAdmin()
    }
  } catch {
    domainMessage.textContent = adminUiText('Errore di connessione domini.')
  }
})

cancelDomainEdit?.addEventListener('click', resetDomainForm)
refreshDomainsButton?.addEventListener('click', loadDomainsAdmin)
loadDomainsAdmin()

// ===============================
// TENANTS
// ===============================

const tenantForm = document.querySelector('#tenantForm')
const tenantsList = document.querySelector('#tenantsList')
const tenantMessage = document.querySelector('#tenantMessage')
const refreshTenantsButton = document.querySelector('#refreshTenantsButton')
const tenantFormTitle = document.querySelector('#tenantFormTitle')
const tenantSubmitButton = document.querySelector('#tenantSubmitButton')
const cancelTenantEdit = document.querySelector('#cancelTenantEdit')

function resetTenantForm() {
  if (!tenantForm) return
  tenantForm.reset()
  document.querySelector('#tenantId').value = ''
  document.querySelector('#tenantDefault').checked = false
  tenantFormTitle.textContent = t('tenants.add', 'Aggiungi tenant')
  tenantSubmitButton.textContent = t('tenants.save', 'Salva tenant')
  cancelTenantEdit.hidden = true
  tenantMessage.textContent = adminUiText('')
}

function fillTenantForm(tenant) {
  document.querySelector('#tenantId').value = tenant.id
  document.querySelector('#tenantName').value = tenant.name || ''
  document.querySelector('#tenantHandle').value = tenant.handle || ''
  document.querySelector('#tenantStatus').value = tenant.status || 'active'
  document.querySelector('#tenantNotes').value = tenant.notes || ''
  document.querySelector('#tenantDefault').checked = Number(tenant.is_default) === 1
  tenantFormTitle.textContent = t('tenants.edit', 'Modifica tenant')
  tenantSubmitButton.textContent = t('tenants.update', 'Aggiorna tenant')
  cancelTenantEdit.hidden = false
}

function readTenantPayload() {
  return {
    id: document.querySelector('#tenantId').value,
    name: document.querySelector('#tenantName').value.trim(),
    handle: document.querySelector('#tenantHandle').value.trim(),
    status: document.querySelector('#tenantStatus').value,
    notes: document.querySelector('#tenantNotes').value.trim(),
    is_default: document.querySelector('#tenantDefault').checked,
  }
}

async function loadTenantsAdmin() {
  if (!tenantsList) return
  tenantsList.textContent = adminUiText('Caricamento tenants...')

  try {
    const response = await fetch('/api/admin/tenants')
    const data = await response.json()

    if (!data.success) {
      tenantsList.textContent = data.message || adminUiText('Errore tenants.')
      return
    }

    tenantsList.innerHTML = `
      <article class="admin-record">
        <p>${escapeHtml(data.note || '')}</p>
      </article>
      ${
        data.tenants.length
          ? data.tenants
              .map(
                (tenant) => `
                  <article class="product-item">
                    <h3>${escapeHtml(tenant.name)}</h3>
                    <p>${escapeHtml(tenant.notes || 'Nessuna nota')}</p>
                    <div class="meta">
                      <span>${escapeHtml(tenant.handle)}</span>
                      <span>${escapeHtml(tenant.status)}</span>
                      <span>${tenant.is_default ? 'Default' : 'Non default'}</span>
                    </div>
                    <div class="product-actions">
                      <button type="button" data-edit-tenant="${tenant.id}">Modifica</button>
                    </div>
                  </article>
                `,
              )
              .join('')
          : 'Nessun tenant.'
      }
    `

    document.querySelectorAll('[data-edit-tenant]').forEach((button) => {
      button.addEventListener('click', () => {
        const tenant = data.tenants.find((item) => item.id === Number(button.dataset.editTenant))
        fillTenantForm(tenant)
      })
    })
  } catch {
    tenantsList.textContent = adminUiText('Errore di connessione tenants.')
  }
}

tenantForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  tenantMessage.textContent = adminUiText('Salvataggio tenant...')
  const payload = readTenantPayload()
  const isEditing = Boolean(payload.id)

  try {
    const response = await fetch('/api/admin/tenants', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    tenantMessage.textContent = data.message || adminUiText('Tenant salvato.')
    if (data.success) {
      resetTenantForm()
      loadTenantsAdmin()
    }
  } catch {
    tenantMessage.textContent = adminUiText('Errore di connessione tenants.')
  }
})

cancelTenantEdit?.addEventListener('click', resetTenantForm)
refreshTenantsButton?.addEventListener('click', loadTenantsAdmin)
loadTenantsAdmin()

// ===============================
// PERFORMANCE
// ===============================

const performanceForm = document.querySelector('#performanceForm')
const performanceDashboard = document.querySelector('#performanceDashboard')
const performanceMessage = document.querySelector('#performanceMessage')
const refreshPerformanceButton = document.querySelector('#refreshPerformanceButton')

async function loadPerformanceAdmin() {
  if (!performanceDashboard) return
  performanceDashboard.textContent = adminUiText('Caricamento performance...')

  try {
    const response = await fetch('/api/admin/performance')
    const data = await response.json()

    if (!data.success) {
      performanceDashboard.textContent = data.message || adminUiText('Errore performance.')
      return
    }

    document.querySelector('#performanceCacheSeconds').value = data.map?.public_cache_seconds || 120
    document.querySelector('#performanceFetchTimeout').value = data.map?.fetch_timeout_ms || 8000
    document.querySelector('#performanceLazyImages').checked = String(data.map?.lazy_images ?? '1') !== '0'

    performanceDashboard.innerHTML = `
      <article class="admin-record">
        <div class="admin-record-head">
          <div>
            <h3>Checklist produzione</h3>
            <p>Stato base non invasivo.</p>
          </div>
        </div>
        <div class="admin-lines">
          ${(data.checklist || [])
            .map((item) => `<div><span>${escapeHtml(item)}</span><strong>OK</strong></div>`)
            .join('')}
        </div>
      </article>
      <article class="admin-record">
        <div class="admin-record-head">
          <div>
            <h3>Domini / Tenant</h3>
            <p>${data.domains?.length || 0} domini, ${data.tenants?.length || 0} tenants configurati.</p>
          </div>
        </div>
      </article>
    `
  } catch {
    performanceDashboard.textContent = adminUiText('Errore di connessione performance.')
  }
}

performanceForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  performanceMessage.textContent = adminUiText('Salvataggio performance...')

  try {
    const response = await fetch('/api/admin/performance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settings: {
          public_cache_seconds: document.querySelector('#performanceCacheSeconds').value,
          fetch_timeout_ms: document.querySelector('#performanceFetchTimeout').value,
          lazy_images: document.querySelector('#performanceLazyImages').checked ? '1' : '0',
        },
      }),
    })
    const data = await response.json()
    performanceMessage.textContent = data.message || adminUiText('Performance salvata.')
    if (data.success) loadPerformanceAdmin()
  } catch {
    performanceMessage.textContent = adminUiText('Errore di connessione performance.')
  }
})

refreshPerformanceButton?.addEventListener('click', loadPerformanceAdmin)
loadPerformanceAdmin()

// ===============================
// ORDINI
// ===============================

const ordersList = document.querySelector('#ordersList')
const refreshOrdersButton = document.querySelector('#refreshOrdersButton')
const orderAdminSearch = document.querySelector('#orderAdminSearch')
const operationsSummary = document.querySelector('#operationsSummary')
const storeHealthSummary = document.querySelector('#storeHealthSummary')
const storeHealthList = document.querySelector('#storeHealthList')
const refreshStoreHealthButton = document.querySelector('#refreshStoreHealthButton')
const launchChecklistList = document.querySelector('#launchChecklistList')
const refreshLaunchChecklistButton = document.querySelector('#refreshLaunchChecklistButton')

function renderOrderStatusSelect(order) {
  const statuses = [
    ['pending', adminUiText('Pending')],
    ['confirmed', adminUiText('Confirmed')],
    ['fulfilled', adminUiText('Fulfilled')],
    ['cancelled', adminUiText('Cancelled')],
  ]

  return `
    <select data-order-status="${order.id}">
      ${statuses
        .map(
          ([value, label]) => `
            <option value="${value}" ${order.order_status === value ? 'selected' : ''}>
              ${escapeHtml(label)}
            </option>
          `,
        )
        .join('')}
    </select>
  `
}

async function loadOrders() {
  if (!ordersList) return

  renderAdminListState(ordersList, t('orders.loading', 'Caricamento ordini...'), 'loading')

  try {
    const response = await fetch('/api/admin/orders')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(ordersList, data.message || t('orders.loadError', 'Errore caricamento ordini.'), 'error')
      return
    }

    setAdminDashboardCount('orders', data.orders?.length || 0)

    if (!data.orders.length) {
      renderAdminListState(ordersList, t('orders.empty', 'Nessun ordine trovato.'))
      return
    }

    const search = normalizeAdminSearch(orderAdminSearch?.value)
    const visibleOrders = data.orders.filter((order) =>
      adminItemMatchesSearch(order, search, [
        'id',
        'customer_name',
        'email',
        'payment_status',
        'payment_method',
        'payment_provider',
        'order_status',
        'shipping_address_city',
        'shipping_address_country',
      ]),
    )

    if (!visibleOrders.length) {
      renderAdminListState(ordersList, t('orders.noSearchResults', 'Nessun ordine corrisponde alla ricerca.'))
      return
    }

    ordersList.innerHTML = visibleOrders
      .map(
        (order) => `
          <article class="admin-record">
            <div class="admin-record-head">
              <div>
                <h3>${escapeHtml(t('orders.order', 'Ordine'))} #${order.id}</h3>
                <p>${escapeHtml(order.customer_name || order.email || t('customers.customer', 'Cliente'))}</p>
              </div>
              <strong>${formatMoney(order.total_cents || 0)}</strong>
            </div>

            <div class="meta">
              <span>${escapeHtml(t('orders.payment', 'Pagamento'))}: ${adminUiHtml(order.payment_status || 'pending')}</span>
              <span>${escapeHtml(t('orders.method', 'Metodo'))}: ${adminUiHtml(order.payment_method || 'manual')}</span>
              <span>${escapeHtml(t('orders.provider', 'Provider'))}: ${adminUiHtml(order.payment_provider || 'manual')}</span>
              <span>Ref: ${escapeHtml(order.provider_reference || 'N/D')}</span>
              <span>${escapeHtml(t('orders.currency', 'Valuta'))}: ${escapeHtml(order.currency || 'EUR')}</span>
              <span>${escapeHtml(t('orders.shipping', 'Spedizione'))}: ${adminUiHtml(order.shipping_method || 'standard')}</span>
              <span>${escapeHtml(t('orders.fulfillment', 'Fulfillment'))}: ${adminUiHtml(order.fulfillment_status || 'unfulfilled')}</span>
              <span>${escapeHtml(t('orders.refund', 'Rimborso'))}: ${adminUiHtml(order.refund_status || 'none')}</span>
              <span>${escapeHtml(t('orders.discount', 'Sconto'))}: ${order.discount_cents ? `-${formatMoney(order.discount_cents)}` : formatMoney(0)}</span>
              <span>${escapeHtml(t('orders.taxes', 'Tasse'))}: ${formatMoney(order.tax_cents || 0)}</span>
              <span>${escapeHtml(order.created_at || '')}</span>
            </div>

            <div class="admin-record-address">
              ${escapeHtml(order.shipping_address_line1 || '')}
              ${escapeHtml(order.shipping_address_city || '')}
              ${escapeHtml(order.shipping_address_postal_code || '')}
              ${escapeHtml(order.shipping_address_country || '')}
            </div>

            <details>
              <summary>${escapeHtml(t('orders.orderLines', 'Righe ordine'))} (${order.items?.length || 0})</summary>
              <div class="admin-lines">
                ${(order.items || [])
                  .map(
                    (item) => `
                      <div>
                        <span>
                          ${escapeHtml(item.product_name || item.product_slug || `Prodotto ${item.product_id}`)}
                          ${item.variant_label ? ` - ${escapeHtml(item.variant_label)}` : ''}
                        </span>
                        <strong>${item.quantity} x ${formatMoney(item.price_cents || 0)}</strong>
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            </details>

            <label class="admin-status-control">
              ${escapeHtml(t('orders.orderStatus', 'Stato ordine'))}
              ${renderOrderStatusSelect(order)}
            </label>

            <label class="admin-status-control">
              ${escapeHtml(t('orders.paymentStatus', 'Stato pagamento'))}
              ${renderPaymentStatusSelect(order)}
            </label>

            <details open>
              <summary>${adminUiHtml('Operations workflow')}</summary>
              <div class="operations-tools" data-order-tools="${order.id}">
                <label>Carrier
                  <input data-order-tracking-carrier type="text" value="${escapeHtml(order.tracking_carrier || '')}" placeholder="DHL, UPS, Poste..." />
                </label>
                <label>Tracking number
                  <input data-order-tracking-number type="text" value="${escapeHtml(order.tracking_number || '')}" placeholder="Tracking number" />
                </label>
                <label>Tracking URL
                  <input data-order-tracking-url type="text" value="${escapeHtml(order.tracking_url || '')}" placeholder="https://..." />
                </label>
                <label>${adminUiHtml('Shipping note')}
                  <input data-order-shipping-note type="text" value="${escapeHtml(order.shipping_note || '')}" placeholder="Nota spedizione" />
                </label>
                <label>${adminUiHtml('Internal note')}
                  <textarea data-order-internal-note placeholder="Nota interna ordine">${escapeHtml(order.internal_note || '')}</textarea>
                </label>
                <label>${adminUiHtml('Refund amount EUR')}
                  <input data-order-refund-amount type="number" step="0.01" value="${Number(order.refund_amount_cents || 0) / 100}" />
                </label>
                <label>${adminUiHtml('Refund note')}
                  <input data-order-refund-note type="text" value="${escapeHtml(order.refund_note || '')}" placeholder="Manual refund / provider required" />
                </label>
                <div class="product-actions">
                  <button type="button" data-order-action="confirm_order" data-order-id="${order.id}">${escapeHtml(t('orders.confirm', 'Conferma ordine'))}</button>
                  <button type="button" data-order-action="mark_paid" data-order-id="${order.id}">${escapeHtml(t('orders.markPaid', 'Marca pagato'))}</button>
                  <button type="button" data-order-action="add_tracking" data-order-id="${order.id}">${escapeHtml(t('orders.addTracking', 'Aggiungi tracking'))}</button>
                  <button type="button" data-order-action="mark_fulfilled" data-order-id="${order.id}">${escapeHtml(t('orders.markFulfilled', 'Marca come spedito'))}</button>
                  <button type="button" data-order-action="add_note" data-order-id="${order.id}">${escapeHtml(t('orders.saveNote', 'Salva nota'))}</button>
                  <button type="button" data-order-action="refund_requested" data-order-id="${order.id}">${adminUiHtml('Refund requested')}</button>
                  <button type="button" data-order-action="refund_complete" data-order-id="${order.id}">${adminUiHtml('Refund complete')}</button>
                  <button type="button" class="danger" data-order-action="cancel_order" data-order-id="${order.id}">${escapeHtml(t('orders.cancel', 'Cancella ordine'))}</button>
                </div>
              </div>
            </details>

            <details>
              <summary>${adminUiHtml('Returns / refunds')} (${order.returns?.length || 0})</summary>
              <div class="admin-lines">
                ${(order.returns || [])
                  .map(
                    (item) => `
                      <div>
                        <span>${escapeHtml(item.status || 'requested')} - ${escapeHtml(item.reason || 'Return request')}</span>
                        <strong>${formatMoney(item.refund_amount_cents || 0)}</strong>
                      </div>
                    `,
                  )
                  .join('') || `<p>${adminUiHtml('Manual refund / provider required. Nessun reso collegato.')}</p>`}
              </div>
            </details>

            <details>
              <summary>Timeline (${order.timeline?.length || 0})</summary>
              <div class="admin-lines timeline-lines">
                ${(order.timeline || [])
                  .map(
                    (event) => `
                      <div>
                        <span>${escapeHtml(event.title || event.event_type)} ${event.description ? `- ${escapeHtml(event.description)}` : ''}</span>
                        <strong>${escapeHtml(event.created_at || '')}</strong>
                      </div>
                    `,
                  )
                  .join('') || '<p>La timeline verra registrata con la migration Operations Suite.</p>'}
              </div>
            </details>

            <details>
              <summary>${adminUiHtml('Notification log')} (${order.notification_logs?.length || 0})</summary>
              <div class="admin-lines">
                ${(order.notification_logs || [])
                  .map(
                    (log) => `
                      <div>
                        <span>${escapeHtml(log.type || 'notification')} - ${escapeHtml(log.status || 'mocked')}</span>
                        <strong>${escapeHtml(log.created_at || '')}</strong>
                      </div>
                    `,
                  )
                  .join('') || `<p>${adminUiHtml('Nessuna notifica loggata per questo ordine.')}</p>`}
              </div>
            </details>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-order-status]').forEach((select) => {
      select.addEventListener('change', async () => {
        const response = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Number(select.dataset.orderStatus),
            order_status: select.value,
          }),
        })
        const result = await response.json()

        if (!result.success) {
          alert(result.message || t('orders.updateError', 'Errore aggiornamento ordine.'))
          await loadOrders()
        }
      })
    })

    document.querySelectorAll('[data-payment-status]').forEach((select) => {
      select.addEventListener('change', async () => {
        await sendOrderAction({
          id: Number(select.dataset.paymentStatus),
          action: select.value === 'paid' ? 'mark_paid' : 'update_payment_status',
          payment_status: select.value,
        })
      })
    })

    document.querySelectorAll('[data-order-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const order = data.orders.find((item) => item.id === Number(button.dataset.orderId))
        if (!order) return
        if (button.dataset.orderAction === 'cancel_order') {
          const confirmed = confirm(t('orders.cancelConfirm', 'Confermi cancellazione ordine?'))
          if (!confirmed) return
        }
        await sendOrderAction(orderActionPayload(order, button.dataset.orderAction))
      })
    })
  } catch {
    renderAdminListState(ordersList, 'Errore di connessione agli ordini.', 'error')
  }
}

refreshOrdersButton?.addEventListener('click', loadOrders)
orderAdminSearch?.addEventListener('input', loadOrders)
refreshStoreHealthButton?.addEventListener('click', loadStoreHealth)
refreshLaunchChecklistButton?.addEventListener('click', loadLaunchChecklist)
loadOrders()

// ===============================
// CLIENTI
// ===============================

const customersList = document.querySelector('#customersList')
const refreshCustomersButton = document.querySelector('#refreshCustomersButton')
const customerAdminSearch = document.querySelector('#customerAdminSearch')
const customerAccountsSummary = document.querySelector('#customerAccountsSummary')

async function loadCustomerAccountsSummary() {
  if (!customerAccountsSummary) return
  try {
    const response = await fetch('/api/admin/customer-accounts')
    const data = await response.json()
    if (!response.ok || !data.success) return
    customerAccountsSummary.innerHTML = `
      ${(data.statuses || [])
        .map(
          (item) => `
            <article class="metric-card">
              <span>${escapeHtml(item.account_status || 'guest')}</span>
              <strong>${item.count || 0}</strong>
            </article>
          `,
        )
        .join('')}
      <article class="metric-card">
        <span>Account readiness</span>
        <strong>${data.setup_required ? 'Setup required' : 'Provider-ready'}</strong>
        <small>${escapeHtml(data.note || '')}</small>
      </article>
    `
  } catch {}
}

async function loadCustomers() {
  if (!customersList) return

  renderAdminListState(customersList, 'Caricamento clienti...', 'loading')

  try {
    const response = await fetch('/api/admin/customers')
    const data = await response.json()

    if (!data.success) {
      renderAdminListState(customersList, data.message || adminUiText('Errore caricamento clienti.'), 'error')
      return
    }

    if (!data.customers.length) {
      renderAdminListState(customersList, 'Nessun cliente trovato.')
      return
    }

    const search = normalizeAdminSearch(customerAdminSearch?.value)
    const visibleCustomers = data.customers.filter((customer) =>
      adminItemMatchesSearch(customer, search, [
        'name',
        'email',
        'phone',
        'shipping_address_city',
        'shipping_address_country',
      ]),
    )

    if (!visibleCustomers.length) {
      renderAdminListState(customersList, 'Nessun cliente corrisponde alla ricerca.')
      return
    }

    customersList.innerHTML = visibleCustomers
      .map(
        (customer) => `
          <article class="admin-record">
            <div class="admin-record-head">
              <div>
                <h3>${escapeHtml(customer.name || customer.email)}</h3>
                <p>${escapeHtml(customer.email)}</p>
              </div>
              <strong>${customer.orders?.length || 0} ordini</strong>
            </div>

            <div class="meta">
              <span>Telefono: ${escapeHtml(customer.phone || 'N/D')}</span>
              <span>${escapeHtml(customer.shipping_address_city || 'Citta N/D')}</span>
              <span>${escapeHtml(customer.shipping_address_country || 'Paese N/D')}</span>
              <span>Account: ${escapeHtml(customer.account_status || 'guest')}</span>
              <span>LTV: ${formatMoney(customer.lifetime_value_cents || 0)}</span>
              <span>Tags: ${escapeHtml(customer.tags || 'N/D')}</span>
            </div>

            <div class="admin-record-address">
              ${escapeHtml(customer.shipping_address_line1 || '')}
              ${escapeHtml(customer.shipping_address_postal_code || '')}
            </div>

            <details>
              <summary>Storico ordini</summary>
              <div class="admin-lines">
                ${(customer.orders || [])
                  .map(
                    (order) => `
                      <div>
                        <span>Ordine #${order.id} - ${escapeHtml(order.order_status || 'new')}</span>
                        <strong>${formatMoney(order.total_cents || 0)}</strong>
                      </div>
                    `,
                  )
                  .join('') || '<p>Nessun ordine collegato.</p>'}
              </div>
            </details>

            <details>
              <summary>Customer account</summary>
              <div class="operations-tools" data-customer-tools="${customer.id}">
                <label>Status account
                  <select data-customer-account-status>
                    ${['guest', 'invited', 'active', 'disabled']
                      .map((status) => `<option value="${status}" ${customer.account_status === status ? 'selected' : ''}>${status}</option>`)
                      .join('')}
                  </select>
                </label>
                <label>Tags
                  <input data-customer-tags type="text" value="${escapeHtml(customer.tags || '')}" placeholder="vip, wholesale, newsletter" />
                </label>
                <label>Note cliente
                  <textarea data-customer-note placeholder="Note interne cliente">${escapeHtml(customer.note || '')}</textarea>
                </label>
                <div class="product-actions">
                  <button type="button" data-customer-action="save" data-customer-id="${customer.id}">Salva cliente</button>
                  <button type="button" data-customer-action="send_invite" data-customer-id="${customer.id}">Send invite</button>
                </div>
                <p class="field-help">Customer account ready / provider-ready. Login cliente completo non attivo in questa release.</p>
              </div>
            </details>
          </article>
        `,
      )
      .join('')

    customersList.querySelectorAll('[data-customer-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const wrapper = customersList.querySelector(`[data-customer-tools="${button.dataset.customerId}"]`)
        const action = button.dataset.customerAction
        const response = await fetch('/api/admin/customers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: Number(button.dataset.customerId),
            action: action === 'send_invite' ? 'send_invite' : 'update',
            account_status: wrapper?.querySelector('[data-customer-account-status]')?.value || 'guest',
            tags: wrapper?.querySelector('[data-customer-tags]')?.value.trim() || '',
            note: wrapper?.querySelector('[data-customer-note]')?.value.trim() || '',
          }),
        })
        const result = await response.json()
        if (!result.success) alert(result.message || adminUiText('Aggiornamento cliente non riuscito.'))
        await loadCustomers()
        await loadCustomerAccountsSummary()
        await loadNotifications()
      })
    })
  } catch {
    renderAdminListState(customersList, 'Errore di connessione ai clienti.', 'error')
  }
}

refreshCustomersButton?.addEventListener('click', loadCustomers)
customerAdminSearch?.addEventListener('input', loadCustomers)
loadCustomers()

// ===============================
// MENU
// ===============================

const menuItemForm = document.querySelector('#menuItemForm')
const menuSelect = document.querySelector('#menuSelect')
const menuItemLabel = document.querySelector('#menuItemLabel')
const menuLinkType = document.querySelector('#menuLinkType')
const menuTargetSlug = document.querySelector('#menuTargetSlug')
const menuItemUrl = document.querySelector('#menuItemUrl')
const menuMessage = document.querySelector('#menuMessage')
const menusList = document.querySelector('#menusList')
const refreshMenusButton = document.querySelector('#refreshMenusButton')

let menusCache = []
let pagesCache = []
let productsCache = []

async function loadMenuResources() {
  try {
    const [pagesResponse, collectionsResponse, productsResponse] = await Promise.all([
      fetch('/api/admin/pages'),
      fetch('/api/admin/collections'),
      fetch('/api/products'),
    ])

    const pagesData = await pagesResponse.json()
    const collectionsData = await collectionsResponse.json()
    const productsData = await productsResponse.json()

    pagesCache = pagesData.success ? pagesData.pages : []
    collectionsCache = collectionsData.success ? collectionsData.collections : []
    productsCache = productsData.success ? productsData.products : []

    renderMenuTargetOptions()
  } catch {
    menuMessage.textContent = adminUiText('Errore caricamento destinazioni menu.')
  }
}

function renderMenuSelect() {
  menuSelect.innerHTML = menusCache
    .map(
      (menu) => `
        <option value="${menu.id}">
          ${escapeHtml(menu.name)}
        </option>
      `,
    )
    .join('')
}

function renderMenuTargetOptions() {
  const type = menuLinkType.value

  if (type === 'url') {
    menuTargetSlug.innerHTML = '<option value="">Usa il campo URL esterno</option>'
    menuTargetSlug.disabled = true
    menuItemUrl.disabled = false
    return
  }

  menuTargetSlug.disabled = false
  menuItemUrl.disabled = true
  menuItemUrl.value = ''

  let items = []

  if (type === 'page') {
    items = pagesCache.map((page) => ({
      label: page.title,
      value: page.slug,
    }))
  }

  if (type === 'collection') {
    items = collectionsCache.map((collection) => ({
      label: collection.name,
      value: collection.slug,
    }))
  }

  if (type === 'product') {
    items = productsCache.map((product) => ({
      label: product.name,
      value: product.slug,
    }))
  }

  menuTargetSlug.innerHTML =
    '<option value="">Seleziona destinazione</option>' +
    items
      .map(
        (item) => `
          <option value="${escapeHtml(item.value)}">
            ${escapeHtml(item.label)}
          </option>
        `,
      )
      .join('')
}

async function loadMenus() {
  menusList.textContent = adminUiText('Caricamento menu...')

  try {
    const response = await fetch('/api/admin/menus')
    const data = await response.json()

    if (!data.success) {
      menusList.textContent = adminUiText('Errore nel caricamento menu.')
      return
    }

    menusCache = data.menus || []
    renderMenuSelect()

    if (menusCache.length === 0) {
      menusList.textContent = adminUiText('Nessun menu trovato.')
      return
    }

    menusList.innerHTML = menusCache
      .map(
        (menu) => `
          <article class="product-item">
            <h3>${escapeHtml(menu.name)}</h3>

            <div class="meta">
              <span>Handle: ${escapeHtml(menu.handle)}</span>
              <span>ID: ${menu.id}</span>
              <span>Voci: ${menu.items.length}</span>
            </div>

            <div class="menu-items-list">
              ${
                menu.items.length === 0
                  ? '<p>Nessuna voce in questo menu.</p>'
                  : menu.items
                      .map(
                        (item) => `
                          <div class="menu-item-row">
                            <div>
                              <strong>${escapeHtml(item.label)}</strong>
                              <small>
                                ${escapeHtml(item.link_type)}
                                ${
                                  item.link_type === 'url'
                                    ? escapeHtml(item.url || '')
                                    : escapeHtml(item.target_slug || '')
                                }
                              </small>
                            </div>

                            <button
                              type="button"
                              class="danger"
                              data-delete-menu-item="${item.id}"
                            >
                              Elimina
                            </button>
                          </div>
                        `,
                      )
                      .join('')
              }
            </div>
          </article>
        `,
      )
      .join('')

    document.querySelectorAll('[data-delete-menu-item]').forEach((button) => {
      button.addEventListener('click', async () => {
        const confirmed = confirm(adminUiText('Vuoi eliminare questa voce menu?'))
        if (!confirmed) return

        const response = await fetch('/api/admin/menus', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'item',
            id: Number(button.dataset.deleteMenuItem),
          }),
        })

        const result = await response.json()

        if (!result.success) {
          alert(result.message || adminUiText('Errore eliminazione voce menu.'))
          return
        }

        loadMenus()
      })
    })
  } catch {
    menusList.textContent = adminUiText('Errore di connessione alla API menu.')
  }
}

menuLinkType.addEventListener('change', renderMenuTargetOptions)

menuItemForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  menuMessage.textContent = adminUiText('Salvataggio voce menu...')

  const linkType = menuLinkType.value

  const payload = {
    type: 'item',
    menu_id: Number(menuSelect.value),
    label: menuItemLabel.value.trim(),
    link_type: linkType,
    target_slug: linkType === 'url' ? '' : menuTargetSlug.value,
    url: linkType === 'url' ? menuItemUrl.value.trim() : '',
  }

  try {
    const response = await fetch('/api/admin/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!data.success) {
      menuMessage.textContent = data.message || adminUiText('Errore salvataggio voce menu.')
      return
    }

    menuMessage.textContent = adminUiText('Voce menu salvata.')
    menuItemForm.reset()
    renderMenuTargetOptions()
    loadMenus()
  } catch {
    menuMessage.textContent = adminUiText('Errore di connessione.')
  }
})

refreshMenusButton.addEventListener('click', loadMenus)

loadMenuResources()
loadMenus()

// ===============================
// IMPOSTAZIONI TEMA EDITOR
// ===============================

const themeSettingsButton = document.querySelector('#themeSettingsButton')
const closeThemeSettingsButton = document.querySelector('#closeThemeSettingsButton')
const themeSettingsDrawer = document.querySelector('#themeSettingsDrawer')
const themeSettingsOverlay = document.querySelector('#themeSettingsOverlay')
const themeSettingsForm = document.querySelector('#themeSettingsForm')
const themeSettingsGroups = document.querySelector('#themeSettingsGroups')
const themeSettingsMessage = document.querySelector('#themeSettingsMessage')

const themeEditorSettingKeys = new Set([
  'site_name',
  'logo_text',
  'logo_url',
  'logo_width',

  'primary_color',
  'accent_color',
  'background_color',
  'text_color',
  'body_font_family',
  'heading_font_family',
  'font_scale',
  'button_radius',
  'container_width',
  'section_spacing',

  'header_cta_text',
  'header_cta_url',
  'header_style',

  'footer_text',
  'footer_cta_text',
  'footer_cta_url',
  'footer_layout',
])

const themeGroupLabels = {
  brand: 'Brand',
  theme: 'Tema',
  header: 'Header',
  footer: 'Footer',
}

const themeGroupDescriptions = {
  brand: 'Logo, nome sito e identita principale.',
  theme: 'Colori, tipografie, spaziature e stile generale.',
  header: 'Stile header e call to action principale.',
  footer: 'Testi e layout footer visibili sul sito.',
}

const settingOptions = {
  body_font_family: [
    ['Inter', 'Inter'],
    ['Arial', 'Arial'],
    ['Helvetica', 'Helvetica'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Verdana', 'Verdana'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['system-ui', 'System UI'],
  ],

  heading_font_family: [
    ['Inter', 'Inter'],
    ['Arial', 'Arial'],
    ['Helvetica', 'Helvetica'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Verdana', 'Verdana'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['system-ui', 'System UI'],
  ],

  font_scale: [
    ['compact', 'Compatta'],
    ['standard', 'Standard'],
    ['large', 'Grande'],
    ['editorial', 'Editoriale'],
  ],

  button_radius: [
    ['sharp', 'Spigoloso'],
    ['rounded', 'Arrotondato'],
    ['pill', 'Pillola'],
  ],

  container_width: [
    ['narrow', 'Stretta'],
    ['standard', 'Standard'],
    ['wide', 'Ampia'],
  ],

  section_spacing: [
    ['compact', 'Compatta'],
    ['standard', 'Standard'],
    ['large', 'Ampia'],
  ],

  header_style: [
    ['standard', 'Standard'],
    ['transparent', 'Trasparente'],
    ['centered', 'Centrato'],
  ],

  footer_layout: [
    ['simple', 'Semplice'],
    ['columns', 'Colonne'],
    ['editorial', 'Editoriale'],
  ],
}

function openThemeSettingsDrawer() {
  if (!canAdminViewSensitiveSettings()) {
    showAdminPermissionNotice('Permessi insufficienti per modificare impostazioni sensibili.')
    return
  }

  themeSettingsDrawer?.classList.add('open')

  if (themeSettingsOverlay) {
    themeSettingsOverlay.hidden = false
  }

  themeSettingsDrawer?.setAttribute('aria-hidden', 'false')
  loadThemeSettings()
}

function closeThemeSettingsDrawer() {
  themeSettingsDrawer?.classList.remove('open')

  if (themeSettingsOverlay) {
    themeSettingsOverlay.hidden = true
  }

  themeSettingsDrawer?.setAttribute('aria-hidden', 'true')
}

function renderThemeSettingInput(setting) {
  if (settingOptions[setting.key]) {
    return `
      <select data-theme-setting-key="${escapeHtml(setting.key)}">
        ${settingOptions[setting.key]
          .map(
            ([value, label]) => `
              <option value="${escapeHtml(value)}" ${
                setting.value === value ? 'selected' : ''
              }>
                ${escapeHtml(label)}
              </option>
            `,
          )
          .join('')}
      </select>
    `
  }

  const inputType =
    setting.type === 'color'
      ? 'color'
      : setting.type === 'url'
        ? 'url'
        : 'text'

  const isLongText = setting.key === 'footer_text'

  if (isLongText) {
    return `
      <textarea
        data-theme-setting-key="${escapeHtml(setting.key)}"
        rows="3"
      >${escapeHtml(setting.value || '')}</textarea>
    `
  }

  return `
    <input
      data-theme-setting-key="${escapeHtml(setting.key)}"
      type="${inputType}"
      value="${escapeHtml(setting.value || '')}"
      placeholder="${escapeHtml(setting.label || setting.key)}"
    />
  `
}

function renderThemeSettings(settings = []) {
  const filteredSettings = settings.filter((setting) =>
    themeEditorSettingKeys.has(setting.key),
  )

  const grouped = filteredSettings.reduce((groups, setting) => {
    const groupName = setting.group_name || 'theme'

    if (!groups[groupName]) {
      groups[groupName] = []
    }

    groups[groupName].push(setting)

    return groups
  }, {})

  const groupOrder = ['brand', 'theme', 'header', 'footer']

  themeSettingsGroups.innerHTML = groupOrder
    .filter((groupName) => grouped[groupName]?.length)
    .map((groupName) => {
      const settings = grouped[groupName]
      const title = themeGroupLabels[groupName] || groupName
      const description = themeGroupDescriptions[groupName] || ''

      return `
        <section class="theme-settings-group">
          <div class="theme-settings-group-head">
            <div>
              <h4>${escapeHtml(title)}</h4>
              <p>${escapeHtml(description)}</p>
            </div>

            <span>${escapeHtml(groupName)}</span>
          </div>

          <div class="theme-settings-fields">
            ${settings
              .map(
                (setting) => `
                  <label class="theme-setting-field">
                    <span>${escapeHtml(setting.label || setting.key)}</span>
                    ${renderThemeSettingInput(setting)}
                    <small>${escapeHtml(setting.key)}</small>
                  </label>
                `,
              )
              .join('')}
          </div>
        </section>
      `
    })
    .join('')
}

async function loadThemeSettings() {
  if (!themeSettingsGroups) return

  if (!canAdminViewSensitiveSettings()) {
    themeSettingsGroups.textContent = adminUiText('Permessi insufficienti per leggere impostazioni sensibili.')
    return
  }

  themeSettingsGroups.textContent = adminUiText('Caricamento impostazioni tema...')

  try {
    const response = await fetch('/api/admin/settings')
    const data = await response.json()

    if (!data.success) {
      themeSettingsGroups.textContent =
        data.message || adminUiText('Errore caricamento impostazioni tema.')
      return
    }

    renderThemeSettings(data.settings || [])
  } catch {
    themeSettingsGroups.textContent =
      'Errore di connessione alla API impostazioni.'
  }
}

async function saveThemeSettings(event) {
  event.preventDefault()

  if (!canAdminViewSensitiveSettings()) {
    themeSettingsMessage.textContent = adminUiText('Permessi insufficienti.')
    return
  }

  themeSettingsMessage.textContent = adminUiText('Salvataggio impostazioni tema...')

  const payload = {
    settings: {},
  }

  document.querySelectorAll('[data-theme-setting-key]').forEach((input) => {
    payload.settings[input.dataset.themeSettingKey] = input.value
  })

  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!data.success) {
      themeSettingsMessage.textContent =
        data.message || adminUiText('Errore salvataggio impostazioni tema.')
      return
    }

    themeSettingsMessage.textContent = adminUiText('Impostazioni tema salvate.')
    await loadThemeSettings()
  } catch {
    themeSettingsMessage.textContent = adminUiText('Errore di connessione.')
  }
}

themeSettingsButton?.addEventListener('click', openThemeSettingsDrawer)
closeThemeSettingsButton?.addEventListener('click', closeThemeSettingsDrawer)
themeSettingsOverlay?.addEventListener('click', closeThemeSettingsDrawer)

if (themeSettingsForm) {
  themeSettingsForm.addEventListener('submit', saveThemeSettings)
}

// ===============================
// EDITOR SEZIONI
// ===============================

const sitePreview = document.querySelector('#sitePreview')
const previewShell = document.querySelector('.editor-preview-shell')
const previewDeviceLabel = document.querySelector('#previewDeviceLabel')
const previewDeviceButtons = document.querySelectorAll('[data-preview-device]')
const editorPageSelect = document.querySelector('#editorPageSelect')
const sectionsList = document.querySelector('#sectionsList')
const sectionFields = document.querySelector('#sectionFields')
const selectedSectionTitle = document.querySelector('#selectedSectionTitle')
const saveSectionButton = document.querySelector('#saveSectionButton')
const addSectionButton = document.querySelector('#addSectionButton')
const newSectionType = document.querySelector('#newSectionType')
const sectionMessage = document.querySelector('#sectionMessage')

let pageSections = []
let selectedSectionId = null
let currentEditorPageSlug = 'home'

function setPreviewDevice(device = 'desktop') {
  const nextDevice = ['desktop', 'tablet', 'mobile'].includes(device) ? device : 'desktop'
  if (previewShell) previewShell.dataset.previewDevice = nextDevice

  previewDeviceButtons.forEach((button) => {
    const isActive = button.dataset.previewDevice === nextDevice
    button.classList.toggle('active', isActive)
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
  })

  if (previewDeviceLabel) {
    const labelKey = {
      desktop: 'previewDesktop',
      tablet: 'previewTablet',
      mobile: 'previewMobile',
    }[nextDevice]
    previewDeviceLabel.textContent = adminT(labelKey)
  }
}

function renderPaymentStatusSelect(order) {
  const statuses = ['pending', 'paid', 'failed', 'refunded']
  return `
    <select data-payment-status="${order.id}">
      ${statuses.map((status) => `<option value="${status}" ${order.payment_status === status ? 'selected' : ''}>${status}</option>`).join('')}
    </select>
  `
}

function orderActionPayload(order, action) {
  const prefix = `[data-order-tools="${order.id}"]`
  return {
    id: order.id,
    action,
    tracking_carrier: document.querySelector(`${prefix} [data-order-tracking-carrier]`)?.value.trim() || '',
    tracking_number: document.querySelector(`${prefix} [data-order-tracking-number]`)?.value.trim() || '',
    tracking_url: document.querySelector(`${prefix} [data-order-tracking-url]`)?.value.trim() || '',
    shipping_note: document.querySelector(`${prefix} [data-order-shipping-note]`)?.value.trim() || '',
    internal_note: document.querySelector(`${prefix} [data-order-internal-note]`)?.value.trim() || '',
    refund_note: document.querySelector(`${prefix} [data-order-refund-note]`)?.value.trim() || '',
    refund_amount: Number(document.querySelector(`${prefix} [data-order-refund-amount]`)?.value || 0),
  }
}

async function sendOrderAction(payload) {
  const response = await fetch('/api/admin/orders', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!result.success) alert(result.message || t('orders.operationError', 'Operazione ordine non riuscita.'))
  await loadOrders()
  await loadOperationsSummary()
  await loadNotifications()
}

async function loadOperationsSummary() {
  if (!operationsSummary) return
  try {
    const response = await fetch('/api/admin/operations')
    const data = await response.json()
    if (!response.ok || !data.success) return
    const summary = data.summary || {}
    operationsSummary.innerHTML = [
      ['Pending orders', summary.pending_orders || 0],
      ['Unfulfilled', summary.unfulfilled_orders || 0],
      ['Refund queue', summary.refund_queue || 0],
      ['Return queue', summary.return_queue || 0],
    ]
      .map(
        ([label, value]) => `
          <article class="metric-card">
            <span>${escapeHtml(label)}</span>
            <strong>${value}</strong>
          </article>
        `,
      )
      .join('')
  } catch {}
}

function renderOperationalChecks(container, checks = []) {
  if (!container) return
  container.innerHTML = checks.length
    ? checks
        .map(
          (check) => `
            <article class="admin-record">
              <div class="admin-record-head">
                <div>
                  <h3>${escapeHtml(check.label)}</h3>
                  <p>${escapeHtml(check.description || '')}</p>
                </div>
                <strong>${escapeHtml(check.status || 'Warning')}</strong>
              </div>
              <div class="meta">
                <span>${escapeHtml(check.action || '')}</span>
                ${check.href ? `<a href="${escapeHtml(check.href)}">Apri sezione</a>` : ''}
              </div>
            </article>
          `,
        )
        .join('')
    : '<p>Nessun controllo disponibile.</p>'
}

async function loadStoreHealth() {
  if (!storeHealthList && !storeHealthSummary) return
  if (storeHealthList) storeHealthList.textContent = adminUiText('Caricamento Store Health...')
  try {
    const response = await fetch('/api/admin/health')
    const data = await response.json()
    if (!response.ok || !data.success) {
      if (storeHealthList) storeHealthList.textContent = data.message || adminUiText('Store Health non disponibile.')
      return
    }
    const summary = data.summary || {}
    if (storeHealthSummary) {
      storeHealthSummary.innerHTML = [
        ['Products', summary.products || 0],
        ['Collections', summary.collections || 0],
        ['Orders', summary.orders || 0],
        ['Email provider', summary.email_provider || 'none'],
      ]
        .map(
          ([label, value]) => `
            <article class="metric-card">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </article>
          `,
        )
        .join('')
    }
    renderOperationalChecks(storeHealthList, data.checks || [])
  } catch {
    if (storeHealthList) storeHealthList.textContent = adminUiText('Store Health non disponibile.')
  }
}

async function loadLaunchChecklist() {
  if (!launchChecklistList) return
  launchChecklistList.textContent = adminUiText('Caricamento checklist...')
  try {
    const response = await fetch('/api/admin/launch-checklist')
    const data = await response.json()
    if (!response.ok || !data.success) {
      launchChecklistList.textContent = data.message || adminUiText('Launch checklist non disponibile.')
      return
    }
    renderOperationalChecks(launchChecklistList, data.items || [])
  } catch {
    launchChecklistList.textContent = adminUiText('Launch checklist non disponibile.')
  }
}

previewDeviceButtons.forEach((button) => {
  button.addEventListener('click', () => setPreviewDevice(button.dataset.previewDevice))
})

setPreviewDevice('desktop')

function getEditorPreviewUrl(pageSlug) {
  if (pageSlug === 'home') {
    return '/?preview=admin'
  }

  return `/${pageSlug}?preview=admin`
}

function updateEditorPreviewUrl() {
  const nextUrl = getEditorPreviewUrl(currentEditorPageSlug)

  if (sitePreview.getAttribute('src') !== nextUrl) {
    sitePreview.setAttribute('src', nextUrl)
  }
}

async function loadEditorPages() {
  try {
    const response = await fetch('/api/admin/pages')
    const data = await response.json()

    if (!data.success) return

    editorPageSelect.innerHTML = data.pages
      .map(
        (page) => `
          <option value="${escapeHtml(page.slug)}">
            ${escapeHtml(page.title)}
          </option>
        `,
      )
      .join('')

    editorPageSelect.value = currentEditorPageSlug
  } catch {
    sectionMessage.textContent = t('editor.pagesLoadError', 'Errore caricamento pagine editor.')
  }
}

const sectionLabels = {
  hero: 'Hero',
  banner: 'Banner',
  text_image: 'Testo + immagine',

  brand_manifesto: 'Brand Manifesto',
  timeline_premium: 'Timeline Premium',
  process_steps: 'Process Steps',
  stats_numbers: 'Stats / Numeri',
  gallery_editorial: 'Gallery Editoriale',
  testimonials: 'Testimonials',
  featured_collection: 'Featured Collection',

  collection_grid: 'Griglia collezioni',
  featured_product: 'Featured Product',
  product_spotlight: 'Product Spotlight',
  product_carousel: 'Product Carousel',
  product_3d_viewer: 'Product 3D Viewer',
  best_sellers: 'Best Sellers',
  new_arrivals: 'New Arrivals',

  trust_badges: 'Trust Badges',
  newsletter_signup: 'Newsletter Signup',
  promo_banner: 'Promo Banner',
  countdown_promo: 'Countdown Promo',

  logo_partners: 'Logo Partner / Clienti',
  press_mentions: 'Press / Media Mentions',
  awards_recognition: 'Awards / Riconoscimenti',
  team_section: 'Team Section',
  founder_section: 'Founder Section',
  services_grid: 'Services Grid',

  accordion_advanced: 'Accordion avanzato',
  tabs_section: 'Tabs Section',
  video_spotlight: 'Video Spotlight',
  full_width_image: 'Full-width Image',

  product_grid: 'Griglia prodotti',
  faq: 'FAQ',
  cta: 'CTA finale',
}

const fieldsByType = {
  hero: ['eyebrow', 'title', 'subtitle', 'button_text'],

  banner: ['title', 'text', 'button_text'],

  text_image: [
    'eyebrow',
    'title',
    'text',
    'image_url',
    'button_text',
    'button_url',
  ],

  brand_manifesto: [
    'eyebrow',
    'title',
    'text',
    'quote',
    'image_url',
    'button_text',
    'button_url',
  ],

  timeline_premium: [
    'eyebrow',
    'title',
    'subtitle',
    'step_1_year',
    'step_1_title',
    'step_1_text',
    'step_2_year',
    'step_2_title',
    'step_2_text',
    'step_3_year',
    'step_3_title',
    'step_3_text',
  ],

  process_steps: [
    'eyebrow',
    'title',
    'subtitle',
    'step_1_title',
    'step_1_text',
    'step_2_title',
    'step_2_text',
    'step_3_title',
    'step_3_text',
    'step_4_title',
    'step_4_text',
  ],

  stats_numbers: [
    'eyebrow',
    'title',
    'subtitle',
    'stat_1_value',
    'stat_1_label',
    'stat_2_value',
    'stat_2_label',
    'stat_3_value',
    'stat_3_label',
    'stat_4_value',
    'stat_4_label',
  ],

  gallery_editorial: [
    'eyebrow',
    'title',
    'subtitle',
    'image_1_url',
    'image_1_caption',
    'image_2_url',
    'image_2_caption',
    'image_3_url',
    'image_3_caption',
  ],

  testimonials: [
    'eyebrow',
    'title',
    'quote_1',
    'author_1',
    'role_1',
    'quote_2',
    'author_2',
    'role_2',
    'quote_3',
    'author_3',
    'role_3',
  ],

  featured_collection: [
    'eyebrow',
    'title',
    'subtitle',
    'collection_slug',
    'button_text',
    'button_url',
  ],

  collection_grid: [
    'eyebrow',
    'title',
    'subtitle',
  ],

  featured_product: [
    'eyebrow',
    'title',
    'subtitle',
    'product_slug',
    'button_text',
    'button_url',
  ],

  product_spotlight: [
    'eyebrow',
    'title',
    'text',
    'product_slug',
    'image_url',
    'button_text',
    'button_url',
  ],

  product_carousel: [
    'eyebrow',
    'title',
    'subtitle',
    'collection_slug',
  ],

  product_3d_viewer: [
    'eyebrow',
    'title',
    'text',
    'model_url',
    'poster_image_url',
    'button_text',
    'auto_rotate',
    'show_modal',
  ],

  best_sellers: [
    'eyebrow',
    'title',
    'subtitle',
  ],

  new_arrivals: [
    'eyebrow',
    'title',
    'subtitle',
  ],

  trust_badges: [
    'eyebrow',
    'title',
    'badge_1_title',
    'badge_1_text',
    'badge_2_title',
    'badge_2_text',
    'badge_3_title',
    'badge_3_text',
    'badge_4_title',
    'badge_4_text',
  ],

  newsletter_signup: [
    'eyebrow',
    'title',
    'subtitle',
    'placeholder',
    'button_text',
    'privacy_text',
  ],

  promo_banner: [
    'eyebrow',
    'title',
    'text',
    'button_text',
    'button_url',
  ],

  countdown_promo: [
    'eyebrow',
    'title',
    'text',
    'target_date',
    'button_text',
    'button_url',
  ],

  logo_partners: [
    'eyebrow',
    'title',
    'subtitle',
    'logo_1_text',
    'logo_2_text',
    'logo_3_text',
    'logo_4_text',
    'logo_5_text',
  ],

  press_mentions: [
    'eyebrow',
    'title',
    'quote_1',
    'source_1',
    'quote_2',
    'source_2',
    'quote_3',
    'source_3',
  ],

  awards_recognition: [
    'eyebrow',
    'title',
    'award_1_title',
    'award_1_text',
    'award_2_title',
    'award_2_text',
    'award_3_title',
    'award_3_text',
  ],

  team_section: [
    'eyebrow',
    'title',
    'subtitle',
    'member_1_name',
    'member_1_role',
    'member_1_image_url',
    'member_2_name',
    'member_2_role',
    'member_2_image_url',
    'member_3_name',
    'member_3_role',
    'member_3_image_url',
  ],

  founder_section: [
    'eyebrow',
    'title',
    'text',
    'founder_name',
    'founder_role',
    'quote',
    'image_url',
  ],

  services_grid: [
    'eyebrow',
    'title',
    'subtitle',
    'service_1_title',
    'service_1_text',
    'service_2_title',
    'service_2_text',
    'service_3_title',
    'service_3_text',
    'service_4_title',
    'service_4_text',
  ],

  accordion_advanced: [
    'eyebrow',
    'title',
    'item_1_title',
    'item_1_text',
    'item_2_title',
    'item_2_text',
    'item_3_title',
    'item_3_text',
    'item_4_title',
    'item_4_text',
  ],

  tabs_section: [
    'eyebrow',
    'title',
    'tab_1_label',
    'tab_1_title',
    'tab_1_text',
    'tab_2_label',
    'tab_2_title',
    'tab_2_text',
    'tab_3_label',
    'tab_3_title',
    'tab_3_text',
  ],

  video_spotlight: [
    'eyebrow',
    'title',
    'text',
    'video_url',
    'poster_url',
    'button_text',
    'button_url',
  ],

  full_width_image: [
    'eyebrow',
    'title',
    'subtitle',
    'image_url',
    'caption',
  ],

  product_grid: ['eyebrow', 'title', 'subtitle'],

  faq: ['title', 'question', 'answer'],

  cta: ['title', 'text', 'button_text'],
}

const fieldLabels = {
  eyebrow: 'Eyebrow',
  title: 'Titolo',
  subtitle: 'Sottotitolo',
  text: 'Testo',
  quote: 'Citazione',
  image_url: 'URL immagine',
  button_text: 'Testo bottone',
  button_url: 'Link bottone',
  collection_slug: 'Slug collezione',
  product_slug: 'Slug prodotto',

  placeholder: 'Placeholder campo email',
  privacy_text: 'Testo privacy',
  target_date: 'Data fine countdown',
  video_url: 'URL video',
  poster_url: 'URL immagine anteprima video',
  model_url: 'URL modello 3D (.glb/.gltf)',
  poster_image_url: 'URL immagine fallback/poster',
  auto_rotate: 'Rotazione automatica',
  show_modal: 'Mostra bottone modal 3D',
  caption: 'Caption',

  step_1_year: 'Step 1 - Anno',
  step_1_title: 'Step 1 - Titolo',
  step_1_text: 'Step 1 - Testo',
  step_2_year: 'Step 2 - Anno',
  step_2_title: 'Step 2 - Titolo',
  step_2_text: 'Step 2 - Testo',
  step_3_year: 'Step 3 - Anno',
  step_3_title: 'Step 3 - Titolo',
  step_3_text: 'Step 3 - Testo',
  step_4_title: 'Step 4 - Titolo',
  step_4_text: 'Step 4 - Testo',

  stat_1_value: 'Stat 1 - Valore',
  stat_1_label: 'Stat 1 - Etichetta',
  stat_2_value: 'Stat 2 - Valore',
  stat_2_label: 'Stat 2 - Etichetta',
  stat_3_value: 'Stat 3 - Valore',
  stat_3_label: 'Stat 3 - Etichetta',
  stat_4_value: 'Stat 4 - Valore',
  stat_4_label: 'Stat 4 - Etichetta',

  image_1_url: 'Immagine 1 - URL',
  image_1_caption: 'Immagine 1 - Caption',
  image_2_url: 'Immagine 2 - URL',
  image_2_caption: 'Immagine 2 - Caption',
  image_3_url: 'Immagine 3 - URL',
  image_3_caption: 'Immagine 3 - Caption',

  quote_1: 'Testimonianza / Citazione 1',
  author_1: 'Autore 1',
  role_1: 'Ruolo 1',
  quote_2: 'Testimonianza / Citazione 2',
  author_2: 'Autore 2',
  role_2: 'Ruolo 2',
  quote_3: 'Testimonianza / Citazione 3',
  author_3: 'Autore 3',
  role_3: 'Ruolo 3',

  badge_1_title: 'Badge 1 - Titolo',
  badge_1_text: 'Badge 1 - Testo',
  badge_2_title: 'Badge 2 - Titolo',
  badge_2_text: 'Badge 2 - Testo',
  badge_3_title: 'Badge 3 - Titolo',
  badge_3_text: 'Badge 3 - Testo',
  badge_4_title: 'Badge 4 - Titolo',
  badge_4_text: 'Badge 4 - Testo',

  logo_1_text: 'Logo 1 - Testo',
  logo_2_text: 'Logo 2 - Testo',
  logo_3_text: 'Logo 3 - Testo',
  logo_4_text: 'Logo 4 - Testo',
  logo_5_text: 'Logo 5 - Testo',

  source_1: 'Fonte 1',
  source_2: 'Fonte 2',
  source_3: 'Fonte 3',

  award_1_title: 'Award 1 - Titolo',
  award_1_text: 'Award 1 - Testo',
  award_2_title: 'Award 2 - Titolo',
  award_2_text: 'Award 2 - Testo',
  award_3_title: 'Award 3 - Titolo',
  award_3_text: 'Award 3 - Testo',

  member_1_name: 'Membro 1 - Nome',
  member_1_role: 'Membro 1 - Ruolo',
  member_1_image_url: 'Membro 1 - URL immagine',
  member_2_name: 'Membro 2 - Nome',
  member_2_role: 'Membro 2 - Ruolo',
  member_2_image_url: 'Membro 2 - URL immagine',
  member_3_name: 'Membro 3 - Nome',
  member_3_role: 'Membro 3 - Ruolo',
  member_3_image_url: 'Membro 3 - URL immagine',

  founder_name: 'Founder - Nome',
  founder_role: 'Founder - Ruolo',

  service_1_title: 'Servizio 1 - Titolo',
  service_1_text: 'Servizio 1 - Testo',
  service_2_title: 'Servizio 2 - Titolo',
  service_2_text: 'Servizio 2 - Testo',
  service_3_title: 'Servizio 3 - Titolo',
  service_3_text: 'Servizio 3 - Testo',
  service_4_title: 'Servizio 4 - Titolo',
  service_4_text: 'Servizio 4 - Testo',

  item_1_title: 'Item 1 - Titolo',
  item_1_text: 'Item 1 - Testo',
  item_2_title: 'Item 2 - Titolo',
  item_2_text: 'Item 2 - Testo',
  item_3_title: 'Item 3 - Titolo',
  item_3_text: 'Item 3 - Testo',
  item_4_title: 'Item 4 - Titolo',
  item_4_text: 'Item 4 - Testo',

  tab_1_label: 'Tab 1 - Etichetta',
  tab_1_title: 'Tab 1 - Titolo',
  tab_1_text: 'Tab 1 - Testo',
  tab_2_label: 'Tab 2 - Etichetta',
  tab_2_title: 'Tab 2 - Titolo',
  tab_2_text: 'Tab 2 - Testo',
  tab_3_label: 'Tab 3 - Etichetta',
  tab_3_title: 'Tab 3 - Titolo',
  tab_3_text: 'Tab 3 - Testo',

  question: 'Domanda',
  answer: 'Risposta',
}

const booleanSectionFields = new Set(['auto_rotate', 'show_modal'])

function selectedSection() {
  return pageSections.find((section) => section.id === selectedSectionId)
}

function renderSelectedSection() {
  const section = selectedSection()

  if (!section) {
    selectedSectionTitle.textContent = t('editor.selectSection', 'Seleziona una sezione')
    sectionFields.innerHTML = `<p>${escapeHtml(t('editor.selectSectionHelp', 'Seleziona una sezione dalla lista.'))}</p>`
    applyAdminLanguage()
    return
  }

  selectedSectionTitle.textContent = translateAdminConfigLabel(sectionLabels[section.type] || section.type)

  const fields = fieldsByType[section.type] || []

  sectionFields.innerHTML = fields
    .map((field) => {
      const value = section.data?.[field] || ''
      const isBoolean = booleanSectionFields.has(field)

      if (isBoolean) {
        const checked = value === true || value === 'true' || value === '1'

        return `
          <label class="section-checkbox-field">
            <input
              type="checkbox"
              data-section-field="${field}"
              ${checked ? 'checked' : ''}
            />
            ${escapeHtml(translateAdminConfigLabel(fieldLabels[field] || field))}
          </label>
        `
      }

      return `
        <label>
          ${escapeHtml(translateAdminConfigLabel(fieldLabels[field] || field))}
          <textarea data-section-field="${field}">${escapeHtml(value)}</textarea>
        </label>
      `
    })
    .join('')

  document.querySelectorAll('[data-section-field]').forEach((input) => {
    input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => {
      const field = input.dataset.sectionField

      section.data = {
        ...(section.data || {}),
        [field]: input.type === 'checkbox' ? input.checked : input.value,
      }

      updateSitePreview()
    })
  })

  enhanceMediaPickerFields(sectionFields)
  applyAdminLanguage()
}

async function loadSections() {
  const response = await fetch(
    `/api/admin/section?page_slug=${encodeURIComponent(currentEditorPageSlug)}`,
  )
  const data = await response.json()

  if (!data.success) {
    sectionMessage.textContent = t('editor.sectionsLoadError', 'Errore caricamento sezioni.')
    return
  }

  pageSections = data.sections

  if (!selectedSectionId && pageSections.length > 0) {
    selectedSectionId = pageSections[0].id
  }

  renderSectionsList()
  renderSelectedSection()
  updateSitePreview()
}

function renderSectionsList() {
  sectionsList.innerHTML = pageSections
    .map(
      (section, index) => `
        <div class="section-row ${section.id === selectedSectionId ? 'active' : ''}">
          <button
            type="button"
            class="section-button"
            data-section-id="${section.id}"
          >
            ${escapeHtml(translateAdminConfigLabel(sectionLabels[section.type] || section.type))}
          </button>

          <div class="section-tools">
            <button type="button" data-up="${index}">${escapeHtml(t('editor.up', 'Su'))}</button>
            <button type="button" data-down="${index}">${escapeHtml(t('editor.down', 'Giu'))}</button>
            <button type="button" class="danger" data-delete-section="${section.id}" aria-label="${escapeHtml(t('common.delete', 'Elimina'))}">x</button>
          </div>
        </div>
      `,
    )
    .join('')

  document.querySelectorAll('[data-section-id]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedSectionId = Number(button.dataset.sectionId)
      renderSectionsList()
      renderSelectedSection()
    })
  })

  document.querySelectorAll('[data-up]').forEach((button) => {
    button.addEventListener('click', async () => {
      const index = Number(button.dataset.up)
      if (index === 0) return

      const temp = pageSections[index]
      pageSections[index] = pageSections[index - 1]
      pageSections[index - 1] = temp

      await saveSectionOrder()
      renderSectionsList()
      updateSitePreview()
    })
  })

  document.querySelectorAll('[data-down]').forEach((button) => {
    button.addEventListener('click', async () => {
      const index = Number(button.dataset.down)
      if (index === pageSections.length - 1) return

      const temp = pageSections[index]
      pageSections[index] = pageSections[index + 1]
      pageSections[index + 1] = temp

      await saveSectionOrder()
      renderSectionsList()
      updateSitePreview()
    })
  })

  document.querySelectorAll('[data-delete-section]').forEach((button) => {
    button.addEventListener('click', async () => {
      const confirmed = confirm(t('editor.sectionDeleteConfirm', 'Vuoi eliminare questa sezione?'))
      if (!confirmed) return

      const id = Number(button.dataset.deleteSection)

      const response = await fetch('/api/admin/section', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (!data.success) {
        sectionMessage.textContent = data.message || t('editor.sectionDeleteError', 'Errore eliminazione sezione.')
        return
      }

      selectedSectionId = null
      await loadSections()
      sectionMessage.textContent = t('editor.sectionDeleted', 'Sezione eliminata.')
    })
  })
  applyAdminLanguage()
}

async function saveSectionOrder() {
  await Promise.all(
    pageSections.map((section, index) =>
      fetch('/api/admin/section', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: section.id,
          sort_order: index,
        }),
      }),
    ),
  )
}

function updateSitePreview() {
  sitePreview.contentWindow?.postMessage(
    {
      type: 'ORBITRA_SECTIONS_PREVIEW',
      sections: pageSections,
    },
    window.location.origin,
  )
}

async function saveSelectedSection() {
  const section = selectedSection()
  if (!section) return

  sectionMessage.textContent = t('editor.sectionSaving', 'Salvataggio...')

  const response = await fetch('/api/admin/section', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: section.id,
      data: section.data,
    }),
  })

  const data = await response.json()
  sectionMessage.textContent = data.success
    ? t('editor.sectionSaved', 'Sezione salvata.')
    : t('editor.sectionSaveError', 'Errore salvataggio.')
}

async function addSection() {
  sectionMessage.textContent = t('editor.sectionAdding', 'Aggiunta sezione...')

  const response = await fetch('/api/admin/section', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: newSectionType.value,
      page_slug: currentEditorPageSlug,
    }),
  })

  const data = await response.json()

  if (!data.success) {
    sectionMessage.textContent = data.message || t('editor.sectionAddError', 'Errore aggiunta sezione.')
    return
  }

  selectedSectionId = null
  await loadSections()
  sectionMessage.textContent = t('editor.sectionAdded', 'Sezione aggiunta.')
}

saveSectionButton.addEventListener('click', saveSelectedSection)
addSectionButton.addEventListener('click', addSection)
sitePreview.addEventListener('load', updateSitePreview)

editorPageSelect.addEventListener('change', async () => {
  currentEditorPageSlug = editorPageSelect.value || 'home'
  selectedSectionId = null
  updateEditorPreviewUrl()
  await loadSections()
})

loadEditorPages()
updateEditorPreviewUrl()
loadSections()
initAdminAuth()
