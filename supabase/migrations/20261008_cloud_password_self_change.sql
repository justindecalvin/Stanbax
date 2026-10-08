-- Apply this migration to existing Stanbax Supabase projects.
-- It closes the self-service password-change authorization check by binding
-- the selected credential row to the authenticated session's role and ref_id.
CREATE OR REPLACE FUNCTION public.change_password(
  p_identifier TEXT, p_old_password TEXT, p_new_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp AS $$
DECLARE
  c RECORD;
  v_role TEXT := public.session_role();
  v_ref TEXT := public.session_ref_id();
  is_self BOOLEAN;
BEGIN
  IF NOT public.valid_session() THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Not signed in.');
  END IF;

  SELECT * INTO c FROM public.credentials
   WHERE lower(identifier) = lower(trim(p_identifier))
      OR lower(ref_id) = lower(trim(p_identifier));

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Account not found.');
  END IF;

  -- Self is established by the authenticated session, never by the
  -- caller-supplied identifier (which necessarily matches the selected row).
  is_self := c.ref_id = v_ref AND c.role = v_role;

  -- Self-service changes always verify the old password. Admins may reset
  -- another user's password without their old password.
  IF is_self THEN
    IF c.password_hash <> crypt(COALESCE(p_old_password, ''), c.password_hash) THEN
      RETURN jsonb_build_object('ok', false, 'message', 'Current password incorrect.');
    END IF;
  ELSIF NOT public.is_admin() THEN
    INSERT INTO public.audit_logs (action, entity, actor_ref, actor_role, details)
    VALUES (
      'SECURITY_VIOLATION_PASSWORD_CHANGE',
      'credentials',
      v_ref,
      v_role,
      jsonb_build_object('target', p_identifier)
    );
    RETURN jsonb_build_object('ok', false, 'message', 'Unauthorized: You may only change your own password.');
  END IF;

  UPDATE public.credentials
     SET password_hash = crypt(p_new_password, gen_salt('bf')),
         updated_at = now()
   WHERE id = c.id;

  INSERT INTO public.audit_logs (action, entity, actor_ref, actor_role, details)
  VALUES (
    'PASSWORD_CHANGED',
    'credentials',
    c.ref_id,
    c.role,
    jsonb_build_object('identifier', c.identifier, 'changed_by', v_ref)
  );

  RETURN jsonb_build_object('ok', true);
END;
$$;
