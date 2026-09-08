# Doelarchitectuur pinkprint.com: één winkel, meerdere producenten

## Uitgangspunten

1. **Eén productlaag van onszelf.** De klant ziet Pinkprint-producten, nooit "een Probo-spandoek" of "een PF Concept-pen". Leveranciersdata is bronmateriaal, niet de winkel.
2. **Leveranciers zijn adapters.** Alles wat leverancier-specifiek is (auth, feedformaat, orderpayload, statuscodes) leeft in één adapter per leverancier achter dezelfde interface (`architectuur/supplier-adapter.ts`).
3. **Shopify verkoopt, de hub produceert.** De DTF-configurator in deze repo is al een Shopify-app op Remix. pinkprint.com wordt een Shopify-store met dezelfde stack ernaast. Zo hoeven we geen checkout, betalingen, btw en klantaccounts zelf te bouwen.
4. **Eigen productie blijft eigen.** DTF-transfers en wat we zelf drukken lopen via onze bestaande flow. De hub routeert die orders naar "intern" in plaats van naar een leverancier.

## Overzicht

```
[Klant]
   |
   v
[Shopify storefront pinkprint.com]  --- theme app extension: configurator + uploader
   |            ^
   | orders     | producten, prijzen, voorraad, status
   v            |
[Pinkprint Supplier Hub]  (Remix/Node, Postgres via Prisma, job queue, S3)
   |        |          |             |
   v        v          v             v
[Probo]  [PF Concept] [Leverancier 3] [Intern: DTF-configurator]
 REST     XML feeds +   ?              bestaande jobService
          Gateway
```

## Bouwstenen van de hub

### 1. Catalogusimport en productlaag

| Stap | Probo | PF Concept |
|---|---|---|
| Bron | `GET /products` plus configuratieboom via `/products/configure` | Product-XML, Print-data-XML, Print-price-XML, Label-XML, stock/prijs JSON, hires afbeeldingen |
| Frequentie | Dagelijks producten, prijzen live | Dagelijks volledige import, voorraad zo vaak als PF toestaat |
| Naar Shopify | Eén Shopify-product per Pinkprint-product; configuratie-opties niet als varianten maar als line item properties (afmeting, materiaal, afwerking) | Eén Shopify-product per artikel, varianten voor kleur/maat, decoratiekeuze als line item property |
| Metafields | `pinkprint.supplier = probo`, `pinkprint.supplier_sku`, `pinkprint.config_schema` | `pinkprint.supplier = pfconcept`, `pinkprint.supplier_sku`, `pinkprint.moq`, `pinkprint.print_codes[]` |

Waarom geen 6.500 PF-artikelen in één keer: Shopify kan het aan (productaantal is geen limiet, varianten wel: 100 per product in het oude model, 2.000 in het nieuwe), maar de winkel wordt onbeheersbaar en de SEO verdunt. Gecureerde selectie in fase 1, uitbreiden per categorie op basis van vraag.

### 2. Prijzen en marges

- **Probo**: prijs via `POST /price` op het moment van configureren, gecached per `calculation_id`. Marge als percentage per productgroep plus een minimumbedrag per order.
- **PF Concept**: prijs vooraf berekend bij import: artikelstaffel + decoratieprijs per printcode + instelkosten. Opgeslagen als prijstabel per (artikel, aantal, printcode, aantal kleuren). Marge als percentage, met aparte marge op decoratie.
- **Regel**: de hub berekent altijd de verkoopprijs, Shopify toont hem. Bij Probo via een prijs-app-proxy (Shopify App Proxy naar de hub), bij PF via vaste variantprijzen plus een prijs-app-proxy voor de decoratieopslag.
- Verzendkosten: per leverancier, opgeteld als een order uit meerdere leveranciers bestaat. Klant ziet één bedrag, met de melding dat de order in meerdere pakketten kan komen.

### 3. Artwork en preflight

Één uploadflow voor alle leveranciers (onze bestaande `useFileUpload` + S3), daarna leverancier-specifiek:

