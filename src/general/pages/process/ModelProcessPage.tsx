import React, { useEffect, useState } from 'react'
import BpmnEditor from '../../components/BpmnEditor'
import BpmnViewer from '../../components/BpmnViewer'
import type { DiagramModel } from '../../../interfaces/diagram'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
//import 'bpmn-js-color-picker/dist/index.css'
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import { useParams } from "react-router";
//import colorPickerModule from "bpmn-js-color-picker";
import { insertDiagram, getDiagramByIdart, listDiagrams } from '../../../api/diagramService'

export default function ModelProcessPage() {
  const { id = "PROC-0001" } = useParams();
  const [selected, setSelected] = useState<DiagramModel | null>(null);
  const [list, setList] = useState<DiagramModel[]>([]);
  const [idartQuery, setIdartQuery] = useState(id);
   console.log("VAlor del ID",id);
   console.log("valor de idartQuery", idartQuery);
  useEffect(() => {
    loadList()
  }, [])

  async function loadList() {
    try {
      const data = await listDiagrams()
      setList(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleLoadByIdart() {
    try {
      const items = await getDiagramByIdart(idartQuery)
      if (items.length) setSelected(items[0])
      else alert('No encontrado')
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSaveXml(xml: string) {
    const name = prompt('Nombre del diagrama') || 'Sin nombre';

    const payload: DiagramModel = {
      idart: 'PROC-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      name,
      description: 'Guardado desde editor',
      version: '1.0',
      diagram: xml
    }
    await insertDiagram(payload)
    await loadList()
    alert('Guardado OK')
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>BPMN Editor (TypeScript)</h1>

      <div style={{ marginBottom: 12 }}>
        <input value={idartQuery} onChange={e => setIdartQuery(e.target.value)} />
        <button onClick={handleLoadByIdart}>Cargar por idart</button>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <BpmnEditor initialXml={selected?.diagram} onExport={handleSaveXml} />
        </div>
        <div style={{ width: 420 }}>
          <h3>Modelos guardados</h3>
          <ul>
            {list.map(it => (
              <li key={it.id}>
                <strong>{it.idart}</strong> - {it.name}
              </li>
            ))}
          </ul>

          <h3>Viewer</h3>
          <BpmnViewer xml={selected?.diagram || ''} />
        </div>
      </div>
    </div>
  )
}