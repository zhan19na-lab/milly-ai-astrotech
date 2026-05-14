"use client";

import { motion } from "framer-motion";

// Stagger-контейнер: каждый дочерний элемент появляется с задержкой 150ms
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

// Общий паттерн появления снизу + fade-in
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-24 text-center">
      <motion.div
        className="flex max-w-3xl flex-col items-center gap-7"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* ── Бейдж Online ───────────────────────────────────────── */}
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-4 py-1.5 text-xs font-medium tracking-wide text-neon-purple">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-purple animate-pulse" />
            AI AstroTech · Online 24/7
          </span>
        </motion.div>

        {/* ── Главный заголовок ──────────────────────────────────── */}
        <motion.h1
          variants={item}
          className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.75rem]"
        >
          <span className="text-white/90">
            Когда всё идёт не так.
          </span>
          <br />
          {/* Градиент purple → cyan через .text-neon из globals.css */}
          <span className="text-neon">
            Мгновенный рецепт спасения от&nbsp;ИИ&#8209;Милли
          </span>
        </motion.h1>

        {/* ── Подзаголовок ──────────────────────────────────────── */}
        <motion.p
          variants={item}
          className="max-w-xl text-base leading-relaxed text-white/52 sm:text-lg"
        >
          Объективный ИИ-анализ твоей ситуации на стыке глубокой психологии,
          астрологии и точных цифр.{" "}
          <span className="text-white/70">Без осуждения. Круглосуточно.</span>
        </motion.p>

        {/* ── CTA Кнопки ────────────────────────────────────────── */}
        <motion.div
          variants={item}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
        >
          {/* Кнопка «Для Него» — строгий стиль, рамка cyan */}
          <button
            type="button"
            className="
              group inline-flex min-h-[52px] w-full items-center justify-center gap-3
              rounded-xl border border-neon-cyan/40 bg-neon-cyan/5
              px-6 py-3 text-sm font-semibold text-neon-cyan
              transition-all duration-200
              hover:border-neon-cyan/70 hover:bg-neon-cyan/10 hover:shadow-cyan-glow
              active:scale-95 sm:w-auto
            "
          >
            <span aria-hidden className="text-lg shrink-0">⚡</span>
            <span className="text-left">
              Аудит кризиса и рисков
              <span className="block text-xs font-normal text-neon-cyan/65">
                Работа / Логика
              </span>
            </span>
          </button>

          {/* Кнопка «Для Неё» — мягкий стиль, свечение purple */}
          <button
            type="button"
            className="
              group inline-flex min-h-[52px] w-full items-center justify-center gap-3
              rounded-xl bg-neon-purple px-6 py-3 text-sm font-semibold text-white
              transition-all duration-200
              hover:brightness-110 hover:shadow-neon-glow
              active:scale-95 sm:w-auto
            "
          >
            <span aria-hidden className="text-lg shrink-0">🌙</span>
            <span className="text-left">
              Эмоциональная опора
              <span className="block text-xs font-normal text-white/65">
                Отношения / Чувства
              </span>
            </span>
          </button>
        </motion.div>

        {/* ── Счётчик доверия ───────────────────────────────────── */}
        <motion.div
          variants={item}
          className="flex items-center gap-5 text-white/30"
        >
          {[
            { num: "12K+", label: "пользователей" },
            { num: "24/7", label: "онлайн" },
            { num: "98%", label: "точность" },
          ].map(({ num, label }, i) => (
            <span key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-base font-bold text-white/60">{num}</span>
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Подсказка скролла (абсолютно, снизу) ─────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-white/18"
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.25em]">
            scroll
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
