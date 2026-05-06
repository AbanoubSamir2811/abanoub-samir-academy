-- Allow only the configured admin email to self-assign admin role once.
-- This avoids broad INSERT access on user_roles while enabling first login bootstrap.
CREATE POLICY "Allow configured admin bootstrap role insert"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'admin'
    AND lower(auth.jwt() ->> 'email') = 'abanoubsamir2811@gmail.com'
  );
