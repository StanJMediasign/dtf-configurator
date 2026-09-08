# Probo: Reseller API

Probo (Dokkum) is de grootste white-label printleverancier voor resellers in de Benelux. Wij kennen deze koppeling al. Dit document legt vast wat pinkprint.com ervan nodig heeft, zodat de andere leveranciers op dezelfde manier beschreven kunnen worden.

## Positie in pinkprint.com

- Productgroepen: plaat (Dibond, foamboard, forex), folie en stickers, doek en spandoek, wandbekleding, papier en posters, textiel, vlaggen, accessoires (ophangsystemen, frames).
- Meer dan 250 materialen en producten, bestelbaar vanaf 1 stuk.
- Levering direct en volledig white label aan de eindklant, veel producten de volgende dag.
- Geen minimale afname, geen instelkosten. Ideaal als "eerste leverancier live".

## Technisch overzicht

| Onderwerp | Detail |
|---|---|
| Documentatie | https://apidocs.proboprints.com/ (reference, guides, examples) |
| Base URL | https://api.proboprints.com |
| Authenticatie | API-token uit de Probo-accountinstellingen, meegestuurd als Basic Authorization header |
| Stijl | REST, JSON |
| Sandbox | Geen aparte testomgeving. Testorders kunnen wel: zet `order_type` op `test`, Probo annuleert ze automatisch bij ontvangst |
| Legacy | "Probo Connect" (XML via POST, developers.probo.nl) wordt uitgefaseerd. Niet meer op bouwen |

## Kernendpoints

| Endpoint | Doel | Gebruik in pinkprint.com |
|---|---|---|
| `GET /products` | Alle beschikbare producten ophalen | Nachtelijke catalogussync naar de hub |
| `POST /products/configure` | Stapsgewijs configureren: elke call geeft de volgende beschikbare opties terug, precies zoals de Probo-webshop. Eindresultaat bevat prijs en een `calculation_id` | Productconfigurator op de productpagina |
| `POST /price` | Prijs van één of meer producten voor aantal, afmeting, afleveradres, leverdatum en verzendmethode | Live prijs in winkelwagen en checkout |
| `POST /orders` | Order plaatsen, `order_type` `test` of `production` | Orderdoorzetting na betaling |
| `POST /drafts` | "Saved cart" aanmaken die later via een Probo-webshop tot order wordt gemaakt | Niet nodig voor pinkprint, wel handig voor handmatige afhandeling |
| `GET /order/status` | Status opvragen | Fallback naast webhooks |
| Webhooks (status callback) | Probo pusht statuswijzigingen naar een URL van ons | Statussync naar Shopify en klantmail |

## Artwork

Drie manieren om bestanden aan een API-order te hangen:

1. **Direct files**: publiek bereikbare URL naar het printbestand. Onze bestaande S3-uploadflow uit de DTF-configurator past hier direct op.
2. **White label uploader**: Probo's eigen uploadcomponent in onze huisstijl.
3. **Motiflow files**: bestanden uit Probo's online editor.

Aanbeveling: optie 1, met onze eigen preflight (DPI, afmeting, bleed) voor het bestand naar Probo gaat. Zo blijft de klantervaring van pinkprint.com onafhankelijk van Probo's tooling.

## Configurator-component

Probo publiceert een open source web component (`ProboConnect/product-configurator`, laden via jsDelivr CDN) die `/products/configure` in een UI verpakt.

- Events: `connectConfigurator:started`, `option-selected`, `finished`, `recalculated`.
- `window.connectConfigurator.getResult()` geeft de payload (productcode, gekozen opties, taal) die je in de orderpayload stopt.
- Vereist een **backend proxy**: het token mag nooit in de browser staan. Onze hub is die proxy.

Voor pinkprint.com is dit een snelle start voor de Probo-producten. Op termijn vervang je hem door een eigen configurator zodat PF Concept en de derde leverancier dezelfde UI krijgen.

## Kant-en-klare koppelingen (ter referentie)

- Probo Connect for WooCommerce (officiële plugin). Niet relevant als we op Shopify bouwen, wel een goede referentie voor de orderflow.
- Gripp bedrijfssoftware heeft een Probo-koppeling.

## Wat we nog moeten regelen

- API-token aanmaken op het Pinkprint Probo-account (los van het Mediasign-account, of één account met aparte tokens: beslissen).
- Webhook-URL registreren en het statusmodel van Probo mappen op onze eigen orderstatussen (zie `../architectuur.md`).
- Vaststellen welke productgroepen in fase 1 meegaan.

## Bronnen

- https://apidocs.proboprints.com/getting-started/what-is-the-probo-api
- https://apidocs.proboprints.com/getting-started/sandbox-test-env
- https://apidocs.proboprints.com/guides/order-status
- https://apidocs.proboprints.com/examples/order en https://apidocs.proboprints.com/examples/price
- https://apidocs.proboprints.com/reference/probo
- https://github.com/ProboConnect/product-configurator
- https://www.probo.nl/api en https://www.probo.nl/materialen
- http://developers.probo.nl/ (legacy Probo Connect, uitgefaseerd)
