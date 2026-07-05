import { createClient } from '@/lib/supabase/client'

export type Phase = 'pre_mid' | 'post_mid' | 'annual'

export interface SubjectResult {
  subject_id: string
  subject_name: string
  mg: number | null
  ex: number | null
  total: number
  max: number
  percent: number
  grade: string
}

export interface StudentResult {
  student_id: string
  full_name: string
  admission_number: string
  subjects: SubjectResult[]
  total_score: number
  total_max: number
  percent: number
  grade: string
  rank: number
}

export interface ClassRegisterData {
  class_name: string
  level: string
  term_name: string
  phase: Phase
  subjects: { id: string; name: string; mg_max: number; ex_max: number; is_post_mid_only: boolean }[]
  students: StudentResult[]
  class_average: number
}

/**
 * Computes a full class register for a given class + term + phase.
 *
 * PRE-MID:   sums quiz/assignment/project marks before midterm date
 * POST-MID:  MG = pre-mid sum, EX = exam mark, TOTAL = MG + EX
 *            Post-Mid-Only subjects: MG is auto-set equal to EX
 * ANNUAL:    sums all 3 terms' G-TOT per subject
 */
export async function computeClassRegister(
  schoolId: string,
  classId: string,
  termId: string,
  phase: Phase
): Promise<ClassRegisterData> {
  const supabase = createClient()

  // 1. Load class + term info
  const [{ data: cls }, { data: term }] = await Promise.all([
    supabase.from('classes').select('name, level').eq('id', classId).single(),
    supabase.from('terms').select('name, midterm_date').eq('id', termId).single(),
  ])

  // 2. Load subjects for this level
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, mg_max, ex_max, is_post_mid_only')
    .eq('school_id', schoolId)
    .eq('level', cls?.level ?? 'primary')
    .eq('is_active', true)
    .order('display_order')

  const subjectList = subjects ?? []

  // 3. Load students in class
  const { data: studentRows } = await supabase
    .from('student_class_history')
    .select('student_id, students(id, first_name, last_name, admission_number)')
    .eq('class_id', classId)
    .eq('is_current', true)

  const students = (studentRows ?? []).map((r: any) => r.students).filter(Boolean)

  // 4. Load grading scale
  const { data: gradeScale } = await supabase
    .from('grading_scales')
    .select('grade, min_percent, max_percent')
    .eq('school_id', schoolId)
    .order('min_percent', { ascending: false })

  function getGrade(percent: number): string {
    return gradeScale?.find(g => percent >= g.min_percent && percent <= g.max_percent)?.grade ?? 'N/A'
  }

  // 5. Load all assessments for this class + subject set + term
  const subjectIds = subjectList.map(s => s.id)
  const { data: assessments } = await supabase
    .from('assessments')
    .select('id, subject_id, type, max_marks, date')
    .eq('class_id', classId)
    .eq('term_id', termId)
    .in('subject_id', subjectIds.length ? subjectIds : ['none'])

  const assessmentList = assessments ?? []
  const assessmentIds = assessmentList.map(a => a.id)

  // 6. Load all marks for these assessments
  const { data: marks } = await supabase
    .from('marks')
    .select('student_id, assessment_id, score')
    .in('assessment_id', assessmentIds.length ? assessmentIds : ['none'])

  const marksList = marks ?? []

  // ── Build lookup: assessment_id -> assessment ──
  const assessmentMap = new Map(assessmentList.map(a => [a.id, a]))

  // ── Compute per-student, per-subject results ──
  const results: StudentResult[] = students.map((s: any) => {
    const subjectResults: SubjectResult[] = subjectList.map(subj => {
      // Get all marks for this student+subject
      const studentSubjectMarks = marksList.filter(m => {
        const a = assessmentMap.get(m.assessment_id)
        return a && a.subject_id === subj.id && m.student_id === s.id
      })

      if (phase === 'pre_mid') {
        // Sum non-exam assessments (quiz, assignment, project, test) before midterm
        const relevant = studentSubjectMarks.filter(m => {
          const a = assessmentMap.get(m.assessment_id)
          return a && a.type !== 'exam' && a.type !== 'midterm'
        })
        const total = relevant.reduce((sum, m) => sum + Number(m.score), 0)
        const max   = relevant.reduce((sum, m) => {
          const a = assessmentMap.get(m.assessment_id)
          return sum + (a?.max_marks ?? 0)
        }, 0) || subj.mg_max
        const pct = max > 0 ? (total / max) * 100 : 0
        return {
          subject_id: subj.id, subject_name: subj.name,
          mg: null, ex: null, total, max, percent: pct, grade: getGrade(pct),
        }
      }

      if (phase === 'post_mid') {
        const mgMarks = studentSubjectMarks.filter(m => {
          const a = assessmentMap.get(m.assessment_id)
          return a && a.type !== 'exam' && a.type !== 'midterm'
        })
        const exMarks = studentSubjectMarks.filter(m => {
          const a = assessmentMap.get(m.assessment_id)
          return a && (a.type === 'exam' || a.type === 'midterm')
        })

        let mg = mgMarks.reduce((sum, m) => sum + Number(m.score), 0)
        let ex = exMarks.reduce((sum, m) => sum + Number(m.score), 0)

        // POST-MID-ONLY RULE: MG = copy of EX
        if (subj.is_post_mid_only) {
          mg = ex
        }

        const total = mg + ex
        const max   = subj.mg_max + subj.ex_max
        const pct   = max > 0 ? (total / max) * 100 : 0
        return {
          subject_id: subj.id, subject_name: subj.name,
          mg, ex, total, max, percent: pct, grade: getGrade(pct),
        }
      }

      // ANNUAL phase handled separately via computeAnnualRegister
      return {
        subject_id: subj.id, subject_name: subj.name,
        mg: 0, ex: 0, total: 0, max: subj.mg_max + subj.ex_max, percent: 0, grade: 'N/A',
      }
    })

    const total_score = subjectResults.reduce((s, r) => s + r.total, 0)
    const total_max    = subjectResults.reduce((s, r) => s + r.max, 0)
    const percent      = total_max > 0 ? (total_score / total_max) * 100 : 0

    return {
      student_id: s.id,
      full_name: `${s.last_name} ${s.first_name}`,
      admission_number: s.admission_number,
      subjects: subjectResults,
      total_score, total_max, percent,
      grade: getGrade(percent),
      rank: 0, // computed below
    }
  })

  // ── Rank students by total_score descending ──
  const sorted = [...results].sort((a, b) => b.total_score - a.total_score)
  sorted.forEach((r, i) => {
    // Handle ties: same score = same rank
    if (i > 0 && sorted[i-1].total_score === r.total_score) {
      r.rank = sorted[i-1].rank
    } else {
      r.rank = i + 1
    }
  })

  const classAverage = results.length > 0
    ? results.reduce((s, r) => s + r.percent, 0) / results.length
    : 0

  return {
    class_name: cls?.name ?? '',
    level: cls?.level ?? 'primary',
    term_name: term?.name ?? '',
    phase,
    subjects: subjectList,
    students: sorted,
    class_average: classAverage,
  }
}

