"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import SyncCard from "./sync-card";
import ChatCard from "./chat-card";

// ── Обёртка карточки с анимацией появления и hover-scale ─────
function BentoCard({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.62, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{
        scale: 1.018,
        transition: { type: "spring", stiffness: 280, damping: 22 },
      }}
      className={`glass-card p-5 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// КАРТОЧКА 2 — «Радар Совместимости» (col-span-1)
// ═══════════════════════════════════════════════════════════════
function RadarCard() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5" aria-hidden>🔭</span>
        <div>
          <h3 className="font-bold text-white leading-snug">Радар Совместимости</h3>
          <p className="text-xs text-white/40 mt-0.5">Синастрия · Триггеры</p>
        </div>
      </div>

      {/* Анимированные орбитальные кольца */}
      <div className="relative mx-auto my-1 flex h-28 w-28 items-center justify-center shrink-0">
        <div className="absolute inset-0 rounded-full border border-neon-purple/20" />
        <div className="absolute inset-5 rounded-full border border-neon-cyan/20" />

        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
        </motion.div>

        <motion.div
          className="absolute inset-5"
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
        </motion.div>

        <span className="text-xl select-none" aria-hidden>💞</span>
      </div>

      <p className="text-xs text-white/50 leading-relaxed text-center grow">
        Проверка синастрии и психологических триггеров партнёра или босса в&nbsp;один клик
      </p>

      <button type="button" className="btn-ghost min-h-[44px] mt-auto">
        Проверить совместимость
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// КАРТОЧКА 3 — «Финансовая Стратегия» (col-span-1)
// ═══════════════════════════════════════════════════════════════
const FINANCE_BARS = [
  { label: "Потенциал дохода",    pct: 72, gradient: "from-neon-purple to-violet-400" },
  { label: "Инвестиционный цикл", pct: 48, gradient: "from-neon-cyan to-sky-400"     },
  { label: "Риск потерь",         pct: 27, gradient: "from-rose-500 to-orange-400"   },
] as const;

function FinanceCard() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5" aria-hidden>📈</span>
        <div>
          <h3 className="font-bold text-white leading-snug">Финансовая Стратегия</h3>
          <p className="text-xs text-white/40 mt-0.5">Денежные циклы · Активность</p>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 grow">
        {FINANCE_BARS.map(({ label, pct, gradient }, i) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/55">{label}</span>
              <span className="tabular-nums text-white/35">{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.18, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn-ghost min-h-[44px] mt-auto">
        Полный финансовый аудит
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ГЛАВНЫЙ ЭКСПОРТ — BentoGrid
// Desktop: 3 колонки | Mobile: 1 колонка
// ═══════════════════════════════════════════════════════════════
export default function BentoGrid() {
  return (
    <section className="px-4 pb-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Карточка 1 — Синхронизация (широкая 2/3) */}
          <BentoCard className="md:col-span-2 min-h-[280px]" delay={0}>
            <SyncCard />
          </BentoCard>

          {/* Карточка 2 — Радар (узкая 1/3) */}
          <BentoCard className="md:col-span-1 min-h-[280px]" delay={0.10}>
            <RadarCard />
          </BentoCard>

          {/* Карточка 3 — Финансы (узкая 1/3) */}
          <BentoCard className="md:col-span-1 min-h-[280px]" delay={0.16}>
            <FinanceCard />
          </BentoCard>

          {/* Карточка 4 — Чат (широкая 2/3) · якорь для scroll-to */}
          <BentoCard id="chat-milly" className="md:col-span-2 min-h-[320px]" delay={0.22}>
            <ChatCard />
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
