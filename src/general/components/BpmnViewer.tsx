import React, { useEffect, useRef } from 'react'
import Viewer from 'bpmn-js/lib/Viewer'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

export default function BpmnViewer({ xml }: { xml: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return
    viewerRef.current = new Viewer({ container: containerRef.current })
    console.log("xml=", xml);
    if (xml) {
     
      viewerRef.current.importXML(xml).then(() => {

        const canvas = viewerRef.current.get('canvas')
        canvas.zoom('fit-viewport')
      }).catch((e: any) => console.error(e))
    }

    return () => viewerRef.current?.destroy()
  }, [xml])

  return <div ref={containerRef} style={{ width: '100%', height: '300px', border: '1px solid #eee' }} />
}