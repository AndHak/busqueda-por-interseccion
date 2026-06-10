import { Nodo } from "@/Dominio/Algoritmo/Tipos";

// Color por TIPO de nodo (su categoría dentro de la red semántica).
export const colorPorTipo: Record<Nodo["tipo"], string> = {
  sospechoso: "#e23b3b", // rojo
  evidencia: "#e8b23a", // ámbar
  delito: "#a06cd5", // violeta
  clase: "#4cc9b0", // teal
  lugar: "#7f8ea3", // gris azulado
  fecha: "#7f8ea3", // gris azulado
};

// Etiqueta legible de cada tipo (para la leyenda).
export const etiquetaTipo: Record<Nodo["tipo"], string> = {
  sospechoso: "Sospechoso",
  evidencia: "Evidencia",
  delito: "Delito",
  clase: "Clase",
  lugar: "Lugar",
  fecha: "Fecha",
};

// Paleta de colores por ORIGEN (una por cada evidencia consultada).
// Sirve para pintar las "marcas" que se propagan: así se ve de qué evidencia viene cada marca.
export const coloresOrigen = ["#4cc9f0", "#f9844a", "#90be6d", "#c77dff", "#f4a261"];

export function colorOrigen(indice: number): string {
  if (indice < 0) return coloresOrigen[0];
  return coloresOrigen[indice % coloresOrigen.length];
}
