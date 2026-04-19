-- Defense-in-depth: restrictive policy ensures non-admins can NEVER insert/update an admin role,
-- even if a future permissive policy is added by mistake.
CREATE POLICY "Only admins can assign admin role"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO public
USING (
  role <> 'admin'::app_role
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  role <> 'admin'::app_role
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Harden new-user trigger: hardcode 'user' role, ignore any client-supplied metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- Always assign 'user' role on signup. Admin role can ONLY be granted by an existing admin.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;