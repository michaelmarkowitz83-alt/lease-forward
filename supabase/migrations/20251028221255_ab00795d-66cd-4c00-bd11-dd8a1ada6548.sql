-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_properties junction table for assigning properties to users
CREATE TABLE public.user_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create invoices table (replacing "complete invoice extracer")
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  invoice_number TEXT,
  vendor TEXT,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  invoice_date DATE NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Admins can manage all properties"
  ON public.properties FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their assigned properties"
  ON public.properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_properties
      WHERE user_properties.property_id = properties.id
        AND user_properties.user_id = auth.uid()
    )
  );

-- RLS Policies for user_properties
CREATE POLICY "Admins can manage user property assignments"
  ON public.user_properties FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own property assignments"
  ON public.user_properties FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for invoices
CREATE POLICY "Admins can manage all invoices"
  ON public.invoices FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view invoices for their assigned properties"
  ON public.invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_properties
      WHERE user_properties.property_id = invoices.property_id
        AND user_properties.user_id = auth.uid()
    )
  );

-- Create updated_at trigger for properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create updated_at trigger for invoices
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for invoices
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;

-- Create indexes for better performance
CREATE INDEX idx_invoices_property_id ON public.invoices(property_id);
CREATE INDEX idx_invoices_date ON public.invoices(invoice_date);
CREATE INDEX idx_user_properties_user_id ON public.user_properties(user_id);
CREATE INDEX idx_user_properties_property_id ON public.user_properties(property_id);