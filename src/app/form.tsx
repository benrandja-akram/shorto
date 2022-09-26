'use client'

import { useCallback, useEffect, useReducer, useState } from 'react'
import type { NextPage } from 'next'
import { useMutation } from '@tanstack/react-query'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { string as zString } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import autoAnimate from '@formkit/auto-animate'
import { MdLink } from 'react-icons/md'
import { ShareDialog, Loading, ShortLinkCard } from '../components'

type ILink = {
  link: string
  shortened: string
}

const Form: NextPage = () => {
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
      <Toaster position="top-center" reverseOrder={false} />
      <ShareDialog
        link={data?.url ?? ''}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

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
    </>
  )
}

export default Form
