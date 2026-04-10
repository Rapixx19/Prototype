import { Syne, DM_Sans, Caveat } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500', '600'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '600'],
})

export const metadata = {
  title: 'VecterAI Knowledge OS',
  description: 'AI Knowledge Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} ${caveat.variable} bg-app-bg text-text-primary antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
