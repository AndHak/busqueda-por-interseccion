import { Resultado, Relacion } from "./Tipos";
import { RedSemantica } from "./RedSemantica";

// Construye una RELACIÓN guardable a partir del resultado de una búsqueda.
// Una vez que encontramos la activación, empaquetamos la información (evidencias,
// activación, delitos correlacionados y justificación) para poder guardarla y reutilizarla.
//
// Devuelve null si la búsqueda no encontró intersección (no hay nada que guardar).
export function construirRelacion(
  resultado: Resultado,
  red: RedSemantica,
  consulta: string[]
): Relacion | null {
  if (!resultado.encontrado || resultado.interseccion === null) {
    return null;
  }

  // Etiquetas legibles de las evidencias consultadas.
  const evidencias: string[] = [];
  for (let i = 0; i < consulta.length; i++) {
    const nodo = red.nodo(consulta[i]);
    evidencias.push(nodo ? nodo.etiqueta : consulta[i]);
  }

  // Delitos correlacionados: aquellos delitos que tienen como evidencia
  // alguno de los nodos consultados (un delito apunta a la evidencia).
  const delitos: string[] = [];
  for (let i = 0; i < consulta.length; i++) {
    const predecesores = red.predecesores(consulta[i]);
    for (let j = 0; j < predecesores.length; j++) {
      const posibleDelito = red.nodo(predecesores[j].desde);
      if (posibleDelito && posibleDelito.tipo === "delito") {
        if (delitos.indexOf(posibleDelito.etiqueta) === -1) {
          delitos.push(posibleDelito.etiqueta);
        }
      }
    }
  }

  const activacion = red.nodo(resultado.interseccion);

  return {
    id: "rel_" + Date.now(),
    fecha: new Date().toISOString(),
    consulta: consulta,
    evidencias: evidencias,
    interseccion: resultado.interseccion,
    activacion: activacion ? activacion.etiqueta : resultado.interseccion,
    delitos: delitos,
    cadenas: resultado.cadenas,
  };
}
