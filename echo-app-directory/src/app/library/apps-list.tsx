'use client';

import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface EchoApp {
  id: string;
  name: string;
  description?: string;
  category?: string;
  profilePictureUrl?: string;
  homepageUrl?: string;
}

export default function AppsList() {
  const [apps, setApps] = useState<EchoApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        console.log('Fetching all apps...');
        const response = await fetch('/api/top-apps');
        if (!response.ok) {
          throw new Error('Failed to fetch apps');
        }
        const data = await response.json();
        console.log(`Received ${data.apps?.length || 0} total apps`);
        
        if (data.success) {
          setApps(data.apps);
        } else {
          throw new Error(data.error || 'Failed to fetch apps');
        }
      } catch (err) {
        console.error('Error fetching apps:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="mt-2 h-5 w-24" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load apps</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No apps found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {apps.map((app) => (
          <Card 
            key={app.id} 
            className="group flex flex-col overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-start gap-3">
                {/* App Avatar */}
                {app.profilePictureUrl && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-primary/20 to-primary/5">
                    <Image
                      src={app.profilePictureUrl}
                      alt={app.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {app.name}
                    </CardTitle>
                    {app.category && (
                      <Badge 
                        variant="secondary" 
                        className="shrink-0 border-border/50 bg-secondary/50 text-xs font-medium"
                      >
                        {app.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {app.description && (
                <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                  {app.description}
                </CardDescription>
              )}
              
              {/* Homepage Link */}
              {app.homepageUrl && (
                <a
                  href={app.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-primary text-sm font-medium transition-colors hover:text-primary/80"
                >
                  Visit App
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </CardHeader>
          </Card>
        ))}
    </div>
  );
}