/**
 * Computes the ANNUAL register by summing all 3 terms' post-mid G-TOT per subject.
 */
export async function computeAnnualRegister(
  schoolId: string,
  classId: string,
  academicYearId: string
): Promise<ClassRegisterData> {
  const supabase = createClient()

  const { data: terms } = await supabase
    .from('terms')
    .select('id, term_number')
    .eq('school_id', schoolId)
    .eq('academic_year_id', academicYearId)
    .order('term_number')

  if (!terms?.length) {
    return computeClassRegister(schoolId, classId, '', 'annual')
  }

  // Compute post_mid register for each term
  const termRegisters = await Promise.all(
    terms.map(t => computeClassRegister(schoolId, classId, t.id, 'post_mid'))
  )

  const base = termRegisters[0]
  const studentMap = new Map<string, StudentResult>()

  base.students.forEach(s => {
    studentMap.set(s.student_id, {
      ...s,
      subjects: s.subjects.map(sub => ({ ...sub, mg: 0, ex: 0, total: 0 })),
      total_score: 0, total_max: 0, percent: 0,
    })
  })

  termRegisters.forEach(reg => {
    reg.students.forEach(s => {
      const acc = studentMap.get(s.student_id)
      if (!acc) return
      s.subjects.forEach((sub, idx) => {
        if (acc.subjects[idx]) {
          acc.subjects[idx].mg!   += sub.mg ?? 0
          acc.subjects[idx].ex!   += sub.ex ?? 0
          acc.subjects[idx].total += sub.total
          acc.subjects[idx].max    = acc.subjects[idx].max + sub.max
        }
      })
      acc.total_score += s.total_score
    })
  })

  // Recompute grades & percentages with annual totals
  const { data: gradeScale } = await supabase
    .from('grading_scales')
    .select('grade, min_percent, max_percent')
    .eq('school_id', schoolId)
    .order('min_percent', { ascending: false })

  function getGrade(percent: number): string {
    return gradeScale?.find(g => percent >= g.min_percent && percent <= g.max_percent)?.grade ?? 'N/A'
  }

  const finalStudents = Array.from(studentMap.values()).map(s => {
    const total_max = s.subjects.reduce((sum, sub) => sum + sub.max, 0)
    const percent   = total_max > 0 ? (s.total_score / total_max) * 100 : 0
    s.subjects.forEach(sub => {
      sub.percent = sub.max > 0 ? (sub.total / sub.max) * 100 : 0
      sub.grade   = getGrade(sub.percent)
    })
    return { ...s, total_max, percent, grade: getGrade(percent) }
  })

  const sorted = finalStudents.sort((a, b) => b.total_score - a.total_score)
  sorted.forEach((r, i) => {
    r.rank = (i > 0 && sorted[i-1].total_score === r.total_score) ? sorted[i-1].rank : i + 1
  })

  const classAverage = sorted.length > 0
    ? sorted.reduce((s, r) => s + r.percent, 0) / sorted.length
    : 0

  return {
    class_name: base.class_name,
    level: base.level,
    term_name: 'Annual',
    phase: 'annual',
    subjects: base.subjects,
    students: sorted,
    class_average: classAverage,
  }
}
