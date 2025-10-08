import SignInButton from '@/app/_components/echo/sign-in-button';
import { DotBackground } from '@/components/ui/dot-background';
import { isSignedIn } from '@/echo';
import { Button } from '@/components/ui/button';
import { MessageSquare, Library, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const signedIn = await isSignedIn();

  return (
    <div className="relative h-full w-full overflow-y-auto scroll-smooth">
      <DotBackground className="pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-6 py-12">
        <div className="mx-auto w-full max-w-5xl space-y-12 text-center">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/70 shadow-2xl shadow-primary/20">
              <svg
                className="h-12 w-12 text-primary-foreground"
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

            <h1 className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text font-bold text-5xl text-transparent tracking-tight sm:text-6xl lg:text-7xl">
              Echo App Directory
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Discover, explore, and connect with applications built on the Echo platform.
              Find the perfect app or identify gaps in the ecosystem.
            </p>
          </div>

          {/* CTA Section */}
          {!signedIn ? (
            <div className="space-y-6">
              <SignInButton />
              <p className="text-muted-foreground/80 text-sm">
                Secure authentication with built-in AI billing
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="group gap-2 px-8">
                  <Link href="/chat">
                    <MessageSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
                    Start Chatting
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 px-8">
                  <Link href="/library">
                    <Library className="h-5 w-5" />
                    Browse Library
                  </Link>
                </Button>
              </div>
              
              {/* Echo Ideas CTA */}
              <div className="mx-auto max-w-2xl rounded-2xl border border-amber-600/20 bg-gradient-to-r from-amber-600/8 to-amber-600/4 p-6 backdrop-blur-sm transition-all hover:border-amber-600/30">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-amber-600/20 bg-gradient-to-br from-amber-600/10 to-amber-600/5 shadow-md">
                    <Image
                      src="/echo-ideasfavicon.png"
                      alt="Echo Ideas"
                      fill
                      className="object-cover p-2"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      Found a gap? Build your idea!
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Take insights from the directory to Echo Ideas and turn them into fully-fleshed app concepts
                    </p>
                  </div>
                  <Button asChild className="gap-2 whitespace-nowrap bg-amber-600 hover:bg-amber-700">
                    <a
                      href="https://echo-ideas-nu.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Zap className="h-4 w-4" />
                      Echo Ideas
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              href="/chat"
              className="group rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:cursor-pointer"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">AI-Powered Chat</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ask about any Echo app and get instant, intelligent responses
              </p>
            </Link>

            <Link
              href="/library"
              className="group rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:cursor-pointer"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Library className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">App Library</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Browse all Echo applications with detailed stats and information
              </p>
            </Link>

            <Link
              href="/chat"
              className="group rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:cursor-pointer sm:col-span-2 lg:col-span-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Ecosystem Insights</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Identify gaps and opportunities in the Echo platform
              </p>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
