import { AppWindow, Users, TrendingUp, Eye } from "lucide-react";
import type { Application } from "@/api/applicationService";  // <-- CAMBIADO
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
  onView: () => void;
}

export function ApplicationCard({ application, onClick, onView }: ApplicationCardProps) {
  const statusColors = {
    active: "bg-success/10 text-success",
    maintenance: "bg-warning/10 text-warning",
    deprecated: "bg-destructive/10 text-destructive",
  };

  const statusLabels = {
    active: "Activo",
    maintenance: "Mantenimiento",
    deprecated: "Deprecado",
  };

  return (
    <div
      onClick={onClick}
      className="app-card p-6 group border border-border/50 rounded-xl
             transition-all duration-300
             hover:shadow-lg hover:border-primary/30 cursor-pointer relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <AppWindow className="w-6 h-6 text-primary" />
        </div>

        <div className="flex items-center gap-2">
          <span className={cn("stat-badge", statusColors[application.status])}>
            {statusLabels[application.status]}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="Ver detalles y modelo"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
        {application.name}
      </h3>

      <p className="text-sm text-muted-foreground mb-4">v{application.version}</p>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />
          <span className="text-sm">{application.activeUsers} usuarios</span>
        </div>
        <div className="flex items-center gap-1 text-success text-sm">
          <TrendingUp size={14} />
          <span>+{Math.floor(Math.random() * 15) + 1}%</span>
        </div>
      </div>
    </div>
  );
}
