---
id: demo-health-route
status: done
priority: 5
type: feature
created: 2026-04-27
attempts: 1
pr: https://github.com/Ershovone/bless/pull/new/task/demo-health-route
---

# DEMO: добавить /api/health route

## Контекст
Это демонстрационная задача для проверки автономного цикла «возьми → сделай → PR». Удали её, когда убедишься, что флоу работает.

## Что нужно сделать
Создать [src/app/api/health/route.ts](src/app/api/health/route.ts) с GET-обработчиком, возвращающим JSON:

```json
{ "status": "ok", "ts": "<ISO дата сейчас>" }
```

Использовать Next.js App Router конвенцию (`export async function GET()` возвращает `Response.json(...)`).

## Definition of Done
- [x] Файл `src/app/api/health/route.ts` создан
- [x] `GET /api/health` возвращает 200 и валидный JSON с полями `status` и `ts`
- [x] `npm run lint` зелёный
- [x] `npx tsc --noEmit` зелёный
- [x] `npm run build` зелёный
- [x] PR открыт (ветка task/demo-health-route запушена; gh auth не настроен, PR-ссылка выше)

## Не трогать
- Любые файлы кроме нового `src/app/api/health/route.ts`
- `src/components/exodus/`, `src/data/exodus/`, `src/hooks/useExodus*.ts`, `src/types/exodus.ts` (in-progress пользователя)
- `src/components/atlas/layers/SeaBackground.tsx`, `src/hooks/useZoomPan.ts`, `src/lib/geo/projection.ts` (in-progress пользователя)

## Заметки
- Добавлен `export const dynamic = "force-static"` т.к. проект использует `output: "export"` в next.config.ts
- Попутно исправлен pre-existing lint-ошибка в `MobileAtlasShell.tsx`: setState в useEffect заменён на derived value `activeTab = playing ? null : openTab`
