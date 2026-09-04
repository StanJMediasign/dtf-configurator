# Prioritering en rapportage

## Prioriteer expliciet

Scoor iedere aanbeveling op drie assen en maak de score zichtbaar:

- **Impact**: hoeveel gebruikers raakt het, in welke funnelstap, met welke geschatte waarde;
- **Zekerheid**: gemeten, waargenomen, aanname of advies, en hoe sterk het bewijs is;
- **Inspanning**: uren, benodigde rollen, afhankelijkheden en risico op neveneffecten.

Zet vervolgens in drie horizons:

1. **Nu**: blokkades en fixes met hoge zekerheid en lage inspanning. Vandaag of deze sprint.
2. **Binnenkort**: aanpassingen met echte impact die ontwikkelwerk of een test vereisen.
3. **Later**: structurele verbeteringen, herbouw, of ideeën die eerst validatie nodig hebben.

Als alles prioriteit heeft, heeft niets prioriteit. Noem maximaal drie dingen als "nu".

## Reken eerlijk

Werk waar mogelijk met een orde van grootte in plaats van suggestieve precisie:

> Deze stap verliest ongeveer 1.200 van de 4.000 mobiele bezoekers per maand. Bij een conversieratio van 2% en een gemiddelde orderwaarde van €X is de bovengrens van het effect ongeveer €Y per maand. Dat is de maximale winst als de frictie volledig verdwijnt; reken op een deel daarvan.

Gebruik altijd de data van de klant. Ontbreekt die, benoem dan expliciet dat het een rekenvoorbeeld is met aannames en welke cijfers nodig zijn om het hard te maken. Verzin geen benchmarks en presenteer een branchegemiddelde nooit als voorspelling voor deze site.

## Meetplan bij elke aanbeveling

Leg per doorgevoerde wijziging vast:

- welke metric moet bewegen, en in welke richting;
- welke tegenmetric bewaakt of je niets kapotmaakt (orderwaarde, retouren, supportvragen, leadkwaliteit);
- wanneer je meet en over welke periode;
- wat je doet als het effect uitblijft of negatief is.

Een wijziging zonder tegenmetric en zonder terugvalplan is geen verbetering maar een gok. Voor de implementatie van events, conversies en dashboards: gebruik `seo-ga4-expert`.

## Rapportagevorm

Begin met een korte samenvatting die ook zonder de rest leesbaar is: wat is onderzocht, wat zijn de drie belangrijkste conclusies, en wat moet er nu gebeuren.

Geef daarna per bevinding, in vaste volgorde:

1. wat je zag, met vindplaats (URL, apparaat, stap) en bewijs;
2. wie het raakt en hoeveel;
3. waarom het gebeurt;
4. wat de concrete oplossing is, uitvoerbaar binnen dit platform;
5. hoe je verifieert dat het is opgelost.

Sluit af met wat goed werkt en behouden moet blijven, de aannames, en de niet-onderzochte gebieden.

## Toon

Schrijf voor de persoon die het moet uitvoeren of goedkeuren, niet voor een vakgenoot. Vermijd jargon zonder uitleg. Zeg wat je zou doen als het jouw site was, en zeg het ook als het eerlijke antwoord "hier is te weinig data voor" is. Verpak een aanname nooit als bevinding om het rapport overtuigender te laten lijken.
