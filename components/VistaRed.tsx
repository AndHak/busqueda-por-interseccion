"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { RedSemantica } from "@/Dominio/Algoritmo/RedSemantica";
import { Resultado } from "@/Dominio/Algoritmo/Tipos";
import { calcularPosiciones, maxNodosEnCapa } from "@/lib/Layout";
import { colorPorTipo, colorOrigen } from "@/lib/Colores";

gsap.registerPlugin(useGSAP);

// Lienzo y colores (en hex porque los atributos SVG no aceptan var() de CSS).
const ALTO = 560;
const RADIO = 24;
const ACENTO = "#e23b3b";
const AMBAR = "#e8b23a";
const ARCO = "#2b303a";
const FLECHA = "#3a3f4b";
const TEXTO = "#e9e6dd";
const TENUE = "#8c93a0";

interface Props {
  red: RedSemantica;
  consulta: string[];
  resultado: Resultado | null;
  paso: number;
  totalPasos: number;
}

// Recorta una línea para que no quede tapada por los círculos de los nodos.
function recortar(x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const largo = Math.hypot(dx, dy) || 1;
  const ux = dx / largo;
  const uy = dy / largo;
  return { x1: x1 + ux * r1, y1: y1 + uy * r1, x2: x2 - ux * r2, y2: y2 - uy * r2 };
}

