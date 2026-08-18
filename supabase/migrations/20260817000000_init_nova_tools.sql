-- ==============================================================================
-- NOVA TOOLS 500 - PRODUCTION SUPABASE DATABASE SCHEMA
-- Project ID: rjnjrvemsyhaeonkvbja (Region: ap-south-1)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on role for fast authorization checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. SECURITY DEFINER HELPER FUNCTIONS (Strict Search Path)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Restrict function execution
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- 4. PROFILES RLS POLICIES
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id OR public.is_admin()
  );

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger to prevent normal users from escalating role or premium flags
CREATE OR REPLACE FUNCTION public.check_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- If role or is_premium is changing, verify the current caller is an admin
  IF (OLD.role IS DISTINCT FROM NEW.role) OR (OLD.is_premium IS DISTINCT FROM NEW.is_premium) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Privilege Escalation Detected: You do not have permission to alter security roles or subscription status.';
    END IF;
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_prevent_profile_escalation ON public.profiles;
CREATE TRIGGER tr_prevent_profile_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_privilege_escalation();

-- Trigger for auto-profile creation upon Supabase auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role, is_premium)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, 'user'), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'user',
    FALSE
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. USER TOOL FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.user_tool_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_tool_favorites UNIQUE (user_id, tool_slug)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.user_tool_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tool_slug ON public.user_tool_favorites(tool_slug);

ALTER TABLE public.user_tool_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select_own" ON public.user_tool_favorites;
CREATE POLICY "favorites_select_own" ON public.user_tool_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert_own" ON public.user_tool_favorites;
CREATE POLICY "favorites_insert_own" ON public.user_tool_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete_own" ON public.user_tool_favorites;
CREATE POLICY "favorites_delete_own" ON public.user_tool_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. TOOL USAGE METRICS (Lightweight Non-Sensitive Metadata Only)
CREATE TABLE IF NOT EXISTS public.tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 1 CHECK (usage_count > 0),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tool_usage_user_slug UNIQUE (user_id, tool_slug)
);

CREATE INDEX IF NOT EXISTS idx_tool_usage_user ON public.tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_slug ON public.tool_usage(tool_slug);

ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tool_usage_select_own_or_admin" ON public.tool_usage;
CREATE POLICY "tool_usage_select_own_or_admin" ON public.tool_usage
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "tool_usage_insert_own" ON public.tool_usage;
CREATE POLICY "tool_usage_insert_own" ON public.tool_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tool_usage_update_own" ON public.tool_usage;
CREATE POLICY "tool_usage_update_own" ON public.tool_usage
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. TOOL FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.tool_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT CHECK (char_length(feedback) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_tool_slug ON public.tool_feedback(tool_slug);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.tool_feedback(rating);

ALTER TABLE public.tool_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone (authenticated or anonymous) to insert feedback
DROP POLICY IF EXISTS "feedback_insert_all" ON public.tool_feedback;
CREATE POLICY "feedback_insert_all" ON public.tool_feedback
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) OR 
    (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL))
  );

-- Only admins or the authoring user can read feedback
DROP POLICY IF EXISTS "feedback_select_admin_or_own" ON public.tool_feedback;
CREATE POLICY "feedback_select_admin_or_own" ON public.tool_feedback
  FOR SELECT
  USING (
    public.is_admin() OR 
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );

-- 8. ADMIN SETTINGS TABLE (Payment & Platform Switches)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public can read admin settings
DROP POLICY IF EXISTS "admin_settings_read_public" ON public.admin_settings;
CREATE POLICY "admin_settings_read_public" ON public.admin_settings
  FOR SELECT
  TO PUBLIC
  USING (TRUE);

-- Only admins can modify admin settings
DROP POLICY IF EXISTS "admin_settings_admin_all" ON public.admin_settings;
CREATE POLICY "admin_settings_admin_all" ON public.admin_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed default admin settings
INSERT INTO public.admin_settings (key, value)
VALUES
  ('payment_enabled', '{"enabled": false}'::JSONB),
  ('premium_enabled', '{"enabled": false}'::JSONB),
  ('maintenance_mode', '{"enabled": false}'::JSONB),
  ('signup_enabled', '{"enabled": true}'::JSONB),
  ('premium_amount_inr', '{"amount": 99}'::JSONB),
  ('ad_free_access', '{"enabled": false}'::JSONB)
ON CONFLICT (key) DO NOTHING;

-- 9. FEATURE FLAGS TABLE
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feature_flags_read_public" ON public.feature_flags;
CREATE POLICY "feature_flags_read_public" ON public.feature_flags
  FOR SELECT
  TO PUBLIC
  USING (TRUE);

DROP POLICY IF EXISTS "feature_flags_admin_modify" ON public.feature_flags;
CREATE POLICY "feature_flags_admin_modify" ON public.feature_flags
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed initial feature flags
INSERT INTO public.feature_flags (key, enabled, description)
VALUES 
  ('auth_login_enabled', TRUE, 'Allow user login and account management'),
  ('user_favorites_enabled', TRUE, 'Allow bookmarking favourite tools'),
  ('feedback_submission_enabled', TRUE, 'Allow user rating and feedback submission'),
  ('beta_wasm_codecs', FALSE, 'WebAssembly high-compression media experimental engines')
ON CONFLICT (key) DO NOTHING;

-- 10. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_admin_select" ON public.admin_audit_logs;
CREATE POLICY "audit_logs_admin_select" ON public.admin_audit_logs
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_admin_insert" ON public.admin_audit_logs;
CREATE POLICY "audit_logs_admin_insert" ON public.admin_audit_logs
  FOR INSERT
  WITH CHECK (public.is_admin() AND auth.uid() = admin_id);
