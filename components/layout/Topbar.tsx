'use client'
import { Search } from './Search'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'
import QuietToggle from '@/components/layout/QuietToggle'

export function Topbar() {
  const toggleSidebar = () => {
    const evt = new Event('toggle-sidebar')
    window.dispatchEvent(evt)
  }
  return (
    <header className="h-14 border-b w-full flex items-center gap-2 px-3 border-b-0">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        {/* Mobile: opens drawer */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button data-slot="sidebar-trigger" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-7 -ml-1" data-sidebar="trigger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg>
                <span className="sr-only">Toggle Sidebar</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar mobile />
            </SheetContent>
          </Sheet>
        </div>
        {/* Desktop: toggles collapse */}
        <button onClick={toggleSidebar} className="hidden md:inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-7 -ml-1" aria-label="Toggle Sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg>
          <span className="sr-only">Toggle Sidebar</span>
        </button>
        {/* <div className="hidden md:block font-semibold">Inventory</div> */}
      </div>

      {/* Spacer that always grows to push right controls */}
      <div className="flex-1 px-2">
        <div className="hidden sm:block max-w-2xl">
          <Search />
        </div>
      </div>

      {/* Right controls pinned right */}
      <div className="ml-auto flex items-center gap-2">
        <QuietToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
