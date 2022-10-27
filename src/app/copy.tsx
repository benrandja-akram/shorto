'use client'

import { useCallback, useRef, useState } from 'react'
import autoAnimate from '@formkit/auto-animate'
import classNames from 'classnames'

function Copy({
  text,
  className,
  onClick,
  variant = 'default',
  ...props
}: {
  text: string
  variant?: 'default' | 'light'
} & React.ComponentProps<'button'>) {
  const [copied, setCopied] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout>()

  const copyToClipboard = () => {
    setCopied(true)
    navigator.clipboard.writeText(text)

    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      ref={useCallback(
        (node: HTMLButtonElement) =>
          node && autoAnimate(node, { duration: 150, easing: 'ease-out' }),
        []
      )}
      onClick={copyToClipboard}
      className={classNames(
        'min-w-[96px] rounded-lg py-1.5 font-medium transition-colors md:py-2',
        variant === 'default' && {
          'bg-indigo-600 text-white': copied,
          'bg-indigo-200/60 text-slate-700 hover:bg-indigo-200': !copied,
        },
        variant === 'light' && {
          ' border-gray-200 bg-white text-gray-700': !copied,
          'border-transparent bg-indigo-600 text-white': copied,
        },

        className
      )}
      {...props}
    >
      {copied ? (
        <span key="copied">Copied!</span>
      ) : (
        <span key="copy">Copy</span>
      )}
    </button>
  )
}

export { Copy }
