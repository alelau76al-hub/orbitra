# CMS Audit Report - Orbitra

Data audit: 2026-05-16

## Scope

Questo audit analizza lo stato attuale del CMS Orbitra dopo i 30 blocchi MVP Shopify-like e dopo la riorganizzazione del custom admin.

Non sono stati modificati codice applicativo, API, migrations, database, routing o build output. Il solo output previsto e questo report.

Fonti locali analizzate:

- `AGENTS.md`
- `CMS_MASTERPLAN.md`
- `src/main.js`
- `src/style.css`
- `public/custom-admin/index.html`
- `public/custom-admin/admin.js`
- `public/custom-admin/admin.css`
- `functions/api/**/index.js`
- `migrations/*.sql`
- `wrangler.toml`
- `package.json`

## Sintesi Esecutiva

Orbitra oggi e un CMS ecommerce MVP molto ampio: ha editor visuale, settings tema, menu, catalogo, varianti, carrello, checkout manuale/test, ordini, clienti, spedizioni base, IVA, sconti, SEO, media via URL, metafields, metaobjects, blog, markets, analytics, marketing, integrazioni, utenti admin come base dati, activity log, notifiche mock, policy, domini documentali, import/export, tenant default e performance settings.

La copertura funzionale e sorprendentemente larga per un MVP, ma la profondita e ancora disomogenea. Il CMS assomiglia a una bozza Shopify-like completa, non ancora a un prodotto vendibile. I gap principali sono sicurezza reale, login admin, autorizzazioni API, pagamenti reali, upload media reale, checkout professionale, test automatizzati, backup, osservabilita e hardening del database.

Metriche rilevate:

- API pubbliche: 18 file endpoint.
- API admin: 27 file endpoint.
- Migrations: 10 file.
- Viste admin con `data-admin-view`: 52.
- Placeholder admin: 20 card / 20 viste.
- Card admin non cliccabili residue: 0.
- Duplicazioni visive Domini nella dashboard Impostazioni: 1 solo link/card rilevato.

## 1. Admin Custom

### Dashboard principale

La dashboard principale e organizzata in 10 macro-aree:

- Editor sito
- Catalogo
- Ordini
- Clienti
- Contenuto
- Marketing
- Markets
- Analisi
- Check-out
- Impostazioni

La riorganizzazione recente ha reso le macro-aree piu Shopify-like. Le card principali sono cliccabili, hanno descrizioni coerenti e rimandano a viste hash gestite da `setupAdminViews()` in `public/custom-admin/admin.js`.

Punti forti:

- Navigazione leggibile.
- Separazione visiva tra hub e sotto-viste.
- `data-admin-view` mantiene il routing admin semplice.
- Nessuna card `<article>` non cliccabile rilevata.
- Domini non appare piu duplicato nella dashboard Impostazioni.

Punti deboli:

- Tutti i loader admin partono comunque al caricamento pagina, anche per viste nascoste. Questo genera molte chiamate API inutili e puo rallentare l'admin.
- Il pattern di navigazione e ancora basato su hash manuali e liste hardcoded in JS.
- Manca una sidebar persistente o breadcrumb completo.
- Manca ricerca globale admin.
- Manca feedback uniforme per salvataggi, errori, loading e stato vuoto.

### Navigazione macro-aree

La navigazione macro-area funziona tramite hash e classi attive. Le sotto-viste sono ricondotte alla macro-area corretta tramite array in `admin.js`.

Rischi:

- Le nuove sotto-viste richiedono aggiornamento manuale degli array.
- Un ID errato o non registrato ritorna a `#editor`.
- Non c'e una fonte dati unica per menu admin, quindi HTML e JS possono divergere.

### Catalogo

Presente:

- Prodotti.
- Collezioni.
- Varianti prodotto nel form prodotto.
- Import/export prodotti.
- Inventario come placeholder.

Stato:

- Prodotti e collezioni sono CRUD admin reali.
- Varianti sono base, associate al prodotto, con opzione, valore, SKU, prezzo e stock.
- Inventario dedicato e ancora placeholder: lo stock reale e nel form prodotto/variante.

