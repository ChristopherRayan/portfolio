import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { AnalyticsTracker } from '@/components/public/AnalyticsTracker';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'CRK',
    template: '%s | CRK',
  },
  description: 'Personal portfolio of Christopher Rayan Kuchawo, a Full Stack Web Developer. Expert in Next.js, React, Node.js, and modern web technologies.',
  keywords: ['Christopher Rayan Kuchawo', 'CRK', 'Full Stack Developer', 'Web Developer', 'React', 'Next.js', 'Portfolio'],
  authors: [{ name: 'Christopher Rayan Kuchawo' }],
  creator: 'Christopher Rayan Kuchawo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crk-portfolio.com', // Replace with actual URL later
    title: 'CRK | Full Stack Developer',
    description: 'Personal portfolio of Christopher Rayan Kuchawo, a Full Stack Web Developer.',
    siteName: 'CRK Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Placeholder
        width: 1200,
        height: 630,
        alt: 'CRK Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRK | Full Stack Developer',
    description: 'Personal portfolio of Christopher Rayan Kuchawo, a Full Stack Web Developer.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
