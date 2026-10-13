import { FEATURES, PUBLIC_API_PREFIXES } from '@/config/features'
import { verifyJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { ADMIN_COOKIE, verifyAdminSession } from '@/studio/admin-session'
import { NextRequest, NextResponse } from 'next/server'

function notFound(req: NextRequest) {
   if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
   }
   // Rewriting to a path with no page renders the app's not-found page with a 404.
   return NextResponse.rewrite(new URL('/__hidden', req.url))
}

/* ───────────── Design Studio admin ───────────── */

async function guardAdmin(req: NextRequest) {
   const { pathname } = req.nextUrl
   const session = await verifyAdminSession(req.cookies.get(ADMIN_COOKIE)?.value)

   if (pathname === '/api/admin/session') return NextResponse.next()
   if (pathname === '/admin/login') {
      return session ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next()
   }
   if (session) {
      const res = NextResponse.next()
      res.headers.set('X-Robots-Tag', 'noindex, nofollow')
      res.headers.set('Cache-Control', 'no-store')
      return res
   }
   if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   const login = new URL('/admin/login', req.url)
   if (pathname !== '/admin') login.searchParams.set('next', pathname)
   return NextResponse.redirect(login)
}

/* ───────────── Customer accounts (database mode only) ───────────── */

async function guardAccounts(req: NextRequest) {
   const { pathname } = req.nextUrl
   const isPublicAccountApi =
      pathname.startsWith('/api/auth') ||
      pathname === '/api/products' ||
      pathname.startsWith('/api/products/') ||
      pathname.startsWith('/api/catalog')
   if (pathname === '/login' || isPublicAccountApi) return NextResponse.next()

   const token = req.cookies.get('token')?.value ?? req.headers.get('Authorization')?.replace(/^Bearer /, '')
   const isApi = pathname.startsWith('/api')
   const payload = token ? await verifyJWT<{ sub: string }>(token) : null
   if (!payload?.sub) {
      if (isApi) return getErrorResponse(401, 'UNAUTHORIZED')
      return NextResponse.redirect(new URL('/login', req.url))
   }
   const headers = new Headers(req.headers)
   headers.set('X-USER-ID', payload.sub)
   return NextResponse.next({ request: { headers } })
}

export async function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl

   if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin')) {
      return guardAdmin(req)
   }
   if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next()

   const accountArea =
      pathname === '/login' || pathname.startsWith('/profile') || pathname === '/wishlist' || pathname.startsWith('/api')
   if (accountArea) {
      if (!FEATURES.accounts) return notFound(req)
      return guardAccounts(req)
   }
   return NextResponse.next()
}

export const config = {
   matcher: ['/admin', '/admin/:path*', '/profile/:path*', '/login', '/wishlist', '/api/:path*'],
}
