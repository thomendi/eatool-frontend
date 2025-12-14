import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/general/components/ui/dialog';
import { Badge } from '@/general/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { riskService } from '@/api/riskService';
import { type Risk } from '@/api/riskService';
import { AlertTriangle, Target, Percent, Tag, FileText, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskDetailModalProps {
  risk: Risk | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (risk: Risk) => void;
  onDeleted: (id: number) => void;
}

const levelColors = {
  Bajo: 'bg-green-100 text-green-700',
  Medio: 'bg-yellow-100 text-yellow-700',
  Alto: 'bg-orange-100 text-orange-700',
  Crítico: 'bg-red-100 text-red-700',
};

export function RiskDetailModal({
  risk,
  open,
  onOpenChange,
  onUpdated,
  onDeleted,
}: RiskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Risk | null>(null);

  useEffect(() => {
    if (risk) {
      setFormData(risk);
      setIsEditing(false);
    }
  }, [risk]);

  if (!risk || !formData) return null;

  const handleSave = async () => {
    const updated = await riskService.update(risk.id, {
      name: formData.name,
      category: formData.category,
      type: formData.type,
      impact: formData.impact,
      probability: formData.probability,
      level: formData.level,
      description: formData.description,
    });

    onUpdated(updated);
    onOpenChange(false);
  };
  const handleDelete = async () => {
  if (!risk) return;

  const confirmed = window.confirm(
    '¿Estás seguro de que deseas eliminar este riesgo? Esta acción no se puede deshacer.'
  );

  if (!confirmed) return;

  await riskService.remove(risk.id);

  onDeleted(risk.id);
  onOpenChange(false);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            {isEditing ? 'Editar Riesgo' : risk.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* CATEGORÍA */}
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Categoría:</span>
            {isEditing ? (
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            ) : (
              <span className="text-sm font-medium">{risk.category}</span>
            )}
          </div>

          {/* TIPO */}
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tipo:</span>
            {isEditing ? (
              <Input
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
            ) : (
              <span className="text-sm font-medium">{risk.type}</span>
            )}
          </div>

          {/* IMPACTO */}
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Impacto:</span>
            {isEditing ? (
              <Select
                value={formData.impact}
                onValueChange={(v) =>
                  setFormData({ ...formData, impact: v as Risk['impact'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Bajo', 'Medio', 'Alto', 'Crítico'].map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {risk.impact}
              </Badge>
            )}
          </div>

          {/* PROBABILIDAD */}
          <div className="flex items-center gap-3">
            <Percent className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Probabilidad:</span>
            {isEditing ? (
              <Select
                value={formData.probability}
                onValueChange={(v) =>
                  setFormData({ ...formData, probability: v as Risk['probability'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Baja', 'Media', 'Alta'].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {risk.probability}
              </Badge>
            )}
          </div>

          {/* NIVEL */}
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Nivel:</span>
            {isEditing ? (
              <Select
                value={formData.level}
                onValueChange={(v) =>
                  setFormData({ ...formData, level: v as Risk['level'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Bajo', 'Medio', 'Alto', 'Crítico'].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge className={cn(levelColors[risk.level])}>{risk.level}</Badge>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-muted-foreground mt-1" />
            {isEditing ? (
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            ) : (
              <p className="text-sm">{risk.description}</p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between">
  <Button
    variant="destructive"
    onClick={handleDelete}
    disabled={isEditing}
  >
    Eliminar
  </Button>

  {isEditing ? (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setIsEditing(false)}>
        Cancelar
      </Button>
      <Button onClick={handleSave}>Guardar</Button>
    </div>
  ) : (
    <Button onClick={() => setIsEditing(true)}>Editar</Button>
  )}
</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
