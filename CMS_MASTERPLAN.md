# CMS Masterplan

Roadmap operativa per trasformare il CMS custom Orbitra in un CMS ecommerce Shopify-like completo.

## Principi

- Evolvere l'architettura esistente senza riscriverla.
- Separare API pubbliche, API admin e frontend pubblico.
- Introdurre ogni area in blocchi verificabili.
- Mantenere fallback robusti sul sito pubblico.
- Non modificare migrations, sicurezza, database o routing senza piano esplicito.

## 1. Theme Settings Live

- Obiettivo: rendere live sul sito pubblico logo, colori, font, layout base e stile bottoni salvati nel CMS.
- File probabili da toccare: `functions/api/settings/index.js`, `src/main.js`, `src/style.css`, eventualmente `public/custom-admin/admin.js`.
- Cosa non toccare: migrations senza autorizzazione, routing pubblico non collegato al tema, API admin non necessarie.
- Criterio di completamento: cambiando una impostazione tema nel CMS, il sito pubblico la applica senza rompere i fallback.
- Test da eseguire: `npm run build`, test manuale con API funzionante e API non disponibile.

## 2. Header/Footer Globali

- Obiettivo: gestire header e footer globali da CMS, inclusi logo, CTA, menu principale, footer menu e testi.
- File probabili da toccare: `src/main.js`, `src/style.css`, `functions/api/menus/index.js`, `functions/api/settings/index.js`, `public/custom-admin/admin.js`.
- Cosa non toccare: sistema sezioni pagina, tabelle menu senza piano, routing delle pagine.
- Criterio di completamento: header e footer leggono impostazioni/menu dal CMS e restano stabili senza dati.
- Test da eseguire: `npm run build`, verifica home, pagina CMS, collezione, mobile.

## 3. Product Pages

- Obiettivo: creare pagine prodotto pubbliche con URL `/products/:slug`, dati prodotto, immagini, prezzo, stock e CTA.
- File probabili da toccare: `src/main.js`, `src/style.css`, `functions/api/products/index.js`, eventuale `functions/api/product/index.js`.
- Cosa non toccare: checkout, pagamenti, varianti avanzate, schema database senza autorizzazione.
- Criterio di completamento: ogni prodotto attivo ha pagina pubblica navigabile e fallback prodotto non trovato.
- Test da eseguire: `npm run build`, test prodotto esistente, prodotto inesistente, prodotto senza immagine.

## 4. Varianti Prodotto

- Obiettivo: supportare varianti come taglia, colore, materiale, prezzo e stock per variante.
- File probabili da toccare: migrations autorizzate, `functions/api/admin/products/index.js`, `functions/api/products/index.js`, `public/custom-admin/admin.js`, `src/main.js`.
- Cosa non toccare: checkout e ordini finche le varianti non sono stabili.
- Criterio di completamento: admin crea/modifica varianti e frontend seleziona variante con prezzo/stock corretti.
- Test da eseguire: `npm run build`, CRUD varianti, prodotto con e senza varianti.

## 5. Carrello

- Obiettivo: aggiungere carrello persistente lato client o sessione, con quantita, totale e rimozione righe.
- File probabili da toccare: `src/main.js`, `src/style.css`, eventuale `functions/api/cart/index.js`.
- Cosa non toccare: pagamenti reali, ordini definitivi, stock decrement.
- Criterio di completamento: utente aggiunge prodotti, modifica quantita e mantiene il carrello durante la navigazione.
- Test da eseguire: `npm run build`, add/remove/update, refresh pagina, prodotto esaurito.

## 6. Checkout

- Obiettivo: creare flusso checkout con dati cliente, indirizzo, riepilogo ordine e validazioni.
- File probabili da toccare: `src/main.js`, `src/style.css`, `functions/api/checkout/index.js`.
- Cosa non toccare: gateway pagamenti reali prima del piano sicurezza.
- Criterio di completamento: checkout raccoglie dati validi e prepara payload ordine/pagamento.
- Test da eseguire: `npm run build`, validazioni campi, carrello vuoto, errori API.

