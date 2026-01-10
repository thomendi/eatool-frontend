import { useEffect, useRef } from 'react'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from "@/general/components/ui/button";

export default function BpmnViewer({ xml, onClick }: { xml: string; onClick?: (element: any) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<any>(null)
  const onClickRef = useRef(onClick);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!containerRef.current) return
    viewerRef.current = new NavigatedViewer({ container: containerRef.current })
    console.log("xml=", xml);

    const eventBus = viewerRef.current.get('eventBus');

    eventBus.on('element.click', (e: any) => {
      if (onClickRef.current) {
        onClickRef.current(e.element);
      }
    });

    if (xml) {
      viewerRef.current.importXML(xml).then(() => {
        const canvas = viewerRef.current.get('canvas')
        canvas.zoom('fit-viewport')
      }).catch((e: any) => console.error(e))
    }

    return () => viewerRef.current?.destroy()
  }, [xml])

  const handleZoom = (step: number) => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get('canvas');
      if (canvas) {
        canvas.zoom(canvas.zoom() * (1 + step));
      }
    }
  };

  const handleResetZoom = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get('canvas');
      if (canvas) {
        canvas.zoom('fit-viewport');
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px] border border-gray-200">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 right-16 flex gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleZoom(0.3)}
          title="Acercar (+)"
          className="h-10 w-10 bg-white/90 shadow-sm hover:bg-white"
        >
          <ZoomIn className="h-6 w-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleZoom(-0.3)}
          title="Alejar (-)"
          className="h-10 w-10 bg-white/90 shadow-sm hover:bg-white"
        >
          <ZoomOut className="h-6 w-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleResetZoom}
          title="Ajustar a pantalla"
          className="h-10 w-10 bg-white/90 shadow-sm hover:bg-white"
        >
          <Maximize className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}