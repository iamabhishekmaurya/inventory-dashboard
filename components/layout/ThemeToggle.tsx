'use client'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle(){
  const [dark, setDark] = useState<boolean>(false)
  useEffect(()=>{
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const initial = saved ? saved === 'dark' : true
    setDark(initial)
  },[])
  useEffect(()=>{
    if (typeof document !== 'undefined'){
      document.documentElement.classList.toggle('dark', dark)
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  },[dark])
  return (
    <Button variant="ghost" size="icon" onClick={()=>setDark(v=>!v)} aria-label="Toggle theme">
      {dark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
    </Button>
  )
}
