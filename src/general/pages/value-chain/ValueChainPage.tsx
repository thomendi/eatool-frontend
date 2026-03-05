import { useCallback, useRef, useState, useEffect } from 'react';
import { useParams } from "react-router";
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    Background,
} from '@xyflow/react';
import type {
    Connection,
    Edge,
    Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Sidebar } from './components/Sidebar';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ValueChainDetailsPanel } from './components/ValueChainDetailsPanel';
import { nodeTypes } from './components/CustomNodes';
import { exportToXML, importFromXML } from './utils/xmlUtils';

// Services
import { insertDiagram, updateDiagram, getDiagramByIdart } from '@/api/diagramService';
import { createLinkedTask } from '@/api/artefactService';
import type { DiagramModel } from '@/interfaces/diagram';
import { useAuth } from '@/auth/hooks/useAuth';
import { CustomToast } from '@/general/components/CustomToast';

interface ValueChainPageProps {
    readOnly?: boolean;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Helper ID generator using crypto.randomUUID
const getId = () => `node_${crypto.randomUUID()}`;

const ValueChainFlow = ({ readOnly = false }: ValueChainPageProps) => {
    const { id } = useParams();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [diagramModel, setDiagramModel] = useState<DiagramModel | null>(null);
    const { company } = useAuth();

    // Load existing diagram
    useEffect(() => {
        if (!id) return;

        const loadDiagram = async () => {
            try {
                const items = await getDiagramByIdart(id);
                if (items.length > 0) {
                    const loadedModel = items[0];
                    setDiagramModel(loadedModel);
                    if (loadedModel.diagram) {
                        const { nodes: loadedNodes, edges: loadedEdges } = importFromXML(loadedModel.diagram);
                        setNodes(loadedNodes);
                        setEdges(loadedEdges);
                        setTimeout(() => fitView(), 100);
                    }
                }
            } catch (error) {
                console.error("Error loading diagram:", error);
            }
        };

        loadDiagram();
    }, [id, setNodes, setEdges, fitView]);


    // Update selectedNode when nodes change selection
    useEffect(() => {
        const selected = nodes.find((n) => n.selected);
        setSelectedNode(selected || null);
        // If selection is cleared (e.g. by backspace), close panel?
        // Let's keep it simple: if no node is selected, panel definitely closes.
        if (!selected) {
            setIsPanelOpen(false);
        }
    }, [nodes]);

    const onUpdateNode = useCallback((id: string, data: Record<string, unknown>) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, ...data } };
                }
                return node;
            })
        );
    }, [setNodes]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        // Just select, don't toggle panel
        setSelectedNode(node);
        setNodes((nds) => nds.map((n) => ({
            ...n,
            selected: n.id === node.id,
        })));
        // If panel was already open for another node, keep it open (React state preserves it)
    }, [setNodes]);

    const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setIsPanelOpen(true);
        console.log('YES Node double clicked:', node);
        setNodes((nds) => nds.map((n) => ({
            ...n,
            selected: n.id === node.id,
        })));
    }, [setNodes]);

    const onPaneClick = useCallback(() => {
        setIsPanelOpen(false);
        setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
        setSelectedNode(null);
    }, [setNodes]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/reactflow-label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label },
            };

            if (type === 'macroprocess') {
                newNode.className = 'light';
                newNode.style = { width: 300, height: 150 };
            }

            // Check parent intersection
            const parentNode = nodes.find((n) =>
                n.type === 'macroprocess' &&
                position.x >= n.position.x &&
                position.x <= n.position.x + (n.measured?.width || 300) &&
                position.y >= n.position.y &&
                position.y <= n.position.y + (n.measured?.height || 150)
            );

            if (parentNode && type === 'process') {
                newNode.parentId = parentNode.id;
                newNode.position = {
                    x: position.x - parentNode.position.x,
                    y: position.y - parentNode.position.y
                };
                newNode.extent = 'parent';
            }

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, nodes, setNodes],
    );

    const onSave = useCallback(async () => {
        if (!id) {
            alert("No se ha definido un ID para este modelo.");
            return;
        }

        const xml = exportToXML(nodes, edges);
        console.log('Exported XML:', xml);
        // downloadXML(xml); // Optional: keep download if needed, but primary is save to DB.

        // 1. Create Linked Tasks for each 'process' node
        const processNodes = nodes.filter(n => n.type === 'process');

        for (const node of processNodes) {
            try {
                const data = node.data as any;
                await createLinkedTask({
                    name: data.label || 'Unnamed Process',
                    description: data.description || '',
                    type: node.type || "process", // 'process'
                    level: 1,
                    subtype: "Proceso", // Fixed subtype
                    alias: data.label || 'Unnamed',
                    category: "process",
                    subcategory: "subprocess", // Using subprocess as per requirement/analogy
                    version: "1.0",
                    company: company || "",
                    owner: "User", // Placeholder or from context
                    state: "active",
                    objetive: data.objective || '',
                    range: data.mission || 'local', // Mapping mission to range as requested
                    idart: id || ""
                });
            } catch (error) {
                console.error(`Failed to save linked task for node ${node.id}:`, error);
            }
        }

        // 2. Save Diagram Model
        const payload: DiagramModel = {
            idart: id,
            name: diagramModel?.name || `Value Chain ${id}`,
            description: 'Guardado desde Value Chain Editor',
            version: '1.0',
            diagram: xml
        };

        try {
            if (diagramModel && diagramModel.id) {
                await updateDiagram(diagramModel.id, payload);
                CustomToast({ title: "Guardado", description: "Modelo actualizado correctamente" });
            } else {
                const newModel = await insertDiagram(payload);
                setDiagramModel(newModel); // Store the new model so subsequent saves are updates
                CustomToast({ title: "Guardado", description: "Modelo creado correctamente" });
            }
        } catch (error) {
            console.error("Error saving diagram:", error);
            alert("Error al guardar el modelo.");
        }

    }, [nodes, edges, id, diagramModel, company]);

    const onClear = useCallback(() => {
        if (confirm("¿Estás seguro de limpiar el lienzo?")) {
            setNodes([]);
            setEdges([]);
        }
    }, [setNodes, setEdges]);

    return (
        <div className="flex h-full w-full bg-background relative overflow-hidden">
            {!readOnly && <Sidebar />}

            <div className="flex-1 h-full relative flex flex-row" ref={reactFlowWrapper}>
                <div className="flex-1 h-full relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onConnectEnd={(event) => console.log(event)}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        onNodeDoubleClick={onNodeDoubleClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-muted/10 h-full"
                        nodesDraggable={!readOnly}
                        nodesConnectable={!readOnly}
                        elementsSelectable={true} // Allow selection in readOnly
                    >
                        <Background color="#ccc" gap={20} />
                        {!readOnly && (
                            <EditorToolbar
                                onZoomIn={() => zoomIn()}
                                onZoomOut={() => zoomOut()}
                                onFitView={() => fitView()}
                                onClear={onClear}
                                onSave={onSave}
                            />
                        )}
                        {readOnly && (
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button
                                    onClick={() => fitView()}
                                    className="bg-white p-2 rounded-md shadow-md hover:bg-gray-50 border border-gray-200"
                                    title="Ajustar vista"
                                >
                                    {/* Just a simple button if needed, or rely on mouse wheel. EditorToolbar has these. */}
                                    {/* Reusing icons might be better but for now let's stick to base functionality or just leave it blank as requested "Like ProcessViewerPage" */}
                                </button>
                            </div>
                        )}
                    </ReactFlow>

                    {/* Properties Panel Overlay (Edit Mode) */}
                    {!readOnly && (
                        <div className={`absolute top-0 right-0 h-full w-80 z-20 transition-transform duration-300 ${isPanelOpen && selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
                            <PropertiesPanel
                                selectedNode={selectedNode}
                                onUpdateNode={onUpdateNode}
                                onClose={() => {
                                    setIsPanelOpen(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Details Panel (View Mode) */}
                {readOnly && (
                    <div className="w-80 h-full border-l border-border bg-background z-10">
                        <ValueChainDetailsPanel selectedNode={selectedNode} />
                    </div>
                )}
            </div>
        </div>
    );
};

export const ValueChainPage = (props: ValueChainPageProps) => {
    return (
        <ReactFlowProvider>
            <div className="h-[calc(100vh-64px)] w-full">
                <ValueChainFlow {...props} />
            </div>
        </ReactFlowProvider>
    );
};

export default ValueChainPage;
