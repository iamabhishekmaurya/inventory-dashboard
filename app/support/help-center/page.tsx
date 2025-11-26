import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Page() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Help center</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Explore common topics to get the most out of Inventory Manager. These sections can later link to your
            documentation or knowledge base.
          </p>
        </div>
        <div className="w-full md:w-64">
          <Input placeholder="Search topics (UI only)" className="h-8 text-xs" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Getting started</CardTitle>
            <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-medium">Setup</span>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Basic concepts: items, brands, stock, and locations.</p>
            <p>How to import existing data.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Items &amp; brands</CardTitle>
            <span className="rounded-full bg-sky-500/10 text-sky-600 px-2 py-0.5 text-[10px] font-medium">Catalog</span>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Creating and editing items.</p>
            <p>Managing brands, types, and attributes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Inventory operations</CardTitle>
            <span className="rounded-full bg-amber-500/10 text-amber-600 px-2 py-0.5 text-[10px] font-medium">Operations</span>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Purchase orders, transfers, and returns.</p>
            <p>Cycle counts and adjustments.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Planning &amp; alerts</CardTitle>
            <span className="rounded-full bg-violet-500/10 text-violet-600 px-2 py-0.5 text-[10px] font-medium">Planning</span>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Replenishment and low-stock signals.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Admin &amp; settings</CardTitle>
            <span className="rounded-full bg-slate-500/10 text-slate-600 px-2 py-0.5 text-[10px] font-medium">Admin</span>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>User access, roles, and integrations.</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">
        Can&apos;t find what you&apos;re looking for?{' '}
        <Link href="/support/contact" className="underline-offset-2 hover:underline">
          Contact support
        </Link>
        .
      </p>
    </div>
  )
}
