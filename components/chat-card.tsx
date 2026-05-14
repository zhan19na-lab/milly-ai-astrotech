"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
type MessageRole = "user" | "assistant";

type Message = {
  id: number;
  role: MessageRole;
  text: string;
  book?: string | null;
};

// ═══════════════════════════════════════════════════════════════
// FREEMIUM LIMIT — localStorage, сбрасывается каждый день
// ═══════════════════════════════════════════════════════════════
const LIMIT_KEY = "milly_free_usage";
const MAX_FREE   = 3;

const todayStr = () => new Date().toISOString().slice(0, 10); // "2026-05-14"

function getDailyCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(LIMIT_KEY);
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw) as { date: string; count: number };
    return date === todayStr() ? count : 0;
  } catch {
    return 0;
  }
}

function incrementDailyCount(): number {
  const next = getDailyCount() + 1;
  try {
    localStorage.setItem(LIMIT_KEY, JSON.stringify({ date: todayStr(), count: next }));
  } catch { /* ignore — Safari private mode */ }
  return next;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

// 4 шага «мышления» Милли — каждый загорается через 800 ms
const THINKING_STEPS = [
  "Запуск flatlib. Точный расчет координат планет и домов по дате... OK.",
  "Фильтрация человеческого фактора. Очистка от субъективных искажений... OK.",
  "Web Search. Сканирование текущей сетки транзитов реального времени... OK.",
  "Синтез эмпатичного рецепта спасения...",
] as const;

const STEP_INTERVAL_MS = 800;

// Предзагруженный превью-диалог (стартовая история чата)
const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "user",
    text: "Конфликт с руководством — как выйти без потерь?",
  },
  {
    id: 1,
    role: "assistant",
    text: "Вижу паттерн: Меркурий ретро + натальный Марс в Козероге. Конфликт авторитетов — ваша точка роста, не слабость. Шаг 1: письменная фиксация позиций. Шаг 2 — разговор без свидетелей.",
    book: "«Токсичные боссы» · Роберт Саттон, гл. 3 — стр. 47",
  },
];

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Иконка отправки (круглая кнопка)
function ArrowIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// Блок «Милли анализирует запрос...» с 4 пошаговыми индикаторами
function ThinkingLoader({ activeSteps }: { activeSteps: number[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.28 }}
      className="self-start w-full max-w-[94%] rounded-xl border border-neon-purple/15 bg-neon-purple/[0.06] p-3"
    >
      {/* Заголовок с пульсирующей точкой */}
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-purple animate-pulse" />
        <p className="text-[11px] font-semibold tracking-wide text-neon-purple">
          Милли анализирует запрос...
        </p>
      </div>

      {/* Шаги — появляются один за другим */}
      <div className="flex flex-col gap-1.5">
        {THINKING_STEPS.map((step, i) => (
          <AnimatePresence key={i}>
            {activeSteps.includes(i) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-start gap-2"
              >
                <span className="mt-px shrink-0 text-[10px] leading-none text-green-400">
                  🟢
                </span>
                <span className="text-[11px] leading-snug text-white/58">
                  <span className="text-white/36">[Шаг {i + 1}]:</span>{" "}
                  {step}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
}

// Плашка исчерпанного лимита
function LimitNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-neon-purple/20 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/5 p-4 text-center"
    >
      <p className="text-sm font-semibold text-white/85">🔒 Дневной лимит исчерпан</p>
      <p className="mt-1 text-xs leading-relaxed text-white/45">
        Перейдите на тариф SOS для безлимитного доступа 24/7
      </p>
      <button
        type="button"
        className="btn-neon mt-3 min-h-0 px-5 py-2 text-xs"
      >
        Получить доступ SOS →
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function ChatCard() {
  const [messages, setMessages]       = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const [dailyCount, setDailyCount]   = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stepTimers  = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Читаем лимит на клиенте (SSR-safe) ────────────────────
  useEffect(() => {
    const count = getDailyCount();
    setDailyCount(count);
    setLimitReached(count >= MAX_FREE);
  }, []);

  // ── Авто-скролл к последнему сообщению ────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, activeSteps.length]);

  // ── Авто-рост textarea (48px min → 120px max) ─────────────
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "48px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  // ── Отправка сообщения ─────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || limitReached) return;

    // Добавляем сообщение пользователя
    const userMsg: Message = { id: Date.now(), role: "user", text };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setActiveSteps([]);

    // Сбрасываем старые таймеры шагов
    stepTimers.current.forEach(clearTimeout);

    // Запускаем шаги каждые 800 ms
    stepTimers.current = THINKING_STEPS.map((_, i) =>
      setTimeout(
        () => setActiveSteps((prev) => [...prev, i]),
        (i + 1) * STEP_INTERVAL_MS
      )
    );

    // Минимальная задержка: все 4 шага + 400 ms буфер = 3600 ms
    const allStepsDone = new Promise<void>((resolve) =>
      setTimeout(resolve, THINKING_STEPS.length * STEP_INTERVAL_MS + 400)
    );

    try {
      // API вызов и ожидание полного показа шагов — параллельно
      const [res] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json() as Promise<{ success: boolean; message: string; book: string }>;
        }),
        allStepsDone,
      ]);

      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: res.message ?? "Нет ответа от сервера.",
        book: res.book ?? null,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      const newCount = incrementDailyCount();
      setDailyCount(newCount);
      if (newCount >= MAX_FREE) setLimitReached(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Не удалось получить ответ. Проверь соединение и попробуй ещё раз.",
          book: null,
        },
      ]);
    } finally {
      setIsLoading(false);
      setActiveSteps([]);
      stepTimers.current.forEach(clearTimeout);
    }
  }, [input, isLoading, limitReached]);

  // Enter — отправить, Shift+Enter — новая строка
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const remaining = Math.max(0, MAX_FREE - dailyCount);

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col gap-4">

      {/* ── Заголовок ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-2xl" aria-hidden>💬</span>
          <div>
            <h3 className="font-bold leading-snug text-white">Чат с Милли</h3>
            <p className="mt-0.5 text-xs text-white/40">ИИ-эксперт · разбор вашей ситуации</p>
          </div>
        </div>

        {/* Счётчик бесплатных запросов */}
        {!limitReached && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/35">
            {remaining}&thinsp;/&thinsp;{MAX_FREE} бесплатных
          </span>
        )}
      </div>

      {/* ── Окно чата — фиксированная высота + внутренний скролл ── */}
      <div
        className="
          flex h-[240px] flex-col gap-3 overflow-y-auto pr-0.5
          [&::-webkit-scrollbar]:w-[3px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-neon-purple/30
          [&::-webkit-scrollbar-thumb:hover]:bg-neon-purple/55
        "
      >
        {/* Сообщения */}
        {messages.map((msg) =>
          msg.role === "user" ? (
            /* Пузырь пользователя — справа */
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <div className="max-w-[82%] rounded-2xl rounded-tr-sm border border-neon-purple/20 bg-neon-purple/15 px-4 py-2.5 text-sm text-white/82">
                {msg.text}
              </div>
            </motion.div>
          ) : (
            /* Пузырь Милли — слева + рекомендация книги */
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-white/[0.06] bg-deep-indigo px-4 py-3">
                <span className="mb-1.5 block text-[11px] font-semibold text-neon-purple">
                  Milly
                </span>
                <p className="text-sm leading-relaxed text-white/70">{msg.text}</p>
              </div>

              {msg.book && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.3 }}
                  className="flex max-w-[92%] items-center gap-2.5 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 px-3.5 py-2"
                >
                  <span className="shrink-0 text-sm" aria-hidden>📚</span>
                  <span className="text-xs leading-snug text-neon-cyan">{msg.book}</span>
                </motion.div>
              )}
            </motion.div>
          )
        )}

        {/* Лоадер «Милли думает» */}
        <AnimatePresence>
          {isLoading && (
            <ThinkingLoader key="thinking" activeSteps={activeSteps} />
          )}
        </AnimatePresence>

        {/* Якорь для авто-скролла */}
        <div ref={bottomRef} className="h-px shrink-0" />
      </div>

      {/* ── Инпут / Лимит-заглушка ────────────────────────── */}
      <div className="mt-auto">
        <AnimatePresence mode="wait">
          {limitReached ? (
            <LimitNotice key="limit" />
          ) : (
            <motion.div
              key="input-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              {/* Растущий textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Опишите вашу ситуацию..."
                rows={1}
                aria-label="Сообщение для Милли"
                className="
                  flex-1 resize-none overflow-hidden rounded-xl
                  border border-white/10 bg-white/[0.05]
                  min-h-[48px] max-h-[120px]
                  px-4 py-3 text-sm text-white
                  placeholder-white/28 caret-neon-purple
                  focus:border-neon-purple/50 focus:bg-neon-purple/5 focus:outline-none
                  disabled:opacity-45
                  transition-colors duration-150
                  [&::-webkit-scrollbar]:w-[2px]
                  [&::-webkit-scrollbar-thumb]:bg-neon-purple/30
                "
              />

              {/* Круглая кнопка отправки с LED-свечением */}
              <motion.button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.10 }}
                whileTap={{ scale: 0.90 }}
                aria-label="Отправить сообщение"
                className="
                  flex h-12 w-12 shrink-0 items-center justify-center
                  rounded-full bg-neon-purple text-white
                  shadow-[0_0_16px_rgba(139,92,246,0.52)]
                  hover:shadow-[0_0_28px_rgba(139,92,246,0.78)]
                  disabled:cursor-not-allowed disabled:opacity-35
                  disabled:shadow-none
                  transition-shadow duration-200
                "
              >
                <ArrowIcon />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
