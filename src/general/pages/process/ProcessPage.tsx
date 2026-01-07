import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { Button } from "@/general/components/ui/button";
import { Plus, Pencil, Trash, Upload, Eye } from "lucide-react";
import { useState, useRef } from "react";
import { ProcessForm } from "./ProcessForm";
import { useArtefacts } from "@/general/hooks/useArtefacts";
import type { Artefact } from '../../../interfaces/artefacts.response';
import { useNavigate } from "react-router";
import { deleteArtefactActions } from "@/general/actions/delete-artefact.actions";
import { patchDiagramActions } from "@/general/actions/patch-diagram.actions";
import { getDiagramsActions } from "@/general/actions/get-diagrams-actions";
import { useQueryClient } from "@tanstack/react-query";
import { CustomToast } from "@/general/components/CustomToast";




const mockProcesos = [
  { id: 1, nombre: "Gestión de Ventas", categoria: "Comercial", estado: "Activo", propietario: "María García" },
  { id: 2, nombre: "Reclutamiento", categoria: "RRHH", estado: "Activo", propietario: "Juan Pérez" },
  { id: 3, nombre: "Compras", categoria: "Operaciones", estado: "En Revisión", propietario: "Ana López" },
  { id: 4, nombre: "Facturación", categoria: "Finanzas", estado: "Activo", propietario: "Carlos Ruiz" },
  { id: 5, nombre: "Soporte al Cliente", categoria: "Servicio", estado: "Activo", propietario: "Laura Martín" },
];
export const ProcessPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const { data } = useArtefacts('Proceso');
  const process = data?.artefacts || [];
  const [selectedProceso, setSelectedProceso] = useState<Artefact | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importingId, setImportingId] = useState<string | null>(null);

  const handleView = (proceso: Artefact) => {
    navigate(`/process-viewer/${proceso.id}`);
  };

  const handleEdit = (proceso: Artefact) => {
    setSelectedProceso(proceso);
    setFormOpen(true);
  };
  const handleGraph = (proceso: Artefact) => {
    const idart = proceso.id;
    const url = "/modelsView/" + idart;
    navigate(url);
  };

  const handleNew = () => {
    setSelectedProceso(undefined);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este proceso?")) {
      try {
        await deleteArtefactActions(id);
        CustomToast({ title: "Proceso eliminado", description: "El proceso ha sido eliminado correctamente" });
        queryClient.invalidateQueries({ queryKey: ['artefacts'] });
      } catch (error) {
        console.error("Error al eliminar el proceso:", error);
        CustomToast({ title: "Error", description: "No se pudo eliminar el proceso" });
      }
    }
  };

  const handleImportClick = (procesoId: string) => {
    setImportingId(procesoId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !importingId) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        // Get existing diagram ID
        const diagrams: any = await getDiagramsActions(importingId);
        const diagramId = Array.isArray(diagrams) && diagrams.length > 0 ? diagrams[0].id : (diagrams?.id);

        if (diagramId) {
          await patchDiagramActions(diagramId, content);
          CustomToast({ title: "Modelo Importado", description: "El modelo BPMN ha sido actualizado correctamente." });
        } else {
          CustomToast({ title: "Error", description: "No se encontró un diagrama asociado para actualizar." });
        }
      } catch (error) {
        console.error("Error importing model:", error);
        CustomToast({ title: "Error", description: "Ocurrió un error al importar el modelo." });
      } finally {
        setImportingId(null);
      }
    };
    reader.readAsText(file);
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
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".bpmn,.xml"
        onChange={handleFileChange}
      />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-4">
          {process.map((proceso) => (
            <Card key={proceso.id} className="hover:shadow-md transition-shadow border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{proceso.name}</CardTitle>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${proceso.state === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                    >
                      {proceso.state}
                    </span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleGraph(proceso)}
                        className="h-2 w-8">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          MODELO
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(proceso)}
                        className="h-2 w-8">
                        <Pencil className="h-2 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Importar Modelo"
                        onClick={() => handleImportClick(proceso.id)}
                        className="h-2 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                        <Upload className="h-2 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Visualizar"
                        onClick={() => handleView(proceso)}
                        className="h-2 w-8 text-purple-500 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                        <Eye className="h-2 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(proceso.id)}
                        className="h-2 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                        <Trash className="h-2 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="content-start items-start">
                <div className="py-0">
                  <span>{proceso.description}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="ml-2 font-medium text-foreground">{proceso.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Propietario:</span>
                    <span className="ml-2 font-medium text-foreground">{proceso.owner}</span>
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
