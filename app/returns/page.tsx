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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const ReturnSchema = z.object({
  id: z.number().optional(),
  kind: z.enum(['Supplier','Customer']),
  itemId: z.coerce.number(),
  quantity: z.coerce.number().min(1),
  reason: z.string().min(1),
  status: z.enum(['Requested','Approved','Rejected','Completed']).default('Requested'),
  notes: z.string().optional().or(z.literal('')),
})

type ReturnForm = z.infer<typeof ReturnSchema>

const REASONS = ['Damaged','Wrong item','Over-shipped','Short-dated','Other']

export default function Page(){
  const qc = useQueryClient()
  const { data: items } = useQuery({ queryKey:['items'], queryFn: dataApi.getItems })
  const { data, isLoading, error } = useQuery({ queryKey:['returns'], queryFn: dataApi.getReturns })
  const create = useMutation({
    mutationFn: async (p:ReturnForm)=> (await api.post('/returns', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['returns']}); toast.success('Return created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create return')
  })
  const update = useMutation({
    mutationFn: async (p:ReturnForm)=> (await api.put('/returns', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['returns']}); toast.success('Return updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update return')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Returns / RMA</h1>
      <Create items={Array.isArray(items)? items: []} onCreate={(v)=> create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Returns</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading returns...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load returns</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">ID</th>
                  <th className="py-2">Kind</th>
                  <th className="py-2">Item</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Reason</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Notes</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(data)? data: []).map((r:any)=> (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2">{r.id}</td>
                    <td className="py-2">{r.kind}</td>
                    <td className="py-2">{(items as any[])?.find(i=> i.id===r.itemId)?.itemName ?? r.itemId}</td>
                    <td className="py-2">{r.quantity}</td>
                    <td className="py-2">{r.reason}</td>
                    <td className="py-2">{r.status === 'Approved' ? <Badge>Approved</Badge> : r.status === 'Requested' ? <Badge variant='secondary'>Requested</Badge> : <Badge variant='outline'>{r.status}</Badge>}</td>
                    <td className="py-2">{r.notes ?? '-'}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={()=> update.mutate({ ...r, status:'Approved' })}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={()=> update.mutate({ ...r, status:'Rejected' })}>Reject</Button>
                        <Button size="sm" onClick={()=> update.mutate({ ...r, status:'Completed' })}>Complete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ items, onCreate }:{ items:any[]; onCreate:(v:ReturnForm)=>void }){
  const form = useForm<ReturnForm>({ resolver: zodResolver(ReturnSchema) as any, defaultValues:{ status:'Requested', kind:'Customer' } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Return</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-6 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField control={form.control} name="kind" render={()=>(
              <FormItem>
                <FormLabel>Kind</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('kind', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Select kind" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Supplier">Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
                <FormLabel>Quantity</FormLabel>
                <FormControl><Input placeholder="1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reason" render={()=>(
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('reason', v)}>
                    <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                    <SelectContent>
                      {REASONS.map(r=> (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={()=>(
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('status', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Requested">Requested</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
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
