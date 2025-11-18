import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FitMind AI - Your Personal Fitness Coach',
  description: 'AI-powered fitness assistant that generates personalized workout and diet plans',
  keywords: 'fitness, AI, workout, diet, personal trainer, health',
  authors: [{ name: 'FitMind AI Team' }],
  openGraph: {
    title: 'FitMind AI - Your Personal Fitness Coach',
    description: 'AI-powered fitness assistant that generates personalized workout and diet plans',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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