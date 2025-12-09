import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/general/components/ui/dialog';

import type { Application } from '@/api/applicationService'; 
import { AppWindow, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationDetailModalProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationDetailModal({ application, open, onOpenChange }: ApplicationDetailModalProps) {
  if (!application) return null;

  const statusColors = {
    active: 'bg-success/10 text-success',
    maintenance: 'bg-warning/10 text-warning',
    deprecated: 'bg-destructive/10 text-destructive'
  };

  const statusLabels = {
    active: 'Activo',
    maintenance: 'Mantenimiento',
    deprecated: 'Deprecado'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <AppWindow className="w-7 h-7 text-primary" />
            </div>

            <div>
              <DialogTitle className="text-xl">{application.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span>v{application.version}</span>
                <span className={cn("stat-badge", statusColors[application.status])}>
                  {statusLabels[application.status]}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          {/* Grid de datos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users size={16} />
                <span className="text-sm">Usuarios Activos</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {application.activeUsers}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Building2 size={16} />
                <span className="text-sm">Desarrollador</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {application.developer}
              </p>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
