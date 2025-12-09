import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/general/components/ui/dialog';
import type { Role } from '@/api/roleService';
import { Briefcase, Users, FolderOpen, ClipboardList, Info, Building2 } from 'lucide-react';

interface RoleDetailModalProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDetailModal({ role, open, onOpenChange }: RoleDetailModalProps) {
  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{role.category}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Building2 size={14} />
                <span>{role.subcategory}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Owners */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users size={16} />
              <span className="text-sm font-medium">Owners</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.owners.map((owner, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {owner}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FolderOpen size={16} />
                <span className="text-sm">Responsables</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{role.owners.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ClipboardList size={16} />
                <span className="text-sm">Funciones</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{role.duties.length}</p>
            </div>
          </div>

          {/* Duties List */}
          {role.duties.length > 0 && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <ClipboardList size={16} />
                <span className="text-sm font-medium">Funciones del Rol</span>
              </div>
              <ul className="space-y-1">
                {role.duties.map((duty, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{duty}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Info size={16} />
              <span className="text-sm font-medium">Descripción</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{role.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}