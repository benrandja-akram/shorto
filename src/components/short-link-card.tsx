import autoAnimate from '@formkit/auto-animate'
import classNames from 'classnames'

import { Logo, useCopy } from '.'

type Props = {
  active: boolean
  originalLink: string
  shortenedLink: string
}

function ShortLinkCard({ active, originalLink, shortenedLink }: Props) {
  return (
    <div
      className={classNames(
        'grid grid-cols-1 gap-2 py-3 px-4 transition-colors md:grid-cols-[1fr_auto_1fr_auto] md:flex-row md:items-center md:gap-6 md:py-4 md:px-6',
        active && 'bg-blue-50'
      )}
    >
      <a
        target="_blank"
        rel="popover noreferrer"
        href={originalLink}
        className="text-slate-500 line-clamp-1 hover:underline "
      >
        {originalLink}
      </a>
      <Logo className="hidden h-6 w-6 md:block" />
      <a
        target="_blank"
        rel="popover noreferrer"
        href={shortenedLink}
        className="flex items-center space-x-3 font-medium text-indigo-600 hover:underline md:justify-end"
      >
        <Logo className="h-5 w-5 md:hidden" />
        <span>{shortenedLink}</span>
      </a>
      <div>
        <Copy text={shortenedLink} />
      </div>
    </div>
  )
}

function Copy({ text }: { text: string }) {
  const [copied, copyToClipboard] = useCopy()

  return (
    <button
      ref={(node) =>
        node && autoAnimate(node, { duration: 150, easing: 'ease-out' })
      }
      onClick={() => copyToClipboard(text)}
      className={classNames(
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

export { ShortLinkCard }
