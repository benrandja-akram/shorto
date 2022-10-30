import autoAnimate from '@formkit/auto-animate'
import classNames from 'classnames'
import { useCopy } from './use-copy'

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

export { Copy }