Gap:

- Nessuna gestione inventario avanzata.
- Nessun movimento stock.
- Nessuna prenotazione stock a checkout.
- Nessuna gestione immagini prodotto multi-gallery.
- Nessun bulk editor.

### Contenuto

Presente:

- Pagine.
- Menu.
- Media manager via URL.
- Blog.
- Policy.
- Metaobjects.
- SEO centrale come placeholder.

Stato:

- Pagine, menu, media, blog, policy e metaobjects hanno UI e API admin.
- SEO e implementato nei form pagine/prodotti/collezioni, ma la vista centrale SEO e placeholder.

Gap:

- Nessun rich text editor vero.
- Nessuna gestione revisioni.
- Media manager non fa upload reale.
- SEO manca sitemap, robots, redirect, schema.org e audit centrale.

### Marketing

Presente:

- Campagne.
- Sconti/codici.
- Coupon come placeholder dedicato.
- Newsletter/automazioni come placeholder.

Stato:

- Campagne e sconti hanno UI/API reali.
- Coupon avanzati e automazioni sono ancora placeholder.

Gap:

- Nessuna segmentazione clienti.
- Nessun invio email reale.
- Nessun banner/promozione collegato al frontend.
- Nessun calendario marketing.

### Markets

Presente:

- Mercati reali con handle, paese, lingua, valuta, default e stato.
- Paesi, lingue, valute e prezzi localizzati come viste placeholder.

Stato:

- L'API pubblica `/api/markets` fornisce mercato default e fallback.
- Il frontend ha selector mercato e persistenza localStorage.

Gap:

- Nessun cambio prezzo reale per valuta.
- Nessuna traduzione contenuti.
- Nessuna disponibilita per paese.
- Nessun dominio per mercato.

### Analisi

Presente:

- Dashboard analytics MVP.
- Placeholder per traffico, vendite, prodotti, conversioni.

Stato:

- Traccia eventi base: `page_view`, `product_view`, `add_to_cart`, `checkout_start`, `order_created`.
- Dashboard admin aggrega conteggi e ultimi eventi.

Gap:

- Nessun consenso privacy/cookie.
- Nessuna dashboard funnel reale.
- Nessuna retention o aggregazione storica.
- Nessun filtro date.
- Nessuna pulizia dati analytics.

### Checkout

Presente:

- Tasse/IVA reale in admin.
- Checkout settings, pagamenti, spedizioni e conferma ordine come placeholder.

Stato:

- Checkout pubblico funziona con dati cliente, indirizzo, shipping, sconto, IVA, totale e ordine.
- Pagamenti sono manuali/test.

Gap:

- Admin checkout e ancora superficiale.
- Spedizioni admin non sono configurabili da UI dedicata.
- Pagamenti reali assenti.
- Conferma ordine non configurabile.

### Impostazioni

Presente:

- Generali placeholder.
- Utenti e permessi base dati.
- Domini reali documentali.
- Privacy placeholder.
- Cookie placeholder.
- Metafields reali.
- Notifiche mock reali.
- Import/export impostazioni placeholder.
- Multi-cliente/tenants reale come predisposizione.
- Performance reale come settings/checklist.
- Integrazioni reali non sensibili.
- Activity log reale.

Stato:

- Struttura ora e coerente.
- Domini non e duplicato.
- Alcune aree sono volutamente "In arrivo".

Gap:

- Generali dovrebbe diventare il centro store settings.
- Privacy/cookie devono essere collegati a consenso reale.
- Utenti non applicano permessi.
- Performance e checklist piu che ottimizzazione automatica.

### Ordini

Presente:

- Lista ordini.
- Stato ordine modificabile.
- Dati cliente, importi, sconto, IVA e righe ordine.

Gap:

- Nessun dettaglio ordine premium.
- Nessun rimborso.
- Nessuna evasione/fulfillment.
- Nessun invio notifiche reale.
- Nessuna stampa documento o export specifico ordine.

### Clienti

Presente:

