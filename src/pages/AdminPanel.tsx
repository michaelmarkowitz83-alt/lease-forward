import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { LogOut, Search, ExternalLink, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserRedirect {
  id: string;
  user_id: string;
  redirect_url: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirects, setRedirects] = useState<UserRedirect[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        } else {
          checkAdminStatus(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking admin status:", error);
        navigate("/dashboard");
        return;
      }

      if (data) {
        setIsAdmin(true);
        fetchRedirects();
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRedirects = async () => {
    try {
      const { data, error } = await supabase
        .from("user_redirects")
        .select(`
          id,
          user_id,
          redirect_url,
          profiles (
            email,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRedirects(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load user redirects.",
        variant: "destructive",
      });
    }
  };

  const handleSaveUrl = async () => {
    if (!selectedUserId || !newUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide both user and URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_redirects")
        .upsert({
          user_id: selectedUserId,
          redirect_url: newUrl.trim(),
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Redirect URL saved successfully.",
      });

      setIsDialogOpen(false);
      setNewUrl("");
      setSelectedUserId("");
      fetchRedirects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save redirect URL.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect?")) return;

    try {
      const { error } = await supabase
        .from("user_redirects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Redirect URL deleted successfully.",
      });

      fetchRedirects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete redirect URL.",
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

  const filteredRedirects = redirects.filter((redirect) =>
    redirect.profiles.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Manage client redirect URLs</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Redirect Management</CardTitle>
            <CardDescription>
              Configure custom lease URLs for each client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-secondary hover:bg-secondary/90">
                      Add New Redirect
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Redirect URL</DialogTitle>
                      <DialogDescription>
                        Enter the user ID and redirect URL for the client.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="userId">User ID</Label>
                        <Input
                          id="userId"
                          placeholder="Enter user ID"
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="url">Redirect URL</Label>
                        <Input
                          id="url"
                          placeholder="https://example.com/lease"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleSaveUrl} className="w-full">
                        Save URL
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Redirect URL</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRedirects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No redirects configured yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRedirects.map((redirect) => (
                        <TableRow key={redirect.id}>
                          <TableCell className="font-medium">
                            {redirect.profiles.email}
                          </TableCell>
                          <TableCell>{redirect.profiles.full_name || "—"}</TableCell>
                          <TableCell>
                            <a
                              href={redirect.redirect_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              {redirect.redirect_url.length > 40
                                ? redirect.redirect_url.substring(0, 40) + "..."
                                : redirect.redirect_url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(redirect.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;