import { AlertTriangle } from 'lucide-react';
import type { Risk } from '@/api/riskService';
import { Badge } from '@/general/components/ui/badge';
import { cn } from '@/lib/utils';

interface RiskCardProps {
  risk: Risk;
  onClick: () => void;
}

const levelColors = {
  'Bajo': {
    bg: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-700 border-green-300',
    icon: 'text-green-600'
  },
  'Medio': {
    bg: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: 'text-yellow-600'
  },
  'Alto': {
    bg: 'bg-orange-50 border-orange-200',
    badge: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: 'text-orange-600'
  },
  'Crítico': {
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700 border-red-300',
    icon: 'text-red-600'
  }
};

export function RiskCard({ risk, onClick }: RiskCardProps) {
  const colors = levelColors[risk.level];

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-md animate-fade-in',
        colors.bg
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn('w-5 h-5', colors.icon)} />
          <h3 className="font-semibold text-amber-900">{risk.name}</h3>
        </div>
        <Badge variant="outline" className={cn('text-xs', colors.badge)}>
          {risk.level}
        </Badge>
      </div>
      
      <p className="text-sm text-amber-700 mb-3">{risk.category}</p>
      
      <div className="flex items-center gap-8">
        <div>
          <span className="text-sm text-muted-foreground">Impacto: </span>
          <span className="text-sm font-medium text-red-600">{risk.impact}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Probabilidad: </span>
          <span className="text-sm font-medium text-blue-600">{risk.probability}</span>
        </div>
      </div>
    </div>
  );
}
