-- 5. Notification Triggers
CREATE OR REPLACE FUNCTION public.on_ride_status_update_notify()
RETURNS TRIGGER AS $$
DECLARE
    rider_id UUID;
    driver_id UUID;
    title TEXT;
    body TEXT;
    target_user_id UUID;
BEGIN
    -- Only trigger if status changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    IF NEW.status = 'accepted' THEN
        target_user_id := NEW.rider_id;
        title := 'Ride Accepted';
        body := 'A driver has accepted your ride request and is on the way!';
    ELSIF NEW.status = 'ongoing' THEN
        target_user_id := NEW.rider_id;
        title := 'Ride Started';
        body := 'Your ride has started. Have a safe journey!';
    ELSIF NEW.status = 'completed' THEN
        target_user_id := NEW.rider_id;
        title := 'Ride Completed';
        body := 'You have arrived at your destination. Thank you for riding with HubliCab!';
    ELSIF NEW.status = 'cancelled' THEN
        -- Notify the other party
        IF auth.uid() = NEW.rider_id THEN
            target_user_id := NEW.driver_id;
            title := 'Ride Cancelled';
            body := 'The rider has cancelled the request.';
        ELSE
            target_user_id := NEW.rider_id;
            title := 'Ride Cancelled';
            body := 'The driver has cancelled the ride.';
        END IF;
    END IF;

    -- Call the edge function to send push notification
    -- We use net_http extension if available or just log it for an external worker
    -- Since Supabase Edge Functions can't be called directly from triggers easily without extensions,
    -- we'll insert into the notifications table and let a Webhook or Edge Function cron handle it,
    -- OR use the 'supabase' schema's 'http' extension if available.
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, body, data)
        VALUES (target_user_id, title, body, jsonb_build_object('ride_id', NEW.id, 'status', NEW.status));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_ride_status_notification
AFTER UPDATE ON public.rides
FOR EACH ROW EXECUTE FUNCTION public.on_ride_status_update_notify();
