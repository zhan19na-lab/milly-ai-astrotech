# Milly — AI AstroTech Assistant
## Исследование и документация разработки (Шаги 1–4)

---

## Оглавление

1. [Концепция продукта](#концепция-продукта)
2. [Технический стек](#технический-стек)
3. [Архитектура проекта](#архитектура-проекта)
4. [Шаг 1 — Фундамент и PWA](#шаг-1--фундамент-и-pwa)
5. [Шаг 2 — Hero-секция и Bento Grid](#шаг-2--hero-секция-и-bento-grid)
6. [Шаг 3 — Виджет синхронизации](#шаг-3--виджет-синхронизации)
7. [Шаг 4 — Чат с Милли и API](#шаг-4--чат-с-милли-и-api)
8. [Дизайн-система](#дизайн-система)
9. [Запуск проекта](#запуск-проекта)
10. [Дорожная карта](#дорожная-карта)

---

## Концепция продукта

**Milly** — гибридный продукт (сайт + мобильное PWA-приложение) в нише AI-автоматизации и AstroTech.

**Позиционирование:** ИИ-наставник на стыке глубокой психологии, астрологии и нумерологии. Целевая аудитория — люди в состоянии жизненного кризиса (работа, отношения, финансы, здоровье), которым нужен быстрый, эмпатичный и структурированный «рецепт спасения» без заумных терминов.

**Ключевые отличия от конкурентов:**
- Dark Mode by Default с неоновой киберпанк-эстетикой
- Ощущение нативного мобильного приложения (PWA, `user-scalable=no`)
- Машина состояний вместо статичных страниц
- «Живое мышление» ИИ: 4 шага сканирования перед ответом
- Freemium-лимит для монетизации (3 бесплатных запроса в день)

---

## Технический стек

| Слой | Технология | Версия | Роль |
|---|---|---|---|
| Фреймворк | Next.js | ^15.3.1 | App Router, SSR, API Routes |
| Язык | TypeScript | ^5.7.3 | Типобезопасность |
| Стили | Tailwind CSS | ^3.4.17 | Utility-first, JIT, Dark Mode |
| Анимации | Framer Motion | ^11.13.1 | Переходы, spring, whileInView |
| Рантайм | React | ^19.0.0 | Server + Client Components |
| Деплой | Vercel | — | Edge Network, Auto-HTTPS |
| ИИ (roadmap) | Anthropic Claude | claude-opus-4-7 | Конечный AI-движок |

---

## Архитектура проекта

```
8-SoulMatrix/
│
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # POST /api/chat — AI endpoint
│   ├── globals.css               # Базовые стили, .glass-card, scrollbar
│   ├── layout.tsx                # Root Layout: PWA metadata, viewport
│   └── page.tsx                  # Server Component — оркестратор
│
├── components/
│   ├── nebula-background.tsx     # [CLIENT] Три анимированных орба (fixed)
│   ├── hero-section.tsx          # [CLIENT] Hero: заголовок, CTA, scroll-hint
│   ├── bento-grid.tsx            # [CLIENT] Сетка 4 карточек (3→1 col)
│   ├── sync-card.tsx             # [CLIENT] Виджет зеркальных чисел (3 фазы)
│   └── chat-card.tsx             # [CLIENT] Чат Милли (история, лоадер, лимит)
│
├── public/
│   ├── manifest.json             # PWA Manifest
│   └── icons/
│       └── README.md             # Инструкция по иконкам
│
├── tailwind.config.ts            # Брендовые цвета + тени glassmorphism
├── next.config.ts                # PWA-заголовки, sw.js headers
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

### Паттерн Server / Client разделения

```
app/page.tsx  ──[Server Component]──► импортирует 3 Client острова
                                         │
                              ┌──────────┼──────────┐
                              ▼          ▼          ▼
                     NebulaBackground  HeroSection  BentoGrid
                     [use client]      [use client] [use client]
                                                        │
                                              ┌─────────┼─────────┐
                                              ▼         ▼         ▼
                                          SyncCard  ChatCard  (Radar/Finance)
                                          [use client] [use client]
```

---

## Шаг 1 — Фундамент и PWA

### Цель
Создать неизменяемую основу: дизайн-токены, PWA-манифест, глобальные стили, корневой layout.

### Созданные файлы

#### `public/manifest.json`
```json
{
  "name": "Milly - AI AstroTech Assistant",
  "short_name": "Milly",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0D11",
  "theme_color": "#6D28D9",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "purpose": "any maskable" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "purpose": "any maskable" }
  ]
}
```

#### `tailwind.config.ts` — брендовая палитра
```typescript
colors: {
  "space-black":  "#0D0D11",   // базовый фон — космический чёрный
  "deep-indigo":  "#151522",   // поверхность карточек
  "neon-purple":  "#8B5CF6",   // основной акцент
  "neon-cyan":    "#06B6D4",   // дополнительный акцент / данные
  "vivid-violet": "#6D28D9",   // theme_color браузерного chrome
}
boxShadow: {
  "glass-glow": "0 8px 32px 0 rgba(139, 92, 246, 0.15)",
  "neon-glow":  "0 0 20px 2px rgba(139, 92, 246, 0.35)",
  "cyan-glow":  "0 0 20px 2px rgba(6, 182, 212, 0.30)",
}
```

#### `app/globals.css` — ключевые классы
```css
/* Glassmorphism-карточка (основной surface UI) */
.glass-card {
  background: rgba(21, 21, 34, 0.70);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.15);
}

/* Gradient text purple→cyan */
.text-neon {
  background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### `app/layout.tsx` — viewport без масштабирования
```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,      // нативное ощущение на мобайле
  viewportFit: "cover",     // контент под iOS notch
  themeColor: "#6D28D9",
};
```

### Проверка PWA в браузере
```
DevTools → Application → Manifest
URL: http://localhost:3000/manifest.json
```

---

## Шаг 2 — Hero-секция и Bento Grid

### Цель
Реализовать главный экран: космический фон, Hero с CTA, адаптивная Bento-сетка 4 карточек.

### Компоненты

#### `components/nebula-background.tsx`
Три анимированных орба с `position: fixed` (z-0):
- **Орб 1** — верхний-левый, `neon-purple`, `blur-[120px]`, цикл 9 сек
- **Орб 2** — верхний-правый, `neon-cyan`, `blur-[130px]`, цикл 12 сек, фаза +2.5 сек
- **Орб 3** — нижний-центр, `neon-purple`, `blur-[140px]`, цикл 15 сек, фаза +5 сек

Все орбы анимируются по `scale` + `opacity` через `framer-motion animate` с `repeat: Infinity`.

#### `components/hero-section.tsx`
Stagger-контейнер (`staggerChildren: 0.15`):
1. **Badge** — «AI AstroTech · Online 24/7» с `animate-pulse` точкой
2. **H1** — белый + `.text-neon` градиент
3. **Subtitle** — `text-white/52`
4. **CTA × 2**:
   - «Для Него» — `border-neon-cyan/40`, `hover:shadow-cyan-glow`
   - «Для Неё» — `bg-neon-purple`, `hover:shadow-neon-glow`
5. **Счётчик доверия** — 12K+ / 24/7 / 98%
6. **Scroll-hint** — `animate: { y: [0, 9, 0] }`, loop

#### `components/bento-grid.tsx`
Адаптивная сетка `grid-cols-1 md:grid-cols-3`:

| Карточка | Колонки | Содержимое |
|---|---|---|
| 1 — SyncCard | `md:col-span-2` | Виджет зеркальных чисел |
| 2 — RadarCard | `md:col-span-1` | Орбиты совместимости |
| 3 — FinanceCard | `md:col-span-1` | Прогресс-бары денежных циклов |
| 4 — ChatCard | `md:col-span-2` | Живой чат с Милли (`id="chat-milly"`) |

Все карточки обёрнуты в `BentoCard` с:
- `whileInView` stagger-анимацией (`delay` 0 → 0.22 сек)
- `whileHover: { scale: 1.018 }` spring-анимацией

---

## Шаг 3 — Виджет синхронизации

### Цель
Оживить Карточку 1: ввод зеркального числа → compile-loader → персональный манифест силы.

### Файл: `components/sync-card.tsx`

#### 3-фазная машина состояний

```
type Phase = "idle" | "loading" | "result"

"idle"
  └─[все 4 цифры OR клик]──► setPhase("loading")
                                    │
                               [1500 ms]
                                    │
                                    ▼
                              setPhase("result")
                                    │
                          [клик "← Ввести другой"]
                                    │
                                    ▼
                               setPhase("idle")
```

#### База манифестов

| Код | Название | Триггер |
|---|---|---|
| `1111` | Код пробуждения и синхронизации | Обнуление кармического опыта |
| `2222` | Код баланса и сборки личной силы | Эмоциональный перелом, границы |
| `1221` | Код разворота вектора | Освобождение от прошлого |
| `0000` | Код Великой Пустоты и Начала | Абсолютный чистый лист |
| `*` | Default | Персональный рецепт формируется |

#### CompileLoader — эффект сканирования (1380 ms)

```
t=0ms    ── Прогресс-бар старт, цифры начинают «бежать»
t=55ms   ── [Шаг 1]: > SCANNING CODE XX:XX... (терминальная строка)
t=430ms  ── [Шаг 2]: > MATCHING KARMIC DATABASE...
t=82%    ── Цифры «замирают» на реальном коде
t=820ms  ── [Шаг 3]: > CALCULATING PERSONAL VECTOR...
t=1190ms ── [Шаг 4]: > MANIFESTO COMPILED ✓
t=1380ms ── Прогресс = 100%
t=1500ms ── AnimatePresence переключает на ManifestoView
```

Прогресс-бар обновляется каждые 55 ms через `setInterval`.  
Случайные цифры генерируются до ~82% прогресса, затем фиксируются.

#### ManifestoView

- Код с пульсирующим `bg-neon-purple/20 blur-[26px]` ореолом
- Манифест в `border-neon-purple/15 bg-neon-purple/[0.06]` карточке
- CTA `«Получить полный SOS-рецепт у Милли»` → `document.getElementById("chat-milly")?.scrollIntoView({ behavior: "smooth" })`

#### UX-детали инпута
- `inputMode="numeric"` + `pattern="[0-9]*"` → цифровая клавиатура на iOS/Android
- Авто-фокус на следующую ячейку при вводе цифры
- Авто-возврат при `Backspace` на пустой ячейке
- Авто-триггер через **300 ms** после заполнения всех 4 ячеек (через `useEffect`)

---

## Шаг 4 — Чат с Милли и API

### Цель
Создать живой чат с бэкендом, 4-шаговым «мышлением» ИИ и Freemium-лимитом.

### Файл: `app/api/chat/route.ts`

#### System Prompt (готов к подключению Claude)
```typescript
export const MILLY_SYSTEM_PROMPT = `
Ты — Милли, эмпатичный ИИ-наставник на стыке психологии, точной астрологии 
и нумерологии. Твоя цель — дать быстрый, чёткий «рецепт спасения» без заумных 
терминов. Обязательно проявляй теплоту, но пиши по делу. В конце ответа всегда 
рекомендуй 1 конкретную психологическую или философскую книгу (с указанием 
главы/страницы), которая закрепит терапевтический эффект.
`;
```

#### Подключение Claude (Todo для Шага 5)
```typescript
// Заменить mock-блок в route.ts на:
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic();
const response = await anthropic.messages.create({
  model: "claude-opus-4-7",
  max_tokens: 600,
  system: MILLY_SYSTEM_PROMPT,
  messages: [{ role: "user", content: message }],
});
```

#### Mock-шаблоны ответов (5 тем + default)

| Ключевые слова | Тема | Книга |
|---|---|---|
| работ / карьер / босс / коллег | Рабочий кризис | «Никогда не ешьте в одиночку» · Феррацци |
| отношен / партнер / любов / измен | Отношения | «Женщины, которые любят слишком сильно» · Норвуд |
| деньг / долг / финанс / кредит | Финансы | «Думай и богатей» · Хилл |
| здоровь / стресс / тревог / паник | Здоровье / психика | «Тело помнит всё» · ван дер Колк |
| семь / родител / мам / пап | Семья | «Токсичные родители» · Форуард |
| `*` | Default | «Сила настоящего» · Толле |

Mock delay: `3400 – 4400 ms` — намеренно совпадает со временем показа 4 шагов.

### Файл: `components/chat-card.tsx`

#### Поток обработки сообщения

```
handleSend()
    │
    ├─ setMessages([...prev, { role: "user", text }])
    ├─ setIsLoading(true)
    │
    ├─ stepTimers × 4 ──── каждые 800 ms:
    │   t=800ms  → activeSteps: [0]       → 🟢 Шаг 1 появляется
    │   t=1600ms → activeSteps: [0,1]     → 🟢 Шаг 2 появляется
    │   t=2400ms → activeSteps: [0,1,2]   → 🟢 Шаг 3 появляется
    │   t=3200ms → activeSteps: [0,1,2,3] → 🟢 Шаг 4 появляется
    │
    └─ Promise.all([
           fetch("/api/chat"),        // ~3400–4400 ms
           allStepsDone (3600 ms)     // 4×800 + 400ms буфер
       ])
           │
           └─ оба resolve
                  │
                  ├─ setMessages([...prev, assistantMsg])
                  ├─ incrementDailyCount()
                  └─ setIsLoading(false) → ThinkingLoader исчезает
```

#### Freemium-лимит (localStorage)

```typescript
const LIMIT_KEY = "milly_free_usage";
const MAX_FREE  = 3;

// Структура хранилища:
// { date: "2026-05-14", count: 2 }

// Логика: если date !== today → count сбрасывается
// При count >= 3: инпут → LimitNotice с CTA «Получить доступ SOS»
```

#### 4 шага «мышления» Милли

```
🟢 [Шаг 1]: Запуск flatlib. Точный расчет координат планет и домов по дате... OK.
🟢 [Шаг 2]: Фильтрация человеческого фактора. Очистка от субъективных искажений... OK.
🟢 [Шаг 3]: Web Search. Сканирование текущей сетки транзитов реального времени... OK.
🟢 [Шаг 4]: Синтез эмпатичного рецепта спасения...
```

Каждый шаг появляется с анимацией `fade-in + slide-left (x: -10 → 0)`.

#### UI-особенности ChatCard

| Элемент | Решение |
|---|---|
| Окно чата | `h-[240px] overflow-y-auto` — не растягивает карточку |
| Скролл к новым сообщениям | `bottomRef.scrollIntoView({ behavior: "smooth" })` через `useEffect` |
| Textarea | Авто-рост 48px → 120px через `el.scrollHeight` в `useEffect` |
| Enter = отправить | `onKeyDown: e.key === "Enter" && !e.shiftKey` |
| Shift+Enter = новая строка | Стандартное поведение `textarea` |
| Кнопка отправки | `rounded-full h-12 w-12`, `shadow-[0_0_16px_rgba(139,92,246,0.52)]` |
| Hover кнопки | `shadow-[0_0_28px_rgba(139,92,246,0.78)]` |
| Книга-рекомендация | `border-neon-cyan/20 bg-neon-cyan/5` с иконкой 📚 |
| Счётчик лимита | `X / 3 бесплатных` в правом верхнем углу заголовка |

---

## Дизайн-система

### Цветовая палитра

```
#0D0D11  space-black   ── базовый фон (body, html)
#151522  deep-indigo   ── поверхность карточек, пузыри Милли
#8B5CF6  neon-purple   ── основной акцент (кнопки, индикаторы, тени)
#06B6D4  neon-cyan     ── данные, книги, вторичный акцент
#6D28D9  vivid-violet  ── theme_color PWA (chrome браузера)
```

### Анатомия glassmorphism-карточки

```
┌─────────────────────────────────────────────────────┐
│  background: rgba(21, 21, 34, 0.70)                 │
│  backdrop-filter: blur(12px)                         │
│  border: 1px solid rgba(255, 255, 255, 0.05)        │
│  border-radius: 16px                                 │
│  box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.15) │
└─────────────────────────────────────────────────────┘
```

### Анимационные константы (Framer Motion)

```typescript
// Появление элементов (stagger)
hidden: { opacity: 0, y: 24 }
visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] } }

// Hover карточек
whileHover: { scale: 1.018, transition: { type: "spring", stiffness: 280, damping: 22 } }

// Небула-орбы
animate: { scale: [1, 1.20, 1], opacity: [0.22, 0.32, 0.22] }
transition: { duration: 9, repeat: Infinity, ease: "easeInOut" }
```

### Мобильные требования

| Требование | Решение |
|---|---|
| Минимальный tap target | `min-h-[44px]` или `min-h-[48px]` на всех интерактивных элементах |
| Цифровая клавиатура | `inputMode="numeric"` + `pattern="[0-9]*"` |
| Нет горизонтального скролла | `overflow-x-hidden` на `main` |
| Нативное ощущение | `user-scalable=no`, `viewport-fit=cover`, `display: standalone` |
| Нет резинового bounce | `background-color: #0D0D11` на `html` (iOS Safari) |

---

## Запуск проекта

### Требования
- Node.js LTS (≥ 18.x) → [nodejs.org](https://nodejs.org)

### Команды

```powershell
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер
npm run dev
# → http://localhost:3000

# 3. Сборка для продакшна
npm run build
npm run start

# 4. Деплой на Vercel (после git push)
# Vercel автоматически подхватит проект из GitHub
```

### Проверка PWA

```
Chrome DevTools (F12)
└── Application
    ├── Manifest       → имя, цвета, иконки
    ├── Service Workers → (будет после добавления sw.js)
    └── Storage → Local Storage → milly_free_usage
```

### Проверка API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "конфликт на работе"}'

# Ответ через ~3.5 сек:
# { "success": true, "message": "...", "book": "..." }
```

---

## Дорожная карта

### Шаг 5 — Подключение Claude API
- [ ] Создать аккаунт на [console.anthropic.com](https://console.anthropic.com)
- [ ] Добавить `ANTHROPIC_API_KEY` в `.env.local`
- [ ] Заменить mock-блок в `route.ts` на `anthropic.messages.create()`
- [ ] Добавить Streaming (`StreamingTextResponse`) для типизации в реальном времени
- [ ] Включить Prompt Caching для системного промпта (экономия токенов)

### Шаг 6 — Аутентификация и профиль
- [ ] NextAuth.js (Google / Telegram OAuth)
- [ ] Перенос Freemium-лимита с localStorage в базу данных
- [ ] Сохранение истории чатов (PostgreSQL / Supabase)

### Шаг 7 — Монетизация
- [ ] Страница тарифов (`/pricing`): Free / SOS / Premium
- [ ] Stripe Payments интеграция
- [ ] Webhook для активации платного тарифа

### Шаг 8 — Расширение Bento Grid
- [ ] Карточка «Радар Совместимости» — форма ввода дат рождения
- [ ] Карточка «Финансовая Стратегия» — реальный расчёт по API
- [ ] Персональная натальная карта (SVG визуализация)

### Шаг 9 — Полноценный PWA
- [ ] `public/sw.js` — Service Worker (кэш, офлайн-режим)
- [ ] Push-уведомления (ежедневный астро-прогноз)
- [ ] Реальные иконки `icon-192x192.png` и `icon-512x512.png`
- [ ] iOS Splash Screen (`apple-splash-*`)

### Шаг 10 — SEO и аналитика
- [ ] Sitemap + robots.txt
- [ ] OpenGraph изображения (динамические через `next/og`)
- [ ] Vercel Analytics + посетительская воронка
- [ ] A/B тест кнопок CTA (для него / для неё)

---

## Ключевые архитектурные решения

| Решение | Обоснование |
|---|---|
| Server Component в `page.tsx` | Уменьшает JS-бандл; Client-острова изолированы |
| `Promise.all([fetch, allStepsDone])` | Гарантирует показ всех 4 шагов ДО появления ответа |
| `useRef` для step-таймеров | Очистка при размонтировании, нет memory-leak |
| Freemium в localStorage | MVP без БД; легко мигрировать на сервер |
| `AnimatePresence mode="wait"` | Плавный выход одной фазы перед входом следующей |
| `id="chat-milly"` на BentoCard | Простой якорь для `scrollIntoView` из ManifestoView |
| Mock delay 3.4–4.4 сек | Синхронизирован со временем 4 шагов (4×800ms + 400ms) |
| `textShadow` через inline style | Tailwind не поддерживает `text-shadow` нативно в v3 |

---

*Документ сформирован по итогам разработки Шагов 1–4 проекта Milly AI AstroTech Assistant.*  
*Дата: 2026-05-14*
