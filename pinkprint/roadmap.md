# Roadmap pinkprint.com

Inschattingen zijn indicatief en gaan uit van één ontwikkelaar met de bestaande DTF-configurator als basis. Doorlooptijd wordt vooral bepaald door de leveranciers, niet door ons.

## Fase 0: toegang en beslissingen (nu starten, parallel aan alles)

| Actie | Eigenaar | Blokkeert |
|---|---|---|
| Araco: dealeraccount bevestigen en vragen naar order-API/EDI, voorraadfeed, dropship, MOQ, decoratieprijslijst | Stan | Fase 4 |
| Promidata: Promotional Data aanvragen met Araco (A86) en PF Concept, feedspecificatie en proeffeed | Stan, daarna dev | Fase 2 en 4 |
| PF Concept distributeursaccount aanvragen (KvK, btw, omschrijving pinkprint.com) | Stan | Fase 2 en 3 |
| PF Concept API/XML-specialist om Gateway-spec, feeds, dropship-voorwaarden en testomgeving vragen | Stan, daarna dev | Fase 2 en 3 |
| Probo: apart account of apart API-token voor pinkprint.com | Stan | Fase 1 |
| Shopify-store pinkprint.com aanmaken, domein koppelen | Stan | Fase 1 |
| Margebeleid per productgroep vastleggen | Stan | Fase 1 |
| Beslissen: gecureerde PF-selectie voor fase 2 (welke categorieën, hoeveel artikelen) | Stan | Fase 2 |

## Fase 1: Probo live (circa 3 tot 5 weken)

- Supplier Hub opzetten (Remix/Node, Prisma, queue) naast de bestaande DTF-app, adapter-interface uit `architectuur/supplier-adapter.ts`.
- Probo-adapter: catalogussync, `/products/configure` via app proxy, `/price`, `/orders` (eerst `order_type: test`), webhooks.
- Configurator: Probo web component via de hub-proxy in een theme app extension, of onze eigen configurator uitbreiden.
- Uploadflow en preflight hergebruiken uit de DTF-configurator.
- Orderrouting: Shopify webhook, sub-orders, fulfillment per sub-order.
- Resultaat: pinkprint.com verkoopt spandoeken, stickers, vlaggen, plaatmateriaal en textiel, white label geleverd.

## Fase 2: PF Concept catalogus (circa 3 tot 4 weken na feedtoegang)

- Feed-importer: product-XML, print-data-XML, print-price-XML, Label-XML, afbeeldingen.
- Prijstabellen: staffel + decoratie + instelkosten, marge-regels.
- Shopify-producten met varianten (kleur, maat) en decoratiekeuze als line item property.
- MOQ afdwingen in winkelwagen.
- Resultaat: gecureerde selectie relatiegeschenken zichtbaar en bestelbaar, orders nog handmatig bij PF geplaatst vanuit de admin.

## Fase 3: PF Concept orderdoorzetting (circa 2 tot 4 weken, afhankelijk van de Gateway)

- Gateway-adapter: order plaatsen, Logo Express-artwork per printpositie, proof-flow (`awaiting_proof`), status (webhook of polling).
- Dropship: neutrale verzending aan eindklant bevestigd en getest.
- Resultaat: volledig automatische promo-orders.

## Fase 4: Araco textiel (circa 2 tot 3 weken na Promidata-feed)

- Promidata-importer hergebruiken (of bouwen als PF Concept via eigen feeds loopt) voor Araco-artikelen: Nilton's, Sophie Muval, Brickstone, 4YOU.
- Per categorie beslissen: Araco decoreert, of wij bedrukken blanco met DTF via de bestaande configurator (`decoration_route`).
- Orderplaatsing semi-handmatig: hub maakt de inkooporder met artwork klaar, admin verstuurt. Automatiseren zodra Araco een order-API bevestigt.
- Resultaat: caps, handdoeken, werkkleding en shirts bestelbaar, deels met eigen DTF-decoratie en hogere marge.

## Fase 5: uitbouw

- Volledige PF-catalogus per categorie uitrollen op basis van verkoopdata.
- Klantaccounts met herbestellen, artwork-bibliotheek en offertes voor B2B.
- SEO-structuur per productgroep (large format, promo, textiel) en meertaligheid (PF-feeds zijn per taal beschikbaar).

## Beslispunten voor Stan

1. **Shopify of headless?** Advies: Shopify, om dezelfde reden als de DTF-configurator. Wisselen kan later, de hub blijft.
2. **Hoe groot start de PF-catalogus?** Advies: 300 tot 500 artikelen met Logo Express, gekozen op marge en herkenbaarheid.
3. **Eén Probo-account of apart?** Bepaalt facturatie en of Mediasign-marges en Pinkprint-marges gescheiden blijven.
4. **Welk textiel bedrukken we zelf met DTF en welk laat Araco doen?** Bepaalt marge, doorlooptijd en hoeveel blanco voorraad we zelf aanhouden.

## Risico's

| Risico | Impact | Mitigatie |
|---|---|---|
| PF Concept-account of Gateway-toegang blijft uit | Geen promo-assortiment | Promidata-feed als data-alternatief, orders tijdelijk handmatig |
| PF Gateway blijkt XML-only zonder statusterugkoppeling | Meer handwerk in statusbeheer | Polling plus e-mailparsing, werkbak in admin |
| Split-shipments verwarren klanten | Klachten, retouren | Duidelijke communicatie in checkout en per-pakket track & trace |
| Proof-flow bij promo vertraagt orders | Lagere conversie | Proof direct in de klantaccount, herinneringsmails, optie "geen proof nodig" bij herhaalorders |
| Probo-component voldoet niet aan onze UX | Configurator opnieuw bouwen | Vanaf dag 1 achter onze eigen interface plaatsen zodat vervanging lokaal blijft |
| Araco biedt geen order-API | Araco-orders blijven handwerk | Hub bereidt de order volledig voor, admin verstuurt met één klik; volume bepaalt of dit acceptabel blijft |
