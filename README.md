# 🗺️ Atlas Osiągnięć

Osobisty tracker sportowych osiągnięć - aplikacja do śledzenia postępów w różnych kategoriach sportowych wyzwań.

## 🚀 Funkcjonalności

### Kategorie Osiągnięć
- **🏔️ Korona Europy** - Najwyższe szczyty każdego kraju europejskiego (47 szczytów)
- **🗻 Korona Polski** - Najwyższe szczyty wszystkich województw Polski (16 szczytów)
- **🏃 Maratony Świata** - Najsłynniejsze maratony na świecie (20 maratonów)
- **🥾 Trekkingi** - Długodystansowe szlaki trekkingowe (25 szlaków)

### Główne Funkcje
- ✅ Śledzenie postępów w każdej kategorii
- 📊 Statystyki i procenty ukończenia
- 🎯 Szczegółowe informacje o każdym osiągnięciu
- 📱 Responsywny design
- 🌙 Dark theme z gradientami
- ⚡ Szybkie przejścia i animacje

## 🛠️ Technologie

- **Next.js 15** - React framework z App Router
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Najnowsza wersja React

## 📦 Instalacja i Uruchomienie

### Wymagania
- Node.js 18+ 
- npm lub yarn

### Kroki instalacji

1. **Sklonuj repozytorium**
   ```bash
   git clone <repository-url>
   cd atlas-osiagniec
   ```

2. **Zainstaluj zależności**
   ```bash
   npm install
   ```

3. **Uruchom serwer deweloperski**
   ```bash
   npm run dev
   ```

4. **Otwórz aplikację**
   - Przejdź do [http://localhost:3000](http://localhost:3000)
   - Aplikacja automatycznie się przeładuje przy zmianach w kodzie

## 🏗️ Struktura Projektu

```
src/
├── app/                    # Next.js App Router
│   ├── [category]/        # Dynamiczne strony kategorii
│   ├── achievement/[id]/  # Strony szczegółów osiągnięć
│   ├── globals.css        # Globalne style
│   ├── layout.tsx         # Główny layout
│   ├── page.tsx           # Strona główna
│   └── not-found.tsx      # Strona 404
├── components/            # Komponenty React
│   ├── AchievementCard.tsx
│   ├── CategoryCard.tsx
│   └── Header.tsx
├── data/                  # Mock data
│   └── achievements.ts
└── types/                 # Definicje TypeScript
    └── index.ts
```

## 🎨 Design System

### Kolory
- **Primary**: Niebieski gradient (#3b82f6 → #06b6d4)
- **Background**: Ciemny gradient (#0f172a → #1e293b)
- **Cards**: Półprzezroczyste tło z backdrop blur
- **Text**: Biały i szary z różnymi poziomami przezroczystości

### Komponenty
- **CategoryCard**: Karty kategorii z progress bar
- **AchievementCard**: Karty pojedynczych osiągnięć
- **Header**: Nawigacja z logo i menu

## 📱 Responsywność

Aplikacja jest w pełni responsywna i działa na:
- 📱 Telefonach (mobile-first)
- 💻 Tabletach
- 🖥️ Desktopach

## 🔧 Skrypty NPM

- `npm run dev` - Uruchom serwer deweloperski
- `npm run build` - Zbuduj aplikację produkcyjną
- `npm run start` - Uruchom aplikację produkcyjną
- `npm run lint` - Sprawdź kod ESLint

## 🚀 Deployment

Aplikacja może być wdrożona na:
- **Vercel** (zalecane dla Next.js)
- **Netlify**
- **AWS Amplify**
- Dowolny hosting z obsługą Node.js

## 📊 Mock Data

Aplikacja zawiera realistyczne przykładowe dane:
- **Korona Europy**: Mont Blanc, Matterhorn, Elbrus, Ben Nevis
- **Korona Polski**: Rysy, Śnieżka, Łysica, Biskupia Kopa
- **Maratony**: Boston, London, Tokyo, New York
- **Trekkingi**: Camino de Santiago, Appalachian Trail, Inca Trail

## 🎯 Przyszłe Rozszerzenia

- [ ] System logowania użytkowników
- [ ] Możliwość dodawania własnych osiągnięć
- [ ] Zdjęcia i galerie
- [ ] System komentarzy i notatek
- [ ] Eksport danych do PDF
- [ ] Integracja z mapami
- [ ] System powiadomień
- [ ] Aplikacja mobilna

## 🤝 Współpraca

1. Fork projektu
2. Utwórz branch dla nowej funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT. Zobacz plik `LICENSE` dla szczegółów.

---

**Atlas Osiągnięć** - Śledź swoje sportowe marzenia! 🏔️🏃🥾
