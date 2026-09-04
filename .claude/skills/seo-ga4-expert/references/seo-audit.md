# Technische SEO-audit

## Werk in deze volgorde

Een pagina moet achtereenvolgens vindbaar, indexeerbaar, renderbaar, relevant en beter dan de concurrent zijn. Een probleem hogerop maakt alles eronder zinloos. Begin dus nooit met contentadvies als de pagina niet geïndexeerd kan worden.

1. Crawlbaarheid: kan een bot de pagina bereiken?
2. Indexeerbaarheid: mag en kan de pagina in de index?
3. Rendering: ziet de bot dezelfde inhoud als de gebruiker?
4. Relevantie: beantwoordt de pagina de zoekopdracht?
5. Concurrentie: is er een reden om deze pagina te verkiezen?

## Verzamel eerst de data

- **Search Console**: rapport Pagina-indexering (per reden uitgesplitst), Prestaties (kliks, vertoningen, positie per query en per pagina), Sitemaps, URL-inspectie voor individuele gevallen, en de rapporten voor structured data en Core Web Vitals.
- **Crawl**: een volledige crawl van het domein met een crawler naar keuze, zowel met JavaScript-rendering aan als uit. Het verschil tussen die twee crawls is vaak de belangrijkste vondst.
- **Live inspectie**: bekijk de gerenderde HTML, de response headers en het gedrag zonder JavaScript.
- **Logfiles**, indien beschikbaar: waar besteedt Googlebot werkelijk tijd aan, en welke pagina's worden nooit bezocht.

Vergelijk altijd wat de crawler ziet met wat Search Console rapporteert. Verschillen wijzen op rendering-, canonical- of toegangsproblemen.

## Crawlbaarheid

- `robots.txt`: blokkeer geen CSS, JavaScript of afbeeldingen die nodig zijn om de pagina te renderen. Controleer of er geen hele mappen per ongeluk dicht staan na een migratie.
- XML-sitemap: bevat uitsluitend indexeerbare, canonieke URL's met status 200. Geen redirects, geen noindex, geen 404's. Verwijzing opgenomen in `robots.txt`.
- Interne linkdiepte: belangrijke pagina's binnen drie klikken vanaf de homepage.
- Weespagina's: URL's in de sitemap of in Analytics die nergens intern naartoe gelinkt worden.
- Crawlverspilling: filter- en sorteer-URL's, oneindige agenda's, zoekresultaatpagina's en sessieparameters die duizenden waardeloze varianten genereren.

## Indexeerbaarheid

- `noindex` op pagina's die wél gevonden moeten worden. Controleer dit expliciet na elke livegang: een vergeten staging-instelling is de duurste en meest voorkomende fout.
- Canonical: elke pagina wijst naar zichzelf, tenzij er een bewuste reden is. Controleer op canonicals naar redirects, naar 404's, naar een andere taalversie, of naar http terwijl de site https is.
- Duplicaten: www versus non-www, http versus https, met en zonder trailing slash, hoofdlettervarianten, en parameter-URL's. Kies één versie en redirect de rest.
- Dunne of bijna identieke pagina's: locatievarianten zonder unieke inhoud, gefilterde categorieën, auteur- en tagarchieven.
- Paginering: laat pagina 2 en verder indexeerbaar en intern gelinkt, met zelfverwijzende canonicals. Canonicaliseer ze niet naar pagina 1.
- Soft 404's: pagina's die "niet gevonden" tonen maar status 200 teruggeven.

## Rendering

Vergelijk de HTML-bron met de gerenderde DOM. Let op inhoud die alleen na JavaScript verschijnt: productgegevens, prijzen, reviews, interne links, canonical of hreflang die client-side worden gezet.

- Belangrijke inhoud en interne links horen in de initiële HTML te staan.
- Links moeten `<a href>` zijn. Een `onclick` op een `div` is voor een crawler geen link.
- Content achter interactie (tabs, accordeons) wordt geïndexeerd zolang het in de DOM staat. Content die pas na een klik wordt opgehaald, niet.
- Oneindig scrollen zonder gepagineerde URL's maakt alles voorbij de eerste lading onvindbaar.

## Statuscodes en redirects

- Ketens en lussen opruimen: elke redirect kost tijd en signaalverlies. Verwijs direct naar de eindbestemming.
- Gebruik 301 voor permanent en 302 alleen voor werkelijk tijdelijk. Controleer wat het platform standaard doet.
- Interne links horen rechtstreeks naar de eindbestemming te wijzen, niet naar een redirect.
- Verwijderde inhoud: 410 wanneer die definitief weg is, 301 wanneer er een relevante opvolger bestaat. Redirect niet alles naar de homepage; dat wordt als soft 404 behandeld.

## Kannibalisatie

Filter het Prestaties-rapport op één query en kijk welke URL's over de tijd wisselen. Wisselende URL's op dezelfde query betekenen dat Google niet kan bepalen welke pagina het antwoord is. Kies één doelpagina, versterk die met interne links, en consolideer of differentieer de rest.

## Structured data en hreflang

- Valideer schema met de Rich Results Test en volg de rapportages in Search Console. Markeer alleen wat zichtbaar op de pagina staat.
- Hreflang: wederkerig (elke versie verwijst naar alle andere én naar zichzelf), correcte taal- en landcodes, absolute URL's, en verwijzend naar indexeerbare pagina's. Voeg `x-default` toe voor de selectie- of fallbackpagina. Hreflang verwijzend naar een geredirecte of gecanonicaliseerde URL wordt genegeerd.

## Migratie

Bij een domein-, platform- of structuurwijziging: leg vooraf alle bestaande URL's met verkeer en links vast, maak een complete redirectmapping oud naar nieuw, behoud titels, koppen en inhoud waar mogelijk, en houd na livegang dagelijks de indexering, statuscodes en het Prestaties-rapport in de gaten. Verwacht een tijdelijke daling en spreek vooraf af wanneer je ingrijpt.

## Snelheid en Core Web Vitals

Behandel het Core Web Vitals-rapport in Search Console als signaal, niet als het werk zelf. Voor diagnose en oplossing: gebruik de skill `website-growth-quality-expert`, referentie `performance-webvitals.md`.

## Rapporteren

Prioriteer op verkeer en omzet die de bevinding raakt, vermenigvuldigd met de zekerheid dat de fix helpt, gedeeld door de inspanning. Geef per bevinding: waar je het zag, hoeveel URL's het betreft, wat het kost, wat de fix is, en hoe je na oplevering controleert dat het is opgelost.

Gebruik geen samengestelde "SEO-score" als resultaat. Beloof geen positie, geen tijdlijn en geen verkeersgroei als gevolg van een technische fix. Benoem wat je niet hebt kunnen controleren.
