# AI Pro School — сайт школы

Маркетинговый сайт + рекламные лендинги по ЦА. Язык контента: RU (KZ — заготовка, `ENABLED_LOCALES = ["ru"]`).
Подробности запуска/маршрутов — `README.md`, список открытых данных клиента — `TODO.md`.

## Стек

- Next.js 15 (App Router, SSG), React 19, TypeScript
- Tailwind CSS v4 (токены в `@theme` в `src/styles/globals.css`, конфига `tailwind.config` нет)
- framer-motion, react-hook-form + zod, lucide-react, clsx + tailwind-merge (`cn()` в `src/lib/utils.ts`)
- Алиас импорта: `@/` → `src/`
- Команды: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`

## Дизайн-токены (`src/styles/globals.css`)

Цвета (использовать классы `bg-*/text-*` из токенов, не hex):
- Поверхности: `bg #f6f5fa`, `surface #fff`, `lavender #ece9ff`, `soft-100 #f3f1ff`, `soft-200 #e4e9ff`, `peach #ffe4d6`, `peach-100 #fff1ea`
- Тёмные поверхности (секции-панели, футер, тёмные карточки): `bg-dark #171717`; `ink` остаётся цветом текста, кнопок и пилюль
- Текст: `ink #14121f`, `ink-700 #2a2740`, `ink-500 #5f5b78`, `ink-300 #a6a3ba`, `ink-200 #d6d4e2`, `ink-100 #ebeaf2`
- Бренд (magenta, только мелкие акценты: иконки, бейджи, подчёркивания, цифры): `brand #e8307e`, `brand-600 #c9246a`, `brand-700 #a01d56`, `brand-200/100/50`
- Mesh-цвета: pink `#e8307e`, peach `#ffb088`, sky `#7ec8ff`, lavender `#b8a6ff`
- Семантика: `success #1f9d6b`, `danger #d9304f`
- Mesh-градиенты (`--mesh-home|business|freelance|career`, классы `.mesh-*`, `bg-gradient-*`) — только фон hero / финальный CTA / разделители. Текст и карточки — на `surface`/`bg`. Лайм и индиго не используем.
- Решение по палитре: ink `#14121F`, магента `#E8307E` (hover `#C9206A`, светлая `#FDEAF2`), сиреневый `#ECE9FF`/`#F3F1FF`, фон `#F6F5FA`.

Шрифты (`src/styles/fonts.ts`):
- Текст: **Manrope** (local woff2, variable 200–800) → `--font-manrope`, `font-sans`
- Заголовки: **Inter Tight** (700–800, next/font/google) → `--font-display`, класс `.font-display`; h1/h2 = 800, h3/h4 = 700
- Трекинг: H1/H2 `-0.015em`, H3 и мельче `0`. Длинные заголовки не капсом.
- Размеры: `text-display-xl|lg|md|sm` (clamp, tracking −0.03/−0.02em)
- Unbounded используется только в OG-картинках (`src/lib/og.tsx`)

Радиусы: `lg 16`, `xl 24`, `2xl 32`, `3xl 40`, `pill 999`. Тени: `shadow-soft|card|float|pill`. Отступы секций: `section 6rem`, `section-sm 4rem`; контейнер `.container-site` (max 1280).

Анимации: `animate-marquee|float|float-slow|mesh-drift`; всё должно уважать `prefers-reduced-motion`.

## Фирменный приём и CTA

- Белые S-образные ленты — фоновый слой за карточками (не блок): толстые кривые, обрезаются краем экрана, местами перетекают из секции в секцию. На тёмных панелях — тональные (белый ~12%), чтобы не сливаться с фоном страницы за скруглёнными краями и не перекрывать заголовки; на светлом — мягкий след. Не больше 4 мест (hero, «Школа в цифрах», результаты, финальный блок «Хотите так же?»). Карточки поверх — сплошные. Движение — только лёгкий параллакс, при reduced-motion статично; на мобильном тоньше/короче. Футер без лент: гигантское слово «AI Pro School» с градиентом логотипа, обрезанное краем.
- Кнопки «все результаты» не дублировать подряд: либо ссылка в шапке секции, либо слайд-CTA в конце карусели; одна общая панель — в «Хотите так же?».

## Ритм главной

Светлые и тёмные панели (`bg-dark`, как футер) чередуются: Hero (mesh) → Logos → **Цифры (dark)** → Выбор пути (light) → **Результаты (dark)** → Курсы → Как это работает → **«Хотите так же?» (dark)** → FAQ → Заявка (mesh) → Футер (dark). Шапка секций — единый `SectionIntro` (пилюля · h2 · описание · действие).

## Видео и автодвижение

- Автоплей только `muted` + `playsInline`, звук по клику, играть только в зоне видимости, `preload="none"`, при `prefers-reduced-motion` не воспроизводить.
- Любое автодвижение (марки, карусели): пауза по hover/focus и кнопка паузы с реальным состоянием.
  Исключение по решению владельца: меняющееся слово в hero (`HeroTitle`) и лента «Где нас видели» (`Marquee`) — без кнопки паузы (у ленты пауза по hover/focus); оно является ссылкой на курс, стоит на паузе по hover/focus и не крутится при reduced-motion.

