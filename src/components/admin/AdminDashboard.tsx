import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceChart } from "@/components/dashboard/InvoiceChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { MonthlyComparison } from "@/components/dashboard/MonthlyComparison";

interface Property {
  id: string;
  name: string;
}

interface Invoice {
  id: string;
  amount: number;
  category: string;
  invoice_date: string;
  vendor: string;
}

export const AdminDashboard = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      fetchInvoices(selectedPropertyId);
      
      // Set up realtime subscription
      const channel = supabase
        .channel('admin-invoices')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'invoices',
            filter: `property_id=eq.${selectedPropertyId}`
          },
          () => {
            fetchInvoices(selectedPropertyId);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedPropertyId]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setProperties(data || []);
      if (data && data.length > 0) {
        setSelectedPropertyId(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load properties.",
        variant: "destructive",
      });
    }
  };

  const fetchInvoices = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("property_id", propertyId)
        .order("invoice_date", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load invoices.",
        variant: "destructive",
      });
    }
  };

  const totalExpenses = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Dashboard</CardTitle>
          <CardDescription>View invoice data and expenses by property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Property</label>
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {invoices.length} invoices
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {selectedPropertyId && invoices.length > 0 && (
        <>
          <InvoiceChart invoices={invoices} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseBreakdown invoices={invoices} />
            <ExpensePieChart invoices={invoices} />
          </div>
          <MonthlyComparison invoices={invoices} />
        </>
      )}
    </div>
  );
};
