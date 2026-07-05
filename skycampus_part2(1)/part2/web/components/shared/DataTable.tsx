'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils/formatters'
export interface Column<T> { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode; sortable?: boolean; width?: string }
interface DataTableProps<T extends { id?: string }> {
  columns: Column<T>[]; data: T[]; loading?: boolean; emptyMessage?: string; perPage?: number; searchable?: boolean; searchPlaceholder?: string
}
export default function DataTable<T extends { id?: string }>({ columns, data, loading=false, emptyMessage='No records found.', perPage=25, searchable=false, searchPlaceholder='Search…' }: DataTableProps<T>) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string|null>(null)
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [search, setSearch] = useState('')
  const filtered = searchable ? data.filter(row => Object.values(row as any).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) : data
  const sorted = sortKey ? [...filtered].sort((a,b) => { const av=(a as any)[sortKey],bv=(b as any)[sortKey]; return av===bv?0:(av>bv?1:-1)*(sortDir==='asc'?1:-1) }) : filtered
  const totalPages = Math.ceil(sorted.length/perPage)
  const paged = sorted.slice((page-1)*perPage, page*perPage)
  function toggleSort(key: string) { if(sortKey===key) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortKey(key); setSortDir('asc') } }
  return (
    <div className="card overflow-hidden">
      {searchable && <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700"><input type="text" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder={searchPlaceholder} className="input-base max-w-sm"/></div>}
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead><tr>{columns.map(col=>(
            <th key={String(col.key)} style={col.width?{width:col.width}:undefined} onClick={()=>col.sortable&&toggleSort(String(col.key))} className={cn(col.sortable&&'cursor-pointer hover:text-slate-700 select-none')}>
              <span className="flex items-center gap-1">{col.label}{col.sortable&&sortKey===String(col.key)&&<span className="text-brand-blue">{sortDir==='asc'?'↑':'↓'}</span>}</span>
            </th>
          ))}</tr></thead>
          <tbody>
            {loading?(<tr><td colSpan={columns.length} className="text-center py-12 text-slate-400"><span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"/>Loading…</span></td></tr>)
            :paged.length===0?(<tr><td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">{emptyMessage}</td></tr>)
            :paged.map((row,i)=>(<tr key={(row as any).id??i}>{columns.map(col=>(<td key={String(col.key)}>{col.render?col.render(row):String((row as any)[col.key]??'')}</td>))}</tr>))}
          </tbody>
        </table>
      </div>
      {totalPages>1&&(<div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
        <span className="text-slate-400">{(page-1)*perPage+1}–{Math.min(page*perPage,sorted.length)} of {sorted.length}</span>
        <div className="flex items-center gap-1">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600">‹</button>
          {Array.from({length:Math.min(7,totalPages)},(_,i)=>{const p=i+1;return(<button key={p} onClick={()=>setPage(p)} className={cn('w-7 h-7 rounded text-xs font-medium',page===p?'bg-brand-blue text-white':'hover:bg-slate-100 text-slate-600')}>{p}</button>);})}
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600">›</button>
        </div>
      </div>)}
    </div>
  )
}
