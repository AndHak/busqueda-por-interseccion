"use client";

import { RedSemantica } from "@/Dominio/Algoritmo/RedSemantica";
import { Resultado } from "@/Dominio/Algoritmo/Tipos";
import {
  Tarjeta,
  TarjetaEncabezado,
  TarjetaTitulo,
  TarjetaContenido,
} from "@/components/ui/Tarjeta";
import { Boton } from "@/components/ui/Boton";

interface Props {
  red: RedSemantica;
  resultado: Resultado | null;
  onGuardar: () => void;
  guardado: boolean;
}

// Panel del RESULTADO: muestra la activación y la justificación (cadenas).
export function PanelActivacion({ red, resultado, onGuardar, guardado }: Props) {
  const eti = (id: string) => red.nodo(id)?.etiqueta ?? id;

  return (
    <Tarjeta>
      <TarjetaEncabezado>
        <TarjetaTitulo>2 · Resultado</TarjetaTitulo>
      </TarjetaEncabezado>
      <TarjetaContenido>
        {!resultado && (
          <p className="text-sm text-texto-tenue">
            Elige evidencias y pulsa «Buscar activación».
          </p>
        )}

        {resultado && !resultado.encontrado && (
          <p className="text-sm text-texto-tenue">
            <span className="text-acento">Sin intersección.</span> Estas evidencias no
            comparten un origen común.
          </p>
        )}

        {resultado && resultado.encontrado && resultado.interseccion && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-texto-tenue">Activación</p>
              <p className="fuente-display text-2xl text-acento">
                {eti(resultado.interseccion)}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wider text-texto-tenue">
                Justificación
              </p>
              <ul className="flex flex-col gap-1.5">
                {resultado.cadenas.map((c, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {c.pasos.map((paso, j) => (
                      <span key={j} className="inline-flex flex-wrap items-center gap-1">
                        <span className="text-texto">{eti(paso.desde)}</span>
                        <span className="text-texto-tenue">—{paso.etiqueta}→</span>
                        <span className="text-texto">{eti(paso.hacia)}</span>
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>

            <Boton
              onClick={onGuardar}
              disabled={guardado}
              variante={guardado ? "contorno" : "solido"}
            >
              {guardado ? "✓ Relación guardada" : "Guardar relación"}
            </Boton>
          </div>
        )}
      </TarjetaContenido>
    </Tarjeta>
  );
}
