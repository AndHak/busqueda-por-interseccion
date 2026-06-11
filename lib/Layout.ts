import { Red } from "@/Dominio/Algoritmo/Tipos";

// Posición (x, y) de un nodo dentro del lienzo SVG.
export interface Posicion {
  x: number;
  y: number;
}

// La red se dibuja por CAPAS de arriba hacia abajo:
//
//   clase general de delito (Delito)         ← lo más general, arriba del todo
//   clases de delito (Robo, Homicidio, …)
//   delito (casos particulares)
//   evidencia / lugar / fecha
//   sospechoso
//   clases de persona (Criminal)
//   clase general de persona (Persona)       ← lo más general, abajo del todo
//
// Así la jerarquía se lee en vertical y los arcos "instancia" / "es un" quedan cortos:
// los delitos suben hacia sus clases y los sospechosos bajan hacia las suyas.
//
// Las capas de las clases NO están quemadas: se deducen de los arcos.
//   - una clase a la que apuntan DELITOS pertenece al grupo de arriba (nivel 1);
//   - una clase a la que apuntan SOSPECHOSOS pertenece al grupo de abajo (nivel 1);
//   - una clase a la que apunta otra clase ("es un") hereda el grupo con nivel + 1.

interface InfoClase {
  grupo: "delito" | "persona";
  nivel: number; // 1 = la apuntan individuos; 2 = la apuntan clases de nivel 1; etc.
}

// Determina, para cada nodo de tipo "clase", su grupo y qué tan general es.
function clasificarClases(red: Red): Record<string, InfoClase> {
  const info: Record<string, InfoClase> = {};

  // Varias pasadas porque una clase puede depender de otra clase (cadenas de "es un").
  for (let pasada = 0; pasada < 6; pasada++) {
    let cambio = false;
    for (let i = 0; i < red.arcos.length; i++) {
      const arco = red.arcos[i];
      const fuente = red.nodos[arco.desde];
      const destino = red.nodos[arco.hacia];
      if (!fuente || !destino || destino.tipo !== "clase") continue;

      let candidata: InfoClase | null = null;
      if (fuente.tipo === "delito") {
        candidata = { grupo: "delito", nivel: 1 };
      } else if (fuente.tipo === "sospechoso") {
        candidata = { grupo: "persona", nivel: 1 };
      } else if (fuente.tipo === "clase" && info[fuente.id]) {
        candidata = { grupo: info[fuente.id].grupo, nivel: info[fuente.id].nivel + 1 };
      }

      if (candidata && (!info[destino.id] || candidata.nivel > info[destino.id].nivel)) {
        info[destino.id] = candidata;
        cambio = true;
      }
    }
    if (!cambio) break;
  }

  // Una clase suelta (a la que nadie apunta) se asume del grupo de personas, como antes.
  const ids = Object.keys(red.nodos);
  for (let i = 0; i < ids.length; i++) {
    const nodo = red.nodos[ids[i]];
    if (nodo.tipo === "clase" && !info[nodo.id]) {
      info[nodo.id] = { grupo: "persona", nivel: 1 };
    }
  }

  return info;
}

// Capa de cada nodo + cuántas capas tiene la red en total.
export function calcularCapas(red: Red): {
  capaPorNodo: Record<string, number>;
  totalCapas: number;
} {
  const clases = clasificarClases(red);

  // Cuánta jerarquía de clases hay arriba (delitos) y abajo (personas).
  let nivelesArriba = 0;
  let nivelesAbajo = 0;
  const idsClase = Object.keys(clases);
  for (let i = 0; i < idsClase.length; i++) {
    const c = clases[idsClase[i]];
    if (c.grupo === "delito" && c.nivel > nivelesArriba) nivelesArriba = c.nivel;
    if (c.grupo === "persona" && c.nivel > nivelesAbajo) nivelesAbajo = c.nivel;
  }

  const capaDelito = nivelesArriba;
  const capaEvidencia = nivelesArriba + 1;
  const capaSospechoso = nivelesArriba + 2;
  const totalCapas = nivelesArriba + 3 + nivelesAbajo;

  const capaPorNodo: Record<string, number> = {};
  const ids = Object.keys(red.nodos);
  for (let i = 0; i < ids.length; i++) {
    const nodo = red.nodos[ids[i]];
    if (nodo.tipo === "delito") {
      capaPorNodo[nodo.id] = capaDelito;
    } else if (nodo.tipo === "sospechoso") {
      capaPorNodo[nodo.id] = capaSospechoso;
    } else if (nodo.tipo === "clase") {
      const c = clases[nodo.id];
      // Grupo de arriba: a mayor nivel (más general), más arriba (capa menor).
      // Grupo de abajo: a mayor nivel, más abajo (capa mayor).
      capaPorNodo[nodo.id] =
        c.grupo === "delito" ? nivelesArriba - c.nivel : capaSospechoso + c.nivel;
    } else {
      capaPorNodo[nodo.id] = capaEvidencia; // evidencia / lugar / fecha
    }
  }

  return { capaPorNodo, totalCapas };
}

// Cuántas capas tiene la red (para darle alto al lienzo).
export function contarCapas(red: Red): number {
  return calcularCapas(red).totalCapas;
}

// Cuántos nodos tiene la capa más poblada (sirve para dar ancho al lienzo).
export function maxNodosEnCapa(red: Red): number {
  const { capaPorNodo } = calcularCapas(red);
  const conteo: Record<number, number> = {};
  const ids = Object.keys(red.nodos);
  for (let i = 0; i < ids.length; i++) {
    const capa = capaPorNodo[ids[i]];
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
  const { capaPorNodo, totalCapas } = calcularCapas(red);

  // 1) Agrupar los ids de nodo por capa (respetando el orden del JSON).
  const capas: Record<number, string[]> = {};
  const ids = Object.keys(red.nodos);
  for (let i = 0; i < ids.length; i++) {
    const capa = capaPorNodo[ids[i]];
    if (capas[capa] === undefined) {
      capas[capa] = [];
    }
    capas[capa].push(ids[i]);
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
    const y =
      totalCapas <= 1
        ? alto / 2
        : margenY + (alto - 2 * margenY) * (capa / (totalCapas - 1));
    for (let i = 0; i < nodosDeLaCapa.length; i++) {
      const x = ancho * ((i + 1) / (nodosDeLaCapa.length + 1));
      posiciones[nodosDeLaCapa[i]] = { x, y };
    }
  }

  return posiciones;
}
