'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { dataApi } from '@/lib/data'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'

export default function Page(){
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)
  const { data: suppliers } = useQuery({ queryKey:['suppliers'], queryFn: dataApi.getSuppliers })
  const { data: pos, isLoading, error } = useQuery({ queryKey:['purchase-orders'], queryFn: dataApi.getPurchaseOrders })
  const po = Array.isArray(pos) ? pos.find(p => p.id === id) : undefined

  const qc = useQueryClient()
  const approve = useMutation({
    mutationFn: async ()=> (await api.post(`/purchase-orders/${id}/approve`, {})).data,
    onSuccess:()=> { toast.success('PO approved'); qc.invalidateQueries({queryKey:['purchase-orders']}) },
    onError:()=> toast.message('Demo mode: action simulated'),
  })
  const cancel = useMutation({
    mutationFn: async ()=> (await api.post(`/purchase-orders/${id}/cancel`, {})).data,
    onSuccess:()=> { toast.success('PO cancelled'); qc.invalidateQueries({queryKey:['purchase-orders']}) },
    onError:()=> toast.message('Demo mode: action simulated'),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">PO #{id}</h1>
        <div className="flex gap-2">
          <Link href="/purchase-orders"><Button variant="outline" size="sm">Back</Button></Link>
          <Button variant="outline" size="sm" onClick={()=> qc.invalidateQueries({queryKey:['purchase-orders']})}>Refresh</Button>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load</div>
          ) : !po ? (
            <div className="text-sm">PO not found</div>
          ) : (
            <div className="grid gap-3 grid-cols-1 md:grid-cols-4">
              <div>
                <div className="text-xs text-muted-foreground">Supplier</div>
                <div>{(suppliers as any[])?.find(s=> s.id===po.supplierId)?.name ?? po.supplierId}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Expected</div>
                <div>{po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : '-'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div>{po.status === 'Approved' ? <Badge>Approved</Badge> : po.status === 'Draft' ? <Badge variant='secondary'>Draft</Badge> : <Badge variant='outline'>{po.status}</Badge>}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Created</div>
                <div>{po.createdAt ? new Date(po.createdAt).toLocaleString() : '-'}</div>
              </div>
              <div className="md:col-span-4">
                <div className="text-xs text-muted-foreground">Notes</div>
                <div className="whitespace-pre-wrap">{po.notes ?? '-'}</div>
              </div>
              <div className="md:col-span-4 flex gap-2 pt-2">
                <Button size="sm" disabled={po.status!=='Draft'} onClick={()=> approve.mutate()}>Approve</Button>
                <Button size="sm" variant="destructive" disabled={po.status==='Cancelled' || po.status==='Closed'} onClick={()=> cancel.mutate()}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Coming soon: add items, quantities, and costs. (Demo scaffold)</div>
        </CardContent>
      </Card>
    </div>
  )
}