## Правила данных

Весь контент и цифры живут в `src/data/*` (компоненты не хардкодят цифры/кейсы). Целевое правило: каждая запись в `src/data/*.ts` имеет `verified`, `consent`, `source`, `asOf`; новых цифр и отзывов не придумывать. Сейчас есть две модели проверки (унифицировать):

1. **`status: "verified" | "unverified" | "placeholder"`** (`Verifiable` из `src/lib/placeholders.ts`) — Metric, ResultCase, Review, TeamMember, Tariff, comparison.
2. **Булевы поля** — `Story` (`verified`, `consent`, `source`, `asOf`, `placeholder?`), `HomeMetric` (`verified`, `source`, `sourceUrl`, `asOf`), `Partner` (`verified`, `logoPermission`), works/testimonials (`verified`, `consent`, `views.verified`), `heroResults.verified`.

Что показывается:
- **Прод** (`NODE_ENV=production`, `SHOW_PLACEHOLDERS=false`):
  - метрики — только `verified` (`SHOW_UNVERIFIED_METRICS = false`, `getPublishedMetrics`, `getHomeMetrics`);
  - Story — только `verified && consent`; цитата — только `quote.verbatim`; receipt-медиа — только `piiBlurred`; слот медиа без файла не рисуется;
  - кейсы учеников/B2B-кейсы на главной — `verified && consent` (`getBusinessCases…`), если <3 — секция скрыта;
  - партнёры — `verified && logoPermission`; просмотры у works/testimonials — только `views.verified`;
  - `placeholder` не рендерится вообще (метрики, списки) либо рендерится как нейтральная заглушка **без бейджа** (медиа);
  - `astanaHub.show = false` — резидентство не показываем.
- **Dev** (`SHOW_PLACEHOLDERS`): показывается всё, поверх — `<PlaceholderBadge>` (красный PLACEHOLDER / жёлтый UNVERIFIED). Для финальной проверки на проде: `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`.
- `filterForPublish()` для списков (results/reviews): `verified` всегда, `unverified` — по умолчанию да (контент с действующих сайтов), `placeholder` — только dev.
- Любые служебные тексты (`note`, `TODO`, `priceNote`, «Нужно: …») — **только в dev**, в проде пользователь их видеть не должен.
- Поля `source` / `asOf` — это метаданные для проверки данных (кто и когда подтвердил); в карточках для посетителей их не выводим (подпись источника допустима только как осознанный дизайнерский элемент `Story.source`, без сырого URL как CTA). Поле в данных заполнять обязательно.
- Меньше 3 подтверждённых кейсов — блок скрывается целиком.
- В проде не показывать: источник, у которого есть собственный лендинг, и выдуманные даты (например «октябрь 2026»).
- Юр. данные (название ТОО/ИП, БИН, адрес) — в `src/data/company.ts`; пока пусто — заглушка только в dev.
- PLACEHOLDER-бейджи только в dev и вне потока текста (не внутри строки).
- Бейджи — только через `PlaceholderBadge`/`Placeholder` (сами проверяют `SHOW_PLACEHOLDERS`); не рисовать собственные dev-метки.

## Правило для ₸ и длинных чисел

- Сумма всегда с неразрывным пробелом перед знаком: `500 000 ₸` (`formatTenge()` из `lib/utils.ts`; в данных — ` ₸`).
- Разряды в числах — неразрывные (`formatNumber` отдаёт ` `); в строках данных тоже не обычный пробел.
- Любой узел с суммой/длинным числом получает `whitespace-nowrap` (число + ₸ не переносятся и не рвутся посреди разряда). Для произвольного текста из `data/*` использовать общий хелпер, который оборачивает `\d[\d\s.,]*\s*₸` в nowrap-span (пример — `ResultLine` в `HomeHero.tsx`).
- «МЛН+» и ₸: неразрывный пробел + `white-space: nowrap`, единица мельче числа.
- Единицы в метриках (`млн+`, `тыс.+`, `₸`) — с ` ` в `suffix`.

## Контент

