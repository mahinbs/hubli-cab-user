-- 2. Refined Schema for HubliCab
-- Enable PostGIS extension for location services
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add location to profiles (for real-time driver tracking)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_online TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

-- 8. Driver Documents Table
CREATE TABLE IF NOT EXISTS public.driver_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'license', 'insurance', 'permit'
    document_url TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Drivers can manage own documents" ON public.driver_documents 
    FOR ALL USING (auth.uid() = driver_id);

CREATE POLICY "Ride participants can chat" ON public.chat_messages 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rides 
            WHERE rides.id = ride_id 
            AND (rides.rider_id = auth.uid() OR rides.driver_id = auth.uid())
        )
    );

CREATE POLICY "Ride participants can insert chat" ON public.chat_messages 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.rides 
            WHERE rides.id = ride_id 
            AND (rides.rider_id = auth.uid() OR rides.driver_id = auth.uid())
        )
    );

CREATE POLICY "Public read for settings" ON public.app_settings 
    FOR SELECT USING (true);

CREATE POLICY "Users can see own notifications" ON public.notifications 
    FOR SELECT USING (auth.uid() = user_id);

-- Functions and Triggers
-- Function to update profile location
CREATE OR REPLACE FUNCTION public.update_driver_location(driver_id UUID, lat DOUBLE PRECISION, lon DOUBLE PRECISION)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET location = ST_SetSRID(ST_MakePoint(lon, lat), 4326),
        last_online = NOW(),
        status = 'online'
    WHERE id = driver_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find nearby drivers
CREATE OR REPLACE FUNCTION public.get_nearby_drivers(lat DOUBLE PRECISION, lon DOUBLE PRECISION, radius_meters DOUBLE PRECISION, vehicle_type_id TEXT)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    avatar_url TEXT,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    distance DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.avatar_url,
        ST_Y(p.location::geometry) as lat,
        ST_X(p.location::geometry) as lon,
        ST_Distance(p.location, ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography) as distance
    FROM public.profiles p
    JOIN public.vehicles v ON p.id = v.driver_id
    WHERE p.role = 'driver'
    AND p.status = 'online'
    AND v.type = vehicle_type_id
    AND v.is_active = TRUE
    AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography, radius_meters)
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
