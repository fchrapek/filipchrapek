---
title: Irytujące błędy w Google Search Console – dlaczego zazwyczaj możesz je zignorować?
description: Co łączy Przełęcz Diatłowa, trójkąt Bermudzki, Atlantydę i błędy Google Search Console? To, że nikt do końca nie wie, co tak na prawdę jest grane.
publishDate: "2023-10-06"
tags:
  - google-serach-console
  - dostepnosc
  - dobre-praktyki
  - development
ogImage: /assets/images/smartphone-sand.jpeg
draft: false
---

Co łączy Przełęcz Diatłowa, trójkąt Bermudzki, Atlantydę i błędy Google Search Console?

To, że nikt do końca nie wie, co tak na prawdę jest grane.

---

## Spis treści

## Google Cię nienawidzi 

Będąc webmasterem swoich klientów, na pewno zdarzyła Ci się sytuacja, kiedy zaintrygowany zleceniodawca atakuje Cię groźnie brzmiącymi notyfikacjami od Google.

>Problemy (Obsługa na urządzeniach mobilnych) wykryte w witrynie...

>Rozwiąż je, aby zapewnić najwyższą jakość i maksymalny zasięg swojej usługi w wyszukiwarce Google.

Czy klient chce zapewnić najwyższą jakość i maksymalny zasięg swojej usługi w wyszukiwarce Google?

Cóż, zapewne tak.

Czy Ty, jako profesjonalny fachowiec-koder-cudotwórca, wdrożyłeś produkt dokładnie w sposób zapewniający powyższe wytyczne (mimo, że są nic nie znaczącym marketingowym bełkotem) i teraz wyglądasz jak totalny pajac i oszust?

Cóż, raczej tak.

Gugel, WTF?

## Google Ci nie pomoże

Ze zgłoszeniami Google Search Console są w zasadzie trzy problemy:
1. masz wrażenie, że pojawiają się całkowicie przypadkowo, po chwili znikają i pojawiają się znów,
2. nie wskazują konkretnego miejsca, z którym jest problem,
3. otrzymany feedback jest w zasadzie kij warty.

Sprawdź kilka popularnych przykładów:
### Treść szersza niż ekran

Ten komunikat jest o tyle *przystępny*, że jeśli strona nie jest zamierzonym, webowym odpowiednikiem *Panien z Awinionu* Picasso, to wyróżniające się, wychodzące poza ustalony grid elementy zazwyczaj odnajdziesz raczej sprawnie.

Wciąż, Google nie podaje dokładnie, gdzie jest bubel.
### Mała czcionka utrudnia czytanie tekstu

No i super, tylko co to znaczy mała czcionka? Zamiast konkretnych wartości, dostajesz w twarz jednym, krótkim zdaniem.

Dlaczego Google chociaż nie linkuje do swoich (!) wewnętrznych zaleceń?

Wystarczyłoby dorzucić drugie zdanie, że [minimalny rozmiar czcionki to `12 px`](https://developer.chrome.com/docs/lighthouse/seo/font-size/) i już feedback staje się o niebo bardziej przydany.

### Elementy klikalne zbyt blisko siebie

To samo... Jakie elementy? I co to znaczy *zbyt blisko siebie*?

Ponownie, podanie konkretnych wartości to absolutne minimum, no bo ponownie [Google ma to w swojej dokumentacji](https://web.dev/accessible-tap-targets/) (48 x 48 pikseli to minimalny obszar do obsłużenia palucha, jak Ci się nie chce klikać w link).
## Google się poddaje

Wygląda na to, że Google ma sam dość swojego narzędzia i zapowiada niemałe zmiany:

>1 grudnia 2023 r. zaczniemy wycofywać raport Search Console dotyczący obsługi na urządzeniach mobilnych, narzędzie test optymalizacji mobilnej oraz interfejs API Test optymalizacji mobilnej.

Co dalej? 

A chyba nic konkretnego 🤷. Przynajmniej jeśli chodzi o podobny odpowiednik raportu. Bo jak sami piszą:

>... pojawiło się wiele innych przydatnych zasobów do oceny obsługi na urządzeniach mobilnych, m.in. [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/?hl=pl) z Chrome.

I super. Raporty Lighthouse są o lata świetlne lepszym narzędziem niż raporty Google Search Console. Trzymam kciuki za dalszy, pozytywny rozwój!

## Linki

-  [Raport dotyczący obsługi na urządzeniach mobilnych](https://support.google.com/webmasters/answer/9063469?hl=pl)
