import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "FIS Alpine Ski World Cup Live",
    template: "%s | FIS Alpine Ski World Cup Live",
  },
  description: "Live results and standings of FIS Alpine Ski World Cup events in a simple and easy-to-use interface.",
  keywords: ["FIS", "Alpine Skiing", "World Cup", "Ski Racing", "Live Results", "Winter Sports"],
  authors: [{ name: "Davide Marcoli" }],
  category: "Sports",
  manifest: "/manifest.json",
  metadataBase: new URL("https://ski-data.davidemarcoli.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ski-data.davidemarcoli.dev",
    title: "FIS Alpine Ski World Cup Live",
    description: "Live results and standings of FIS Alpine Ski World Cup events.",
    siteName: "FIS Alpine Ski World Cup Live",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIS Alpine Ski World Cup Live",
    description: "Live results and standings of FIS Alpine Ski World Cup events.",
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
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  // verification: {
  //   google: 'your-google-site-verification-code', // Add your verification code if you have one
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
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
  );
}