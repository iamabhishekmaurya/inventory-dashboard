'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { dataApi } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const TransferSchema = z.object({
  id: z.number().optional(),
  fromWarehouseId: z.coerce.number(),
  toWarehouseId: z.coerce.number(),
  fromBinId: z.coerce.number().optional(),
  toBinId: z.coerce.number().optional(),
  itemId: z.coerce.number().optional(),
  quantity: z.coerce.number().min(1),
  notes: z.string().optional(),
})

type TransferForm = z.infer<typeof TransferSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: warehouses } = useQuery({ queryKey: ['warehouses'], queryFn: async ()=> await dataApi.getWarehouses() })
  const { data: bins } = useQuery({ queryKey: ['bins'], queryFn: async ()=> await dataApi.getBins() })
  const { data: items } = useQuery({ queryKey: ['items'], queryFn: async ()=> await dataApi.getItems() })
  const { data, isLoading, error } = useQuery({ queryKey: ['transfers'], queryFn: async ()=> await dataApi.getTransfers() })
  const create = useMutation({
    mutationFn: async (p:TransferForm)=> (await api.post('/transfers', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['transfers']}); toast.success('Transfer created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create transfer')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Transfers</h1>
      <Create warehouses={Array.isArray(warehouses)? warehouses: []} bins={Array.isArray(bins)? bins: []} items={Array.isArray(items)? items: []} onCreate={(v)=>create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>History</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading transfers...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load transfers</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">From</th><th className="py-2">To</th><th className="py-2">Item</th><th className="py-2">Qty</th><th className="py-2">Notes</th></tr></thead>
              <tbody>{(Array.isArray(data)? data: []).map((t:any)=> (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2">{t.id}</td>
                  <td className="py-2">{`${(warehouses as any[])?.find(w=> w.id===t.fromWarehouseId)?.name ?? t.fromWarehouseId}`}{t.fromBinId ? ` / ${(bins as any[])?.find(b=> b.id===t.fromBinId)?.code ?? t.fromBinId}` : ''}</td>
                  <td className="py-2">{`${(warehouses as any[])?.find(w=> w.id===t.toWarehouseId)?.name ?? t.toWarehouseId}`}{t.toBinId ? ` / ${(bins as any[])?.find(b=> b.id===t.toBinId)?.code ?? t.toBinId}` : ''}</td>
                  <td className="py-2">{(items as any[])?.find(i=> i.id===t.itemId)?.itemName ?? (t.itemId ?? '-')}</td>
                  <td className="py-2">{t.quantity}</td>
                  <td className="py-2">{t.notes ?? '-'}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ warehouses, bins, items, onCreate }:{ warehouses:any[]; bins:any[]; items:any[]; onCreate:(v:TransferForm)=>void }){
  const form = useForm<TransferForm>({ resolver: zodResolver(TransferSchema) as any })
  const binsFor = (wid:number)=> bins.filter(b=> b.warehouseId===wid)
  return (
    <Card>
      <CardHeader><CardTitle>Create Transfer</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-6 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField control={form.control} name="fromWarehouseId" render={()=>(
              <FormItem>
                <FormLabel>From Warehouse</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> { const id=Number(v); form.setValue('fromWarehouseId', id); form.setValue('fromBinId', undefined as any) }}>
                    <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w:any)=> (<SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fromBinId" render={()=>(
              <FormItem>
                <FormLabel>From Bin</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('fromBinId', Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Select bin" /></SelectTrigger>
                    <SelectContent>
                      {binsFor(form.watch('fromWarehouseId') as any || 0).map((b:any)=> (<SelectItem key={b.id} value={String(b.id)}>{b.code}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="toWarehouseId" render={()=>(
              <FormItem>
                <FormLabel>To Warehouse</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> { const id=Number(v); form.setValue('toWarehouseId', id); form.setValue('toBinId', undefined as any) }}>
                    <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w:any)=> (<SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="toBinId" render={()=>(
              <FormItem>
                <FormLabel>To Bin</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('toBinId', Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Select bin" /></SelectTrigger>
                    <SelectContent>
                      {binsFor(form.watch('toWarehouseId') as any || 0).map((b:any)=> (<SelectItem key={b.id} value={String(b.id)}>{b.code}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="itemId" render={()=>(
              <FormItem>
                <FormLabel>Item</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('itemId', Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                    <SelectContent>
                      {items.map((i:any)=> (<SelectItem key={i.id} value={String(i.id)}>{i.itemName}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="quantity" render={({ field }: { field:any })=>(
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl><Input placeholder="1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }: { field:any })=>(
              <FormItem className="md:col-span-6">
                <FormLabel>Notes</FormLabel>
                <FormControl><Input placeholder="Optional" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="md:col-span-6 flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
