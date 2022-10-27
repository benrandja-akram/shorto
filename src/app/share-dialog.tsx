'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import { RiCloseFill } from 'react-icons/ri'
import classNames from 'classnames'
import { Copy } from './copy'

type Props = { link: string } & React.ComponentProps<typeof Dialog.Root>

function ShareDialog({ link, ...props }: Props) {
  return (
    <LazyMotion features={domAnimation}>
      <Dialog.Root {...props}>
        <AnimatePresence>
          {props.open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay
                className="fixed inset-0 z-40 bg-zinc-800/90"
                asChild
              >
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delayChildren: 100 }}
                />
              </Dialog.Overlay>

              <Dialog.Content
                asChild
                className="dialog fixed left-[50%] z-50 w-[550px] max-w-[95vw] -translate-x-[50%] -translate-y-[50%] overflow-hidden rounded-lg bg-white pt-5 focus:outline-none"
              >
                <m.div
                  initial={{ opacity: 0.5, top: '45%' }}
                  animate={{ opacity: 1, top: '35%' }}
                  exit={{
                    opacity: 0,
                    top: '40%',
                    transition: { type: 'tween', duration: 0.2 },
                  }}
                >
                  <Dialog.Close className="absolute top-3.5 right-4 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline-none">
                    <RiCloseFill size={26} />
                  </Dialog.Close>
                  <div className="space-y-3 border-b border-gray-300 px-6 pb-5 pr-10">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">
                      Share short link
                    </h1>
                    <p className="text-base text-gray-500">
                      Copy the short URL below and share it with your friends,
                      or in social medias.
                    </p>
                  </div>
                  <div className="relative space-y-3 bg-gray-50 py-6 px-6 pb-8">
                    <h2 className="text-lg font-medium tracking-tight text-gray-900">
                      Link to share
                    </h2>
                    <div className="flex items-center justify-between space-x-4 rounded-lg bg-slate-200/50 px-4 py-2.5 text-base ">
                      <a
                        href={link}
                        target="_blank"
                        rel="popover noreferrer"
                        className="text-lg font-semibold text-indigo-600 transition-colors line-clamp-1 hover:text-indigo-700 hover:underline"
                      >
                        {link}
                      </a>
                      <Copy
                        text={link}
                        variant="light"
                        className={classNames(
                          'w-20 border px-3 py-1 shadow-sm'
                        )}
                      />
                    </div>
                  </div>
                </m.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </LazyMotion>
  )
}

export { ShareDialog }
export default ShareDialog
