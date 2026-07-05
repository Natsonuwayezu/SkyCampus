# SkyCampus — Part 3: Students Module + Staff Module

## What is included

### Students Module
web/app/(app)/students/
  page.tsx              Student list — search, filter by class/status, export Excel, archive
  enroll/page.tsx       5-tab enrollment wizard (Personal, Parent, Academic, Medical, Documents)
  [id]/page.tsx         Student detail — 5 tabs (Info, Fees, Academics, Family, History)
  bulk-import/page.tsx  3-step bulk import (download template, upload, preview & validate, import)
  archive/page.tsx      Archived students list with restore
  siblings/page.tsx     Family groups (multi-child) + unlinked students

### Staff Module
web/app/(app)/staff/
  page.tsx              Staff list — search, filter by role, create staff with role assignment
  [id]/page.tsx         Staff detail — assignments, permissions summary, account info
  subjects/page.tsx     Subjects management (nursery + primary), reorder drag up/down, post-mid flag
  assignments/page.tsx  Teacher-class-subject assignment matrix (scrollable, saves instantly)

## Depends on Parts 1 & 2
Place all Part 1 and Part 2 files first, then add these.

## Part 4 will cover
- Finance module (fee structure, record payment, payment history, receipts, financial reports, overdue, waivers)
- Academics module Part 1 (marks entry, marks database, assessments)
