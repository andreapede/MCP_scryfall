# Esempi di Utilizzo - Scryfall MCP Server

Questa guida fornisce esempi pratici di come utilizzare il server MCP Scryfall per cercare carte di Magic: The Gathering.

## 📚 Indice

- [Ricerche Base](#ricerche-base)
- [Ricerche Avanzate](#ricerche-avanzate)
- [Gestione dei Formati](#gestione-dei-formati)
- [Preset di Campi](#preset-di-campi)
- [Casi d'Uso Comuni](#casi-duso-comuni)

## Ricerche Base

### Esempio 1: Creature Leggendarie Rosse

```
Cerca carte con query "c:red t:legendary t:creature" usando il preset creatures
```

Questo restituirà tutte le creature leggendarie rosse con i campi: name, set, type_line, mana_cost, power, toughness, rarity.

### Esempio 2: Carte di un Set Specifico

```
Cerca carte del set "dom" con limite 20
```

Restituisce le prime 20 carte del set Dominaria.

### Esempio 3: Carte per Rarità

```
Cerca "r:mythic" ordinate per "usd" in formato tabella
```

Mostra tutte le carte mitiche ordinate per prezzo USD.

## Ricerche Avanzate

### Esempio 4: Contromagie in Standard

```
Cerca "o:counter o:target o:spell f:standard" con campi personalizzati: 
name, set, mana_cost, oracle_text, rarity, prices.usd
```

Trova tutte le contromagie legali in Standard con informazioni dettagliate.

### Esempio 5: Creature Economiche per Commander

```
Cerca "t:creature f:commander usd<5 cmc>=4" usando il preset commander limitato a 50 carte
```

Trova creature potenti ed economiche per Commander.

### Esempio 6: Carte con Power/Toughness Specifici

```
Cerca "pow>=8 t:creature" ordinate per "power" con preset creatures
```

Trova tutte le creature con forza 8 o superiore.

## Gestione dei Formati

### Output in Formato Tabella (predefinito)

```
Cerca "set:war r:rare" formato tabella
```

Risultato leggibile in formato tabella ASCII.

### Output in Formato JSON

```
Cerca "c:blue t:instant cmc<=2" formato json con preset basic
```

Output strutturato in JSON, ideale per elaborazioni successive.

### Output in Formato CSV

```
Cerca "set:mom" formato csv con preset prices
```

Esporta in formato CSV per l'importazione in Excel o altri strumenti.

## Preset di Campi

### Preset "basic"
Campi: name, set, rarity, type_line, mana_cost

```
Cerca "f:standard" con preset basic limitato a 100
```

### Preset "creatures"
Campi: name, set, type_line, mana_cost, power, toughness, rarity

```
Cerca "t:creature cmc=1" con preset creatures
```

### Preset "prices"
Campi: name, set, rarity, prices.usd, prices.usd_foil, prices.eur, prices.tix

```
Cerca "set:ltr" con preset prices formato csv
```

### Preset "commander"
Campi: name, type_line, color_identity, cmc, rarity, edhrec_rank, prices.usd

```
Cerca "is:commander" con preset commander ordinato per "edhrec"
```

### Preset "collection"
Campi: name, set_name, set, collector_number, rarity, artist, released_at

```
Cerca "a:rebecca guay" con preset collection
```

### Preset "comprehensive"
Tutti i campi principali inclusi legality e link Scryfall

```
Mostra "Lightning Bolt" con preset comprehensive
```

## Casi d'Uso Comuni

### Building a Cube

```
Cerca "f:vintage pow>=3 tou>=3 t:creature cmc<=4" con preset creatures limitato a 100
```

Trova creature efficienti per un cube vintage.

### Budget Deck Building

```
Cerca "f:standard usd<1" con preset prices ordinato per "edhrec"
```

Trova carte economiche legali in Standard.

### Commander Staples

```
Cerca "f:commander usd<10 is:staple" con preset commander ordinato per "edhrec" limitato a 50
```

Trova staples economici per Commander.

### Art Collection

```
Cerca "a:seb mckinnon" con preset collection
```

Trova tutte le carte illustrate da un artista specifico.

### Investment Research

```
Cerca "r:mythic set:one" con preset prices formato csv
```

Esporta prezzi di mitiche per analisi di investimento.

### Set Completion

```
Cerca "set:mkm -t:token -t:emblem" con preset collection ordinato per "collector_number"
```

Lista tutte le carte di un set per verificare la completezza della collezione.

## Ricerca di Carte Specifiche

### Per Nome Esatto

```
Mostra "Black Lotus"
```

Ottieni tutti i dettagli di una carta specifica.

### Per Nome con Set

```
Mostra "Lightning Bolt" dal set "m11"
```

Ottieni la versione specifica di una carta da un determinato set.

### Autocompletamento

```
Suggerisci nomi che iniziano con "Liliana of"
```

Utile quando non ricordi il nome completo di una carta.

## Combinazioni di Ricerca Avanzate

### Multi-Color Aggro

```
Cerca "c:rw t:creature cmc<=3 f:modern" con preset creatures
```

Trova creature rosse/bianche economiche per Modern.

### Tribal Synergies

```
Cerca "t:elf o:elf" con campi: name, type_line, oracle_text, cmc, prices.usd
```

Trova tutte le carte che supportano la tribù elfi.

### Card Draw Effects

```
Cerca "o:'draw' o:'card' c:blue t:instant f:commander" ordinato per "cmc"
```

Trova istantanei blu che pescano carte per Commander.

### Removal Spells

```
Cerca "(o:destroy o:exile) (t:instant OR t:sorcery) f:standard" con preset basic
```

Trova rimozioni legali in Standard.

## Tips per Ricerche Efficaci

1. **Usa le abbreviazioni**: `c:` per colore, `t:` per tipo, `o:` per testo Oracle
2. **Combina criteri**: Più criteri restringono i risultati
3. **Usa i preset**: Risparmiano tempo e forniscono campi rilevanti
4. **Limita i risultati**: Usa `limit` per ricerche ampie
5. **Ordina strategicamente**: Ordina per prezzo, potenza, o ranking EDH secondo necessità
6. **Esporta in CSV**: Per analisi in Excel o Google Sheets
7. **Usa JSON**: Per integrazioni con altri tool o script

## Sintassi di Ricerca Scryfall

Per una guida completa alla sintassi di ricerca, consulta:
- [Guida Ufficiale Scryfall](https://scryfall.com/docs/syntax)
- Il README.md del progetto

## Supporto

Per problemi o domande:
- Controlla il README.md per la documentazione completa
- Visita la [documentazione MCP](https://modelcontextprotocol.io/)
- Consulta la [documentazione API Scryfall](https://scryfall.com/docs/api)
