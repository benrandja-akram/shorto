import classNames from 'classnames'

import { Logo } from '.'

type Props = {
  active: boolean
  originalLink: string
  shortenedLink: string
}

function ShortLinkCard({
  active,
  originalLink,
  shortenedLink,
  children,
}: React.PropsWithChildren<Props>) {
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
      <div>{children}</div>
    </div>
  )
}

export { ShortLinkCard }
