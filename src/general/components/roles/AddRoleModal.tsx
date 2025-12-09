import { useState } from 'react';
import { createRole } from '@/api/roleService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/general/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';
import type { Role } from '@/api/roleService';

interface AddRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (role: Role) => void;
}

export function AddRoleModal({ open, onOpenChange, onAdd }: AddRoleModalProps) {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: ''
  });
  const [owners, setOwners] = useState<string[]>(['']);
  const [duties, setDuties] = useState<string[]>(['']);

  const handleAddOwner = () => {
    setOwners([...owners, '']);
  };

  const handleRemoveOwner = (index: number) => {
    if (owners.length > 1) {
      setOwners(owners.filter((_, i) => i !== index));
    }
  };

  const handleOwnerChange = (index: number, value: string) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
  };

  const handleAddDuty = () => {
    setDuties([...duties, '']);
  };

  const handleRemoveDuty = (index: number) => {
    if (duties.length > 1) {
      setDuties(duties.filter((_, i) => i !== index));
    }
  };

  const handleDutyChange = (index: number, value: string) => {
    const newDuties = [...duties];
    newDuties[index] = value;
    setDuties(newDuties);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const validOwners = owners.filter(o => o.trim() !== '');
  const validDuties = duties.filter(d => d.trim() !== '');
  if (!formData.category || !formData.subcategory || validOwners.length === 0) {
    toast.error('Por favor complete los campos requeridos');
    return;
  }
  try {
    const payload = {
      owners: validOwners,
      category: formData.category,
      subcategory: formData.subcategory,
      duties: validDuties,
      description: formData.description,
    };
    const created = await createRole(payload);
    onAdd(created); // parent agrega al listado
    toast.success('Rol agregado exitosamente');
    // reset form...
    onOpenChange(false);
  } catch (error) {
    console.error(error);
    toast.error('Error al crear rol');
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Rol</DialogTitle>
          <DialogDescription>
            Complete la información del nuevo rol organizacional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Owners */}
          <div className="space-y-2">
            <Label>Owners *</Label>
            {owners.map((owner, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nombre del owner"
                  value={owner}
                  onChange={(e) => handleOwnerChange(index, e.target.value)}
                />
                {owners.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleRemoveOwner(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddOwner}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Agregar Owner
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría (Rol) *</Label>
              <Input
                id="category"
                placeholder="Ej: Gerente de Proyectos"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategoría (Departamento) *</Label>
              <Input
                id="subcategory"
                placeholder="Ej: Tecnología"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              />
            </div>
          </div>

          {/* Duties */}
          <div className="space-y-2">
            <Label>Funciones del Rol</Label>
            {duties.map((duty, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Descripción de la función"
                  value={duty}
                  onChange={(e) => handleDutyChange(index, e.target.value)}
                />
                {duties.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleRemoveDuty(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddDuty}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Agregar Función
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del rol..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Añadir Rol
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}