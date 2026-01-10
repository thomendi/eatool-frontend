import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import BpmnViewer from '../../components/BpmnViewer';
import { getDiagramByIdart } from '../../../api/diagramService';
import { getArtefactByIdActions } from '@/general/actions/get-artefact-by-id.actions';
import { getArtefactsSubtypeListActions } from '@/general/actions/get-artefacts-subtype-list.actions';
import type { Artefact } from '@/interfaces/artefacts.response';
import { ArrowLeft } from "lucide-react";

export const ProcessViewerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState<string | undefined>(id);
    const [diagramXml, setDiagramXml] = useState<string>("");
    const [processArtefact, setProcessArtefact] = useState<Artefact | null>(null);
    const [selectedElement, setSelectedElement] = useState<any>(null);
    const [history, setHistory] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (currentId) {
            loadData(currentId);
        }
    }, [currentId]);

    const loadData = async (targetId: string) => {
        try {
            // Load Artefact Details
            const artefact = await getArtefactByIdActions(targetId);
            setProcessArtefact(artefact);

            // Set default selected element to the process itself
            setSelectedElement({
                id: artefact.id,
                name: artefact.name,
                description: artefact.description,
                type: 'Process'
            });

            // Load Diagram
            const diagrams = await getDiagramByIdart(targetId);
            if (diagrams.length > 0) {
                setDiagramXml(diagrams[0].diagram);
            } else {
                setDiagramXml("");
            }
        } catch (error) {
            console.error("Error loading process data", error);
        }
    };

    const handleElementClick = (element: any) => {
        const businessObject = element.businessObject;
        setSelectedElement({
            id: businessObject.id,
            name: businessObject.name || "Sin Nombre",
            description: businessObject.documentation?.[0]?.text || "Sin Descripción",
            type: element.type
        });
    };

    const handleOpenSubProcess = async () => {
        if (!selectedElement) return;

        const name = selectedElement.name?.trim();
        if (name) {
            try {
                // Find linked process by name
                const response = await getArtefactsSubtypeListActions('Proceso');
                const targetProcess = response.artefacts.find(a => a.name === name);

                if (targetProcess) {
                    // Push current to history
                    if (processArtefact && currentId) {
                        setHistory(prev => [...prev, { id: currentId, name: processArtefact.name }]);
                    }
                    setCurrentId(targetProcess.id.toString());
                } else {
                    alert("No se encontró el proceso vinculado: " + name);
                }
            } catch (e) {
                console.error("Error finding linked process", e);
            }
        }
    };

    const handleGoBack = () => {
        if (history.length > 0) {
            const previous = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            setCurrentId(previous.id);
        } else {
            navigate('/process');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CustomPageHeader
                title="Visualizador de Procesos"
                description={`Viendo: ${processArtefact?.name || '...'}`}
                action={
                    <Button variant="outline" onClick={handleGoBack} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {history.length > 0 ? "Volver al nivel superior" : "Volver a la lista"}
                    </Button>
                }
            />

            <div className="flex-1 container mx-auto px-4 py-4 h-full flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Main Diagram Area - 75% */}
                <Card className="flex-[3] border-border/50 shadow-sm flex flex-col h-[calc(100vh-140px)]">
                    <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {history.map((h) => (
                                <span key={h.id} className="flex items-center">
                                    <span className="cursor-pointer hover:underline" onClick={() => {
                                        // Logic to jump back to specific history point could go here
                                    }}>{h.name}</span>
                                    <span className="mx-2">/</span>
                                </span>
                            ))}
                            <span className="font-semibold text-foreground">{processArtefact?.name}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative bg-white overflow-hidden">
                        {diagramXml ? (
                            <BpmnViewer
                                xml={diagramXml}
                                onClick={handleElementClick}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No hay diagrama disponible para este proceso.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Details Sidebar - 25% */}
                <Card className="flex-1 border-border/50 shadow-sm h-[calc(100vh-140px)] overflow-y-auto">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-bold">Detalles del Objeto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {selectedElement ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</label>
                                    <div className="text-base font-medium">{selectedElement.name}</div>
                                </div>

                                {(selectedElement.type.includes('SubProcess') || selectedElement.type === 'bpmn:CallActivity') && (
                                    <Button
                                        onClick={handleOpenSubProcess}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Ver Subproceso
                                    </Button>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identificador (ID)</label>
                                    <div className="text-sm font-mono bg-muted p-1 rounded break-all">{selectedElement.id}</div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</label>
                                    <div className="text-sm text-muted-foreground">{selectedElement.type}</div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descripción</label>
                                    <div
                                        className="text-base whitespace-pre-wrap leading-relaxed description-html [&_*]:!text-base"
                                        dangerouslySetInnerHTML={{
                                            __html: selectedElement.description && selectedElement.description !== "Sin Descripción"
                                                ? selectedElement.description
                                                : '<span class="text-muted-foreground italic">Sin descripción disponible.</span>'
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-10">
                                Seleccione un elemento del diagrama para ver sus detalles.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
