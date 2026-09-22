import {
   ADMIN_LOGGED_IN_COOKIE,
   ADMIN_TOKEN_COOKIE,
} from '@/lib/admin-auth'
import { verifyJWT } from '@/lib/jwt'
import { getErrorResponse } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

function isPublicApi(pathname: string) {
   if (pathname.startsWith('/api/admin')) return false
   if (pathname.startsWith('/api/auth')) return true
   if (pathname === '/api/checkout/demo') return true
   if (pathname.startsWith('/api/payments/verify')) return true
   if (pathname === '/api/products') return true
   if (pathname.startsWith('/api/products/')) return true
   if (pathname.startsWith('/api/catalog')) return true
   return false
}

function isAdminPublic(pathname: string) {
   return (
      pathname === '/admin/login' ||
      pathname.startsWith('/admin/login/') ||
      pathname.startsWith('/api/admin/auth')
   )
}

function isAdminPath(pathname: string) {
   return (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/api/admin')
   )
}

async function protect({
   req,
   token,
   loginPath,
   tokenCookie,
   loggedInCookie,
}: {
   req: NextRequest
   token?: string
   loginPath: string
   tokenCookie: string
   loggedInCookie: string
}) {
   const isApi = req.nextUrl.pathname.startsWith('/api')

   if (!token) {
      if (isApi) return getErrorResponse(401, 'INVALID TOKEN')
      return NextResponse.redirect(new URL(loginPath, req.url))
   }

   const response = NextResponse.next()

   try {
      const payload = await verifyJWT<{ sub: string }>(token)
      if (!payload?.sub) {
         throw new Error('INVALID TOKEN')
      }
      response.headers.set('X-USER-ID', payload.sub)
      return response
   } catch {
      if (isApi) return getErrorResponse(401, 'UNAUTHORIZED')

      const redirect = NextResponse.redirect(new URL(loginPath, req.url))
      redirect.cookies.delete(tokenCookie)
      redirect.cookies.delete(loggedInCookie)
      return redirect
   }
}

export async function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl

   if (isAdminPublic(pathname)) return NextResponse.next()

   if (isAdminPath(pathname)) {
      if (!process.env.JWT_SECRET_KEY) {
         console.error('JWT secret key is missing')
         return getErrorResponse(500, 'Internal Server Error')
      }

      return protect({
         req,
         token: req.cookies.get(ADMIN_TOKEN_COOKIE)?.value,
         loginPath: '/admin/login',
         tokenCookie: ADMIN_TOKEN_COOKIE,
         loggedInCookie: ADMIN_LOGGED_IN_COOKIE,
      })
   }

   if (isPublicApi(pathname)) return NextResponse.next()

   let token: string | undefined
   if (req.cookies.has('token')) {
      token = req.cookies.get('token')?.value
   } else if (req.headers.get('Authorization')?.startsWith('Bearer ')) {
      token = req.headers.get('Authorization')?.substring(7)
   }

   return protect({
      req,
      token,
      loginPath: '/login',
      tokenCookie: 'token',
      loggedInCookie: 'logged-in',
   })
}

export const config = {
   matcher: ['/admin', '/admin/:path*', '/profile/:path*', '/api/:path*'],
}
