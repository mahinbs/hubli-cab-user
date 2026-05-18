-- HubliCab Unified Supabase Schema
-- This schema replicates the structure of the original Ridego MySQL database
-- while optimizing for Supabase/PostgreSQL features.

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Unified for Riders, Drivers, and Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    phone_number TEXT UNIQUE,
    ccode TEXT, -- Country Code
    secondary_phone TEXT,
    secondary_ccode TEXT,
    role TEXT CHECK (role IN ('rider', 'driver', 'admin')) DEFAULT 'rider',
    avatar_url TEXT,
    
    -- Driver specific fields
    status TEXT DEFAULT 'offline', -- online, offline, busy
    approval_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    online_status BOOLEAN DEFAULT FALSE, -- fstatus in original
    ride_status BOOLEAN DEFAULT FALSE, -- rid_status in original
    
    -- Location & Tracking
    location GEOGRAPHY(POINT, 4326),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    last_online TIMESTAMPTZ DEFAULT NOW(),
    
    -- Personal Info
    nationality TEXT,
    date_of_birth DATE,
    complete_address TEXT,
    language TEXT,
    
    -- Financials
    wallet_balance NUMERIC DEFAULT 0,
    payout_wallet NUMERIC DEFAULT 0,
    total_payout NUMERIC DEFAULT 0,
    total_cash NUMERIC DEFAULT 0,
    
    -- Bank Info
    iban_number TEXT,
    bank_name TEXT,
    account_holder_name TEXT,
    vat_id TEXT,
    
    -- Referral Info
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.profiles(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Zones Table
CREATE TABLE IF NOT EXISTS public.zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    polygon GEOGRAPHY(POLYGON, 4326),
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vehicle Types Table
CREATE TABLE IF NOT EXISTS public.vehicle_types (
    id TEXT PRIMARY KEY, -- auto, mini, sedan, suv
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    map_icon_url TEXT, -- image used on map
    base_fare NUMERIC NOT NULL DEFAULT 0,
    min_km_distance NUMERIC DEFAULT 0,
    min_km_price NUMERIC DEFAULT 0,
    after_km_price NUMERIC DEFAULT 0,
    estimated_arrival TEXT, -- Added for UI
    passenger_capacity INTEGER DEFAULT 4,
    bidding_enabled BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns are added if table already exists
ALTER TABLE public.vehicle_types ADD COLUMN IF NOT EXISTS estimated_arrival TEXT;

-- 5. Vehicles Table (Linked to Drivers)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT REFERENCES public.vehicle_types(id),
    model TEXT NOT NULL,
    plate_number TEXT UNIQUE NOT NULL,
    color TEXT,
    vehicle_image TEXT,
    passenger_capacity INTEGER,
    preferences TEXT[], -- list of preferences like AC, Music, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Rides Table
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID REFERENCES public.profiles(id),
    driver_id UUID REFERENCES public.profiles(id),
    vehicle_type_id TEXT REFERENCES public.vehicle_types(id),
    zone_id UUID REFERENCES public.zones(id),
    
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    pickup_coords GEOGRAPHY(POINT, 4326),
    destination_coords GEOGRAPHY(POINT, 4326),
    
    -- Fare Details
    estimated_fare NUMERIC,
    final_fare NUMERIC,
    total_km NUMERIC,
    total_minutes INTEGER,
    
    -- Status
    status TEXT CHECK (status IN ('pending', 'searching', 'accepted', 'ongoing', 'completed', 'cancelled')) DEFAULT 'pending',
    payment_status TEXT CHECK (payment_status IN ('unpaid', 'paid')) DEFAULT 'unpaid',
    payment_method TEXT, -- cash, wallet, razorpay, etc.
    
    -- Bidding (if applicable)
    is_bidding_ride BOOLEAN DEFAULT FALSE,
    bidding_price NUMERIC,
    
    otp TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Ride Bids Table (For bidding feature)
CREATE TABLE IF NOT EXISTS public.ride_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.profiles(id),
    bid_amount NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Driver Documents Table
CREATE TABLE IF NOT EXISTS public.driver_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- license, insurance, etc.
    document_number TEXT,
    front_image_url TEXT,
    back_image_url TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    message TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    min_ride_amount NUMERIC DEFAULT 0,
    max_discount NUMERIC,
    expiry_date DATE,
    usage_limit INTEGER,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ride_id UUID REFERENCES public.rides(id),
    amount NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('deposit', 'withdrawal', 'ride_payment', 'referral_credit', 'driver_earning')) NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'completed',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Earnings Table (Summary for drivers)
CREATE TABLE IF NOT EXISTS public.earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES public.profiles(id),
    ride_id UUID REFERENCES public.rides(id),
    amount NUMERIC NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id),
    reviewee_id UUID REFERENCES public.profiles(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Basic Policies
-- Profiles: Users can read/write their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can see active drivers" ON public.profiles;
CREATE POLICY "Public can see active drivers" ON public.profiles FOR SELECT USING (role = 'driver' AND status = 'online');

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Rides:
DROP POLICY IF EXISTS "Riders can see own rides" ON public.rides;
CREATE POLICY "Riders can see own rides" ON public.rides FOR SELECT USING (auth.uid() = rider_id);

DROP POLICY IF EXISTS "Drivers can see available or own rides" ON public.rides;
CREATE POLICY "Drivers can see available or own rides" ON public.rides FOR SELECT USING (status = 'pending' OR status = 'searching' OR auth.uid() = driver_id);

DROP POLICY IF EXISTS "Riders can create rides" ON public.rides;
CREATE POLICY "Riders can create rides" ON public.rides FOR INSERT WITH CHECK (auth.uid() = rider_id);

DROP POLICY IF EXISTS "Participants can update rides" ON public.rides;
CREATE POLICY "Participants can update rides" ON public.rides FOR UPDATE USING (auth.uid() = driver_id OR auth.uid() = rider_id);

-- Settings: Public read
DROP POLICY IF EXISTS "Public read for settings" ON public.app_settings;
CREATE POLICY "Public read for settings" ON public.app_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for vehicle_types" ON public.vehicle_types;
CREATE POLICY "Public read for vehicle_types" ON public.vehicle_types FOR SELECT USING (true);

-- Functions
-- Function to update profile location
CREATE OR REPLACE FUNCTION public.update_driver_location(p_driver_id UUID, p_lat DOUBLE PRECISION, p_lon DOUBLE PRECISION)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles
    SET location = ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326),
        latitude = p_lat,
        longitude = p_lon,
        last_online = NOW(),
        status = 'online'
    WHERE id = p_driver_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find nearby drivers
CREATE OR REPLACE FUNCTION public.get_nearby_drivers(p_lat DOUBLE PRECISION, p_lon DOUBLE PRECISION, p_radius_meters DOUBLE PRECISION, p_vehicle_type_id TEXT)
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
        p.latitude as lat,
        p.longitude as lon,
        ST_Distance(p.location, ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography) as distance
    FROM public.profiles p
    JOIN public.vehicles v ON p.id = v.driver_id
    WHERE p.role = 'driver'
    AND p.status = 'online'
    AND v.type = p_vehicle_type_id
    AND v.is_active = TRUE
    AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography, p_radius_meters)
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
