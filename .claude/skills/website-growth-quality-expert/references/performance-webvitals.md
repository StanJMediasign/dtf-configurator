# Performance en Core Web Vitals

## Meet velddata voordat je labdata gelooft

- **Velddata (RUM)**: wat echte bezoekers ervaren, via CrUX, Search Console of een eigen RUM-oplossing. Dit is de norm waarop Google en je klanten oordelen.
- **Labdata**: Lighthouse, PageSpeed Insights, WebPageTest. Nuttig om oorzaken te vinden en fixes te verifiëren, niet om de werkelijkheid te beschrijven.

Een Lighthouse-score is een diagnostisch hulpmiddel, geen doel. Optimaliseer de metric, niet het cijfer. Rapporteer velddata op het 75e percentiel, gesplitst naar mobiel en desktop.

## De drie Core Web Vitals

| Metric | Meet | Goed | Slecht boven |
|---|---|---|---|
| LCP (Largest Contentful Paint) | laadervaring | ≤ 2,5 s | 4,0 s |
| INP (Interaction to Next Paint) | responsiviteit | ≤ 200 ms | 500 ms |
| CLS (Cumulative Layout Shift) | visuele stabiliteit | ≤ 0,1 | 0,25 |

INP verving FID in maart 2024 en meet alle interacties gedurende de sessie, niet alleen de eerste. Ondersteunende diagnostiek: TTFB, First Contentful Paint, Total Blocking Time en de LCP-subonderdelen (TTFB, resource load delay, resource load duration, element render delay).

## LCP verbeteren

1. Bepaal welk element de LCP is. Meestal een hero-afbeelding, een grote koptekst of een videoposter.
2. Verkort TTFB: caching, CDN, snellere server-rendering, minder redirects, geen keten van omleidingen.
3. Verwijder render-blocking CSS en JavaScript in de `<head>`. Inline alleen wat echt kritiek is.
4. Ontdek de LCP-resource vroeg: `fetchpriority="high"` op de LCP-afbeelding, `preload` waar nodig, en géén `loading="lazy"` op een afbeelding boven de vouw.
5. Serveer moderne formaten (AVIF, WebP), met correcte `srcset`/`sizes` en juiste afmetingen. Een 4000px-afbeelding op een 400px-viewport is verspilling.
6. Laat webfonts de tekst niet blokkeren: `font-display: swap` of `optional`, preload alleen het daadwerkelijk gebruikte bestand, en beperk het aantal gewichten.

## INP verbeteren

- Zoek lange taken op de main thread. Alles boven 50 ms blokkeert reactie op invoer.
- Splits zwaar werk op met `await scheduler.yield()`, `scheduler.postTask()` of, als fallback, opdelen over meerdere frames.
- Verplaats zware berekeningen naar een Web Worker.
- Beperk hydration-kosten: hydrateer alleen interactieve delen, laad zware componenten pas bij interactie of zichtbaarheid.
- Geef binnen 100 ms visuele feedback op een klik, ook als het echte werk langer duurt.
- Ruim third-party scripts op: tagmanagers, chatwidgets, A/B-tools, heatmaps en trackers zijn vaak de grootste INP-veroorzakers. Laad ze uitgesteld of verwijder ze.

## CLS verbeteren

- Reserveer ruimte: `width` en `height` of `aspect-ratio` op alle afbeeldingen, video's, iframes en advertenties.
- Injecteer nooit content boven bestaande content na het laden. Cookiebanners, meldingen en promobalken horen ruimte te reserveren of te overlappen.
- Voorkom fontwissels die de layout verspringen: kies fallbacks met vergelijkbare metrics of gebruik `size-adjust`.
- Gebruik `transform` in plaats van layout-eigenschappen voor animaties.

## Werkwijze en budgetten

1. Meet de huidige waarden per sjabloontype (home, categorie, detail, configurator, checkout), niet één keer voor de hele site.
2. Zoek de grootste veroorzakers: netwerk-waterval, JavaScript-bundle, third parties, afbeeldingen, server-tijd.
3. Fix in volgorde van gebruikersimpact, niet van implementatiegemak.
4. Meet dezelfde pagina opnieuw onder gelijke omstandigheden en toon voor/na.

Leg een performancebudget vast dat in CI wordt bewaakt: bijvoorbeeld maximaal JavaScript-gewicht per pagina, maximaal aantal third-party verzoeken en drempelwaarden voor LCP en INP. Zonder bewaking loopt de site binnen enkele maanden weer vol.

## Regels die tijd besparen

- Third-party scripts zijn bijna altijd de grootste winst en de minst omstreden verwijdering. Inventariseer wie de eigenaar is en wat elk script oplevert.
- Meet altijd op een realistisch apparaat en netwerk. Een moderne laptop op glasvezel verbergt de problemen van je werkelijke publiek.
- Snelheidswinst is pas echt als velddata na enkele weken meebeweegt. Claim resultaat niet op basis van labdata alleen.
