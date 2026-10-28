# Regalo Radar

PWA personale per raccogliere, classificare e organizzare segnalazioni di
oggetti offerti in regalo. L'app non interagisce automaticamente con i siti
originali: l'utente apre l'annuncio e compie personalmente qualsiasi azione.

## Stato

Questo repository contiene gli artefatti di Step 1: architettura MVP, ADR sulle
fonti, struttura Nx proposta e backlog. Il workspace applicativo non è ancora
stato inizializzato. Implementazione e configurazione arrivano nei passi
successivi, nell'ordine concordato.

## Avvio locale

Non è ancora possibile avviare l'app: Step 1 non genera codice eseguibile.
Dopo Step 2, dalla radice di questo progetto:

```powershell
npm install
npx nx serve web
```

Il comando effettivo verrà verificato e aggiornato quando sarà creato il
workspace Nx. I dati dell'MVP saranno locali al browser tramite IndexedDB; la
disinstallazione o la cancellazione dei dati del browser può rimuoverli.

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
