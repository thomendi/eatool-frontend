import { getDiagramsActions } from "@/general/actions/get-diagrams-actions";
import type { DiagramsResponse } from "@/interfaces/diagrams.response";
import { useEffect, useState } from "react";
import { DrawIoEmbed } from "react-drawio"
import { useParams } from "react-router";

export const ProcessEditPage = () => {
  const { id } = useParams();
const [diagrams, setDiagrams] = useState<DiagramsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDiagramsActions(id);
        setDiagrams(response);
      } catch (error) {
        console.error("Error cargando diagrams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
          <h1>{ id }</h1>
          <h3>Este es: { diagrams[0]?.name }</h3>
          <DrawIoEmbed urlParameters={{
              lightbox: true,
            }}
            xml= {diagrams[0]?.diagram}/>
    </div>
  )
}
