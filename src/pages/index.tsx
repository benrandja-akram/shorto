import { useCallback, useEffect, useReducer, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useMutation } from '@tanstack/react-query'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { string as zString } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import autoAnimate from '@formkit/auto-animate'
import { AiFillGithub, AiOutlineSafety } from 'react-icons/ai'
import { MdLink } from 'react-icons/md'
import { BsLink45Deg } from 'react-icons/bs'
import { HiOutlineSparkles } from 'react-icons/hi'

import { Logo, ShareDialog, Loading, ShortLinkCard } from '../components'

type ILink = {
  link: string
  shortened: string
}

const Home: NextPage = () => {
  const [viewMore, enableViewMore] = useReducer(() => true, false)
  const [links, setLinks] = useState([] as ILink[])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
        setIsDialogOpen(true)
        resetForm()
        const link: ILink = { link: url, shortened: shortened.url }
        localStorage.setItem('links', JSON.stringify([link, ...links]))
        setLinks([link, ...links])

        toast.success('URL shortened successfully')
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
        <ShareDialog
          link={data?.url ?? ''}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />

        <div className="mx-auto max-w-5xl px-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-3 font-londrina text-3xl font-semibold md:text-4xl lg:text-5xl">
              <Logo /> <span className="text-indigo-800">Shorto</span>
            </div>
            <a
              aria-label="shorto github repository"
              href="https://github.com/benrandja-akram/shorto"
              className="text-indigo-800 transition-colors hover:text-indigo-700"
            >
              <AiFillGithub size={36} />
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
                      <MdLink size="24" className="text-gray-400" />
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
                    {isLoading ? <Loading /> : 'Shorten'}
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
                    .map(({ link, shortened }) => (
                      <ShortLinkCard
                        key={shortened}
                        active={shortened === data?.url}
                        shortenedLink={shortened}
                        originalLink={link}
                      />
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
              <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-3">
                <div className=" flex flex-col items-center space-y-2">
                  <HiOutlineSparkles size={24} />
                  <h3 className="text-lg font-bold tracking-tight   text-gray-700 md:text-2xl">
                    Easy
                  </h3>
                  <p className="text-center text-gray-500">
                    Easy and fast, enter the long link to get your shortened
                    link immediately.
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

export default Home
