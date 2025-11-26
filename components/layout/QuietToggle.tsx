"use client"

import { useEffect, useState } from "react"

export default function QuietToggle() {
  const [quiet, setQuiet] = useState(false)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quiet-mode")
      const isOn = saved === "1"
      setQuiet(isOn)
      document.documentElement.dataset.quiet = isOn ? "1" : "0"
    } catch {}
  }, [])
  const toggle = () => {
    const next = !quiet
    setQuiet(next)
    try {
      localStorage.setItem("quiet-mode", next ? "1" : "0")
    } catch {}
    document.documentElement.dataset.quiet = next ? "1" : "0"
  }
  return (
    <button
      type="button"
      aria-pressed={quiet}
      onClick={toggle}
      className="inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
      title={quiet ? "Disable Quiet Mode" : "Enable Quiet Mode"}
    >
      {quiet ? "Animations Off" : "Animations On"}
    </button>
  )
}
