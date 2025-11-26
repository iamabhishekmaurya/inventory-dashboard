'use client'
import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

export type ItemRow = { id: number; itemName: string; itemBrandId: number; brandName?: string; status: boolean }

export function useItemColumns(): ColumnDef<ItemRow, any>[] {
  return useMemo<ColumnDef<ItemRow, any>[]>(() => [
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    { accessorKey: 'itemName', header: 'Name', enableSorting: true },
    { accessorKey: 'brandName', header: 'Brand', cell: ({ row }) => row.original.brandName ?? row.original.itemBrandId },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => (getValue() ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>) },
  ], [])
}
