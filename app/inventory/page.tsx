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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const InventorySchema = z.object({ id: z.number().optional(), itemId: z.coerce.number(), inventoryId: z.coerce.number(), purchasePrice: z.coerce.number(), quantity: z.coerce.number(), lotNumber: z.string().optional().or(z.literal('')), expiryDate: z.string().optional().or(z.literal('')), status: z.boolean().default(true) })

type InventoryForm = z.infer<typeof InventorySchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: items } = useQuery({ queryKey: ['items'], queryFn: async ()=> await dataApi.getItems() })
  const { data, isLoading, error } = useQuery({ queryKey: ['inventory'], queryFn: async ()=> await dataApi.getInventory() })
  const create = useMutation({
    mutationFn: async (p:InventoryForm)=> (await api.post('/quantity', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['inventory']}); toast.success('Inventory added') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to add inventory')
  })
  const update = useMutation({
    mutationFn: async (p:InventoryForm)=> (await api.put('/quantity', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['inventory']}); toast.success('Inventory updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update inventory')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Inventory</h1>
      <Create items={Array.isArray(items)? items: []} onCreate={(v)=>create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Batches</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading inventory...</div>
          ) : error ? (
            <div>Failed to load inventory</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Item</th><th className="py-2">Inventory ID</th><th className="py-2">Lot</th><th className="py-2">Expiry</th><th className="py-2">Qty</th><th className="py-2">Price</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr></thead>
              <tbody>{(Array.isArray(data)? data: []).map((q:any)=> (
                <tr key={q.id} className="border-b last:border-0"><td className="py-2">{q.id}</td><td className="py-2">{q.itemId}</td><td className="py-2">{q.inventoryId}</td><td className="py-2">{q.lotNumber ?? '-'}</td><td className="py-2">{q.expiryDate ? new Date(q.expiryDate).toLocaleDateString() : '-'}</td><td className="py-2">{q.quantity}</td><td className="py-2">{q.purchasePrice}</td><td className="py-2">{Boolean(q.status) ? <Badge>Active</Badge> : <Badge variant='secondary'>Inactive</Badge>}</td><td className="py-2"><Switch checked={Boolean(q.status)} onCheckedChange={(v)=> update.mutate({ id:q.id, itemId:q.itemId, inventoryId:q.inventoryId, purchasePrice:q.purchasePrice, quantity:q.quantity, lotNumber:q.lotNumber, expiryDate:q.expiryDate, status:v })} /></td></tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ items, onCreate }:{ items:any[]; onCreate:(v:InventoryForm)=>void }){
  const form = useForm<InventoryForm>({ resolver: zodResolver(InventorySchema) as any, defaultValues:{ status:true } })
  return (
    <Card>
      <CardHeader><CardTitle>Add Inventory</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-6 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField
              control={form.control}
              name="itemId"
              render={() => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <FormControl>
                    <Select onValueChange={(v)=> form.setValue('itemId', Number(v))}>
                      <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                      <SelectContent>
                        {items.map((i:any)=> (
                          <SelectItem key={i.id} value={String(i.id)}>{i.itemName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inventoryId"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Inventory ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Batch/Inventory ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem className="flex flex-row items-center gap-2 mt-6">
                  <FormLabel className="m-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={form.watch('status')} onCheckedChange={(v)=> form.setValue('status', v)} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="md:col-span-6 flex justify-end">
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

