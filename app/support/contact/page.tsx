"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ContactFormValues = {
  name: string
  email: string
  topic: string
  message: string
  includeMeta: boolean
}

export default function Page() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      topic: 'general',
      message: '',
      includeMeta: true,
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true)
    try {
      // In a real app, send to your API or helpdesk here
      console.log('Support request submitted', values)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Contact support</h1>
      <p className="text-sm text-muted-foreground">
        Share a few details so we can help you faster. Include any relevant item IDs, order numbers, or screenshots.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Support request</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Request received</p>
              <p>
                We&apos;ve recorded your support request. If you included your email, someone from the team will follow up as
                soon as possible.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => router.push('/support')}>
                  Back to support
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    form.reset()
                    setSubmitted(false)
                  }}
                >
                  Send another
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue placeholder="Choose a topic" />
                          </SelectTrigger>
                          <SelectContent align="start">
                            <SelectItem value="general">General question</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="inventory-sync">Inventory sync</SelectItem>
                            <SelectItem value="integrations">Integrations</SelectItem>
                            <SelectItem value="bug">Bug / Incident</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={6} placeholder="Describe the issue or question" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeMeta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-normal text-muted-foreground">Additional details</FormLabel>
                      <FormControl>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground" htmlFor="includeMeta">
                          <input
                            id="includeMeta"
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border border-border bg-background text-primary focus-visible:outline-none"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          <span>Include basic system details (app version, browser, etc.)</span>
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between gap-2 pt-2 text-[11px] text-muted-foreground">
                  <span>Typical response time: within 1 business day.</span>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send message'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
