import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/general/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { riskService, type Risk } from '@/api/riskService';

interface AddRiskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (risk: Risk) => void;
}

const categories = ['TI', 'Seguridad', 'Operacional', 'Legal', 'RRHH', 'Financiero', 'Estratégico'];
const types = ['Tecnológico', 'Seguridad de la Información', 'Cadena de Suministro', 'Cumplimiento', 'Capital Humano', 'Mercado', 'Reputacional'];
const impacts: Risk['impact'][] = ['Bajo', 'Medio', 'Alto', 'Crítico'];
const probabilities: Risk['probability'][] = ['Baja', 'Media', 'Alta'];
const levels: Risk['level'][] = ['Bajo', 'Medio', 'Alto', 'Crítico'];

export function AddRiskModal({ open, onOpenChange, onAdd }: AddRiskModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: '',
    impact: '' as Risk['impact'],
    probability: '' as Risk['probability'],
    level: '' as Risk['level'],
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRisk = await riskService.create(formData);
    onAdd(newRisk);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Riesgo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Riesgo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Fuga de Datos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Riesgo</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="impact">Impacto</Label>
              <Select value={formData.impact} onValueChange={(value) => setFormData({ ...formData, impact: value as Risk['impact'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {impacts.map((imp) => (
                    <SelectItem key={imp} value={imp}>{imp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probabilidad</Label>
              <Select value={formData.probability} onValueChange={(value) => setFormData({ ...formData, probability: value as Risk['probability'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {probabilities.map((prob) => (
                    <SelectItem key={prob} value={prob}>{prob}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Nivel de Riesgo</Label>
            <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as Risk['level'] })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada del riesgo..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Añadir Riesgo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
