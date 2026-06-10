// Demostración de la LÓGICA (sin frontend). Corre búsquedas y muestra qué devuelve.
//
// Cómo ejecutarla (desde la carpeta busqueda-por-interseccion):
//   npx tsx Dominio/Demostracion.ts
//
// No es parte del frontend: es solo para comprobar que la lógica funciona.

import RedDelitos from "./Data/RedDelitos.json";
import { Red } from "./Algoritmo/Tipos";
import { RedSemantica } from "./Algoritmo/RedSemantica";
import { BuscadorInterseccion } from "./Algoritmo/BuscadorInterseccion";
import { construirRelacion } from "./Algoritmo/ConstructorRelacion";

const red = new RedSemantica(RedDelitos as Red);
const buscador = new BuscadorInterseccion(red);

function correr(consulta: string[]) {
  const r = buscador.buscar(consulta);
  console.log("\n=== Consulta:", consulta, "===");
  console.log("Intersección (activación):", r.interseccion);
  console.log("Traza (paso a paso):");
  for (let i = 0; i < r.traza.length; i++) {
    const t = r.traza[i];
    const desde = t.desde ? "  (desde " + t.desde + ")" : "";
    console.log("  " + (i + 1) + ". [" + t.tipo + "] " + t.nodo + " ← " + t.origen + desde);
  }
  const relacion = construirRelacion(r, red, consulta);
  if (relacion) console.log("Delitos correlacionados:", relacion.delitos);
}

// Caso 1: Juan Pérez correlaciona Robo #1023 y Homicidio #88.
correr(["casquillo_9mm", "placa_abc123"]);

// Caso 2: El Flaco correlaciona Homicidio #88 y Robo #204.
correr(["fibra_f9", "guante_g2"]);

// Caso 3: María López correlaciona Robo #204 y Hurto #55.
correr(["adn_x7", "colilla_c3"]);
