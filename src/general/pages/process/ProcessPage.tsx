import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import  { Button } from "@/general/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { ProcessForm } from "./ProcessForm";



const mockProcesos = [
  { id: 1, nombre: "Gestión de Ventas", categoria: "Comercial", estado: "Activo", propietario: "María García" },
  { id: 2, nombre: "Reclutamiento", categoria: "RRHH", estado: "Activo", propietario: "Juan Pérez" },
  { id: 3, nombre: "Compras", categoria: "Operaciones", estado: "En Revisión", propietario: "Ana López" },
  { id: 4, nombre: "Facturación", categoria: "Finanzas", estado: "Activo", propietario: "Carlos Ruiz" },
  { id: 5, nombre: "Soporte al Cliente", categoria: "Servicio", estado: "Activo", propietario: "Laura Martín" },
];
export const ProcessPage = () => { 
    const [formOpen, setFormOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState<typeof mockProcesos[0] | undefined>();

  const handleEdit = (proceso: typeof mockProcesos[0]) => {
    setSelectedProceso(proceso);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedProceso(undefined);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen">
      <CustomPageHeader
        title="Procesos de Negocio"
        description="Gestión y documentación de procesos empresariales"
        action={
          <Button className="gap-2 bg-indigo-800" onClick={handleNew}>
            <Plus className="h-4 w-4" />
            Nuevo Proceso
          </Button>
        }
      />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-4">
          {mockProcesos.map((proceso) => (
            <Card key={proceso.id} className="hover:shadow-md transition-shadow border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{proceso.nombre}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proceso.estado === "Activo"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {proceso.estado}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(proceso)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="ml-2 font-medium text-foreground">{proceso.categoria}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Propietario:</span>
                    <span className="ml-2 font-medium text-foreground">{proceso.propietario}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ProcessForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        proceso={selectedProceso}
      />
    </div>
  );
}
