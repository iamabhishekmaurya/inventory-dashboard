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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DataTable } from '@/components/data/DataTable'
import { useItemColumns, ItemRow } from '@/components/data/item-columns'
import { exportToCsv } from '@/components/data/csv'
import { toast } from 'sonner'

const ItemSchema = z.object({ id: z.number().optional(), itemName: z.string().min(1), itemBrandId: z.coerce.number(), status: z.boolean().default(true) })

type ItemForm = z.infer<typeof ItemSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data: brands, isLoading: brandsLoading, error: brandsError } = useQuery({ queryKey: ['brands'], queryFn: async ()=> (await api.get('/brand')).data })
  const { data: items, isLoading, error } = useQuery({ queryKey: ['items'], queryFn: async ()=> await dataApi.getItems() })

  const data: ItemRow[] = Array.isArray(items) ? items.map((i:any) => ({ ...i, brandName: (Array.isArray(brands) ? brands.find((b:any)=> b.id === i.itemBrandId)?.brandName : undefined) })) : []

  const create = useMutation({
    mutationFn: async (p:ItemForm)=> (await api.post('/item', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['items']}); toast.success('Item created') },
    onError: (e:any)=> toast.error(e?.message ?? 'Failed to create item')
  })

  const update = useMutation({
    mutationFn: async (p:ItemForm)=> (await api.put('/item', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['items']}); toast.success('Item updated') },
    onError: (e:any)=> toast.error(e?.message ?? 'Failed to update item')
  })

  const columns = useItemColumns()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Items</h1>
      <Create brands={Array.isArray(brands)? brands: []} onCreate={(v)=>create.mutate(v)} />
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading items...</div>
      ) : error ? (
        <div className="text-sm text-destructive">Failed to load items</div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onExportCsv={() => exportToCsv('items.csv', data.map(({ id, itemName, brandName, status }) => ({ id, itemName, brandName, status })))}
        />
      )}
    </div>
  )
}

function Create({ brands, onCreate }:{ brands:any[]; onCreate:(v:ItemForm)=>void }){
  const form = useForm<ItemForm>({ resolver: zodResolver(ItemSchema) as any, defaultValues:{ status:true } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Item</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-4 items-start" onSubmit={form.handleSubmit(onCreate)}>
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. iPhone 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemBrandId"
              render={() => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Select onValueChange={(v)=> form.setValue('itemBrandId', Number(v))}>
                      <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                      <SelectContent>
                        {brands.map((b:any)=> (
                          <SelectItem key={b.id} value={String(b.id)}>{b.brandName}</SelectItem>
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


