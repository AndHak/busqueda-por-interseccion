import { Red, Nodo, Arco } from "./Tipos";

// Envuelve la red semántica y ofrece las consultas que necesita el algoritmo.
// La idea: el resto del código no toca el JSON directamente, sino que le pregunta a esta clase.
export class RedSemantica {
  constructor(private red: Red) {}

  // ¿Existe un nodo con ese id en la red?
  existe(id: string): boolean {
    return this.red.nodos[id] !== undefined;
  }

  // Devuelve el nodo con ese id (o undefined si no existe).
  nodo(id: string): Nodo | undefined {
    return this.red.nodos[id];
  }

  // Acceso a los datos crudos.
  get datos(): Red {
    return this.red;
  }

  // Predecesores de un nodo: todos los arcos que APUNTAN HACIA él.
  // Se usa para buscar la activación caminando "en contra de la flecha":
  // desde cada evidencia subimos hacia quién pudo originarla.
  // Incluye los arcos de herencia (instancia / es un), que son arcos como cualquier otro.
  predecesores(id: string): Arco[] {
    const lista: Arco[] = [];
    for (let i = 0; i < this.red.arcos.length; i++) {
      const arco = this.red.arcos[i];
      if (arco.hacia === id) {
        lista.push(arco);
      }
    }
    return lista;
  }

  // Todos los nodos que son evidencias.
  evidencias(): Nodo[] {
    const lista: Nodo[] = [];
    const ids = Object.keys(this.red.nodos);
    for (let i = 0; i < ids.length; i++) {
      const nodo = this.red.nodos[ids[i]];
      if (nodo.tipo === "evidencia") {
        lista.push(nodo);
      }
    }
    return lista;
  }
}
