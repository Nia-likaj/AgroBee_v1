import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {locales, defaultLocale} from './i18n';

const AUTH_COOKIE = 'token'
const ROLE_COOKIE = 'role'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Extract locale from path
  const locale = pathname.match(/^\/(sq|en)/)?.[1] || defaultLocale;
  const pathnameWithoutLocale = pathname.replace(/^\/(sq|en)/, '') || '/';

  // Protect profile routes
  if (pathnameWithoutLocale.startsWith('/profile')) {
    const token = req.cookies.get(AUTH_COOKIE)
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}/login`
      return NextResponse.redirect(url)
    }
  }

  // Protect admin routes
  if (pathnameWithoutLocale.startsWith('/admin')) {
    const token = req.cookies.get(AUTH_COOKIE)
    const role = req.cookies.get(ROLE_COOKIE)
    if (!token || role?.value !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}/`
      return NextResponse.redirect(url)
    }
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(sq|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
}
