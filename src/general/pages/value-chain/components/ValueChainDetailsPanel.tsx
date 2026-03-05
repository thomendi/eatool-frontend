import type { Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { useNavigate } from 'react-router';
import { getArtefactsSubtypeListActions } from '@/general/actions/get-artefacts-subtype-list.actions';

interface ValueChainDetailsPanelProps {
    selectedNode: Node | null;
}

export const ValueChainDetailsPanel = ({ selectedNode }: ValueChainDetailsPanelProps) => {
    const navigate = useNavigate();

    const handleOpenSubProcess = async () => {
        if (!selectedNode) return;

        const name = (selectedNode.data.label as string)?.trim();
        if (name) {
            try {
                // Find linked process by name
                const response = await getArtefactsSubtypeListActions('Proceso');
                const targetProcess = response.artefacts.find(a => a.name === name);

                if (targetProcess) {
                    if (targetProcess.type === 'ValueChain') {
                        navigate('/value-chain-viewer/' + targetProcess.id, { state: { from: 'model' } });
                    } else {
                        navigate('/process-viewer/' + targetProcess.id, { state: { from: 'model' } });
                    }
                } else {
                    alert("No se encontró el proceso vinculado: " + name);
                }
            } catch (e) {
                console.error("Error finding linked process", e);
                alert("Error al buscar el proceso vinculado.");
            }
        }
    };

    return (
        <Card className="h-full border-l rounded-none border-border/50 shadow-sm overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Detalles del Objeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {selectedNode ? (
                    <>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</label>
                            <div className="text-base font-medium">{selectedNode.data.label as string || '-'}</div>
                        </div>

                        {selectedNode.type === 'process' && (
                            <Button
                                onClick={handleOpenSubProcess}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Ver Subproceso
                            </Button>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identificador (ID)</label>
                            <div className="text-sm font-mono bg-muted p-1 rounded break-all">{selectedNode.id}</div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</label>
                            <div className="text-sm text-muted-foreground capitalize">{selectedNode.type}</div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descripción</label>
                            <div
                                className="text-base whitespace-pre-wrap leading-relaxed description-html [&_*]:!text-base"
                                dangerouslySetInnerHTML={{
                                    __html: (selectedNode.data.description as string) || '<span class="text-muted-foreground italic">Sin descripción disponible.</span>'
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
    );
};