## 7. Pagamenti

- Obiettivo: integrare provider pagamenti, ad esempio Stripe, per sessioni sicure e callback.
- File probabili da toccare: `functions/api/checkout/index.js`, `functions/api/webhooks/stripe/index.js`, env config, admin impostazioni.
- Cosa non toccare: secrets in repo, logica ordini senza idempotenza, database senza piano.
- Criterio di completamento: pagamento test crea sessione, ritorna al sito e aggiorna stato ordine.
- Test da eseguire: `npm run build`, test mode Stripe, webhook firmato, pagamento fallito.

## 8. Ordini

- Obiettivo: gestire ordini admin con stati, righe ordine, totale, cliente e storico.
- File probabili da toccare: `functions/api/admin/orders/index.js`, `public/custom-admin/index.html`, `public/custom-admin/admin.js`, migrations autorizzate.
- Cosa non toccare: pagamenti reali se non necessari, cancellazioni distruttive.
- Criterio di completamento: admin vede lista ordini, dettaglio e cambio stato.
- Test da eseguire: `npm run build`, lista vuota, ordine pagato, cambio stato.

## 9. Clienti

- Obiettivo: creare anagrafica clienti con email, indirizzi, storico ordini e consenso marketing.
- File probabili da toccare: `functions/api/admin/customers/index.js`, `public/custom-admin/index.html`, `public/custom-admin/admin.js`, migrations autorizzate.
- Cosa non toccare: autenticazione cliente pubblica senza piano sicurezza.
- Criterio di completamento: clienti creati da checkout e consultabili in admin.
- Test da eseguire: `npm run build`, cliente nuovo, cliente esistente, ricerca cliente.

## 10. Spedizioni

- Obiettivo: configurare metodi di spedizione, costi, zone e regole per peso/prezzo.
- File probabili da toccare: `functions/api/shipping/index.js`, admin settings, checkout, migrations autorizzate.
- Cosa non toccare: integrazioni corrieri reali prima del modello base.
- Criterio di completamento: checkout calcola opzioni spedizione in base a indirizzo/carrello.
- Test da eseguire: `npm run build`, zone diverse, carrello sotto/sopra soglia, nessuna spedizione disponibile.

## 11. Tasse / IVA

- Obiettivo: calcolare IVA e tasse in base a paese, tipo prodotto e configurazione store.
- File probabili da toccare: `functions/api/tax/index.js`, checkout, settings admin, migrations autorizzate.
- Cosa non toccare: report fiscali avanzati senza requisiti.
- Criterio di completamento: riepilogo checkout mostra imponibile, IVA e totale corretto.
- Test da eseguire: `npm run build`, Italia, UE, extra UE, prodotto non tassabile.

## 12. Sconti

- Obiettivo: supportare codici sconto, promozioni automatiche e regole base.
- File probabili da toccare: `functions/api/discounts/index.js`, checkout, admin marketing, migrations autorizzate.
- Cosa non toccare: gift card o promozioni complesse prima del motore base.
- Criterio di completamento: codice valido modifica il totale e codice non valido mostra errore chiaro.
- Test da eseguire: `npm run build`, percentuale, importo fisso, scadenza, minimo carrello.

## 13. SEO

- Obiettivo: gestire title, description, social image, canonical e dati strutturati per pagine, prodotti e collezioni.
- File probabili da toccare: `src/main.js`, admin pagine/prodotti/collezioni, API pubbliche, migrations autorizzate.
- Cosa non toccare: routing radicale o SSR senza analisi.
- Criterio di completamento: ogni pagina pubblica imposta metadati coerenti e fallback.
- Test da eseguire: `npm run build`, home, pagina CMS, prodotto, collezione.

## 14. Media Manager

