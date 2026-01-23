import { Panel } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, Trash2, Save } from 'lucide-react';

interface EditorToolbarProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitView: () => void;
    onClear: () => void;
    onSave: () => void;
}

export const EditorToolbar = ({ onZoomIn, onZoomOut, onFitView, onClear, onSave }: EditorToolbarProps) => {
    return (
        <Panel position="top-right" className="flex gap-2">
            <div className="flex bg-card border border-border rounded-md shadow-sm overflow-hidden">
                <button onClick={onZoomIn} className="p-2 hover:bg-muted transition-colors" title="Zoom In">
                    <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-[1px] bg-border" />
                <button onClick={onZoomOut} className="p-2 hover:bg-muted transition-colors" title="Zoom Out">
                    <ZoomOut className="w-4 h-4" />
                </button>
                <div className="w-[1px] bg-border" />
                <button onClick={onFitView} className="p-2 hover:bg-muted transition-colors" title="Fit View">
                    <Maximize className="w-4 h-4" />
                </button>
            </div>

            <div className="flex bg-card border border-border rounded-md shadow-sm overflow-hidden">
                <button onClick={onClear} className="p-2 hover:bg-destructive/10 hover:text-destructive transition-colors" title="Limpiar Lienzo">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex bg-primary text-primary-foreground border border-primary rounded-md shadow-sm overflow-hidden">
                <button onClick={onSave} className="p-2 flex items-center gap-2 hover:bg-primary/90 transition-colors bg-primary font-medium text-xs px-3">
                    <Save className="w-4 h-4" />
                    Guardar XML
                </button>
            </div>
        </Panel>
    );
};
