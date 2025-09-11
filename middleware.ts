import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Edge runtime limitation: do not verify JWT here. Only check cookie presence.
  if (pathname.startsWith('/enterprise-dashboard')) {
    const token = request.cookies.get('enterprise_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/company-login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/enterprise-dashboard/:path*'],
}
