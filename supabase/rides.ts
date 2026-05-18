import { supabase } from './client';

export const getVehicleTypes = async () => {
    const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('is_available', true);
    if (error) throw error;
    return data;
};

export const createRide = async (rideData: any) => {
    const { data, error } = await supabase
        .from('rides')
        .insert(rideData)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getRideHistory = async (riderId: string) => {
    const { data, error } = await supabase
        .from('rides')
        .select('*, profiles(full_name, avatar_url)')
        .eq('rider_id', riderId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const createRideRequest = async (rideData: any) => {
    const { data, error } = await supabase.functions.invoke('create-ride-request', {
        body: rideData
    });
    if (error) throw error;
    return data;
};

export const getBidsForRide = async (rideId: string) => {
    const { data, error } = await supabase
        .from('ride_bids')
        .select('*, profiles(full_name, avatar_url)')
        .eq('ride_id', rideId)
        .eq('status', 'pending');
    if (error) throw error;
    return data;
};

export const acceptBid = async (rideId: string, driverId: string) => {
    const { data, error } = await supabase.functions.invoke('accept-ride', {
        body: { ride_id: rideId, driver_id: driverId }
    });
    if (error) throw error;
    return data;
};

export const subscribeToBids = (rideId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`bids_${rideId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ride_bids', filter: `ride_id=eq.${rideId}` }, callback)
        .subscribe();
};

export const subscribeToRideUpdates = (rideId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`ride_${rideId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rides', filter: `id=eq.${rideId}` }, callback)
        .subscribe();
};

export const payForRide = async (paymentData: any) => {
    const { data, error } = await supabase.functions.invoke('process-payment', {
        body: paymentData
    });
    if (error) throw error;
    return data;
};

export const cancelRideRequest = async (rideId: string) => {
    const { data, error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);
    if (error) throw error;
    return data;
};
