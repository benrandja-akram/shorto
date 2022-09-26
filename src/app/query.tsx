'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient()

function QueryProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
export default QueryProvider
