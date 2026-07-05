# SkyCampus — Part 2: App Shell + Dashboards + Settings

## What is included

web/app/(app)/
  layout.tsx                  App shell (sidebar + topbar + term bar wired together)
  dashboard/page.tsx          Admin / Accountant / Teacher dashboard (role-aware)
  settings/page.tsx           School settings (general, branding, academic)
  settings/academic-calendar/ Terms + holidays management
  settings/classes/           Class management (nursery + primary)
  settings/grading/           Grading scale editor with live preview
  settings/users/             User management
  settings/roles/             Custom role & permission builder
  settings/backup/            Backup & restore
  settings/logs/              System audit logs
  notifications/page.tsx      Notifications center
  announcements/page.tsx      Announcements

web/components/shared/
  PermissionGate.tsx          Wraps any content behind role permission check
  PageHeader.tsx              Reusable page title + breadcrumb + action bar
  StatCard.tsx                KPI stat card used in dashboards
  DataTable.tsx               Reusable sortable/paginated table
  Modal.tsx                   Reusable modal wrapper
  Toast.tsx                   Toast notification system
  ConfirmDialog.tsx           Delete / destructive action confirmation

web/components/dashboard/
  FeeCollectionChart.tsx      Bar chart of fee collection by class
  RecentActions.tsx           Live recent activity feed
  ClassPerformanceTable.tsx   Class average summary table
  QuickActions.tsx            Quick action buttons grid

## Depends on Part 1
Copy Part 1 files first, then add these on top.
