"use client";

import { Relacion } from "@/Dominio/Algoritmo/Tipos";
import {
  Tarjeta,
  TarjetaEncabezado,
  TarjetaTitulo,
  TarjetaContenido,
} from "@/components/ui/Tarjeta";
import { Boton } from "@/components/ui/Boton";

interface Props {
  relaciones: Relacion[];
  onEliminar: (id: string) => void;
  onExportar: () => void;
}

// Lista de relaciones guardadas (persistidas en el navegador). Permite exportarlas a JSON.
export function RelacionesGuardadas({ relaciones, onEliminar, onExportar }: Props) {
  return (
    <Tarjeta>
      <TarjetaEncabezado className="flex-row items-center justify-between">
        <TarjetaTitulo>Relaciones guardadas</TarjetaTitulo>
        <Boton
          variante="fantasma"
          tamaño="pequeño"
          onClick={onExportar}
          disabled={relaciones.length === 0}
        >
          ⤓ Exportar
        </Boton>
      </TarjetaEncabezado>
      <TarjetaContenido className="flex flex-col gap-2">
        {relaciones.length === 0 && (
          <p className="text-xs text-texto-tenue">Aún no has guardado relaciones.</p>
        )}
        {relaciones.map((r) => (
          <div
            key={r.id}
            className="rounded-md border border-borde bg-panel-2/60 p-2.5 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="fuente-display text-sm text-acento">{r.activacion}</span>
              <button
                onClick={() => onEliminar(r.id)}
                className="text-texto-tenue transition-colors hover:text-acento"
                aria-label="Eliminar relación"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-texto-tenue">{r.delitos.join(" ⟷ ")}</p>
            <p className="mt-0.5 text-texto-tenue">{r.evidencias.join(", ")}</p>
          </div>
        ))}
      </TarjetaContenido>
    </Tarjeta>
  );
}