- Lista clienti.
- Dati base e storico ordini.
- Creazione/aggiornamento da checkout per email.

Gap:

- Nessun account cliente.
- Nessun consenso marketing.
- Nessuna segmentazione.
- Nessuna gestione indirizzi multipli.

### Aree duplicate

Rilevato:

- Domini: risolto a livello dashboard Impostazioni, un solo link/card.
- Import/export: esistono due concetti separati. Catalogo contiene import/export operativo prodotti; Impostazioni contiene import/export impostazioni come placeholder. Non e una duplicazione tecnica, ma va chiarito nei testi.
- SEO: campi reali nei form e vista centrale placeholder. Va esplicitato come audit/centro SEO futuro.

### Card non cliccabili

Rilevato:

- 0 card `<article>` non cliccabili in `public/custom-admin/index.html`.

### Placeholder rimasti

Placeholder principali:

- Inventario
- SEO centrale
- Coupon avanzati
- Newsletter/Automazioni
- Paesi
- Lingue
- Valute
- Prezzi localizzati
- Traffico
- Vendite analytics
- Prodotti analytics
- Conversioni
- Checkout settings
- Pagamenti admin
- Spedizioni admin
- Conferma ordine admin
- Generali
- Privacy
- Cookie
- Import/export impostazioni

### UX incoerente

Incoerenze attuali:

- Alcune aree sono complete, altre sono placeholder, ma hanno peso visivo simile.
- I form lunghi non sono divisi in tab.
- Non c'e salvataggio con stato globale.
- Non c'e conferma uniforme prima di disattivazioni/cancellazioni.
- Non c'e paginazione in liste potenzialmente lunghe.
- Le aree admin caricano dati anche se non aperte.

### Testi corrotti

Rilevato:

- `public/custom-admin/index.html`: nessuna sequenza mojibake rilevata in lettura UTF-8.
- `src/main.js`: una sequenza `Â·` nella riga blog author.
- `public/custom-admin/admin.js`: una sequenza `Â·` nella riga analytics event detail.

Nota: non sono state corrette perche questo audit non modifica codice applicativo.

### Sezioni da riorganizzare

Priorita di riorganizzazione admin:

1. Checkout: separare davvero impostazioni, shipping e pagamenti.
2. Generali: creare store settings centrale.
3. SEO: trasformare placeholder in audit SEO.
4. Analytics: aggiungere filtri date e viste reali.
5. Inventory: vista dedicata stock/varianti.
6. Media: passare da URL a upload reale.

## 2. Frontend Pubblico

### Home

La home e una combinazione di markup demo statico e sezioni CMS dinamiche da D1.

Presente:

- Header, hero, sezioni demo, store collections/products, footer.
- Sezioni CMS caricate da `/api/sections`.
- SEO home da `/api/pages`.
- Theme settings via `/api/settings`.
- Menu via `/api/menus`.

Rischi:

- Il contenuto demo "Luxury Space Travel" e ancora molto presente.
- Alcune stringhe statiche in `src/main.js` contengono caratteri potenzialmente corrotti se viste fuori UTF-8.
- La home non e ancora un template ecommerce pulito: sembra piu una demo/landing.

### Pagine CMS

Presente:

- Routing client per slug CMS.
- Fallback pagina non trovata.
- SEO base da pagina.
- Sezioni CMS dinamiche.

Gap:

- Nessun SSR/SSG.
- Deep link diretto a path custom potrebbe richiedere configurazione fallback lato hosting.
- Nessun editor rich text per contenuto pagina.

### Collezioni

Presente:

- URL `/collections/:slug`.
- Lista prodotti filtrata per `collection_slug`.
- SEO collezione.
- Fallback collezione/prodotti mancanti.

Gap:

- Nessun ordinamento/filtro prodotto.
- Nessuna paginazione.
- Relazione prodotto-collezione e debole perche basata su slug testuale.

### Prodotti

Presente:

- URL `/products/:slug`.
- Nome, descrizione, prezzo, immagine, stock, categoria, collezione.
- Varianti base.
- Add to cart.
- SEO prodotto.

Gap:

