---
title: Jak szybko i bezpiecznie dodać Google Fonts do projektu – ekspresowe wdrożenie fontów z Fontsource
description: Fonty open-source są super i warto z nich korzystać. Pokazuję jak zrobić to w szybki i bezpieczny sposób.
publishDate: "2024-01-01"
tags:
  - google-fonts
  - open-source
  - fonts
  - fontsource
  - npm
  - astrojs
ogImage: /assets/images/blocks-font-orange.png
draft: false
---

## Google Fonts są spoko (i inne open-source też)

Wiadomo, customowy font często robi różnicę i podnosi jakość strony o kilka poziomów.

Dodatkowo, wykorzystywanie do porzygu popularnych krojów jak Poppins czy Montserrat, skutecznie pomaga wyleczyć się z Google Fonts przynajmniej na jakiś czas.

Mimo to, fonty open-source, gdzie na czele stoi biblioteka Google'a, wciąż oferują świetne pozycje, idealne do prototypowania i MVP, a także często wykorzystywane na stronach produkcyjnych.

> Tomek Biskup (spoko kolo, głównie od tematów designowych) ma [tutaj](https://www.youtube.com/watch?v=Zv7N3wHLvmc&t=10s) swoją krótką listę ulubionych fontów od Google

W dobie nowoczesnego JS-a podpinanie np. Google Fonts robi się z palcem w nosie.

Zobacz!

## Spis treści
## Fontsource, czyli Dzierżyciel Fontów

(czytam ostatnio po raz któryś trylogie [Wspomnienie o przeszłości Ziemi](https://lubimyczytac.pl/cykl/13580/wspomnienie-o-przeszlosci-ziemi) i jestem właśnie na fragmencie, gdzie wprowadzony jest koncept Dzierżyciela Miecza, więc taki mały follow up – polecam, [Cixin Liu](https://lubimyczytac.pl/autor/106322/cixin-liu) koks)

[Fontsource](https://fontsource.org/) to platforma agregująca fonty open-source, która umożliwia instalację fontów na trzy sposoby:
1. przez pobranie paczki
2. przez CDN
3. przez `npm`

Mnie interesuje w zasadzie tylko 3 punkt.

### Dlaczego Fontsource

Fontsource w łatwy i szybki sposób umożliwia self-hostowanie fontów, co jest podstawowym [zabiegiem optymalizacyjnym, pozytywnie wpływającym na cyfrowe bebechy strony/apki](https://github.com/HTTPArchive/almanac.httparchive.org/pull/607).

Poza tym, w dobie coraz bardziej upierdliwych wytycznych RODO (piszę upierdliwych, bo o ile trzymam kciuki za ochronę prywatności, to w praktyce sprowadza się to na razie do zasypywania stron coraz większą ilością coraz bardziej inwazyjnych popupów), self-hostowane fonty to podstawa – [w 2022 Niemiecki sąd nałożył karę 100 euro za podpięcie fontów z Google Fonts](https://thehackernews.com/2022/01/german-court-rules-websites-embedding.html) przez ich bezpośrednie podlinkowanie, co umożliwia Googlowi [trackowanie np. adresu IP użytkownika strony](https://developers.google.com/fonts/faq/privacy?hl=pl).

Dlaczego jeszcze Fontsource jest spoko?

- dzięki wdrożeniu przez `npm` generalnie nie muszę przejmować się regułami `@font-face`, wystarczy zaimportować (sprawdź niżej) i tyle
- łatwe wersjonowanie fontów – fonty podlegają aktualizacjom, nad czym być może chcesz mieć kontrolę. Dzięki instalowaniu przez `npm` zarządzasz fontem jak każdą inną paczką, więc masz pełną swobodę w decydowaniu kiedy (i czy w ogóle) wykonać aktualizację
- Fontsource ma w swojej kolekcji różne pozycje open-source, nie tylko Google Fonts

---

## Instalacja Fontów

Dłubię ostatnio przy [blogu o pieskach](https://filipchrapek.pl/wpisy/projekt-na-boczku-002-podstawowa-konfiguracja/) i chcę dodać do projektu Playfair Display oraz Inter (przynajmniej na razie).

Zoba jakie to proste:

```sh
npm install @fontsource-variable/playfair-display
npm install @fontsource-variable/inter
```

Fonty, z których korzystam występują w wersji variable ([tutaj](https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts) więcej o tym, czym są *variable fonts*), dlatego wystarczy, że po instalacji zaimportuję je w taki sposób:

```js
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/inter';
```

Gdybym nie korzystał z *variable fonts*, to musiałbym dodać każdą wagę, którą chcę wykorzystać:

```js
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';
```

Potem wystarczy dodać odpowiednią regułę (tam gdzie trzeba) i gotowe.

```css
body {
	font-family: "Inter", sans-serif;
}
```
