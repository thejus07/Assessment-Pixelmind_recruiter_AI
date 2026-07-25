import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key to bypass RLS during signup syncing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isWebhookSyncReady = !!(supabaseUrl && supabaseServiceKey);
const supabaseAdmin = isWebhookSyncReady 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Error: Missing CLERK_WEBHOOK_SECRET', { status: 500 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying Clerk webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' && supabaseAdmin) {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;
    const email = email_addresses[0]?.email_address || '';
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User';

    try {
      const { error } = await supabaseAdmin.from('profiles').upsert({
        id: id,
        name: name,
        email: email,
        avatar_url: image_url,
        role: 'candidate'
      });

      if (error) throw error;
      console.log(`Successfully synced user profile for: ${email}`);
    } catch (dbErr) {
      console.error('Error syncing profile to Supabase:', dbErr);
      return new Response('Database sync failed', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
