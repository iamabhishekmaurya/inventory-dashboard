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
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const SupplierSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  leadTimeDays: z.coerce.number().optional(),
  terms: z.string().optional().or(z.literal('')),
  rating: z.coerce.number().optional(),
  status: z.boolean().default(true),
})

type SupplierForm = z.infer<typeof SupplierSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['suppliers'], queryFn: async ()=> await dataApi.getSuppliers() })
  const create = useMutation({
    mutationFn: async (p:SupplierForm)=> (await api.post('/suppliers', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['suppliers']}); toast.success('Supplier created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create supplier')
  })
  const update = useMutation({
    mutationFn: async (p:SupplierForm)=> (await api.put('/suppliers', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['suppliers']}); toast.success('Supplier updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update supplier')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Suppliers</h1>
      <Create onCreate={(v)=> create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Suppliers</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading suppliers...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load suppliers</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Contact</th>
                  <th className="py-2">Lead Time</th>
                  <th className="py-2">Terms</th>
                  <th className="py-2">Rating</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(data) ? data : []).map((s:any) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2">{s.id}</td>
                    <td className="py-2">{s.name}</td>
                    <td className="py-2">{s.email || s.phone || '-'}</td>
                    <td className="py-2">{s.leadTimeDays ?? '-'}</td>
                    <td className="py-2">{s.terms ?? '-'}</td>
                    <td className="py-2">{s.rating ?? '-'}</td>
                    <td className="py-2">{Boolean(s.status) ? <Badge>Active</Badge> : <Badge variant='secondary'>Inactive</Badge>}</td>
                    <td className="py-2">{/* future: edit/drawer */}</td>
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

function Create({ onCreate }:{ onCreate:(v:SupplierForm)=>void }){
  const form = useForm<SupplierForm>({ resolver: zodResolver(SupplierSchema) as any, defaultValues:{ status:true } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Supplier</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-6 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field:any }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field:any }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }: { field:any }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1-555-0100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leadTimeDays"
              render={({ field }: { field:any }) => (
                <FormItem>
                  <FormLabel>Lead Time (days)</FormLabel>
                  <FormControl>
                    <Input placeholder="7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }: { field:any }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input placeholder="Net 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }: { field:any }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input placeholder="4.5" {...field} />
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
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
