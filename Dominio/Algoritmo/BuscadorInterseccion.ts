import { Arco, Cadena, Resultado, PasoTraza } from "./Tipos";
import { RedSemantica } from "./RedSemantica";
import { Cola } from "../Cola/Cola";

// Una tarea pendiente en la cola: un nodo y desde qué origen llegó la marca.
interface Tarea {
  nodo: string;
  origen: string;
}

// Implementa la BÚSQUEDA POR INTERSECCIÓN (propagación de activación) de la sección 7.
//
// Idea: cada evidencia de la consulta enciende su propia "marca". Esa marca se propaga
// hacia los predecesores (en contra de la flecha). El primer nodo que reciba la marca de
// TODAS las evidencias es la ACTIVACIÓN / INTERSECCIÓN (p. ej. el sospechoso que las correlaciona).
export class BuscadorInterseccion {
  constructor(private red: RedSemantica) {}

  // Busca la activación común de una consulta de 2 o más evidencias.
  // Devuelve un Resultado (ver Tipos.ts), que incluye la traza paso a paso.
  buscar(consulta: string[]): Resultado {
    const totalOrigenes = consulta.length;

    // marca: por cada nodo, la lista de orígenes (evidencias) que ya lo alcanzaron.
    const marca: Record<string, string[]> = {};
    // padre: por cada combinación "nodo|origen", el arco por el que llegó esa marca.
    const padre: Record<string, Arco> = {};
    // cola: nodos pendientes de propagar, en orden de llegada (FIFO).
    const cola = new Cola<Tarea>();
    // visitados: orden en que se procesaron los nodos.
    const visitados: string[] = [];
    // traza: cada evento de la propagación, para poder animarlo paso a paso.
    const traza: PasoTraza[] = [];

    //  marca = {casquillo: [casquillo_9mm], placa_abc: [placa_abc]}

    // 1) SEMBRAR: cada evidencia de la consulta es su propio origen.
    for (let i = 0; i < consulta.length; i++) {
      const evidencia = consulta[i];
      marca[evidencia] = [evidencia];
      cola.encolar({ nodo: evidencia, origen: evidencia });
      traza.push({ tipo: "siembra", nodo: evidencia, origen: evidencia });
    }

    //

    // 2) PROPAGAR: avanzar hacia los predecesores hasta que un nodo junte todas las marcas.
    while (!cola.estaVacia()) {
      const actual = cola.desencolar()!;
      visitados.push(actual.nodo);

      const arcos = this.red.predecesores(actual.nodo);
      
      for (let i = 0; i < arcos.length; i++) {
        const arco = arcos[i];
        const vecino = arco.desde; // quién apunta hacia actual.nodo

        if (marca[vecino] === undefined) {
          marca[vecino] = [];
        }

        // Si el vecino aún no tenía la marca de este origen, se la pasamos.
        if (marca[vecino].indexOf(actual.origen) === -1) {
          marca[vecino].push(actual.origen); //marca[delito] = [casquilo_9mm]
          padre[vecino + "|" + actual.origen] = arco; //marca[delito|caquillo] = [casquilo_9mm

          //marca[delito] = [casquilo_9mm]

          // 3) DETECTAR INTERSECCIÓN: ¿el vecino ya tiene la marca de TODOS los orígenes?
          if (marca[vecino].length >= totalOrigenes) {
            traza.push({
              tipo: "interseccion",
              nodo: vecino,
              origen: actual.origen,
              desde: actual.nodo,
            });
            return {
              encontrado: true,
              interseccion: vecino,
              cadenas: this.reconstruir(vecino, consulta, padre),
              visitados: visitados,
              traza: traza,
            };
          }

          traza.push({ tipo: "marca", nodo: vecino, origen: actual.origen, desde: actual.nodo });
          cola.encolar({ nodo: vecino, origen: actual.origen });
        }
      }
    }

    // Si la cola se vació sin que nadie juntara todas las marcas: no hay correlación.
    return {
      encontrado: false,
      interseccion: null,
      cadenas: [],
      visitados: visitados,
      traza: traza,
    };
  }

  // 4) RECONSTRUIR: desde la intersección, arma la cadena de arcos hacia cada evidencia.
  private reconstruir(
    interseccion: string,
    consulta: string[],
    padre: Record<string, Arco>
  ): Cadena[] {
    const cadenas: Cadena[] = [];

    for (let i = 0; i < consulta.length; i++) {
      const origen = consulta[i];
      const pasos: Arco[] = [];
      let actual = interseccion;

      while (actual !== origen) {
        const arco = padre[actual + "|" + origen];
        if (arco === undefined) {
          break; // seguridad
        }
        pasos.push(arco);
        actual = arco.hacia;
      }

      cadenas.push({ origen: origen, pasos: pasos });
    }

    return cadenas;
  }
}
