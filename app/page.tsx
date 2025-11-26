'use client'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardCharts from './dashboard-charts'
import { dataApi } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Background from '@/components/magic/Background'
import { BorderBeam } from '@/components/ui/border-beam'
import { Package, Layers3, Boxes, Tag, TrendingUp as TrendingUpIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'


function Stat({ label, value, color = 'indigo', delta, onClick, delayMs = 0, icon }: { label: string; value: string | number; color?: 'indigo' | 'emerald' | 'sky' | 'amber' | 'rose' | 'violet'; delta?: number; onClick?: () => void; delayMs?: number; icon?: React.ReactNode }) {
  const palette: Record<string, { bg: string; text: string; ring: string }> = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-700', ring: 'ring-sky-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-800', ring: 'ring-amber-100' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-100' },
  }
  const p = palette[color] ?? palette.indigo
  // Count-up animation for numeric values
  const [display, setDisplay] = useState<string | number>(typeof value === 'number' ? 0 : value)
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    if (typeof value !== 'number') { setDisplay(value); return }
    const duration = 900
    const start = performance.now() + (delayMs || 0)
    const from = 0
    const to = value
    const step = (t: number) => {
      const elapsed = Math.max(0, t - start)
      const k = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - k, 3) // easeOutCubic
      const current = Math.round(from + (to - from) * eased)
      setDisplay(current)
      if (k < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, delayMs])

  // Randomize border-beam colors once per mount
  const [fromColor, toColor] = useMemo(() => {
    const pool = [
      'hsl(var(--primary))',
      '#22d3ee', // cyan-400
      '#a78bfa', // violet-400
      '#f472b6', // pink-400
      '#34d399', // emerald-400
      '#f59e0b', // amber-500
    ]
    const i = Math.floor(Math.random() * pool.length)
    let j = Math.floor(Math.random() * pool.length)
    if (j === i) j = (j + 2) % pool.length
    return [pool[i], pool[j]] as const
  }, [])
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const beamFrom = isDark ? fromColor : '#3b82f6' // blue-500 on light
  const beamTo = isDark ? toColor : '#f43f5e'     // rose-500 on light

  return (
    <motion.div
      style={{ animationDelay: `${delayMs}ms` }}
      {...(!(typeof document !== 'undefined' && document.documentElement?.dataset?.quiet === '1')
        ? { whileHover: { y: -4, scale: 1.01 }, whileTap: { scale: 0.995 } }
        : {})}
      transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.6 }}
      className={`relative group w-full h-[170px] rounded-lg`}
      onClick={onClick}
    >
      {!(typeof document !== 'undefined' && document.documentElement?.dataset?.quiet === '1') ? (
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <BorderBeam
            size={140}
            borderWidth={1.5}
            colorFrom={beamFrom}
            colorTo={beamTo}
            duration={6}
            initialOffset={Math.floor(Math.random() * 30)}
            className="rounded-[inherit] mix-blend-normal"
            style={{
              filter: isDark ? 'brightness(1.25) saturate(1.35)' : 'brightness(1.1) saturate(1.6)',
              boxShadow: isDark ? undefined : '0 0 12px rgba(59,130,246,.25), 0 0 16px rgba(244,63,94,.20)'
            }}
          />
        </div>
      ) : null}
      <Card
        style={{ animationDelay: `${delayMs}ms` }}
        className={`flex h-full flex-col animate-scale-in transition-transform duration-200 bg-card/30 border-none rounded-md shadow-none ${onClick ? 'cursor-pointer' : ''}`}
      >
        <CardHeader className="h-10 py-0">
          <div className="h-full flex items-center justify-between gap-2">
            <CardTitle className="text-sm text-muted-foreground truncate">{label}</CardTitle>
            <div className="h-6 w-6 shrink-0 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground">
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-3 flex-1 flex flex-col justify-center">
          <div className="flex items-end justify-between gap-2">
            <div className="text-5xl font-semibold leading-none">{display}</div>
            {typeof delta === 'number' ? (
              <div className={`text-[11px] font-medium min-w-[46px] text-right ${delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Page() {
  const router = useRouter()
  const [typeId, setTypeId] = useState<number | undefined>(undefined)
  const [brandId, setBrandId] = useState<number | undefined>(undefined)
  const { data: items, isLoading: itemsLoading } = useQuery({ queryKey: ['items'], queryFn: dataApi.getItems })
  const { data: inventory, isLoading: inventoryLoading } = useQuery({ queryKey: ['inventory'], queryFn: dataApi.getInventory })
  const { data: brands, isLoading: brandsLoading } = useQuery({ queryKey: ['brands'], queryFn: dataApi.getBrands })
  const { data: sales, isLoading: salesLoading } = useQuery({ queryKey: ['sales'], queryFn: dataApi.getSales })
  const { data: types } = useQuery({ queryKey: ['types'], queryFn: dataApi.getTypes })

  const allowedItem = (id: number) => {
    const it = Array.isArray(items) ? (items as any[]).find(i => Number(i.id) === Number(id)) : undefined
    if (!it) return false
    const brand = Array.isArray(brands) ? (brands as any[]).find(b => Number(b.id) === Number(it.itemBrandId)) : undefined
    if (typeId && (!brand || Number(brand.itemTypeId) !== Number(typeId))) return false
    if (brandId && Number(it.itemBrandId) !== Number(brandId)) return false
    return true
  }
  const totalItems = Array.isArray(items) ? (items as any[]).filter(i => allowedItem(Number(i.id))).length : 0
  const inStock = Array.isArray(inventory) ? (inventory as any[]).filter(q => allowedItem(Number(q.itemId))).reduce((sum: number, q: any) => sum + Number(q.quantity || 0), 0) : 0
  const totalBrands = Array.isArray(brands) ? brands.length : 0
  const today = new Date().toDateString()
  const salesToday = Array.isArray(sales) ? sales.filter((s: any) => s.createdAt && new Date(s.createdAt).toDateString() === today).length : 0

  // KPIs
  const perItemQty: Record<number, number> = {}
  if (Array.isArray(inventory)) {
    for (const q of inventory as any[]) {
      if (!allowedItem(Number(q.itemId))) continue
      const id = Number(q.itemId)
      perItemQty[id] = (perItemQty[id] ?? 0) + Number(q.quantity || 0)
    }
  }
  const lowStockThreshold = 10
  const lowStock = Object.values(perItemQty).filter(v => v < lowStockThreshold).length
  const stockouts = Object.values(perItemQty).filter(v => v === 0).length
  const expiringSoonDays = 30
  const now = Date.now()
  const soonMs = expiringSoonDays * 24 * 60 * 60 * 1000
  const expiringSoon = Array.isArray(inventory) ? (inventory as any[]).filter(q => allowedItem(Number(q.itemId)) && q.expiryDate && (new Date(q.expiryDate).getTime() - now) <= soonMs).length : 0
  const salesCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  const itemsWithRecentSales = new Set<number>(
    Array.isArray(sales) ? (sales as any[]).filter(s => s.createdAt && new Date(s.createdAt).getTime() >= salesCutoff).map((s: any) => Number(s.itemId ?? s.itemQuantityId)) : []
  )
  const slowMovers = Array.isArray(items) ? (items as any[]).filter((i: any) => allowedItem(Number(i.id)) && !itemsWithRecentSales.has(Number(i.id))).length : 0

  // Derive detailed table rows (expiring soon or low stock)
  type Row = { itemId: number; name: string; qty: number; earliestExpiry?: string }
  const itemName = (id: number) => (Array.isArray(items) ? (items as any[]).find(i => Number(i.id) === Number(id))?.itemName : undefined) || `Item ${id}`
  const byItem: Record<number, Row> = {}
  if (Array.isArray(inventory)) {
    for (const q of inventory as any[]) {
      const id = Number(q.itemId)
      const r = byItem[id] || { itemId: id, name: itemName(id), qty: 0, earliestExpiry: undefined }
      r.qty += Number(q.quantity || 0)
      if (q.expiryDate) {
        if (!r.earliestExpiry || new Date(q.expiryDate) < new Date(r.earliestExpiry)) r.earliestExpiry = q.expiryDate
      }
      byItem[id] = r
    }
  }
  const detailedRows = Object.values(byItem)
    .filter(r => r.qty < lowStockThreshold || (r.earliestExpiry && (new Date(r.earliestExpiry).getTime() - now) <= soonMs))
    .sort((a, b) => (a.earliestExpiry ? new Date(a.earliestExpiry).getTime() : Infinity) - (b.earliestExpiry ? new Date(b.earliestExpiry).getTime() : Infinity))

  // Sparkline series: last 7 days sales count
  const salesSeries7 = useMemo(() => {
    const map: Record<string, number> = {}
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      map[d] = 0
    }
    if (Array.isArray(sales)) {
      for (const s of sales as any[]) {
        const d = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : ''
        if (d in map) map[d] += 1
      }
    }
    return Object.entries(map).map(([x, y]) => ({ x, y }))
  }, [sales])

  // Export CSV for detailed table
  const exportDetailed = () => {
    const header = ['itemId', 'name', 'qty', 'earliestExpiry']
    const lines = [header.join(',')].concat(
      detailedRows.map(r => [r.itemId, JSON.stringify(r.name), r.qty, r.earliestExpiry ? new Date(r.earliestExpiry).toISOString() : ''].join(','))
    )
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expiring_low_stock.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (itemsLoading || inventoryLoading || brandsLoading || salesLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total Items" value="Loading..." />
          <Stat label="In Stock" value="Loading..." />
          <Stat label="Brands" value="Loading..." />
          <Stat label="Sales (Today)" value="Loading..." />
        </div>
        <DashboardCharts />
      </div>
    )
  }

  return (
    <div className="space-y-4 relative">
      <Background intensity="strong" />
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="flex flex-wrap gap-2 items-center">
        <div className="text-sm text-muted-foreground">Filters:</div>
        <Select onValueChange={(v) => setTypeId(v === 'all' ? undefined : Number(v))}>
          <SelectTrigger className="w-48 h-9 bg-card/30 flex-none"><SelectValue placeholder="Item Type" /></SelectTrigger>
          <SelectContent side="bottom" align="start" position="popper" sideOffset={4} className="z-50 min-w-[var(--radix-select-trigger-width)] max-h-64 overflow-auto">
            <SelectItem value="all">All Types</SelectItem>
            {Array.isArray(types) ? (types as any[]).map(t => (<SelectItem key={t.id} value={String(t.id)}>{t.type}</SelectItem>)) : null}
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setBrandId(v === 'all' ? undefined : Number(v))}>
          <SelectTrigger className="w-48 h-9 bg-card/30 flex-none"><SelectValue placeholder="Brand" /></SelectTrigger>
          <SelectContent side="bottom" align="start" position="popper" sideOffset={4} className="z-50 min-w-[var(--radix-select-trigger-width)] max-h-64 overflow-auto">
            <SelectItem value="all">All Brands</SelectItem>
            {Array.isArray(brands) ? (brands as any[])
              .filter((b: any) => !typeId || Number(b.itemTypeId) === Number(typeId))
              .map(b => (<SelectItem key={b.id} value={String(b.id)}>{b.brandName}</SelectItem>)) : null}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Items" value={totalItems} color="violet" delta={2} delayMs={0} onClick={() => router.push('/items')} icon={<Package className="h-4 w-4" />} />
        <Stat label="In Stock" value={inStock} color="emerald" delta={1} delayMs={100} onClick={() => router.push('/inventory')} icon={<Boxes className="h-4 w-4" />} />
        <Stat label="Brands" value={totalBrands} color="sky" delta={0} delayMs={200} onClick={() => router.push('/brands')} icon={<Tag className="h-4 w-4" />} />
        <Stat label="Sales (Today)" value={salesToday} color="indigo" delta={5} delayMs={300} onClick={() => router.push('/sales')} icon={<TrendingUpIcon className="h-4 w-4" />} />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Stat label={`Low Stock (< ${lowStockThreshold})`} value={lowStock} color="amber" delayMs={0} onClick={() => router.push('/inventory')} icon={<Layers3 className="h-4 w-4" />} />
        <Stat label={`Expiring Soon (${expiringSoonDays}d)`} value={expiringSoon} color="rose" delayMs={100} onClick={() => router.push('/inventory')} icon={<Package className="h-4 w-4" />} />
        <Stat label="Stockouts" value={stockouts} color="rose" delayMs={200} onClick={() => router.push('/inventory')} icon={<Boxes className="h-4 w-4" />} />
        <Stat label="Slow Movers (30d)" value={slowMovers} color="amber" delayMs={300} onClick={() => router.push('/items')} icon={<Layers3 className="h-4 w-4" />} />
      </div>
      <DashboardCharts />

      <Card className="animate-fade-in-up">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Expiring Soon & Low Stock</CardTitle>
          <button className="text-sm underline" onClick={exportDetailed}>Export CSV</button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Item</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Earliest Expiry</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {detailedRows.map((r) => {
                  const exp = r.earliestExpiry ? new Date(r.earliestExpiry) : null
                  const days = exp ? Math.ceil((exp.getTime() - now) / (24 * 60 * 60 * 1000)) : undefined
                  const isLow = r.qty < lowStockThreshold
                  const isExpSoon = typeof days === 'number' && days <= expiringSoonDays
                  return (
                    <tr key={r.itemId} className="border-b last:border-0">
                      <td className="py-2">{r.name}</td>
                      <td className="py-2">{r.qty}</td>
                      <td className="py-2">{exp ? exp.toLocaleDateString() : '-'}</td>
                      <td className="py-2 space-x-1">
                        {isLow ? <Badge variant="destructive">Low</Badge> : null}
                        {isExpSoon ? <Badge variant="secondary">Expiring in {days}d</Badge> : null}
                      </td>
                    </tr>
                  )
                })}
                {detailedRows.length === 0 ? (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">All good — no items expiring soon or low in stock.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
