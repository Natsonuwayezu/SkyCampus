# SkyCampus — Part 1: Project Foundation

## What is included
- supabase/migrations/ — All 25+ database tables, indexes, RLS policies
- supabase/seed/ — Default data per school
- web/ — Next.js project base: config, middleware, login, layout, UI components, lib

## Setup Steps
1. Create a project at supabase.com
2. Run migrations 001 → 004 in the SQL editor
3. Copy .env.example to .env.local and fill in your Supabase keys
4. npm install
5. npm run dev → visit localhost:3000

## Part 2 will add
- Admin dashboard
- App shell fully wired
- School settings
- Academic year & terms
