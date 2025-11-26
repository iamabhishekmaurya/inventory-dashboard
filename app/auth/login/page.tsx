"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BorderBeam } from '@/components/ui/border-beam'

export default function Page() {
  return (
    <div className="min-h-dvh flex flex-col lg:flex-row">
      {/* Left pane: brand / marketing copy */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-10">
        <div className="space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Inventory Manager · Realtime stock, zero surprises</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              Sign in to your dashboard
            </h1>
            <p className="text-sm text-slate-300/90">
              Track items, inventory, and sales in one place. Secure access for your team with a modern, focused workspace.
            </p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 text-xs text-slate-300/90">
          <div>
            <div className="font-semibold text-slate-100">Realtime stock</div>
            <p className="mt-1 text-slate-300/80">See current availability across warehouses and bins.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Fast operations</div>
            <p className="mt-1 text-slate-300/80">Purchase orders, transfers, and returns in a few clicks.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Audit-ready</div>
            <p className="mt-1 text-slate-300/80">Cycle counts and adjustments with full traceability.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Simple onboarding</div>
            <p className="mt-1 text-slate-300/80">Import items and brands from your existing tools.</p>
          </div>
        </div>
        <div className="mt-8 text-[11px] text-slate-400 flex items-center gap-2">
          <span>Need help?</span>
          <Link href="/support" className="underline-offset-2 hover:underline">Contact support</Link>
        </div>
      </div>

      {/* Right pane: login card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md relative">
          <div className="relative group rounded-lg">
            <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] opacity-80">
              <BorderBeam
                size={140}
                borderWidth={1.5}
                colorFrom="hsl(var(--primary))"
                colorTo="#22d3ee"
                duration={7}
                initialOffset={12}
                className="rounded-[inherit]"
              />
            </div>
            <Card className="relative bg-background/80 backdrop-blur-sm border border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Sign in to continue managing your inventory. Use the credentials provided by your admin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                    <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input id="password" type="password" autoComplete="current-password" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground" htmlFor="remember">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border border-border bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2"
                      />
                      <span>Remember this device</span>
                    </label>
                    <span className="text-[11px] text-muted-foreground">2–3 seconds to sign you in</span>
                  </div>
                  <Button type="submit" className="w-full">Sign in</Button>
                </form>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Don&apos;t have an account?</span>
                  <Link href="/auth/signup" className="font-medium underline-offset-2 hover:underline">
                    Create one
                  </Link>
                </div>

                <div className="border-t pt-3 mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Having trouble signing in?</span>
                  <Link href="/auth/login" className="underline-offset-2 hover:underline">
                    Use backup code
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
