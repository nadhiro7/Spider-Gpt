import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
export const metadata = {
    title: 'Next.js 13 with Clerk',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider appearance={{
            baseTheme: dark
        }}>
            <html lang="en">
                <body>{children}</body>
            </html>
        </ClerkProvider>
    )
}