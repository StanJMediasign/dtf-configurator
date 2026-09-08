# "Aracal.nl": niet gevonden

## Wat is gezocht

Op 8 september 2026 is gezocht naar een Nederlandse print-, sign- of promotieleverancier met de naam "Aracal" en domein aracal.nl:

- Exacte zoekopdrachten op `"aracal.nl"`, `Aracal API koppeling`, `Aracal Nederland bedrijf`, `Aracal stickers/textiel/folie/sign/print/reclame`, `Aracal DTF/textieldruk/print on demand`.
- Spellingsvarianten: `Arcal`, `Arracal`, `Arakal`, `Oracal`, gecombineerd met relatiegeschenken, drukkerij, groothandel.
- Directe controle van aracal.nl, arcal.nl, oracal.nl, arakal.nl, arracal.nl. Vanuit deze omgeving zijn die domeinen niet bereikbaar (netwerkbeleid), dus dit zegt niets over het bestaan ervan.

Resultaat: geen enkele treffer voor een Nederlands bedrijf met deze naam in de print- of promotiebranche. Wel een Shopify-winkel met islamitische kunst (aracal.myshopify.com), een plaats in Colombia en een bouwbedrijf in Moldavië. Geen van drie is relevant.

## Mogelijke verklaringen

De naam is ingesproken en uitgeschreven, dus een spelfout is het meest waarschijnlijk. Kandidaten:

| Kandidaat | Waarom het zou kunnen | Waarom het misschien niet klopt |
|---|---|---|
| **Oracal / Orafol** | Bekend foliemerk (stickerfolie, plotfolie) dat in onze branche dagelijks genoemd wordt. Klinkt bijna hetzelfde | Orafol is een fabrikant, geen webshop met order-API. Folie koop je via distributeurs (Igepa, Spandex, Grafityp) |
| **Arca.nl** (Arca Printers & Supplies, Moerdijk) | Bestaat, printbranche, heeft recent een webshop met automatische voorraadkoppeling laten bouwen | Verkoopt fotoprinters, papier en inkt aan fotografen. Geen productie-partner voor eindproducten |
| Een andere regionale sign- of textielleverancier | Wij werken mogelijk al met een partij die intern zo genoemd wordt | Niet te achterhalen zonder bevestiging |

## Wat er nodig is

Bevestig de juiste naam of het juiste domein. Twee vragen die het meteen oplossen:

1. Welke producten zou deze leverancier voor pinkprint.com moeten leveren? (bijvoorbeeld: textiel, folie, verpakking, drukwerk in kleine oplage)
2. Hebben wij daar al een account of inlog, en zo ja, op welk domein?

## Hoe de architectuur hiermee omgaat

De hub in `../architectuur.md` is gebouwd op adapters. Een derde leverancier valt in één van drie profielen, en voor elk profiel ligt de aanpak al vast:

- **Configuratie-gedreven printer** (zoals Probo): live prijs via API, configurator, white label. Adapter kopieert het Probo-patroon.
- **Catalogus-gedreven groothandel** (zoals PF Concept): feed-import, staffels, decoratieprijzen, MOQ. Adapter kopieert het PF-patroon. Als het een promo-leverancier is, kan Promidata de data leveren.
- **Alleen materiaal / geen API** (zoals een foliemerk): geen adapter, maar inkoop voor eigen productie. Dan verkoopt pinkprint.com eigen DTF- en stickerproductie en is deze leverancier onzichtbaar voor de klant.

Zodra de naam bevestigd is, wordt dit bestand vervangen door een echte leveranciersbeschrijving in hetzelfde formaat als `probo.md` en `pf-concept.md`.
