import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserPlus, Shield, User as UserIcon, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTable, TableColumn } from "@/components/ResponsiveTable";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";

export default function UsersManagement() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [passwordError, setPasswordError] = useState("");

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      const json = await res.json();
      return json.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newUser: Partial<User>) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
      resetForm();
      toast.success("User created successfully!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      const res = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
      resetForm();
      toast.success("User updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
  });

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRole("user");
    setPasswordError("");
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUsername(user.username);
    setRole(user.role);
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    setPasswordError("");

    if (!editingUser && !password) {
      setPasswordError("Password is required");
      return;
    }

    if (password && password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (password && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (editingUser) {
      await updateMutation.mutateAsync({ ...editingUser, username, role, ...(password ? { password } : {}) } as User);
    } else {
      await createMutation.mutateAsync({ username, password, role });
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: "avatar",
      label: "Avatar",
      className: "w-[80px]",
      render: (user) => (
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border">
          {user.username.charAt(0).toUpperCase()}
        </div>
      ),
    },
    {
      key: "username",
      label: "Username",
      render: (user) => (
        <span className="font-medium text-slate-900">{user.username}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="gap-1">
          {user.role === "admin" ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
          {user.role}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (user) => (
        <span className="text-slate-500 text-sm">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (user) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-primary"
            onClick={() => handleEdit(user)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600"
            onClick={() => {
              if (confirm("Are you sure you want to delete this user?")) {
                deleteMutation.mutate(user.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (user: User) => (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-900">{user.username}</p>
            <p className="text-xs text-slate-500">
              Created {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="gap-1">
          {user.role === "admin" ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
          {user.role}
        </Badge>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(user)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            if (confirm("Are you sure?")) {
              deleteMutation.mutate(user.id);
            }
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" /> Users Management
            </h2>
            <p className="text-slate-500 mt-1">Manage administrative and standard user accounts.</p>
          </div>

          <ResponsiveDialog
            open={isOpen}
            onOpenChange={(val) => {
              setIsOpen(val);
              if (!val) resetForm();
            }}
            trigger={
              <Button className="gap-2 w-full sm:w-auto">
                <UserPlus className="w-4 h-4" /> Add User
              </Button>
            }
            title={editingUser ? "Edit User" : "Create New User"}
            onSave={handleSubmit}
            saveLabel={editingUser ? "Update User" : "Create User"}
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {!editingUser && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="At least 8 characters"
                      required={!editingUser}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="Re-enter password"
                      required={!editingUser}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600 font-medium">{passwordError}</p>
                  )}
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(val: any) => setRole(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ResponsiveDialog>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <ResponsiveTable
            columns={columns}
            data={users}
            keyField="id"
            isLoading={isLoading}
            isEmpty={users.length === 0}
            emptyMessage="No users found"
            renderMobileCard={renderMobileCard}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
