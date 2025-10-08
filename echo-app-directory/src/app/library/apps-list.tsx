'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => (
        <Card key={app.id} className="flex flex-col transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1">{app.name}</CardTitle>
              {app.category && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {app.category}
                </Badge>
              )}
            </div>
            {app.description && (
              <CardDescription className="line-clamp-2">
                {app.description}
              </CardDescription>
            )}
          </CardHeader>
          {app.stats && (
            <CardContent className="mt-auto">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="font-semibold text-foreground">
                    {app.stats.users.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-xs">Users</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {app.stats.transactions.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-xs">Transactions</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    ${(app.stats.earnings / 100).toFixed(0)}
                  </p>
                  <p className="text-muted-foreground text-xs">Earnings</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

