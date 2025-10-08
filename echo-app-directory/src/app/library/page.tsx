import { isSignedIn } from '@/echo';
import { redirect } from 'next/navigation';
import AppsList from './apps-list';
import { DotBackground } from '@/components/ui/dot-background';

export default async function LibraryPage() {
  const signedIn = await isSignedIn();

  if (!signedIn) {
    redirect('/');
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <DotBackground className="absolute inset-0" />
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <div className="border-b border-border/50 bg-card/60 p-6 backdrop-blur-md supports-[backdrop-filter]:bg-card/50">
          <div className="mx-auto max-w-7xl">
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-3xl text-transparent tracking-tight">
              Echo App Library
            </h1>
            <p className="mt-2 text-muted-foreground text-base leading-relaxed">
              Discover and explore applications built on the Echo platform
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="mx-auto max-w-7xl p-6">
            <AppsList />
          </div>
        </div>
      </div>
    </div>
  );
}
