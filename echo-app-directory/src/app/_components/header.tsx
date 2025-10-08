import { EchoAccount } from '@/components/echo-account-next';
import { ThemeToggle } from '@/components/theme-toggle';
import { isSignedIn } from '@/echo';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { NavigationMenu } from './navigation-menu';

interface HeaderProps {
  title?: string;
  className?: string;
}

const Header: FC<HeaderProps> = async ({
  title = 'My App',
  className = '',
}) => {
  const signedIn = await isSignedIn();

  return (
    <header
      className={`border-b border-border/50 bg-card/80 backdrop-blur-md shadow-sm ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              alt="Echo Logo"
              width={32}
              height={32}
              className="h-8 w-8 transition-transform hover:scale-105"
            />
            <h1 className="hidden bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-semibold text-transparent text-xl tracking-tight sm:block">
              {title}
            </h1>
          </Link>

          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <EchoAccount />
            {signedIn && <NavigationMenu />}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
