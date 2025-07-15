
-- Update the handle_new_user function to assign 'client' role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, email, role )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'email',
    new.raw_user_meta_data ->> 'role',

  );
  RETURN new;
END;
$function$;
