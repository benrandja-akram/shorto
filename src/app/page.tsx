import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { AiOutlineSafety } from 'react-icons/ai'
import { BsLink45Deg } from 'react-icons/bs'
import { HiOutlineSparkles } from 'react-icons/hi'

import Form from './form'
import Link from './link'

export default async function Home() {
  const links = JSON.parse(cookies().get('links')?.value ?? '[]') as string[]

  return (
    <div className="my-6 md:my-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tighter md:text-center md:text-5xl">
          Free & Fast URL Shortener
        </h1>
        <p className="mx-auto mt-4 hidden max-w-2xl text-center text-lg text-gray-500 md:block">
          Shortened URLs will never expire. We do not display ads during direct
          redirecting to the original url.
        </p>
      </div>
      <Form />
      {!!links.length && (
        <div className="my-8 space-y-2">
          <h2 className="text-xl font-semibold">Previous shortened URLs</h2>
          <div className="divide-y overflow-hidden rounded-lg border text-gray-700 md:rounded-xl md:text-lg">
            {links.reverse().map((id) => (
              <Suspense
                key={id}
                fallback={
                  <div className="grid h-[125px] animate-pulse grid-cols-1 items-center gap-1 px-4 md:h-20 md:grid-cols-[1fr_auto_1fr_auto] md:gap-6 md:px-6">
                    <div className="h-4 max-w-[200px] rounded bg-slate-200 md:max-w-none"></div>
                    <div className="hidden h-6 w-6 rounded-full bg-slate-200 md:block"></div>
                    <div className="h-4 max-w-[280px] rounded bg-slate-200 md:max-w-none"></div>
                    <div className="h-9 w-[96px] rounded bg-indigo-200/60 "></div>
                  </div>
                }
              >
                <Link id={id} />
              </Suspense>
            ))}
          </div>
        </div>
      )}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          Shorten & Share
        </h2>
        <p className="m-auto my-4 max-w-2xl text-center text-lg text-gray-600">
          Your shortened URLs can be used in publications, documents,
          advertisements, blogs, forums, instant messages, and other locations
        </p>
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-3">
          <div className=" flex flex-col items-center space-y-2">
            <HiOutlineSparkles size={24} />
            <h3 className="text-lg font-bold tracking-tight   text-gray-700 md:text-2xl">
              Easy
            </h3>
            <p className="text-center text-gray-500">
              Easy and fast, enter the long link to get your shortened link
              immediately.
            </p>
          </div>
          <div className=" flex flex-col items-center space-y-2">
            <BsLink45Deg size={24} />
            <h3 className="text-lg font-bold tracking-tight   text-gray-700 md:text-2xl">
              Shorten
            </h3>
            <p className="text-center text-gray-500">
              Use any link, no matter what size, ShortURL always shortens.
            </p>
          </div>
          <div className=" flex flex-col items-center space-y-2">
            <AiOutlineSafety size={24} />
            <h3 className="text-lg font-bold tracking-tight text-gray-700 md:text-2xl">
              Secure & Fast
            </h3>
            <p className="text-center text-gray-500">
              It is fast and secure, our service have HTTPS protocol and data
              encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const runtime = 'edge'
export const metadata = {
  title: 'URL Shortener',
  description:
    'Free & Fast URL Shortener, Shortened URLs will never expire. We do not display ads during direct redirecting to the original url.',
  icons: {
    icon: '/logo.png',
  },
}