- Layout ancora MVP.
- Niente gallery immagini.
- Niente media/video/3D.
- Niente reviews, raccomandati, cross-sell.
- Stock non prenotato o scalato.

### Blog

Presente:

- `/blog`.
- `/blog/:slug`.
- Articoli published.
- SEO base.
- Fallback articolo non trovato.

Gap:

- Nessuna categoria/tag.
- Nessun rich text editor vero.
- Nessun indice archivio avanzato.
- Una sequenza `Â·` e presente nel template autore.

### Policy

Presente:

- `/policies/:slug`.
- Lista policy pubblicate per footer.
- Fallback policy non trovata.

Gap:

- Nessun versioning legale.
- Nessuna gestione consenso cookie.
- Nessun collegamento obbligatorio checkout/policy.

### Checkout

Presente:

- Checkout pubblico `/checkout`.
- Dati cliente, email, telefono opzionale.
- Indirizzo spedizione.
- Shipping methods con fallback.
- Sconti.
- IVA.
- Totale.
- Creazione ordine.
- Conferma ordine.

Gap:

- Nessun pagamento reale.
- Nessuna idempotenza.
- Nessuna transazione DB multi-step.
- Nessuna riduzione stock.
- Nessun salvataggio carrello server-side.
- Nessun controllo antifrode.

### Carrello

Presente:

- localStorage `orbitra_cart_v1`.
- Quantita.
- Rimozione.
- Totale.
- Drawer/panel.
- Persistenza browser.

Gap:

- Carrello solo client-side.
- Nessuna sessione server.
- Nessuna validazione prezzi fino al checkout.
- Nessuna gestione coupon nel mini-cart.

### Header/Footer

Presente:

- Logo dinamico.
- Menu principale dinamico.
- CTA header dinamica.
- Footer text, CTA, social links e menu/footer policies.
- Fallback statici.

Gap:

- Nessun builder header/footer.
- Nessun layout alternativo.
- Social links solo da settings.

### Markets selector

Presente:

- Selector da `/api/markets`.
- Persistenza localStorage.
- Default market.

Gap:

- Non cambia valuta prezzo.
- Non cambia lingua contenuto.
- Non cambia disponibilita prodotto.

### SEO dinamico

Presente:

- `document.title`.
- meta description.
- og:title, og:description, og:image.
- canonical con dominio primario se presente.

Gap:

- Niente sitemap.
- Niente robots.
- Niente structured data.
- Niente SSR, quindi SEO dipende da crawler JS.
- Canonical dipende da dominio documentale, non da redirect reale.

### Fallback errori

Buono:

- Molte fetch pubbliche hanno fallback o catch.
- Shipping, tax, markets, policies, analytics sono resilienti.

Fragile:

- Alcuni endpoint pubblici restituiscono 500 con `error.message`.
- Il frontend non ha una UI globale di errore.
- Analytics fallisce silenziosamente, scelta accettabile ma poco osservabile.

## 3. API

### API pubbliche

Endpoint pubblici rilevati:

- `/api/settings`
- `/api/menus`
- `/api/pages`
- `/api/sections`
- `/api/collections`
- `/api/products`
- `/api/blog`
- `/api/policies`
- `/api/markets`
- `/api/shipping`
- `/api/tax`
- `/api/discounts`
- `/api/checkout`
- `/api/analytics`
- `/api/domains`
- `/api/metaobjects`
- `/api/integrations`
- `/api/test`

Stato:

- Copertura ampia.
- Fallback frequenti.
- Dati pubblici separati abbastanza bene dagli admin endpoint.

Gap:

- `/api/test` andrebbe rimosso o protetto prima della vendita.
- Alcuni endpoint pubblici espongono `error.message`.
- Nessuna policy cache coerente a livello headers.
- Nessuna rate limit.
- Analytics e checkout sono endpoint scrivibili pubblici senza protezioni avanzate.

### API admin

Endpoint admin rilevati:

