// Tipos (interfaces) del dominio de la búsqueda por intersección.

// Un nodo de la red semántica: un concepto o un individuo.
export interface Nodo {
  id: string;
  tipo: "sospechoso" | "evidencia" | "delito" | "clase" | "lugar" | "fecha";
  etiqueta: string; // texto legible para mostrar (p. ej. "Casquillo 9mm")
}

// Un arco dirigido: la relación "desde --etiqueta--> hacia".
// Ejemplo: { desde: "juan_perez", etiqueta: "dejó", hacia: "casquillo_9mm" }
export interface Arco {
  desde: string;
  etiqueta: string;
  hacia: string;
}

// La red semántica completa: un diccionario de nodos + la lista de arcos.
export interface Red {
  nodos: Record<string, Nodo>;
  arcos: Arco[];
}

// Una cadena: cómo la intersección se conecta con UNA evidencia de la consulta.
// Es la "justificación" de por qué esa activación explica esa evidencia.
export interface Cadena {
  origen: string; // la evidencia consultada
  pasos: Arco[];  // arcos desde la intersección hasta esa evidencia
}

// Un paso de la TRAZA: un evento de la propagación, para animar el algoritmo.
//  - "siembra"     : una evidencia de la consulta arranca con su propia marca.
//  - "marca"       : un nodo recibe la marca de un origen (viene desde otro nodo).
//  - "interseccion": ese nodo completó las marcas de TODOS los orígenes (la activación).
export interface PasoTraza {
  tipo: "siembra" | "marca" | "interseccion";
  nodo: string;    // nodo que queda marcado en este paso
  origen: string;  // evidencia de la que proviene la marca
  desde?: string;  // nodo desde el que se propagó la marca (en "marca"/"interseccion")
}

// Lo que DEVUELVE la búsqueda por intersección.
export interface Resultado {
  encontrado: boolean;         // ¿se halló una activación común?
  interseccion: string | null; // id de la activación (p. ej. el sospechoso); null si no hay
  cadenas: Cadena[];           // justificación: una cadena por cada evidencia de la consulta
  visitados: string[];         // orden en que se exploraron los nodos
  traza: PasoTraza[];          // paso a paso de la propagación
}

// Una RELACIÓN guardada: el resultado de una búsqueda que el usuario decide conservar
// para utilizarla después. Se serializa a Data/Relaciones.json.
export interface Relacion {
  id: string;            // id único de la relación guardada
  fecha: string;         // fecha/hora en que se guardó (ISO 8601)
  consulta: string[];    // ids de las evidencias consultadas
  evidencias: string[];  // etiquetas legibles de esas evidencias
  interseccion: string;  // id de la activación encontrada
  activacion: string;    // etiqueta legible de la activación (p. ej. "Juan Pérez")
  delitos: string[];     // etiquetas de los delitos que quedaron correlacionados
  cadenas: Cadena[];     // la justificación (cadenas activación -> evidencia)
}
