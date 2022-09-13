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

        <meta
          name="description"
          content="Free & Fast URL Shortener, Shortened URLs will never expire. We do not display ads during direct redirecting to the original url."
        />
      </Head>
      <div className="py-4 md:py-8">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="mx-auto max-w-5xl px-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-3 font-londrina text-3xl font-semibold md:text-4xl lg:text-5xl">
              <Logo /> <span className="text-indigo-800">Shorto</span>
            </div>
            <a
              aria-label="shorto github repository"
              href="https://github.com/benrandja-akram/shorto"
            >
              <GithubLogo />
            </a>
          </header>
          <main>
            <div className="my-6 md:my-12">
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
                        Must be a valid url
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
            </div>
            {!!links.length && (
              <div className="my-8 space-y-2">
                <h2 className="text-xl font-semibold">
                  Previous shortened URLs
                </h2>
                <div
                  className=" divide-y overflow-hidden rounded-lg border text-gray-700 md:rounded-xl md:text-lg"
                  ref={(node) => {
                    node && autoAnimate(node)
                  }}
                >
                  {links
                    .slice(0, viewMore ? undefined : 5)
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
                {links.length > 5 && !viewMore && (
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

            <div className="fadeIn mt-16">
              <h2 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                Shorten & Share
              </h2>
              <p className="m-auto my-4 max-w-2xl text-center text-lg text-gray-600">
                Your shortened URLs can be used in publications, documents,
                advertisements, blogs, forums, instant messages, and other
                locations
              </p>
              <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
                <div className=" flex flex-col items-center space-y-2">
                  <EasyIcon />
                  <h3 className="text-lg font-bold tracking-tight   text-gray-700 md:text-2xl">
                    Easy
                  </h3>
                  <p className="text-center text-gray-500">
                    Shorto is easy and fast, enter the long link to get your
                    shortened link shortened link.
                  </p>
                </div>
                <div className=" flex flex-col items-center space-y-2">
                  <ShortenedIcon />
                  <h3 className="text-lg font-bold tracking-tight   text-gray-700 md:text-2xl">
                    Shorten
                  </h3>
                  <p className="text-center text-gray-500">
                    Use any link, no matter what size, ShortURL always shortens.
                  </p>
                </div>
                <div className=" flex flex-col items-center space-y-2">
                  <SecureIcon />
                  <h3 className="text-lg font-bold tracking-tight text-gray-700 md:text-2xl">
                    Secure & Fast
                  </h3>
                  <p className="text-center text-gray-500">
                    It is fast and secure, our service have HTTPS protocol and
                    data encryption.
                  </p>
                </div>
              </div>
            </div>
          </main>
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

        clearTimeout(timeoutId.current)
        timeoutId.current = setTimeout(() => {
          setCopied(false)
        }, 1500)
      }}
      className={classnames(
        'min-w-[96px] rounded-lg py-1.5 font-medium  transition-colors md:py-2',
        {
          'bg-indigo-600 text-white': copied,
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

function ShortenedIcon() {
  return (
    <svg className="h-6 w-6" x="0px" y="0px" viewBox="0 0 501.991 501.991">
      <g>
        <g>
          <g>
            <path d="M471.557,30.434c-40.58-40.579-106.607-40.579-147.187,0L175.087,179.718c-0.002,0.002-0.003,0.003-0.005,0.005     L30.435,324.37c-40.579,40.58-40.579,106.607,0,147.187c20.29,20.29,46.941,30.434,73.593,30.434     c26.652,0,53.304-10.145,73.594-30.434l149.283-149.284c0.002-0.002,0.003-0.003,0.005-0.005l144.647-144.647     C512.136,137.041,512.136,71.014,471.557,30.434z M312.769,308.127L163.48,457.414c-32.782,32.781-86.122,32.781-118.902,0     c-32.781-32.781-32.781-86.121,0-118.902l101.334-101.334c-0.048,0.307-0.108,0.61-0.153,0.918     c-2.792,19.049-0.17,38.807,7.369,56.414l-0.012,0.001l-76.27,76.27c-14.988,14.989-14.988,39.376,0,54.365     c7.252,7.252,16.906,11.246,27.183,11.246c10.277,0,19.93-3.994,27.182-11.246l141.221-141.22l3.427-3.427l4.641-4.641     c14.988-14.988,14.988-39.376,0-54.365c-4.722-4.722-10.377-7.956-16.377-9.703l34.159-34.159     c5.23,3.308,10.083,7.19,14.487,11.594c6.115,6.115,11.224,13.097,15.186,20.752C344.879,242.676,338.776,282.12,312.769,308.127     z M163.218,312.693c3.519,5.066,7.476,9.827,11.865,14.216c4.389,4.389,9.15,8.346,14.216,11.864l-72.23,72.229     c-7.19,7.19-18.89,7.19-26.08,0s-7.19-18.89,0-26.08L163.218,312.693z M235.636,266.357c-7.19-7.191-7.19-18.891,0-26.081     l4.641-4.641c7.19-7.19,18.89-7.19,26.081,0c7.19,7.191,7.19,18.891,0,26.081l-4.641,4.641     C254.526,273.547,242.826,273.546,235.636,266.357z M326.91,175.082c-4.389-4.389-9.15-8.346-14.216-11.864l72.23-72.229     c7.19-7.19,18.89-7.19,26.08,0s7.19,18.89,0,26.08l-72.229,72.229C335.256,184.232,331.299,179.471,326.91,175.082z      M457.415,163.479L356.081,264.813c0.048-0.307,0.108-0.61,0.153-0.918c2.792-19.049,0.17-38.807-7.369-56.414l0.012-0.001     l76.27-76.27c14.988-14.989,14.988-39.376,0-54.365c-7.252-7.252-16.906-11.246-27.183-11.246     c-10.277,0-19.93,3.994-27.182,11.246l-141.221,141.22l-3.427,3.427l-4.641,4.641c-14.988,14.988-14.988,39.376,0,54.365     c4.722,4.722,10.377,7.956,16.377,9.703l-34.159,34.159c-5.23-3.308-10.083-7.19-14.487-11.594     c-6.115-6.115-11.224-13.097-15.186-20.752c-16.924-32.699-10.821-72.143,15.186-98.15L338.513,44.577     c32.781-32.782,86.121-32.782,118.902,0C490.196,77.358,490.196,130.698,457.415,163.479z" />
            <path d="M337.925,63.924l-16,16c-3.905,3.905-3.905,10.237,0,14.143c1.953,1.953,4.512,2.929,7.071,2.929     s5.119-0.976,7.071-2.929l16-16c3.905-3.905,3.905-10.237,0-14.143C348.162,60.019,341.83,60.019,337.925,63.924z" />
            <path d="M296.925,104.924l-101,101c-3.905,3.905-3.905,10.237,0,14.143c1.953,1.953,4.512,2.929,7.071,2.929     c2.559,0,5.119-0.976,7.071-2.929l101-101c3.905-3.905,3.905-10.237,0-14.143C307.162,101.019,300.83,101.019,296.925,104.924z" />
          </g>
        </g>
      </g>
    </svg>
  )
}

function SecureIcon() {
  return (
    <svg className="-mb-1 h-7 w-7" viewBox="0 0 24 24">
      <path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78zm-9.18-.5L7.4 12l3.54 3.54 5.66-5.66-1.41-1.41-4.24 4.24-2.13-2.12z"></path>
    </svg>
  )
}

function EasyIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24">
      <path d="M11.99 2C6.47 2 2 6.47 2 12s4.47 10 9.99 10S22 17.53 22 12 17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-10.06L14.06 11l1.06-1.06L16.18 11l1.06-1.06-2.12-2.12L13 9.94zm-4.12 0L9.94 11 11 9.94 8.88 7.82 6.76 9.94 7.82 11l1.06-1.06zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
    </svg>
  )
}
export default Home
