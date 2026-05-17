# Testing Checklist - TakeOffMilan CMS

Checklist manuale finale prima dei test reali completi.

## Admin

- [ ] Login owner/admin funzionante.
- [ ] Logout funzionante.
- [ ] Sessione scaduta rimanda al login.
- [ ] Audit mode mostra badge `AUDIT MODE - READ ONLY`.
- [ ] Audit mode blocca salvataggi, import, upload, delete e mutazioni.
- [ ] RBAC: owner puo gestire tutto.
- [ ] RBAC: viewer puo leggere ma non mutare dati.
- [ ] Dashboard principale carica senza errori.
- [ ] App Hub visibile e navigabile.
- [ ] TakeOff Google Suite mostra campi GA4, Ads, Search Console, GTM e nota consenso.
- [ ] TakeOff Media Library mostra griglia, filtri, upload/fallback URL e copia URL.
- [ ] Media picker apre la libreria e compila campi immagine/URL in prodotti, collezioni, pagine, blog e sezioni.
- [ ] TakeOff Import Export mostra Export, Import, Templates, Translation package, Site package e History.
- [ ] Translation Manager visibile e salvabile con ruolo autorizzato.
- [ ] Markets visibile con mercati, paesi, lingue, valute e prezzi localizzati.
- [ ] Localized Pricing mostra prezzi configurati e fallback.
- [ ] Prodotti: lista, ricerca, creazione, modifica, varianti e media picker.
- [ ] Collezioni: lista, ricerca, creazione, modifica e media picker.
- [ ] Sezioni editor: creazione, modifica, preview e media picker nei campi immagine/modello/video.
- [ ] Ordini: lista e cambio stato consentito solo a ruoli autorizzati.
- [ ] Clienti: lista e dettaglio storico.
- [ ] Checkout settings leggibili.
- [ ] Impostazioni generali, domini, utenti, notifiche, performance e import/export impostazioni leggibili.

## Frontend

- [ ] Home carica header, footer, menu, settings tema e sezioni CMS.
- [ ] Pagina prodotto esistente carica immagine, varianti, prezzo, stock, metafields, related e add to cart.
- [ ] Pagina prodotto inesistente mostra fallback.
- [ ] Pagina collezione esistente carica prodotti e SEO.
- [ ] Pagina collezione inesistente mostra fallback.
- [ ] Carrello aggiunge, aggiorna quantita, rimuove e persiste dopo refresh.
- [ ] Checkout con carrello vuoto mostra messaggio chiaro.
- [ ] Checkout con dati mancanti mostra validazioni.
- [ ] Checkout manual/test crea ordine e svuota carrello solo a successo.
- [ ] Thank you page mostra numero ordine, totale, stato pagamento e metodo.
- [ ] Blog index e articolo caricano; articolo inesistente mostra fallback.
- [ ] Policy pubblica esistente carica; policy inesistente mostra fallback.
- [ ] Language selector cambia testi statici e mantiene fallback contenuti.
- [ ] Market selector cambia mercato/valuta senza rompere routing.
- [ ] Prezzi localizzati appaiono quando presenti; fallback al prezzo base quando assenti.
- [ ] Traduzioni contenuto appaiono quando presenti; fallback all'originale quando assenti.
- [ ] Google tags si attivano solo dopo consenso e solo se configurati.

## API

- [ ] API pubbliche principali rispondono 200: `/api/products`, `/api/collections`, `/api/pages`, `/api/settings`, `/api/markets`.
- [ ] API admin senza sessione rispondono 401.
- [ ] Viewer non puo eseguire POST, PUT, PATCH o DELETE su API admin.
- [ ] Audit mode blocca POST, PUT, PATCH e DELETE con 403.
- [ ] `/api/admin/auth/me` ritorna utente reale in sessione normale.
- [ ] `/api/admin/auth/me` ritorna Audit Viewer quando `ADMIN_AUDIT_MODE=true`.
- [ ] Import/export dry-run non scrive dati.
- [ ] Translation package import salva solo traduzioni, non contenuti originali.

## Configurazioni Esterne

- [ ] `STRIPE_SECRET_KEY` configurata solo in env, non nel repository.
- [ ] `STRIPE_WEBHOOK_SECRET` configurata solo in env, se webhook attivo.
- [ ] R2 / `MEDIA_BUCKET` configurato se si testa upload reale.
- [ ] Google Suite: GA4 Measurement ID configurato se necessario.
- [ ] Google Suite: Google Ads Conversion ID e label configurati se necessario.
- [ ] Google Suite: Search Console verification salvata e visibile nel markup.
- [ ] Google Suite: GTM Container ID configurato se necessario.
- [ ] Dominio primario documentale configurato nel CMS.
- [ ] Search Console verifica dominio/URL dopo deploy.

## Build E Smoke

- [ ] `npm run build`.
- [ ] `node --check public/custom-admin/admin.js`.
- [ ] `node --check src/main.js`.
- [ ] `git diff --check`.
- [ ] Test smoke admin desktop.
- [ ] Test smoke admin viewport stretto.
- [ ] Test smoke frontend desktop.
- [ ] Test smoke frontend mobile.
