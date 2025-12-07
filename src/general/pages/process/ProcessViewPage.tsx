import React, { useEffect, useState } from 'react'
import BpmnViewer from '../../components/BpmnViewer'
import type { DiagramModel } from '../../../interfaces/diagram'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
//import 'bpmn-js-color-picker/dist/index.css'
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
//import colorPickerModule from "bpmn-js-color-picker";
import { getDiagramByIdart } from '../../../api/diagramService'

import { useParams } from "react-router";
export const ProcessViewPage = () => {
  const { id = "PROC-0001" } = useParams();
  const [selected, setSelected] = useState<DiagramModel | null>(null);
  const [idartQuery, setIdartQuery] = useState(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getDiagramByIdart(idartQuery)

        if (items.length) {
          setSelected(items[0]);
          setIdartQuery(items[0].idart);
        }
        else alert('No encontrado')
      } catch (err) {
        console.error(err)
      }
    };

    fetchData();
  }, [idartQuery]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Visualizador de Procesos</h1>

      <div style={{ marginBottom: 12 }}>
        <h2>{idartQuery}</h2>
        <h2>{selected?.name}</h2>
        <h3>{selected?.description}</h3>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 2 }}>
          <BpmnViewer
            xml={selected?.diagram || ''}
            onClick={(element) => {
              console.log('Elemento clickeado:', element);
              alert(`Click en: ${element.businessObject?.name || element.id} (${element.type})`);
            }}
          />
        </div>

      </div>
    </div>
  )
}
