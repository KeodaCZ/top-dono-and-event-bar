# Top Donors and Event List

Overlay pro streamování, který zobrazuje nejvyššího dárce a nejnovější události streamu pomocí Streamer.bot API.

## Funkce

- **Top Donor Bar** - Zobrazuje nejvyššího dárce s částkou
- **Event List** - Zobrazuje nejnovější události (bits, dary, atd.)
- **Dva režimy zobrazení**:
  - **Horizontal** - Kompaktní horizontální lišta
  - **Vertical** - Vertikální verze se scrollovací animací eventů
- **Animace** - Eventy v vertikálním režimu se plynule scrollují zprava doleva
- **Automatické přizpůsobení** - Rychlost animace a délka scrollu se automaticky přizpůsobují počtu eventů a délce textu
- **Synchronní zpracování** - Při rychlém přibývání eventů se správně synchronizují operace pro přidávání a odebírání

## Instalace

1. Stáhněte nebo naklonujte toto repozitář
2. Spusťte HTTP server v adresáři projektu (např. `python -m http.server` nebo použijte Live Server ve VS Code)
3. Otevřete `index.html` v prohlížeči nebo nastavte URL jako OBS overlay

## Konfigurace

Overlay lze konfigurovat pomocí URL parametrů:

| Parametr | Popis | Default |
|----------|-------|---------|
| `mode` | Zobrazovací režim (`horizontal` nebo `vertical`) | `horizontal` |
| `maxEvents` | Maximální počet zobrazených eventů (0 = žádné eventy) | `5` |
| `showTopDonor` | Zobrazit top donor lištu (`true` nebo `false`) | `false` |
| `address` | Streamer.bot server adresa | `127.0.0.1` |
| `port` | Streamer.bot port | `8080` |
| `size` | Velikost písma v pixelech | `21` |
| `backgroundColor` | Barva pozadí v hex formátu (např. #000000 pro černou) (do URL se místo # použije %23) | `#000000` |
| `backgroundOpacity` | Průhlednost pozadí jako desetinné číslo (0.0 - 1.0) | `0.5` |
| `textColor` | Barva textu v hex formátu (např. #ffffff pro bílou) (do URL se místo # použije %23) | `#ffffff` |
| `outlineColor` | Barva outline textu v hex formátu (např. #000000 pro černou) (do URL se místo # použije %23) | "" |
| `outlineThickness` | Tlouška outline v pixelech | `2` |
| `kickUsername` | Kick uživatelské jméno pro WebSocket připojení | "" |

### Příklady URL

**Horizontal režim s 5 eventy:**
```
index.html?mode=horizontal&maxEvents=5&showTopDonor=true
```

**Vertikální režim:**
```
index.html?mode=vertical
```

**Vertikální režim s 3 eventy a černým outline 2px:**
```
index.html?mode=vertical&maxEvents=3&outlineColor=%23000000&outlineThickness=2
```

**Připojení k vzdálenému Streamer.bot:**
```
index.html?address=192.168.1.100&port=8080
```

**Vlastní velikost písma a barvy:**
```
index.html?mode=vertical&size=24&backgroundColor=%231a1a1a&textColor=%2300ff00
```

**Žádné eventy (maxEvents=0):**
```
index.html?mode=vertical&maxEvents=0
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

V vertikálním režimu se eventy plynule posouvají:
- **Nový event** přiletí zeshora dolů s fade-in efektem
- **Staré eventy** se automaticky posouvají na své nové pozice (díky flexboxu)
- **Poslední event** plynule mizí, když je překročen maximální počet
- **Container** má fixní výšku vypočítanou podle `maxEvents` (první event 1.5×, ostatní 1.3× velikosti písma)
- **Synchronní přístup** - při rychlém přibývání eventů se počká na dokončení animací před další operací
- **Overflow hidden** - text vyjíždí z obrazovky, když je event odstraněn

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
