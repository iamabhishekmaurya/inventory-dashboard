'use client'
import Link from 'next/link'
import { Home, Layers3, ShoppingCart, Boxes, LineChart, PackageCheck, Tags, Truck, FileText, Building2, Package, ArrowLeftRight, RotateCcw, RefreshCcw, Wrench, TrendingUp, QrCode, Badge, Webhook, Upload, ChevronDown, HelpCircle, MessageCircle, LifeBuoy } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useState } from 'react'
import { SidebarFooter } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Sidebar({ mobile = false }: { mobile?: boolean } = {}) {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [groups, setGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved) setCollapsed(saved === 'true')
      const g = localStorage.getItem('sidebar-groups')
      if (g) setGroups(JSON.parse(g))
    } catch { }
    const handler = () => {
      setCollapsed((v) => {
        const next = !v
        try { localStorage.setItem('sidebar-collapsed', String(next)) } catch { }
        return next
      })
    }
    window.addEventListener('toggle-sidebar', handler as any)
    return () => window.removeEventListener('toggle-sidebar', handler as any)
  }, [])

  const toggleGroup = (k: string) => {
    setGroups((prev) => {
      const next = { ...prev, [k]: !prev[k] }
      try { localStorage.setItem('sidebar-groups', JSON.stringify(next)) } catch { }
      return next
    })
  }

  const groupsDef: Array<{ key: string; label: string; items: Array<{ href: string; label: string; icon: any }> }> = [
    {
      key: 'masters', label: 'Masters', items: [
        { href: '/types', label: 'Item Types', icon: Layers3 },
        { href: '/brands', label: 'Brands', icon: Tags },
        { href: '/suppliers', label: 'Suppliers', icon: Truck },
        { href: '/warehouses', label: 'Warehouses', icon: Building2 },
        { href: '/bins', label: 'Bins', icon: Package },
      ]
    },
    {
      key: 'operations', label: 'Operations', items: [
        { href: '/purchase-orders', label: 'Purchase Orders', icon: FileText },
        { href: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
        { href: '/returns', label: 'Returns', icon: RotateCcw },
      ]
    },
    {
      key: 'controls', label: 'Controls', items: [
        { href: '/cycle-counts', label: 'Cycle Counts', icon: RefreshCcw },
        { href: '/adjustments', label: 'Adjustments', icon: Wrench },
      ]
    },
    {
      key: 'planning', label: 'Planning', items: [
        { href: '/replenishment', label: 'Replenishment', icon: TrendingUp },
      ]
    },
    {
      key: 'tools', label: 'Tools', items: [
        { href: '/scanning', label: 'Scanning', icon: QrCode },
        { href: '/labels', label: 'Labels', icon: Badge },
        { href: '/imports', label: 'Imports', icon: Upload },
      ]
    },
    {
      key: 'settings', label: 'Settings', items: [
        { href: '/integrations', label: 'Integrations', icon: Webhook },
      ]
    },
  ]

  // Core group is always visible, never collapsible
  const coreGroup = {
    key: 'core',
    label: 'Core',
    items: [
      { href: '/', label: 'Dashboard', icon: Home },
      { href: '/items', label: 'Items', icon: PackageCheck },
      { href: '/inventory', label: 'Inventory', icon: Boxes },
      { href: '/sales', label: 'Sales', icon: LineChart },
    ],
  }

  const otherGroups = groupsDef

  const allGroupsCollapsed = otherGroups.every(g => Boolean(groups[g.key]))

  const toggleAllGroups = () => {
    const collapse = !allGroupsCollapsed
    const next: Record<string, boolean> = {}
    for (const g of otherGroups) {
      next[g.key] = collapse
    }
    setGroups(next)
    try { localStorage.setItem('sidebar-groups', JSON.stringify(next)) } catch { }
  }

  // Mobile: simplified expanded view
  if (mobile) {
    return (
      <aside className={cn('flex h-screen shrink-0 flex-col border-r w-64')}>
        <div className={cn('h-14 flex items-center text-lg font-semibold px-4')}>Inventory</div>
        <Separator />
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <nav className="p-2 space-y-2">
              <div>
                <div className="px-2 py-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">{coreGroup.label}</div>
                <div className="mt-1 space-y-1">
                  {coreGroup.items.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted data-[current]:bg-muted">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              {otherGroups.map((g) => (
                <div key={g.key}>
                  <div className="px-2 py-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">{g.label}</div>
                  <div className="mt-1 space-y-1">
                    {g.items.map(({ href, label, icon: Icon }) => (
                      <Link key={href} href={href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted data-[current]:bg-muted">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>
        <SidebarFooter className="border-t px-3 py-2 text-[11px] text-muted-foreground">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted hover:text-foreground">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Help &amp; support</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="min-w-[12rem]">
              <DropdownMenuLabel className="text-xs">Help &amp; support</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-xs">
                <Link href="/support/help-center" className="flex items-center gap-2">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Docs / Help center</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs">
                <Link href="/support/feedback" className="flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Send feedback</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs">
                <Link href="/support/contact" className="flex items-center gap-2">
                  <LifeBuoy className="h-3.5 w-3.5" />
                  <span>Contact support</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </aside>
    )
  }

  // Desktop: collapsed/expanded behavior with tooltips
  const isCollapsed = collapsed
  return (
    <aside
      className={cn(
        'hidden md:flex h-screen sticky top-0',
        'shrink-0 flex-col border-r transition-[width] duration-200',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className={cn('h-14 flex items-center text-lg font-semibold', isCollapsed ? 'justify-center px-0' : 'px-4')}>
        {isCollapsed ? 'Inv' : 'Inventory'}
      </div>
      <Separator />
      {!isCollapsed ? (
        <div className="px-2 pt-2 pb-1 flex justify-end">
          <button
            type="button"
            onClick={toggleAllGroups}
            className="text-[11px] rounded px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {allGroupsCollapsed ? 'Expand all' : 'Collapse all'}
          </button>
        </div>
      ) : null}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <nav className="p-2 space-y-2">
            {/* Core: always visible, never collapsible */}
            <div>
              {!isCollapsed ? (
                <div className="px-2 py-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">{coreGroup.label}</div>
              ) : null}
              <div className="mt-1 space-y-1">
                {coreGroup.items.map(({ href, label, icon: Icon }) => (
                  isCollapsed ? (
                    <Tooltip key={href}>
                      <TooltipTrigger asChild>
                        <Link
                          href={href}
                          className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted data-[current]:bg-muted justify-center')}
                        >
                          <Icon className="h-4 w-4" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link
                      key={href}
                      href={href}
                      className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted data-[current]:bg-muted justify-start')}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {otherGroups.map((g) => {
              const isCollapsedGroup = isCollapsed ? false : Boolean(groups[g.key])
              return (
                <div key={g.key}>
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(g.key)}
                      className={cn('w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground justify-between')}
                    >
                      <span className='uppercase tracking-wide'>{g.label}</span>
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isCollapsedGroup ? '-rotate-90' : 'rotate-0')} />
                    </button>
                  ) : null}
                  <div className={cn('mt-1 space-y-1', isCollapsedGroup ? 'hidden' : 'block')}>
                    {g.items.map(({ href, label, icon: Icon }) => (
                      isCollapsed ? (
                        <Tooltip key={href}>
                          <TooltipTrigger asChild>
                            <Link
                              href={href}
                              className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted data-[current]:bg-muted justify-center')}
                            >
                              <Icon className="h-4 w-4" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Link
                          key={href}
                          href={href}
                          className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted data-[current]:bg-muted justify-start')}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
      <SidebarFooter className="border-t px-3 py-2 text-[11px] text-muted-foreground">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted hover:text-foreground w-full justify-between">
              <span>Help &amp; support</span>
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-[12rem]">
            <DropdownMenuLabel className="text-xs">Help &amp; support</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-xs">
              <Link href="/support/help-center" className="flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Docs / Help center</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-xs">
              <Link href="/support/feedback" className="flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Send feedback</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-xs">
              <Link href="/support/contact" className="flex items-center gap-2">
                <LifeBuoy className="h-3.5 w-3.5" />
                <span>Contact support</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </aside >
  )
}
