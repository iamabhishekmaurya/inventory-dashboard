'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { dataApi } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const CountSchema = z.object({
  id: z.number().optional(),
  warehouseId: z.coerce.number().optional(),
  binId: z.coerce.number().optional(),
  scheduledDate: z.string().optional(),
  status: z.enum(['Planned','InProgress','Completed']).default('Planned'),
})

type CountForm = z.infer<typeof CountSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: warehouses } = useQuery({ queryKey:['warehouses'], queryFn: dataApi.getWarehouses })
  const { data: bins } = useQuery({ queryKey:['bins'], queryFn: dataApi.getBins })
  const { data, isLoading, error } = useQuery({ queryKey:['cycle-counts'], queryFn: dataApi.getCycleCounts })
  const create = useMutation({
    mutationFn: async (p:CountForm)=> (await api.post('/cycle-counts', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['cycle-counts']}); toast.success('Count scheduled') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to schedule count')
  })
  const update = useMutation({
    mutationFn: async (p:any)=> (await api.put('/cycle-counts', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['cycle-counts']}); toast.success('Count updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update count')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Cycle Counts</h1>
      <Create warehouses={Array.isArray(warehouses)? warehouses: []} bins={Array.isArray(bins)? bins: []} onCreate={(v)=> create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>Scheduled Counts</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading counts...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load counts</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Scope</th><th className="py-2">Scheduled</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr></thead>
              <tbody>{(Array.isArray(data)? data: []).map((c:any)=> (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2">{c.id}</td>
                  <td className="py-2">{c.binId ? `Bin #${c.binId}` : (c.warehouseId ? `Warehouse #${c.warehouseId}` : 'Global')}</td>
                  <td className="py-2">{c.scheduledDate ? new Date(c.scheduledDate).toLocaleString() : '-'}</td>
                  <td className="py-2">{c.status === 'Completed' ? <Badge variant='outline'>Completed</Badge> : c.status === 'InProgress' ? <Badge>In Progress</Badge> : <Badge variant='secondary'>Planned</Badge>}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=> update.mutate({ ...c, status:'InProgress' })}>Start</Button>
                      <Button size="sm" onClick={()=> update.mutate({ ...c, status:'Completed' })}>Complete</Button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ warehouses, bins, onCreate }:{ warehouses:any[]; bins:any[]; onCreate:(v:CountForm)=>void }){
  const form = useForm<CountForm>({ resolver: zodResolver(CountSchema) as any, defaultValues:{ status:'Planned' } })
  const binsFor = (wid:number)=> bins.filter(b=> b.warehouseId===wid)
  return (
    <Card>
      <CardHeader><CardTitle>Schedule Count</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-5 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField control={form.control} name="warehouseId" render={()=>(
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> { const id=Number(v); form.setValue('warehouseId', id); form.setValue('binId', undefined as any) }}>
                    <SelectTrigger><SelectValue placeholder="All warehouses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {warehouses.map((w:any)=> (<SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="binId" render={()=>(
              <FormItem>
                <FormLabel>Bin</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('binId', Number(v))}>
                    <SelectTrigger><SelectValue placeholder="All bins" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {binsFor(form.watch('warehouseId') as any || 0).map((b:any)=> (<SelectItem key={b.id} value={String(b.id)}>{b.code}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="scheduledDate" render={({ field }: { field:any })=>(
              <FormItem>
                <FormLabel>Scheduled</FormLabel>
                <FormControl><Input placeholder="YYYY-MM-DD HH:mm" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={()=>(
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={(v)=> form.setValue('status', v as any)}>
                    <SelectTrigger><SelectValue placeholder="Planned" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="InProgress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="md:col-span-5 flex justify-end">
              <Button type="submit">Schedule</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
