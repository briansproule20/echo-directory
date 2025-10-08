'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Users, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface App {
  id: string;
  name: string;
  description?: string;
  creator?: string;
  users?: number;
  revenue?: number;
  homepageUrl?: string;
  profilePictureUrl?: string;
}

export function AppLibrary() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch('/api/top-apps');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch apps');
        }

        // Ensure apps is always an array
        const appsData = Array.isArray(data.apps) ? data.apps : [];
        setApps(appsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load apps');
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading apps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 font-semibold text-lg">Unable to load apps</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 font-semibold text-lg">No apps found</p>
          <p className="text-muted-foreground text-sm">
            Check back later for new apps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => (
        <Card
          key={app.id}
          className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {app.profilePictureUrl ? (
                  <img
                    src={app.profilePictureUrl}
                    alt={app.name}
                    className="h-12 w-12 rounded-lg"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
                    <span className="font-bold text-primary-foreground text-xl">
                      {app.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                  {app.creator && (
                    <CardDescription className="text-xs">
                      by {app.creator}
                    </CardDescription>
                  )}
                </div>
              </div>
              {app.homepageUrl && (
                <a
                  href={app.homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {app.description && (
              <p className="mb-4 line-clamp-3 text-muted-foreground text-sm">
                {app.description}
              </p>
            )}
            <div className="flex items-center gap-4">
              {app.users !== undefined && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Users className="h-3.5 w-3.5" />
                  <span>{app.users.toLocaleString()}</span>
                </div>
              )}
              {app.revenue !== undefined && app.revenue > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-primary">
                    ${app.revenue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
