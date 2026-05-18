-- Seed data for HubliCab
-- 1. Vehicle Types
INSERT INTO public.vehicle_types (id, name, image_url, base_fare, after_km_price, estimated_arrival)
VALUES 
('auto', 'Auto', 'https://example.com/auto.png', 30, 12, '3 min'),
('mini', 'Mini', 'https://example.com/mini.png', 50, 15, '5 min'),
('sedan', 'Sedan', 'https://example.com/sedan.png', 80, 18, '4 min'),
('suv', 'SUV', 'https://example.com/suv.png', 120, 25, '6 min')
ON CONFLICT (id) DO NOTHING;

-- 2. Sample Admin Settings
INSERT INTO public.app_settings (key, value, description)
VALUES 
('referral_config', '{"bonus_amount": 50, "max_referrals": 10}'::jsonb, 'Configuration for referral program')
ON CONFLICT (key) DO NOTHING;
