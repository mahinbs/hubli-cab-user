-- 3. Bidding Schema
CREATE TABLE IF NOT EXISTS public.ride_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    bid_amount NUMERIC NOT NULL,
    estimated_arrival_time TIMESTAMPTZ,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ride_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Bidding
CREATE POLICY "Drivers can place bids" ON public.ride_bids 
    FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Riders can see bids for their rides" ON public.ride_bids 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rides 
            WHERE rides.id = ride_id 
            AND rides.rider_id = auth.uid()
        )
    );

CREATE POLICY "Drivers can see own bids" ON public.ride_bids 
    FOR SELECT USING (auth.uid() = driver_id);
