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

    console.log('Fetching all apps with authentication via tRPC...');
    
    // Fetch all apps at once with a large limit
    const input = JSON.stringify({
      json: {
        page_size: 1000, // Large number to get all apps
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
    console.log(`Successfully fetched ${allApps.length} total apps`);

    // Return all apps
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
