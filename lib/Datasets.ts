import RedDelitos from "@/Dominio/Data/RedDelitos.json";
import RedDelitosMediana from "@/Dominio/Data/RedDelitosMediana.json";
import RedDelitosGrande from "@/Dominio/Data/RedDelitosGrande.json";
import { Red } from "@/Dominio/Algoritmo/Tipos";

// Un dataset = un archivo JSON de evidencias/delitos que la app puede cargar.
export interface Dataset {
  id: string;
  nombre: string;
  descripcion: string;
  red: Red;
}

// Los datasets disponibles para elegir en el frontend.
export const datasets: Dataset[] = [
  {
    id: "ejemplo",
    nombre: "Caso práctico (ejemplo)",
    descripcion: "Red pequeña para empezar: 4 delitos, 8 evidencias, 3 sospechosos.",
    red: RedDelitos as Red,
  },
  {
    id: "Mediana",
    nombre: "Caso mediano",
    descripcion:
      "Red densa: un homicidio compartido por 3 criminales y muchas conexiones cruzadas.",
    red: RedDelitosMediana as Red,
  },
  {
    id: "Grande",
    nombre: "Caso grande",
    descripcion:
      "Red densa: un homicidio compartido por muchos criminales y muchas conexiones cruzadas.",
    red: RedDelitosGrande as Red,
  },
];
