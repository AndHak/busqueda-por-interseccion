import {
  Tarjeta,
  TarjetaEncabezado,
  TarjetaTitulo,
  TarjetaContenido,
} from "@/components/ui/Tarjeta";
import { Separador } from "@/components/ui/Separador";
import { colorPorTipo, etiquetaTipo, coloresOrigen } from "@/lib/Colores";
import { Nodo } from "@/Dominio/Algoritmo/Tipos";

const tipos: Nodo["tipo"][] = ["delito", "evidencia", "sospechoso", "clase"];

// Leyenda: explica los colores por tipo de nodo y los estados de la animación.
export function Leyenda() {
  return (
    <Tarjeta>
      <TarjetaEncabezado>
        <TarjetaTitulo>Leyenda</TarjetaTitulo>
      </TarjetaEncabezado>
      <TarjetaContenido className="flex flex-col gap-2 text-xs">
        {tipos.map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: colorPorTipo[t] }}
            />
            <span>{etiquetaTipo[t]}</span>
          </div>
        ))}

        <Separador className="my-1" />

        <div className="flex items-center gap-2">
          <span className="flex gap-0.5">
            {coloresOrigen.slice(0, 3).map((c) => (
              <span
                key={c}
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </span>
          <span>Marca (de qué evidencia viene)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded-full border-2" style={{ borderColor: "#e8b23a" }} />
          <span>Evidencia consultada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded-full border-2" style={{ borderColor: "#e23b3b" }} />
          <span>Activación (intersección)</span>
        </div>
      </TarjetaContenido>
    </Tarjeta>
  );
}
