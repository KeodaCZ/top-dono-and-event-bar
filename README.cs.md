# Top Donors and Event List

Overlay pro streamování, který zobrazuje nejvyššího dárce a nejnovější události streamu pomocí Streamer.bot API.

## Funkce

- **Top Donor Bar** - Zobrazuje nejvyššího dárce s částkou
- **Event List** - Zobrazuje nejnovější události (bits, dary, atd.)
- **Dva režimy zobrazení**:
  - **Horizontal** - Kompaktní horizontální lišta
  - **Vertical** - Vertikální verze se scrollovací animací eventů
- **Animace** - Eventy v vertikálním režimu se plynule scrollují zprava doleva
- **Automatická přizpůsobení** - Rychlost animace a délka scrollu se automaticky přizpůsobují počtu eventů a délce textu

## Instalace

1. Stáhněte nebo naklonujte toto repozitář
2. Spusťte HTTP server v adresáři projektu (např. `python -m http.server` nebo použijte Live Server ve VS Code)
3. Otevřete `index.html` v prohlížeči nebo nastavte URL jako OBS overlay

## Konfigurace

Overlay lze konfigurovat pomocí URL parametrů:

| Parametr | Popis | Default |
|----------|-------|---------|
| `mode` | Zobrazovací režim (`horizontal` nebo `vertical`) | `horizontal` |
| `maxEvents` | Maximální počet zobrazených eventů | `3` |
| `showTopDonor` | Zobrazit top donor lištu (`true` nebo `false`) | `false` |
| `address` | Streamer.bot server adresa | `127.0.0.1` |
| `port` | Streamer.bot port | `8080` |

### Příklady URL

**Horizontal režim s 5 eventy:**
```
index.html?mode=horizontal&maxEvents=5&showTopDonor=true
```

**Vertikální režim:**
```
index.html?mode=vertical
```

**Připojení k vzdálenému Streamer.bot:**
```
index.html?address=192.168.1.100&port=8080
```

## Streamer.bot Integrace

1. Ujistěte se, že Streamer.bot běží a má povolený WebSocket server
2. Ve Streamer.bot nastavte příslušné eventy pro sledování (bits, dary, atd.)
3. Automaticky obdržíte eventy a aktualizují se na overlayi

## Příklad použití v OBS

1. V OBS přidejte nový **Browser Source**
2. Do pole **URL** vložte cestu k vašemu `index.html` s požadovanými parametry
3. Nastavte **Width** a **Height** podle potřeby
4. Klikněte na **OK**

## Animace vertikálního režimu

V vertikálním režimu se eventy automaticky scrollují:
- Text se pohybuje zprava doleva
- Rychlost animace se vypočítá podle délky obsahu
- Pokud se obsah vejde na obrazovku, animace se zastaví
- Plynulý nekonečný cyklus bez trhnutí

## Struktura souborů

```
top-dono-and-event-list/
├── index.html      # Hlavní HTML soubor
├── style.css       # Styly a animace
├── script.js       # Logika a Streamer.bot integrace
├── README.md       # Anglická dokumentace
└── README.cs.md    # Česká dokumentace
```

## Požadavky

- Moderní webový prohlížeč
- Běžící Streamer.bot s WebSocket API
- HTTP server pro lokální vývoj (volitelné)
