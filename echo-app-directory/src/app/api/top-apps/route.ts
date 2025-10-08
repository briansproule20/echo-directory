import { NextRequest, NextResponse } from 'next/server';
import { getEchoToken } from '@/echo';

export async function GET(request: NextRequest) {
  try {
    // Get the Echo access token
    const accessToken = await getEchoToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
          message: 'Please sign in to view apps',
        },
        { status: 401 }
      );
    }

    console.log('Fetching apps with authentication via tRPC...');

    // Just fetch first page (50 apps) - much faster and sufficient for the chatbot
    const input = JSON.stringify({
      json: {
        page_size: 50,
      },
    });

    const apiUrl = `https://echo.merit.systems/api/trpc/apps.list.public?batch=1&input=${encodeURIComponent(`{"0":${input}}`)}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('tRPC API error response:', errorText);
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // tRPC batch response format: [{ result: { data: { json: ... } } }]
    const data = responseData[0]?.result?.data?.json;

    if (!data) {
      console.error('Unexpected tRPC response format:', responseData);
      throw new Error('Invalid tRPC response format');
    }

    const allApps = data.items || [];
    console.log(`Successfully fetched ${allApps.length} apps`);

    // Check if stats should be fetched (only for small sets to avoid overwhelming the API)
    const shouldFetchStats = request.nextUrl.searchParams.get('includeStats') === 'true';
    
    if (shouldFetchStats && allApps.length <= 20) {
      // Only fetch stats for a small number of apps and batch them
      console.log('Fetching stats for top apps...');
      
      // Process in batches of 5 to avoid overwhelming the API
      const batchSize = 5;
      const appsWithStats = [];
      
      for (let i = 0; i < allApps.length; i += batchSize) {
        const batch = allApps.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (app: any) => {
            try {
              const statsInput = JSON.stringify({
                json: { appId: app.id },
              });

              const statsUrl = `https://echo.merit.systems/api/trpc/apps.app.users.count,apps.app.transactions.count,apps.app.earnings.get?batch=1&input=${encodeURIComponent(
                `{"0":${statsInput},"1":${statsInput},"2":${statsInput}}`
              )}`;

              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

              const statsResponse = await fetch(statsUrl, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                cache: 'no-store',
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                return {
                  ...app,
                  stats: {
                    users: statsData[0]?.result?.data?.json || 0,
                    transactions: statsData[1]?.result?.data?.json || 0,
                    earnings: statsData[2]?.result?.data?.json || 0,
                  },
                };
              }
              return app;
            } catch (error) {
              // Silently fail and return app without stats
              return app;
            }
          })
        );
        appsWithStats.push(...batchResults);
        
        // Small delay between batches
        if (i + batchSize < allApps.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.log(`Enriched ${appsWithStats.filter(a => a.stats).length} apps with stats`);
      
      return NextResponse.json({
        success: true,
        apps: appsWithStats,
        total: appsWithStats.length,
      });
    }

    // Return apps without stats (much faster)
    return NextResponse.json({
      success: true,
      apps: allApps,
      total: allApps.length,
    });
  } catch (error) {
    console.error('Error fetching top apps:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top apps',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
