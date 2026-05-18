-- HubliCab Supabase Schema

-- 1. Profiles Table (Riders, Drivers, Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone_number TEXT UNIQUE,
    role TEXT CHECK (role IN ('rider', 'driver', 'admin')) DEFAULT 'rider',
    avatar_url TEXT,
    status TEXT DEFAULT 'offline', -- online, offline, busy
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vehicle Types Table
CREATE TABLE IF NOT EXISTS public.vehicle_types (
    id TEXT PRIMARY KEY, -- auto, mini, sedan, suv
    name TEXT NOT NULL,
    image_url TEXT,
    base_fare NUMERIC NOT NULL,
    per_km_rate NUMERIC NOT NULL,
    estimated_arrival TEXT, -- e.g., '4 min'
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. Vehicles Table (Linked to Drivers)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT REFERENCES public.vehicle_types(id),
    model TEXT NOT NULL,
    plate_number TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Rides Table (Ride lifecycle)
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rider_id UUID REFERENCES public.profiles(id),
    driver_id UUID REFERENCES public.profiles(id),
    vehicle_type TEXT REFERENCES public.vehicle_types(id),
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    pickup_coords POINT, -- latitude, longitude
    destination_coords POINT,
    fare NUMERIC,
    status TEXT CHECK (status IN ('pending', 'accepted', 'ongoing', 'completed', 'cancelled')) DEFAULT 'pending',
    payment_status TEXT CHECK (payment_status IN ('unpaid', 'paid')) DEFAULT 'unpaid',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Earnings Table (For Drivers)
CREATE TABLE IF NOT EXISTS public.earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES public.profiles(id),
    ride_id UUID REFERENCES public.rides(id),
    amount NUMERIC NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Favorite Locations Table (For Users)
CREATE TABLE IF NOT EXISTS public.favorite_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Home, Work, etc.
    address TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_locations ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Public read for vehicle_types)
CREATE POLICY "Public read for vehicle_types" ON public.vehicle_types FOR SELECT USING (true);

-- Profiles: Users can read/write their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Rides: Riders can see their rides, Drivers can see assigned or pending rides
CREATE POLICY "Riders can see own rides" ON public.rides FOR SELECT USING (auth.uid() = rider_id);
CREATE POLICY "Drivers can see available or own rides" ON public.rides FOR SELECT USING (status = 'pending' OR auth.uid() = driver_id);
CREATE POLICY "Riders can create rides" ON public.rides FOR INSERT WITH CHECK (auth.uid() = rider_id);
CREATE POLICY "Drivers can update status" ON public.rides FOR UPDATE USING (auth.uid() = driver_id OR auth.uid() = rider_id);
-- 7. Transactions Table (Wallet)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('deposit', 'spend')) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Vehicles
DROP POLICY IF EXISTS "Drivers can insert own vehicle" ON public.vehicles;
CREATE POLICY "Drivers can insert own vehicle" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Drivers can see own vehicle" ON public.vehicles;
CREATE POLICY "Drivers can see own vehicle" ON public.vehicles FOR SELECT USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Drivers can update own vehicle" ON public.vehicles;
CREATE POLICY "Drivers can update own vehicle" ON public.vehicles FOR UPDATE USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
CREATE POLICY "Public can read vehicles" ON public.vehicles FOR SELECT USING (true);

-- RLS Policies for Driver Documents
DROP POLICY IF EXISTS "Drivers can insert own documents" ON public.driver_documents;
CREATE POLICY "Drivers can insert own documents" ON public.driver_documents FOR INSERT WITH CHECK (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Drivers can see own documents" ON public.driver_documents;
CREATE POLICY "Drivers can see own documents" ON public.driver_documents FOR SELECT USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Drivers can update own documents" ON public.driver_documents;
CREATE POLICY "Drivers can update own documents" ON public.driver_documents FOR UPDATE USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Public can read driver documents" ON public.driver_documents;
CREATE POLICY "Public can read driver documents" ON public.driver_documents FOR SELECT USING (true);
