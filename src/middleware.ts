import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
})

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(pathname)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/index' ||
    pathname === '/' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return
  }

  console.time('getUrl')
  const url = (await redis.get(pathname.slice(1))) as string
  console.timeEnd('getUrl')

  if (url) return NextResponse.redirect(url)

  const notfoundUrl = request.nextUrl.clone()
  notfoundUrl.pathname = '/not-found'
  return NextResponse.rewrite(notfoundUrl)
}

export const config = {
  matcher: '/:id?',
}
