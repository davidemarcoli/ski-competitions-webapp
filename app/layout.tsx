import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LONG_DESCRIPTION, SHORT_DESCRIPTION, TITLE } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: '%s | ' + TITLE,
  },
  description: LONG_DESCRIPTION,
  keywords: ['Alpine Skiing', 'World Cup', 'Ski Racing', 'Live Results', 'Winter Sports'],
  authors: [{ name: 'Davide Marcoli' }],
  category: 'Sports',
  manifest: '/manifest.webmanifest',
  metadataBase: new URL('https://ski-data.davidemarcoli.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ski-data.davidemarcoli.dev',
    title: TITLE,
    description: SHORT_DESCRIPTION,
    siteName: TITLE,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SHORT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icons/icon-128x128.png',
    apple: '/icons/icon-72x72.png',
  },
  // verification: {
  //   google: 'your-google-site-verification-code', // Add your verification code if you have one
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
