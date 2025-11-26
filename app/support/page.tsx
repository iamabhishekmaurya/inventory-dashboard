import Link from 'next/link'
import { LifeBuoy, MessageCircle, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Help &amp; support · Inventory Manager</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold">How can we help you?</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Browse help topics, share feedback, or contact support if something isn&apos;t working as expected.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>System status: All good</span>
          </span>
        </div>
      </div>

      {/* Primary actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold">Help center</CardTitle>
            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <HelpCircle className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Explore how to set up items, manage inventory, and run operations with confidence.</p>
            <Button asChild variant="outline" size="sm" className="mt-1">
              <Link href="/support/help-center">Open help center</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold">Send feedback</CardTitle>
            <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <MessageCircle className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Share ideas, report issues, or request improvements to shape the future of Inventory Manager.</p>
            <Button asChild variant="outline" size="sm" className="mt-1">
              <Link href="/support/feedback">Give feedback</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold">Contact support</CardTitle>
            <div className="h-7 w-7 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <LifeBuoy className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Reach out with specific questions, incidents, or billing issues and we&apos;ll get back to you.</p>
            <Button asChild variant="outline" size="sm" className="mt-1">
              <Link href="/support/contact">Contact support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