- activity
- analytics
- blog
- collections
- customers
- discounts
- domains
- hero
- import-export
- integrations
- marketing
- markets
- media
- menus
- metafields
- metaobjects
- notifications
- orders
- pages
- performance
- policies
- products
- section
- settings
- tax
- tenants
- users

Stato:

- CRUD base molto esteso.
- Molte aree usano soft delete/disattivazione.
- Alcune aree registrano activity log.

Gap critico:

- Nessuna autenticazione.
- Nessuna autorizzazione per ruolo.
- Nessun CSRF/session.
- Nessun audit author reale.
- Nessuna protezione admin API da accesso pubblico.

### Coerenza nomi endpoint

Buono:

- La maggior parte segue `/api/admin/<resource>`.
- Le API pubbliche sono leggibili.

Incoerenze:

- `/api/admin/section` e singolare mentre `/api/sections` e plurale.
- `hero` admin e una scorciatoia su sezioni, non una risorsa autonoma.
- `discounts` esiste sia pubblico che admin con ruoli molto diversi.
- `integrations` pubblica puo confondere: e read-only e non dovrebbe esporre config sensibile.

### Fallback

Buono:

- Shipping, tax, markets, policies, analytics, metaobjects, settings e frontend hanno fallback ragionevoli.

Da migliorare:

- Un fallback non deve nascondere errori admin importanti.
- Serve distinzione tra errore previsto, migration mancante, auth mancante e problema server.

### Validazioni

Presente:

- Validazioni base su prodotti, varianti, checkout, sconti, media, users, markets, domains.

Manca:

- Validazione schema centralizzata.
- Normalizzazione coerente URL/email/slug.
- Limiti dimensione payload.
- Sanitizzazione HTML/content.
- Protezione upload, quando arrivera.

### Aree fragili

- Checkout crea cliente, ordine e righe ordine in piu query senza transazione/idempotenza.
- Import prodotti puo scrivere molte righe senza job asincrono vero.
- Admin API sono completamente aperte.
- Activity log non e completo e non contiene autore.
- Tenant e solo predisposizione: non isola dati.
- SEO e metafields sono entita polimorfiche debolmente relazionate.

### Endpoint mancanti

Per vendibilita servono:

- Auth login/logout/session.
- Password reset / invite admin.
- Stripe checkout session.
- Stripe webhook verificato.
- Upload media reale.
- Backup/export job status.
- Healthcheck admin protetto.
- Fulfillment/shipping admin.
- Refunds.
- Store settings generali.
- Sitemap/robots.

## 4. Database / Migrations

### Tabelle principali

Base CMS/ecommerce:

- `pages`
- `sections`
- `collections`
- `products`
- `inventory`
- `orders`
- `order_items`
- `menus`
- `menu_items`
- `site_settings`
- `product_variants`

MVP estesi:

- `customers`
- `shipping_methods`
- `tax_settings`
- `discount_codes`
- `media_items`
- `seo_metadata`
- `metafield_definitions`
- `metafield_values`
- `metaobject_definitions`
- `metaobject_entries`
- `blog_posts`
- `markets`
- `analytics_events`
- `marketing_campaigns`
- `integrations`
- `admin_users`
- `activity_log`
- `notification_templates`
- `notification_logs`
- `policies`
- `domains`
- `tenants`
- `performance_settings`
- `import_export_jobs`

### Possibili problemi di coerenza

- `products.collection_slug` non e FK verso `collections.slug`.
- `sections.page_slug` non e FK verso `pages.slug`.
- `seo_metadata` e `metafield_values` usano `entity_type/entity_id`, quindi le relazioni non sono enforceable da D1.
- `orders` e stato esteso progressivamente, con colonne vecchie e nuove (`status`, `payment_status`, `order_status`) che possono divergere.
- `tenants` non e collegato ai record principali.
- `activity_log` non ha `admin_user_id`.

### Campi mancanti

Mancano per un ecommerce vendibile:

- currency su ordini e prezzi.
- billing address.
- customer marketing consent.
- line item tax breakdown.
- fulfillment/shipment tracking.
- payment provider IDs.
- idempotency key checkout.
- refund fields.
- product gallery/media relation.
- inventory reservation/movements.
- tenant_id su tabelle principali.
- user password/session/auth fields.

