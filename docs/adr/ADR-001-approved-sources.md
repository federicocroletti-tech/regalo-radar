# ADR-001: Fonti ammesse e vietate

- **Stato:** Accettato
- **Data:** 2026-10-28
- **Decisione:** acquisizione esplicita e autorizzata; nessun accesso
  automatizzato a piattaforme o pagine di annunci

## Contesto

Regalo Radar organizza segnalazioni di annunci, ma non deve automatizzare
l'accesso a Facebook o ad altri siti né agire per conto dell'utente. La
provenienza deve essere verificabile e l'utente deve mantenere il controllo
sulla consultazione dell'annuncio e sull'eventuale risposta.

## Fonti ammesse

1. URL inseriti manualmente dall'utente, con eventuali titolo, estratto e note
   forniti dall'utente.
2. URL, titolo e testo passati dall'utente tramite Web Share Target. L'app
   mostra un'anteprima e non esegue ulteriori acquisizioni dal sito sorgente.
3. E-mail ricevute legittimamente dall'utente e importate direttamente
   dall'utente, ad esempio da file selezionati localmente. Non accedere alla
   casella e-mail senza un'integrazione autorizzata e una scelta esplicita.
4. API e feed con autorizzazione esplicita e documentata, nei limiti dei
   termini e delle licenze applicabili.
5. File esportati direttamente dall'utente.

Per ogni segnalazione e duplicato conservare URL originale quando disponibile,
timestamp di ricezione e indicazione della fonte/metodo di importazione.
Distinguere il timestamp di ricezione da eventuale data di pubblicazione
riportata nel materiale fornito.

## Fonti e tecniche vietate

- Scraping o crawling di Facebook o di altre pagine di annunci.
- Endpoint privati, API non documentate, GraphQL interni o reverse engineering.
- Cookie di sessione, token estratti dal browser o credenziali dell'utente.
- Automazione browser con Playwright, Puppeteer o Selenium verso Facebook o
  siti esterni; simulazione di navigazione, click, scroll, commenti o altre
  interazioni.
- Evasione di controlli, anti-detection, proxy rotation, CAPTCHA bypass,
  fingerprint spoofing o account multipli.
- Pubblicazione automatica di commenti o invio automatico di messaggi.

Playwright può essere usato esclusivamente per test end-to-end della web app
Regalo Radar, senza navigare o interagire con piattaforme esterne.

## Conseguenze

- Il dato è ciò che l'utente ha esplicitamente inserito, condiviso o importato;
  non il contenuto remoto corrente dell'annuncio.
- Le importazioni e-mail e file sono opt-in, mostrate in anteprima e limitate
  ai campi necessari. L'app non mantiene il testo completo se un estratto basta.
- Un link non viene aperto automaticamente. Il pulsante “Apri originale”
  richiede un'azione esplicita; l'utente effettua personalmente il click finale
  sul sito originale.
- L'assistente può comporre e copiare una bozza, ma mostra che non è stata
  pubblicata e non dispone di una funzione di invio.
- In MVP, API/feed autorizzati sono ammessi dal disegno ma non attivati finché
  non è verificata la specifica autorizzazione.
- Non si può garantire aggiornamento, disponibilità o accuratezza di contenuti
  remoti non acquisiti dall'app.

## Verifica di conformità

Ogni nuovo connettore deve documentare titolare e autorizzazione della fonte,
campi raccolti, retention e modalità di revoca. Un connettore che richiede
tecniche vietate in questo ADR è respinto, non implementato come eccezione.
