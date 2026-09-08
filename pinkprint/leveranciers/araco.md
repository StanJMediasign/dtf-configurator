# Araco International: promotioneel textiel, data via Promidata

Araco International B.V. (Jaargetijdenweg 90, Enschede) is een groothandel en importeur van promotionele relatiegeschenken met 35 jaar ervaring en een specialisatie in textiel. Levert aan wederverkopers (B2B). Voor pinkprint.com is dit de leverancier voor bedrukt en geborduurd textiel, headwear, badtextiel en werkkleding.

## Belangrijkste conclusie

Araco heeft **geen eigen publieke API**. Wel zijn er twee bruikbare routes:

1. **Productdata via Promidata.** Araco is "connected member" bij Promidata (leverancierscode A86). Promidata levert een XML- of JSON-feed / webservice met artikelen, prijzen, afbeeldingen en (waar de leverancier het publiceert) voorraad. Dat is dezelfde route die ook voor PF Concept kan gelden, dus één importformaat voor twee leveranciers.
2. **Orders via de dealer-webshop of e-mail/EDI.** Araco heeft een dealerwebshop (de Britse variant draait op shop.araco.co.uk; de Nederlandse op araco.nl). Of die shop een order-API voor dealers biedt, is niet publiek te vinden en moet bij Araco uitgevraagd worden.

Alles hieronder komt uit publieke bronnen. De site araco.nl zelf was vanuit deze omgeving niet bereikbaar. Verifiëren na dealeraccount.

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
| Productdata | Via Promidata, code A86. Formaat XML/JSON, dagelijkse updates. Abonnement nodig (Basic: max 10 leveranciers, Premium: onbeperkt, prijs op aanvraag) |
| Prijzen | Staffelprijzen per artikel, decoratieprijzen apart. Structuur in de Promidata-feed te controleren |
| Voorraad | Promidata kan voorraad periodiek importeren als de leverancier die publiceert. Of Araco dat doet: uitvragen |
| Orderplaatsing | Geen publieke API gevonden. Dealerwebshop, e-mail, of via Promidata's Promotional Office (ERP). Uitvragen of Araco EDI/API-orders van dealers accepteert |
| Artwork en proof | Onbekend. Waarschijnlijk per e-mail met digitale proof |
| Dropship / neutraal verzenden | Onbekend, uitvragen |
| Minimum afname | Onbekend, per artikel en decoratietechniek. Uitvragen |
| Status / track & trace | Onbekend |

## Profiel voor de hub

Araco is een **catalogus-gedreven groothandel**, hetzelfde profiel als PF Concept. De adapter volgt het PF-patroon (feed-import, staffels, decoratieprijzen, MOQ), met twee verschillen:

- Data komt uit **één Promidata-importer** die ook voor PF Concept kan dienen.
- Orderplaatsing is waarschijnlijk **semi-handmatig** in fase 1: de hub maakt de inkooporder klaar (artikel, aantal, decoratie, artwork, adres) en stuurt die per e-mail of zet hem klaar voor de dealerwebshop. Automatiseren zodra Araco een order-API bevestigt.
- Voor artikelen die wij zelf met DTF bedrukken routeert de hub naar **intern** met Araco als inkoopbron (blanco bestellen op eigen voorraad of per order).

## Wat we nu moeten doen

1. Dealeraccount bij Araco aanvragen of het bestaande Mediasign-account gebruiken. Vragen: order-API of EDI, voorraadfeed, dropship, MOQ, decoratieprijslijst, proofproces.
2. Promidata benaderen voor Promotional Data met in elk geval Araco (A86) en PF Concept. Vraag de feedspecificatie en een proeffeed.
3. Bepalen welke Araco-categorieën we zelf met DTF bedrukken en welke Araco decoreert.

## Bronnen

- Promidata connected member Araco International BV (A86): https://www.promidata.com/connected-member/araco-international-bv-a86-3/
- Promidata Promotional Data (XML/JSON): https://www.promidata.com/nl/promotional-xml-of-json-data/
- Promidata voor leveranciers (voorraadkoppeling): https://www.promidata.com/en/for-suppliers-en/
- Araco International (UK-site en dealershop): https://www.araco.co.uk/ en https://shop.araco.co.uk/taxons/catalog
- eppi Magazine, "Araco International: Specialisation and service" (jan 2024): https://www.eppi-online.com/2024/01/29/araco-international-specialisation-and-service/
- PromoCat leveranciersprofiel: https://promocat.nl/leveranciers/araco-international/
- De Leveranciersdagen: https://thesupplierdays.com/exhibitors/araco-international/
- Araco productcatalogus 2023 (PDF): https://image.araco.nl/Catalogus%202023/Araco_Product_Catalogue_2023_NL_web.pdf
