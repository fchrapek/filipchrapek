---
title: "Auto-save dla twojego self-hostowanego n8n (bo tracenie 3 godzin pracy ssie)"
description: "n8n jest świetne, ale nie ma auto-save. Oto dlaczego to problem, co mówi community i co możesz zrobić już teraz, podczas gdy devsi pracują nad właściwym rozwiązaniem."
publishDate: "18 October 2025"
tags: ["n8n", "self-hosted", "automation", "workflow"]
---

## Ból jest prawdziwy

Kocham pracę z narzędziami, które dbają o twój progres i skuteczne utrwalanie wiedzy.

Dlatego kiedy po kilku godzinach pracy i cudownym uczuciem spełnienia po dopięciu ostatniej małej pierdoły, która za żadne skarby nie chciała działać, tracisz cały progres, bo zapomniałeś kliknąć tego j#banego `cmd/ctrl + s`...

...masz ochotę napisać twórcom spersonalizowany list, w którym wynosisz pod niebiosy takie wyrozumiałe podejście.

![Kill me now](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXdsbGkzdjYycW0yaW8zM2YxbzdraHZjdnczaGsxM3h6YjI3cjVsOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0Hlx9qtQaWzV3XHi/giphy.gif)

Tak wiem, wszyscy znamy ten ból. Co więcej, podobne doświadczenia nie wynikają tylko z anegdotek - przeglądając fora, jest to powtarzający się problem.

