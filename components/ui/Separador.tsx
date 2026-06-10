import * as React from "react";
import { cn } from "@/lib/Utilidades";

// Separador: una línea fina para dividir secciones.
export function Separador({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-borde", className)} {...props} />;
}
