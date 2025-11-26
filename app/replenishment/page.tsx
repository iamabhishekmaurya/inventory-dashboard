'use client'
import { useQuery } from '@tanstack/react-query'
import { dataApi } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function number(n:number){
  return isFinite(n) ? Math.max(0, Math.round(n)) : 0
}

export default function Page(){
  const { data: items } = useQuery({ queryKey:['items'], queryFn: dataApi.getItems })
  const { data: inventory } = useQuery({ queryKey:['inventory'], queryFn: dataApi.getInventory })
  const { data: suppliers } = useQuery({ queryKey:['suppliers'], queryFn: dataApi.getSuppliers })
  const { data: sales } = useQuery({ queryKey:['sales'], queryFn: dataApi.getSales })

  const perItemQty: Record<number, number> = {}
  ;(Array.isArray(inventory) ? inventory : []).forEach((q:any)=> {
    const id = Number(q.itemId)
    perItemQty[id] = (perItemQty[id] ?? 0) + Number(q.quantity || 0)
  })

  // Map sale.itemQuantityId -> inventory.itemId
  const invById: Record<number, any> = {}
  ;(Array.isArray(inventory) ? inventory : []).forEach((q:any)=> { invById[Number(q.id)] = q })

  const cutoff = Date.now() - 30*24*60*60*1000
  const perItemSales30d: Record<number, number> = {}
  ;(Array.isArray(sales) ? sales : []).forEach((s:any)=> {
    const when = s.createdAt ? new Date(s.createdAt).getTime() : 0
    if (when >= cutoff) {
      const qtyRow = invById[Number(s.itemQuantityId)]
      const itemId = qtyRow ? Number(qtyRow.itemId) : undefined
      if (itemId) perItemSales30d[itemId] = (perItemSales30d[itemId] ?? 0) + 1
    }
  })

  const rows = (Array.isArray(items)? items: []).map((it:any)=>{
    const current = perItemQty[Number(it.id)] ?? 0
    const sales30 = perItemSales30d[Number(it.id)] ?? 0
    const forecastPer30d = sales30 // simple moving count for 30d demo
    const supplierLeadDays = (Array.isArray(suppliers) && suppliers[0]?.leadTimeDays) ? Number(suppliers[0].leadTimeDays) : 7
    const safety = 10
    const suggested = Math.max(0, Math.ceil((forecastPer30d * (supplierLeadDays/30)) + safety - current))
    return { id: it.id, itemName: it.itemName, current, forecastPer30d, supplierLeadDays, safety, suggested }
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Replenishment</h1>
      <Card>
        <CardHeader><CardTitle>Suggested Orders</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Item</th>
                <th className="py-2">Current</th>
                <th className="py-2">Forecast (30d)</th>
                <th className="py-2">Lead Time (d)</th>
                <th className="py-2">Safety</th>
                <th className="py-2">Suggested</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=> (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2">{r.itemName}</td>
                  <td className="py-2">{number(r.current)}</td>
                  <td className="py-2">{number(r.forecastPer30d)}</td>
                  <td className="py-2">{number(r.supplierLeadDays)}</td>
                  <td className="py-2">{number(r.safety)}</td>
                  <td className="py-2 font-medium">{number(r.suggested)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
