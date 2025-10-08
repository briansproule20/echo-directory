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
  description: 'AI-powered chat application with Echo billing integration',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'The Echo App Directory',
    description: 'AI-powered chat application with Echo billing integration',
    images: ['/og-image.png'],
  },
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
