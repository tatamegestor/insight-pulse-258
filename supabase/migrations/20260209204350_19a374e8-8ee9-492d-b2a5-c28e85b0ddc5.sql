ALTER TABLE public.profiles ADD COLUMN email text;

-- Update existing profiles with email from auth.users
UPDATE public.profiles
SET email = u.email
FROM auth.users u
WHERE profiles.user_id = u.id;

-- Update the trigger to also save email on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone_number, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.email
  );
  RETURN NEW;
END;
$function$;