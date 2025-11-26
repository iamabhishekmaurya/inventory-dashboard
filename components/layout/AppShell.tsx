"use client"

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import PageTransition from '@/components/layout/PageTransition'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth')

  if (isAuthRoute) {
    // Auth pages: no sidebar, minimal top bar with brand + theme toggle
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="h-14 border-b w-full flex items-center justify-between px-4 border-b-0">
          <div className="text-sm font-semibold tracking-tight">
            {process.env.NEXT_PUBLIC_APP_NAME || 'Inventory Manager'}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 flex items-stretch justify-center">
          {children}
        </main>
      </div>
    )
  }

  // Dashboard pages: full shell with sidebar, breadcrumbs, and page transition
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex min-h-dvh flex-col">
        <Topbar />
        <div className="px-4 pt-2">
          <Breadcrumbs />
        </div>
        <main className="p-4">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
