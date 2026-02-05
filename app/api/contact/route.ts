import { NextRequest, NextResponse } from 'next/server';

/**
 * Contact form API route – proxies submissions to n8n webhook.
 * Using a same-origin API avoids CORS: the browser only talks to this app,
 * and the server calls n8n (no CORS on server-to-server requests).
 *
 * Env: N8N_WEBHOOK_URL (server-only, preferred) or NEXT_PUBLIC_N8N_WEBHOOK_URL
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
