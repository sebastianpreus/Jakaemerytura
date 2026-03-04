# CLAUDE.md – Dokumentacja projektu: jakaemerytura.pl

## Cel projektu

Strona jakaemerytura.pl to **lejek sprzedażowy** dla doradcy finansowego specjalizującego się w oszczędzaniu na emeryturę. Głównym celem każdej podstrony jest skłonienie użytkownika do kontaktu (formularz lub telefon), nie edukacja samodzielnego działania.

Strona buduje świadomość problemu emerytalnego, pokazuje że istnieją rozwiązania, ale sugeruje że dobór rozwiązania wymaga indywidualnej konsultacji z ekspertem.

---

## Filozofia treści – lejek sprzedażowy

Każda podstrona i sekcja powinna prowadzić użytkownika przez schemat:

```
1. PROBLEM     → "Czy wiesz, że emerytura z ZUS to może być tylko 30% Twojej pensji?"
2. MOŻLIWOŚĆ   → "Istnieją rozwiązania takie jak IKE, IKZE, PPK..."
3. KOMPLIKACJA → "Ale dobór zależy od Twojej sytuacji, wieku, dochodów, celów"
4. CTA         → "Umów bezpłatną konsultację – dobierzemy rozwiązanie dla Ciebie"
```

**Nigdy nie piszemy:** instrukcji krok po kroku jak samodzielnie otworzyć produkt.  
**Zawsze piszemy:** co dany produkt daje i dlaczego warto porozmawiać z ekspertem.

---

## Stack technologiczny

- Czysty HTML5 + CSS3 + Vanilla JavaScript
- Bez frameworków (bez React, Vue, Angular)
- Bez backendu, bez bazy danych, bez logowania
- Chart.js (CDN) – wykresy
- Formspree – obsługa formularza kontaktowego (zamiast mailto:)
- Wspólny `style.css` i `script.js` dla wszystkich podstron

---

## Struktura plików

```
/
├── index.html                  ← strona główna
├── style.css                   ← wspólne style
├── script.js                   ← wspólne skrypty
├── obrazy/
│   └── hero-background.jpg
├── problem/
│   ├── emerytura-z-zus.html
│   ├── inflacja.html
│   └── demografia.html
├── produkty/
│   ├── ike.html
│   ├── ikze.html
│   ├── ppk.html
│   ├── ppe.html
│   └── obligacje-skarbowe.html
├── inwestowanie/
│   ├── etf-fundusze.html
│   ├── nieruchomosci.html
│   └── zloto.html
└── kalkulatory/
    ├── index.html              ← lista wszystkich kalkulatorów
    ├── luka-emerytalna.html
    ├── kalkulator-ike.html
    ├── kalkulator-ikze.html
    ├── kalkulator-ppk.html
    └── procent-skladany.html
```

---

## Nawigacja główna

```
Logo (jakaemerytura.pl) | Problem | Produkty | Inwestowanie | Kalkulatory | [Bezpłatna konsultacja – button CTA]
```

- Logo linkuje do index.html
- "Bezpłatna konsultacja" to przycisk w stylu CTA zawsze widoczny w headerze
- Numer telefonu widoczny w headerze obok przycisku

---

## Elementy obecne na KAŻDEJ podstronie

### Header
- Logo
- Menu nawigacyjne
- Numer telefonu (klikalny tel:)
- Przycisk "Bezpłatna konsultacja" → scroll do formularza kontaktowego

### Floating button
- Przyklejony do ekranu podczas scrollowania (prawy dolny róg)
- Tekst: "📞 Bezpłatna konsultacja"
- Klik → scroll do formularza kontaktowego na danej stronie lub link do kontakt

### Formularz kontaktowy
- Obecny na każdej podstronie (w sekcji lub w footer)
- Pola: Imię, Email, Telefon (opcjonalnie), Wiadomość
- Wysyłka przez Formspree (nie mailto:)
- Po każdym kalkulatorze – CTA z linkiem do formularza

### Footer
- Logo + krótki opis
- Linki do podstron
- Dane kontaktowe
- Formularz kontaktowy

---

## Paleta kolorów i styl (zachować z obecnej wersji)

```css
--color-primary: #10b981;
--color-primary-dark: #059669;
--color-text: #333;
--color-text-light: #666;
--color-bg: #f8f9fa;
--color-white: #ffffff;
```

- Gradient: `linear-gradient(135deg, #10b981 0%, #059669 100%)`
- Border-radius kart: 15–20px
- Box-shadow kart: `0 10px 40px rgba(0,0,0,0.1)`
- Animacje fade-in przy scrollowaniu (IntersectionObserver – już działa)

---

## Szablon podstrony (każda podstrona produktu/artykułu)

```html
[HEADER wspólny]

[HERO – tytuł tematu + krótkie hasło]

[SEKCJA 1 – Problem: co grozi / czego nie wiedzą]

[SEKCJA 2 – Czym jest produkt/temat: krótko, korzyści]

[SEKCJA 3 – Kalkulator (jeśli dotyczy)]
  → Po kalkulatorze zawsze CTA: "Twoja sytuacja jest unikalna – porozmawiajmy"

[SEKCJA 4 – Dlaczego warto działać teraz (element pilności)]

[CTA BANNER – "Umów bezpłatną konsultację"]

[FOOTER wspólny z formularzem]
```

---

## Kalkulatory – zasady

- Każdy kalkulator pokazuje wynik w złotówkach (konkretna liczba działa lepiej niż procenty)
- Po pokazaniu wyniku zawsze pojawia się CTA: *"To Twoja indywidualna sytuacja. Skontaktuj się z nami, a dobierzemy najlepsze rozwiązanie."*
- Przycisk w kalkulatorze: **nie "Oblicz"** lecz **"Sprawdź swoją sytuację"**
- Wynik kalkulatora powinien wzmacniać potrzebę działania (pokazywać lukę / potencjał)

---

## Kontakt – dane

- Email: sebastian.preus@phinance.pl
- Formularz: Formspree (skonfigurować endpoint)
- Telefon: [uzupełnić]

---

## SEO – wytyczne

- Każda podstrona ma unikalny `<title>` i `<meta description>`
- H1 tylko jeden na stronę
- Używamy polskich słów kluczowych: "kalkulator IKE", "ile dostanę z ZUS", "oszczędzanie na emeryturę Polska"
- URL-e po polsku bez ogonków: `/produkty/ike`, `/kalkulatory/kalkulator-ike`

---

## Czego unikamy

- Instrukcji "jak samodzielnie otworzyć konto IKE w 5 krokach"
- Porównań konkretnych instytucji/brokerów (to rola doradcy)
- Sformułowania "sam możesz" – zamiast tego "razem możemy"
- Nadmiernie technicznego języka bez wyjaśnienia

---

## Deployment

### GitHub
- Repozytorium: https://github.com/sebastianpreus/Jakaemerytura
- Branch: master
- Pliki projektu znajdują się w katalogu roboczym: `C:\Users\Sebastian\CLAUDE\Jakaemerytura\repo\`

### FTP (hosting produkcyjny)
- Host: arche.iq.pl
- User: sajmonwhite_www
- Katalog docelowy: `/www/jakaemerytura.pl/`
- Upload via `curl -T <plik> ftp://arche.iq.pl/www/jakaemerytura.pl/<ścieżka> --user "sajmonwhite_www:<hasło>"`

### Workflow
1. Edytuj pliki w `repo/`
2. Commituj i pushuj na GitHub
3. Wgraj pliki na FTP do `/www/jakaemerytura.pl/`
