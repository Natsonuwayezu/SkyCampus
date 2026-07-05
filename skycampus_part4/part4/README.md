# SkyCampus — Part 4: Finance Module + Academics Part 1

## What is included

### Finance Module
web/app/(app)/finance/
  fee-structure/page.tsx     Fee categories — create/edit, auto-applies to all active students
  record-payment/page.tsx    Student search, amount entry, auto-allocation preview, receipt modal, overpayment → credit balance
  payment-history/page.tsx   Full payment log — filter by method/date, export Excel, reverse payment
  overdue/page.tsx           Overdue fees grouped by days (7+/30+/60+/90+), color-coded urgency, quick pay link
  waivers/page.tsx           Apply full/partial/percentage waivers per student per fee category
  reports/page.tsx           Financial KPIs, collection rate, breakdown by category and by class, Excel export

### Academics Module — Part 1
web/app/(app)/academics/
  marks-entry/page.tsx       Class→Subject→Assessment cascade, student table with Tab-to-next-row,
                              live grade computation, score validation (cap at max), locked-state handling,
                              save summary stats (entered/average/pass rate)
  assessments/page.tsx       Create/list/lock/delete assessments per class+subject+term
  marks-database/page.tsx    Full searchable/filterable marks log across all assessments, Excel export

## Depends on Parts 1, 2 & 3
Place all previous parts first, then add these on top.

## Key business logic implemented
- Payment allocation: pays oldest pending fees first, overflow becomes credit balance
- Auto-receipt numbering via `generate_receipt_number()` DB function
- Grade auto-computed from grading_scales table on every mark entry
- Fee category creation auto-inserts student_fees rows for all active students

## Part 5 will cover
- Academics Part 2: Class Register (6 formats), Report Cards (6 formats), Statistics, Timetable, Promotion
