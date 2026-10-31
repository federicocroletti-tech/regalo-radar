# Regalo Radar

PWA personale per raccogliere, classificare e organizzare segnalazioni di
oggetti offerti in regalo. L'app non interagisce automaticamente con i siti
originali: l'utente apre l'annuncio e compie personalmente qualsiasi azione.

## Stato

L'app consente di aggiungere annunci manualmente o condividerli dal browser,
salvarli in IndexedDB, cercarli, filtrarli per stato, archiviare/eliminare
segnalazioni ed esportare i dati in JSON. La dashboard mostra soltanto dati
inseriti dall'utente, aggiornati immediatamente nella sessione e tra schede
aperte dello stesso browser.

Il manifest abilita installazione e condivisione verso l'app nei browser
compatibili; il service worker rende disponibile la shell offline dopo il
primo caricamento riuscito. I dati restano nel browser/dispositivo e non sono
sincronizzati tra dispositivi.

**L'app non esegue scraping e non aggiorna lo stato degli annunci sui siti
originali.** Titolo, testo e link condivisi sono una proposta da verificare e
salvare esplicitamente; disponibilità e dettagli vanno controllati aprendo
manualmente la fonte.

## Avvio locale

Richiede Node.js 22 e npm 10:

```powershell
npm ci
npm start
```

Comandi di verifica e build:

```powershell
npm test
npm run lint
npm run build
```

Il deploy GitHub Pages è configurato via GitHub Actions. La versione pubblica
usa la base path `/regalo-radar/`. L'installazione e la condivisione dipendono
dalle funzionalità offerte dal browser; l'app non fornisce notifiche push con
la PWA chiusa.

## Documentazione

- [Architettura MVP e diagramma](docs/architecture.md)
- [ADR-001 — fonti ammesse e vietate](docs/adr/ADR-001-approved-sources.md)
- [Backlog per milestone](docs/backlog.md)

## Principi

- Acquisire dati soltanto tramite azioni esplicite dell'utente o fonti
  autorizzate.
- Conservare origine e timestamp insieme a ogni segnalazione e ai suoi
  duplicati.
- Non effettuare scraping, navigazione automatizzata o interazioni con
  piattaforme esterne.
- Non pubblicare commenti: la bozza è solo un aiuto alla copia e l'utente
  decide se e cosa inviare sul sito originale.
- Raccogliere e conservare solo i dati necessari all'organizzazione personale.
