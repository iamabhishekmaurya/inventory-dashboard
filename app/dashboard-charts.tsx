'use client'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dataApi } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

function groupByDate(items: any[], dateKey: string) {
  const map: Record<string, number> = {}
  items.forEach((it) => {
    const d = new Date(it[dateKey] || it.createdAt)
    if (isNaN(d as any)) return
    const label = d.toISOString().slice(0, 10)
    map[label] = (map[label] ?? 0) + 1
  })
  return Object.entries(map).map(([date, count]) => ({ date, count }))
}

export default function DashboardCharts() {
  const { data: sales } = useQuery({ queryKey: ['sales'], queryFn: async () => await dataApi.getSales() })
  const { data: inventory } = useQuery({ queryKey: ['inventory'], queryFn: async () => await dataApi.getInventory() })
  const { data: items } = useQuery({ queryKey: ['items'], queryFn: async () => await dataApi.getItems() })
  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: async () => await dataApi.getBrands() })
  const { data: types } = useQuery({ queryKey: ['types'], queryFn: async () => await dataApi.getTypes() })
  const { data: returns } = useQuery({ queryKey: ['returns'], queryFn: async () => await dataApi.getReturns() })
  const salesSeries = useMemo(() => groupByDate(Array.isArray(sales) ? sales : [], 'createdAt'), [sales])
  const invSeries = useMemo(() => groupByDate(Array.isArray(inventory) ? inventory : [], 'createdAt'), [inventory])
  const topItems = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    const counts: Record<string, number> = {}
    const invById: Record<number, any> = {}
      ; (Array.isArray(inventory) ? inventory : []).forEach((q: any) => { invById[Number(q.id)] = q })
      ; (Array.isArray(sales) ? sales : []).forEach((s: any) => {
        const when = s.createdAt ? new Date(s.createdAt).getTime() : 0
        if (when < cutoff) return
        const qtyRow = invById[Number(s.itemQuantityId)]
        const itemId = qtyRow?.itemId
        const name = (Array.isArray(items) ? items : []).find((it: any) => it.id === itemId)?.itemName || String(itemId ?? 'Unknown')
        counts[name] = (counts[name] ?? 0) + 1
      })
    const arr = Object.entries(counts).map(([name, count]) => ({ name, count }))
    arr.sort((a, b) => b.count - a.count)
    return arr.slice(0, 8)
  }, [sales, inventory, items])

  const typeMix = useMemo(() => {
    const counts: Record<string, number> = {}
    const itemTypeOf = (it: any) => (Array.isArray(brands) ? brands : []).find((b: any) => b.id === it.itemBrandId)?.itemTypeId
    const typeName = (id: number) => (Array.isArray(types) ? types : []).find((t: any) => t.id === id)?.type || 'Unknown'
      ; (Array.isArray(items) ? items : []).forEach((it: any) => {
        const t = itemTypeOf(it)
        if (!t) return
        const name = typeName(t)
        counts[name] = (counts[name] ?? 0) + 1
      })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [items, brands, types])

  const lowStockByBrand = useMemo(() => {
    const perItemQty: Record<number, number> = {}
      ; (Array.isArray(inventory) ? inventory : []).forEach((q: any) => {
        perItemQty[q.itemId] = (perItemQty[q.itemId] ?? 0) + Number(q.quantity || 0)
      })
    const brandName = (id: number) => (Array.isArray(brands) ? brands : []).find((b: any) => b.id === id)?.brandName || `#${id}`
    const perBrandLow: Record<string, number> = {}
      ; (Array.isArray(items) ? items : []).forEach((it: any) => {
        const qty = perItemQty[it.id] ?? 0
        if (qty < 10) perBrandLow[brandName(it.itemBrandId)] = (perBrandLow[brandName(it.itemBrandId)] ?? 0) + 1
      })
    return Object.entries(perBrandLow).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8)
  }, [inventory, items, brands])

  const returnsMix = useMemo(() => {
    const counts: Record<string, number> = {}
      ; (Array.isArray(returns) ? returns : []).forEach((r: any) => { counts[r.status] = (counts[r.status] ?? 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [returns])

  const sales7 = useMemo(() => {
    const map: Record<string, number> = {}
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      map[d] = 0
    }
    ; (Array.isArray(sales) ? sales : []).forEach((s: any) => {
      const d = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : ''
      if (d in map) map[d] += 1
    })
    return Object.entries(map).map(([date, count]) => ({ date, count }))
  }, [sales])

  const agingRadar = useMemo(() => {
    const buckets = [
      { name: '<30d', min: 0, max: 29 },
      { name: '30-60d', min: 30, max: 60 },
      { name: '61-90d', min: 61, max: 90 },
      { name: '>90d', min: 91, max: 10000 },
    ]
    const now = Date.now()
    const data = buckets.map(b => ({ name: b.name, value: 0 }))
      ; (Array.isArray(inventory) ? inventory : []).forEach((q: any) => {
        if (!q.createdAt) return
        const days = Math.floor((now - new Date(q.createdAt).getTime()) / (24 * 60 * 60 * 1000))
        const idx = buckets.findIndex(b => days >= b.min && days <= b.max)
        if (idx >= 0) data[idx].value += 1
      })
    return data
  }, [inventory])

  const COLORS = ['#6366f1', '#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6', '#84cc16']
  return (
    <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
      <Card className="xl:col-span-2 hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Sales Over Time</CardTitle></CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <defs>
                <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" /><YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#4f46e5" fillOpacity={1} fill="url(#gradSales)" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Inventory Batches Added</CardTitle></CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={invSeries} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" /><YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#22c55e" fill="#22c55e33" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="xl:col-span-3 hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Top Items (30d)</CardTitle></CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItems} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Sales" fill="#06b6d4" radius={[4, 4, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Item Type Mix</CardTitle></CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeMix.length ? typeMix : [{ name: 'No Data', value: 1 }]} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                {typeMix.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Low Stock by Brand</CardTitle></CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lowStockByBrand}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Returns Status Mix</CardTitle></CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={returnsMix.length ? returnsMix : [{ name: 'No Data', value: 1 }]} dataKey="value" nameKey="name" outerRadius={90}>
                {returnsMix.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Sales (7d)</CardTitle></CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales7}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" /><YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow bg-card/30 border-none">
        <CardHeader><CardTitle>Stock Aging</CardTitle></CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={agingRadar} outerRadius={90}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="Batches" dataKey="value" stroke="#14b8a6" fill="#14b8a633" />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

