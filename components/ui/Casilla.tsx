import * as React from "react";
import { cn } from "@/lib/Utilidades";

// Casilla de verificación VISUAL (no interactiva por sí misma):
// la fila que la contiene es la que maneja el clic. Así evitamos botones anidados.
export function Casilla({ marcado, className }: { marcado: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
        marcado
          ? "border-acento bg-acento text-acento-fg"
          : "border-borde bg-transparent",
        className
      )}
    >
      {marcado && (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
