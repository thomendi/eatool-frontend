import { useState, useEffect } from "react";
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
import { createApplication, updateApplication } from "@/api/applicationService"; // <-- BACKEND

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (application: Application) => void; // <-- tipo correcto
  applicationToEdit?: Application | null;
}

export function AddApplicationModal({
  open,
  onOpenChange,
  onAdd,
  applicationToEdit,
}: AddApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    developer: "",
    activeUsers: "",
    status: "active" as "active" | "maintenance" | "deprecated",
    description: "",
    os: "",
    language: "",
    framework: "",
    security: "",
    type: "",
    priority: "",
  });

  useEffect(() => {
    if (applicationToEdit && open) {
      setFormData({
        name: applicationToEdit.name,
        version: applicationToEdit.version,
        developer: applicationToEdit.developer,
        activeUsers: applicationToEdit.activeUsers.toString(),
        status: applicationToEdit.status,
        description: applicationToEdit.description || "",
        os: applicationToEdit.os || "",
        language: applicationToEdit.language || "",
        framework: applicationToEdit.framework || "",
        security: applicationToEdit.security || "",
        type: applicationToEdit.type || "",
        priority: applicationToEdit.priority || "",
      });
    } else if (!open) {
      // Reset form when closing, but only if not editing or clear it?
      // Better to clear it so next open is fresh if it's new
      if (!applicationToEdit) {
        setFormData({
          name: "",
          version: "",
          developer: "",
          activeUsers: "",
          status: "active",
          description: "",
          os: "",
          language: "",
          framework: "",
          security: "",
          type: "",
          priority: "",
        });
      }
    }
  }, [applicationToEdit, open]);

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
        description: formData.description,
        os: formData.os,
        language: formData.language,
        framework: formData.framework,
        security: formData.security,
        type: formData.type,
        priority: formData.priority,
      };

      // Creamos o actualizamos en backend
      let resultApp: Application;

      if (applicationToEdit && applicationToEdit.id) {
        resultApp = await updateApplication(applicationToEdit.id, payload);
        toast.success("Aplicación actualizada exitosamente");
      } else {
        resultApp = await createApplication(payload);
        toast.success("Aplicación agregada exitosamente");
      }

      // El backend devuelve el objeto final → lo agregamos a la lista del front
      onAdd(resultApp);

      // Limpiar formulario
      setFormData({
        name: "",
        version: "",
        developer: "",
        activeUsers: "",
        status: "active",
        description: "",
        os: "",
        language: "",
        framework: "",
        security: "",
        type: "",
        priority: "",
      });

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(applicationToEdit ? "Error al actualizar la aplicación" : "Error al crear la aplicación");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{applicationToEdit ? 'Editar Aplicación' : 'Agregar Nueva Aplicación'}</DialogTitle>
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
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la aplicación"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="os">Sistema Operativo</Label>
              <Input
                id="os"
                placeholder="Ej. Windows, Linux"
                value={formData.os}
                onChange={(e) =>
                  setFormData({ ...formData, os: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Lenguaje</Label>
              <Input
                id="language"
                placeholder="Ej. Java, Python"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <Input
                id="framework"
                placeholder="Ej. Spring Boot, Django"
                value={formData.framework}
                onChange={(e) =>
                  setFormData({ ...formData, framework: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                placeholder="Ej. Web, Desktop"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="security">Seguridad</Label>
              <Input
                id="security"
                placeholder="Nivel de seguridad"
                value={formData.security}
                onChange={(e) =>
                  setFormData({ ...formData, security: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Input
                id="priority"
                placeholder="Alta, Media, Baja"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
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
            <Button type="submit">{applicationToEdit ? 'Modificar' : 'Agregar Aplicación'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
