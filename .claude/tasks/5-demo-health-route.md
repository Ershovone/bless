---
id: demo-health-route
status: open
priority: 5
type: feature
created: 2026-04-27
attempts: 0
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
- [ ] Файл `src/app/api/health/route.ts` создан
- [ ] `GET /api/health` возвращает 200 и валидный JSON с полями `status` и `ts`
- [ ] `npm run lint` зелёный
- [ ] `npx tsc --noEmit` зелёный
- [ ] `npm run build` зелёный
- [ ] PR открыт

## Не трогать
- Любые файлы кроме нового `src/app/api/health/route.ts`
- `src/components/exodus/`, `src/data/exodus/`, `src/hooks/useExodus*.ts`, `src/types/exodus.ts` (in-progress пользователя)
- `src/components/atlas/layers/SeaBackground.tsx`, `src/hooks/useZoomPan.ts`, `src/lib/geo/projection.ts` (in-progress пользователя)
