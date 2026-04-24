# Bless — Атлас Библии

Интерактивный атлас библейских путешествий. Первая страница — путешествия апостола Павла (Деяния 13–28). Задуман как флагманская страница будущего сайта «Атлас Библии» с расширениями под Бытие, Исход, Царства, Евангелия.

**Стек:** Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind 4 · d3-geo · topojson-client · Zustand.

## Разработка

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

## Архитектура

```
src/
├── app/                   # роуты App Router
│   ├── page.tsx           # лендинг с карточками книг
│   ├── paul/              # «Путешествия Апостола Павла»
│   │   ├── page.tsx
│   │   └── journey/[slug]/page.tsx   # SSG по каждому путешествию
│   └── not-found.tsx
├── components/
│   ├── layout/            # BibleNav, PageHeader, Ornament, PageBackground, SectionLabel
│   ├── atlas/             # AtlasMap + layers/ (Land, Routes, Cities, Labels, Grid, ScaleBar, Compass, Traveler…)
│   ├── controls/          # JourneyTabs, InfoCard, ViewToggles, PlayButton
│   └── panels/            # CompanionsPanel, LegDistancesPanel, ChronologyScrubber, ActsIndex, ScriptureQuote, CityDetailPanel
├── hooks/                 # useAtlasStore (Zustand), useProjection, useWorldTopology,
│                          # usePlayback, useZoomPan, useURLSync
├── lib/
│   ├── geo/               # projection, haversine, bezier/route utils
│   ├── routes/            # estimateLeg — эвристика sea/land + скорости
│   ├── topojson/          # загрузка и фильтрация countries-50m.json
│   └── seo/               # metadata, JSON-LD, basePath-aware paths
├── data/                  # типизированные данные (cities, journeys, timeline, cityDetails, epistles, companions)
├── constants/             # design tokens, карта-константы, label-offset
└── types/                 # доменные типы (CityId, Journey, Companion, RouteMode…)
```

### Дизайн-токены

Хранятся единым источником в `src/constants/design.ts` (для JS/SVG) и зеркалятся как CSS-переменные в `src/app/globals.css` через `@theme`. SVG-слои карты используют `var(--color-…)`.

### Расширение под новую книгу

1. Добавить запись в `src/components/layout/BibleNav.tsx` и карточку в `src/app/page.tsx` (`enabled: true`).
2. Создать `src/app/<slug>/page.tsx` и переиспользовать `PageHeader`, `AtlasMap`, панели.
3. Данные — отдельным модулем в `src/data/<book>/`. Типы (`Journey`, `City`, `Companion` и т.д.) generic и переиспользуемы.

## Деплой на GitHub Pages

1. Создать репозиторий на GitHub (например, `bless`).
2. Запушить код. Workflow `.github/workflows/deploy.yml` автоматически билдит `next build` с `output: "export"` и `basePath=/<repo>`, затем публикует `out/` через GitHub Pages.
3. В настройках репозитория: Settings → Pages → Source → **GitHub Actions**.

Локальный билд для проверки:

```bash
NEXT_PUBLIC_BASE_PATH=/bless \
NEXT_PUBLIC_SITE_URL=https://<user>.github.io/bless \
npm run build
npx serve out
```

## Скрипты

| команда           | назначение                                  |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | локальный dev-сервер                        |
| `npm run build`   | статический билд → `out/`                   |
| `npm run lint`    | ESLint                                      |

## Источники

- Карта: [world-atlas@2.0.2](https://unpkg.com/world-atlas@2.0.2/countries-50m.json) (Natural Earth, бандлится локально).
- Географические расчёты: `d3-geo` (Mercator fit-to-bounds), Haversine для дистанций.
- Шрифты: Cormorant Garamond, EB Garamond, Inter через `next/font/google`.
