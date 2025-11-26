'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { dataApi } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const SaleSchema = z.object({ id: z.number().optional(), itemQuantityId: z.coerce.number(), inventoryId: z.coerce.number(), salePrice: z.coerce.number(), status: z.boolean().default(true) })

type SaleForm = z.infer<typeof SaleSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: quantities } = useQuery({ queryKey: ['inventory'], queryFn: dataApi.getInventory })
  const { data, isLoading, error } = useQuery({ queryKey: ['sales'], queryFn: async ()=> await dataApi.getSales() })
  const create = useMutation({
    mutationFn: async (p:SaleForm)=> (await api.post('/sales', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['sales']}); toast.success('Sale created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create sale')
  })
  const update = useMutation({
    mutationFn: async (p:SaleForm)=> (await api.put('/sales', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['sales']}); toast.success('Sale updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update sale')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Sales</h1>
      <Create quantities={Array.isArray(quantities)? quantities: []} onCreate={(v)=>create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Sales</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading sales...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load sales</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Quantity</th><th className="py-2">Inventory ID</th><th className="py-2">Price</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr></thead>
                <tbody>{(Array.isArray(data)? data: []).map((s:any)=> (
                  <tr key={s.id} className="border-b last:border-0"><td className="py-2">{s.id}</td><td className="py-2">{s.itemQuantityId}</td><td className="py-2">{s.inventoryId}</td><td className="py-2">{s.salePrice}</td><td className="py-2">{Boolean(s.status) ? <Badge>Active</Badge> : <Badge variant='secondary'>Inactive</Badge>}</td><td className="py-2"><Switch checked={Boolean(s.status)} onCheckedChange={(v)=> update.mutate({ id:s.id, itemQuantityId:s.itemQuantityId, inventoryId:s.inventoryId, salePrice:s.salePrice, status:v })} /></td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ quantities, onCreate }:{ quantities:any[]; onCreate:(v:SaleForm)=>void }){
  const form = useForm<SaleForm>({ resolver: zodResolver(SaleSchema) as any, defaultValues:{ status:true } })
  const fefoSorted = Array.isArray(quantities)
    ? [...quantities].sort((a:any,b:any)=>{
        const ax = a?.expiryDate ? new Date(a.expiryDate).getTime() : Number.POSITIVE_INFINITY
        const bx = b?.expiryDate ? new Date(b.expiryDate).getTime() : Number.POSITIVE_INFINITY
        return ax - bx
      })
    : []
  const suggestFEFO = ()=> {
    const pick = fefoSorted[0]
    if (pick) {
      form.setValue('itemQuantityId', Number(pick.id))
      form.setValue('inventoryId', Number(pick.inventoryId))
    }
  }
  return (
    <Card>
      <CardHeader><CardTitle>New Sale</CardTitle></CardHeader>
      <CardContent className="relative">
        <form className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-12" onSubmit={form.handleSubmit(onCreate)}>
          {/* Row 1 */}
          <div className="space-y-1 md:col-span-6">
            <label className="text-sm">Item Quantity</label>
            <div className="flex items-center gap-2">
              <Select onValueChange={(v)=> form.setValue('itemQuantityId', Number(v))}>
                <SelectTrigger className="w-full bg-card/30 h-10"><SelectValue placeholder="Select quantity row" /></SelectTrigger>
                <SelectContent side="bottom" align="start" position="popper" sideOffset={4} className="max-h-64 overflow-auto z-50 min-w-[var(--radix-select-trigger-width)]">
                  {fefoSorted.map((q:any)=> (
                    <SelectItem key={q.id} value={String(q.id)}>
                      {q.inventoryId} — {q.quantity} pcs {q.lotNumber ? `• Lot ${q.lotNumber}` : ''} {q.expiryDate ? `• Exp ${new Date(q.expiryDate).toLocaleDateString()}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="sm" onClick={suggestFEFO}>FEFO</Button>
            </div>
            {!(form.watch('itemQuantityId')) ? (<div className="text-[11px] text-muted-foreground">Pick the earliest-expiring quantity.</div>) : null}
          </div>
          <div className="space-y-1 md:col-span-4">
            <label className="text-sm">Inventory ID</label>
            <Select onValueChange={(v)=> form.setValue('inventoryId', Number(v))}>
              <SelectTrigger className="w-full bg-card/30 h-10"><SelectValue placeholder="Select inventory id" /></SelectTrigger>
              <SelectContent side="bottom" align="start" position="popper" sideOffset={4} className="max-h-64 overflow-auto z-50 min-w-[var(--radix-select-trigger-width)]">
                {fefoSorted.map((q:any)=> (
                  <SelectItem key={q.inventoryId} value={String(q.inventoryId)}>
                    {q.inventoryId} {q.lotNumber ? `• Lot ${q.lotNumber}` : ''} {q.expiryDate ? `• Exp ${new Date(q.expiryDate).toLocaleDateString()}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!(form.watch('inventoryId')) ? (<div className="text-[11px] text-muted-foreground">Matches the chosen quantity row.</div>) : null}
          </div>
          <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
            <div className="flex items-center gap-2 h-10">
              <Switch {...form.register('status')} onCheckedChange={(v)=>form.setValue('status', v)} />
              <span className="text-sm">Active</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="space-y-1 md:col-span-3">
            <label className="text-sm">Sale Price</label>
            <Input type="number" step="0.01" inputMode="decimal" {...form.register('salePrice', { valueAsNumber: true })} placeholder="0.00" className="w-full bg-card/30 h-10" />
            {form.formState.errors.salePrice ? (<div className="text-[11px] text-destructive">Enter a valid price</div>) : null}
          </div>
          <div className="md:col-span-9 flex items-end justify-end">
            <Button type="submit" className="w-full md:w-auto">Create</Button>
          </div>
        </form>
      </CardContent>
      </Card>
  )
}


