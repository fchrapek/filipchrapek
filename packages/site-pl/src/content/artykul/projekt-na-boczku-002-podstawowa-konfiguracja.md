---
title: Projekt na boczku 002 - Podstawowa konfiguracja projektu 
description: Stawiam szybki szkielet projektu i konfiguruję środowiska.
publishDate: "2023-12-22"
tags:
  - side-project
  - freelancer
  - projekt-na-boczku
  - vercel
  - ovh
  - WordPress
ogImage: /assets/images/empty-frame-on-indygo-wall.jpeg
draft: false
---

## Szybki start

No to co, witam w mojej kuchni! Dzisiaj przygotujemy szybki i świeży prototyp.

Składniki jakie będziemy potrzebować:
- domena 
- hosting pod back-end
- hosting pod front-end
- WordPress
- lokalne repozytorium

:::note[ ]
Te chaotyczne notatki, które zamierzam, celowo nie są tutorialami. Będę rzucał wieloma terminami, apkami, platformami, narzędziami, ale zazwyczaj nie będę ich głębiej opisywał (a jeśli tak się stanie, to pewnie zrobię to w formie osobnego artykułu).

Just sayin, żeby potem nie było 😀
:::

---

## Spis treści

## Domena

Raz na jakiś czas siedząc na kiblu albo pod prysznicem (w sensie tam stoję, nie siedzę) wpadnie mi do głowy jakiś genialny pomysł.

Mój geniusz obraca się głównie wokół rozwiązań cyfrowych, więc pierwszym krokiem naturalnie jest wykupienie domeny.

Ogrom genialności zazwyczaj weryfikowany jest rok później, kiedy dostaję maila z informacją o konieczności odnowienia domeny, która rzecz jasna leży od roku zakurzona w starej skrzyni zakopanej w ogródku.

Być może i tak byłoby w tym wypadku, gdyby nie ten projekt! Bo oto mam przyjemność zaprezentować cyfrowy adres naszej redakcji, czyli...

...mampudla.pl

Acha, zazwyczaj domeny ograniam na [OVH](https://www.ovhcloud.com/).

Czemu? A w zasadzie, bo tak.

Kiedyś mieli spoko ceny, a teraz to chyba z przyzwyczajenia 🤷

---

## Hosting

Potrzebne będzie miejsce pod back-end, czyli WordPress'a (przypominam, że bawię się w headless) i pod front, na który będzie śmigać Next.js.
### Back-end

W tym projekcie nastawiam się na próbowanie nowych rzeczy, ale z drugiej strony nie chcę ślęczeć nad jednym tematem niewiadomo ile. Dlatego WordPressa postawię na najzwyklejszym hostingu współdzielonym (zamiast próbować walczyć z jakimiś AWS-ami).

Zazwyczaj przy takich standardowych tematach stronkowo-firmowo-wordpressowych korzystam ze starego, dobrego [LH.pl](https://www.lh.pl/hosting?ref=kiwwwipl), ale tym razem sprawdzę [dhhosting.pl](dhhosting.pl) (i tak na teraz nie ma to większego znaczenia).
### Front-end 

Warstwę frontową postawię na platformie [Vercel](https://vercel.com/), która to jest ojcem i matką frameworka Next.js.

Zostaję na razie przy darmowym pakiecie, który nie dość, że na tym etapie na pewno pokryje całe zapotrzebowanie, to jeszcze udostępnia wygodne ficzery, które usprawniają pracę.

Wystarczy, że przy dodawaniu projektu od razu zepnę go z repozytorium i *out of the box* mam dostęp do CI/CD (czyli, po zaktualizowaniu wybranego brancza, projekt automatycznie jest buildowany i każda zmiana widoczna jest od razu) oraz do środowiska stagingowego (każdy brancz ma swój dedykowany URL, czyli jak pushnę kod na gałęzi `staging`, to utworzy się klikalny adres z poglądem zmian).

Super sprawa!

---

## Środowiska, templatka startowa i konfiguracja domeny

Zanim zepniemy wszystko ze sobą, konieczne jest postawienie projektu lokalnie i utworzenie repozytorium.

### Lokalne środowisko back-endowe

WordPress'a zazwyczaj stawiam przy wykorzystaniu [MAMP-a](https://www.mamp.info/).

Na back-endzie nie będę skupiał się teraz jakoś bardzo, bo i tak dane (czyli na teraz praktycznie tylko wpisy blogowe) będą dostarczane z domeny (a raczej subdomeny, o tym ciut więcej w sekcji Konfiguracja) podpiętej pod hosting lh.pl.

NIe mniej jednak, repozytorium musi być, tak że inicjuję lokalne repo i przesyłam na [GitHub](https://github.com/).

Acha, lubię mieć wizualny podgląd na wszystko, tak że do obsługi git-a korzystam z softu o nazwie [Fork](https://git-fork.com/).

### Lokalne środowisko front-endowe

Jak wspominam wyżej, front obsłuży mi Next.js.

Tak się składa, że oferują starter dokładnie pod Headless WP, tak że nie będę leszczem i sobie z niego skorzystam, [tutaj link](https://vercel.com/templates/next.js/isr-blog-nextjs-wordpress).

:::note[ ]
Instrukcja wspomina o wtyczce, która umożliwia skorzystanie z GraphQL, czyli języka zapytań dzięki któremu, krótko mówiąc, możemy komunikować się pomiędzy frontem, back-endem. Tak że teoretycznie ta część powinna wpaść pod sekcję **Lokalne środowisko backendowe**
:::

Mając pobrane repo (po prostu podążam za instrukcją), istotnym elementem jest konfiguracja zmiennych środowiskowych w pliku `.env.local`. Inaczej dane nie zostają pobrane.

Inicjuję lokalne repo i przesyłam całość na Github.

---

## Spinanie wszystkiego do kupy

Cały proces jaki sobie wymyśliłem ma wyglądać w teorii tak:
1. [mampudla.pl](https://www.mampudla.pl/), czyli front projektu jest skierowany na serwery Vercela
2. lokalnie pracuję nad frontową warstwą i każda zmiana na branczu `master` automatycznie dodawana jest na produkcję.
3. wpisy dodaję w WordPressie, który stoi na hostingu dhhosting.pl na subdomenie content.mampudla.pl

To, co muszę zrobić to:
1. popchnąć kod [podstawowej templatki](https://vercel.com/templates/next.js/isr-blog-nextjs-wordpress) (w zasadzie na startcie nieczego nie zmieniałem) na GitHub i dodać/połączyć projekt z Vercelem.
2. dodać customową domenę do Vercela (po prostu przeklikałem się podążając za informacjami podanymi na każdym etapie konfiguracji)
3. skierować [mampudla.pl](https://www.mampudla.pl/) z OVH na Vercel przez dodanie odpowiedniego rekordu A i CNAME (Vercel dorzuca z automatu darmowy certyfikat SSL...a może musiałem coś przeklikać – nie pamiętam 🤷)
4. skierować subdomenę content.mampudla.pl z OVH na serwery dhhosting.pl
5. sprawdzić czy wszystko działa

Jeśli wszystko jest ok, a mnie dalej chce się to robić, to [www.mampudla.pl](https://www.mampudla.pl/) powinien przypominać bloga o pieskach.

**Do następnego!**
