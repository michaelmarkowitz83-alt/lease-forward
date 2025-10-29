import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { LogOut, FileText, Home } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceChart } from "@/components/dashboard/InvoiceChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";

interface Property {
  id: string;
  name: string;
  address: string | null;
}

interface Invoice {
  id: string;
  amount: number;
  category: string;
  invoice_date: string;
  vendor: string;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [leaseRedirectUrl, setLeaseRedirectUrl] = useState<string | null>(null);
  const [reportRedirectUrl, setReportRedirectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        fetchRedirectUrl(session.user.id);
        fetchUserProperties(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (selectedPropertyId) {
      fetchInvoices(selectedPropertyId);
      
      // Set up realtime subscription
      const channel = supabase
        .channel('client-invoices')
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

  const fetchRedirectUrl = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_redirects")
        .select("redirect_url, redirect_type")
        .eq("user_id", userId);

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Error fetching redirect URLs:", error);
        }
      } else if (data) {
        const leaseRedirect = data.find((r) => r.redirect_type === "lease");
        const reportRedirect = data.find((r) => r.redirect_type === "report");
        
        if (leaseRedirect) setLeaseRedirectUrl(leaseRedirect.redirect_url);
        if (reportRedirect) setReportRedirectUrl(reportRedirect.redirect_url);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserProperties = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_properties")
        .select("properties(id, name, address)")
        .eq("user_id", userId);

      if (error) throw error;
      
      const userProperties = data?.map(item => item.properties).filter(Boolean) || [];
      setProperties(userProperties as Property[]);
      
      if (userProperties.length > 0) {
        setSelectedPropertyId((userProperties[0] as Property).id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your properties.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleCreateLease = () => {
    if (leaseRedirectUrl) {
      window.open(leaseRedirectUrl, "_blank");
    } else {
      toast({
        title: "No URL configured",
        description: "Please contact your administrator to set up your lease URL.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = () => {
    if (reportRedirectUrl) {
      window.open(reportRedirectUrl, "_blank");
    } else {
      toast({
        title: "No URL configured",
        description: "Please contact your administrator to set up your report URL.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const totalExpenses = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Apex Renting Solutions
            </h1>
            <p className="text-muted-foreground">Client Portal</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                Your Properties
              </CardTitle>
              <CardDescription>View your rental property information and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.length > 0 ? (
                  <>
                    <div>
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

                    <div className="flex gap-3">
                      <Button
                        size="lg"
                        className="flex-1 bg-secondary hover:bg-secondary/90"
                        onClick={handleCreateLease}
                        disabled={!leaseRedirectUrl}
                      >
                        <FileText className="mr-2 h-5 w-5" />
                        Create Lease
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 bg-secondary hover:bg-secondary/90"
                        onClick={handleGenerateReport}
                        disabled={!reportRedirectUrl}
                      >
                        <FileText className="mr-2 h-5 w-5" />
                        Generate Report
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No properties assigned yet. Please contact your administrator.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedPropertyId && invoices.length > 0 && (
            <>
              <InvoiceChart invoices={invoices} />
              <ExpenseBreakdown invoices={invoices} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
