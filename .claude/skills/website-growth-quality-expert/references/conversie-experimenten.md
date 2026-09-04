# Conversie en experimenten

## Begrijp de funnel voordat je optimaliseert

Breng per belangrijke gebruikersreis in kaart: instap, oriëntatie, keuze, invoer, bevestiging. Bepaal per stap hoeveel gebruikers doorgaan, hoeveel afhaken en waar de grootste absolute verliezen zitten. Een stap met 40% uitval en 200 bezoekers is minder waard dan een stap met 8% uitval en 20.000 bezoekers.

Onderscheid altijd:

- **macroconversie**: de aankoop, aanvraag, offerte of boeking;
- **microconversie**: configurator gestart, prijs berekend, bestand geüpload, winkelwagen gevuld, contactformulier geopend;
- **kwaliteitssignaal**: orderwaarde, retourpercentage, leadkwaliteit, annuleringen, supportvragen.

Optimaliseer nooit een microconversie zonder te controleren wat er verderop in de funnel gebeurt. Meer leads met slechtere kwaliteit is verlies.

## Vind de echte oorzaak

Combineer minimaal twee bronnen voordat je een oorzaak claimt:

- kwantitatief: funnelrapporten, uitstappagina's, apparaat- en browsersegmenten, laadtijd per stap, formulierveld-analyse, zoekopdrachten binnen de site, foutlogs;
- kwalitatief: sessie-opnames, heatmaps, supporttickets, reviews, verkoopgesprekken, gebruikerstests met vijf tot acht mensen uit de doelgroep;
- eigen inspectie: doorloop de reis zelf op een echte telefoon, met een trage verbinding en zonder voorkennis.

Let specifiek op: onduidelijke waardepropositie, verborgen of laat getoonde kosten, verplichte accountaanmaak, te lange formulieren, ontbrekende betaal- of verzendopties, onverwachte levertijden, gebrek aan vertrouwen bij een onbekend merk, en technische fouten die alleen op bepaalde apparaten optreden.

## Hypothesen formuleren

Schrijf iedere hypothese zo op dat hij falsifieerbaar is:

> Omdat [observatie met bewijs], verwachten we dat [wijziging] leidt tot [effect op één primaire metric] bij [segment], omdat [redenering over gebruikersgedrag].

Zonder observatie is het een gok. Zonder één primaire metric kun je achteraf altijd een winnaar verzinnen.

## Fix of test

- **Direct fixen**: gebroken functionaliteit, foutmeldingen, onleesbare tekst, niet-werkende knoppen, ontbrekende informatie die klanten aantoonbaar nodig hebben, toegankelijkheidsproblemen, evidente frictie. Deze hoeven niet getest te worden en het is verspilling om ze te testen.
- **Testen**: keuzes waar redelijke mensen van mening verschillen, ingrepen met risico op omzetverlies, prijs- en aanbodwijzigingen, grote layout- of copy-veranderingen.
- **Niet testen**: als het verkeer te laag is om binnen redelijke tijd een betrouwbaar resultaat te halen. Kies dan voor onderbouwd doorvoeren, gebruikersonderzoek, of het meten van een before/after met expliciete erkenning dat dit geen bewijs van causaliteit is.

## Experimenten die kloppen

- Bepaal vóór de start: primaire metric, minimaal relevant effect (MDE), benodigde steekproefgrootte, looptijd, power (gebruikelijk 80%) en significantieniveau (gebruikelijk 95%).
- Laat de test lopen tot de vooraf bepaalde steekproef is bereikt. Stoppen zodra het even significant lijkt (peeking) produceert structureel valse winnaars.
- Draai altijd hele weken en minimaal één volledige bedrijfscyclus, zodat weekend-, salaris- en campagne-effecten in beide varianten zitten.
- Controleer op Sample Ratio Mismatch: wijkt de verdeling significant af van de ingestelde split, dan is de test technisch kapot en zijn de resultaten waardeloos.
- Test één samenhangend idee per experiment. Meerdere losse wijzigingen tegelijk maken de uitkomst onverklaarbaar.
- Voorkom flikkering (flicker/FOUC) bij client-side tests: zichtbaar omschakelen beïnvloedt het gedrag en vervuilt de meting.
- Rapporteer het resultaat met een betrouwbaarheidsinterval, niet als één getal. Een niet-significant resultaat is geen bewijs dat er geen effect is.
- Bewaar ook verliezende en neutrale tests met hun leerpunt. De leerlijst is op termijn meer waard dan de losse winst.

## Segmenten die er meestal toe doen

Nieuw versus terugkerend, mobiel versus desktop, betaald versus organisch verkeer, ingelogd versus uitgelogd, en land of taal. Een gemiddeld resultaat verbergt vaak een sterke winst in het ene segment en verlies in het andere. Segmenteer achteraf alleen verkennend en behandel zo'n vondst als nieuwe hypothese, niet als bewijs.
