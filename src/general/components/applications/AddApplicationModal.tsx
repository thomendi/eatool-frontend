import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/general/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import type { Application } from "@/api/applicationService"; // <-- CAMBIADO
import { createApplication } from "@/api/applicationService"; // <-- BACKEND

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (application: Application) => void; // <-- tipo correcto
}

export function AddApplicationModal({
  open,
  onOpenChange,
  onAdd,
}: AddApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    developer: "",
    activeUsers: "",
    status: "active" as "active" | "maintenance" | "deprecated",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.version || !formData.developer) {
      toast.error("Por favor complete los campos requeridos");
      return;
    }

    try {
      // Lo que enviamos al backend
      const payload = {
        name: formData.name,
        version: formData.version,
        developer: formData.developer,
        activeUsers: Number(formData.activeUsers) || 0,
        status: formData.status,
      };

      // Creamos en backend
      const created = await createApplication(payload);

      // El backend devuelve el objeto final → lo agregamos a la lista del front
      onAdd(created);

      toast.success("Aplicación agregada exitosamente");

      // Limpiar formulario
      setFormData({
        name: "",
        version: "",
        developer: "",
        activeUsers: "",
        status: "active",
      });

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la aplicación");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Aplicación</DialogTitle>
          <DialogDescription>
            Complete la información de la nueva aplicación.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                placeholder="Nombre de la aplicación"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Versión *</Label>
              <Input
                id="version"
                placeholder="1.0.0"
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developer">Empresa *</Label>
              <Input
                id="developer"
                placeholder="Nombre de la empresa"
                value={formData.developer}
                onChange={(e) =>
                  setFormData({ ...formData, developer: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activeUsers">Usuarios Activos</Label>
              <Input
                id="activeUsers"
                type="number"
                placeholder="0"
                value={formData.activeUsers}
                onChange={(e) =>
                  setFormData({ ...formData, activeUsers: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "maintenance" | "deprecated") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                <SelectItem value="deprecated">Deprecado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Agregar Aplicación</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
