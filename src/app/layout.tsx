import { AiFillGithub } from 'react-icons/ai'
import classNames from 'classnames'
import { Londrina_Outline, Inter } from 'next/font/google'
import Link from 'next/link'

import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--inter',
})
const londrina = Londrina_Outline({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--londrina',
})

function Layout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="en"
      className={classNames('font-inter', inter.variable, londrina.variable)}
    >
      <head />
      <body>
        <div className="py-4 md:py-8">
          <div className="mx-auto max-w-5xl px-4">
            <header className="flex items-center justify-between">
              <Link
                href="/"
                className={
                  'flex items-center space-x-3 font-londrina text-3xl !font-semibold md:text-4xl lg:text-5xl'
                }
              >
                <img
                  className="h-9 w-9 md:h-14 md:w-14"
                  src={'/logo.png'}
                  alt="Logo"
                />
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
