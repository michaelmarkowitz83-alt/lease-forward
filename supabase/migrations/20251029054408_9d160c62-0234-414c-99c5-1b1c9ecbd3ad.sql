-- Add redirect_type column to user_redirects table
ALTER TABLE public.user_redirects 
ADD COLUMN redirect_type TEXT NOT NULL DEFAULT 'lease';

-- Add check constraint to ensure valid redirect types
ALTER TABLE public.user_redirects 
ADD CONSTRAINT valid_redirect_type CHECK (redirect_type IN ('lease', 'report'));

-- Drop the unique constraint on user_id since users can now have multiple redirects
ALTER TABLE public.user_redirects 
DROP CONSTRAINT IF EXISTS user_redirects_user_id_key;

-- Add composite unique constraint for user_id and redirect_type
ALTER TABLE public.user_redirects 
ADD CONSTRAINT user_redirects_user_id_redirect_type_key UNIQUE (user_id, redirect_type);