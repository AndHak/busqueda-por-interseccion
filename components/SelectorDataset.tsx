"use client";

import {
  Tarjeta,
  TarjetaEncabezado,
  TarjetaTitulo,
  TarjetaContenido,
} from "@/components/ui/Tarjeta";
import { datasets } from "@/lib/Datasets";

interface Props {
  datasetId: string;
  onCambiar: (id: string) => void;
}

// Selector del archivo de datos (JSON) que alimenta la app.
export function SelectorDataset({ datasetId, onCambiar }: Props) {
  const actual = datasets.find((d) => d.id === datasetId) ?? datasets[0];
  return (
    <Tarjeta>
      <TarjetaEncabezado>
        <TarjetaTitulo>Conjunto de datos</TarjetaTitulo>
      </TarjetaEncabezado>
      <TarjetaContenido className="flex flex-col gap-2">
        <select
          value={datasetId}
          onChange={(e) => onCambiar(e.target.value)}
          className="w-full rounded-md border border-borde bg-panel-2 px-3 py-2 text-sm text-texto outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {datasets.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
        <p className="text-xs text-texto-tenue">{actual.descripcion}</p>
      </TarjetaContenido>
    </Tarjeta>
  );
}
