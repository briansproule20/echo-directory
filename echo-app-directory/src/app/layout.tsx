import Header from '@/app/_components/header';
import { Providers } from '@/providers';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Echo App Directory',
  description: 'Discover and explore applications built on the Echo platform. Find AI-powered apps, identify gaps in the ecosystem, and connect with the Echo developer community.',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'The Echo App Directory',
    description: 'Discover and explore applications built on the Echo platform',
    images: ['/og-image.png'],
    siteName: 'Echo App Directory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Echo App Directory',
    description: 'Discover and explore applications built on the Echo platform',
    images: ['/og-image.png'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col bg-background antialiased`}
      >
        <Providers>
          <Header title="The Echo App Directory" />
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
