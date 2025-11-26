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

const WarehouseSchema = z.object({ id: z.number().optional(), name: z.string().min(1), code: z.string().min(1), status: z.boolean().default(true) })

type WarehouseForm = z.infer<typeof WarehouseSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['warehouses'], queryFn: async ()=> await dataApi.getWarehouses() })
  const create = useMutation({
    mutationFn: async (p:WarehouseForm)=> (await api.post('/warehouses', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['warehouses']}); toast.success('Warehouse created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create warehouse')
  })
  const update = useMutation({
    mutationFn: async (p:WarehouseForm)=> (await api.put('/warehouses', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['warehouses']}); toast.success('Warehouse updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update warehouse')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Warehouses</h1>
      <Create onCreate={(v)=>create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Warehouses</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading warehouses...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load warehouses</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Name</th><th className="py-2">Code</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr></thead>
              <tbody>{(Array.isArray(data)? data: []).map((w:any)=> (
                <tr key={w.id} className="border-b last:border-0"><td className="py-2">{w.id}</td><td className="py-2">{w.name}</td><td className="py-2">{w.code}</td><td className="py-2">{Boolean(w.status) ? <Badge>Active</Badge> : <Badge variant='secondary'>Inactive</Badge>}</td><td className="py-2"><Switch checked={Boolean(w.status)} onCheckedChange={(v)=> update.mutate({ id:w.id, name:w.name, code:w.code, status:v })} /></td></tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ onCreate }:{ onCreate:(v:WarehouseForm)=>void }){
  const form = useForm<WarehouseForm>({ resolver: zodResolver(WarehouseSchema) as any, defaultValues:{ status:true } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Warehouse</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-4 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField control={form.control} name="name" render={({ field }: { field:any })=> (
              <FormItem className="md:col-span-2">
                <FormLabel>Name</FormLabel>
                <FormControl><Input placeholder="Main DC" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="code" render={({ field }: { field:any })=> (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl><Input placeholder="DC1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={()=> (
              <FormItem className="flex flex-row items-center gap-2 mt-6">
                <FormLabel className="m-0">Active</FormLabel>
                <FormControl><Switch checked={form.watch('status')} onCheckedChange={(v)=> form.setValue('status', v)} /></FormControl>
              </FormItem>
            )} />
            <div className="md:col-span-4 flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
