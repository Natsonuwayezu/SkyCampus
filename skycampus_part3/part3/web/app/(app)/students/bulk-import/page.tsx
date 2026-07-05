'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'

interface ImportRow {
  row: number
  last_name: string
  first_name: string
  date_of_birth?: string
  gender?: string
  class_name: string
  parent_name?: string
  parent_phone?: string
  status: 'valid' | 'error'
  errors: string[]
}

export default function BulkImportPage() {
  const { user }  = useAuthStore()
  const router    = useRouter()
  const supabase  = createClient()

  const [rows, setRows]       = useState<ImportRow[]>([])
  const [classes, setClasses] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [step, setStep]       = useState<1|2|3>(1)

  async function downloadTemplate() {
    const { utils, writeFile } = await import('xlsx')
    const headers = [
      'last_name','first_name','date_of_birth','gender',
      'class_name','district','village','parent_name','parent_phone',
      'parent_relation','email','blood_group','nationality'
    ]
    const sample = [
      'GANZA','KING','2015-03-12','male',
      'PRIMARY 4','Rubavu','Gisenyi','GANZA Emmanuel','+250788123456',
      'father','','A+','Rwandan'
    ]
    const wb = utils.book_new()
    const ws = utils.aoa_to_sheet([headers, sample])
    utils.book_append_sheet(wb, ws, 'Students')
    writeFile(wb, 'skycampus_student_import_template.xlsx')
    toast.success('Template downloaded!')
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Load classes map
    const { data: cls } = await supabase
      .from('classes').select('id,name')
      .eq('school_id', user!.school_id)
    const clsMap: Record<string, string> = {}
    cls?.forEach((c: any) => { clsMap[c.name.toUpperCase().trim()] = c.id })
    setClasses(clsMap)

    const { read, utils } = await import('xlsx')
    const buf  = await file.arrayBuffer()
    const wb   = read(buf)
    const ws   = wb.Sheets[wb.SheetNames[0]]
    const data = utils.sheet_to_json<any>(ws)

    const parsed: ImportRow[] = data.map((r: any, i: number) => {
      const errors: string[] = []
      if (!r.last_name)  errors.push('last_name required')
      if (!r.first_name) errors.push('first_name required')
      if (!r.class_name) errors.push('class_name required')
      else if (!clsMap[(r.class_name ?? '').toUpperCase().trim()]) errors.push(`Class "${r.class_name}" not found`)
      return {
        row:          i + 2,
        last_name:    r.last_name  ?? '',
        first_name:   r.first_name ?? '',
        date_of_birth:r.date_of_birth ?? '',
        gender:       r.gender ?? 'male',
        class_name:   r.class_name ?? '',
        parent_name:  r.parent_name ?? '',
        parent_phone: r.parent_phone ?? '',
        status:       errors.length === 0 ? 'valid' : 'error',
        errors,
      }
    })
    setRows(parsed)
    setStep(2)
  }

  async function runImport() {
    const valid = rows.filter(r => r.status === 'valid')
    if (!valid.length) { toast.error('No valid rows to import'); return }

    setImporting(true)
    let success = 0, failed = 0

    // Get current academic year
    const { data: yr } = await supabase
      .from('academic_years').select('id').eq('school_id', user!.school_id).eq('is_current', true).single()
    const yearId = yr?.id

    for (const row of valid) {
      try {
        const { data: admData } = await supabase.rpc('generate_admission_number', { p_school_id: user!.school_id })
        const { data: stu, error } = await supabase.from('students').insert({
          school_id:        user!.school_id,
          admission_number: admData,
          first_name:       row.first_name,
          last_name:        row.last_name,
          date_of_birth:    row.date_of_birth || null,
          gender:           row.gender,
          status:           'active',
        }).select('id').single()

        if (error || !stu) { failed++; continue }

        const classId = classes[(row.class_name ?? '').toUpperCase().trim()]
        if (classId && yearId) {
          await supabase.from('student_class_history').insert({
            school_id: user!.school_id, student_id: stu.id,
            class_id: classId, academic_year_id: yearId, is_current: true,
          })
        }

        if (row.parent_name) {
          const nameParts = row.parent_name.split(' ')
          const { data: par } = await supabase.from('parents').insert({
            school_id:  user!.school_id,
            last_name:  nameParts[0] ?? row.parent_name,
            first_name: nameParts.slice(1).join(' ') || nameParts[0],
            phone:      row.parent_phone || null,
          }).select('id').single()
          if (par) {
            await supabase.from('student_parents').insert({
              school_id: user!.school_id, student_id: stu.id,
              parent_id: par.id, is_primary: true,
            })
          }
        }
        success++
      } catch { failed++ }
    }

    setImporting(false)
    setStep(3)
    if (success) toast.success(`${success} students imported!`)
    if (failed)  toast.error(`${failed} rows failed`)
  }

  const validCount   = rows.filter(r => r.status === 'valid').length
  const invalidCount = rows.filter(r => r.status === 'error').length

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Bulk Import Students" icon="📤" />

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: 'Download Template' },
          { n: 2, label: 'Preview & Validate' },
          { n: 3, label: 'Import Complete' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.n ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span className={`text-sm ${step === s.n ? 'font-semibold text-slate-700 dark:text-white' : 'text-slate-400'}`}>{s.label}</span>
            {i < 2 && <div className="w-8 h-px bg-slate-200 dark:bg-slate-600"/>}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-display font-bold text-slate-700 dark:text-white mb-2">Step 1: Download & Fill Template</h3>
            <p className="text-sm text-slate-500 mb-4">Download the Excel template, fill in student data, then upload it below.</p>
            <button onClick={downloadTemplate} className="btn-secondary text-sm">📥 Download Excel Template</button>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-bold text-slate-700 dark:text-white mb-2">Step 2: Upload Filled Template</h3>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 transition">
              <span className="text-3xl mb-2">📂</span>
              <span className="text-sm text-slate-500">Drag & drop or click to browse</span>
              <span className="text-xs text-slate-400">.xlsx or .csv files only</span>
              <input type="file" accept=".xlsx,.csv" className="hidden" onChange={handleFile}/>
            </label>
          </div>
        </div>
      )}

      {/* Step 2 — Preview */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
            <span className="badge-green">{validCount} valid</span>
            <span className="badge-red">{invalidCount} errors</span>
            <span className="text-sm text-slate-500">{rows.length} total rows</span>
            <div className="ml-auto flex gap-2">
              <button onClick={() => { setRows([]); setStep(1) }} className="btn-secondary text-sm">← Re-upload</button>
              <button onClick={runImport} disabled={importing || validCount === 0} className="btn-primary text-sm">
                {importing ? '⏳ Importing…' : `✅ Import ${validCount} Valid Rows`}
              </button>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Row</th><th>Last Name</th><th>First Name</th>
                    <th>Class</th><th>Parent</th><th>Phone</th>
                    <th>Status</th><th>Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.row} className={r.status === 'error' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                      <td className="text-slate-400 text-xs">{r.row}</td>
                      <td className="font-medium">{r.last_name || <span className="text-red-400">—</span>}</td>
                      <td>{r.first_name || <span className="text-red-400">—</span>}</td>
                      <td>{r.class_name}</td>
                      <td className="text-sm text-slate-500">{r.parent_name || '—'}</td>
                      <td className="text-sm text-slate-500">{r.parent_phone || '—'}</td>
                      <td>
                        <span className={r.status === 'valid' ? 'badge-green' : 'badge-red'}>
                          {r.status === 'valid' ? '✅ Valid' : '❌ Error'}
                        </span>
                      </td>
                      <td className="text-xs text-red-500">{r.errors.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Done */}
      {step === 3 && (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-2">Import Complete!</h2>
          <p className="text-slate-500 mb-6">{validCount} students were successfully imported.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/students')} className="btn-primary">View Student List</button>
            <button onClick={() => { setRows([]); setStep(1) }} className="btn-secondary">Import More</button>
          </div>
        </div>
      )}
    </div>
  )
}
