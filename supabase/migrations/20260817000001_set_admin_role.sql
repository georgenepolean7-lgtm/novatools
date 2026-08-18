-- ==============================================================================
-- Migration: 20260817000001_set_admin_role.sql
-- Description: Assign admin role to georgenepolean7@gmail.com
-- ==============================================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'georgenepolean7@gmail.com'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET role = 'admin', updated_at = NOW()
    WHERE id = v_user_id;
  END IF;
END $$;
