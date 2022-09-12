import Link from 'next/link'

function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col space-y-10 px-4 pt-12 text-gray-900 md:items-center md:pt-48">
      <div className="md: flex flex-col space-y-8 md:flex-row md:space-y-0 md:divide-x">
        <div className="text-4xl font-bold tracking-tighter text-indigo-600 md:pr-8 md:text-6xl">
          404
        </div>
        <div className="md:pl-8">
          <h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">
            Page not found
          </h1>
          <p className="mt-3 text-lg text-gray-900/70">
            Please check the URL in the address bar and try again.
          </p>
        </div>
      </div>
      <Link href="/">
        <a className="md:mr-32">
          <button className="h-12 w-44 rounded bg-indigo-600 text-lg font-semibold text-white transition-colors hover:bg-indigo-500">
            Go back home
          </button>
        </a>
      </Link>
    </div>
  )
}

export default NotFound
