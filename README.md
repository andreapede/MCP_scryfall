# Scryfall MCP Server

Un server MCP (Model Context Protocol) per cercare e recuperare informazioni sulle carte di Magic: The Gathering tramite l'API di Scryfall.

## 🎯 Caratteristiche

- **Ricerca carte**: Cerca carte utilizzando la sintassi di ricerca di Scryfall
- **Recupero carte specifiche**: Ottieni dettagli su carte specifiche per nome
- **Autocompletamento**: Suggerimenti di nomi di carte basati su query parziali
- **Preset di campi**: Set predefiniti di campi per casi d'uso comuni
- **Formati multipli**: Supporto per output in formato JSON, CSV e tabella
- **Rate limiting automatico**: Gestione automatica dei limiti di rate dell'API Scryfall

## 📋 Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn

## 🚀 Installazione

1. Clona o scarica questo repository
2. Installa le dipendenze:

```bash
npm install
```

## ⚙️ Configurazione

### Configurazione in Claude Desktop

Aggiungi la seguente configurazione al file di configurazione di Claude Desktop:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "scryfall": {
      "command": "node",
      "args": ["C:\\path_to\\MCP_scryfall\\index.js"]
    }
  }
}
```

**Importante**: Sostituisci `C:\\path_to\\MCP_scryfall\\` con il percorso assoluto dove hai clonato questo repository.

## 🔧 Strumenti Disponibili

### 1. search_cards

Cerca carte Magic: The Gathering utilizzando la sintassi di ricerca di Scryfall.

**Parametri:**
- `query` (obbligatorio): Query di ricerca Scryfall (es. 'c:red t:legendary', 'set:dom', 'o:flying cmc<=3')
- `fields` (opzionale): Lista di campi da includere nei risultati
- `preset` (opzionale): Usa un preset di campi predefinito ('basic', 'creatures', 'prices', 'commander', 'collection', 'comprehensive')
- `order` (opzionale): Ordinamento dei risultati ('name', 'set', 'released', 'rarity', 'color', 'usd', ecc.)
- `unique` (opzionale): Strategia per omettere carte simili ('cards', 'art', 'prints')
- `format` (opzionale): Formato di output ('json', 'csv', 'table')
- `limit` (opzionale): Numero massimo di carte da restituire

**Esempio:**
```
Cerca tutte le creature leggendarie rosse ordinate per nome
```

### 2. get_card

Ottieni una carta specifica per nome esatto, opzionalmente da un set specifico.

**Parametri:**
- `name` (obbligatorio): Nome esatto della carta
- `set` (opzionale): Codice del set (es. 'dom', 'war')
- `fields` (opzionale): Lista di campi da includere
- `preset` (opzionale): Usa un preset di campi predefinito
- `format` (opzionale): Formato di output ('json', 'table')

**Esempio:**
```
Mostrami i dettagli di "Lightning Bolt"
```

### 3. autocomplete

Ottieni suggerimenti di autocompletamento per nomi di carte.

**Parametri:**
- `query` (obbligatorio): Nome parziale della carta

**Esempio:**
```
Suggerisci nomi di carte che iniziano con "Black Lot"
```

### 4. get_field_presets

Mostra informazioni sui preset di campi disponibili.

**Esempio:**
```
Quali preset di campi sono disponibili?
```

## 📊 Preset di Campi

### basic
`name, set, rarity, type_line, mana_cost`

### creatures
`name, set, type_line, mana_cost, power, toughness, rarity`

### prices
`name, set, rarity, prices.usd, prices.usd_foil, prices.eur, prices.tix`

### commander
`name, type_line, color_identity, cmc, rarity, edhrec_rank, prices.usd`

### collection
`name, set_name, set, collector_number, rarity, artist, released_at`

### comprehensive
`name, mana_cost, cmc, type_line, oracle_text, power, toughness, colors, color_identity, set, set_name, rarity, artist, prices.usd, legalities.standard, legalities.commander, scryfall_uri`

## 🔍 Sintassi di Ricerca Scryfall

### Per Colore
- `c:red` - Carte rosse
- `c:wr` - Carte bianche e rosse
- `c>=bug` - Almeno blu, nero e verde
- `c:c` - Carte incolori

### Per Tipo
- `t:creature` - Creature
- `t:instant` - Istantanei
- `t:legendary` - Carte leggendarie
- `t:"legendary creature"` - Creature leggendarie

### Per Set
- `set:dom` - Dominaria (usa il codice del set)
- `set:war` - War of the Spark

### Per Rarità
- `r:mythic` - Mitico raro
- `r:rare` - Raro
- `r:uncommon` - Non comune
- `r:common` - Comune

### Per Testo
- `o:"draw a card"` - Carte che contengono "draw a card"
- `o:flying` - Carte con volare

### Per Costo di Mana
- `cmc=3` - Costo di mana convertito esattamente 3
- `cmc<=2` - CMC 2 o meno
- `mv>=5` - Valore di mana 5 o più

### Per Forza/Costituzione
- `pow>=5` - Forza 5 o maggiore
- `tou<=2` - Costituzione 2 o meno
- `pow=tou` - Forza uguale a costituzione

### Per Formato
- `f:standard` - Legale in Standard
- `f:commander` - Legale in Commander
- `f:modern` - Legale in Modern

### Combinazioni
```
c:blue t:creature cmc<=2 f:standard
```
"Creature blu con CMC 2 o meno che sono legali in Standard"

## 💡 Esempi di Utilizzo

### Esempio 1: Cerca creature leggendarie rosse
```
Cerca carte con query "c:red t:legendary t:creature" usando il preset creatures in formato tabella
```

### Esempio 2: Ottieni prezzi delle carte di un set
```
Cerca carte del set "mom" usando il preset prices in formato CSV
```

### Esempio 3: Trova contromagie in Standard
```
Cerca "o:counter o:target o:spell f:standard" con campi personalizzati: name, set, mana_cost, oracle_text, rarity, prices.usd
```

### Esempio 4: Informazioni su una carta specifica
```
Mostrami "Black Lotus" con il preset comprehensive
```

## 🛠️ Sviluppo

Per eseguire il server in modalità sviluppo:

```bash
npm start
```

## 📚 Risorse

- [Documentazione API Scryfall](https://scryfall.com/docs/api)
- [Guida alla Sintassi di Ricerca Scryfall](https://scryfall.com/docs/syntax)
- [Riferimento Oggetto Carta](https://scryfall.com/docs/api/cards)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 📄 Licenza

MIT

## ⚠️ Note

Questo server utilizza l'API di Scryfall, che è fornita gratuitamente per uso non commerciale. Si prega di rivedere i [Termini dell'API di Scryfall](https://scryfall.com/docs/api) prima di utilizzare questo server commercialmente.

Il server implementa automaticamente il rate limiting (100ms tra le richieste) per rispettare le linee guida dell'API di Scryfall.
