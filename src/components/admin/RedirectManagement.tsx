import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, ExternalLink, Trash2 } from "lucide-react";
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
  redirect_type: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

export const RedirectManagement = () => {
  const { toast } = useToast();
  const [redirects, setRedirects] = useState<UserRedirect[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [redirectType, setRedirectType] = useState<"lease" | "report">("lease");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      const { data, error } = await supabase
        .from("user_redirects")
        .select(`
          id,
          user_id,
          redirect_url,
          redirect_type,
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
    if (!selectedUserEmail || !newUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide both email and URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", selectedUserEmail.trim())
        .single();

      if (profileError || !profileData) {
        toast({
          title: "Error",
          description: "User not found with that email address.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("user_redirects")
        .upsert({
          user_id: profileData.id,
          redirect_url: newUrl.trim(),
          redirect_type: redirectType,
        }, {
          onConflict: "user_id,redirect_type",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Redirect URL saved successfully.",
      });

      setIsDialogOpen(false);
      setNewUrl("");
      setSelectedUserEmail("");
      setRedirectType("lease");
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

  const filteredRedirects = redirects.filter((redirect) =>
    redirect.profiles.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Redirect Management</CardTitle>
        <CardDescription>
          Configure custom lease and report URLs for each client
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
                    Enter the user email, redirect type, and URL for the client.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="userEmail">User Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@example.com"
                      value={selectedUserEmail}
                      onChange={(e) => setSelectedUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="redirectType">Redirect Type</Label>
                    <select
                      id="redirectType"
                      value={redirectType}
                      onChange={(e) => setRedirectType(e.target.value as "lease" | "report")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="lease">Lease</option>
                      <option value="report">Report</option>
                    </select>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Redirect URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRedirects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
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
                      <TableCell className="capitalize">{redirect.redirect_type}</TableCell>
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
  );
};
