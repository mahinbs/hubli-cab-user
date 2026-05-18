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

    const { user_id, amount, payment_method, ride_id } = await req.json()

    if (payment_method === 'wallet') {
      // 1. Get current balance
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user_id)
        .single()

      if (profileError) throw profileError

      if (profile.wallet_balance < amount) {
        return new Response(
          JSON.stringify({ error: 'Insufficient balance' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // 2. Deduct balance
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ wallet_balance: profile.wallet_balance - amount })
        .eq('id', user_id)

      if (updateError) throw updateError

      // 3. Record transaction
      await supabaseClient
        .from('transactions')
        .insert({
          user_id,
          amount,
          type: 'spend',
          description: `Ride payment for ride ${ride_id}`
        })
      
      // 4. Update ride payment status
      await supabaseClient
        .from('rides')
        .update({ payment_status: 'paid' })
        .eq('id', ride_id)

      return new Response(
        JSON.stringify({ success: true, message: 'Payment successful from wallet' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle other payment methods (Stripe/Razorpay) here...
    
    return new Response(
      JSON.stringify({ error: 'Payment method not supported yet' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
