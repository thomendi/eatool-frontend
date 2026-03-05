import { useEffect, useState, useRef } from 'react';
import { DrawIoEmbed, type EventSave } from 'react-drawio';
import { useParams, useNavigate } from 'react-router';
import { getDiagramByIdart, insertDiagram, updateDiagram, listDiagrams } from '../../../api/diagramService';
import type { DiagramModel } from '../../../interfaces/diagram';
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

export default function ModelArchitecturePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [idart, setIdart] = useState(id || '');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [version, setVersion] = useState('1.0');

    const [diagramXml, setDiagramXml] = useState<string | undefined>(undefined);
    const [selectedDiagram, setSelectedDiagram] = useState<DiagramModel | null>(null);

    const [list, setList] = useState<DiagramModel[]>([]);

    const stateRef = useRef({ idart, name, description, version, selectedDiagram });
    useEffect(() => {
        stateRef.current = { idart, name, description, version, selectedDiagram };
    }, [idart, name, description, version, selectedDiagram]);

    useEffect(() => {
        loadList();
        if (id) {
            handleLoadByIdart(id);
        }
    }, [id]);

    async function loadList() {
        try {
            const data = await listDiagrams();
            setList(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLoadByIdart(targetId: string = idart) {
        if (!targetId) return;
        try {
            const items = await getDiagramByIdart(targetId);
            if (items.length > 0) {
                const item = items[0];
                setSelectedDiagram(item);
                setIdart(item.idart);
                setName(item.name);
                setDescription(item.description);
                setVersion(item.version || '1.0');
                setDiagramXml(item.diagram);
            } else {
                setSelectedDiagram(null);
                setDiagramXml(undefined);
                setName('');
                setDescription('');
                setVersion('1.0');
            }
        } catch (err) {
            console.error("Error loading diagram", err);
        }
    }

    const handleSave = async (data: EventSave) => {
        const { idart: currentIdart, name: currentName, description: currentDesc, version: currentVer, selectedDiagram: currentDiagram } = stateRef.current;
        const xmlData = data.xml;

        if (!currentIdart.trim()) {
            alert('El ID de artefacto es requerido para guardar.');
            return;
        }

        const payload: DiagramModel = {
            idart: currentIdart,
            name: currentName || 'Modelo de Arquitectura',
            description: currentDesc || 'Generado desde Draw.io',
            version: currentVer || '1.0',
            diagram: xmlData
        };

        try {
            if (currentDiagram && currentDiagram.id) {
                await updateDiagram(currentDiagram.id, payload);
                alert('Diagrama actualizado correctamente');
            } else {
                await insertDiagram(payload);
                alert('Diagrama guardado correctamente');
            }
            await loadList();
            await handleLoadByIdart(currentIdart);
        } catch (err) {
            console.error("Error saving diagram", err);
            alert('Error al guardar el diagrama');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <CustomPageHeader
                title="Editor de Arquitectura (Draw.io)"
                description={`Diseñando modelo: ${idart || 'Nuevo'}`}
            />

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Editor Area */}
                    <div className="lg:col-span-10 space-y-6">
                        <Card className="border-border/50 shadow-sm h-full">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-lg font-medium flex items-center justify-between">
                                    <span>Lienzo Draw.io</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 bg-white min-h-[800px] h-[850px] overflow-hidden">
                                <DrawIoEmbed
                                    urlParameters={{
                                        ui: 'kennedy',
                                        lang: "es",
                                        libraries: true,
                                        saveAndExit: false
                                    }}
                                    xml={diagramXml}
                                    onSave={handleSave}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Propiedades del Modelo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">ID Artefacto (idart)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={idart}
                                            onChange={e => setIdart(e.target.value)}
                                            placeholder="ARQ-001"
                                            className="h-9"
                                        />
                                        <Button size="sm" variant="outline" onClick={() => handleLoadByIdart()}>
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Nombre</label>
                                    <Input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Nombre del modelo"
                                        className="h-9"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Descripción</label>
                                    <Textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Descripción del modelo de arquitectura"
                                        className="min-h-[100px] resize-y"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Versión</label>
                                    <Input
                                        value={version}
                                        onChange={e => setVersion(e.target.value)}
                                        placeholder="1.0"
                                        className="h-9"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Modelos Recientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {list.map(it => (
                                        <li key={it.id}
                                            className="text-sm p-2 rounded hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border"
                                            onClick={() => {
                                                navigate(`/architecture-model/${it.idart}`);
                                            }}
                                        >
                                            <div className="font-medium truncate">{it.name}</div>
                                            <div className="text-muted-foreground text-xs truncate">{it.idart}</div>
                                        </li>
                                    ))}
                                    {list.length === 0 && (
                                        <li className="text-sm text-muted-foreground italic text-center py-4">No hay modelos</li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
