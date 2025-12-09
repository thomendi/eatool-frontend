import { Users, Briefcase, FolderOpen, ClipboardList } from 'lucide-react';
import type { Role } from '@/api/roleService';

interface RoleCardProps {
  role: Role;
  onClick: () => void;
}

export function RoleCard({ role, onClick }: RoleCardProps) {
  return (
    <div 
      onClick={onClick}
      className="app-card p-6 group border border-border/50 rounded-xl 
             transition-all duration-300
             hover:shadow-lg hover:border-primary/30 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <span className="stat-badge bg-accent/10 text-accent-foreground">
          {role.subcategory}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
        {role.category}
      </h3>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Users size={14} />
        <span>{role.owners.slice(0, 2).join(', ')}{role.owners.length > 2 ? ` +${role.owners.length - 2}` : ''}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FolderOpen size={16} />
          <span className="text-sm">{role.owners.length} responsables</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClipboardList size={16} />
          <span className="text-sm">{role.duties.length} funciones</span>
        </div>
      </div>
    </div>
  );
}
