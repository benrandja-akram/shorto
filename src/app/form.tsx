'use client'

import { useReducer } from 'react'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import classnames from 'classnames'
import toast, { Toaster } from 'react-hot-toast'
import { MdLink } from 'react-icons/md'

const ShareDialog = dynamic(() => import('./share-dialog'))

type IState = { isLoading: boolean; isDialogOpen?: boolean; url?: string }
type IAction =
  | { type: 'loadingStarted' }
  | { type: 'success'; url: string }
  | { type: 'reset' }

const initialState: IState = { isLoading: false }

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case 'loadingStarted':
      return { isLoading: true, url: undefined }
    case 'success':
      return { isLoading: false, url: action.url, isDialogOpen: true }
    case 'reset':
      return initialState
    default:
      return state
  }
}
const Form: NextPage = () => {
  const router = useRouter()
  const [{ isLoading, url, isDialogOpen }, dispatch] = useReducer(reducer, {
    isLoading: false,
  })

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ShareDialog
        link={url ?? ''}
        open={isDialogOpen}
        onOpenChange={() => dispatch({ type: 'reset' })}
      />

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const url = new FormData(form).get('url')!

          try {
            dispatch({ type: 'loadingStarted' })

            const res = await fetch('/api/shorten', {
              method: 'POST',
              body: JSON.stringify({ url }),
              headers: {
                'Content-Type': 'application/json',
              },
            })
            if (!res.ok) {
              throw new Error()
            }
            const data: { url: string; id: string } = await res.json()

            dispatch({ type: 'success', url: data.url })
            form.reset()
            router.refresh()
            toast.success('URL shortened successfully')
          } catch (error) {
            toast.error('Unexpected error happened, please try again!')
            dispatch({ type: 'reset' })
          }
        }}
      >
        <div className="relative flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-6">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3.5 top-4 z-10">
              <MdLink size="24" className="text-gray-400" />
            </span>
            <input
              name="url"
              type="url"
              placeholder="Shorten your link"
              className={classnames(
                'block h-14 w-full rounded-lg border-2 px-5 pl-12 text-lg text-gray-800 outline-none ring-offset-2  transition-shadow focus:ring-2 focus:ring-indigo-500 md:flex-1 md:text-xl'
              )}
              required
            />
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
      </form>
    </>
  )
}

const Loading = () => (
  <svg className="h-3" viewBox="0 0 120 30" fill="#fff">
    <circle cx="15" cy="15" r="15">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="15;9;15"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="15" r="9" fillOpacity="0.3">
      <animate
        attributeName="r"
        from="9"
        to="9"
        begin="0s"
        dur="0.8s"
        values="9;15;9"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from="0.5"
        to="0.5"
        begin="0s"
        dur="0.8s"
        values=".5;1;.5"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="105" cy="15" r="15">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="15;9;15"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
)
export default Form
