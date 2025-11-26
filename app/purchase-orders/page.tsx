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
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const CreatePOSchema = z.object({
  supplierId: z.coerce.number(),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
})

type CreatePOForm = z.infer<typeof CreatePOSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: async ()=> await dataApi.getSuppliers() })
  const { data, isLoading, error } = useQuery({ queryKey: ['purchase-orders'], queryFn: async ()=> await dataApi.getPurchaseOrders() })
  const create = useMutation({
    mutationFn: async (p:CreatePOForm)=> (await api.post('/purchase-orders', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['purchase-orders']}); toast.success('PO created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create PO')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Purchase Orders</h1>
      <Create suppliers={Array.isArray(suppliers)? suppliers: []} onCreate={(v)=> create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All POs</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading POs...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load POs</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">PO #</th>
                  <th className="py-2">Supplier</th>
                  <th className="py-2">Expected</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(data)? data: []).map((po:any)=> (
                  <tr key={po.id} className="border-b last:border-0">
                    <td className="py-2">{po.id}</td>
                    <td className="py-2">{(suppliers as any[])?.find(s=> s.id===po.supplierId)?.name ?? po.supplierId}</td>
                    <td className="py-2">{po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : '-'}</td>
                    <td className="py-2">{po.status === 'Approved' ? <Badge>Approved</Badge> : po.status === 'Draft' ? <Badge variant='secondary'>Draft</Badge> : <Badge variant='outline'>{po.status}</Badge>}</td>
                    <td className="py-2"><Link className="underline" href={`/purchase-orders/${po.id}`}>Open</Link></td>
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

function Create({ suppliers, onCreate }:{ suppliers:any[]; onCreate:(v:CreatePOForm)=>void }){
  const form = useForm<CreatePOForm>({ resolver: zodResolver(CreatePOSchema) as any })
  return (
    <Card>
      <CardHeader><CardTitle>Create PO</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-6 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField
              control={form.control}
              name="supplierId"
              render={() => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Select onValueChange={(v)=> form.setValue('supplierId', Number(v))}>
                      <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s:any)=> (
                          <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
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
              name="expectedDate"
              render={({ field }: { field:any }) => (
                <FormItem>
                  <FormLabel>Expected Date</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }: { field:any }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-6 flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
