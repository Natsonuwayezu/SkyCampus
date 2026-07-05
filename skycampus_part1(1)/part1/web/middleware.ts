import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/unauthorized', '/register-school']
const SUPERADMIN_ROUTES = ['/superadmin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // ── Resolve school from subdomain ──────────────────────────
  const parts = hostname.split('.')
  const isLocalhost = hostname.includes('localhost')
  const isSuperAdmin = hostname.startsWith('admin.') || pathname.startsWith('/superadmin')

  let schoolSlug: string | null = null
  if (!isLocalhost && !isSuperAdmin && parts.length >= 3) {
    schoolSlug = parts[0] // e.g. "lafontaine" from "lafontaine.skycampus.com"
  }

  // ── Build Supabase response ────────────────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current session
  const { data: { user } } = await supabase.auth.getUser()

  // ── School slug resolution ─────────────────────────────────
  if (schoolSlug) {
    const { data: school } = await supabase
      .from('schools')
      .select('id, name, status, primary_color, secondary_color, logo_url')
      .eq('slug', schoolSlug)
      .single()

    if (!school) {
      return NextResponse.redirect(new URL('/not-found', request.url))
    }
    if (school.status === 'suspended') {
      return NextResponse.redirect(new URL('/suspended', request.url))
    }

    // Inject school info into request headers for server components
    response.headers.set('x-school-id', school.id)
    response.headers.set('x-school-name', school.name)
    response.headers.set('x-school-color', school.primary_color || '#1A8FE3')
  }

  // ── Auth guard: protect (app) routes ──────────────────────
  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r))
  const isAppRoute = pathname.startsWith('/(app)') ||
    (pathname !== '/' && !isPublicRoute && !pathname.startsWith('/about') &&
     !pathname.startsWith('/admissions') && !pathname.startsWith('/news') &&
     !pathname.startsWith('/gallery') && !pathname.startsWith('/contact'))

  if (!user && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
