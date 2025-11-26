'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const TypeSchema = z.object({ id: z.number().optional(), type: z.string().min(1), status: z.boolean().default(true) })

type TypeForm = z.infer<typeof TypeSchema>

export default function Page(){
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['types'], queryFn: async ()=> (await api.get('/item-type')).data })
  const create = useMutation({
    mutationFn: async (p:TypeForm)=> (await api.post('/item-type', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['types']}); toast.success('Type created') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to create type')
  })
  const update = useMutation({
    mutationFn: async (p:TypeForm)=> (await api.put('/item-type', p)).data,
    onSuccess:()=> { qc.invalidateQueries({queryKey:['types']}); toast.success('Type updated') },
    onError:(e:any)=> toast.error(e?.message ?? 'Failed to update type')
  })
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Item Types</h1>
      <Create onCreate={(v)=>create.mutate(v)} />
      <Card>
        <CardHeader><CardTitle>All Types</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? 'Loading...' : error ? (
            <div className="text-sm text-destructive">Failed to load types</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">ID</th><th className="py-2">Type</th><th className="py-2">Status</th><th className="py-2">Actions</th></tr></thead>
              <tbody>{(data ?? []).map((t:any)=> (
                <tr key={t.id} className="border-b last:border-0"><td className="py-2">{t.id}</td><td className="py-2">{t.type}</td><td className="py-2">{Boolean(t.status) ? <Badge>Active</Badge> : <Badge variant='secondary'>Inactive</Badge>}</td><td className="py-2"><Switch checked={Boolean(t.status)} onCheckedChange={(v)=> update.mutate({ id: t.id, type: t.type, status: v })} /></td></tr>
              ))}</tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Create({ onCreate }:{ onCreate:(v:TypeForm)=>void }){
  const form = useForm<TypeForm>({ resolver: zodResolver(TypeSchema) as any, defaultValues:{ status:true } })
  return (
    <Card>
      <CardHeader><CardTitle>Create Type</CardTitle></CardHeader>
      <CardContent>
        <form className="grid gap-3 grid-cols-1 md:grid-cols-3 items-end" onSubmit={form.handleSubmit(onCreate)}>
          <div className="space-y-1"><label className="text-sm">Type Name</label><Input {...form.register('type')} placeholder="e.g. Electronics" /></div>
          <div className="flex items-center gap-2"><Switch {...form.register('status')} onCheckedChange={(v)=>form.setValue('status', v)} /> <span className="text-sm">Active</span></div>
          <Button type="submit">Create</Button>
        </form>
      </CardContent>
    </Card>
  )
}
