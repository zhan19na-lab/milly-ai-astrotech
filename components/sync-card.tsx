"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// БАЗА МАНИФЕСТОВ
// ═══════════════════════════════════════════════════════════════
const MANIFESTOS: Record<string, string> = {
  "1111":
    "Код пробуждения и синхронизации. Твоё подсознание пытается пробить стену сомнений. Прямо сейчас Вселенная обнуляет твой прошлый кармический опыт неудач. То, что ты считал потерей — на самом деле освобождение места для истинного масштаба. Сделай глубокий вдох. Доверься Милли, твой новый таймлайн активирован.",
  "2222":
    "Код баланса и сборки личной силы. Этот знак указывает на точку эмоционального перелома в отношениях или карьере. Хватит цепляться за то, что разрушает тебя изнутри. Твой внутренний Плутон требует жёсткой честности. Прямо сейчас начни выстраивать личные границы. Ты под защитой.",
  "1221":
    "Код разворота вектора. Ты смотришь назад, пытаясь исправить прошлое, но твоя энергия нужна в настоящем. Предательства и кризисы — это лишь жёсткая инициация. Твой нумерологический код дня требует обнуления старых обид. Переверни страницу.",
  "0000":
    "Код Великой Пустоты и Начала. Точка абсолютного обнуления. Если тебе кажется, что ты в тупике — это идеальный чистый лист. Никаких долгов, никаких обязательств перед прошлым. Напиши свою историю заново с этой секунды.",
};

const DEFAULT_MANIFESTO =
  "Каждое число — это вибрация твоего текущего фокуса. Милли видит твой внутренний запрос на изменения. Ты ищешь ответы, потому что готов действовать. Твой персональный рецепт спасения формируется.";

// ═══════════════════════════════════════════════════════════════
// COMPILE-LOADER: эффект сканирования (1.5 сек)
// Бегущие цифры → терминальные строки → прогресс-бар
// ═══════════════════════════════════════════════════════════════
const SCAN_STEPS = [
  { at: 55,   build: (c: string) => `> SCANNING CODE ${c.slice(0, 2)}:${c.slice(2)}...` },
  { at: 430,  build: () =>          "> MATCHING KARMIC DATABASE..."                      },
  { at: 820,  build: () =>          "> CALCULATING PERSONAL VECTOR..."                   },
  { at: 1190, build: () =>          "> MANIFESTO COMPILED ✓"                             },
] as const;

