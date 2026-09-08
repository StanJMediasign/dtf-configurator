# Araco International: promotioneel textiel, data via Promidata

Araco International B.V. (Jaargetijdenweg 90, Enschede) is een groothandel en importeur van promotionele relatiegeschenken met 35 jaar ervaring en een specialisatie in textiel. Levert aan wederverkopers (B2B). Voor pinkprint.com is dit de leverancier voor bedrukt en geborduurd textiel, headwear, badtextiel en werkkleding.

## Araco API's (bron: dealerpagina shop.araco.nl/account/apis, 8 september 2026)

Araco biedt via het dealeraccount drie API's aan. Toegang is beschikbaar voor alle geregistreerde klanten, de technische documentatie wordt na activering verstrekt. Contactpersoon: Dennis Haarman, Productowner bij Araco. Op de pagina staat een knop "Vraag documentatie aan".

| API | Wat Araco erover zegt | Rol in pinkprint.com |
|---|---|---|
| **Voorraad API** | Actuele voorraadsituatie: beschikbaarheid, levertermijnen en stockstatus per product. Bedoeld voor integratie in eigen voorraadbeheer of e-commerce platform | Voorraad en levertijd tonen op de productpagina, blanco's reserveren voor eigen DTF-productie |
| **Productinformatie API** | Complete productdetails: basisinformatie, technische specificaties, prijzen, afbeeldingen en beschrijvingen. Bedoeld om eigen catalogus of webshop automatisch actueel te houden | Catalogusimport rechtstreeks bij de bron, in plaats van (of naast) Promidata |
| **Order API** | Orders plaatsen en beheren vanuit de eigen applicatie, voortgang monitoren, automatische notificaties bij statuswijzigingen, centraal overzicht van alle orders | Orderdoorzetting en statussync, hetzelfde patroon als Probo |

Wat de pagina **niet** zegt en de documentatie moet beantwoorden:

1. Authenticatie (API-key, OAuth, Basic) en base URL. De pagina noemt alleen "industry-standard beveiliging".
2. Formaat (JSON of XML) en of er een OpenAPI/Swagger-specificatie is.
3. Hoe decoratie in een order wordt meegegeven: techniek (bedrukken, borduren), positie, kleuren, artwork-bestand, proof-goedkeuring.
4. Hoe "automatische notificaties bij statuswijzigingen" technisch werken: webhook naar onze URL of polling.
5. Of de Order API dropship aan de eindklant met neutrale verzending ondersteunt, en of er track & trace in de status zit.
6. Of prijzen in de Productinformatie API klantspecifiek zijn (dealerprijs, staffels) en of decoratieprijzen erin zitten.
7. Testomgeving of testorders, en rate limits.

Gevolg voor de hub: Araco verschuift van `orderChannel: "manual"` naar `"api"`. Het profiel blijft catalogus-gedreven (staffels, decoratie, MOQ), maar met een volledige API-set, wat Araco technisch dichter bij Probo brengt dan bij PF Concept.

## Assortiment en merken

| Merk / lijn | Segment |
|---|---|
| Nilton's | Caps, hoeden, mutsen en overig headwear, plus polo's, T-shirts, fleece, sjaals |
| Sophie Muval | Badtextiel: handdoeken, badjassen |
| Brickstone | Werkkleding en veiligheid: schorten, keukentextiel, veiligheidsvesten en -jassen |
| 4YOU | Custom made: basisartikel kiezen en in een paar stappen opties bepalen (eigen kleur, label, verpakking) |

Uit voorraad leverbaar, met bedrukking of borduring in eigen productielocaties in Roemenië en Nederland.

## Waarom Araco voor pinkprint.com interessant is

- **Overlap met onze eigen DTF-productie.** Araco levert blanco textiel uit voorraad. Wij kunnen dat zelf met DTF bedrukken via de bestaande configurator. Dat maakt Araco niet alleen een leverancier van eindproducten, maar ook een inkoopbron voor eigen productie met hogere marge en kortere doorlooptijd.
- **Twee decoratieroutes per artikel:** Araco decoreert (borduren, zeefdruk, grotere series) of wij decoreren (DTF, kleine series, snel). De hub kiest per order op basis van aantal en techniek.
- **Overlap met PF Concept Label.** Beide leveren kleding. Kies per categorie één primaire leverancier om dubbele artikelen en verwarrende prijzen te vermijden: Araco voor headwear, badtextiel en werkkleding, PF Concept Label voor merkkleding en gifts.

## Wat we weten en niet weten

| Onderwerp | Status |
|---|---|
| Productdata | Productinformatie API van Araco zelf (na activering). Alternatief: Promidata, code A86 |
| Prijzen | In de Productinformatie API. Of het dealerprijzen met staffels en decoratieprijzen zijn: documentatie |
| Voorraad | Voorraad API: beschikbaarheid, levertermijn, stockstatus per product |
| Orderplaatsing | Order API: plaatsen, beheren, voortgang, statusnotificaties |
| Artwork en proof | Onbekend. Waarschijnlijk per e-mail met digitale proof |
| Dropship / neutraal verzenden | Onbekend, uitvragen |
| Minimum afname | Onbekend, per artikel en decoratietechniek. Uitvragen |
| Status / track & trace | Statusnotificaties via de Order API. Mechanisme (webhook/polling) en track & trace: documentatie |

## Profiel voor de hub

Araco is een **catalogus-gedreven groothandel**, hetzelfde profiel als PF Concept. De adapter volgt het PF-patroon (feed-import, staffels, decoratieprijzen, MOQ), met twee verschillen:

- Data komt uit de **Productinformatie API** en de **Voorraad API** van Araco. Promidata blijft een optie als we PF Concept en Araco in één formaat willen inlezen, maar is niet meer nodig.
- Orderplaatsing via de **Order API**, met statusnotificaties naar de hub. Zelfde adapterpatroon als Probo.
- Voor artikelen die wij zelf met DTF bedrukken routeert de hub naar **intern** met Araco als inkoopbron (blanco bestellen op eigen voorraad of per order).

## Wat we nu moeten doen

1. Op shop.araco.nl/account/apis op "Vraag documentatie aan" klikken, of Dennis Haarman rechtstreeks benaderen. Vraag meteen de zeven punten hierboven uit.
2. API-toegang laten activeren op het account dat pinkprint.com gaat gebruiken.
3. Bepalen welke Araco-categorieën we zelf met DTF bedrukken en welke Araco decoreert.

## Bronnen

- Araco dealerpagina API's (achter login): https://shop.araco.nl/account/apis
- Promidata connected member Araco International BV (A86): https://www.promidata.com/connected-member/araco-international-bv-a86-3/
- Promidata Promotional Data (XML/JSON): https://www.promidata.com/nl/promotional-xml-of-json-data/
- Promidata voor leveranciers (voorraadkoppeling): https://www.promidata.com/en/for-suppliers-en/
- Araco International (UK-site en dealershop): https://www.araco.co.uk/ en https://shop.araco.co.uk/taxons/catalog
- eppi Magazine, "Araco International: Specialisation and service" (jan 2024): https://www.eppi-online.com/2024/01/29/araco-international-specialisation-and-service/
- PromoCat leveranciersprofiel: https://promocat.nl/leveranciers/araco-international/
- De Leveranciersdagen: https://thesupplierdays.com/exhibitors/araco-international/
- Araco productcatalogus 2023 (PDF): https://image.araco.nl/Catalogus%202023/Araco_Product_Catalogue_2023_NL_web.pdf
