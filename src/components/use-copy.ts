import { useRef, useState } from 'react'

function useCopy() {
  const [copied, setCopied] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout>()

  return [
    copied,
    (text: string) => {
      setCopied(true)
      navigator.clipboard.writeText(text)

      clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        setCopied(false)
      }, 1500)
    },
  ] as const
}

export { useCopy }
