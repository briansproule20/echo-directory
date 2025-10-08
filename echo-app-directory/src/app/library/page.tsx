import { isSignedIn } from '@/echo';
import { redirect } from 'next/navigation';
import AppsList from './apps-list';

export default async function LibraryPage() {
  const signedIn = await isSignedIn();

  if (!signedIn) {
    redirect('/');
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-bold text-2xl">Echo App Library</h1>
          <p className="text-muted-foreground text-sm">
            Discover and explore applications built on the Echo platform
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4">
          <AppsList />
        </div>
      </div>
    </div>
  );
}
