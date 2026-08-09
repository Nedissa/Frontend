@AGENTS.md

## Filstädning (public/assets, public/icons)
Radera ALDRIG en hel mapp med `rm -rf` baserat på en audit-lista — radera filer en och en efter att ha grep:at varje filnamn i `app/`. Mappar kan innehålla en blandning av använda och oanvända filer (t.ex. `icons/categories/` hade 7 använda PNG:er bland 30 SVG:er). Verifiera i browser efter radering.

## Projektsidan (tjanster/projekt/[slug])
Byggd med Tailwind-klasser direkt i JSX (inte inline styles, inte separat CSS-fil). Varje sektion är en egen `<section>` som spänner full bredd, med en inre `<div className="max-w-[1440px] mx-auto px-12">` för innehållet — mönster att följa för nya tjanster-sidor.
