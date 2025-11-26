'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Page(){
  const [keys, setKeys] = useState<{id:number; label:string; masked:string}[]>([
    { id:1, label:'Server Key', masked:'sk_live_****************' },
  ])
  const [webhooks, setWebhooks] = useState<{id:number; url:string; events:string[]; enabled:boolean}[]>([
    { id:1, url:'https://example.com/webhook', events:['po.created','inventory.updated'], enabled:true },
  ])
  const createKey = ()=> {
    const id = Date.now()
    setKeys([{ id, label:`Key ${id}`, masked:'sk_demo_****************' }, ...keys])
  }
  const revoke = (id:number)=> setKeys(keys.filter(k=> k.id!==id))
  const addWebhook = ()=> setWebhooks([{ id:Date.now(), url:'', events:[], enabled:false }, ...webhooks])
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Integrations</h1>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>API Keys</CardTitle>
          <Button variant="outline" size="sm" onClick={createKey}>Create Key</Button>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b"><th className="py-2">Label</th><th className="py-2">Key</th><th className="py-2">Actions</th></tr></thead>
            <tbody>{keys.map(k=> (
              <tr key={k.id} className="border-b last:border-0"><td className="py-2">{k.label}</td><td className="py-2 font-mono">{k.masked}</td><td className="py-2"><Button variant="destructive" size="sm" onClick={()=> revoke(k.id)}>Revoke</Button></td></tr>
            ))}</tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Webhooks</CardTitle>
          <Button variant="outline" size="sm" onClick={addWebhook}>Add Webhook</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {webhooks.map((w, idx)=> (
            <div key={w.id} className="grid gap-2 grid-cols-1 md:grid-cols-5 items-end">
              <div className="md:col-span-2">
                <div className="text-xs mb-1">URL</div>
                <Input value={w.url} onChange={(e)=> {
                  const next=[...webhooks]; next[idx]={...w, url:e.target.value}; setWebhooks(next)
                }} placeholder="https://example.com/webhook" />
              </div>
              <div>
                <div className="text-xs mb-1">Events</div>
                <Select onValueChange={(v)=> {
                  const next=[...webhooks]; next[idx]={...w, events: v? [v]: []}; setWebhooks(next)
                }}>
                  <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="po.created">po.created</SelectItem>
                    <SelectItem value="inventory.updated">inventory.updated</SelectItem>
                    <SelectItem value="sale.created">sale.created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={w.enabled} onCheckedChange={(v)=> { const next=[...webhooks]; next[idx]={...w, enabled:v}; setWebhooks(next) }} />
                <span className="text-sm">Enabled</span>
              </div>
              <div className="flex justify-end">
                <Button variant="destructive" size="sm" onClick={()=> setWebhooks(webhooks.filter(x=> x.id!==w.id))}>Remove</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
