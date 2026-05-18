import { supabase } from './client';

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
};

export const updateProfile = async (userId: string, updates: any) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    if (error) throw error;
    return data;
};

export const getFavoriteLocations = async (userId: string) => {
    const { data, error } = await supabase
        .from('favorite_locations')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
};

export const getNearbyDrivers = async (lat: number, lon: number, radiusMeters: number = 5000, vehicleTypeId: string) => {
    const { data, error } = await supabase.rpc('get_nearby_drivers', {
        p_lat: lat,
        p_lon: lon,
        p_radius_meters: radiusMeters,
        p_vehicle_type_id: vehicleTypeId
    });
    if (error) throw error;
    return data;
};

export const subscribeToDrivers = (callback: (payload: any) => void) => {
    return supabase
        .channel('online_drivers')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'profiles', 
            filter: 'role=eq.driver' 
        }, callback)
        .subscribe();
};
