-- ==============================================================================
-- NOVA TOOLS 500 - ADMIN ACCOUNT CONFIGURATION SCRIPT
-- Project: Nova Tools (Project ID: rjnjrvemsyhaeonkvbja, Region: ap-south-1)
-- Target Admin: georgenepolean7@gmail.com
-- ==============================================================================

-- 1. Verify and promote the administrator profile
DO $$
DECLARE
  v_user_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Look up the UUID of georgenepolean7@gmail.com from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'georgenepolean7@gmail.com'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Check if public.profiles contains the record
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) INTO v_profile_exists;

    IF v_profile_exists THEN
      -- Update role to admin ONLY for georgenepolean7@gmail.com
      -- Do NOT make user premium automatically
      UPDATE public.profiles
      SET 
        role = 'admin',
        updated_at = NOW()
      WHERE id = v_user_id;

      RAISE NOTICE 'SUCCESS: User georgenepolean7@gmail.com (UUID: %) configured as role = admin', v_user_id;
    ELSE
      -- Insert admin profile if not already present
      INSERT INTO public.profiles (id, email, display_name, role, is_premium, created_at, updated_at)
      VALUES (v_user_id, 'georgenepolean7@gmail.com', 'Admin', 'admin', FALSE, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE
      SET role = 'admin', updated_at = NOW();

      RAISE NOTICE 'SUCCESS: Created admin profile for georgenepolean7@gmail.com (UUID: %)', v_user_id;
    END IF;
  ELSE
    RAISE NOTICE 'NOTE: georgenepolean7@gmail.com has not yet signed up via Supabase Auth. Once signed up, execute UPDATE public.profiles SET role = ''admin'' WHERE email = ''georgenepolean7@gmail.com'';';
  END IF;
END $$;

-- 2. Verify settings remain dormant
UPDATE public.admin_settings
SET 
  value = '{"enabled": false}'::JSONB,
  updated_at = NOW()
WHERE key IN ('payment_enabled', 'premium_enabled', 'maintenance_mode');

-- 3. Verification Query to confirm Admin status
SELECT id, email, display_name, role, is_premium, created_at, updated_at
FROM public.profiles
WHERE email = 'georgenepolean7@gmail.com';