> I'm using n8n for a few hours now and it is the second time in a row when I lost the whole workflow just by closing my laptop lid for a few minutes.
>
> I'm not sure if that is intended to work like that, but it is a terrible user experience. I honestly hope it is a bug that will be fixed. For now, I'll switch to another platform to test if it gives a better UX or not.
>
> Auto-save is a standard way all web apps work (and for last 10 years, desktop apps too). I don't remember the last time I had to press the save button in order not to lose my work when my laptop goes to sleep.
>
> — [n8n Community Forum](https://community.n8n.io/t/why-doesnt-n8n-autosave-i-just-lost-2-hours-of-work/150207)

I kolejny:

> I just lost 2-3 hours of work also. beyond frustrated.
>
> — [n8n Community Forum](https://community.n8n.io/t/autosave-for-workflows/234/30)

n8n jest super, ale ficzer który sprawiłby, że byłoby jeszcze bardziej super, to automatyczny zapis pracy.

## Dlaczego n8n nie ma auto-save?

Guglując głębiej, dlaczego tak ugruntowane narzędzie z ogromnym community mającym realny wpływ na jego rozwój nie ma tej pozornie podstawowej funkcji, znajdziesz kilka interesujących argumentów.

Community jest podzielone. Oto przemyślana odpowiedź od power usera:

> To add to this conversation, autosave in n8n workflows would be detrimental to my workflow (pun intended). At least without some other features being released alongside it such as improved version history.
>
> In my opinion, there are some types of software where autosave can actually reduce productivity.
>
> While I understand the appeal, I don't think it's right for n8n. Making and editing workflows involves experimental changes and iterative testing, where the ability to revert to a known good state is crucial. With autosave, recovering from unsuccessful experiments would become much worse than dealing with occasional unsaved work.
>
> That's not even to mention the fact that if the workflow is enabled, you will be breaking the workflow.
>
> — [n8n Community Forum](https://community.n8n.io/t/autosave-for-workflows/234/40)

### Właściwe rozwiązanie wymagałoby:

**Funkcje podstawowe:**
- Tryb draft do zapisywania workflow bez wpływu na włączoną wersję (to właściwie ważniejsze niż autosave)
- Ulepszona historia wersji z wyraźniejszym śledzeniem zmian (może wspomagana przez AI)
- Możliwość włączenia/wyłączenia autosave przez użytkownika (zarówno w UI, jak i przez ENV VARS)

**Ulepszenia UI:**
- Wyraźne wskaźniki statusu zapisu (podobne do "Saving…" i "Saved" w Google Docs)

Jak zauważa użytkownik:

> If you're not aware, this would require significant refactoring of n8n's core functionality. It's not just a simple feature toggle.
>
> — [n8n Community Forum](https://community.n8n.io/t/autosave-for-workflows/234/29)

:::note[ ]
**Dobra wiadomość:** Zespół n8n jest [świadomy problemu](https://github.com/n8n-io/n8n/issues/3321) i dyskusje w community trwają. Ale dopóki nie pojawi się oficjalne rozwiązanie, potrzebujemy workaroundów.
:::

## Co możesz zrobić teraz

Z pomocą przychodzi świetne i aktywne community. Oto dwa rozwiązania, których możesz użyć już dziś:

### Opcja 1: Rozszerzenie do przeglądarki

Członek community stworzył rozszerzenie do Chrome, które dodaje funkcjonalność auto-save:

**[AutoSave8n Chrome Extension](https://chromewebstore.google.com/detail/autosave8n/nieoihecpgapeodjpieehabgddjihegf?hl=en)**

To najprostsze rozwiązanie, jeśli używasz Chrome lub dowolnej przeglądarki opartej na Chromium (Edge, Brave, etc.). Po prostu zainstaluj i zapomnij o ręcznym zapisywaniu.

**Jak zainstalować:**
1. Odwiedź [link do Chrome Web Store](https://chromewebstore.google.com/detail/autosave8n/nieoihecpgapeodjpieehabgddjihegf?hl=en)
2. Kliknij "Add to Chrome"
3. Rozszerzenie będzie automatycznie zapisywać twoje workflow n8n podczas pracy

### Opcja 2: Userscript

Dla tych, którzy preferują większą kontrolę lub używają innych przeglądarek, jest rozwiązanie w postaci userscriptu:

**[n8n-autosave-userscript na GitHubie](https://github.com/cybertigro/n8n-autosave-userscript)**

Wymaga to managera userscriptów jak Tampermonkey lub Greasemonkey, ale daje większą elastyczność w dostosowaniu zachowania.

**Jak zainstalować:**
1. Zainstaluj manager userscriptów:
   - **Chrome/Edge/Brave:** [Tampermonkey](https://www.tampermonkey.net/)
   - **Firefox:** [Tampermonkey](https://www.tampermonkey.net/) lub [Greasemonkey](https://www.greasespot.net/)
   - **Safari:** [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
2. Odwiedź [repozytorium GitHub](https://github.com/cybertigro/n8n-autosave-userscript)
3. Kliknij na plik `.user.js`, a następnie "Raw"
4. Twój manager userscriptów zapyta czy chcesz zainstalować
5. Skonfiguruj interwał autosave w ustawieniach skryptu jeśli potrzeba

## Moje zdanie

Rozumiem obie strony argumentu. Power userzy, którzy robią skomplikowany development workflow, potrzebują możliwości eksperymentowania bez auto-commitowania każdej zmiany. Ale dla większości użytkowników tracenie godzin pracy przez zamknięcie klapki laptopa lub crash przeglądarki jest niedopuszczalne w 2025 roku.

Rozwiązanie jest oczywiste: **zróbcie to opcjonalnym**. Dajcie użytkownikom toggle w ustawieniach. Ci, którzy potrzebują ręcznej kontroli, mogą wyłączyć, a reszta z nas może pracować bez strachu przed utratą wszystkiego.

Dopóki n8n nie zaimplementuje właściwego rozwiązania z trybem draft i historią wersji, używaj jednego z workaroundów community powyżej. Twoje przyszłe ja podziękuje ci, gdy nie stracisz 3 godzin pracy.

:::tip[ ]
**Pro tip:** Nawet z auto-save, wyrabiaj nawyk wciskania `cmd/ctrl + s` po ukończeniu znaczącej części pracy. Stare nawyki umierają powoli, ale też ratują tyłek.
:::

![Reminder to auto-save](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXczOG01bmR2b2h6dDlxOWZzcGswaWFza3pnbmxvY290OGV2cmZqaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RmxEhuRQLGtVLdSWAt/giphy.gif)

## Podsumowanie

n8n to niesamowite narzędzie do automatyzacji, ale brak auto-save to prawdziwy pain point. Community dostarczyło tymczasowe rozwiązania, a developerzy są świadomi problemu.

Na teraz:
1. Zainstaluj rozszerzenie przeglądarki lub userscript
2. Trenuj się w ręcznym zapisywaniu (pamięć mięśniowa to twój przyjaciel)
3. Rozważ używanie kopii workflow do eksperymentalnych zmian
4. Czekaj na oficjalną implementację z właściwym trybem draft

Nie pozwól, żeby brakująca funkcja powstrzymała cię od używania n8n - to wciąż jedno z najlepszych self-hostowanych narzędzi do automatyzacji.

---

**Przydatne linki:**
- [Oficjalna strona n8n](https://n8n.io/)
- [AutoSave8n Chrome Extension](https://chromewebstore.google.com/detail/autosave8n/nieoihecpgapeodjpieehabgddjihegf?hl=en)
- [n8n-autosave-userscript na GitHubie](https://github.com/cybertigro/n8n-autosave-userscript)
- [Dyskusja community: Why doesn't n8n autosave?](https://community.n8n.io/t/why-doesnt-n8n-autosave-i-just-lost-2-hours-of-work/150207)
- [Dyskusja community: Autosave for workflows](https://community.n8n.io/t/autosave-for-workflows/234/29)