// VistaRed: dibuja la red semántica en SVG y anima la propagación con GSAP + estado por paso.
export function VistaRed({ red, consulta, resultado, paso, totalPasos }: Props) {
  const contenedor = useRef<SVGSVGElement>(null);
  const datos = red.datos;
  // El ancho del lienzo crece con la capa más poblada, para que los nodos no se amontonen.
  const ancho = useMemo(() => Math.max(1120, maxNodosEnCapa(datos) * 120), [datos]);
  const pos = useMemo(() => calcularPosiciones(datos, ancho, ALTO), [datos, ancho]);

  // Reproducimos la traza hasta el paso actual para saber qué marcas tiene cada nodo
  // y qué arcos se han "encendido".
  const marcasPorNodo: Record<string, string[]> = {};
  const arcosActivos: { desde: string; hacia: string; color: string }[] = [];
  if (resultado) {
    const hasta = Math.min(paso, resultado.traza.length);
    for (let i = 0; i < hasta; i++) {
      const ev = resultado.traza[i];
      if (!marcasPorNodo[ev.nodo]) marcasPorNodo[ev.nodo] = [];
      if (marcasPorNodo[ev.nodo].indexOf(ev.origen) === -1) {
        marcasPorNodo[ev.nodo].push(ev.origen);
      }
      if (ev.desde) {
        arcosActivos.push({
          desde: ev.nodo,
          hacia: ev.desde,
          color: colorOrigen(consulta.indexOf(ev.origen)),
        });
      }
    }
  }

  const finale = resultado !== null && resultado.encontrado && paso >= totalPasos;

  // Animación de ENTRADA (una sola vez): aparecen arcos y nodos.
  useGSAP(
    () => {
      gsap.from(".arco", { opacity: 0, duration: 0.5, stagger: 0.02, ease: "power1.out" });
      gsap.from(".nodo", {
        opacity: 0,
        y: 14,
        duration: 0.45,
        stagger: 0.04,
        ease: "power2.out",
        delay: 0.1,
      });
    },
    { scope: contenedor }
  );

  // Animación del DESENLACE: la intersección pulsa con un halo.
  useGSAP(
    () => {
      if (!finale) return;
      gsap.fromTo(
        ".halo-interseccion",
        { attr: { r: RADIO }, opacity: 0.7 },
        { attr: { r: RADIO + 20 }, opacity: 0, duration: 1.3, repeat: -1, ease: "power1.out" }
      );
    },
    { scope: contenedor, dependencies: [finale] }
  );

  return (
    <svg
      ref={contenedor}
      viewBox={`0 0 ${ancho} ${ALTO}`}
      className="h-auto w-full"
      role="img"
      aria-label="Red semántica de evidencias y delitos"
    >
      <defs>
        <marker id="flecha" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={FLECHA} />
        </marker>
      </defs>

      {/* Arcos base (la red completa) */}
      {datos.arcos.map((a, i) => {
        const p1 = pos[a.desde];
        const p2 = pos[a.hacia];
        if (!p1 || !p2) return null;
        const r = recortar(p1.x, p1.y, p2.x, p2.y, RADIO, RADIO + 3);
        const mx = (r.x1 + r.x2) / 2;
        const my = (r.y1 + r.y2) / 2;
        return (
          <g className="arco" key={"arco-" + i}>
            <line
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke={ARCO}
              strokeWidth={1.4}
              markerEnd="url(#flecha)"
            />
            <text x={mx} y={my - 3} textAnchor="middle" fontSize={8.5} style={{ fill: TENUE }}>
              {a.etiqueta}
            </text>
          </g>
        );
      })}

      {/* Arcos ACTIVOS: por donde se ha propagado una marca (color del origen) */}
      {arcosActivos.map((a, i) => {
        const p1 = pos[a.desde];
        const p2 = pos[a.hacia];
        if (!p1 || !p2) return null;
        const r = recortar(p1.x, p1.y, p2.x, p2.y, RADIO, RADIO + 3);
        return (
          <line
            key={"activo-" + i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke={a.color}
            strokeWidth={2.6}
            opacity={0.9}
          />
        );
      })}

      {/* Halo pulsante de la intersección */}
      {finale && resultado?.interseccion && pos[resultado.interseccion] && (
        <circle
          className="halo-interseccion"
          cx={pos[resultado.interseccion].x}
          cy={pos[resultado.interseccion].y}
          r={RADIO}
          fill="none"
          stroke={ACENTO}
          strokeWidth={2}
        />
      )}

      {/* Nodos */}
      {Object.keys(datos.nodos).map((id) => {
        const nodo = datos.nodos[id];
        const p = pos[id];
        if (!p) return null;
        const marcas = marcasPorNodo[id] ?? [];
        const esConsulta = consulta.includes(id);
        const esInterseccion = finale && resultado?.interseccion === id;
        const activo = marcas.length > 0 || esConsulta;
        const stroke = esInterseccion ? ACENTO : esConsulta ? AMBAR : FLECHA;
        const strokeW = esInterseccion ? 4 : esConsulta ? 3 : 1.4;
        return (
          <g className="nodo" key={id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={RADIO}
              fill={colorPorTipo[nodo.tipo]}
              stroke={stroke}
              strokeWidth={strokeW}
              style={{
                opacity: activo ? 1 : 0.25,
                transition: "opacity 0.3s, stroke 0.3s, stroke-width 0.3s",
              }}
            />

            {/* Chips de marcas: una por cada origen que ha alcanzado este nodo */}
            {marcas.map((origen, k) => (
              <circle
                key={"chip-" + id + "-" + origen}
                cx={p.x + (k - (marcas.length - 1) / 2) * 12}
                cy={p.y - RADIO - 9}
                r={4.5}
                fill={colorOrigen(consulta.indexOf(origen))}
                stroke="#0c0d10"
                strokeWidth={1}
              />
            ))}

            <text
              x={p.x}
              y={p.y + RADIO + 14}
              textAnchor="middle"
              fontSize={11}
              style={{ fill: TEXTO, opacity: activo ? 1 : 0.55, transition: "opacity 0.3s" }}
            >
              {nodo.etiqueta}
            </text>

            {esInterseccion && (
              <text
                x={p.x}
                y={p.y - RADIO - 22}
                textAnchor="middle"
                fontSize={9}
                className="fuente-display"
                style={{ fill: ACENTO, letterSpacing: "0.12em" }}
              >
                ACTIVACIÓN
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
