'use client'
import { Search } from './Search'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Menu, Home, Layers3, ShoppingCart, Boxes, LineChart, PackageCheck } from 'lucide-react'

function MobileSidebar(){
  const links = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/types', label: 'Item Types', icon: Layers3 },
    { href: '/brands', label: 'Brands', icon: PackageCheck },
    { href: '/items', label: 'Items', icon: ShoppingCart },
    { href: '/inventory', label: 'Inventory', icon: Boxes },
    { href: '/sales', label: 'Sales', icon: LineChart },
  ]
  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-14 flex items-center px-2 text-lg font-semibold">Inventory</div>
      <Separator />
      <nav className="flex-1 p-2 space-y-1">
        {links.map(({href,label,icon:Icon})=> (
          <Link key={href} href={href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted data-[current]:bg-muted">
            <Icon className="h-4 w-4" /> <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function Topbar(){
  return (
    <header className="h-14 border-b flex items-center gap-2 px-3">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <MobileSidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block font-semibold">Inventory</div>
      <div className="flex-1"><Search /></div>
      <ThemeToggle />
      <UserMenu />
    </header>
  )
}

