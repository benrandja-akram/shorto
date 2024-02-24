import { Redis } from '@upstash/redis'
import { NextResponse, URLPattern } from 'next/server'
import type { NextRequest } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log({ pathname })

  if (pathname === '/' || pathname.includes('.')) {
    return
  }

  console.time('getUrl')
  const url = (await redis.get(pathname.slice(1))) as string
  console.timeEnd('getUrl')

  if (url) return NextResponse.redirect(url, { status: 308 })

  const notfoundUrl = request.nextUrl.clone()
  notfoundUrl.pathname = '/not-found'
  return NextResponse.rewrite(notfoundUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
