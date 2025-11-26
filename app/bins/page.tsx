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

const BinSchema = z.object({ id: z.number().optional(), warehouseId: z.coerce.number(), code: z.string().min(1), zone: z.string().optional().or(z.literal('')), status: z.boolean().default(true) })

type BinForm = z.infer<typeof BinSchema>

export default function Page() {
  const qc = useQueryClient()
  const { data: warehouses } = useQuery({ queryKey: ['warehouses'], queryFn: async () => await dataApi.getWarehouses() })
  const { data, isLoading, error } = useQuery({ queryKey: ['bins'], queryFn: async () => await dataApi.getBins() })
  const create = useMutation({
    mutationFn: async (p: BinForm) => (await api.post('/bins', p)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bins'] }); toast.success('Bin created') },
    onError: (e: any) => toast.error(e?.message ?? 'Failed to create bin')
  })
  const update = useMutation({
    mutationFn: async (p: BinForm) => (await api.put('/bins', p)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bins'] }); toast.success('Bin updated') },
    onError: (e: any) => toast.error(e?.message ?? 'Failed to update bin')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Bins</h1>
      <Create warehouses={Array.isArray(warehouses) ? warehouses : []} onCreate={(v) => create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Bins</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading bins...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load bins</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Warehouse</th><th className="py-2">Code</th><th className="py-2">Zone</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr></thead>
              <tbody>{(Array.isArray(data) ? data : []).map((b: any) => (
                <tr key={b.id} className="border-b last:border-0"><td className="py-2">{b.id}</td><td className="py-2">{(warehouses as any[])?.find(w => w.id === b.warehouseId)?.name ?? b.warehouseId}</td><td className="py-2">{b.code}</td><td className="py-2">{b.zone ?? '-'}</td><td className="py-2">{Boolean(b.status) ? <Badge>Active</Badge> : <Badge variant='secondary'>Inactive</Badge>}</td><td className="py-2"><Switch checked={Boolean(b.status)} onCheckedChange={(v) => update.mutate({ id: b.id, warehouseId: b.warehouseId, code: b.code, zone: b.zone, status: v })} /></td></tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ warehouses, onCreate }: { warehouses: any[]; onCreate: (v: BinForm) => void }) {
  const form = useForm<BinForm>({ resolver: zodResolver(BinSchema) as any, defaultValues: { status: true } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Bin</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-5 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField control={form.control} name="warehouseId" render={() => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <FormControl>
                  <Select onValueChange={(v) => form.setValue('warehouseId', Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w: any) => (
                        <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="code" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl><Input placeholder="A-01" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="zone" render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Zone</FormLabel>
                <FormControl><Input placeholder="A" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={() => (
              <FormItem className="flex flex-row items-center gap-2 mt-6">
                <FormLabel className="m-0">Active</FormLabel>
                <FormControl><Switch checked={form.watch('status')} onCheckedChange={(v) => form.setValue('status', v)} /></FormControl>
              </FormItem>
            )} />
            <div className="md:col-span-5 flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
