"use client";

import { RedSemantica } from "@/Dominio/Algoritmo/RedSemantica";
import {
  Tarjeta,
  TarjetaEncabezado,
  TarjetaTitulo,
  TarjetaContenido,
} from "@/components/ui/Tarjeta";
import { Casilla } from "@/components/ui/Casilla";
import { Boton } from "@/components/ui/Boton";
import { colorPorTipo } from "@/lib/Colores";

interface Props {
  red: RedSemantica;
  consulta: string[];
  error: string | null;
  onAlternar: (id: string) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
}

// Panel de la CONSULTA: el usuario elige las evidencias a correlacionar.
export function SelectorEvidencias({
  red,
  consulta,
  error,
  onAlternar,
  onBuscar,
  onLimpiar,
}: Props) {
  const evidencias = red.evidencias();

  return (
    <Tarjeta>
      <TarjetaEncabezado>
        <TarjetaTitulo>1 · Consulta</TarjetaTitulo>
        <p className="text-xs text-texto-tenue">
          Elige 2 o más evidencias para correlacionar.
        </p>
      </TarjetaEncabezado>
      <TarjetaContenido className="flex flex-col gap-1.5">
        {evidencias.map((ev) => {
          const marcado = consulta.includes(ev.id);
          return (
            <button
              key={ev.id}
              onClick={() => onAlternar(ev.id)}
              className="flex items-center gap-3 rounded-md border border-transparent px-2 py-1.5 text-left transition-colors hover:border-borde hover:bg-panel-2"
            >
              <Casilla marcado={marcado} />
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colorPorTipo.evidencia }}
              />
              <span className="text-sm">{ev.etiqueta}</span>
            </button>
          );
        })}

        {error && <p className="mt-1 text-xs text-acento">{error}</p>}

        <div className="mt-3 flex gap-2">
          <Boton onClick={onBuscar} disabled={consulta.length < 2} className="flex-1">
            Buscar activación
          </Boton>
          <Boton variante="contorno" onClick={onLimpiar}>
            Limpiar
          </Boton>
        </div>
      </TarjetaContenido>
    </Tarjeta>
  );
}
