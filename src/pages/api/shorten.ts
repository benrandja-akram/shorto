import { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
})

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response('Not found', { status: 404 })
  }

  try {
    const body = await req.json()
    z.string().url().parse(body.url)
    const id = nanoid(5)
    console.time('setURL')
    await redis.set(id, body.url)
    console.timeEnd('setURL')

    return new Response(
      JSON.stringify({
        url: `https://www.shorto.ink/${id}`,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error(error)
    return new Response('Bad request', { status: 400 })
  }
}

export const config = {
  runtime: 'experimental-edge',
}
