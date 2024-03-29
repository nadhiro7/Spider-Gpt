import { ClerkProvider, currentUser } from '@clerk/nextjs'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { dark } from '@clerk/themes'
import ChatBar from '@/components/shared/ChatBar'
import Sidebar from '@/components/shared/Sidebar'
import Portal from '@/components/shared/Portal'
import { getUser } from '@/lib/actions/user.actions'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spider-Gpt',
  description: 'Spider-Gpt is a simple chat app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  const currUser = JSON.parse(await getUser(user?.id, false))
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: '#242F3D',
          colorPrimary: '#2e8be8',

        }
      }}
    >
      <html lang="en" >
        <body className={`${inter.className}`}>
          <main className='flex flex-row'>
            <ChatBar id={user?.id} _id={currUser?._id} />
            {children}
          </main>
          <Portal />
          <Sidebar user={user} _id={currUser?._id} />
        </body>
      </html>
    </ClerkProvider>
  )
}
