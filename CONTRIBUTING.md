# Contribuire a Scryfall MCP Server

Grazie per il tuo interesse nel contribuire a questo progetto! 🎉

## Come Contribuire

### Segnalazione di Bug

Se trovi un bug, per favore apri un issue con:
- Descrizione chiara del problema
- Passi per riprodurre il bug
- Comportamento atteso vs comportamento effettivo
- Versione di Node.js e sistema operativo
- Log di errore (se disponibile)

### Suggerimenti per Nuove Funzionalità

Hai un'idea per migliorare il server? Apri un issue con:
- Descrizione dettagliata della funzionalità
- Casi d'uso pratici
- Mockup o esempi (se applicabile)

### Pull Requests

1. **Fork il repository**
2. **Crea un branch per la tua feature**: `git checkout -b feature/nome-feature`
3. **Implementa le modifiche**
4. **Testa le modifiche**: Usa l'MCP Inspector per verificare che tutto funzioni
5. **Commit con messaggi descrittivi**: `git commit -m "Add: descrizione della feature"`
6. **Push al tuo fork**: `git push origin feature/nome-feature`
7. **Apri una Pull Request**

## Linee Guida per il Codice

### Style Guide

- Usa indentazione a 2 spazi
- Usa nomi di variabili descrittivi in inglese o italiano
- Commenta il codice complesso
- Mantieni le funzioni piccole e focalizzate

### Struttura del Codice

```javascript
// Helper functions
function helperFunction() {
  // ...
}

// Main server setup
const server = new Server(/* ... */);

// Request handlers
server.setRequestHandler(/* ... */);
```

### Testing

Prima di inviare una PR:
1. Testa con l'MCP Inspector
2. Verifica che tutte le tools esistenti funzionino
3. Testa la nuova funzionalità con diversi input
4. Verifica la gestione degli errori

## Idee per Contributi

### Funzionalità Potenziali

- [ ] Caching delle risposte API per migliorare le performance
- [ ] Supporto per collezioni di carte personalizzate
- [ ] Statistiche aggregate sulle ricerche
- [ ] Esportazione in formati aggiuntivi (Markdown, HTML)
- [ ] Confronto prezzi tra versioni diverse
- [ ] Integrazione con altre API MTG (EDHREC, TCGPlayer)
- [ ] Filtri avanzati per carta di giorno/notte, saga, ecc.
- [ ] Supporto per ricerche salvate/preferiti

### Miglioramenti Documentazione

- [ ] Video tutorial
- [ ] Più esempi per casi d'uso specifici
- [ ] Traduzione in altre lingue
- [ ] FAQ dettagliata
- [ ] Guide per integrazioni specifiche

### Ottimizzazioni

- [ ] Migliorare la gestione degli errori
- [ ] Ottimizzare il parsing dei campi nested
- [ ] Migliorare la formattazione dell'output
- [ ] Aggiungere validazione degli input

## Processo di Review

1. Un maintainer revisionerà la tua PR
2. Potrebbero essere richieste modifiche
3. Una volta approvata, la PR verrà merged
4. Il tuo contributo verrà riconosciuto nel changelog

## Codice di Condotta

- Sii rispettoso e costruttivo
- Accetta critiche costruttive
- Focalizzati sul miglioramento del progetto
- Aiuta altri contributori quando possibile

## Domande?

Se hai domande sul processo di contribuzione, apri un issue con l'etichetta "question".

## Riconoscimenti

Tutti i contributori verranno menzionati nel README.md.

Grazie per aver contribuito! 🙏
