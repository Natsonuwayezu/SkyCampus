// SkyCampus Edge Function: send-notification
// POST /functions/v1/send-notification
// Body: { school_id, user_ids: string[], type, title, body?, link? }
// Inserts notification rows and optionally sends FCM push notifications.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { school_id, user_ids, type, title, body, link } = await req.json()
    if (!school_id || !user_ids?.length || !title) {
      return new Response(JSON.stringify({ error: 'school_id, user_ids, and title required' }), { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Insert notification rows
    const rows = user_ids.map((uid: string) => ({
      school_id, user_id: uid, type: type ?? 'system', title, body: body ?? null, link: link ?? null,
    }))
    const { error } = await supabase.from('notifications').insert(rows)
    if (error) throw error

    // Optional: FCM push notifications
    const fcmKey = Deno.env.get('FCM_SERVER_KEY')
    if (fcmKey) {
      const { data: users } = await supabase
        .from('users')
        .select('push_token')
        .in('id', user_ids)
        .not('push_token', 'is', null)

      const tokens = (users ?? []).map((u: any) => u.push_token).filter(Boolean)
      if (tokens.length > 0) {
        await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: { 'Authorization': `key=${fcmKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration_ids: tokens,
            notification: { title, body: body ?? '' },
            data: { type, link: link ?? '' },
          }),
        })
      }
    }

    return new Response(JSON.stringify({ success: true, sent_to: user_ids.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
