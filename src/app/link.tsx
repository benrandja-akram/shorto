import { Redis } from '@upstash/redis'
import classNames from 'classnames'

import { Copy } from './copy'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
})

async function getLinkData(id: string) {
  const start = Date.now()
  const data = await redis.get<string>(id)
  console.log(id, Date.now() - start)

  return data as string
}

async function Link({ id }: { id: string }) {
  const link = await getLinkData(id)
  if (!link) return null

  const active = false
  const shortenedLink = `https://shorto.ink/${id}`
  const originalLink = link

  return (
    <div
      className={classNames(
        'grid h-[125px] grid-cols-1 gap-2 py-3 px-4 transition-colors md:h-20 md:grid-cols-[1fr_auto_1fr_auto] md:flex-row md:items-center md:gap-6 md:px-6 md:py-4',
        active && 'bg-blue-50'
      )}
    >
      <a
        target="_blank"
        rel="popover noreferrer"
        href={originalLink}
        className="text-slate-500 line-clamp-1 hover:underline "
      >
        {originalLink}
      </a>

      <img className="hidden h-6 w-6 md:block" src={'/logo.png'} alt="Logo" />
      <a
        target="_blank"
        rel="popover noreferrer"
        href={shortenedLink}
        className="flex items-center space-x-3 font-medium text-indigo-600 hover:underline md:justify-end"
      >
        <img className="block h-6 w-6 md:hidden" src={'/logo.png'} alt="Logo" />

        <span>{shortenedLink}</span>
      </a>
      <div>
        <Copy text={`https://shorto.ink/${id}`} />
      </div>
    </div>
  )
}

export default Link as unknown as React.FC<{ id: string }>
