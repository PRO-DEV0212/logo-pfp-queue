
-- Create a table for logo/pfp requests
CREATE TABLE public.requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all users
CREATE POLICY "Anyone can view requests" 
  ON public.requests 
  FOR SELECT 
  USING (true);

-- Allow public insert access for new requests
CREATE POLICY "Anyone can create requests" 
  ON public.requests 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public update access (for admin functionality)
CREATE POLICY "Anyone can update requests" 
  ON public.requests 
  FOR UPDATE 
  USING (true);

-- Allow public delete access (for admin functionality)
CREATE POLICY "Anyone can delete requests" 
  ON public.requests 
  FOR DELETE 
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON public.requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