### Relazioni deboli

Relazioni deboli o non enforceable:

- Product -> Collection.
- Section -> Page.
- SEO/metafields -> product/collection/page.
- Order -> Payment.
- Order -> Fulfillment.
- Tenant -> tutte le entita.

### Rischi futuri

- Migrare a multi-tenant reale sara costoso se non si introduce `tenant_id` presto.
- Senza transazioni/idempotenza checkout, duplicati ordine sono possibili.
- Senza stock movements non c'e audit inventario.
- Senza test migration su DB pulito/remoto, ALTER successivi possono creare sorprese.
- Alcune migrations usano `ALTER TABLE ADD COLUMN` senza `IF NOT EXISTS`: normale se eseguite una volta, fragile in ambienti parzialmente migrati.

## 5. Sicurezza

### Cosa manca per renderlo vendibile

Critico:

- Login admin reale.
- Sessioni sicure.
- Protezione di tutte le API admin.
- Enforcement ruoli owner/admin/editor/viewer.
- CSRF o token anti-forgery per mutazioni admin.
- Rate limit su checkout, analytics e admin.
- Validazione payload centralizzata.
- Gestione secrets sicura.
- Audit log con autore.
- Webhook firmati per pagamenti.

### Login admin

Oggi non esiste login obbligatorio. La tabella `admin_users` e una base dati, non una protezione. Il custom admin e raggiungibile staticamente e le API admin sono invocabili.

### Protezione API

Assente. Tutti gli endpoint admin possono essere chiamati senza sessione.

### Ruoli reali

I ruoli sono salvati (`owner`, `admin`, `editor`, `viewer`) ma non sono usati per autorizzare azioni.

### Sessioni

Assenti. Non ci sono cookie sessione, JWT, OAuth, password hash o magic link.

### Validazione input

Presente a livello base, ma non sufficiente:

- Nessuna libreria schema.
- Nessun limite dimensione body.
- Nessuna sanitizzazione contenuti HTML/markdown.
- JSON custom in metaobjects/integrations puo essere accettato con controlli minimi.

### Dati sensibili

Buono:

- Non risultano API key o secrets nel repository.
- Integrazioni dichiarano config non sensibili.

Rischio:

- Mancando auth, anche dati non sensibili possono essere alterati da chiunque raggiunga gli endpoint.

### Webhook

Assenti per pagamenti reali. `webhook_url` integrazioni e solo documentale/configurativo.

### Pagamenti

Pagamenti reali assenti. `manual`, `test_paid`, `test_failed` sono utili per MVP ma non vendibili.

## 6. Shopify Gap

### Cosa e gia presente

- Theme settings base.
- Header/footer dinamici.
- Pagine CMS e sezioni visuali.
- Catalogo prodotti e collezioni.
- Varianti base.
- Carrello localStorage.
- Checkout MVP.
- Ordini e clienti.
- Spedizione standard/free-over fallback.
- IVA base.
- Sconti/codici.
- SEO base.
- Media manager URL.
- Metafields.
- Metaobjects.
- Blog.
- Markets base.
- Analytics eventi base.
- Marketing campaigns.
- Integrazioni non sensibili.
- Utenti admin come anagrafica.
- Activity log MVP.
- Notifiche mock.
- Policy.
- Domini documentali.
- Import/export.
- Tenant default.
- Performance checklist/settings.

### Cosa e MVP ma da rafforzare

- Admin UX.
- Product pages.
- Checkout.
- Orders.
- Customers.
- Discounts.
- SEO.
- Analytics.
- Markets.
- Media.
- Import/export.
- Metafields/metaobjects.
- Notifiche.
- Performance.

### Cosa manca davvero

- Auth admin.
- Permissions reali.
- Pagamenti reali.
- Webhook pagamenti verificati.
- Upload media reale.
- Inventory professionale.
- Fulfillment.
- Refunds.
- Customer accounts.
- Email reali.
- Taxes reali per paesi/zone.
- Shipping rates reali.
- Multi-currency reale.
- Traduzioni/localizzazione.
- App/integration framework sicuro.
- Backup/restore.
- Test suite.
- Monitoring/logging produzione.

