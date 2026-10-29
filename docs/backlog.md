# Backlog

Il backlog rispetta la sequenza a passi richiesta. Le milestone successive a
Step 1 sono pianificate, non implementate.

## Step 1 — Fondazioni e decisioni

- [x] Definire MVP client-side e motivazione della scelta.
- [x] Definire confini frontend e struttura Nx proposta.
- [x] Documentare flusso di acquisizione e diagramma Mermaid.
- [x] Accettare ADR-001 su fonti ammesse/vietate, click umano e non-automazione.
- [x] Documentare limiti, stato e avvio locale futuro nel README.
- [x] Suddividere il lavoro in milestone.

## Step 2 — Workspace e shell

- [x] Inizializzare Nx e app Angular standalone con TypeScript strict.
- [x] Configurare ESLint, Prettier, test runner e build; integrare controlli CI
      essenziali.
- [x] Configurare routing, layout responsive, tema chiaro/scuro e token CSS.
- [x] Realizzare shell accessibile da tastiera e struttura navigabile.
- [x] Creare dashboard con dati mock esplicitamente etichettati come demo.
- [x] Verificare localmente lint, test, build e formattazione; aggiornare i
      comandi README.

## Step 3 — Persistenza e flusso base

- [ ] Definire tipi dominio e schema Dexie, con versione/migrazione locale.
- [ ] Implementare repository interface e adapter IndexedDB.
- [ ] Implementare inserimento manuale e inbox con ordinamento, ricerca e filtri.
- [ ] Implementare stati annuncio e dashboard derivata dai dati persistiti.
- [ ] Aggiungere deduplicazione iniziale per URL normalizzato e hash, mantenendo
      provenienza e timestamp di ogni segnalazione.
- [ ] Implementare modifica, eliminazione, esportazione JSON e cancellazione
      completa dei dati.
- [ ] Aggiungere test di unità e test d'integrazione del repository.

## Step 4 — Classificazione e acquisizione condivisa

- [ ] Configurare manifest PWA e Web Share Target; gestire URL, titolo e testo
      condivisi con anteprima e conferma.
- [ ] Implementare classifier locale con parole positive/negative, categorie,
      pesi modificabili e spiegazione del punteggio.
- [ ] Aggiungere soglia priorità configurabile e test dei casi limite.
- [ ] Raffinare deduplicazione con similarità titolo/testo e finestra
      temporale configurabile.
- [ ] Implementare notifiche client opt-in, livelli, cooldown, quiet hours e
      raggruppamento dei duplicati; non promettere Web Push a PWA chiusa.
- [ ] Aggiungere template modificabili, suggerimento per categoria e copia
      appunti con indicazione visibile “non pubblicato”.
- [ ] Valutare accessibilità WCAG 2.2 AA, performance e comportamento offline.

## Step 5 — Integrazioni opzionali, solo se necessarie

- [ ] Valutare requisiti che giustificano backend (sync multi-dispositivo,
      account, push server-side).
- [ ] Se approvato, progettare NestJS, PostgreSQL/Prisma e opzione Supabase,
      protezioni server-side e gestione segreti.
- [ ] Aggiungere autenticazione solo con necessità d'uso dimostrata.
- [ ] Mantenere invariata l'interfaccia repository e pianificare migrazione
      locale remota con backup, consenso e verifica d'integrità.
- [ ] Abilitare connettori API/feed solo dopo verifica documentata
      dell'autorizzazione; mantenere audit importazioni e retention.
- [ ] Configurare Docker per sviluppo/produzione, GitHub Actions e deploy in
      funzione dell'hosting selezionato.
- [ ] Eseguire revisione privacy e sicurezza prima della pubblicazione.

## Criteri trasversali di completamento

- Nessuna acquisizione non esplicita o automazione verso siti esterni.
- Nessun commento o messaggio inviato dall'app; apertura del link e azione
  finale restano dell'utente.
- Provenienza e timestamp sono conservati anche quando record vengono
  raggruppati come duplicati.
- Nessun testo completo persistito senza necessità; i dati locali sono
  cancellabili e, quando applicabile, esportabili.
- Ogni milestone esegue solo i controlli realmente configurati e ne riporta
  l'esito senza dichiarazioni non verificate.
