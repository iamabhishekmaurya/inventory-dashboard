'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fragment } from 'react'

export function Breadcrumbs(){
  const pathname = usePathname()
  const segments = (pathname || '/').split('/').filter(Boolean)
  const items = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/')
    const label = decodeURIComponent(seg.replace(/-/g, ' '))
    const isLast = idx === segments.length - 1
    return (
      <Fragment key={href}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={href} className="capitalize">
                {label}
              </Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast ? <BreadcrumbSeparator /> : null}
      </Fragment>
    )
  })
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length ? <BreadcrumbSeparator /> : null}
        {items}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
