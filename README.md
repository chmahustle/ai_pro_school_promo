# AI Pro School — сайт и ЦА-лендинги

Next.js 15 (App Router, SSG) · React 19 · TypeScript · Tailwind CSS v4 · framer-motion · react-hook-form + zod.

## Запуск

```bash
npm install
cp .env.example .env.local   # заполнить при необходимости
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint && npm run typecheck
```

## Маршруты

| URL | Что |
|---|---|
| `/` | Главная: доверие и доказательства |
| `/for/business` · `/for/freelancers` · `/for/career` | Рекламные лендинги (минимальный хедер, форма с UTM) |
| `/courses` · `/courses/ai-creator` · `/courses/practicum` · `/courses/vibecoding` | Каталог и страницы курсов |
| `/reviews` | Все результаты и отзывы (табы: видео / текст / оплаты / переписки) |
| `/about` · `/contacts` · `/blog` (заглушка) · `/privacy` | Служебные |
| `/thanks?src=…&interest=…` | Страница «спасибо» для пикселей (noindex) |
| `/ai2026` → `/courses/ai-creator`, `/prakticum` → `/courses/practicum` | 301 со старых URL |
| `/sitemap.xml` · `/robots.txt` | Генерируются автоматически |

## Структура

```
src/
  app/            маршруты (route-группы: (site) — с хедером/футером, (landing) — лендинги)
  components/ui   Button, Pill, Card, Badge, Input/Select/Checkbox, Accordion, Modal, Lightbox,
                  Counter, Marquee, Reveal, MediaPlaceholder, PlaceholderBadge, Section
  components/layout  Header, MegaMenu, MobileMenu, Footer, LandingHeader, FloatingMessenger, Analytics
  components/sections  HomeHero, Metrics, ResultsGrid, ReviewsWall, CoursesCatalog, Team, HowItWorks,
                       FAQ, LeadForm, LeadSection, Pricing, Programs, CourseHero, landing/*
  data/           ВЕСЬ контент и цифры: metrics, audiences, courses, results, reviews, team, partners, faq
  lib/            site (константы), seo, analytics, utm, leads (schema + адаптеры), og, motion, utils
  i18n/           словари RU/KZ (KZ — заготовка с фолбэком на RU), LocaleProvider
  styles/         globals.css (@theme токены), fonts (self-hosted woff2 + woff для OG)
```

## Данные и статусы проверки

Каждая цифра/кейс/отзыв в `src/data/*` имеет `status`:

- `verified` — подтверждено, показывается;
- `unverified` — есть в источниках, но расходится; **не выводится** без явного флага
  (`SHOW_UNVERIFIED_METRICS` в `data/metrics.ts`), в dev помечается жёлтым бейджем `UNVERIFIED`;
- `placeholder` — заглушка под вёрстку; в dev — красный бейдж `PLACEHOLDER`, в проде не рендерится
  (метрики) либо рендерится как заглушка без бейджа (медиа). Для финальной проверки на проде:
  `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`.

Статус резидентства Astana Hub: `astanaHub.show = false` в `data/metrics.ts` — не показывается.

## Заявки

`POST /api/lead` → zod-валидация → адаптер из `LEADS_ADAPTER` (`mock` | `webhook` | `telegram`), см. `src/lib/leads/adapters.ts`.
В заявке уходят: имя, телефон (нормализован до `7XXXXXXXXXX`), направление, комментарий, `formId`, страница, UTM/clid-метки (first-touch в сессии).
После успеха — редирект на `/thanks`.

## Аналитика

`src/lib/analytics.ts` — единая точка. Пиксели подключаются при наличии ID в `.env` (Meta, TikTok, GA4, Яндекс.Метрика).
События: `page_view`, `view_landing`, `cta_click`, `lead_start`, `lead_submit`, `lead_success`, `messenger_click`.

## OG-картинки

Генерируются на билде (`ImageResponse`) для `/courses/[slug]` и `/for/[audience]`.
Общая картинка — статический `public/og/default.png`; пересоздать после правок `src/app/opengraph-image.tsx`:
`npm run dev` → `curl localhost:3000/opengraph-image > public/og/default.png`.

## Локализация

`ENABLED_LOCALES` в `src/i18n/index.ts` — сейчас только `ru`. Для KZ: заполнить `i18n/dictionaries/kz.ts`,
добавить `kz` в `ENABLED_LOCALES`. Контент из `data/*` пока только RU (следующий шаг — `LocalizedString` в типах).

См. `TODO.md` — список мест, где нужно подставить реальные данные.
