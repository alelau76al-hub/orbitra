# AGENTS.md

Regole operative per lavorare su questo progetto.

## Regole Base

- Non riscrivere l'architettura del progetto senza richiesta esplicita.
- Non cancellare funzioni, endpoint, tabelle, file o flussi esistenti senza conferma.
- Lavorare per blocchi piccoli o medi, verificabili e facili da revisionare.
- Modificare solo i file autorizzati nella richiesta corrente.
- Prima di ogni modifica, elencare brevemente i file che verranno toccati.
- Dopo modifiche al codice, eseguire `npm run build`, salvo istruzioni contrarie.
- Non fare mai `git push`.
- Non fare commit salvo richiesta esplicita.
- Non modificare migrations senza autorizzazione esplicita.
- Non toccare sicurezza, database o routing senza spiegare prima cosa si intende fare.
- Mantenere sempre fallback robusti se API, dati o servizi esterni falliscono.
- Non rimuovere dati o output generati dall'utente senza conferma.
- Non introdurre nuove dipendenze senza spiegare perche servono.
- Preferire lo stile, le convenzioni e le funzioni gia presenti nel progetto.
- Evitare refactor non richiesti.

## Flusso Consigliato

1. Leggere la richiesta e identificare i file autorizzati.
2. Dichiarare i file che saranno modificati.
3. Fare modifiche mirate e piccole.
4. Verificare con `npm run build` quando cambia codice applicativo.
5. Riassumere cosa e cambiato e cosa e stato testato.

## Aree Sensibili

- `migrations/`: modificare solo con autorizzazione esplicita.
- `functions/api/admin/`: spiegare prima cambiamenti a logica admin o scrittura dati.
- Routing pubblico in `src/main.js`: non cambiare senza motivazione chiara.
- Database D1: non alterare schema, query distruttive o relazioni senza piano.
- Sicurezza, permessi, autenticazione, checkout e pagamenti: richiedono analisi prima della modifica.

## Build E Verifica

- Eseguire `npm run build` dopo modifiche a:
  - `src/main.js`
  - `src/style.css`
  - file in `functions/api/`
  - configurazioni che impattano runtime o bundle
- Se la build fallisce per sandbox o permessi, chiedere/eseguire con autorizzazione.
- Se la build non viene eseguita per istruzione esplicita, dichiararlo nel riepilogo finale.

## Git

- Non fare mai `git push`.
- Non fare commit senza richiesta esplicita.
- Non usare `git reset --hard` o checkout distruttivi.
- Non revertire modifiche non proprie senza conferma.

## Autonomia Consentita

Codex può eseguire senza chiedere:
- lettura file
- analisi progetto
- `git status`
- `npm run build`
- modifiche ai soli file autorizzati nella richiesta

Codex deve chiedere conferma prima di:
- modificare migrations
- modificare database/schema
- toccare sicurezza, checkout, pagamenti o auth
- cancellare file
- installare nuove dipendenze
- fare commit
- fare push
- usare comandi distruttivi