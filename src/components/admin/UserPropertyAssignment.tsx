import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProperty {
  id: string;
  user_id: string;
  property_id: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
  properties: {
    name: string;
    address: string | null;
  };
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
}

interface Property {
  id: string;
  name: string;
}

export const UserPropertyAssignment = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<UserProperty[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
    fetchProperties();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data: userPropsData, error } = await supabase
        .from("user_properties")
        .select("id, user_id, property_id")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles and properties separately
      const userIds = [...new Set(userPropsData?.map(up => up.user_id) || [])];
      const propertyIds = [...new Set(userPropsData?.map(up => up.property_id) || [])];

      const [profilesResult, propertiesResult] = await Promise.all([
        supabase.from("profiles").select("id, email, full_name").in("id", userIds),
        supabase.from("properties").select("id, name, address").in("id", propertyIds)
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (propertiesResult.error) throw propertiesResult.error;

      const profilesMap = new Map(profilesResult.data?.map(p => [p.id, p]));
      const propertiesMap = new Map(propertiesResult.data?.map(p => [p.id, p]));

      const enrichedData = userPropsData?.map(up => ({
        id: up.id,
        user_id: up.user_id,
        property_id: up.property_id,
        profiles: profilesMap.get(up.user_id) || { email: "", full_name: null },
        properties: propertiesMap.get(up.property_id) || { name: "", address: null }
      }));

      setAssignments(enrichedData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load assignments.",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("email");

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId || !selectedPropertyId) {
      toast({
        title: "Error",
        description: "Please select both user and property.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_properties")
        .insert({
          user_id: selectedUserId,
          property_id: selectedPropertyId,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "This user is already assigned to this property.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({ title: "Success", description: "Property assigned successfully." });
      setIsDialogOpen(false);
      setSelectedUserId("");
      setSelectedPropertyId("");
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign property.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this property assignment?")) return;

    try {
      const { error } = await supabase
        .from("user_properties")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Assignment removed successfully." });
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove assignment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Property Assignments</CardTitle>
            <CardDescription>Assign properties to users</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                Assign Property
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Property to User</DialogTitle>
                <DialogDescription>
                  Select a user and property to create an assignment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="user">User</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email} {user.full_name && `(${user.full_name})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="property">Property</Label>
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
                <Button onClick={handleAssign} className="w-full">
                  Assign Property
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Email</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No assignments yet. Assign properties to users to get started.
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.profiles.email}</TableCell>
                    <TableCell>{assignment.profiles.full_name || "—"}</TableCell>
                    <TableCell>{assignment.properties.name}</TableCell>
                    <TableCell>{assignment.properties.address || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(assignment.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
