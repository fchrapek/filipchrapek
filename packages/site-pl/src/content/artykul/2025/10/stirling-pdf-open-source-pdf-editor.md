---
title: "Stirling-PDF – (prawie) idealne narzędzie do edycji tych zasranych PDF-ów, które nie chcą się dać edytować"
description: "Stirling-PDF to open-source'owe narzędzie, które robi z PDF-ami (prawie) wszystko, czego możesz potrzebować. Jest ładnie, jest responsywnie, jest lokalnie. Słowem, jest bardzo sympatycznie. I cyk, kolejny fakulec leci w stronę Adobe (a tfu)."
publishDate: "5 October 2025"
tags: ["pdf", "self-hosted", "open-source"]
---

## Stirling-PDF jest świetny

[Stirling-PDF](https://stirlingpdf.io/) to open-source'owe narzędzie, które robi z PDF-ami (prawie) wszystko, czego możesz potrzebować. Jest ładnie, jest responsywnie, jest lokalnie. Słowem, jest bardzo sympatycznie.

I cyk, kolejny fakulec leci w stronę Adobe (a tfu).

![Go away Adobe](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2RhcjJucmRyMWN0cjd6ZzdraHpndGt4OHEwd3BhaGU4a282eHNhMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4Fsly71gEOtGvLQA/giphy.gif)

### Co potrafi Stirling-PDF

**Podstawowe operacje:**
- Łączenie i dzielenie PDF-ów
- Obracanie stron
- Wyciąganie konkretnych stron
- Zmiana kolejności stron

**Bardziej zaawansowane rzeczy:**
- Konwersja z/do różnych formatów (Word, Excel, obrazki)
- OCR - czyli rozpoznawanie tekstu z zeskanowanych dokumentów (obsługuje polski!)
- Kompresja PDF-ów
- Dodawanie/usuwanie watermarków
- Podpisywanie cyfrowe dokumentów
- Szyfrowanie i zabezpieczanie hasłem

**I jeszcze kilka smaczków:**
- Dodawanie numeracji stron
- Czyszczenie metadanych
- Nakładanie PDF-ów na siebie
- Auto-split według rozmiaru/ilości stron

Wszystko to pakuje się w przyzwoite, responsywne UI, które działa zarówno na komputerze, jak i telefonie.

## Daj się edytować, ty głupi PDF-ie

:::warning[ ]
Niestety najbardziej dla mnie użyteczny ficzer, czyli **edycja istniejącego tekstu PDF-a jest na ten moment niedostępna**. I to, nie ukrywam, trochę boli.
:::

Nie zliczę ile razy musiałem na szybko poprawić literówkę albo jakieś dane do faktury. W takich momentach wciąż muszę sięgać po inne narzędzia albo (co robię najczęściej) eksportować do Worda, poprawiać i generować PDF-a od nowa.

## Self-hosted Stirling-PDF na świetnym, bo polskim Mikrusie

Moment, w którym zrzucasz kajdany założone przez chciwego hostingodawcę gównianego, współdzielonego hostingu, to niewątpliwie przełomowa chwila w życiu człowieka.

Nagle cały wirtualny świat stoi przed Tobą otworem, a jedynym ograniczeniem jest Twoja wyobraźnia. Czujesz w żyłach buzującą adrenalinę, a w oddali dociera do Ciebie syreni śpiew komend Linuxa. Pora założyć rękawiczki, zdjąć spodenki i wpisać tajemne, elfie runy `ssh`...

3 godziny i 88 komend później zamykasz terminal, idziesz na spacer i rozważasz zostanie mobilnym masażystą.

![Normal Linux experience](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnVnN2tyYWNvMTJjNHNlb3N6dm1tbWkwNDE1bGlzbTE1ODRuNnFlaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Wq4XuPC9gFzR6/giphy.gif)

Ta przezabawna, wręcz komediowo genialna wstawka powyżej nijak ma się naturalnie do rzeczywistości i jeśli tylko potrafisz czytać i chociaż raz widziałeś terminal na oczy, bez problemu ogarniesz (szczególnie teraz, kiedy w zasadzie nawet czytać nie musisz, bo wszystko robi za ciebie LLM).

A jeśli używasz [Mikrusa](https://mikr.us/), to sprawa jest jeszcze prostsza, bo sporo rzeczy masz już tam *out of the box*.

### Czym jest Mikrus?

Jak sam twórca ([Jakub Mrugalski](https://mrugalski.pl/)) pisze, [Mikrus](https://mikr.us/) to **Serwery VPS dla pasjonatów**.

I to czuć.

Największymi zaletami Mikrusa są dla mnie:
1. Działa, jak ma działać.
2. Cena.
3. Aktywna i nietoksyczna społeczność (wspomnianych wcześniej pasjonatów).
4. Jakkolwiek dziwnie to zabrzmi, to poczucie przyzwoitości stojące za całym przedsięwzięciem.

Za minus możesz uznać brzydkie UI dostępnego panelu, no ale biorąc VPS-a, piszesz się raczej na korzystanie z terminala.

### Instalujemy Stirling-PDF

Najprościej self-hostować Stirling-PDF przy pomocy [Dockera](https://www.docker.com/).
Upewnij się zatem, czy twoja wersja Mikrusa ma to narzędzie i jedziemy z tematem.

**Krok po kroku:**

1. Zaloguj się do serwera po `ssh`
2. Stwórz katalog `mkdir -p ~/stirling-pdf` i przejdź do niego `cd ~/stirling-pdf`
3. Stwórz `docker-compose` przez `nano docker-compose.yml`
4. Wklej config:

```yml
services:
  stirling-pdf:
    image: docker.stirlingpdf.com/stirlingtools/stirling-pdf:latest
    container_name: stirling-pdf
    ports:
      - '8080:8080'
    volumes:
      - ./trainingData:/usr/share/tessdata     # OCR language data
      - ./extraConfigs:/configs                # Custom configs
      - ./customFiles:/customFiles/            # User files
      - ./logs:/logs/                          # Application logs
      - ./pipeline:/pipeline/                  # Processing pipelines

    environment:
      - DOCKER_ENABLE_SECURITY=false
      - DISABLE_ADDITIONAL_FEATURES=false
      - LANGS=en_GB,pl_PL
    restart: unless-stopped
```

5. Zapisz i wyjdź z `nano`: `Ctrl+X, Y, Enter`
6. Odpal kontener: `docker compose up -d`
7. Jeśli wszystko poszło ok, to powinno pojawić się coś w stylu `Started StirlingPdfApplication`

**Weryfikacja:**

Sprawdź czy Stirling śmiga przy pomocy:
```bash
curl http://localhost:8080/api/v1/info/status
```

Jak zobaczysz coś w stylu `{"status":"UP"}`, to mamy to.

:::important[ ]
Sprawdź możliwości swojego serwera. W moim przypadku, przy hulającym [n8n](https://n8n.io/), konieczny był bump do wyższej wersji, bo brakowało mi RAM-u. Stirling potrafi być dość żarłoczny na zasoby, szczególnie przy OCR-ze większych dokumentów.
:::

### Dostęp do Stirlinga

Ja potrzebowałem Stirlinga do spięcia z n8n, które jest postawione na tym samym Mikrusie. Dlatego do moich potrzeb wystarczyło przekazanie endpointu lokalnie: `http://localhost:8080/api/v1/convert/pdf/img`

**Jeśli chciałbyś dostać się do panelu z przeglądarki**, musisz:

1. **Otworzyć port w panelu Mikrusa** (zakładka "Porty TCP")
2. **Zmienić mapping portów w `docker-compose.yml`**:

```yml
ports:
  - '40116:8080'  # lub inny wybrany port zewnętrzny
```

Schemat jest prosty: `PORT_ZEWNĘTRZNY:PORT_KONTENERA`

Gdzie:
- **40116** (lub inny) - port, przez który łączysz się z internetu
- **8080** - port wewnętrzny, na którym Stirling nasłuchuje w kontenerze

3. **Zrestartuj kontener**:
```bash
docker compose down
docker compose up -d
```

Teraz możesz wejść do Stirlinga przez: `http://srv32.mikr.us:40116` (lub twój adres i port)

## Podsumowanie

Stirling-PDF to solidne narzędzie do PDF-ów, które możesz mieć u siebie, całkowicie pod swoją kontrolą. Odpalasz, używasz, działa.

Czy jest idealny? Nie - brak bezpośredniej edycji tekstu boli. Ale do wszystkiego innego jest naprawdę spoko. A jak jeszcze dorzucisz do tego fakt, że możesz go postawić na Mikrusie za grosze, to wychodzi całkiem przyjemny setup.

Polecam potestować, do następnego!

---

**Przydatne linki:**
- [Stirling-PDF na GitHubie](https://github.com/Stirling-Tools/Stirling-PDF)
- [mikrus.pl](https://mikr.us/)
- [Dokumentacja Stirling-PDF](https://stirlingpdf.io/)
