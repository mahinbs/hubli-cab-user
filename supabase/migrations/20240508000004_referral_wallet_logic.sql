-- 4. Referral and Wallet Triggers
-- Function to generate a random referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate referral code on profile creation
CREATE OR REPLACE FUNCTION public.on_profile_created_referral()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := public.generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_referral_code
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.on_profile_created_referral();

-- Function to handle referral bonus
CREATE OR REPLACE FUNCTION public.handle_referral_bonus()
RETURNS TRIGGER AS $$
DECLARE
    referrer_id UUID;
    bonus_amount NUMERIC;
BEGIN
    IF NEW.referred_by IS NOT NULL THEN
        referrer_id := NEW.referred_by;
        
        -- Get bonus amount from settings
        SELECT (value->>'bonus_amount')::NUMERIC INTO bonus_amount 
        FROM public.app_settings WHERE key = 'referral_config';
        
        IF bonus_amount IS NOT NULL THEN
            -- Update referrer wallet
            UPDATE public.profiles 
            SET wallet_balance = wallet_balance + bonus_amount 
            WHERE id = referrer_id;
            
            -- Record transaction
            INSERT INTO public.transactions (user_id, amount, type, description)
            VALUES (referrer_id, bonus_amount, 'deposit', 'Referral bonus from ' || NEW.full_name);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_handle_referral_bonus
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_referral_bonus();
