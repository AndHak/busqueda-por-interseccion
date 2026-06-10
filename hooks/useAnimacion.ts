"use client";

import { useEffect, useState } from "react";
import { Resultado } from "@/Dominio/Algoritmo/Tipos";

// Hook que controla la ANIMACIÓN de la propagación.
//
// El recorrido se divide en pasos, uno por cada evento de la traza:
//   paso 0                 -> estado inicial (nada marcado)
//   paso k                 -> se han aplicado los primeros k eventos de la traza
//   paso = traza.length    -> último evento: la intersección queda marcada (desenlace)
export function useAnimacion(resultado: Resultado | null) {
  const totalPasos = resultado ? resultado.traza.length : 0;

  const [paso, setPaso] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [velocidad, setVelocidad] = useState(750); // ms por paso

  // Al llegar un resultado nuevo: reiniciar y reproducir automáticamente.
  useEffect(() => {
    setPaso(0);
    setReproduciendo(resultado !== null);
  }, [resultado]);

  // Avance automático: programa el siguiente paso mientras se reproduce.
  useEffect(() => {
    if (!reproduciendo) return;
    if (paso >= totalPasos) {
      setReproduciendo(false);
      return;
    }
    const t = setTimeout(() => setPaso((p) => p + 1), velocidad);
    return () => clearTimeout(t);
  }, [reproduciendo, paso, totalPasos, velocidad]);

  return {
    paso,
    totalPasos,
    reproduciendo,
    velocidad,
    reproducir: () => setReproduciendo(true),
    pausar: () => setReproduciendo(false),
    siguiente: () => setPaso((p) => Math.min(p + 1, totalPasos)),
    anterior: () => setPaso((p) => Math.max(p - 1, 0)),
    reiniciar: () => {
      setPaso(0);
      setReproduciendo(false);
    },
    irAlFinal: () => {
      setPaso(totalPasos);
      setReproduciendo(false);
    },
    cambiarVelocidad: (v: number) => setVelocidad(v),
  };
}
