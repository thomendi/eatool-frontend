import { useState, useRef } from 'react';
import { DrawIoEmbed,type  DrawIoEmbedRef, type EventSave} from 'react-drawio';

export const ModelsPage = () => {
  const [imgData, setImgData] = useState<string | null>(null);

  const extractDiagramXml = (dataUrl: string): string | null => {
  try
  {
    const base64Marker = "base64,";
    const index = dataUrl.indexOf(base64Marker);
    if (index === -1) return null;

    const base64 = dataUrl.substring(index + base64Marker.length);
    const svg = atob(base64);

    // Buscar <mxGraphModel>
    const mStart = svg.indexOf("<mxGraphModel");
    const mEnd = svg.indexOf("</mxGraphModel>");

    if (mStart !== -1 && mEnd !== -1) {
      return svg.substring(mStart, mEnd + "</mxGraphModel>".length);
    }

    // Buscar <mxfile>
    const fStart = svg.indexOf("mxfile");
    const fEnd = svg.indexOf("/mxfile");

    if (fStart !== -1 && fEnd !== -1) {
      console.log("AQUI ESTA ZZZZZZZZZZZZZ");
      return svg.substring(fStart, fEnd + "</mxfile>".length);
    }

    return null;
   } catch (err) {
    console.error("Error decoding SVG:", err);
    return null;
   }
  };



const handleSave = async (event: EventSave) => {
  console.log("EventSave:", event);

  const xml = extractDiagramXml(event.xml);
console.log("XML extraído previo validacion:", xml);
  if (!xml) {
    console.error("No se pudo extraer XML del SVG.");
    return;
  }

  console.log("XML extraído:", xml);

  // Aquí guardas en tu backend
 // await saveDiagramXml(xml);
};
    //tomas  √onSave={(data) =>  setImgData(data.xml)} urlParameters={{
  const drawioRef = useRef<DrawIoEmbedRef>(null);
  return (
   <div>


      <DrawIoEmbed
      ref={drawioRef}
      onSave={handleSave} urlParameters={{
      ui: 'kennedy',
      lang: "es",
      libraries: true,
      saveAndExit: false,
      noExitBtn: true
    }}/>
    <h2>Diagrama data</h2>
    <h3>{imgData}</h3>
</div>

  )
}
