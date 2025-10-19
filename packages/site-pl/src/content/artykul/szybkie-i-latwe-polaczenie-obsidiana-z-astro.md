---
title: Astro + Obsidian, czyli jak ogarnąć szybki i raczej prosty setup pod blogowanie
description: Astro jest super. Obsidian jest super. Astro + Obsidian = 2x super. Co?
publishDate: "2025-05-11"
tags:
  - astro
  - obsidian
  - blogowanie
  - markdown
ogImage: /assets/images/placeholder.webp
draft: false
---

## Dlaczego Astro i Obsidian są dobre jak Asterix i Obelix

Ja wiem, kiedy słyszysz o kolejnym rewolucyjnym frameworku hulającym na JavaScripcie, masz ochotę strzelić do siebie z łuku. Ale słuchaj, jeśli jeszcze nie miałeś okazji sprawdzić Astro, to daj mu szansę!

Na potrzeby tego wpisu wystarczy nam jedynie informacja, że Astro jest świetne w dostarczaniu wzorowo zoptymalizowanych produktów cyfrowych (oh ą ę, lepiej brzmi niż *stronki internetowe*, no co) z obsługą formatu Markdown *out of the box*.

Krótko – jak chcesz tworzyć content pisany w necie (w Markdownie), to sprawdź Astro.

A jak chcesz pisać, ale niekoniecznie w necie, to używasz Obsidiana – proste.

Czym jest Obsidian i dlaczego jest super, piszę tutaj. Na teraz wystarczy Ci informacja, że w swojej bazowej wersji jest to tylko i aż świetny klient do plików w formacie Markdown.

Piszę *w bazowej wersji*, bo naturalnie jest pierdyliard różnych wtyczek i możesz sobie zrobić drugie Notion, jak chcesz. No ale po co.

## Problem albo i nieproblem

W zasadzie jeśli nie przeszkadza Ci pisanie tekstu z poziomu edytora kodu, to możesz zamknąć przeglądarkę, wyłączyć kompa, [wziąć sok żurawinowy i odjechać na deskorolce w stronę zachodzącego słońca](https://www.youtube.com/watch?v=NVGN7r1aAY0).

Ale jeśli tak bardzo kochasz prostotę i wygodę Obsidiana, jak ja, i chciałbyś oszczędzić sobie ręcznego kopiowania tekstu do projektu Astro, to zapraszam do krótkiej, acz treściwej lektury.

## Dostań się do Astro przez Obsidiana

Najprostszym sposobem, żeby zacząć pracować z treścią w projekcie Astro z poziomu Obsidiana, jest po prostu utworzenie nowego Vaulta (celowo nie rozpisuję się na temat podstaw Obsidiana, wierzę, że ogarniesz sam) i jako lokalizację wskazanie folderu `content` z projektu Astro.

:::tip[ ]
Jeśli w swoim projekcie Astro używasz rozszerzonego formatu Markdown, czyli plików z rozszerzeniem `.mdx`, to konieczne jest dodanie wtyczki, która umożliwi ich odczyt. Obsidian natywnie wspiera standardowy format `.md`.

Instalujesz [plugin mdx as md](https://github.com/mkozhukharenko/mdx-as-md-obsidian) i po problemie.
:::

Jeśli jednak masz już trochę rzeczy w swojej bieżącej przestrzeni i niespecjalnie chce Ci się tworzyć nową, to z pomocą przychodzi `symlink` (Linux, MacOS) albo `mklink` (Windows), czyli taki cyfrowy kierunkowskaz.
### Tworzenie symlinka

Staram się nie używać Windowsa, więc dalej pociągnę przykład z symlinkiem.

Taki zabietg to jednolinijkowa komenda. Najprościej będzie jak uruchomisz ją z poziomu folderu w Obsidianie, do którego chcesz zaciągnąć content z Astro.

Czyli:
1. Z poziomu terminala wchodzisz do wybranego folderu Obsidiana
2. Wpisujesz `ln -s` i jako pierwszy argument podajesz ścieżkę contentu Astro, a jako drugi nazwę symlinka. Czyli: `ln -s <ścieżka do folderu z artykułami Astro> <nazwa symlinka>`

Przykład:
`ln -s /Users/filipchrapek/Desktop/dev/filipchrapek.pl/src/content content`

I w zasadzie tyle, content Astro powinien pojawić się w Obsidianie. *Nice job!*

:::note[ ]
Jeśli nie widzisz treści z Astro, to upewnij się czy na pewno masz dobre ścieżki, czy nie ma literówek, niepotrzebnych slashy etc.
:::
