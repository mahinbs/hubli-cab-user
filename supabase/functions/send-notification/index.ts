import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, title, body, data } = await req.json()

    // 1. Get OneSignal config from app_settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('app_settings')
      .select('value')
      .eq('key', 'notifications')
      .single()

    if (settingsError) throw settingsError

    const { onesignal_app_id, onesignal_api_key } = settings.value

    // 2. Send notification via OneSignal
    // Using filters by tag 'user_id' which should be set in the mobile app
    const message = {
      app_id: onesignal_app_id,
      contents: { "en": body },
      headings: { "en": title },
      data: data,
      filters: [
        { "field": "tag", "key": "user_id", "relation": "=", "value": user_id }
      ]
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${onesignal_api_key}`
      },
      body: JSON.stringify(message)
    })

    const result = await response.json()

    // 3. Log notification in database
    await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        title,
        body,
        data: data || {}
      })

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
