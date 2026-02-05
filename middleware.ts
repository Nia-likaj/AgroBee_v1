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

  // Apply i18n middleware first
  const intlResponse = intlMiddleware(req);

  // Extract locale from path
  const pathnameWithoutLocale = pathname.replace(/^\/(sq|en)/, '') || '/';

  // Protect profile routes
  if (pathnameWithoutLocale.startsWith('/profile')) {
    const token = req.cookies.get(AUTH_COOKIE)
    if (!token) {
      const url = req.nextUrl.clone()
      const locale = pathname.match(/^\/(sq|en)/)?.[1] || defaultLocale;
      url.pathname = `/${locale}/login`
      return NextResponse.redirect(url)
    }
  }

  // Protect admin routes
  if (pathnameWithoutLocale.startsWith('/admin')) {
    const token = req.cookies.get(AUTH_COOKIE)
    const role = req.cookies.get(ROLE_COOKIE)
    if (!token || role !== 'admin') {
      const url = req.nextUrl.clone()
      const locale = pathname.match(/^\/(sq|en)/)?.[1] || defaultLocale;
      url.pathname = `/${locale}/`
      return NextResponse.redirect(url)
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(sq|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
}
