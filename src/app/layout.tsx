import '../styles/globals.css'

import { AiFillGithub } from 'react-icons/ai'
import classNames from 'classnames'
import { Londrina_Outline, Inter } from '@next/font/google'
import { Logo } from '../components'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const londrina = Londrina_Outline({ weight: '400', subsets: ['latin'] })

function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" type="image/svg" href="/logo.png" />
        <title>URL Shortener</title>
        <meta
          name="description"
          content="Free & Fast URL Shortener, Shortened URLs will never expire. We do not display ads during direct redirecting to the original url."
        />
      </head>
      <body>
        <div className="py-4 md:py-8">
          <div className="mx-auto max-w-5xl px-4">
            <header className="flex items-center justify-between">
              <Link
                href="/"
                className={classNames(
                  'flex items-center space-x-3 text-3xl !font-semibold md:text-4xl lg:text-5xl',
                  londrina.className
                )}
              >
                <Logo />
                <span className="text-indigo-800">Shorto</span>
              </Link>
              <a
                aria-label="shorto github repository"
                href="https://github.com/benrandja-akram/shorto"
                className="text-indigo-800 transition-colors hover:text-indigo-700"
              >
                <AiFillGithub size={36} />
              </a>
            </header>
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
export default Layout
