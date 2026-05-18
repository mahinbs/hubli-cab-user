-- Initial App Settings
INSERT INTO public.app_settings (key, value, description)
VALUES 
('general', '{"site_currency": "₹", "vehicle_radius": 5, "offer_expire_time": 60}'::jsonb, 'General application settings'),
('google_maps', '{"api_key": ""}'::jsonb, 'Google Maps API configuration'),
('notifications', '{"onesignal_app_id": "", "onesignal_api_key": ""}'::jsonb, 'Notification service configuration')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
