---
title: Programowanie i Automatyzacja w parze z AI – wystartował AI Devs
description: Wystartował AI Devs – koniec kopiowania ze Stack Overflow, niech robot robi to za mnie!
publishDate: "2023-10-24"
tags:
  - ai
  - ai-devs
  - kursy
  - react
ogImage: /assets/images/ai-image-fieldspar.jpeg
draft: false
---

Wystartował AI Devs, czyli [kurs](https://www.aidevs.pl/) Adama Gospodarczyka, Kuby Mrugalskiego i Mateusza Chroboka – rąsie aż same zacierają się z podekscytowania!

Niestety, z kursami mam tak, że początkowy hype utrzymuje się przez średnio 3 lekcje i dalszy udział to już pewne testowanie charakteru, no bo *wymówki*, tak że postaram się, żeby tym razem było inaczej.

Na dzień pisania tego wpisu na tablicy są dwie pierwsze lekcje i wygląda na to, jak na razie każda z nich będzie zawierała w sobie przynajmniej jedno zadanie praktyczne.

Jest to bardzo dobra okazja, żeby podzielić się napisanym kodem i przy okazji podsycić ciutek płomień motywacji starając się robić (nawet mniejszą) wrzutkę z każdej lekcji.

Do komputra!

---

## Spis treści

## C01L01 — Wprowadzenie do Generative AI

Pierwsza lekcja to dosyć obszerny wstęp opisujący Duże Modele Językowe – czym są oraz dlaczego są spoko i niespoko. Wprowadzonych zostaje też sporo pojęć (np. [halucynacja modelu](https://www.linkedin.com/pulse/sztuczna-inteligencja-i-bezpiecze%C5%84stwo-informacji-1-leszek-kepa/?originalSubdomain=pl)) oraz narzędzi związanych mniej lub bardziej z generative AI. Linkowane są też źródła, tak że w dwóch słowach – jest dobrze!

Dodatkowo (a może i przede wszystkim), jest to też mocny *teaser* tego, czego możesz spodziewać się w kolejnych lekcjach. 

Taki solidnym zwiastunem jest zadanie praktyczne, które już na starcie wymusza odpalenie konsoli/edytora.

## Zadanie praktyczne

Zadaniem rozgrzewkowym jest napisanie skryptu obsługującego kilkustopniową komunikację przez API:
- autoryzacji
- pobierania danych wejściowych (string lub tablica obiektów)
- odesłania odpowiedzi

O ile ten przykład spokojnie da się ogarnąć ręcznie, o tyle kolejne przykłady mają być niemożliwe do wykonania sposobem innym niż napisana mini apka. Niemożliwość ma być wymuszana przez ograniczenie czasowe tokenu autoryzującego.

Jako, że React to jest coś z czym jeszcze nie czuję się ultra komfortowo, napiszę całość właśnie w tej technologi (pod maską skorzystam z [Vite](https://vitejs.dev/guide/))

Na razie olewam stylowanie.

``` javascript
import { useState } from 'react';

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = 'https://zadania.aidevs.pl';

  const [task, setTask] = useState('');
  const [token, setToken] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTaskInput = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tokenResponse = await fetch(`${baseUrl}/token/${task}`, {
        method: 'POST',
        body: JSON.stringify({
          apikey: apiKey,
        }),
      });
      if (!tokenResponse.ok) throw new Error('Failed to fetch token.');
      const tokenData = await tokenResponse.json();
      setToken(tokenData.token);

      const taskResponse = await fetch(`${baseUrl}/task/${tokenData.token}`);
      if (!taskResponse.ok) throw new Error('Failed to fetch task.');
      const taskData = await taskResponse.json();
      setAnswer(taskData.cookie);

      const answerResponse = await fetch(
        `${baseUrl}/answer/${tokenData.token}`,
        {
          method: 'POST',
          body: JSON.stringify({
            answer: taskData.cookie,
          }),
        }
      );
      if (!answerResponse.ok) throw new Error('Failed to send answer.');
      const answerData = await answerResponse.json();
      setResult(answerData.note);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input onInput={handleTaskInput} type="text" name="task" id="task" />
        <input type="submit" value="Send" />
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <p>Token: {token}</p>
      <p>Answer: {answer}</p>
      <p>Result: {result}</p>
    </>
  );
}

export default App;
```

Przez input pobierane jest hasło zadania `helloapi` i na `submit` odpalana jest komunikacja z API. 

Dla lepszego UX dodana jest obłsuga (duże słowo) loadingu i errorów, a wynik każdego zapytania wypluwany jest w 3 paragrafach na froncie.

## Linki/Polecajki

- [strona AI Devs](https://www.aidevs.pl/)
