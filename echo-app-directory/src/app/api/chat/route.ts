import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { openai, getEchoToken } from '@/echo';
import { formatAppsForPrompt } from '@/lib/echo-apps';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      model,
      messages,
    }: {
      messages: UIMessage[];
      model: string;
    } = await req.json();

    // Validate required parameters
    if (!model) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Model parameter is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Messages parameter is required and must be an array',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch Echo apps directly using the Echo token
    let apps: any[] = [];
    try {
      const accessToken = await getEchoToken();
      
      if (accessToken) {
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

        if (response.ok) {
          const responseData = await response.json();
          const data = responseData[0]?.result?.data?.json;
          apps = data?.items || [];
        }
      }
    } catch (error) {
      console.error('Failed to fetch apps for chatbot context:', error);
      // Continue without apps if fetch fails
    }

    const appsData = formatAppsForPrompt(apps);

    // Create system message with app directory context
    const systemMessage = {
      role: 'system' as const,
      content: `You are an Echo App Directory assistant. Your role is to:
1. Help users discover Echo apps that match their needs
2. Identify gaps in the Echo ecosystem where new apps could be built
3. Provide detailed information about available apps
4. Suggest combinations of apps that could work together

Current Echo Apps (automatically updated, showing ${apps.length} apps):
${appsData}

When answering:
- Be conversational and helpful
- If a user asks about functionality, match it to relevant apps
- If no apps exist for a need, identify it as a gap and suggest what could be built
- If stats are available for apps, use them to recommend popular or successful apps
- Encourage exploration of the Echo platform
- Help developers understand what types of apps are needed in the ecosystem`,
    };

    // Prepend system message to conversation
    const messagesWithSystem = [
      systemMessage,
      ...convertToModelMessages(messages),
    ];

    const result = streamText({
      model: openai(model),
      messages: messagesWithSystem,
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to process chat request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
