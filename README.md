# Regalo Radar

PWA personale per raccogliere, classificare e organizzare segnalazioni di
oggetti offerti in regalo. L'app non interagisce automaticamente con i siti
originali: l'utente apre l'annuncio e compie personalmente qualsiasi azione.

## Stato

Step 1 (architettura e ADR) e Step 2 (workspace Nx e shell Angular con
dashboard dimostrativa) sono completati. La dashboard usa esclusivamente dati
mock esplicitamente indicati: inserimento, persistenza, PWA/share target e
classificazione saranno realizzati nei passi successivi.

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

Il deploy GitHub Pages è configurato via GitHub Actions. La demo pubblica è
disponibile su [federicocroletti-tech.github.io/regalo-radar](https://federicocroletti-tech.github.io/regalo-radar/)
e usa la base path `/regalo-radar/`. Questa shell dimostrativa non salva ancora
dati e non è ancora installabile come PWA.

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
