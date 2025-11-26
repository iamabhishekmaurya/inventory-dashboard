'use client'
import { useQuery } from '@tanstack/react-query'
import { dataApi } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Page(){
  const { data: inventory } = useQuery({ queryKey:['inventory'], queryFn: dataApi.getInventory })
  const rows = Array.isArray(inventory) ? inventory.slice(0, 20) : []
  const print = ()=> window.print()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Labels</h1>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Printable Labels</CardTitle>
          <Button variant="outline" size="sm" onClick={print}>Print</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 print:grid-cols-3">
            {rows.map((q:any)=> (
              <div key={q.id} className="border rounded p-3 print:p-2">
                <div className="text-sm font-semibold">INV {q.inventoryId}</div>
                <div className="text-xs text-muted-foreground">Item: {q.itemId}</div>
                {q.lotNumber ? <div className="text-xs">Lot: {q.lotNumber}</div> : null}
                {q.expiryDate ? <div className="text-xs">Exp: {new Date(q.expiryDate).toLocaleDateString()}</div> : null}
                <div className="text-xs">Qty: {q.quantity}</div>
                <div className="mt-2 h-8 bg-muted/60 flex items-center justify-center text-[10px] tracking-widest">
                  ▒▒▒▒▒▒▒▒▒▒ BARCODE ▒▒▒▒▒▒▒▒▒▒
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
