'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

interface EchoApp {
  id: string;
  name: string;
  description?: string;
  category?: string;
  stats?: {
    users: number;
    transactions: number;
    earnings: number;
  };
}

export default function AppsList() {
  const [apps, setApps] = useState<EchoApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch('/api/top-apps');
        if (!response.ok) {
          throw new Error('Failed to fetch apps');
        }
        const data = await response.json();
        if (data.success) {
          setApps(data.apps);
        } else {
          throw new Error(data.error || 'Failed to fetch apps');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="space-y-3">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
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
            <div className="flex items-start justify-between gap-3">
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
            {app.description && (
              <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                {app.description}
              </CardDescription>
            )}
          </CardHeader>
          {app.stats && (
            <CardContent className="mt-auto border-t border-border/50 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                  <Users className="mb-1.5 h-4 w-4 text-primary" />
                  <p className="font-semibold text-base tracking-tight text-foreground">
                    {app.stats.users.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">Users</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                  <TrendingUp className="mb-1.5 h-4 w-4 text-primary" />
                  <p className="font-semibold text-base tracking-tight text-foreground">
                    {app.stats.transactions.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">Txns</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                  <DollarSign className="mb-1.5 h-4 w-4 text-primary" />
                  <p className="font-semibold text-base tracking-tight text-foreground">
                    ${(app.stats.earnings / 100).toFixed(0)}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">Earned</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

