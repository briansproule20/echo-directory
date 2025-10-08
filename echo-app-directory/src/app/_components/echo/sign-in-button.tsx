'use client';

import { useEcho } from '@merit-systems/echo-next-sdk/client';
import { Button } from '@/components/ui/button';

export default function SignInButton() {
  const { signIn } = useEcho();

  return (
    <Button
      onClick={() => signIn()}
      className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary to-primary/80 px-6 py-3 font-semibold text-primary-foreground text-sm shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      Sign in with Echo
    </Button>
  );
}