### Cosa va rifinito prima di venderlo

1. Bloccare le API admin dietro auth.
2. Rendere checkout idempotente e sicuro.
3. Integrare pagamenti reali in test mode.
4. Aggiungere upload media reale.
5. Aggiungere test automatici minimi.
6. Ripulire testi demo/corrotti.
7. Migliorare product page e admin UX.
8. Preparare backup e restore.
9. Separare tenant/store o dichiarare chiaramente single-store.
10. Documentare deploy e runbook operativo.

## 7. Roadmap Successiva

### BLOCCO A: Bugfix urgenti

- Priorita: Alta.
- File probabili da toccare: `src/main.js`, `public/custom-admin/admin.js`, `public/custom-admin/index.html`, endpoint specifici in `functions/api`.
- Rischio: Basso/medio, ma attenzione a non rompere routing e admin.
- Criterio di completamento: zero testi corrotti, zero endpoint test inutili, errori UI coerenti, nessun loader admin inutile all'avvio.
- Test da fare: `npm run build`, `node --check public/custom-admin/admin.js`, test smoke home/prodotto/checkout/admin, ricerca mojibake su UTF-8.

Interventi suggeriti:

- Correggere `Â·` in `src/main.js` e `public/custom-admin/admin.js`.
- Valutare rimozione/protezione `/api/test`.
- Caricare dati admin on-demand quando si apre una vista.
- Standardizzare messaggi errore.

### BLOCCO B: Admin UX refinement

- Priorita: Alta.
- File probabili da toccare: `public/custom-admin/index.html`, `public/custom-admin/admin.js`, `public/custom-admin/admin.css`.
- Rischio: Medio per regressioni UI.
- Criterio di completamento: macro-aree con sidebar/breadcrumb, placeholder distinti da aree live, liste con empty/loading/error state, form lunghi divisi in tab.
- Test da fare: navigazione di tutte le 52 viste, form prodotti/collezioni/pagine, salvataggi, mobile admin.

Interventi suggeriti:

- Sidebar persistente stile Shopify.
- Breadcrumb per sotto-viste.
- Loading skeleton uniformi.
- Conferme per delete/disable.
- Paginazione o filtri liste.

### BLOCCO C: Sicurezza reale

- Priorita: Critica.
- File probabili da toccare: nuove API auth, middleware functions, tutte le `functions/api/admin/*`, `public/custom-admin/*`, nuove migrations auth/session.
- Rischio: Alto.
- Criterio di completamento: admin accessibile solo con login, sessioni sicure, ruoli applicati, API admin protette, activity log con admin user.
- Test da fare: login/logout, session expiry, richieste anonime bloccate, ruoli editor/viewer, CSRF/token, rate limit base.

Interventi suggeriti:

- Password hash o magic link.
- Cookie `HttpOnly`, `Secure`, `SameSite`.
- Middleware `requireAdmin`.
- RBAC per resource/action.
- Audit log con `admin_user_id`.

### BLOCCO D: Pagamenti reali

- Priorita: Alta dopo sicurezza.
- File probabili da toccare: `functions/api/checkout/index.js`, nuova `functions/api/payments/*`, nuova `functions/api/webhooks/stripe/index.js`, admin checkout/payment UI, migrations payment fields.
- Rischio: Alto.
- Criterio di completamento: Stripe test mode crea sessione/payment intent, webhook firmato aggiorna ordine, fallimenti gestiti, nessun secret in repo.
- Test da fare: payment success, failed, abandoned, webhook duplicate, webhook invalid signature, ordine idempotente.

Interventi suggeriti:

- `payment_intents` o campi provider su orders.
- Idempotency key.
- Webhook signature verification.
- Stato ordine derivato dal pagamento.

### BLOCCO E: Media upload reale

