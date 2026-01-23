import { useEffect, useState } from 'react';
import type { Node } from '@xyflow/react';
import { X } from 'lucide-react';

interface PropertiesPanelProps {
    selectedNode: Node | null;
    onUpdateNode: (id: string, data: Record<string, unknown>) => void;
    onClose: () => void;
}

export const PropertiesPanel = ({ selectedNode, onUpdateNode, onClose }: PropertiesPanelProps) => {
    const [formData, setFormData] = useState({
        label: '',
        description: '',
        mission: '',
        objective: '',
    });

    useEffect(() => {
        if (selectedNode) {
            setFormData({
                label: (selectedNode.data.label as string) || '',
                description: (selectedNode.data.description as string) || '',
                mission: (selectedNode.data.mission as string) || '',
                objective: (selectedNode.data.objective as string) || '',
            });
        }
    }, [selectedNode]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (selectedNode) {
            onUpdateNode(selectedNode.id, { ...selectedNode.data, [field]: value });
        }
    };

    if (!selectedNode) return null;

    return (
        <aside className="h-full w-full bg-background border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Propiedades</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Nombre</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={formData.label}
                        onChange={(e) => handleChange('label', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Descripción</label>
                    <textarea
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Misión</label>
                    <textarea
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                        value={formData.mission}
                        onChange={(e) => handleChange('mission', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Objetivo</label>
                    <textarea
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                        value={formData.objective}
                        onChange={(e) => handleChange('objective', e.target.value)}
                    />
                </div>

                <div className="pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                        ID: <span className="font-mono text-[10px]">{selectedNode.id}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Tipo: <span className="capitalize">{selectedNode.type}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
