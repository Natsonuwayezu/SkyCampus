'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'

type Tab = 'personal' | 'parent' | 'academic' | 'medical' | 'documents'
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'personal',  label: 'Personal Info',     icon: '👤' },
  { key: 'parent',    label: 'Parent/Guardian',   icon: '👨‍👩‍👧' },
  { key: 'academic',  label: 'Academic',          icon: '📚' },
  { key: 'medical',   label: 'Medical',           icon: '🏥' },
  { key: 'documents', label: 'Documents',         icon: '📄' },
]

interface ClassOption { id: string; name: string; level: string }
interface ParentOption { id: string; first_name: string; last_name: string; phone: string }

export default function EnrollStudentPage() {
  const { user } = useAuthStore()
  const router   = useRouter()
  const supabase = createClient()

  const [tab, setTab]       = useState<Tab>('personal')
  const [saving, setSaving] = useState(false)
  const [classes, setClasses]   = useState<ClassOption[]>([])
  const [parents, setParents]   = useState<ParentOption[]>([])
  const [yearId, setYearId]     = useState<string>('')
  const [photoFile, setPhoto]   = useState<File | null>(null)
  const [photoPreview, setPreview] = useState<string | null>(null)
  const [existingParentId, setExistingParent] = useState<string>('')

  const [personal, setPersonal] = useState({
    first_name: '', last_name: '', date_of_birth: '', gender: 'male',
    nationality: 'Rwandan', national_id: '', blood_group: '', religion: '',
    home_address: '', district: '', village: '', previous_school: '',
  })
  const [parentForm, setParent] = useState({
    father_name: '', father_phone: '', mother_name: '', mother_phone: '',
    guardian_name: '', guardian_relation: '', guardian_phone: '', email: '',
    emergency_contact: '', emergency_phone: '',
  })
  const [academic, setAcademic] = useState({
    class_id: '', stream: '', status: 'active',
  })
  const [medical, setMedical] = useState({
    allergies: '', conditions: '', doctor_name: '', doctor_phone: '',
  })

  useEffect(() => { loadClasses(); loadParents(); loadCurrentYear() }, [])

  async function loadCurrentYear() {
    const { data } = await supabase.from('academic_years').select('id').eq('school_id', user!.school_id).eq('is_current', true).single()
    if (data) setYearId(data.id)
  }
  async function loadClasses() {
    const { data } = await supabase.from('classes').select('id,name,level').eq('school_id', user!.school_id).order('display_order')
    setClasses(data ?? [])
  }
  async function loadParents() {
    const { data } = await supabase.from('parents').select('id,first_name,last_name,phone').eq('school_id', user!.school_id).order('last_name')
    setParents(data ?? [])
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const TAB_ORDER: Tab[] = ['personal','parent','academic','medical','documents']
  const tabIndex = TAB_ORDER.indexOf(tab)
  const isFirst  = tabIndex === 0
  const isLast   = tabIndex === TAB_ORDER.length - 1

  function next() { if (!isLast) setTab(TAB_ORDER[tabIndex + 1]) }
  function prev() { if (!isFirst) setTab(TAB_ORDER[tabIndex - 1]) }

  async function enroll() {
    if (!academic.class_id) { toast.error('Please select a class'); return }
    if (!personal.first_name || !personal.last_name) { toast.error('First and last name required'); return }
    setSaving(true)

    try {
      // 1. Generate admission number
      const { data: admData } = await supabase.rpc('generate_admission_number', { p_school_id: user!.school_id })
      const admNum = admData as string

      // 2. Upload photo if provided
      let photoUrl: string | null = null
      if (photoFile) {
        const path = `${user!.school_id}/students/${admNum}/photo.${photoFile.name.split('.').pop()}`
        const { error: uploadErr } = await supabase.storage.from('student-photos').upload(path, photoFile, { upsert: true })
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('student-photos').getPublicUrl(path)
          photoUrl = urlData.publicUrl
        }
      }

      // 3. Create student record
      const { data: student, error: stuErr } = await supabase
        .from('students')
        .insert({
          school_id: user!.school_id,
          admission_number: admNum,
          ...personal,
          photo_url: photoUrl,
          status: academic.status,
        })
        .select('id').single()
      if (stuErr || !student) throw stuErr ?? new Error('Failed to create student')

      // 4. Assign to class
      await supabase.from('student_class_history').insert({
        school_id:        user!.school_id,
        student_id:       student.id,
        class_id:         academic.class_id,
        academic_year_id: yearId,
        is_current:       true,
      })

      // 5. Parent linking
      if (existingParentId) {
        await supabase.from('student_parents').insert({ school_id: user!.school_id, student_id: student.id, parent_id: existingParentId, is_primary: true })
      } else if (parentForm.father_name || parentForm.mother_name || parentForm.guardian_name) {
        const primaryName   = (parentForm.father_name || parentForm.mother_name || parentForm.guardian_name).split(' ')
        const primaryPhone  = parentForm.father_phone || parentForm.mother_phone || parentForm.guardian_phone
        const { data: parentData } = await supabase
          .from('parents')
          .insert({
            school_id:  user!.school_id,
            first_name: primaryName.slice(1).join(' ') || primaryName[0],
            last_name:  primaryName[0],
            phone:      primaryPhone,
            email:      parentForm.email || null,
            relation:   parentForm.guardian_name ? 'guardian' : parentForm.father_name ? 'father' : 'mother',
          })
          .select('id').single()
        if (parentData) {
          await supabase.from('student_parents').insert({ school_id: user!.school_id, student_id: student.id, parent_id: parentData.id, is_primary: true })
        }
      }

      // 6. Medical record
      if (medical.allergies || medical.conditions || medical.doctor_name) {
        await supabase.from('student_medical').insert({ school_id: user!.school_id, student_id: student.id, ...medical })
      }

      // 7. Apply existing fee categories to student
      const { data: fees } = await supabase.from('fee_categories').select('id,amount,reset_cycle,due_date').eq('school_id', user!.school_id).eq('is_active', true)
      if (fees?.length) {
        await supabase.from('student_fees').insert(fees.map(f => ({
          school_id:       user!.school_id,
          student_id:      student.id,
          fee_category_id: f.id,
          academic_year_id: yearId,
          amount:          f.amount,
          status:          'pending',
          due_date:        f.due_date,
        })))
      }

      // 8. Notification
      await supabase.from('notifications').insert({
        school_id: user!.school_id,
        user_id:   user!.id,
        type:      'student',
        title:     `New student enrolled: ${personal.last_name} ${personal.first_name}`,
        body:      `Admission number: ${admNum}`,
      })

      toast.success(`Student enrolled! Admission No: ${admNum}`)
      router.push(`/students/${student.id}`)
    } catch (err: any) {
      toast.error(err.message ?? 'Enrollment failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Enroll New Student" icon="➕" />

      {/* Tab stepper */}
      <div className="flex items-center">
        {TABS.map((t, i) => (
          <div key={t.key} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.key ? 'bg-brand-blue text-white' :
                TAB_ORDER.indexOf(t.key) < tabIndex ? 'text-green-600 dark:text-green-400' :
                'text-slate-400'
              }`}
            >
              <span>{TAB_ORDER.indexOf(t.key) < tabIndex ? '✅' : t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
            {i < TABS.length - 1 && <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-2"/>}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div className="card p-6">
        {/* ── PERSONAL INFO ── */}
        {tab === 'personal' && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-slate-700 dark:text-white mb-4">Personal Information</h2>

            {/* Photo upload */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
                {photoPreview
                  ? <img src={photoPreview} alt="" className="w-full h-full object-cover"/>
                  : <span className="text-3xl">📷</span>
                }
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" id="photo-upload"/>
                <label htmlFor="photo-upload" className="btn-secondary text-sm cursor-pointer">Upload Photo</label>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-xs">Last Name *</label>
                <input className="input-base" value={personal.last_name} onChange={e => setPersonal(p => ({...p, last_name: e.target.value}))} />
              </div>
              <div><label className="label-xs">First Name *</label>
                <input className="input-base" value={personal.first_name} onChange={e => setPersonal(p => ({...p, first_name: e.target.value}))} />
              </div>
              <div><label className="label-xs">Date of Birth</label>
                <input type="date" className="input-base" value={personal.date_of_birth} onChange={e => setPersonal(p => ({...p, date_of_birth: e.target.value}))} />
              </div>
              <div><label className="label-xs">Gender</label>
                <select className="input-base" value={personal.gender} onChange={e => setPersonal(p => ({...p, gender: e.target.value}))}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div><label className="label-xs">Nationality</label>
                <input className="input-base" value={personal.nationality} onChange={e => setPersonal(p => ({...p, nationality: e.target.value}))} />
              </div>
              <div><label className="label-xs">NID / Birth Certificate</label>
                <input className="input-base" value={personal.national_id} onChange={e => setPersonal(p => ({...p, national_id: e.target.value}))} />
              </div>
              <div><label className="label-xs">Blood Group</label>
                <select className="input-base" value={personal.blood_group} onChange={e => setPersonal(p => ({...p, blood_group: e.target.value}))}>
                  <option value="">— Unknown —</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div><label className="label-xs">Religion</label>
                <input className="input-base" value={personal.religion} onChange={e => setPersonal(p => ({...p, religion: e.target.value}))} />
              </div>
            </div>
            <div><label className="label-xs">Home Address</label>
              <input className="input-base" value={personal.home_address} onChange={e => setPersonal(p => ({...p, home_address: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-xs">District</label>
                <input className="input-base" placeholder="Rubavu" value={personal.district} onChange={e => setPersonal(p => ({...p, district: e.target.value}))} />
              </div>
              <div><label className="label-xs">Village / Sector</label>
                <input className="input-base" value={personal.village} onChange={e => setPersonal(p => ({...p, village: e.target.value}))} />
              </div>
            </div>
            <div><label className="label-xs">Previous School (if transferring)</label>
              <input className="input-base" value={personal.previous_school} onChange={e => setPersonal(p => ({...p, previous_school: e.target.value}))} />
            </div>
          </div>
        )}

        {/* ── PARENT / GUARDIAN ── */}
        {tab === 'parent' && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-slate-700 dark:text-white mb-1">Parent / Guardian</h2>

            {/* Link existing */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <label className="label-xs text-brand-blue">Link to Existing Parent (Optional)</label>
              <select className="input-base mt-1" value={existingParentId} onChange={e => setExistingParent(e.target.value)}>
                <option value="">— Enter new parent info below —</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.last_name} {p.first_name} ({p.phone})</option>)}
              </select>
              <p className="text-xs text-slate-400 mt-1">If this student has a sibling already enrolled, link to their parent to share the fee account.</p>
            </div>

            {!existingParentId && <>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-xs">Father's Full Name</label>
                  <input className="input-base" value={parentForm.father_name} onChange={e => setParent(p => ({...p, father_name: e.target.value}))} />
                </div>
                <div><label className="label-xs">Father's Phone</label>
                  <input className="input-base" placeholder="+250788…" value={parentForm.father_phone} onChange={e => setParent(p => ({...p, father_phone: e.target.value}))} />
                </div>
                <div><label className="label-xs">Mother's Full Name</label>
                  <input className="input-base" value={parentForm.mother_name} onChange={e => setParent(p => ({...p, mother_name: e.target.value}))} />
                </div>
                <div><label className="label-xs">Mother's Phone</label>
                  <input className="input-base" placeholder="+250788…" value={parentForm.mother_phone} onChange={e => setParent(p => ({...p, mother_phone: e.target.value}))} />
                </div>
                <div><label className="label-xs">Guardian Name (if different)</label>
                  <input className="input-base" value={parentForm.guardian_name} onChange={e => setParent(p => ({...p, guardian_name: e.target.value}))} />
                </div>
                <div><label className="label-xs">Guardian Relation</label>
                  <input className="input-base" placeholder="Uncle, Aunt…" value={parentForm.guardian_relation} onChange={e => setParent(p => ({...p, guardian_relation: e.target.value}))} />
                </div>
                <div><label className="label-xs">Guardian Phone</label>
                  <input className="input-base" value={parentForm.guardian_phone} onChange={e => setParent(p => ({...p, guardian_phone: e.target.value}))} />
                </div>
                <div><label className="label-xs">Email</label>
                  <input type="email" className="input-base" value={parentForm.email} onChange={e => setParent(p => ({...p, email: e.target.value}))} />
                </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-700"/>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-xs">Emergency Contact Name</label>
                  <input className="input-base" value={parentForm.emergency_contact} onChange={e => setParent(p => ({...p, emergency_contact: e.target.value}))} />
                </div>
                <div><label className="label-xs">Emergency Phone</label>
                  <input className="input-base" value={parentForm.emergency_phone} onChange={e => setParent(p => ({...p, emergency_phone: e.target.value}))} />
                </div>
              </div>
            </>}
          </div>
        )}

        {/* ── ACADEMIC ── */}
        {tab === 'academic' && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-slate-700 dark:text-white mb-4">Academic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-xs">Class *</label>
                <select className="input-base" value={academic.class_id} onChange={e => setAcademic(a => ({...a, class_id: e.target.value}))}>
                  <option value="">— Select Class —</option>
                  <optgroup label="🎒 Nursery">
                    {classes.filter(c => c.level === 'nursery').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                  <optgroup label="📚 Primary">
                    {classes.filter(c => c.level === 'primary').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                </select>
              </div>
              <div><label className="label-xs">Stream (A / B)</label>
                <input className="input-base" placeholder="A" value={academic.stream} onChange={e => setAcademic(a => ({...a, stream: e.target.value}))} />
              </div>
              <div><label className="label-xs">Student Status</label>
                <select className="input-base" value={academic.status} onChange={e => setAcademic(a => ({...a, status: e.target.value}))}>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-sm text-slate-500">
              <p>📋 Admission number will be auto-generated on save (e.g. SC-2026-001)</p>
              <p>💰 All active fee categories will be applied automatically</p>
            </div>
          </div>
        )}

        {/* ── MEDICAL ── */}
        {tab === 'medical' && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-slate-700 dark:text-white mb-4">Medical Information</h2>
            <div><label className="label-xs">Known Allergies</label>
              <textarea rows={2} className="input-base resize-none" value={medical.allergies} onChange={e => setMedical(m => ({...m, allergies: e.target.value}))} />
            </div>
            <div><label className="label-xs">Medical Conditions</label>
              <textarea rows={2} className="input-base resize-none" value={medical.conditions} onChange={e => setMedical(m => ({...m, conditions: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label-xs">Family Doctor Name</label>
                <input className="input-base" value={medical.doctor_name} onChange={e => setMedical(m => ({...m, doctor_name: e.target.value}))} />
              </div>
              <div><label className="label-xs">Doctor Phone</label>
                <input className="input-base" value={medical.doctor_phone} onChange={e => setMedical(m => ({...m, doctor_phone: e.target.value}))} />
              </div>
            </div>
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {tab === 'documents' && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-slate-700 dark:text-white mb-4">Documents</h2>
            <p className="text-sm text-slate-500">Upload documents after enrollment from the student profile page. You can save and enroll now.</p>
            <div className="space-y-3">
              {[
                { label: 'Birth Certificate', key: 'birth_cert' },
                { label: 'Parent/Guardian ID', key: 'parent_id' },
                { label: 'Transfer Letter', key: 'transfer', note: '(optional)' },
              ].map(doc => (
                <div key={doc.key} className="flex items-center justify-between p-4 border border-dashed border-slate-200 dark:border-slate-600 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{doc.label}</p>
                    {doc.note && <p className="text-xs text-slate-400">{doc.note}</p>}
                  </div>
                  <input type="file" className="text-xs text-slate-500"/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={isFirst} className="btn-secondary disabled:opacity-40">
          ← Back
        </button>
        <span className="text-sm text-slate-400">{tabIndex + 1} of {TABS.length}</span>
        {isLast
          ? <button onClick={enroll} disabled={saving} className="btn-primary">
              {saving ? '⏳ Enrolling…' : '✅ Save & Enroll'}
            </button>
          : <button onClick={next} className="btn-primary">
              Next →
            </button>
        }
      </div>
    </div>
  )
}
