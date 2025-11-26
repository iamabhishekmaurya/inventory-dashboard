'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page(){
  const router = useRouter()
  useEffect(()=>{
    try { localStorage.removeItem('token') } catch {}
    router.replace('/auth/login')
  },[router])
  return null
}
