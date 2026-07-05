# SkyCampus — Part 5: Academics Part 2 (Register, Report Cards, Statistics, Timetable, Promotion)

## What is included

web/lib/academics/
  computeRegister.ts        Core formula engine shared by Register, Report Cards, and Statistics.
                             Exports computeClassRegister() and computeAnnualRegister().

web/app/(app)/academics/
  class-register/page.tsx   Full class register — auto-switches format by level (Nursery=French,
                             Primary=English) and phase (Pre-Mid / Post-Mid / Annual). Sticky first
                             2 columns, horizontally scrollable, class average row, Excel export, print.
  report-cards/page.tsx     Per-student printable report card matching all 6 blueprint formats.
                             Student prev/next navigator, promotion banner for Annual phase,
                             school logo/director, print-isolated CSS.
  statistics/page.tsx       Grade distribution pie chart, class averages bar chart (recharts),
                             subject performance table (avg/highest/lowest/pass-rate), Excel export.
  timetable/page.tsx        Weekly grid builder (Mon-Fri x 10 periods), break/lunch rows injected,
                             edit mode with subject+teacher dropdowns per cell, conflict checker
                             (detects double-booked teachers), Excel export, print.
  promotion/page.tsx        Loads annual register results per class, applies promotion_min threshold,
                             pass/repeat/graduate decision table with manual override per student,
                             bulk-confirm writes new student_class_history rows for the next year.

## Depends on Parts 1-4
Place all previous parts first, then add these on top.

## Core formula logic (computeRegister.ts)

PRE-MID:   Sums non-exam assessment scores (quiz/assignment/project/test) per subject.

POST-MID:  MG = sum of non-exam marks, EX = sum of exam/midterm marks, TOTAL = MG + EX.
           CRITICAL RULE: if subject.is_post_mid_only (Reading, Creative Arts, Sports),
           then MG is auto-set equal to EX — there is no separate pre-midterm score for
           these subjects per the school's spec.

ANNUAL:    Runs computeClassRegister() in post_mid mode for each of the 3 terms, then sums
           MG/EX/total/max per subject across all terms. Grades and ranks are recomputed
           on the annual totals (not averaged from term grades).

RANKING:   Students are ranked by total_score descending. Tied scores share the same rank
           (e.g. two students both ranked "3rd" — next rank skips to 5th).

## Known limitation
"Print All" on the report-cards page only triggers window.print() for the currently
displayed student — true bulk PDF generation (looping every student into a merged PDF)
is not implemented in this part. Single-student print works correctly via the
#report-card print-isolation CSS.

## Part 6 will cover
- Parent Portal (6 pages): dashboard, children/[id] with results/fees/attendance/timetable tabs, messages, notices
- Student Portal (5 pages): dashboard, results, timetable, attendance, materials
