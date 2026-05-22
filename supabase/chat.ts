import { supabase } from './client';

export const getMessages = async (rideId: string) => {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('ride_id', rideId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
};

export const sendMessage = async (rideId: string, senderId: string, message: string) => {
    const { data, error } = await supabase
        .from('chat_messages')
        .insert({ ride_id: rideId, sender_id: senderId, message })
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const subscribeToMessages = (rideId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`chat_${rideId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `ride_id=eq.${rideId}` }, callback)
        .subscribe();
};