function CompileLoader({ code }: { code: string }) {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [display, setDisplay] = useState("0000");

  useEffect(() => {
    const TOTAL = 1380;
    const t0 = Date.now();
    let linePtr = 0;

    const tick = setInterval(() => {
      const elapsed = Date.now() - t0;
      const pct = Math.min((elapsed / TOTAL) * 100, 100);
      setProgress(pct);

      // Цифры «бегут» до ~82%, затем фиксируются в реальный код
      setDisplay(
        pct < 82
          ? Array.from({ length: 4 }, () =>
              String(Math.floor(Math.random() * 10))
            ).join("")
          : code
      );

      // Раскрываем строки терминала по расписанию
      while (linePtr < SCAN_STEPS.length && elapsed >= SCAN_STEPS[linePtr].at) {
        const { build } = SCAN_STEPS[linePtr];
        setLines((prev) => [...prev, build(code)]);
        linePtr++;
      }

      if (pct >= 100) clearInterval(tick);
    }, 55);

    return () => clearInterval(tick);
  }, [code]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28 }}
      className="flex flex-col gap-4"
    >
      {/* Центральный цифровой дисплей с неоновым свечением */}
      <div className="flex justify-center py-1">
        <span
          className="font-mono text-5xl font-bold tabular-nums tracking-widest text-neon-purple"
          style={{ textShadow: "0 0 32px rgba(139,92,246,0.7)" }}
        >
          {display.slice(0, 2)}:{display.slice(2)}
        </span>
      </div>

      {/* Терминальное окно */}
      <div className="h-[90px] overflow-hidden rounded-lg border border-neon-purple/10 bg-[#070709] p-3">
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="font-mono text-[11px] leading-relaxed text-neon-cyan/60"
            >
              {line}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {/* Прогресс-бар */}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
          style={{
            width: `${progress}%`,
            transition: "width 55ms linear",
          }}
        />
      </div>

      <p className="text-center text-[11px] tracking-wide text-white/25">
        ИИ&#8209;Милли обрабатывает вибрационный код...
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MANIFESTO VIEW: результат с кнопкой-якорем к Чату
// ═══════════════════════════════════════════════════════════════
function ManifestoView({
  code,
  manifesto,
  onReset,
}: {
  code: string;
  manifesto: string;
  onReset: () => void;
}) {
  const handleScrollToChat = () => {
    document.getElementById("chat-milly")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center gap-5 text-center"
    >
      {/* Код с пульсирующим неоновым ореолом */}
      <div className="relative flex items-center justify-center py-2">
        <motion.div
          className="absolute h-14 w-40 rounded-full bg-neon-purple/20 blur-[26px]"
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="relative font-mono text-4xl font-bold tracking-widest text-neon-purple"
          style={{ textShadow: "0 0 28px rgba(139,92,246,0.75)" }}
        >
          {code.slice(0, 2)}:{code.slice(2)}
        </span>
      </div>

      {/* Текст манифеста */}
      <div className="rounded-xl border border-neon-purple/15 bg-neon-purple/[0.06] px-4 py-4">
        <p className="text-sm leading-relaxed text-white/76">{manifesto}</p>
      </div>

      {/* CTA — плавный скролл к Карточке 4 */}
      <motion.button
        type="button"
        onClick={handleScrollToChat}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="btn-neon w-full min-h-[52px] justify-center gap-2.5"
        style={{ boxShadow: "0 0 20px 2px rgba(139,92,246,0.35)" }}
      >
        <span aria-hidden>🌌</span>
        Получить полный SOS&#8209;рецепт у&nbsp;Милли
      </motion.button>

      <button
        type="button"
        onClick={onReset}
        className="text-xs text-white/30 transition-colors hover:text-white/65"
      >
        ← Ввести другой код
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SYNC CARD — 3-фазная машина состояний
//   "idle"    → форма ввода XX:XX
//   "loading" → 1.5 с compile-loader
//   "result"  → экран манифеста
// ═══════════════════════════════════════════════════════════════
type Phase = "idle" | "loading" | "result";

export default function SyncCard() {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [phase, setPhase] = useState<Phase>("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const code = digits.join("");

  // Авто-запуск через 300ms после заполнения всех 4 ячеек
  useEffect(() => {
    if (phase !== "idle" || !digits.every((d) => d !== "")) return;

    const arm = setTimeout(() => {
      setPhase("loading");
      setTimeout(() => setPhase("result"), 1500);
    }, 300);

    return () => clearTimeout(arm);
  }, [digits, phase]);

  // ── Хендлеры ───────────────────────────────────────────────
  const handleChange = (idx: number, raw: string) => {
    if (!/^\d*$/.test(raw)) return;
    const char = raw.slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    if (char && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Ручной запуск кнопкой (до авто-триггера или вместо него)
  const handleSubmit = () => {
    if (!digits.every((d) => d !== "")) return;
    setPhase("loading");
    setTimeout(() => setPhase("result"), 1500);
  };

  const handleReset = () => {
    setDigits(["", "", "", ""]);
    setPhase("idle");
    setTimeout(() => inputRefs.current[0]?.focus(), 80);
  };

  const manifesto = MANIFESTOS[code] ?? DEFAULT_MANIFESTO;
  const isFull = digits.every((d) => d !== "");

  // ── UI ─────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col gap-5">

      {/* Заголовок (всегда виден) */}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-2xl" aria-hidden>✨</span>
        <div>
          <h3 className="font-bold leading-snug text-white">
            Синхронизация со Вселенной
          </h3>
          <p className="mt-0.5 text-xs text-white/40">
            Зеркальные числа · Кармический ключ
          </p>
        </div>
      </div>

      {/* Описание только в idle-фазе */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.p
            key="desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm leading-relaxed text-white/55"
          >
            Замечаешь знаки? Введи зеркальные числа (11:11, 22:22) и получи
            манифест обнуления прошлого кармического опыта.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Переходы между фазами */}
      <AnimatePresence mode="wait">

        {/* ── ФАЗА 1: форма ввода ──────────────────────────── */}
        {phase === "idle" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-4"
          >
            {/* Инпут XX:XX */}
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Введите зеркальное число в формате XX:XX"
            >
              {/* Первые 2 цифры */}
              {([0, 1] as const).map((i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digits[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`Цифра ${i + 1}`}
                  placeholder="0"
                  className="
                    h-14 w-14 rounded-xl border border-white/10 bg-white/[0.05]
                    text-center text-xl font-bold text-white
                    placeholder-white/20 caret-neon-purple
                    transition-colors duration-150
                    focus:border-neon-purple/65 focus:bg-neon-purple/10 focus:outline-none
                  "
                />
              ))}

              <span
                className="select-none text-2xl font-light text-white/30"
                aria-hidden
              >
                :
              </span>

              {/* Последние 2 цифры */}
              {([2, 3] as const).map((i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digits[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`Цифра ${i + 1}`}
                  placeholder="0"
                  className="
                    h-14 w-14 rounded-xl border border-white/10 bg-white/[0.05]
                    text-center text-xl font-bold text-white
                    placeholder-white/20 caret-neon-purple
                    transition-colors duration-150
                    focus:border-neon-purple/65 focus:bg-neon-purple/10 focus:outline-none
                  "
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFull}
              className="
                btn-neon min-h-[48px] self-start
                disabled:cursor-not-allowed disabled:brightness-100
                disabled:opacity-35 disabled:shadow-none
              "
            >
              Расшифровать код
            </button>
          </motion.div>
        )}

        {/* ── ФАЗА 2: compile-loader ───────────────────────── */}
        {phase === "loading" && (
          <CompileLoader key="loader" code={code} />
        )}

        {/* ── ФАЗА 3: манифест ─────────────────────────────── */}
        {phase === "result" && (
          <ManifestoView
            key="result"
            code={code}
            manifesto={manifesto}
            onReset={handleReset}
          />
        )}

      </AnimatePresence>
    </div>
  );
}