- **Probo**: preflight op DPI en afmeting tegen de gekozen configuratie, bestand als publieke URL in de orderpayload.
- **PF Concept (Logo Express)**: logo per printpositie, vectorbestand gewenst (PDF/EPS/AI), kleuren tellen voor de printcode. Digitale proof-goedkeuring waarschijnlijk verplicht: de hub houdt de order vast in status `awaiting_proof` tot de klant akkoord geeft. Dit is het grootste UX-verschil met large format en verdient een eigen schermflow.
- **Intern DTF**: bestaande nesting en gang sheet-flow.

### 4. Orderrouting en orkestratie

1. Shopify `orders/create` webhook naar de hub (hebben we al in `webhooks.orders-create.tsx`).
2. Hub splitst de order per `pinkprint.supplier` in **sub-orders**.
3. Per sub-order een job in de queue: valideer artwork, bouw payload, plaats order, sla het leveranciers-ordernummer op.
4. Foutafhandeling: retry met backoff, na N pogingen naar een handmatige werkbak in de admin (zoals `AdminJobsTable`).
5. Sub-orders krijgen eigen fulfillment in Shopify (Fulfillment Orders API), zodat de klant per pakket een track & trace krijgt.

### 5. Statussen

Uniform statusmodel in de hub, gemapt vanuit elke leverancier:

| Pinkprint-status | Probo (webhook/status) | PF Concept (te bevestigen) | Intern |
|---|---|---|---|
| `received` | order aangenomen | ordernummer terug | job aangemaakt |
| `awaiting_proof` | n.v.t. | proof verstuurd | n.v.t. |
| `in_production` | in productie | in productie | aan het printen |
| `shipped` | verzonden + T&T | verzonden + T&T | verzonden |
| `delivered` | afgeleverd | afgeleverd | afgeleverd |
| `on_hold` / `error` | afgekeurd bestand | afwijking / MOQ | preflight-fout |

Probo pusht via webhooks. Voor PF Concept moet blijken of er webhooks zijn; anders pollen we op een interval.

### 6. Datamodel (Prisma, hoofdlijnen)

```
Supplier            id, code (probo|pfconcept|...), config (json), enabled
SupplierProduct     id, supplierId, supplierSku, raw (json), lastSyncedAt
PinkprintProduct    id, shopifyProductId, title, category, marginRule
ProductSource       pinkprintProductId, supplierProductId, priority
PriceTable          supplierProductId, qty, printCode?, colors?, unitCost, setupCost
Order               id, shopifyOrderId, status
SubOrder            id, orderId, supplierId, supplierOrderRef, status, payload (json)
Artwork             id, subOrderId, url, preflight (json), proofStatus
StatusEvent         subOrderId, from, to, source, at
```

## Alternatieven die zijn overwogen

| Optie | Oordeel |
|---|---|
| Volledig headless (eigen Remix-storefront, eigen checkout) | Meer controle over configurator-UX, maar we bouwen checkout, betalingen, btw, accounts en fraudecontrole zelf. Pas overwegen als Shopify aantoonbaar in de weg zit |
| WooCommerce (Probo heeft een officiële plugin) | Snelle Probo-start, maar PF Concept en de derde leverancier moeten alsnog custom, en we verlaten onze Shopify-kennis en de DTF-app |
| Alleen een integratieplatform (PrintXpand Connect, Custom Gateway) | Ze hebben PF Concept al voorgebouwd. Maar het zijn dure platformen gericht op grotere printers, en Probo zit er niet standaard in. Als versneller voor PF Concept eventueel te overwegen, niet als fundament |
| Promidata als PIM voor promo-artikelen | Goede data, geen orderdoorzetting. Plan B voor de catalogusimport van PF Concept en een eventuele tweede promo-leverancier |

## Beveiliging en beheer

- API-tokens uitsluitend server-side in de hub (nooit in het thema of de browser; het Probo-component vereist dat expliciet).
- Aparte leveranciersaccounts voor pinkprint.com, of aparte tokens onder het bestaande Mediasign-account: beslissen voor de eerste order, in verband met facturatie en marges.
- Webhook-endpoints met signature-verificatie (Shopify HMAC; Probo: verifiëren welke methode).
- Loggen van elke leverancierscall met payload en response voor dispuutafhandeling.
