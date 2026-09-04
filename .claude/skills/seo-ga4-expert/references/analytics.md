# GA4, GTM en meetplannen

## Begin bij het bedrijfsdoel, niet bij de tag

Werk elke meting terug vanaf de vraag die iemand wil beantwoorden:

bedrijfsdoel → gebruikersactie → event met parameters → key event of rapportagedimensie → concrete rapportagevraag.

Kun je de rapportagevraag niet opschrijven, dan hoeft het event er niet te komen. Meer events maken een property onbruikbaar, niet inzichtelijker.

Leg het meetplan vast als één tabel die eigenaar, ontwikkelaar en analist delen:

| Kolom | Inhoud |
|---|---|
| Bedrijfsdoel | wat de organisatie wil bereiken |
| Gebruikersactie | wat de bezoeker doet |
| Eventnaam | snake_case, kleine letters, stabiel |
| Trigger | precieze technische voorwaarde |
| Parameters | naam, type, voorbeeldwaarde, verplicht of optioneel |
| Key event | ja of nee, met reden |
| Eigenaar | wie beslist over wijzigingen |
| Testmethode | hoe je aantoont dat het klopt |
| Grondslag | consentcategorie en privacyoverweging |

## GA4-datamodel in het kort

Alles is een event met parameters. Er zijn automatisch verzamelde events, enhanced measurement events (scroll, outbound click, site search, file download, video), aanbevolen events met een vaste betekenis, en custom events. Key events zijn de events die je als waardevol markeert; die vervingen in 2024 de term conversies in de rapportage.

Gebruik een aanbevolen event zodra de betekenis past, met de voorgeschreven parameters. Dat is de enige manier om de standaardrapporten en advertentie-integraties te laten werken. Voor e-commerce betekent dat de volledige keten `view_item_list`, `view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`, telkens met de `items`-array en met `currency` en `value` waar die verplicht zijn. Een zelfbedacht `aankoop_gelukt` levert een leeg omzetrapport op.

## Naamgeving en parameters

- Eventnamen: kleine letters, snake_case, werkwoord plus object, stabiel over de tijd. Niet vertalen halverwege het jaar.
- Gebruik parameters om varianten te onderscheiden, niet aparte eventnamen. Eén `form_submit` met parameter `form_name` is beter dan twintig losse events.
- Registreer elke parameter die je in rapporten wilt gebruiken als custom dimensie of metric, anders is hij onzichtbaar. Dat geldt niet met terugwerkende kracht: data van vóór de registratie blijft leeg.
- Er gelden limieten op het aantal custom dimensies en metrics per property. Controleer de actuele aantallen in de officiële documentatie voordat je een uitgebreid plan belooft, en reserveer ruimte voor later.
- Vermijd hoge cardinaliteit: parameters met duizenden unieke waarden, zoals volledige URL's met parameters, tijdstempels of order-id's, laten rijen samenvallen in "(other)" en maken het rapport onbruikbaar.
- Zet nooit persoonsgegevens in eventnamen, parameters, user properties, page paths of pagetitles: geen e-mailadres, telefoonnummer, naam, adres, IP, klantnummer of vrije-tekstinvoer. Dat is een schending van de Google-voorwaarden en kan tot verwijdering van data leiden.

## Implementatie via GTM

- Push gestructureerde gegevens vanuit de applicatie naar de `dataLayer` en laat GTM lezen, niet raden. Trekken uit de DOM met CSS-selectors breekt bij de eerste redesign.
- Push de dataLayer vóór de container-snippet wanneer de waarde bij paginalading beschikbaar moet zijn.
- Wis of overschrijf ecommerce-objecten tussen pushes om te voorkomen dat oude waarden meeliften.
- Bij een single page application: paginaweergaven op routewijziging afvuren, en controleren dat er geen dubbele hits ontstaan naast de automatische meting.
- Documenteer per tag de trigger, de blokkerende trigger en de eigenaar. Een container zonder documentatie is na een jaar niet meer te onderhouden.
- Consent Mode: implementeer de consentsignalen vóór de metingstags en controleer dat tags daadwerkelijk wachten of in gemodelleerde modus draaien. In de EER is Consent Mode v2 vereist voor de advertentie-integraties; zonder correcte implementatie vallen doelgroepen en conversies weg.

## Testen en valideren

Meten is pas af als je het hebt aangetoond, in drie stappen:

1. **Preview**: GTM Preview plus GA4 DebugView. Controleer dat het event afvuurt, precies één keer, met alle parameters en de juiste typen en waarden.
2. **Negatieve test**: controleer dat het event níet afvuurt waar dat niet hoort, bijvoorbeeld bij een mislukte betaling, een validatiefout, een refresh van de bevestigingspagina of een dubbele verzending.
3. **Na 24 tot 48 uur**: controleer de verwerkte rapporten. Vergelijk het aantal aankopen en de omzet met de backoffice. Een afwijking van enkele procenten is normaal door consent en adblockers; een structureel verschil is een implementatiefout.

Test op mobiel, met cookies geweigerd en met een adblocker actief. Dat is de situatie van een aanzienlijk deel van je bezoekers.

## Configuratie-hygiëne

Controleer bij elke property: interne en ontwikkelaarstraffic uitgesloten, ongewenste verwijzingen (betaalproviders, inlogschermen) gefilterd zodat sessies niet breken, cross-domain meting ingesteld wanneer de reis meerdere domeinen doorloopt, bewaartermijn voor eventdata bewust ingesteld in plaats van op de standaardwaarde gelaten, en de koppelingen met Search Console, Google Ads en BigQuery ingericht waar die nodig zijn.

Zet de BigQuery-export aan zodra data echt belangrijk wordt. Het is gratis in te richten, werkt niet met terugwerkende kracht, en is de enige route naar ongesampelde data op rij-niveau.

## Rapporteren en interpreteren

- Bouw rapporten rond de vraag van de ontvanger, niet rond de beschikbare dimensies. Maximaal een handvol getallen per scherm, met context en richting.
- Benoem bij elke conclusie de beperkingen die haar kunnen ondermijnen: ontbrekende consent, gemodelleerde data, drempelwaarden die kleine segmenten verbergen, sampling in verkennende rapporten, attributievensters en verschillen tussen platformen.
- GA4 en de advertentieplatformen tellen anders. Verklaar het verschil, laat het niet wegvallen.
- Claim geen causatie op basis van correlatie of een before/after zonder controlegroep. Voor experimenten met bewijskracht: zie de skill `website-growth-quality-expert`, referentie `conversie-experimenten.md`.

## Eindcontrole

1. Is elk event terug te voeren op een concrete rapportagevraag?
2. Zijn aanbevolen events en verplichte parameters gebruikt waar de betekenis past?
3. Is elk event positief én negatief getest, en daarna in de verwerkte data gevalideerd?
4. Zijn de cijfers vergeleken met een onafhankelijke bron zoals de backoffice?
5. Zijn alle parameters die in rapporten nodig zijn geregistreerd als dimensie of metric?
6. Zit er nergens een persoonsgegeven in een eventnaam, parameter, URL of titel?
7. Zijn consent, bewaartermijn, interne traffic, cross-domain en filters bewust ingesteld?
8. Is gedocumenteerd wie eigenaar is en hoe iemand een wijziging aanvraagt?
