interface EchoApp {
  id: string;
  name: string;
  description: string;
  category?: string;
  createdAt?: string;
  stats?: {
    users: number;
    transactions: number;
    earnings: number;
  };
  [key: string]: unknown;
}

interface AppsCache {
  apps: EchoApp[];
  timestamp: number;
}

let appsCache: AppsCache | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches all Echo apps from the Echo API via our authenticated endpoint
 * Uses caching to avoid excessive API calls
 */
export async function getEchoApps(): Promise<EchoApp[]> {
  // Check cache first
  if (appsCache && Date.now() - appsCache.timestamp < CACHE_TTL) {
    return appsCache.apps;
  }

  try {
    // Fetch from our authenticated API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/top-apps`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.apps) {
      throw new Error('Invalid response format from apps API');
    }

    const apps: EchoApp[] = data.apps;

    // Update cache
    appsCache = {
      apps,
      timestamp: Date.now(),
    };

    return apps;
  } catch (error) {
    console.error('Error fetching Echo apps:', error);
    
    // Return cached data if available, even if expired
    if (appsCache) {
      console.warn('Using stale cache due to API error');
      return appsCache.apps;
    }

    // Return empty array as fallback
    return [];
  }
}

/**
 * Formats apps data for the chatbot system prompt
 */
export function formatAppsForPrompt(apps: EchoApp[]): string {
  if (apps.length === 0) {
    return 'No apps are currently available.';
  }

  // Sort by user count if stats are available, otherwise keep original order
  const sortedApps = [...apps].sort((a, b) => {
    if (a.stats?.users && b.stats?.users) {
      return b.stats.users - a.stats.users;
    }
    return 0;
  });

  return sortedApps
    .map(
      (app, index) =>
        `${index + 1}. ${app.name}
   Description: ${app.description || 'No description available'}
   Category: ${app.category || 'Uncategorized'}
   ID: ${app.id}${
          app.stats
            ? `
   Stats:
     - Users: ${app.stats.users.toLocaleString()}
     - Transactions: ${app.stats.transactions.toLocaleString()}
     - Earnings: $${(app.stats.earnings / 100).toFixed(2)}`
            : ''
        }`
    )
    .join('\n\n');
}

/**
 * Clears the apps cache (useful for testing or manual refresh)
 */
export function clearAppsCache(): void {
  appsCache = null;
}

