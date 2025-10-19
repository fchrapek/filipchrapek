---
title: Prompt design – przepis na przemyślane i skuteczne odpytanie LLM
description: Konstrukcja i optymalizacja promptów – kluczowe pojęcia oraz strategie tworzenia efektywnych zapytań do modelu
publishDate: "2023-10-29"
tags:
  - ai
  - ai-devs
  - kursy
  - prompt
  - prompt-engineering
ogImage: /assets/images/cooking-book-magenta.png
draft: false
---

Kontynuujemy wojaże z kursem AI Devs. Tym razem połączę lekcję 2 i 3, ponieważ obie mają w sobie sporo mięska dotyczącego jednego, konkretnego tematu – promptu.

Lecim!

## Spis treści

## C01L02 — Zasady działania LLM

Lekcja druga rozpoczyna się od rozszerzenia opisu działania LLM z pierwszej lekcji i zagląda pod maskę nieco głębiej.

### Tokenizacja i embedding

Tekst opisuje działanie dużych modeli językowych, oraz zastosowanie sieci neuronowych w przetwarzaniu języka naturalnego. Omówiono koncepcje takie jak **tokenizacja**, czyli zamiana tekstu na reprezentację liczbową ([https://platform.openai.com/tokenizer](https://platform.openai.com/tokenizer) spoko pokazuje jak zliczana jest ilość tokenów), oraz **embedding**, który polega na reprezentowaniu znaczenia słów czy zdań za pomocą liczb.

### Prompt

Lekcja 2 rozpoczyna rozkład promptu na czynniki pierwsze i analizę poszczególnych składowych. 

Opisany zostaje [Playground](https://platform.openai.com/playground), czyli dostępne z poziomu platformy Open AI GUI znacznie rozszerzające możliwości komunikacji z LLM.

Lekcja wyjaśnia dostępne role (System, User i Assistant) oraz opisuje wszystkie dostępne parametry, z czego najważniejszymi mają być ***temperature*** i ***max length***.

### Kilka istotnych wniosków

- Autorzy kursu otwarcie informują, że do końca nie wiadomo co jest grane pod maską LLM podczas wysyłania promptu i otrzymania odpowiedzi
- Generowanie tekstu bazuje na statystyce i jest niedeterministyczne, czyli otrzymasz różną formę wyniku, pytając o to samo
- Tokenizacja inaczej działa dla języka angielskiego, a inaczej dla np. polskiego (zżera więcej tokenów), co wynika z dostarczonych zestawów danych

I co ciekawe:

> **Suma tokenów w prompcie oraz "max length" nie może przekraczać dopuszczalnego limitu**. Inaczej mówiąc, im dłuższy prompt, tym mniej miejsca zostaje na generowanie odpowiedzi. Co ważne, ustawianie **niskiej wartości max length, gdy spodziewasz się krótkiej wypowiedzi, zwiększa wydajność modelu**. Z drugiej strony, ustawienie tego wskaźnika wysoko **nie jest związane z faktyczną długością generowanej odpowiedzi**.

## C01L03 — Prompt Design

Lekcja trzecia skupia się konkretnie na prompcie, jego strukturze, dobrych praktykach i przykładowych strategiach tworzenia.

Na starcie dostajemy wizualną reprezentację struktury promptu (obrazek pożyczam)

![Struktura promptu](/assets/images/9/prompt-structure.png)
*Struktura promptu*

Zanim opiszę krótko każdą z pozycji, zahaczę od razu o fragment dotyczący podziału na System, User i Assistant, który pojawia się w lekcji trochę później.

Open AI Playground (wspominane wyżej) udostępnia przyjemne GUI z całą paletą parametrów i wizualnym podziałem na poszczególne sekcje składowe promptu.

![Podział na System, User i Assistant](/assets/images/9/prompt-system-user-assistant.png)
*Podział na System, User i Assistant*

Co ciekawe jednak, z lekcji wynika, że podział na System, User i Assistant jest w zasadzie czysto dla lepszego UX, ponieważ dla modelu nie ma znaczenia w jakich polach wprowadzisz instrukcje – i tak traktowane jest to, jako jeden blok tekstu.

>Podział na trzy role określa się także mianem ChatML — formatu, który został przedstawiony przez OpenAI przy okazji premiery ChatGPT. Jednak z punktu widzenia modelu, nadal mówimy o **jednym bloku tekstu** opisanym metadanymi.

>Powyższa informacja jest dla nas istotna podczas projektowania promptów, ponieważ jasno sugeruje, że **nie ma potrzeby definiowania wiadomości systemowej**. Co więcej, **możesz patrzeć na pola system, user i assistant, jak gdyby były całością**

### Przepis na dobry prompt

Wracam do obrazkowego schematu powyżej i do podziału na System, User i Assistant. Rolę, instrukcje, kontekst i przykłady wrzucam do pola System, pytanie ląduje w sekcji User, a odpowiedź to Assistant.

#### Rola

Odnosi się do zdolności modelu do adaptacji i przyjmowania różnych "osobowości" lub "specjalizacji", podobnie jak kameleon dostosowuje się do swojego otoczenia. Model może przyjmować różne role, takie jak znane postacie, specjalizacje zawodowe, konkretne zachowania czy nawet narzędzia. Kluczową korzyścią z określenia roli jest nadanie kontekstu konwersacji, co pomaga zredukować dwuznaczność i nieścisłości w komunikacji.

#### Instrukcja

Zawiera szczegółowy opis tego, jak model powinien wykonywać zadanie. Może zawierać określone zachowania, zestaw faktów lub konkretne zasady do przestrzegania. Ważne jest, aby instrukcje były jasne i precyzyjne, uwzględniając ograniczenia modelu, takie jak brak aktualnych informacji.

#### Kontekst

Dostarcza dodatkowych informacji, które mogą nie być zawarte w podstawowej wiedzy modelu, ale są kluczowe dla konkretnego zapytania. Może to być zestaw informacji dostarczonych ręcznie, wygenerowanych przez model lub dodanych dynamicznie przez aplikację. Kontekst jest ważny, aby model mógł odpowiednio zinterpretować zapytanie i dostarczyć dokładną odpowiedź.

![Przykład nadania kontekstu](/assets/images/9/prompt-context.png)
*Przykład nadania kontekstu*

#### Przykłady

Używane do zilustrowania konkretnego zachowania lub odpowiedzi, które oczekujemy od modelu. Dzięki nim model może lepiej zrozumieć, czego od niego oczekujemy, i dostosować się do tych oczekiwań. Są one szczególnie przydatne w sytuacjach, gdy język naturalny jest dwuznaczny lub gdy chcemy, aby model naśladował konkretny styl lub format.

#### Pytanie

Konkretne zapytanie, które chcemy, aby model przetworzył. Może to być proste pytanie, polecenie lub zestaw danych do analizy. Ważne jest, aby pytanie było jasne i precyzyjne, aby model mógł dostarczyć odpowiednią odpowiedź.

#### Odpowiedź

Odpowiedź to bezpośrednia reakcja modelu na zapytanie. Jest to końcowy wynik interakcji z modelem i powinien być zgodny z wcześniejszymi instrukcjami i kontekstem dostarczonym w prompcie. Odpowiedź może zależeć od wcześniejszych interakcje w konwersacji, a jej jakość i dokładność zależą od jakości dostarczonego promptu.

### Strategie tworzenia promptów

Lekcja pokazuje kilka technik projektowania promptów, z czego każda ma swoją konkretną nazwę.

1. **Zero-shot Prompting**: Model wykonuje zadanie na podstawie prostej instrukcji bez podawania przykładów.
2. **One-shot / Few-shot Prompting**: Technika oparta na podawaniu modelowi przykładów ilustrujących oczekiwane zachowanie.
3. **Chain of Thought**: Model jest prowadzony przez ciąg myślowy, opierając się na dostarczonej wiedzy lub informacji przez siebie wygenerowanej.
4. **Zero-shot Chain of Thought**: Model wyjaśnia swoje rozumowanie krok po kroku, zwiększając szansę na poprawną odpowiedź.
5. **Reflexion**: Model weryfikuje swoją odpowiedź krok po kroku, identyfikując ewentualne błędy w swoim rozumowaniu.
6. **Tree of Thoughts**: Model generuje różne scenariusze odpowiedzi, analizuje je, wybiera najbardziej prawdopodobne i udziela odpowiedzi.

## Dobre linki/źródła
- [Zobrazowana tokenizacja](https://platform.openai.com/tokenizer)
- [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
- [OpenAI Github](https://github.com/openai/openai-cookbook)
- [AI Explained](https://www.youtube.com/@aiexplained-official)
