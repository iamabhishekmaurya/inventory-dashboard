'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Page(){
  const [last, setLast] = useState<string>('')
  const [history, setHistory] = useState<string[]>([])
  const onScan = (code:string)=>{
    const val = code.trim()
    if (!val) return
    setLast(val)
    setHistory(h => [val, ...h].slice(0, 20))
  }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Scanning</h1>
      <Card>
        <CardHeader><CardTitle>Scanner</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="aspect-video w-full bg-muted/40 flex items-center justify-center rounded">
            <div className="text-sm text-muted-foreground">Webcam scanner placeholder (connect hardware scanner or integrate library)</div>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Focus here and scan or type code" onKeyDown={(e:any)=> { if (e.key==='Enter'){ e.preventDefault(); onScan(e.currentTarget.value); e.currentTarget.value='' } }} />
            <Button type="button" onClick={()=> onScan(String(Date.now()))}>Simulate</Button>
          </div>
          <div className="text-sm">Last: <span className="font-mono">{last || '-'}</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recent Scans</CardTitle></CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1">
            {history.map((h,i)=> (<li key={i} className="font-mono">{h}</li>))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
