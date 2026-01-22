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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/auth/hooks/useAuth";
import Modeler from 'bpmn-js/lib/Modeler';
import { createLinkedTask } from '../../../api/artefactService';




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
  const { role, company } = useAuth();

  // Permissions
  const canEdit = role === 'administrador' || role === 'arquitecto';
  const canImport = role === 'administrador';

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
    const url = "/process-viewer/" + idart;
    navigate(url);
  };

  const handleNew = () => {
    setSelectedProceso(undefined);
    setFormOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ file: File; procesoId: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = (procesoId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.dataset.procesoId = procesoId;
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const procesoId = event.target.dataset.procesoId;

    if (file && procesoId) {
      setPendingFile({ file, procesoId });
      setConfirmOpen(true);
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        // 1. Process Metadata using BPMN Modeler
        const tempContainer = document.createElement('div');
        const modeler = new Modeler({ container: tempContainer });

        try {
          await modeler.importXML(content);
          const elementRegistry = modeler.get('elementRegistry');
          const allElements = elementRegistry.getAll();

          // Filter and process elements
          const processableElements = allElements.filter((element: any) => {
            const type = element.type;
            return (
              type.includes('Task') ||
              type.includes('SubProcess')
            ) && element.type !== 'bpmn:Process';
          });

          for (const element of processableElements) {
            const businessObject = element.businessObject;
            const name = businessObject.name || '';
            const description = businessObject.documentation?.[0]?.text || '';

            // Only process if it has a name (or valid ID?) - sticking to name as per ModelProcessPage fallback logic
            if (name) {
              let subcategoryAux = "task";
              let subtypeAux = "Tarea";

              if (element.type.includes('Task')) {
                subcategoryAux = "task";
                subtypeAux = "Tarea";
              } else if (element.type.includes('SubProcess')) {
                subcategoryAux = "subprocess";
                subtypeAux = "Subproceso"; // Or "Proceso"? ModelProcessPage uses "Proceso" for SubProcess, let's Verify.
                // ModelProcessPage line 113: subtypeAux = "Proceso";
                // However, user said "createLinkedTask... for components of type task and subprocess".
                // I will use "Subproceso" to be specific, or "Proceso" if that's the convention.
                // Let's check ModelProcessPage again. It says 'Proceso'. I will use 'Proceso' to match existing logic.
                subtypeAux = "Proceso";
              }
              console.log("Processing process:", pendingFile.procesoId);
              console.log("Processing element name:", name);
              console.log("Processing element description:", description);
              console.log("Processing element type:", element.type);
              console.log("Processing element subtype:", subtypeAux);
              console.log("Processing element subcategory:", subcategoryAux);
              console.log("Processing element version:", "1.0");
              console.log("Processing element company:", company);
              console.log("Processing element owner:", "System");
              console.log("Processing element state:", "active");
              console.log("Processing element objetive:", description);
              console.log("Processing element range:", "local");
              console.log("Processing element idart:", pendingFile.procesoId);
              await createLinkedTask({
                name: name,
                description: description,
                type: element.type,
                level: 1,
                subtype: subtypeAux,
                alias: name,
                category: "process",
                subcategory: subcategoryAux,
                version: "1.0",
                company: company || "",
                owner: "System", // Or current user? ModelProcessPage used data.owner. Here we default.
                state: "active",
                objetive: name,
                range: "local",
                idart: pendingFile.procesoId
              });
            }
          }
          console.log(`Processed ${processableElements.length} elements for metadata.`);

        } catch (parseError) {
          console.error("Error parsing BPMN for metadata:", parseError);
          // Continue to save diagram even if metadata extraction fails?
          // Better to warn but try to save the visual diagram.
        } finally {
          modeler.destroy();
        }

        // 2. Update Diagram XML
        const diagrams: any = await getDiagramsActions(pendingFile.procesoId);
        const diagramId = Array.isArray(diagrams) && diagrams.length > 0 ? diagrams[0].id : (diagrams?.id);

        if (diagramId) {
          await patchDiagramActions(diagramId, content);
          CustomToast({ title: "Modelo Importado", description: "El modelo y sus metadatos han sido actualizados." });
        } else {
          CustomToast({ title: "Error", description: "No se encontró un diagrama asociado para actualizar." });
        }
      } catch (error) {
        console.error("Error importing model:", error);
        CustomToast({ title: "Error", description: "Ocurrió un error al importar el modelo." });
      } finally {
        setConfirmOpen(false);
        setPendingFile(null);
      }
    };
    reader.readAsText(pendingFile.file);
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
          canEdit && (
            <Button className="gap-2 bg-indigo-800" onClick={handleNew}>
              <Plus className="h-4 w-4" />
              Nuevo Proceso
            </Button>
          )
        }
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".bpmn,.xml"
        onChange={handleFileSelect}
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
                      {canImport && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImportClick(proceso.id)}
                          className="h-2 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          title="Importar Modelo"
                        >
                          <Upload className="h-2 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleGraph(proceso)}
                        className="h-2 w-8 text-green-500 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                        title="Visualizar Modelo"
                      >
                        <Eye className="h-2 w-4" />
                      </Button>
                      {canEdit && (
                        <>
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
                            onClick={() => handleDelete(proceso.id)}
                            className="h-2 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                            <Trash className="h-2 w-4" />
                          </Button>
                        </>
                      )}
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

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Importación</DialogTitle>
            <DialogDescription>
              Se importará el archivo <strong>{pendingFile?.file.name}</strong>.
              <br />
              Esta acción sobrescribirá el diagrama actual del proceso. ¿Desea continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirmImport}>Importar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
