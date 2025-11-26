"use client"

import { motion } from "framer-motion"

export default function Background({ intensity = "subtle" as const }: { intensity?: "subtle" | "strong" }) {
  const quiet = typeof document !== 'undefined' && document.documentElement?.dataset?.quiet === '1'
  if (quiet) return null
  const p1 = intensity === "strong" ? 0.45 : 0.12
  const p2 = intensity === "strong" ? 0.28 : 0.06
  const gridOpacity = intensity === "strong" ? 0.1 : 0.04
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient beams */}
      <motion.div
        aria-hidden
        className="absolute -top-1/3 -left-1/3 h-[120vh] w-[120vw] rounded-full mix-blend-overlay"
        style={{
          background:
            `radial-gradient(60% 60% at 50% 50%, hsl(var(--primary)/${p1}) 0%, transparent 60%)`,
        }}
        animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.05, 1.02, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[100vh] w-[100vw] -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"
        style={{
          background:
            `radial-gradient(40% 40% at 70% 30%, hsl(var(--foreground)/${p2}) 0%, transparent 70%)`,
        }}
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Horizontal beam */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 top-1/3 h-40 mix-blend-overlay"
        style={{
          background:
            `linear-gradient(90deg, transparent, hsl(var(--primary)/${p1}), transparent)`,
          filter: 'blur(24px)'
        }}
        animate={{ x: ["-10%", "10%", "-10%"], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        style={{ opacity: gridOpacity }}
        className="absolute inset-0 [background-image:linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] [background-size:24px_24px]"
      />
    </div>
  )
}
