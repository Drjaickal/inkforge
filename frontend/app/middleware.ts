import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('tcb_token')?.value

    if (pathname.startsWith('/admin')) {
        if (!token) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
}