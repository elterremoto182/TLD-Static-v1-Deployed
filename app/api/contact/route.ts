import { NextRequest, NextResponse } from 'next/server';

/**
 * Contact form API route – proxies submissions to n8n webhook.
 * NOT USED when next.config.js has output: 'export' (static export).
 * With static export there is no server at runtime, so the contact form
 * calls the n8n webhook directly from the client and n8n must allow CORS.
 * This route is here for deployments that run a Node server (no static export).
 *
 * Env: N8N_WEBHOOK_URL (server-only) or NEXT_PUBLIC_N8N_WEBHOOK_URL
 */
export async function POST(request: NextRequest) {
  const webhookUrl =
    process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Webhook URL not configured' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[contact API] n8n webhook error:', res.status, text);
      return NextResponse.json(
        { error: 'Webhook request failed' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact API] fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to send request' },
      { status: 502 }
    );
  }
}
