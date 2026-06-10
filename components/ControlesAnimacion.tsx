"use client";

import { Tarjeta, TarjetaContenido } from "@/components/ui/Tarjeta";
import { Boton } from "@/components/ui/Boton";

interface Props {
  habilitado: boolean;
  paso: number;
  totalPasos: number;
  reproduciendo: boolean;
  velocidad: number;
  reproducir: () => void;
  pausar: () => void;
  siguiente: () => void;
  anterior: () => void;
  reiniciar: () => void;
  irAlFinal: () => void;
  cambiarVelocidad: (v: number) => void;
}

// Controles de la animación: reproducir / pausar / paso a paso / velocidad.
export function ControlesAnimacion(p: Props) {
  return (
    <Tarjeta>
      <TarjetaContenido className="flex flex-wrap items-center gap-2">
        <Boton variante="contorno" tamaño="pequeño" disabled={!p.habilitado} onClick={p.reiniciar}>
          ↺ Reiniciar
        </Boton>
        <Boton
          variante="contorno"
          tamaño="pequeño"
          disabled={!p.habilitado || p.paso <= 0}
          onClick={p.anterior}
        >
          ◂ Atrás
        </Boton>
        {p.reproduciendo ? (
          <Boton tamaño="pequeño" disabled={!p.habilitado} onClick={p.pausar}>
            ⏸ Pausa
          </Boton>
        ) : (
          <Boton tamaño="pequeño" disabled={!p.habilitado} onClick={p.reproducir}>
            ▶ Reproducir
          </Boton>
        )}
        <Boton
          variante="contorno"
          tamaño="pequeño"
          disabled={!p.habilitado || p.paso >= p.totalPasos}
          onClick={p.siguiente}
        >
          Paso ▸
        </Boton>
        <Boton variante="contorno" tamaño="pequeño" disabled={!p.habilitado} onClick={p.irAlFinal}>
          ⏭ Final
        </Boton>

        <div className="ml-auto flex items-center gap-2 text-xs text-texto-tenue">
          <span>Velocidad</span>
          <input
            type="range"
            min={150}
            max={1400}
            step={50}
            value={1550 - p.velocidad}
            onChange={(e) => p.cambiarVelocidad(1550 - Number(e.target.value))}
            disabled={!p.habilitado}
            className="accent-[#e23b3b]"
          />
        </div>

        <div className="w-full text-xs text-texto-tenue">
          Paso <span className="text-texto">{p.paso}</span> / {p.totalPasos}
        </div>
      </TarjetaContenido>
    </Tarjeta>
  );
}
