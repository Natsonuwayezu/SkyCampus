import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'SkyCampus — Premium Academic Management',
  description: 'All-in-one school management platform for modern African schools.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} font-body bg-[#F4F7FA] dark:bg-[#0F172A] text-gray-900 dark:text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  )
}