- Obiettivo: gestire immagini e file caricati, libreria media, selezione media in editor e prodotti.
- File probabili da toccare: `public/custom-admin/index.html`, `public/custom-admin/admin.js`, `functions/api/admin/media/index.js`, storage config.
- Cosa non toccare: file system locale in produzione, upload non validati.
- Criterio di completamento: admin carica/seleziona media e li usa in sezioni/prodotti.
- Test da eseguire: `npm run build`, upload valido, file troppo grande, eliminazione non distruttiva.

## 15. Metafields

- Obiettivo: aggiungere campi custom tipizzati a prodotti, collezioni, pagine, clienti e ordini.
- File probabili da toccare: migrations autorizzate, `functions/api/admin/metafields/index.js`, admin editor, API pubbliche.
- Cosa non toccare: rendering automatico sul frontend senza mappatura.
- Criterio di completamento: admin definisce e valorizza metafields, API li restituisce in modo prevedibile.
- Test da eseguire: `npm run build`, tipi testo/numero/boolean/url, entita diverse.

## 16. Metaobjects

- Obiettivo: creare oggetti contenuto riutilizzabili, come materiali, designer, store locator o FAQ globali.
- File probabili da toccare: migrations autorizzate, `functions/api/admin/metaobjects/index.js`, admin UI, render sezioni.
- Cosa non toccare: sezioni esistenti senza compatibilita.
- Criterio di completamento: admin crea tipi metaobject e record riutilizzabili nel frontend.
- Test da eseguire: `npm run build`, tipo nuovo, record nuovo, riferimento da sezione.

## 17. Blog

- Obiettivo: aggiungere blog, articoli, categorie, autore, SEO e pagina elenco.
- File probabili da toccare: `src/main.js`, `src/style.css`, `functions/api/blog/index.js`, admin blog, migrations autorizzate.
- Cosa non toccare: pagine CMS esistenti senza fallback.
- Criterio di completamento: blog index e articolo singolo sono pubblici e gestibili da admin.
- Test da eseguire: `npm run build`, articolo pubblicato, bozza, slug inesistente.

## 18. Markets / Lingue / Valute

- Obiettivo: gestire mercati, lingua, valuta, prezzi localizzati e disponibilita per paese.
- File probabili da toccare: settings admin, API pubbliche, checkout, migrations autorizzate.
- Cosa non toccare: traduzioni automatiche o valuta reale senza requisiti.
- Criterio di completamento: mercato selezionato cambia valuta/contenuti disponibili con fallback.
- Test da eseguire: `npm run build`, mercato default, mercato non supportato, valuta diversa.

## 19. Analytics

- Obiettivo: tracciare visite, eventi ecommerce, funnel checkout e performance vendite.
- File probabili da toccare: `src/main.js`, `functions/api/analytics/index.js`, admin analytics, provider esterni.
- Cosa non toccare: dati personali senza consenso/privacy.
- Criterio di completamento: eventi principali sono raccolti e visibili in dashboard.
- Test da eseguire: `npm run build`, page view, add to cart, checkout start, ordine completato.

## 20. Marketing

- Obiettivo: gestire campagne, banner, newsletter, segmenti, coupon e automazioni base.
- File probabili da toccare: admin marketing, `functions/api/admin/marketing/index.js`, sezioni CMS, sconti.
- Cosa non toccare: invio email massivo senza provider e consensi.
- Criterio di completamento: admin crea campagne base e le pubblica sul sito.
- Test da eseguire: `npm run build`, campagna attiva, scaduta, segmento vuoto.

## 21. App / Integrazioni

- Obiettivo: predisporre integrazioni con servizi esterni, webhook e app private.
- File probabili da toccare: `functions/api/integrations/*`, settings admin, env config.
- Cosa non toccare: secrets nel repository, permessi admin senza sicurezza.
- Criterio di completamento: integrazione configurabile, testabile e disattivabile.
- Test da eseguire: `npm run build`, integrazione disattiva, credenziali mancanti, webhook ricevuto.

## 22. Utenti / Permessi

