import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// cn: combina clases condicionales (clsx) y resuelve conflictos de Tailwind (twMerge).
// Es la utilidad estándar del patrón shadcn/ui.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
