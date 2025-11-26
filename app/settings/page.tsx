'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useEffect, useState } from 'react'

export default function Page(){
  const [dark, setDark] = useState(true)
  const [notifications, setNotifications] = useState(true)
  useEffect(()=>{
    if (typeof document !== 'undefined'){
      document.documentElement.classList.toggle('dark', dark)
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  },[dark])
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="font-medium">Dark Mode</div>
            <div className="text-sm text-muted-foreground">Toggle between light and dark theme</div>
          </div>
          <Switch checked={dark} onCheckedChange={setDark} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="font-medium">Enable notifications</div>
            <div className="text-sm text-muted-foreground">Email / in-app alerts</div>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </CardContent>
      </Card>
      <div>
        <Button variant="outline">Save preferences</Button>
      </div>
    </div>
  )
}
