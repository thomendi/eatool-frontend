import { useCallback, useRef, useState, useEffect } from 'react';
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
import { nodeTypes } from './components/CustomNodes';
import { exportToXML, downloadXML } from './utils/xmlUtils';

interface ValueChainPageProps {
    readOnly?: boolean;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Helper ID generator using crypto.randomUUID
const getId = () => `node_${crypto.randomUUID()}`;

const ValueChainFlow = ({ readOnly = false }: ValueChainPageProps) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

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

    const onSave = useCallback(() => {
        const xml = exportToXML(nodes, edges);
        console.log('Exported XML:', xml);
        downloadXML(xml);
    }, [nodes, edges]);

    const onClear = useCallback(() => {
        setNodes([]);
        setEdges([]);
    }, [setNodes, setEdges]);

    return (
        <div className="flex h-full w-full bg-background relative overflow-hidden">
            {!readOnly && <Sidebar />}

            <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
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
                    className="bg-muted/10"
                    nodesDraggable={!readOnly}
                    nodesConnectable={!readOnly}
                    elementsSelectable={!readOnly}
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
                </ReactFlow>

                {/* Properties Panel Overlay */}
                {!readOnly && (
                    <div className={`absolute top-0 right-0 h-full w-80 z-20 transition-transform duration-300 ${isPanelOpen && selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
                        <PropertiesPanel
                            selectedNode={selectedNode}
                            onUpdateNode={onUpdateNode}
                            onClose={() => {
                                setIsPanelOpen(false);
                                // Optional: Keep selection or clear it?
                                // User usually expects 'close panel' to just hide UI,
                                // but we can also deselect if desired.
                                // Let's keep it simple: just close panel.
                            }}
                        />
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
