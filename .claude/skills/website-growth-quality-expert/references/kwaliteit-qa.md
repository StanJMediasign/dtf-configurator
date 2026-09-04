# Kwaliteit en QA

## Wat je altijd zelf doorloopt

Test de belangrijkste gebruikersreis van begin tot eind als nieuwe bezoeker, minimaal op:

- een echte telefoon (iOS Safari en Android Chrome), niet alleen de responsive-modus van je desktopbrowser;
- desktop Chrome en één niet-Chromium browser (Safari of Firefox);
- een trage verbinding en een onderbroken verbinding;
- met adblocker actief en met cookies geweigerd.

De laatste twee zijn de meest overgeslagen en meest kostbare scenario's: als de checkout of configurator stukloopt zonder toestemming voor tracking, verlies je stil omzet.

## Pre-launch checklist

**Functioneel**
- Elke call-to-action, link en knop leidt naar de bedoelde bestemming.
- Formulieren verzenden, valideren, bevestigen en leveren de data daadwerkelijk af.
- E-mails komen aan, ook bevestigings- en herstelmails, en niet in spam.
- Betalingen, kortingscodes, verzendopties en belastingberekening kloppen in echte testtransacties.
- Uploads: te grote bestanden, verkeerde formaten, corrupte bestanden en gelijktijdige uploads geven een begrijpelijke melding.
- Terug-knop, refresh midden in een flow, dubbele tab en dubbele verzending doen niets onverwachts.

**Inhoud en presentatie**
- Geen lorem ipsum, placeholderafbeeldingen, testprijzen of dummy-contactgegevens.
- Spelling, prijzen, levertijden, adres, KvK, btw en voorwaarden kloppen en zijn actueel.
- Lange namen, lege velden, extreem hoge aantallen en ontbrekende afbeeldingen breken de layout niet.
- Meertaligheid: geen half vertaalde pagina's, correcte valuta, datum- en getalnotatie.

**Techniek**
- Geen fouten in de browserconsole op de belangrijkste pagina's.
- Geen gebroken links, geen 404's op interne verwijzingen, correcte redirects na migratie.
- 404- en 500-pagina's zijn nuttig en bieden een route terug.
- Favicon, paginatitels, Open Graph-afbeeldingen en het canonical-gedrag kloppen.
- Robots, sitemap en indexering staan juist ingesteld: haal na livegang de `noindex` van de staging-instelling weg.
- Back-up, rollback en monitoring staan aan vóór de livegang, niet erna.

Voor beveiliging, secrets, headers en dependencies: gebruik `security-safety-check`. Voor structured data, canonicals en indexeringsstrategie: gebruik `seo-ga4-expert`.

## Bugs beoordelen

Beschrijf elke bug als: wat gebeurde er, wat verwachtte je, op welk apparaat en in welke browser, met welke stappen, hoe vaak, en welk deel van het verkeer het raakt.

Prioriteer op impact maal frequentie:

- **Blokkerend**: gebruiker kan niet kopen, aanvragen of inloggen. Nu oplossen.
- **Ernstig**: werkt alleen op één platform, of leidt tot verkeerde data of verkeerde prijzen.
- **Storend**: lelijk, verwarrend of traag, maar de reis lukt.
- **Cosmetisch**: pak op wanneer je er toch bent.

Een bug die 3% van het verkeer volledig blokkeert is belangrijker dan een lelijk detail dat iedereen ziet.

## Voorkomen dat kwaliteit wegzakt

- Automatiseer de reis die het geld verdient met een end-to-end test, ook als de rest handmatig blijft.
- Laat lint, typecheck en tests in CI draaien en blokkeer merges bij rood.
- Bewaak na livegang: fouten in de client, serverfouten, conversieratio per stap en Core Web Vitals. Een stille daling na een release is de duurste bug die er is.
- Voer na elke grote release binnen 24 uur een korte hercontrole uit van de belangrijkste reis op mobiel.
