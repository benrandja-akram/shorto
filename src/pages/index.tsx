import type { GetServerSideProps, NextPage } from 'next'
import { useMutation } from '@tanstack/react-query'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { string } from 'zod'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { loader } from '../icons'

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const { isLoading, mutate, reset, data } = useMutation(
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
      onSuccess(data) {
        setValue('url', data.url)
        toast.success('URL created successfully')
      },
    }
  )
  const copy = () => {
    if (data) {
      navigator.clipboard.writeText(data.url)
    }

    toast('URL copied to your clipboard!', {
      icon: '👏',
    })
  }
  return (
    <div className="py-12">
      <Toaster position="top-center" reverseOrder={false} />

      <main className="mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-extrabold tracking-tighter md:text-4xl lg:text-5xl">
          Shorten your URL
        </h1>
        <div className="my-6 md:my-12">
          <form
            onSubmit={handleSubmit((values) => {
              if (data) {
                console.log('copy')
                copy()
              } else {
                mutate(values.url)
              }
            })}
          >
            <div className="relative flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-6">
              <input
                type="text"
                className={classnames(
                  'block h-14 w-full rounded-lg border-2 px-5 text-lg text-gray-800 outline-none ring-offset-2  transition-shadow md:flex-1 md:text-xl',
                  {
                    'focus:ring-2 focus:ring-indigo-500': !errors.url,
                    'ring-2 ring-red-400': errors.url,
                    'text-gray-800': !data,
                    'border-indigo-50 bg-indigo-50 text-indigo-800': data,
                  }
                )}
                {...register('url', {
                  required: true,
                  validate: (v) => string().url().safeParse(v).success,
                  onChange(ev) {
                    reset()
                  },
                })}
              />
              <button
                className={classnames(
                  'flex h-14 w-full items-center justify-center rounded-lg  bg-indigo-600 text-lg  font-semibold text-white transition-colors hover:bg-indigo-500 md:w-48 md:text-xl'
                )}
                disabled={isLoading}
              >
                {isLoading ? loader : data ? 'Copy' : 'Shorten'}
              </button>
            </div>
            {errors.url && (
              <div className="mt-2 text-red-500">Must a valid url</div>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  }
}
export const config = {
  runtime: 'experimental-edge',
}

export default Home
