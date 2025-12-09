import React, { useEffect, useState } from 'react'
import BpmnEditor from '../../components/BpmnEditor'
import BpmnViewer from '../../components/BpmnViewer'
import type { DiagramModel } from '../../../interfaces/diagram'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { useParams } from "react-router";
import { insertDiagram, updateDiagram, getDiagramByIdart, listDiagrams } from '../../../api/diagramService'
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ModelProcessPage() {
  const { id = "PROC-0001" } = useParams();
  const [selected, setSelected] = useState<DiagramModel | null>(null);
  const [list, setList] = useState<DiagramModel[]>([]);
  const [idartQuery, setIdartQuery] = useState(id);

  useEffect(() => {
    loadList()
    if (id) {
      handleLoadByIdart(id)
    }
  }, [id])

  async function loadList() {
    try {
      const data = await listDiagrams()
      setList(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleLoadByIdart(targetId: string = idartQuery) {
    try {
      const items = await getDiagramByIdart(targetId)
      if (items.length) {
        setSelected(items[0])
        setIdartQuery(items[0].idart)
      }
      // else alert('No encontrado') // Optional: Don't alert on auto-load
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSaveXml(xml: string) {
    const name = prompt('Nombre del diagrama', selected?.name) || 'Sin nombre';

    const payload: DiagramModel = {
      idart: id, // Use the ID from the URL
      name,
      description: 'Guardado desde editor',
      version: '1.0',
      diagram: xml
    }

    if (selected && selected.id) {
      await updateDiagram(selected.id, payload)
      alert('Actualizado OK')
    } else {
      await insertDiagram(payload)
      alert('Guardado OK')
    }
    await loadList()
    // Reload current diagram to ensure state is synced
    await handleLoadByIdart(id)
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomPageHeader
        title="Editor de Procesos BPMN"
        description={`Diseñando flujo para el proceso: ${id}`}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Editor Area */}
          <div className="lg:col-span-9 space-y-6">
            <Card className="border-border/50 shadow-sm h-full">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  <span>Lienzo de Diseño</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-white min-h-[600px]">
                <BpmnEditor initialXml={selected?.diagram} onExport={handleSaveXml} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">

            {/* Search/Load Card */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Cargar Diagrama</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={idartQuery}
                    onChange={e => setIdartQuery(e.target.value)}
                    placeholder="ID..."
                    className="h-9"
                  />
                  <Button size="sm" variant="outline" onClick={() => handleLoadByIdart()}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Saved Models List */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Historial de Versiones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {list.map(it => (
                    <li key={it.id} className="text-sm p-2 rounded hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border">
                      <div className="font-medium truncate">{it.name}</div>
                      <div className="text-muted-foreground text-xs truncate">{it.idart}</div>
                    </li>
                  ))}
                  {list.length === 0 && (
                    <li className="text-sm text-muted-foreground italic text-center py-4">No hay modelos guardados</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Viewer Preview */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[200px] overflow-hidden relative bg-white rounded-b-lg">
                <div className="absolute inset-0">
                  <BpmnViewer xml={selected?.diagram || ''} />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}