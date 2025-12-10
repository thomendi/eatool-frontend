import React, { useEffect, useRef } from 'react'
import { useNavigate } from "react-router";
import Modeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import 'bpmn-js-color-picker/colors/color-picker.css';
// import contextPadModule from 'bpmn-js/lib/features/context-pad';import appendModule from 'diagram-js/lib/features/append'
// import modelingModule from 'bpmn-js/lib/features/modeling';
// import paletteModule from 'bpmn-js/lib/features/palette';
// import contextPadModule from 'bpmn-js/lib/features/context-pad';
import colorPickerModule from "bpmn-js-color-picker";
import { CreateAppendAnythingModule } from 'bpmn-js-create-append-anything';
import { Button } from "@/general/components/ui/button";

export interface BpmnElement {
  id: string
  type: string
  businessObject: {
    name?: string
    [key: string]: any
  }
}

type Props = {
  initialXml?: string | null
  onExport?: (xml: string) => void | Promise<void>
  onSelectionChange?: (element: BpmnElement | null) => void
  elementToUpdate?: { id: string, name: string } | null
  onModelLoaded?: (modeler: any) => void
}

export default function BpmnEditor({ initialXml, onExport, onSelectionChange, elementToUpdate, onModelLoaded }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null)
  const modelerRef = useRef<any>(null)
  // Inicializa el modeler cuando el componente monta
  // useEffect(() => {
  //  if (!containerRef.current) return

  //   modelerRef.current = new Modeler({
  //     container: containerRef.current,
  // keyboard: { bindTo: document }
  // (())    })
  //  }, [])

  useEffect(() => {
    if (initialXml && modelerRef.current) {
      modelerRef.current.importXML(initialXml)
        .then(() => {
          if (onModelLoaded) onModelLoaded(modelerRef.current)
        })
        .catch((e: any) => console.error(e))
    }
  }, [initialXml])

  useEffect(() => {
    modelerRef.current = new Modeler({
      container: containerRef.current!,
      additionalModules: [
        colorPickerModule,
        CreateAppendAnythingModule
      ]
    })

    modelerRef.current.on('selection.changed', (e: any) => {
      const selection = e.newSelection
      if (onSelectionChange) {
        if (selection.length > 0) {
          onSelectionChange(selection[0])
        } else {
          onSelectionChange(null)
        }
      }
    })

    if (initialXml) {
      modelerRef.current.importXML(initialXml)
        .then(() => {
          if (onModelLoaded) onModelLoaded(modelerRef.current)
        })
        .catch((e: any) => console.error(e))
    } else {
      createNewDiagram()
    }

    return () => modelerRef.current?.destroy()
  }, [])

  useEffect(() => {
    if (modelerRef.current && elementToUpdate) {
      const elementRegistry = modelerRef.current.get('elementRegistry');
      const modeling = modelerRef.current.get('modeling');
      const element = elementRegistry.get(elementToUpdate.id);

      if (element) {
        modeling.updateLabel(element, elementToUpdate.name);
      }
    }
  }, [elementToUpdate])
  async function createNewDiagram() {
    if (!modelerRef.current) {
      console.error("❌ Modeler no ha sido inicializado todavía")
      return
    }

    const newXml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="Process_1" isExecutable="false">
    <startEvent id="StartEvent_1" />
  </process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="150" y="150" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`

    try {
      await modelerRef.current.importXML(newXml)
      console.log("✔ Diagrama creado correctamente")
    } catch (err) {
      console.error("❌ Error importando XML", err)
    }
  }

  async function handleSave() {
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true })
      if (onExport) await onExport(xml)
      navigate('/process')
    } catch (err) {
      console.error('Error exporting XML', err)
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-2">
        <Button onClick={createNewDiagram} variant="secondary">
          Crear nuevo diagrama
        </Button>
      </div>

      <div
        ref={containerRef}
        style={{ width: "100%", height: "800px", border: "1px solid #ccc" }}
      />
      <div style={{ marginTop: 8 }} className="flex justify-end">
        <Button onClick={handleSave}>Guardar</Button>
      </div>
    </>
  )
}