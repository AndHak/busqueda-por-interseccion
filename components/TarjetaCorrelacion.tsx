"use client";

import { RedSemantica } from "@/Dominio/Algoritmo/RedSemantica";
import { Resultado } from "@/Dominio/Algoritmo/Tipos";
import {
  Tarjeta,
  TarjetaEncabezado,
  TarjetaTitulo,
  TarjetaContenido,
} from "@/components/ui/Tarjeta";
import { Insignia } from "@/components/ui/Insignia";
import { colorPorTipo } from "@/lib/Colores";

interface Props {
  red: RedSemantica;
  resultado: Resultado | null;
}

// Tarjeta de CORRELACIÓN: qué delitos quedan conectados y por quién.
export function TarjetaCorrelacion({ red, resultado }: Props) {
  if (!resultado || !resultado.encontrado || !resultado.interseccion) {
    return null;
  }

  // Evidencias consultadas = los orígenes de las cadenas.
  const evidencias = resultado.cadenas.map((c) => c.origen);

  // Delitos correlacionados: delitos que apuntan (evidencia) a alguna evidencia consultada.
  const delitos: string[] = [];
  for (let i = 0; i < evidencias.length; i++) {
    const predecesores = red.predecesores(evidencias[i]);
    for (let j = 0; j < predecesores.length; j++) {
      const n = red.nodo(predecesores[j].desde);
      if (n && n.tipo === "delito" && delitos.indexOf(n.etiqueta) === -1) {
        delitos.push(n.etiqueta);
      }
    }
  }

  const activacion = red.nodo(resultado.interseccion)?.etiqueta ?? resultado.interseccion;

  return (
    <Tarjeta className="border-acento/40">
      <TarjetaEncabezado>
        <TarjetaTitulo>3 · Delitos correlacionados</TarjetaTitulo>
      </TarjetaEncabezado>
      <TarjetaContenido className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {delitos.map((d, i) => (
            <span key={d} className="flex items-center gap-2">
              <Insignia color={colorPorTipo.delito}>{d}</Insignia>
              {i < delitos.length - 1 && <span className="text-acento">⟷</span>}
            </span>
          ))}
        </div>

        <p className="text-sm text-texto-tenue">
          Correlacionados por <span className="text-acento">{activacion}</span>.
        </p>

        <div className="flex flex-wrap gap-1">
          {evidencias.map((id) => (
            <Insignia key={id} color={colorPorTipo.evidencia}>
              {red.nodo(id)?.etiqueta ?? id}
            </Insignia>
          ))}
        </div>
      </TarjetaContenido>
    </Tarjeta>
  );
}
