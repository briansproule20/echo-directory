import Chat from '@/app/_components/chat';
import SignInButton from '@/app/_components/echo/sign-in-button';
import { DotBackground } from '@/components/ui/dot-background';
import { isSignedIn } from '@/echo';

export default async function Home() {
  const signedIn = await isSignedIn();

  if (!signedIn) {
    return (
      <DotBackground className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-3">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <svg
                className="h-10 w-10 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>

            <h2 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-4xl text-transparent tracking-tight">
              Welcome to Echo
            </h2>
            <p className="mx-auto max-w-sm text-muted-foreground text-sm leading-relaxed">
              AI-powered chat with built-in billing and user management.
              Start your conversation today.
            </p>
          </div>

          <div className="space-y-4">
            <SignInButton />

            <p className="text-muted-foreground/80 text-xs">
              Secure authentication with built-in AI billing
            </p>
          </div>
        </div>
      </DotBackground>
    );
  }

  return (
    <DotBackground className="h-full">
      <Chat />
    </DotBackground>
  );
}
