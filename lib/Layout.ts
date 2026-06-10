import { Red } from "@/Dominio/Algoritmo/Tipos";

// Posición (x, y) de un nodo dentro del lienzo SVG.
export interface Posicion {
  x: number;
  y: number;
}

// La red se dibuja por CAPAS de arriba hacia abajo:
//   delito (arriba)  →  evidencia  →  sospechoso  →  clase (abajo)
// Los delitos apuntan hacia abajo a sus evidencias, y los sospechosos apuntan hacia
// arriba a las mismas evidencias: así la "activación" (sospechoso o delito) queda
// visualmente a un lado de las evidencias y la propagación se entiende mejor.
const capaPorTipo: Record<string, number> = {
  delito: 0,
  evidencia: 1,
  lugar: 1,
  fecha: 1,
  sospechoso: 2,
  clase: 3,
};

const TOTAL_CAPAS = 4;

// Cuántos nodos tiene la capa más poblada (sirve para dar ancho al lienzo).
export function maxNodosEnCapa(red: Red): number {
  const conteo: Record<number, number> = {};
  const ids = Object.keys(red.nodos);
  for (let i = 0; i < ids.length; i++) {
    const capa = capaPorTipo[red.nodos[ids[i]].tipo] ?? 1;
    conteo[capa] = (conteo[capa] ?? 0) + 1;
  }
  let max = 1;
  const valores = Object.values(conteo);
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] > max) max = valores[i];
  }
  return max;
}

// Calcula la posición de cada nodo repartiéndolos uniformemente dentro de su capa.
export function calcularPosiciones(
  red: Red,
  ancho: number,
  alto: number
): Record<string, Posicion> {
  // 1) Agrupar los ids de nodo por capa (respetando el orden del JSON).
  const capas: Record<number, string[]> = {};
  const ids = Object.keys(red.nodos);
  for (let i = 0; i < ids.length; i++) {
    const nodo = red.nodos[ids[i]];
    const capa = capaPorTipo[nodo.tipo] ?? 1;
    if (capas[capa] === undefined) {
      capas[capa] = [];
    }
    capas[capa].push(nodo.id);
  }

  // 2) Calcular coordenadas: y por la capa, x repartido dentro de la capa.
  const margenY = 56;
  const posiciones: Record<string, Posicion> = {};
  const clavesCapa = Object.keys(capas)
    .map((c) => Number(c))
    .sort((a, b) => a - b);

  for (let c = 0; c < clavesCapa.length; c++) {
    const capa = clavesCapa[c];
    const nodosDeLaCapa = capas[capa];
    const y = margenY + (alto - 2 * margenY) * (capa / (TOTAL_CAPAS - 1));
    for (let i = 0; i < nodosDeLaCapa.length; i++) {
      const x = ancho * ((i + 1) / (nodosDeLaCapa.length + 1));
      posiciones[nodosDeLaCapa[i]] = { x, y };
    }
  }

  return posiciones;
}
