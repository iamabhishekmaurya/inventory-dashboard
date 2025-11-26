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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const AdjustmentSchema = z.object({
  id: z.number().optional(),
  itemId: z.coerce.number(),
  quantity: z.coerce.number(),
  reason: z.string().min(1),
  approved: z.boolean().default(false),
})

type AdjustmentForm = z.infer<typeof AdjustmentSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: items } = useQuery({ queryKey:['items'], queryFn: dataApi.getItems })
  const { data, isLoading, error } = useQuery({ queryKey:['adjustments'], queryFn: dataApi.getAdjustments })
  const create = useMutation({
    mutationFn: async (p:AdjustmentForm)=> (await api.post('/adjustments', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['adjustments']}); toast.success('Adjustment created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create adjustment')
  })
  const update = useMutation({
    mutationFn: async (p:AdjustmentForm)=> (await api.put('/adjustments', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['adjustments']}); toast.success('Adjustment updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update adjustment')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Stock Adjustments</h1>
      <Create items={Array.isArray(items)? items: []} onCreate={(v)=> create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Adjustments</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading adjustments...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load adjustments</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Item</th><th className="py-2">Qty</th><th className="py-2">Reason</th><th className="py-2">Approved</th><th className="py-2">Actions</th></tr></thead>
              <tbody>{(Array.isArray(data)? data: []).map((a:any)=> (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-2">{a.id}</td>
                  <td className="py-2">{(items as any[])?.find(i=> i.id===a.itemId)?.itemName ?? a.itemId}</td>
                  <td className="py-2">{a.quantity}</td>
                  <td className="py-2">{a.reason}</td>
                  <td className="py-2">{a.approved ? <Badge>Yes</Badge> : <Badge variant='secondary'>No</Badge>}</td>
                  <td className="py-2"><Switch checked={Boolean(a.approved)} onCheckedChange={(v)=> update.mutate({ id:a.id, itemId:a.itemId, quantity:a.quantity, reason:a.reason, approved:v })} /></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ items, onCreate }:{ items:any[]; onCreate:(v:AdjustmentForm)=>void }){
  const form = useForm<AdjustmentForm>({ resolver: zodResolver(AdjustmentSchema) as any, defaultValues:{ approved:false } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Adjustment</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-6 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField control={form.control} name="itemId" render={()=>(
              <FormItem className="md:col-span-2">
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
                <FormLabel>Quantity (+/-)</FormLabel>
                <FormControl><Input placeholder="-1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reason" render={({ field }: { field:any })=>(
              <FormItem className="md:col-span-2">
                <FormLabel>Reason</FormLabel>
                <FormControl><Input placeholder="Damage, Shrinkage, etc." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="approved" render={()=> (
              <FormItem className="flex flex-row items-center gap-2 mt-6">
                <FormLabel className="m-0">Approved</FormLabel>
                <FormControl><Switch checked={form.watch('approved')} onCheckedChange={(v)=> form.setValue('approved', v)} /></FormControl>
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
