# PF Concept: datafeeds en order-Gateway

PF Concept (Roelofarendsveen, onderdeel van Polyconcept) is de grootste distributeur van promotieartikelen in Europa: 6.500+ artikelen, levering in 90+ landen, B2B2B via circa 10.000 wederverkopers. Voor pinkprint.com is dit de leverancier voor relatiegeschenken, bedrukte kleding en promotieartikelen.

## Belangrijkste conclusie

PF Concept heeft **wel** een integratie (datafeeds plus een order-Gateway), maar:

- Levering is uitsluitend aan geregistreerde distributeurs. Eerst een account, daarna pas toegang tot feeds en Gateway.
- De technische documentatie van de Gateway staat niet publiek. Publiek vindbaar is de "System Integration Manual" v1.6 uit 2015 (via een Poolse reseller-site) en beschrijvingen bij integratieplatformen. De actuele specificatie moet bij PF Concept's API/XML-specialist opgevraagd worden.
- Onderstaande details zijn dus **onbevestigd voor 2026** en moeten na accountaanvraag geverifieerd worden.

## Assortiment (Product Worlds)

| Merk | Segment |
|---|---|
| Bullet | Value, grote volumes, lage prijs |
| Avenue | Gifts, premium relatiegeschenken |
| Label | Apparel, kleding en textiel (aparte XML-feed) |
| WorldSource | Bespoke, maatwerk vanuit Azië |
| Tekiō | Tech-accessoires (sub-merk) |
| Logo Express | Gecentraliseerde decoratie: blanco artikel, bedrukking en verzending in één inkooporder |

Voor pinkprint.com is **Logo Express** de sleutel: één order bij PF Concept levert een bedrukt product. Zonder Logo Express zouden we blanco goederen moeten laten komen en zelf bedrukken (mogelijk voor textiel via onze DTF-lijn, niet voor pennen, mokken, powerbanks).

## Datafeeds (wat publiek bekend is)

| Feed | Inhoud | Opmerking |
|---|---|---|
| Product info XML (per taal) | Artikelen, specificaties, kleuren, varianten, afbeeldingsnamen, decoratiemogelijkheden per artikel ("DecoCharge") | Portal: `www.pfconcept.com/portal/datafeed/` met taalextensie |
| Print data XML | Welke printtechnieken en posities per artikel, met printcodes | Printcode = letters voor techniek (bijv. `MR` zeefdruk, `PAD01` tampondruk) gevolgd door cijfers voor "snelheid"/variant |
| Print price XML | Prijs per printcode, per aantal, per snelheid en per aantal kleuren | Hier zit de decoratieprijs en de instelkosten |
| Label items XML | Aparte feed voor de kleding (Label) | Andere structuur (maten, kleuren) |
| Stock / prijzen | XML/JSON met voorraadposities en prijzen | Bronnen noemen XML/JSON, frequentie onbekend. Via integratieplatformen wordt "real-time voorraad" genoemd |
| Afbeeldingen | Hires per artikel via `www.pfconcept.com/portal/prodimage/hires/<bestandsnaam>` of als set downloadbaar | Bestandsnaam komt uit de product-XML |

## Order-Gateway

- PF Concept noemt het de "Gateway (API)" waarmee orders automatisch geplaatst worden.
- Integratieplatformen (PrintXpand Connect, Custom Gateway) bieden een voorgebouwde connector met real-time voorraad, automatische inkooporders en Logo Express-decoratie, en noemen REST en GraphQL. Dat kan de laag van het platform zijn en niet van PF Concept zelf: verifiëren.
- Contactpersoon voor alle API/XML-integraties is de "API/XML data specialist" van PF Concept, die klanten adviseert en begeleidt bij implementatie.

Wat we **niet** weten en moeten uitvragen:

1. Exacte Gateway-endpoints, formaat (XML of JSON), authenticatie.
2. Hoe artwork voor Logo Express wordt aangeleverd (URL, upload, per printpositie) en hoe proefgoedkeuring (digitale proof) verloopt.
3. Statusterugkoppeling: webhook, polling of alleen e-mail.
4. Dropship-mogelijkheden: neutraal verzenden aan de eindklant, verpakking zonder PF-branding, kosten.
5. Voorraad-endpoint en verversfrequentie.
6. Minimale afname per artikel en bij decoratie.

## Prijsmodel en de gevolgen voor de winkel

Prijs eindklant = artikelprijs(staffel, aantal) + decoratieprijs(printcode, aantal, kleuren) + instelkosten(printcode) + verzending + onze marge.

Dit is **vooraf berekenbaar** uit de feeds. Anders dan bij Probo hoeft er geen live API-call bij elke prijsweergave. Wel moeten de staffels en decoratieopties per artikel in ons eigen datamodel landen (zie `../architectuur.md`).

Let op: promotieartikelen hebben doorgaans een minimum aantal, zeker met bedrukking. pinkprint.com moet dat minimum per artikel tonen en afdwingen, anders komen orders bij PF Concept in de uitzonderingenbak.

## Alternatief: data via een aggregator

Als de eigen feedkoppeling te veel tijd kost of het account uitblijft, is er een tussenweg:

- **Promidata "Promotional Data"**: XML- of JSON-feed / webservice met 80.000+ geconfigureerde producten van 150+ leveranciers (PF Concept, Midocean, XD Connects, Toppoint). Dagelijkse updates. Basic-abonnement: max 10 leveranciers, Premium: onbeperkt. Prijzen op aanvraag.
- Voordeel: één datastructuur voor meerdere promo-leveranciers, en Araco (code A86) zit er ook in, dus één importer voor beide.
- Nadeel: extra abonnement, en orders moeten alsnog naar PF Concept zelf (Promidata levert data, geen orderdoorzetting, tenzij in combinatie met hun Promotional Office ERP).

Aanbeveling: eigen feedkoppeling als hoofdroute, Promidata als plan B of als versneller voor de catalogusimport.

## Wat we nu moeten doen

1. Distributeursaccount aanvragen bij PF Concept (met KvK, btw-nummer, beschrijving van pinkprint.com als reseller-webshop).
2. Direct daarna contact met de API/XML-specialist: vraag de actuele System Integration Manual, Gateway-spec, testomgeving en dropship-voorwaarden.
3. Feed downloaden en in de hub laden om het datamodel te valideren (aantal artikelen, varianten, printcodes).

## Bronnen

- https://www.pfconcept.com/en_nl/xml_specialist
- https://www.pfconcept.com/en_nl/sales-marketing-support
- https://www.pfconcept.com/en_nl/catalogue-features
- https://eklektika.pl/wp-content/uploads/2017/03/CSI_manual_1.6.pdf (System Integration Manual v1.6, 2015)
- https://www.printxpand.com/px-connect/suppliers/pf-concept/
- https://www.custom-gateway.com/supplier-product-feeds/pf-concept/
- https://www.promidata.com/nl/promotional-xml-of-json-data/
- https://topofminds.com/en/pf-concept/ (bedrijfsprofiel, B2B2B, 10.000 resellers)
