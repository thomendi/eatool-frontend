import { useEffect, useState } from "react";
import { ApplicationCard } from "@/general/components/applications/ApplicationCard";
import { ApplicationDetailModal } from "@/general/components/applications/ApplicationDetailModal";
import { AddApplicationModal } from "@/general/components/applications/AddApplicationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AppWindow } from "lucide-react";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { getApplications, type Application } from "@/api/applicationService";

export const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --------------------------
  // Load Applications from API
  // --------------------------
  useEffect(() => {
    const loadApps = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err) {
        console.error("Error loading apps:", err);
      }
    };

    loadApps();
  }, []);

  // Search filter
  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --------------------------
  // Add or Update application
  // --------------------------
  const handleSaveApplication = (app: Application) => {
    if (editingApp) {
      // Update existing application
      setApplications((prev) =>
        prev.map((item) => (item.id === app.id ? app : item))
      );
    } else {
      // Add new application
      setApplications((prev) => [app, ...prev]);
    }
  };

  const handleCardClick = (app: Application) => {
    setEditingApp(app);
    setIsAddOpen(true);
  };

  const totalUsers = applications.reduce((sum, app) => sum + app.activeUsers, 0);
  const activeApps = applications.filter((app) => app.status === "active").length;

  return (
    <div className="min-h-screen">
      <CustomPageHeader
        title="Aplicaciones"
        description="Control y gestión de aplicaciones usadas por la empresa"
        action={
          <Button className="gap-2 bg-indigo-800" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Nueva Aplicación
          </Button>
        }
      />

      <div className="container mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Aplicaciones</span>
              <AppWindow size={18} className="text-primary" />
            </div>
            <p className="text-3xl font-bold mt-2">{applications.length}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Apps Activas</span>
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <p className="text-3xl font-bold mt-2">{activeApps}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Usuarios Totales</span>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <p className="text-3xl font-bold mt-2">{totalUsers}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">En Mantenimiento</span>
              <div className="w-3 h-3 rounded-full bg-warning" />
            </div>
            <p className="text-3xl font-bold mt-2">
              {applications.filter((app) => app.status === "maintenance").length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar aplicaciones..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Application Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => handleCardClick(app)}
            />
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <AppWindow className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron aplicaciones</p>
          </div>
        )}

        {/* Modals */}
        <ApplicationDetailModal
          application={selectedApp}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />

        <AddApplicationModal
          open={isAddOpen}
          onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) setEditingApp(null);
          }}
          onAdd={handleSaveApplication}
          applicationToEdit={editingApp}
        />
      </div>
    </div>
  );
};
