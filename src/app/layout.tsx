import './globals.css'
import type { Metadata } from 'next'
import Navigation from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Mente Digna - Citações Motivacionais',
  description: 'Citações motivacionais em português',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
