import Head from 'next/head'
import { FC, ReactNode } from 'react'

type Props = {
  title: string
  childen: ReactNode
}

export const Layout: FC<Props> = ({ title, childen = 'Nextjs' }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex w-screen flex-1 flex-col items-center justify-center">
        {childen}
      </main>
    </div>
  )
}
