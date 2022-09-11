import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useMutation } from '@tanstack/react-query'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { string as zString } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import autoAnimate from '@formkit/auto-animate'

import { loader } from '../icons'

type ILink = {
  link: string
  shortened: string
}

const Home: NextPage = () => {
  const [viewMore, enableViewMore] = useReducer(() => true, false)
  const [links, setLinks] = useState([] as ILink[])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm()
  const animateRef = useCallback(
    (node: HTMLElement | null) => node && autoAnimate(node),
    []
  )
  const { isLoading, mutate, data } = useMutation(
    (url: string) => {
      return fetch('/api/shorten', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          return res.json()
        }

        throw new Error('Undefined error')
      }) as Promise<{ url: string }>
    },
    {
      onSuccess(shortened, url) {
        resetForm()
        const link: ILink = { link: url, shortened: shortened.url }
        localStorage.setItem('links', JSON.stringify([link, ...links]))
        setLinks([link, ...links])

        toast.success('URL created successfully')
      },
    }
  )

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem('links') ?? '[]') as ILink[])
  }, [])

  return (
    <>
      <Head>
        <title>URL Shortener</title>
      </Head>
      <div className="py-4 md:py-8">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="mx-auto max-w-5xl px-4">
          <header className="flex items-center justify-between">
            <div className="logo flex items-center space-x-3 text-3xl font-semibold md:text-4xl lg:text-5xl">
              <Logo /> <span className="text-indigo-800">Shorto</span>
            </div>
            <a href="https://github.com/benrandja-akram/shorto">
              <GithubLogo />
            </a>
          </header>
          <main className="my-6 md:my-12">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tighter md:text-center md:text-5xl">
                Free & Fast URL Shortener
              </h1>
              <p className="mx-auto mt-4 hidden max-w-2xl text-center text-lg text-gray-500 md:block">
                Shortened URLs will never expire. We do not display ads during
                direct redirecting to the original url.
              </p>
            </div>
            <form
              ref={animateRef}
              onSubmit={handleSubmit((values) => mutate(values.url))}
            >
              <div className="relative flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-6">
                <div className="relative flex-1" ref={animateRef}>
                  <span className="pointer-events-none absolute left-3.5 top-4 z-10">
                    <LinkIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Shorten your link"
                    className={classnames(
                      'block h-14 w-full rounded-lg border-2 px-5 pl-12 text-lg text-gray-800 outline-none ring-offset-2  transition-shadow md:flex-1 md:text-xl',
                      {
                        'focus:ring-2 focus:ring-indigo-500': !errors.url,
                        'ring-2 ring-red-400': errors.url,
                      }
                    )}
                    {...register('url', {
                      required: true,
                      validate: (v) => zString().url().safeParse(v).success,
                    })}
                  />
                  {errors.url && (
                    <div className="mt-2 text-red-500 md:hidden">
                      Must a valid url
                    </div>
                  )}
                </div>
                <button
                  className={classnames(
                    'flex h-14 w-full items-center justify-center rounded-lg  bg-indigo-600 text-lg  font-semibold text-white transition-colors hover:bg-indigo-500 md:w-48 md:text-xl'
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? loader : 'Shorten'}
                </button>
              </div>
              {errors.url && (
                <div className="mt-2 hidden text-red-500 md:block">
                  Must a valid url
                </div>
              )}
            </form>
          </main>

          {!!links.length && (
            <div className="my-8 space-y-2">
              <h2 className="text-xl font-semibold">Previous shortened URLs</h2>
              <div
                className=" divide-y overflow-hidden rounded-lg border text-gray-700 md:rounded-xl md:text-lg"
                ref={(node) => {
                  node && autoAnimate(node)
                }}
              >
                {links
                  .slice(0, viewMore ? undefined : 4)
                  .map(({ link, shortened }, index) => (
                    <div
                      key={shortened}
                      className={classnames(
                        'grid grid-cols-1 gap-2 py-3 px-4 transition-colors md:grid-cols-[1fr_auto_1fr_auto] md:flex-row md:items-center md:gap-6 md:py-4 md:px-6',
                        shortened === data?.url && 'bg-blue-50'
                      )}
                    >
                      <a
                        target="_blank"
                        rel="popover noreferrer"
                        href={link}
                        className="text-slate-500 line-clamp-1 hover:underline "
                      >
                        {link}
                      </a>
                      <Logo className="hidden h-6 w-6 md:block" />
                      <a
                        target="_blank"
                        rel="popover noreferrer"
                        href={shortened}
                        className="flex items-center space-x-3 font-medium text-indigo-600 hover:underline md:justify-end"
                      >
                        <Logo className="h-5 w-5 md:hidden" />
                        <span>{shortened}</span>
                      </a>
                      <div>
                        <Copy text={shortened} />
                      </div>
                    </div>
                  ))}
              </div>
              {links.length > 4 && !viewMore && (
                <div className=" ">
                  <button
                    className="py-2 font-semibold text-indigo-600 hover:underline"
                    onClick={enableViewMore}
                  >
                    View more
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Copy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout>()

  return (
    <button
      ref={(node) =>
        node && autoAnimate(node, { duration: 150, easing: 'ease-out' })
      }
      onClick={() => {
        setCopied(true)
        navigator.clipboard.writeText(text)
        toast('URL copied to your clipboard!', {
          icon: '👏',
        })
        clearTimeout(timeoutId.current)
        timeoutId.current = setTimeout(() => {
          setCopied(false)
        }, 1500)
      }}
      className={classnames(
        'min-w-[96px] rounded-lg py-1.5 font-medium  transition-colors md:py-2',
        {
          'bg-indigo-500 text-white': copied,
          'bg-indigo-200/60 text-slate-700 hover:bg-indigo-200': !copied,
        }
      )}
    >
      {copied ? (
        <span key="copied">Copied!</span>
      ) : (
        <span key="copy">Copy</span>
      )}
    </button>
  )
}
function Logo(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 64.000000 64.000000"
      preserveAspectRatio="xMidYMid meet"
      className="h-9 w-9 md:h-14 md:w-14"
      {...props}
    >
      <g
        transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
        className="fill-indigo-700"
        stroke="none"
      >
        <path
          d="M517 533 c-4 -3 -7 -15 -7 -25 0 -15 -8 -18 -59 -18 -73 0 -109 -12
-138 -47 l-22 -27 -9 24 c-21 55 -45 65 -161 66 l-106 1 100 -6 c55 -4 108
-11 118 -15 10 -5 27 -26 38 -47 18 -36 18 -41 4 -69 -9 -17 -18 -30 -20 -30
-3 0 -15 21 -28 48 l-22 47 -95 1 -95 1 90 -6 90 -6 28 -52 28 -53 -28 -52
-28 -53 -90 -6 -90 -5 92 -2 93 -2 59 118 c32 64 67 125 78 134 13 12 40 18
98 20 74 3 80 5 83 26 5 30 12 28 55 -16 l37 -38 -45 -44 c-45 -44 -45 -44
-45 -17 0 27 0 27 -73 27 l-73 0 -59 -121 c-33 -66 -69 -126 -80 -132 -11 -7
-65 -15 -120 -18 l-100 -5 92 -2 c110 -2 137 6 165 54 l21 36 21 -26 c25 -31
72 -46 143 -46 46 0 53 -3 53 -19 0 -11 4 -23 10 -26 11 -7 100 72 100 89 0
19 -87 99 -99 92 -6 -4 -11 -16 -11 -27 0 -17 -7 -19 -65 -19 l-65 0 -20 40
-20 40 20 40 20 40 65 0 c58 0 65 -2 65 -19 0 -37 22 -33 66 10 24 24 44 48
44 53 0 11 -80 96 -90 96 -4 0 -10 -3 -13 -7z m-157 -273 c12 -30 14 -30 86
-30 74 0 74 0 74 27 0 27 0 27 45 -17 l45 -44 -37 -38 c-43 -44 -50 -46 -55
-15 -3 20 -9 22 -83 25 -57 2 -85 8 -98 20 -34 30 -39 49 -22 82 18 35 27 33
45 -10z"
        />
      </g>
    </svg>
  )
}

function GithubLogo() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-8 w-8 fill-indigo-800 transition-colors hover:fill-indigo-700"
    >
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      ></path>
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="LinkIcon"
      className="h-6 w-6 fill-gray-400"
    >
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
    </svg>
  )
}
export default Home
