'use client'
import * as React from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, ColumnDef, VisibilityState } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onExportCsv?: () => void
}

export function DataTable<TData, TValue>({ columns, data, onExportCsv }: DataTableProps<TData, TValue>) {
  const STORAGE_KEY = React.useMemo(()=> `datatable:view:${(columns || []).map((c:any)=> c.id || c.accessorKey || '').join('|')}`, [columns])
  const [sorting, setSorting] = React.useState<any>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnPinning, setColumnPinning] = React.useState<any>({ left: [], right: [] })
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const [groupBy, setGroupBy] = React.useState<string>('')

  // Load saved view
  React.useEffect(()=>{
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.sorting) setSorting(parsed.sorting)
        if (typeof parsed.globalFilter === 'string') setGlobalFilter(parsed.globalFilter)
        if (parsed.columnVisibility) setColumnVisibility(parsed.columnVisibility)
        if (parsed.columnPinning) setColumnPinning(parsed.columnPinning)
        if (parsed.columnOrder) setColumnOrder(parsed.columnOrder)
        if (typeof parsed.groupBy === 'string') setGroupBy(parsed.groupBy)
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY])

  // Persist view (debounced)
  React.useEffect(()=>{
    const id = setTimeout(()=>{
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ sorting, globalFilter, columnVisibility, columnPinning, columnOrder, groupBy }))
      } catch {}
    }, 250)
    return ()=> clearTimeout(id)
  }, [STORAGE_KEY, sorting, globalFilter, columnVisibility, columnPinning, columnOrder, groupBy])

  const resetView = () => {
    setSorting([])
    setGlobalFilter('')
    setColumnVisibility({})
    setColumnPinning({ left: [], right: [] })
    setColumnOrder([])
    setGroupBy('')
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, columnPinning, columnOrder },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Initialize columnOrder if empty
  React.useEffect(() => {
    if (!columnOrder?.length) {
      const ids = table.getAllLeafColumns().map(c => c.id)
      setColumnOrder(ids)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getAllLeafColumns().length])

  const moveColumn = (id:string, dir: 'up'|'down') => {
    const ids = [...columnOrder]
    const idx = ids.indexOf(id)
    if (idx === -1) return
    const swapWith = dir === 'up' ? idx - 1 : idx + 1
    if (swapWith < 0 || swapWith >= ids.length) return
    ;[ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]]
    setColumnOrder(ids)
  }

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs"
          />
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table.getAllLeafColumns().map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(Boolean(v))}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Group By</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={()=> setGroupBy('')}>None</DropdownMenuItem>
                <DropdownMenuSeparator />
                {table.getAllLeafColumns().map((col)=> (
                  <DropdownMenuItem key={`gb-${col.id}`} onClick={()=> setGroupBy(col.id)} className="capitalize">{col.id}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Arrange</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table.getAllLeafColumns().map((col) => (
                  <div key={`arr-${col.id}`} className="px-2 py-1.5">
                    <div className="text-xs mb-1 capitalize text-muted-foreground">{col.id}</div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={()=> moveColumn(col.id, 'up')}>Up</Button>
                      <Button variant="outline" size="sm" onClick={()=> moveColumn(col.id, 'down')}>Down</Button>
                      <DropdownMenuSeparator />
                      <Button variant="outline" size="sm" onClick={()=> col.pin('left')}>Pin L</Button>
                      <Button variant="outline" size="sm" onClick={()=> col.pin('right')}>Pin R</Button>
                      <Button variant="outline" size="sm" onClick={()=> col.pin(false)}>Unpin</Button>
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={()=> {/* save happens automatically */}}>Save View</Button>
            <Button variant="outline" size="sm" onClick={resetView}>Reset View</Button>
            {onExportCsv ? <Button variant="outline" size="sm" onClick={onExportCsv}>Export CSV</Button> : null}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b">
                  {hg.headers.map((header) => (
                    <th key={header.id} className="text-left py-2 select-none">
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{ asc: ' \u2191', desc: ' \u2193' }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
              {/* Filters Row */}
              <tr>
                {table.getFlatHeaders().map((header) => (
                  <th key={header.id} className="py-1">
                    {header.column.getCanFilter() ? (
                      <Input
                        className="h-8"
                        placeholder={`Filter`}
                        value={(header.column.getFilterValue() as string) ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                      />
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupBy ? (
                (()=>{
                  const groups: Record<string, any[]> = {}
                  table.getRowModel().rows.forEach((row)=>{
                    const key = String((row as any).getValue(groupBy) ?? '—')
                    groups[key] = groups[key] || []
                    groups[key].push(row)
                  })
                  const entries = Object.entries(groups)
                  return entries.flatMap(([key, rows], idx)=> (
                    [
                      <tr key={`g-${idx}`} className="bg-muted/40">
                        <td className="py-1 px-2 font-medium" colSpan={columns.length}>{groupBy}: {key} — {rows.length} row(s)</td>
                      </tr>,
                      ...rows.map((row:any)=> (
                        <tr key={row.id} className="border-b last:border-0">
                          {row.getVisibleCells().map((cell:any) => (
                            <td key={cell.id} className="py-2">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    ]
                  ))
                })()
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td className="py-8 text-center text-muted-foreground" colSpan={columns.length}>No results</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
          <div className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </div>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}
