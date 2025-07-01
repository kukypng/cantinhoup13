
-- Add maintenance mode columns to store_settings table
ALTER TABLE public.store_settings 
ADD COLUMN maintenance_mode boolean DEFAULT false,
ADD COLUMN maintenance_message text DEFAULT 'Estamos em manutenção. Em breve voltaremos a funcionar normalmente!';
