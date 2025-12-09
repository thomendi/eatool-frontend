import { useEffect, useState } from "react";
import { Plus, AppWindow, Building2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleCard } from "@/general/components/roles/RoleCard";
import { RoleDetailModal } from "@/general/components/roles/RoleDetailModal";
import { AddRoleModal } from "@/general/components/roles/AddRoleModal";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { getRoles, type Role } from "@/api/roleService";

export const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        console.error("Error loading roles:", err);
      }
    };
    load();
  }, []);

  const handleAddRole = (newRole: Role) => {
    // insertar al inicio
    setRoles(prev => [newRole, ...prev]);
  };

  const handleCardClick = (role: Role) => {
    setSelectedRole(role);
    setIsDetailOpen(true);
  };

  const totalResponsibles = roles.reduce((sum, r) => sum + (r.owners?.length || 0), 0);
  const totalDuties = roles.reduce((sum, r) => sum + (r.duties?.length || 0), 0);

  return (
    <div className="min-h-screen">
      <CustomPageHeader
        title="Roles y Funciones"
        description="Gestión de roles organizacionales y responsabilidades"
        action={
          <Button className="gap-2 bg-indigo-800" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo Rol
          </Button>
        }
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Roles</span>
              <AppWindow size={18} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground mt-2">{roles.length}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Responsables</span>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground mt-2">{totalResponsibles}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Funciones</span>
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground mt-2">{totalDuties}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <RoleCard key={role.id} role={role} onClick={() => handleCardClick(role)} />
          ))}
        </div>

        <RoleDetailModal role={selectedRole} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
        <AddRoleModal open={isAddOpen} onOpenChange={setIsAddOpen} onAdd={handleAddRole} />
      </div>
    </div>
  );
};
