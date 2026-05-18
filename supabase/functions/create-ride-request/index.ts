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

    const { rider_id, pickup_address, destination_address, pickup_lat, pickup_lon, destination_lat, destination_lon, vehicle_type, fare } = await req.json()

    // 1. Create the ride record
    const { data: ride, error: rideError } = await supabaseClient
      .from('rides')
      .insert({
        rider_id,
        pickup_address,
        destination_address,
        pickup_coords: `POINT(${pickup_lon} ${pickup_lat})`,
        destination_coords: `POINT(${destination_lon} ${destination_lat})`,
        vehicle_type_id: vehicle_type,
        estimated_fare: fare,
        status: 'pending'
      })
      .select()
      .single()

    if (rideError) throw rideError

    // 2. Find nearby drivers (using the RPC function we created)
    const { data: nearbyDrivers, error: driversError } = await supabaseClient.rpc('get_nearby_drivers', {
      p_lat: pickup_lat,
      p_lon: pickup_lon,
      p_radius_meters: 5000, // 5km radius
      p_vehicle_type_id: vehicle_type
    })

    if (driversError) throw driversError

    // 3. Notify drivers (This would integrate with FCM or OneSignal)
    // For now, we'll just return the nearby drivers count
    
    // In a real scenario, you'd insert into a 'ride_requests' table that drivers subscribe to via Realtime,
    // or send push notifications.

    return new Response(
      JSON.stringify({ ride, nearbyDriversCount: nearbyDrivers?.length || 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
