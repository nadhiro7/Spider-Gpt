import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import '../globals.css'
export const metadata = {
    title: 'Next.js 13 with Clerk',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorBackground: '#242F3D',
                    colorPrimary: '#2e8be8',
                    colorInputBackground: 'rgba(255, 255, 255,0.6)',
                    colorInputText: '#000'

                }
            }}
        >
            <html lang="en">
                <body >
                    <div className='auth'>
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}