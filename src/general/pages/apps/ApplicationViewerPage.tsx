import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { DrawIoEmbed } from 'react-drawio';
import { getDiagramByIdart } from '../../../api/diagramService';
import { eatoolApi } from '@/api/eatoolApi';
import type { Application } from '@/api/applicationService';
import { ArrowLeft, AppWindow, Users, Building2, Server, Globe, Shield, Activity } from "lucide-react";
import { cn } from '@/lib/utils';

export const ApplicationViewerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [application, setApplication] = useState<Application | null>(null);
    const [diagramXml, setDiagramXml] = useState<string>("");

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (targetId: string) => {
        try {
            // Load Application Details from API
            let appData: Application | null = null;
            try {
                // Since there is no getApplicationById, we fetch all and filter or assume there's an endpoint
                const res = await eatoolApi.get(`/applications/application/${targetId}/`);
                appData = res.data;
            } catch (err: any) {
                // Attempt to load from the whole list if single endpoint doesn't exist
                if (err.response?.status === 404) {
                    const listRes = await eatoolApi.get(`/applications/application/`);
                    appData = listRes.data.find((a: Application) => a.idart === targetId || a.id?.toString() === targetId) || null;
                } else {
                    console.error("Error fetching generic application generic data:", err);
                }
            }

            if (appData) {
                setApplication(appData);
            }

            // Load Diagram based on idart or numeric id
            const diagramIdToSearch = appData?.idart || targetId;
            const diagrams = await getDiagramByIdart(diagramIdToSearch.toString());

            if (diagrams.length > 0) {
                setDiagramXml(diagrams[0].diagram);
            } else {
                setDiagramXml("");
            }
        } catch (error) {
            console.error("Error loading application data", error);
        }
    };

    const handleGoBack = () => {
        navigate('/apps');
    };

    const statusColors: Record<string, string> = {
        active: 'bg-success/10 text-success border-success/20',
        maintenance: 'bg-warning/10 text-warning border-warning/20',
        deprecated: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    const statusLabels: Record<string, string> = {
        active: 'Activo',
        maintenance: 'Mantenimiento',
        deprecated: 'Deprecado'
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CustomPageHeader
                title="Visualizador de Aplicaciones"
                description={`Viendo Arquitectura: ${application?.name || '...'}`}
                action={
                    <Button variant="outline" onClick={handleGoBack} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Aplicaciones
                    </Button>
                }
            />

            <div className="flex-1 container mx-auto px-4 py-4 h-full flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Main Diagram Area - 75% */}
                <Card className="flex-[3] border-border/50 shadow-sm flex flex-col h-[calc(100vh-140px)]">
                    <CardHeader className="py-3 px-4 border-b flex flex-row items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <AppWindow className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground text-lg">{application?.name}</span>
                            {application && (
                                <span className={cn("px-2 py-0.5 rounded text-xs border uppercase font-medium", statusColors[application.status])}>
                                    {statusLabels[application.status] || application.status}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative bg-white overflow-hidden">
                        {diagramXml ? (
                            <DrawIoEmbed
                                urlParameters={{
                                    ui: 'min',
                                    spin: true,
                                    lightbox: true,
                                    nav: true
                                }}
                                xml={diagramXml}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No hay modelo de arquitectura Draw.io disponible para esta aplicación.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Details Sidebar - 25% */}
                <Card className="flex-1 border-border/50 shadow-sm h-[calc(100vh-140px)] overflow-y-auto">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                        <CardTitle className="text-lg font-bold">Información de la Aplicación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {application ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descripción</label>
                                    <div className="text-sm font-medium leading-relaxed">
                                        {application.description || <span className="text-muted-foreground italic">No hay descripción.</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                            <Activity size={12} />
                                            Versión
                                        </label>
                                        <div className="text-sm font-medium bg-muted/50 p-2 rounded-md">{application.version}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                            <Users size={12} />
                                            Usuarios Activos
                                        </label>
                                        <div className="text-sm font-medium bg-muted/50 p-2 rounded-md">{application.activeUsers}</div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                        <Building2 size={12} />
                                        Desarrollador / Empresa
                                    </label>
                                    <div className="text-sm font-medium bg-muted/50 p-2 rounded-md">{application.developer}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                            <Globe size={12} />
                                            Stack / Framework
                                        </label>
                                        <div className="text-sm font-medium bg-muted/50 p-2 rounded-md">{application.framework || 'N/A'}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                            <Server size={12} />
                                            Sistema Operativo
                                        </label>
                                        <div className="text-sm font-medium bg-muted/50 p-2 rounded-md">{application.os || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                            <Globe size={12} />
                                            Lenguaje
                                        </label>
                                        <div className="text-sm font-medium bg-muted/50 p-2 rounded-md">{application.language || 'N/A'}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase">
                                            <Shield size={12} />
                                            Seguridad
                                        </label>
                                        <div className="text-sm font-medium bg-muted/50 p-2 rounded-md">{application.security || 'N/A'}</div>
                                    </div>
                                </div>

                                {application.idart && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identificador (IDART)</label>
                                        <div className="text-sm font-mono bg-muted p-1 rounded break-all">{application.idart}</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-10">
                                Cargando información de la aplicación...
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
