# Toegankelijkheid en bruikbaarheid

## Norm en verplichting

WCAG 2.2 niveau AA is de gangbare doelnorm. In de EU stelt de European Accessibility Act sinds 28 juni 2025 eisen aan onder meer webshops, bankieren, vervoer en e-books van veel commerciële partijen; in Nederland en andere lidstaten gelden daarnaast eigen implementatiewetten en voor overheden aanvullende verplichtingen. Controleer per opdracht welk regime geldt en welke uitzonderingen van toepassing zijn, en presenteer een audit nooit als juridische compliance-verklaring.

Automatische tools vinden ongeveer een derde van de problemen. Handmatige controle met toetsenbord en schermlezer is niet optioneel.

## Snelle handmatige controle

1. **Toetsenbord**: navigeer de hele belangrijkste reis met alleen Tab, Shift+Tab, Enter, Spatie en pijltjes. Alles bereikbaar? Focus altijd zichtbaar? Logische volgorde? Nergens een focus-val?
2. **Zoom**: zet de browser op 200% en bekijk daarna 320px breed. Blijft alles leesbaar en bedienbaar zonder horizontaal scrollen?
3. **Contrast**: tekst minimaal 4,5:1, grote tekst 3:1, en interface-onderdelen en focusindicatoren 3:1.
4. **Alleen kleur**: is elke betekenis ook zonder kleur af te lezen? Foutvelden, statussen, links in lopende tekst.
5. **Schermlezer**: doorloop formulier en checkout met VoiceOver, NVDA of TalkBack. Worden labels, fouten en statuswijzigingen aangekondigd?
6. **Beweging**: respecteert de site `prefers-reduced-motion`? Kan autoplay worden gestopt?

## Terugkerende fouten

- Afbeeldingen zonder zinvolle alt-tekst, of decoratieve afbeeldingen die niet als decoratief zijn gemarkeerd.
- Knoppen die eigenlijk `div`'s zijn: geen rol, geen toetsenbordbediening, geen focus.
- Formuliervelden zonder gekoppeld `<label>`, met alleen een placeholder als label.
- Foutmeldingen die alleen visueel verschijnen, zonder koppeling aan het veld en zonder aankondiging.
- Verwijderde of onzichtbare focus-outline.
- Modals die de focus niet vasthouden en niet met Escape sluiten.
- Ontbrekende paginatitel per route, ontbrekende `lang`, en een koppenstructuur die op stijl in plaats van hiërarchie is gebaseerd.
- Klikdoelen kleiner dan ongeveer 24x24 CSS-pixels of te dicht op elkaar (WCAG 2.2 Target Size).
- ARIA die native HTML overschrijft. Gebruik eerst het juiste element. Verkeerde ARIA is slechter dan geen ARIA.

## Formulieren en invoer

- Label boven het veld, zichtbaar blijvend tijdens het invullen.
- Juiste `type`, `inputmode` en `autocomplete`, zodat mobiel het juiste toetsenbord en autofill geeft.
- Valideer op blur en bij verzenden, niet bij elke toetsaanslag. Toon de fout naast het veld, in tekst, met concrete instructie.
- Behoud ingevulde gegevens na een fout. Gegevens wissen bij een fout is een van de duurste bugs die er zijn.
- Maak duidelijk welke velden optioneel zijn in plaats van alles met een asterisk te verplichten.
- Voorkom dubbele verzending en toon zichtbare voortgang bij trage acties.

## Bruikbaarheid die conversie raakt

- Toon de belangrijkste actie zonder scrollen op een gemiddelde telefoon, met voldoende tikruimte.
- Gebruik de woorden van de klant, niet interne productnamen. Vervang jargon door wat de gebruiker zelf zou zoeken.
- Maak wachttijd draaglijk: skeletten, voortgang, en meteen bevestiging na een actie.
- Toon totale kosten, levertijd en voorwaarden vóór het punt waarop de gebruiker zich moet committeren.
- Bied altijd een uitweg: annuleren, terug, wijzigen, en een zichtbare route naar hulp.
- Ontwerp lege staten, foutpagina's en offline gedrag bewust. Ze komen vaker voor dan iemand aanneemt.

Toegankelijkheidsfixes verbeteren bijna altijd ook conversie en robuustheid. Presenteer ze als kwaliteit, niet als compliance-kosten.
