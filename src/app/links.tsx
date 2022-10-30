import { Redis } from '@upstash/redis'
import { cookies } from 'next/headers'
import { Copy } from '../components'
import { ShortLinkCard } from '../components/short-link-card'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
})

async function getData() {
  const links = JSON.parse(cookies().get('links') ?? '[]') as string[]
  console.time('get-previous-links')
  const data = await Promise.all(links.map((id) => redis.get<string>(id)))
  console.timeEnd('get-previous-links')

  return links.map((id, i) => ({ id, link: data[i]! })).reverse()
}

async function Links() {
  const links = await getData()

  return (
    <>
      {!!links.length && (
        <div className="my-8 space-y-2">
          <h2 className="text-xl font-semibold">Previous shortened URLs</h2>
          <div className=" divide-y overflow-hidden rounded-lg border text-gray-700 md:rounded-xl md:text-lg">
            {links.map(({ link, id }) => (
              <ShortLinkCard
                active={false}
                key={id}
                shortenedLink={`https://shorto.ink/${id}`}
                originalLink={link}
              >
                <Copy text={`https://shorto.ink/${id}`} />
              </ShortLinkCard>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Links
