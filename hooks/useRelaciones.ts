"use client";

import { useEffect, useState } from "react";
import RelacionesSeed from "@/Dominio/Data/Relaciones.json";
import { Relacion } from "@/Dominio/Algoritmo/Tipos";

// Clave de almacenamiento en el navegador.
const CLAVE = "relaciones_guardadas";

// Hook para GUARDAR y reutilizar las relaciones encontradas.
//
// Nota: un frontend puro no puede escribir archivos en disco. Por eso:
//  - se carga el seed inicial desde Data/Relaciones.json,
//  - las relaciones nuevas se guardan en localStorage (persisten entre recargas),
//  - "exportar" descarga un Relaciones.json actualizado para reemplazar el de Data.
export function useRelaciones() {
  const [relaciones, setRelaciones] = useState<Relacion[]>([]);

  // Cargar al montar: primero localStorage; si no hay nada, el seed del JSON.
  useEffect(() => {
    const guardadas =
      typeof window !== "undefined" ? window.localStorage.getItem(CLAVE) : null;
    if (guardadas) {
      setRelaciones(JSON.parse(guardadas));
    } else {
      setRelaciones(RelacionesSeed as Relacion[]);
    }
  }, []);

  // Guarda la lista en estado y en localStorage.
  function persistir(lista: Relacion[]) {
    setRelaciones(lista);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CLAVE, JSON.stringify(lista));
    }
  }

  // Agrega una relación (la más reciente primero).
  function guardar(relacion: Relacion) {
    persistir([relacion, ...relaciones]);
  }

  // Elimina una relación por id.
  function eliminar(id: string) {
    persistir(relaciones.filter((r) => r.id !== id));
  }

  // Descarga el JSON de relaciones para reutilizarlo (reemplazar Data/Relaciones.json).
  function exportar() {
    if (typeof window === "undefined") return;
    const texto = JSON.stringify(relaciones, null, 2);
    const blob = new Blob([texto], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Relaciones.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return { relaciones, guardar, eliminar, exportar };
}
