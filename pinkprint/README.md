# Pinkprint.com: onderzoek naar één "total printing" webshop op drie leveranciers-API's

Datum onderzoek: 8 september 2026
Status: onderzoeksrapport, geen code. Bedoeld als beslisdocument voor pinkprint.com.

## De vraag

Kunnen we onder de naam **pinkprint.com** één website bouwen die de volledige catalogus van drie leveranciers verkoopt, van relatiegeschenken tot spandoeken en stickers, met automatische orderdoorzetting via hun API's?

De drie genoemde leveranciers:

| Leverancier | Rol in het aanbod | API-status na onderzoek |
|---|---|---|
| **Probo** (probo.nl / proboprints.com) | Large format print: spandoeken, stickers, vlaggen, plaatmateriaal, textiel, wanddecoratie | Volwassen REST API, goed gedocumenteerd, wij kennen hem al |
| **PF Concept** (pfconcept.com) | Relatiegeschenken en promotieartikelen, 6.500+ items, met bedrukking (Logo Express) | XML/JSON datafeeds plus order-Gateway. Alleen voor geregistreerde wederverkopers. Documentatie pas zichtbaar na account |
| **Araco International** (araco.nl) | Promotioneel textiel: headwear (Nilton's), badtextiel (Sophie Muval), werkkleding (Brickstone), custom made (4YOU), eigen bedrukking en borduring | API beschikbaar via het dealeraccount op shop.araco.nl (pagina account/apis). Documentatie nog op te halen. Productdata ook via Promidata (code A86) |

## Het korte antwoord

**Ja, dit kan in één website.** Maar niet als "drie catalogi aan elkaar plakken". Het werkt alleen als je één eigen productlaag bouwt met daaronder een leveranciers-hub die per bestelling bepaalt wie wat produceert. De drie leveranciers verschillen fundamenteel in hoe ze prijzen, configureren en leveren:

- **Probo** rekent per configuratie (materiaal x afmeting x aantal x afwerking). Prijs is pas bekend na een live API-call. Levering is white label, vaak volgende dag, vanaf 1 stuk.
- **PF Concept** werkt met staffelprijzen per artikel plus aparte decoratieprijzen per printtechniek (printcodes) plus instelkosten. Prijzen komen uit dagelijkse XML-feeds en kun je vooraf berekenen. Minimum afnames en langere levertijden bij bedrukking.
- **Araco** is een catalogus-gedreven textielgroothandel zonder eigen API. Data via Promidata, orders in fase 1 semi-handmatig. Extra kans: Araco levert blanco textiel dat wij zelf met DTF bedrukken.

De grootste risico's zitten niet in de techniek maar in **accounts en data-toegang**:

1. PF Concept levert uitsluitend aan geregistreerde distributeurs (B2B2B, circa 10.000 resellers). Zonder distributeursaccount geen feed, geen Gateway en geen prijzen.
2. De echte PF Concept Gateway-documentatie (endpoints, orderformaat, statusterugkoppeling) staat achter het klantportaal. Wat hieronder staat komt uit publieke bronnen en de oude System Integration Manual (v1.6, 2015). Details moeten na accountaanvraag bevestigd worden bij hun API/XML-specialist.
3. Araco's API-documentatie staat achter de dealer-login (shop.araco.nl/account/apis) en is nog niet vastgelegd in dit rapport.

## Wat er in deze map staat

| Bestand | Inhoud |
|---|---|
| `leveranciers/probo.md` | Probo Reseller API: endpoints, auth, artwork, orderflow, webhooks, configurator-component |
| `leveranciers/pf-concept.md` | PF Concept datafeeds, printcodes, Gateway, accountvereisten, alternatief via Promidata |
| `leveranciers/araco.md` | Araco International: assortiment, Promidata-route, ontbrekende order-API, DTF-kans |
| `architectuur.md` | Doelarchitectuur voor één winkel op meerdere leveranciers: catalogus, prijzen, artwork, orderrouting, statussen |
| `architectuur/supplier-adapter.ts` | TypeScript-schets van de uniforme leveranciers-interface (geen werkende code, wel het contract) |
| `roadmap.md` | Fasering, openstaande acties, inschatting en beslispunten |

## Aanbeveling in vijf regels

1. Bouw pinkprint.com op **Shopify** (net als de DTF-configurator in deze repo) met een eigen **Supplier Hub** ernaast (Remix/Node + Postgres + queue). De hub bezit de leveranciersdata, Shopify verkoopt.
2. Start met **Probo**: de API is bekend, white label, vanaf 1 stuk. Dat is de snelste weg naar een werkende winkel met spandoeken, stickers en vlaggen.
3. Vraag **vandaag** het PF Concept distributeursaccount en Gateway-documentatie aan. Dit is de langste doorlooptijd in het hele traject en ligt volledig buiten onze invloed.
4. Beperk de PF Concept-catalogus in fase 1 tot een **gecureerde selectie** (bijvoorbeeld 300 tot 500 bestsellers met Logo Express-decoratie) in plaats van alle 6.500 items. Volledige catalogus is een SEO- en beheerprobleem, geen verkoopvoordeel.
5. Neem **Promidata** als gedeelde datalaag voor PF Concept en Araco. Eén importer, twee leveranciers. Vraag Araco parallel naar een order-API; tot die er is maakt de hub de Araco-inkooporder klaar voor handmatige verzending.

## Bronnen

- Probo API docs: https://apidocs.proboprints.com/ (referentie, guides, sandboxing, order status, WooCommerce plugin)
- Probo API-landingspagina resellers: https://www.probo.nl/api
- Probo product configurator web component: https://github.com/ProboConnect/product-configurator
- Probo Connect (legacy, wordt uitgefaseerd): http://developers.probo.nl/
- PF Concept API/XML specialist: https://www.pfconcept.com/en_nl/xml_specialist
- PF Concept Sales & Marketing Support (datafeeds, Gateway): https://www.pfconcept.com/en_nl/sales-marketing-support
- PF Concept System Integration Manual v1.6 (2015, via derde partij): https://eklektika.pl/wp-content/uploads/2017/03/CSI_manual_1.6.pdf
- PF Concept via PrintXpand Connect: https://www.printxpand.com/px-connect/suppliers/pf-concept/
- PF Concept via Custom Gateway: https://www.custom-gateway.com/supplier-product-feeds/pf-concept/
- Promidata Promotional Data (aggregator, incl. PF Concept en Araco): https://www.promidata.com/nl/promotional-xml-of-json-data/
- Promidata connected member Araco (A86): https://www.promidata.com/connected-member/araco-international-bv-a86-3/
- Araco International: https://www.araco.co.uk/ en https://www.eppi-online.com/2024/01/29/araco-international-specialisation-and-service/
