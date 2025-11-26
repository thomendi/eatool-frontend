<<<<<<< HEAD
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
=======
import { DrawIoEmbed, type EventSave } from 'react-drawio'; 

export const ModelsPage = () => {
    
    // Función simulada para el envío de datos al backend
    const enviarDatosAlBackend = async (nombre: string, xmlData: string) => {
        // ⚠️ En un entorno real, aquí harías una llamada HTTP (por ejemplo, con fetch)
        // para enviar los datos.
        
        // Ejemplo de lo que se enviaría (JSON):
        /*
        const payload = {
            name: nombre,
            diagramXml: xmlData
        };
        
        await fetch('TU_ENDPOINT_DE_GUARDADO', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        */
        
        console.log(`✅ SIMULACIÓN: Datos enviados al backend con éxito:`);
        console.log(`   - Nombre del Diagrama: ${nombre}`);
        console.log(`   - XML (primeros 200 caracteres): ${xmlData.substring(0, 200)}...`);
    };

    // Función que se ejecuta al guardar el diagrama
    const handleSave = (data: EventSave) => {
        const xmlData = data.xml; 
        
        // 1. Solicitar el nombre al usuario
        const diagramName = prompt("Por favor, introduce un nombre para guardar el diagrama:");

        // 2. Verificar si el usuario proporcionó un nombre
        if (diagramName === null || diagramName.trim() === "") {
            alert("Operación cancelada. Debes proporcionar un nombre para guardar el diagrama.");
            return; // Detiene la ejecución si se cancela o está vacío
        }

        // 3. Proceder al guardado (llamando a la función simulada)
        // Usamos .trim() para limpiar espacios en blanco alrededor del nombre
        enviarDatosAlBackend(diagramName.trim(), xmlData);
        
        alert(`¡Diagrama "${diagramName.trim()}" capturado y listo para BBDD!`); 
    };

    return (
        <DrawIoEmbed 
            urlParameters={{
                ui: 'kennedy',
                lang: "es",
                libraries: true,
                saveAndExit: true,
                noExitBtn: true
            }}
            onSave={handleSave}
        />
    );
};
>>>>>>> 46caa108349978d24608ae1266f3d6e5d5542144
