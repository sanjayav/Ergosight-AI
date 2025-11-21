import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ErgoSight – Ingress/Egress AI Portal',
  description: 'Enterprise-grade AI portal for predicting and optimizing vehicle ingress/egress performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

