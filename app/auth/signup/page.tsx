"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BorderBeam } from '@/components/ui/border-beam'

export default function Page() {
  return (
    <div className="min-h-dvh flex flex-col lg:flex-row">
      {/* Left pane: brand / marketing copy (same as login) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-10">
        <div className="space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Inventory Manager · Realtime stock, zero surprises</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              Create your workspace
            </h1>
            <p className="text-sm text-slate-300/90">
              Set up an account for your team and start tracking items, brands, and inventory movements in minutes.
            </p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 text-xs text-slate-300/90">
          <div>
            <div className="font-semibold text-slate-100">Team-ready</div>
            <p className="mt-1 text-slate-300/80">Invite teammates and assign roles as you grow.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Secure access</div>
            <p className="mt-1 text-slate-300/80">Password best practices and audit-friendly logs.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Fast onboarding</div>
            <p className="mt-1 text-slate-300/80">Import existing items and brands from CSV.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Scales with you</div>
            <p className="mt-1 text-slate-300/80">From a single store to multiple warehouses.</p>
          </div>
        </div>
        <div className="mt-8 text-[11px] text-slate-400 flex items-center gap-2">
          <span>Already onboarded your team?</span>
          <Link href="/auth/login" className="underline-offset-2 hover:underline">Sign in instead</Link>
        </div>
      </div>

      {/* Right pane: signup card with BorderBeam */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md relative">
          <div className="relative group rounded-lg">
            <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] opacity-80">
              <BorderBeam
                size={140}
                borderWidth={1.5}
                colorFrom="#22d3ee"
                colorTo="#a855f7"
                duration={7}
                initialOffset={20}
                className="rounded-[inherit]"
              />
            </div>
            <Card className="relative bg-background/80 backdrop-blur-sm border border-border/70 shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">Create account</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Set up your login details. You can add more team members from the dashboard later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                    <Input id="name" placeholder="Your name" autoComplete="name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Work email</label>
                    <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                    <Input id="password" type="password" autoComplete="new-password" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm" className="text-sm font-medium text-foreground">Confirm password</label>
                    <Input id="confirm" type="password" autoComplete="new-password" />
                  </div>
                  <Button type="submit" className="w-full">Sign up</Button>
                </form>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Already have an account?</span>
                  <Link href="/auth/login" className="font-medium underline-offset-2 hover:underline">
                    Sign in
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
