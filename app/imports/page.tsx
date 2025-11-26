'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const templates: {name:string; headers:string[]}[] = [
  { name:'Items', headers:['id','itemName','itemBrandId','status'] },
  { name:'Suppliers', headers:['id','name','email','phone','leadTimeDays','terms','rating','status'] },
  { name:'Inventory', headers:['id','itemId','inventoryId','quantity','purchasePrice','lotNumber','expiryDate','status'] },
  { name:'PurchaseOrders', headers:['id','supplierId','status','expectedDate','notes'] },
]

export default function Page(){
  const download = (t:{name:string; headers:string[]})=> {
    const csv = t.headers.join(',') + '\n'
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${t.name}.template.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  const onUpload = (file:File)=> {
    // Placeholder: parse/validate client-side, then POST to API later
    console.log('Uploaded:', file.name)
    alert(`Uploaded: ${file.name}`)
  }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Imports</h1>
      <Card>
        <CardHeader><CardTitle>CSV Templates</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {templates.map(t=> (
            <div key={t.name} className="flex items-center justify-between">
              <div className="text-sm">{t.name}</div>
              <Button variant="outline" size="sm" onClick={()=> download(t)}>Download Template</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Upload CSV</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <input type="file" accept=".csv" onChange={(e)=> { const f=e.target.files?.[0]; if (f) onUpload(f) }} />
          <div className="text-xs text-muted-foreground">Supported: Items, Suppliers, Inventory, PurchaseOrders</div>
        </CardContent>
      </Card>
    </div>
  )
}
