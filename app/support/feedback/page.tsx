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

type FeedbackFormValues = {
  subject: string
  category: string
  area: string
  details: string
}

export default function Page() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<FeedbackFormValues>({
    defaultValues: {
      subject: '',
      category: 'idea',
      area: '',
      details: '',
    },
  })

  const onSubmit = async (values: FeedbackFormValues) => {
    setSubmitting(true)
    try {
      // In a real app, send to your API here
      console.log('Feedback submitted', values)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Send feedback</h1>
      <p className="text-sm text-muted-foreground">
        Tell us what&apos;s working well, what&apos;s confusing, or what you&apos;d like to see next.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Feedback form</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Thanks for your feedback!</p>
              <p>We&apos;ve recorded your submission. We review feedback regularly to help guide improvements.</p>
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Short summary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Choose a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="idea">Idea / Feature request</SelectItem>
                            <SelectItem value="bug">Bug</SelectItem>
                            <SelectItem value="ui">UI / UX</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page or feature (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dashboard stats, Items table, Sales form" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Describe your feedback" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Submit feedback'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
