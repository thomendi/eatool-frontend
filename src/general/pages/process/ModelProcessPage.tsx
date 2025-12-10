import React, { useEffect, useState } from 'react'
import BpmnEditor from '../../components/BpmnEditor'
import BpmnViewer from '../../components/BpmnViewer'
import type { DiagramModel } from '../../../interfaces/diagram'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { useParams } from "react-router";
import { insertDiagram, updateDiagram, getDiagramByIdart, listDiagrams } from '../../../api/diagramService'
import { createLinkedTask, getLinkedArtefacts } from '../../../api/artefactService'
import type { BpmnElement } from '../../components/BpmnEditor'
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/general/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

export default function ModelProcessPage() {
  const { id = "PROC-0001" } = useParams();
  const [selected, setSelected] = useState<DiagramModel | null>(null);
  const [list, setList] = useState<DiagramModel[]>([]);
  const [idartQuery, setIdartQuery] = useState(id);

  // Local persistence state
  const [selectedElement, setSelectedElement] = useState<BpmnElement | null>(null)
  const [taskMetadata, setTaskMetadata] = useState<Record<string, { name: string, description: string, owner: string, type: string }>>({})
  const [elementToUpdate, setElementToUpdate] = useState<{ id: string, name: string } | null>(null)

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

    // Persist artefacts
    for (const [taskId, data] of Object.entries(taskMetadata)) {
      try {
        await createLinkedTask({
          name: data.name,
          description: data.description,
          type: data.type,
          level: 0,
          subtype: "task", // Default
          alias: data.name,
          category: "process",
          subcategory: "task",
          version: "1.0",
          company: "MyCompany", // Default
          owner: data.owner,
          state: "active",
          objetive: data.description,
          range: "local",
          idart: id // The ID of the process
        })
      } catch (e) {
        console.error(`Failed to save linked task ${taskId}`, e)
      }
    }

    const payload: DiagramModel = {
      idart: id, // Use the ID from the URL
      name,
      description: 'Guardado desde editor',
      version: '1.0',
      diagram: xml
    }

    if (selected && selected.id) {
      await updateDiagram(selected.id, payload)
      // alert('Actualizado OK')
      alert('Diagrama y artefactos guardados correctamente')
    } else {
      await insertDiagram(payload)
      alert('Diagrama y artefactos guardados correctamente')
    }
    await loadList()
    // Reload current diagram to ensure state is synced
    await handleLoadByIdart(id)
  }

  const handleSelectionChange = (element: BpmnElement | null) => {
    setSelectedElement(element)
    if (element) {
      // Initialize metadata if not exists
      setTaskMetadata(prev => {
        if (!prev[element.id]) {
          return {
            ...prev,
            [element.id]: {
              name: element.businessObject.name || '',
              description: '',
              owner: '',
              type: element.type
            }
          }
        }
        return prev
      })
    }
  }

  const updateMetadata = (key: 'name' | 'description' | 'owner', value: string) => {
    if (!selectedElement) return

    setTaskMetadata(prev => ({
      ...prev,
      [selectedElement.id]: {
        ...prev[selectedElement.id],
        [key]: value
      }
    }))

    if (key === 'name') {
      setElementToUpdate({ id: selectedElement.id, name: value })
    }
  }

  const handleModelLoaded = async (modeler: any) => {
    try {
      const linkedData = await getLinkedArtefacts(id)
      console.log('Linked artefacts loaded:', linkedData)

      if (linkedData && linkedData.artefacts) {
        const elementRegistry = modeler.get('elementRegistry')
        const allElements = elementRegistry.getAll()

        const newMetadata: Record<string, any> = {}

        // Map artefacts to BPMN elements by name
        linkedData.artefacts.forEach(artefact => {
          // Find the BPMN element that matches the artefact name
          // Note: This matches the FIRST element found with that name.
          // Ideally we should use IDs but ID mapping is not guaranteed between sessions unless persisted.
          const match = allElements.find((el: any) =>
            el.businessObject && el.businessObject.name === artefact.name && el.type !== 'bpmn:Process'
          )

          if (match) {
            newMetadata[match.id] = {
              name: artefact.name,
              description: artefact.description,
              owner: artefact.owner,
              type: match.type
            }
          }
        })

        setTaskMetadata(prev => ({
          ...prev,
          ...newMetadata
        }))
      }
    } catch (e) {
      console.error('Failed to load linked artefacts', e)
    }
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
                <BpmnEditor
                  initialXml={selected?.diagram}
                  onExport={handleSaveXml}
                  onSelectionChange={handleSelectionChange}
                  elementToUpdate={elementToUpdate}
                  onModelLoaded={handleModelLoaded}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">

            {/* Search/Load Card OR Element Name Editor */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {selectedElement ? 'Editar Elemento' : 'Cargar Diagrama'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedElement ? (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Nombre</label>
                    <Input
                      value={taskMetadata[selectedElement.id]?.name || ''}
                      onChange={e => updateMetadata('name', e.target.value)}
                      placeholder="Nombre del elemento"
                      className="h-9"
                    />
                    <div className="text-xs text-muted-foreground">
                      ID: {selectedElement.id}
                    </div>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>

            {/* Saved Models List OR Element Properties */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {selectedElement ? 'Propiedades' : 'Historial de Versiones'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedElement ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Descripción</label>
                      <Textarea
                        value={taskMetadata[selectedElement.id]?.description || ''}
                        onChange={e => updateMetadata('description', e.target.value)}
                        placeholder="Descripción detallada..."
                        className="min-h-[100px] resize-y"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Dueño (Owner)</label>
                      <Input
                        value={taskMetadata[selectedElement.id]?.owner || ''}
                        onChange={e => updateMetadata('owner', e.target.value)}
                        placeholder="Owner"
                        className="h-9"
                      />
                    </div>
                  </div>
                ) : (
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
                )}
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