- Priorita: Alta.
- File probabili da toccare: `public/custom-admin/*`, `functions/api/admin/media/*`, nuove API upload, configurazione R2/Cloudflare Images, migrations opzionali.
- Rischio: Medio/alto.
- Criterio di completamento: upload immagini, validazione tipo/dimensione, URL salvato in media library, alt text, preview, eliminazione sicura.
- Test da fare: upload immagine valida, file troppo grande, tipo non consentito, delete/disable, uso media in prodotto/sezione.

Interventi suggeriti:

- R2 bucket o Cloudflare Images.
- URL signed/admin upload.
- Nessun file binario in D1.
- Dimensioni e MIME allowlist.

### BLOCCO F: Checkout professionale

- Priorita: Alta.
- File probabili da toccare: `src/main.js`, `src/style.css`, `functions/api/checkout/index.js`, shipping/tax APIs, orders APIs, migrations.
- Rischio: Alto.
- Criterio di completamento: checkout idempotente, validazione robusta, billing/shipping separati, stock reservation, error handling chiaro, policy links, email mock/provider.
- Test da fare: carrello vuoto, stock insufficiente, coupon valido/non valido, shipping unavailable, refresh, doppio submit, ordine duplicato evitato.

Interventi suggeriti:

- Server-side cart validation completa.
- Idempotency.
- Address model.
- Stock reservation/decrement policy.
- Policy acceptance.

### BLOCCO G: Product page premium

- Priorita: Media/alta.
- File probabili da toccare: `src/main.js`, `src/style.css`, API products/media/metafields/metaobjects, admin products/media.
- Rischio: Medio.
- Criterio di completamento: product page con gallery, variant UX, unavailable states, related products, trust blocks, rich specs/metafields, SEO/schema product.
- Test da fare: prodotto con/senza immagini, varianti out of stock, prezzi variante, mobile, SEO tags, add to cart.

Interventi suggeriti:

- Gallery media.
- Swatches/opzioni migliori.
- Related products.
- Product JSON-LD.
- Sezioni prodotto componibili.

### BLOCCO H: Performance / backup / testing

- Priorita: Alta prima vendita.
- File probabili da toccare: test config, package scripts, functions API, admin performance, deployment docs, backup scripts.
- Rischio: Medio.
- Criterio di completamento: test automatici minimi, backup/export affidabile, API cache headers, performance smoke, monitoring errori.
- Test da fare: unit su calcoli checkout/tasse/sconti, API smoke, Playwright flow home-product-cart-checkout-admin, backup/restore dry-run.

Interventi suggeriti:

- Aggiungere framework test leggero.
- Smoke E2E.
- Backup D1 documentato.
- Cache headers read-only.
- Logging errori non sensibili.

### BLOCCO I: Funzioni Next Generation, inclusa sezione prodotto 3D

- Priorita: Media, dopo sicurezza/pagamenti/media.
- File probabili da toccare: `src/main.js`, `src/style.css`, editor sezioni admin, `functions/api/admin/section/index.js`, product/media APIs, eventuali asset 3D.
- Rischio: Medio/alto per performance e UX.
- Criterio di completamento: sezione prodotto 3D configurabile da CMS, fallback immagine, lazy load, mobile safe, nessun blocco checkout.
- Test da fare: render desktop/mobile, canvas non blank, fallback senza WebGL, performance, add to cart accanto al 3D.

Interventi suggeriti:

- Sezione CMS `product_3d_viewer`.
- Supporto model URL da media manager.
- Lazy load Three.js solo nella pagina/section necessaria.
- Fallback immagine statica.
- Controlli admin per camera, lighting, hotspots.

## Conclusione

Orbitra ha raggiunto una copertura MVP molto ampia e coerente con una roadmap Shopify-like. Il punto non e piu "aggiungere aree", ma trasformare la base in prodotto: sicurezza, pagamenti, media, checkout, admin UX, test e operativita.

La prossima fase dovrebbe ridurre superficie fragile invece di aggiungere nuove feature. La priorita assoluta e rendere l'admin non pubblico e le API admin non mutabili da utenti anonimi. Subito dopo: checkout idempotente, pagamenti reali in test mode, upload media e test automatici.