- Obiettivo: introdurre utenti admin, ruoli e permessi granulari.
- File probabili da toccare: auth middleware, admin UI, API admin, migrations autorizzate.
- Cosa non toccare: API pubbliche senza separazione, password/secrets in chiaro.
- Criterio di completamento: ruoli limitano accesso a sezioni e azioni admin.
- Test da eseguire: `npm run build`, admin completo, editor contenuti, utente non autorizzato.

## 23. Sicurezza

- Obiettivo: proteggere API admin, input, upload, webhook, CORS e dati sensibili.
- File probabili da toccare: middleware functions, API admin, upload/media, checkout/webhook.
- Cosa non toccare: schema dati senza piano, UX admin non correlata.
- Criterio di completamento: endpoint sensibili richiedono autorizzazione e validano input.
- Test da eseguire: `npm run build`, richieste anonime, payload invalidi, webhook con firma errata.

## 24. Activity Log

- Obiettivo: registrare azioni admin importanti, autore, data, entita e diff essenziale.
- File probabili da toccare: API admin, migrations autorizzate, admin activity view.
- Cosa non toccare: dati sensibili completi o password/token nei log.
- Criterio di completamento: modifiche a prodotti, pagine, settings e ordini sono tracciate.
- Test da eseguire: `npm run build`, creazione, modifica, cancellazione soft, filtro log.

## 25. Notifiche

- Obiettivo: inviare notifiche admin/cliente per ordini, pagamento, spedizione e form.
- File probabili da toccare: `functions/api/notifications/*`, checkout, orders, settings admin.
- Cosa non toccare: provider email reale senza configurazione sicura.
- Criterio di completamento: eventi principali generano notifiche configurabili.
- Test da eseguire: `npm run build`, email ordine test, provider non configurato, retry/failure.

## 26. Policy

- Obiettivo: gestire privacy policy, termini, resi, spedizioni e cookie policy dal CMS.
- File probabili da toccare: admin contenuti, API pagine/settings, `src/main.js`, `src/style.css`.
- Cosa non toccare: checkout legale senza testi approvati.
- Criterio di completamento: policy pubbliche sono modificabili e linkate da footer/checkout.
- Test da eseguire: `npm run build`, policy pubblicata, policy mancante, link footer.

## 27. Domini

- Obiettivo: supportare dominio custom, redirect, canonical e configurazioni ambiente.
- File probabili da toccare: configurazioni Cloudflare, settings admin, SEO/canonical.
- Cosa non toccare: DNS o produzione senza conferma esplicita.
- Criterio di completamento: dominio configurato mostra sito corretto con canonical e redirect coerenti.
- Test da eseguire: verifica ambiente preview/live, redirect, canonical, asset pubblici.

## 28. Import / Export

- Obiettivo: importare ed esportare prodotti, collezioni, clienti e ordini in CSV/JSON.
- File probabili da toccare: `functions/api/admin/import-export/*`, admin UI, validatori dati.
- Cosa non toccare: database in scrittura massiva senza dry-run e backup.
- Criterio di completamento: export scaricabile e import con preview errori prima della conferma.
- Test da eseguire: `npm run build`, CSV valido, CSV invalido, import parziale bloccato.

## 29. Multi-cliente

- Obiettivo: rendere il CMS utilizzabile per piu store/clienti con isolamento dati e tema.
- File probabili da toccare: schema autorizzato, middleware tenant, API pubbliche/admin, settings.
- Cosa non toccare: singolo store live senza strategia migrazione.
- Criterio di completamento: tenant diversi vedono dati, tema e catalogo separati.
- Test da eseguire: `npm run build`, tenant A/B, tenant mancante, isolamento API.

## 30. Performance Produzione

- Obiettivo: ottimizzare bundle, query D1, cache, immagini, error handling e stabilita produzione.
- File probabili da toccare: `src/main.js`, `src/style.css`, functions API, config Cloudflare, media pipeline.
- Cosa non toccare: design generale o feature scope senza misurazioni.
- Criterio di completamento: pagine principali caricano rapidamente, API sono cache-aware e fallback solidi.
- Test da eseguire: `npm run build`, Lighthouse/manual performance, pagine catalogo, errori API simulati.
