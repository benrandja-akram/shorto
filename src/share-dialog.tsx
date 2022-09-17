import React, { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import autoAnimate from '@formkit/auto-animate'

import { RiCloseFill } from 'react-icons/ri'
import classNames from 'classnames'

type Props = { link: string } & React.ComponentProps<typeof Dialog.Root>

function ShareDialog({ link, ...props }: Props) {
  const [copied, setCopied] = useState(false)

  const timerRef = useRef<NodeJS.Timeout>()
  const onCopy = () => {
    window.navigator.clipboard.writeText(link)
    setCopied(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-zinc-800/60 backdrop-blur-sm" />

        <Dialog.Content className="dialog fixed top-[35%] left-[50%] z-50 w-[550px] max-w-[95vw] -translate-x-[50%] -translate-y-[50%] rounded-lg bg-white py-5 focus:outline-none">
          <Dialog.Close className="absolute  top-3.5 right-4 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline-none">
            <RiCloseFill size={26} />
          </Dialog.Close>
          <div className="space-y-3 border-b px-6 pb-5 pr-10">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Share short link
            </h1>
            <p className="text-base text-gray-500">
              Copy the short URL below and share it with your friends, or in
              social medias.
            </p>
          </div>
          <div className="relative space-y-3 py-4 px-6">
            <h2 className="text-lg font-medium tracking-tight text-gray-900">
              Link to share
            </h2>
            <div className="flex items-center justify-between space-x-4 rounded-lg bg-gray-100 px-4 py-2.5 text-base ">
              <a
                href={link}
                target="_blank"
                rel="popover noreferrer"
                onClick={onCopy}
                className="font-medium text-indigo-500 transition-colors line-clamp-1 hover:text-indigo-600 hover:underline"
              >
                {link}
              </a>
              <button
                onClick={onCopy}
                className={classNames(
                  'w-20 rounded border px-3 py-1 font-medium transition-colors',
                  {
                    ' border-gray-200 bg-white text-gray-700': !copied,
                    'border-transparent bg-indigo-600 text-white': copied,
                  }
                )}
                ref={(node) => node && void autoAnimate(node)}
              >
                {copied ? (
                  <span key="copied">Copied</span>
                ) : (
                  <span key="copy">Copy</span>
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ShareDialog }
