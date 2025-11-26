'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { dataApi } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const BrandSchema = z.object({ id: z.number().optional(), brandName: z.string().min(1), itemTypeId: z.coerce.number(), status: z.boolean().default(true) })

type BrandForm = z.infer<typeof BrandSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: types, isLoading: typesLoading, error: typesError } = useQuery({ queryKey: ['types'], queryFn: async ()=> await dataApi.getTypes() })
  const { data, isLoading, error } = useQuery({ queryKey: ['brands'], queryFn: async ()=> await dataApi.getBrands() })
  const create = useMutation({
    mutationFn: async (p:BrandForm)=> (await api.post('/brand', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['brands']}); toast.success('Brand created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create brand')
  })
  const update = useMutation({
    mutationFn: async (p:BrandForm)=> (await api.put('/brand', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['brands']}); toast.success('Brand updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update brand')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Brands</h1>
      <Create types={Array.isArray(types)? types: []} onCreate={(v)=>create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Brands</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading brands...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load brands</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Brand</th><th className="py-2">Type</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr></thead>
              <tbody>{(Array.isArray(data)? data: []).map((b:any)=> (
                <tr key={b.id} className="border-b last:border-0"><td className="py-2">{b.id}</td><td className="py-2">{b.brandName}</td><td className="py-2">{b.itemTypeId}</td><td className="py-2">{Boolean(b.status) ? <Badge>Active</Badge> : <Badge variant='secondary'>Inactive</Badge>}</td><td className="py-2"><Switch checked={Boolean(b.status)} onCheckedChange={(v)=> update.mutate({ id:b.id, brandName:b.brandName, itemTypeId:b.itemTypeId, status:v })} /></td></tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ types, onCreate }:{ types:any[]; onCreate:(v:BrandForm)=>void }){
  const form = useForm<BrandForm>({ resolver: zodResolver(BrandSchema) as any, defaultValues:{ status:true } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Brand</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-4 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }: { field: any }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Apple" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemTypeId"
              render={() => (
                <FormItem>
                  <FormLabel>Item Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={(v)=> form.setValue('itemTypeId', Number(v))}>
                      <SelectTrigger><SelectValue placeholder="Select item type" /></SelectTrigger>
                      <SelectContent>
                        {types.map((t:any)=> (
                          <SelectItem key={t.id} value={String(t.id)}>{t.type}</SelectItem>
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
            <div className="md:col-span-4 flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


