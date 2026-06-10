import * as React from "react";
import { cn } from "@/lib/Utilidades";

// Tarjeta estilo shadcn: un panel con borde y fondo, más sus sub-partes.
export function Tarjeta({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-borde bg-panel/80 backdrop-blur-sm shadow-lg shadow-black/30",
        className
      )}
      {...props}
    />
  );
}

export function TarjetaEncabezado({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-4 pb-2", className)} {...props} />;
}

export function TarjetaTitulo({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "fuente-display text-sm uppercase tracking-[0.15em] text-texto-tenue",
        className
      )}
      {...props}
    />
  );
}

export function TarjetaContenido({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-2", className)} {...props} />;
}