- **Цены, даты, названия продуктов, CTA и ссылки — только из `src/data/products.ts`** (`getProduct`, `formatPrice`/`ProductPrice`, `getCurrentPrice`, `getNextCohort`). Названия сущностей — только из `src/data/vocabulary.ts` («Курс AI Content Creator», «вайб-кодинг», «Курс вайб-кодинга», Эфир «Вайб-кодинг вживую», «Офлайн-урок в Astana Hub»). В компонентах и текстах их не хардкодить.
- **Ничего не выдумывать.** Неизвестное значение (цена, дата, цифра рассрочки) = `null` и на сайте не показывается: без «Цена уточняется», «скоро», выдуманных дат. Дата эфира, с которой он станет платным, пока `null` → показываем «бесплатно».
- Интенсив и VIP на сайте не упоминаем.
- **Внутренние коммерческие цифры** (рекламный бюджет, возвраты, доля рассрочки и т.п.) в репозиторий и на сайт не попадают — ни в данные, ни в комментарии.
- `scripts/check-copy.mjs` (prebuild) валит сборку, если вне dev-блоков есть «Цена уточняется», «TODO(клиент)», «Старт 20 апреля», «20 апреля» (дат старта в данных курсов строкой не храним — только `getNextCohort`). Комментарии не проверяются (пометки `TODO(клиент)` в комментариях разрешены). Dev-блок = строка с `SHOW_PLACEHOLDERS`, участок между `// dev-only:start` и `// dev-only:end`, строка с `copy-check:ignore`.
- **Данные и браузер:** модули данных (`src/data/*`) — `server-only`; в клиентские компоненты передаются только публичные модели через `toPublic*` из `src/data/public.ts` (типы — `public-types.ts`). Новые поля данных по умолчанию не публичные: попадают в клиент только после явного добавления в публичную модель. Секреты (`META_CAPI_TOKEN` и др.) — только серверный env, без `NEXT_PUBLIC_`. `scripts/check-payload.mjs` (postbuild) валит сборку при утечке.
- **Аналитика:** Meta Pixel, TikTok, GA4, Яндекс.Метрика подключаются только если задан ID в env и только в production; события — через `track()` из `src/lib/analytics.ts`; Lead/Contact дублируются в Meta CAPI (`/api/capi`) с общим `event_id`. Поля ввода закрыты от вебвизора классом `ym-disable-keys` (уже в `Input`/`Textarea`).
- **Процесс:** после каждого шага — коммит; отчёт таблицей «пункт / сделано / не сделано / причина»; визуальная проверка на 375 и 1440 px.

## Скриншоты (Playwright без sudo)

- Разово: `bash scripts/shots-setup.sh` — ставит Playwright и Chromium в `~/.cache/ai-pro-school-shots` и скачивает системные библиотеки (libnss3, libnspr4, libasound) в `libs/` без sudo; `shots.mjs` сам подставляет `LD_LIBRARY_PATH` (вручную: `export LD_LIBRARY_PATH=$HOME/.cache/ai-pro-school-shots/libs/usr/lib/x86_64-linux-gnu`). Если Chromium падает с «libnss3.so not found» — запустить setup.
- Сайт: `bash scripts/shots-serve.sh 3111` — production-копия в `/tmp/aps-shots-site` на своём порту. **Не собирать и не снимать в основной папке при запущенном `npm run dev`**: `.next` общий, сборка ломает dev (500), а dev-файлы дают в prod «смесь» (не гидратируется страница, 404 на чанки). Остановить: `kill $(ss -ltnp | grep ':3111' | grep -o 'pid=[0-9]*' | cut -d= -f2)`.
- Снимки: `node scripts/shots.mjs --base http://localhost:3111 / /thanks/practicum /for/business` → `tmp/shots/<страница>-<375|1440>-<top|form|bottom>.png` (папка в .gitignore). Скриншоты смотреть через Read.
- Проверка телефона/форм: `npm test` (чистые функции, `node --test`).

## Структура

```
src/app
  layout.tsx, not-found, robots, sitemap, opengraph-image
  (site)/      с Header/Footer: page (/), about, contacts, blog, privacy, reviews, thanks,
               courses (page + [slug] + opengraph-image)
  (landing)/   минимальный хедер: for/[audience] (+ opengraph-image)
  api/lead/    POST заявки → zod → адаптер LEADS_ADAPTER (mock|webhook|telegram)
src/components
  ui/          Button, Pill, Badge, Card, Input, Accordion, Modal, Lightbox, Counter, Marquee, Reveal,
               Section, Avatar, StoryCard, MediaPlaceholder, PlaceholderBadge, MeshBackdrop, …
  layout/      Header, MegaMenu, MobileMenu, Footer, LandingHeader/Footer, FloatingMessenger, Analytics, LangSwitch
  sections/    HomeHero, HomeMetrics, HomeStories, AudienceSwitcher, CoursesCatalog, CourseHero/Details,
               Pricing, Programs, Team, FAQ, LeadForm/LeadSection/LeadModal, ReviewsWall/Archive/Sections,
               ResultsGrid, BusinessCasesSection, WorksMarquee, TestimonialsCarousel, landing/*
src/data       metrics, audiences, courses, results, stories, reviews, testimonials, works, heroResults,
               team, partners, faq, company, types
src/lib        site, seo, analytics, utm, leads/*, og, motion, mesh, placeholders, phone-mask, utils
src/i18n       dictionaries ru/kz, LocaleProvider
src/styles     globals.css (@theme), fonts.ts, fonts/ (woff2 + og/*.woff)
```

## Соглашения

- Секции собирать из `ui/Section` + `SectionHead`; анимации появления — `Reveal*`.
- Новая цифра/кейс/отзыв → сначала в `src/data/*` с полями проверки, потом в компонент.
- Заявки: телефон нормализуется до `7XXXXXXXXXX`, UTM first-touch; события аналитики — только через `lib/analytics.ts`.
- Не менять `README.md`/`TODO.md` без запроса; новые заглушки отмечать `TODO(клиент)` и добавлять в `TODO.md`.
