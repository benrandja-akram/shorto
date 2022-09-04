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

    await redis.set(id, body.url)

    return new Response(
      JSON.stringify({
        id,
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
