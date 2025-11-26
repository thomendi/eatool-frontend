import { DrawIoEmbed, type EventSave } from 'react-drawio'; 

export const ModelsPage = () => {
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

