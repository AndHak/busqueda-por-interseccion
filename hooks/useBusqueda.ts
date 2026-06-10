"use client";

import { useEffect, useMemo, useState } from "react";
import { Red, Resultado } from "@/Dominio/Algoritmo/Tipos";
import { RedSemantica } from "@/Dominio/Algoritmo/RedSemantica";
import { BuscadorInterseccion } from "@/Dominio/Algoritmo/BuscadorInterseccion";

// Hook que conecta el frontend con la LÓGICA del dominio.
// Recibe la red de datos elegida (un JSON) y mantiene la consulta + el último resultado.
export function useBusqueda(redData: Red) {
  // La red y el buscador se recrean solo cuando cambia el dataset.
  const red = useMemo(() => new RedSemantica(redData), [redData]);
  const buscador = useMemo(() => new BuscadorInterseccion(red), [red]);

  const [consulta, setConsulta] = useState<string[]>([]);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Al cambiar de dataset, se limpia la consulta y el resultado anterior.
  useEffect(() => {
    setConsulta([]);
    setResultado(null);
    setError(null);
  }, [redData]);

  // Marca / desmarca una evidencia de la consulta.
  function alternarEvidencia(id: string) {
    setResultado(null); // un cambio de consulta invalida el resultado anterior
    setError(null);
    setConsulta((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Ejecuta la búsqueda por intersección sobre la consulta actual.
  function buscar() {
    if (consulta.length < 2) {
      setError("Selecciona al menos 2 evidencias para correlacionar.");
      return;
    }
    setError(null);
    setResultado(buscador.buscar(consulta));
  }

  // Limpia la consulta y el resultado.
  function limpiar() {
    setConsulta([]);
    setResultado(null);
    setError(null);
  }

  return { red, consulta, resultado, error, alternarEvidencia, buscar, limpiar };
}
