"use client";

import { motion } from "framer-motion";

export default function NebulaBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Orb 1 — верхний левый, фиолетовый, медленная пульсация */}
      <motion.div
        className="absolute -left-40 -top-40 h-[640px] w-[640px] rounded-full bg-neon-purple blur-[120px]"
        animate={{
          scale: [1, 1.20, 1],
          opacity: [0.22, 0.32, 0.22],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orb 2 — верхний правый, бирюзовый, сдвинутая фаза */}
      <motion.div
        className="absolute -right-52 -top-20 h-[520px] w-[520px] rounded-full bg-neon-cyan blur-[130px]"
        animate={{
          scale: [1.12, 0.90, 1.12],
          opacity: [0.13, 0.20, 0.13],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      />

      {/* Orb 3 — нижний центр, фиолетовый мягкий, самый медленный */}
      <motion.div
        className="absolute -bottom-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-neon-purple blur-[140px]"
        animate={{
          scale: [1, 1.10, 1],
          opacity: [0.09, 0.15, 0.09],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  );
}
