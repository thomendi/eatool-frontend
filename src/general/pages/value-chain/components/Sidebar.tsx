import type { DragEvent } from 'react';

import { Layers, Activity, Grid } from 'lucide-react';

export const Sidebar = () => {
    const onDragStart = (event: DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow-label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-4 border-b border-sidebar-border">
                <h2 className="font-semibold text-sidebar-foreground flex items-center gap-2">
                    <Grid className="w-4 h-4" /> Componentes
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Arrastra elementos al lienzo</p>
            </div>

            <div className="p-4 flex flex-col gap-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Estructura</div>

                <div
                    className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded cursor-grab hover:bg-muted transition-colors"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'macroprocess', 'Nuevo Macroproceso')}
                >
                    <Layers className="w-5 h-5 text-primary" />
                    <div className="text-sm font-medium">Macroproceso</div>
                </div>

                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1 mt-2">Actividades</div>

                <div
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded cursor-grab hover:shadow-sm transition-all"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'process', 'Nuevo Proceso')}
                >
                    <Activity className="w-5 h-5 text-primary" />
                    <div className="text-sm font-medium">Proceso</div>
                </div>
            </div>
        </aside>
    );
};
