import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/Utilidades";

// Botón estilo shadcn: variantes con class-variance-authority (cva) + cn.
const variantesBoton = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-fondo disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variante: {
        solido: "bg-acento text-acento-fg hover:bg-acento/85",
        contorno: "border border-borde bg-transparent text-texto hover:bg-panel-2",
        fantasma: "text-texto hover:bg-panel-2",
      },
      tamaño: {
        normal: "h-10 px-4 text-sm",
        pequeño: "h-8 px-3 text-xs",
        grande: "h-12 px-6 text-base",
        icono: "h-9 w-9",
      },
    },
    defaultVariants: { variante: "solido", tamaño: "normal" },
  }
);

export interface PropsBoton
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantesBoton> {}

export const Boton = React.forwardRef<HTMLButtonElement, PropsBoton>(
  ({ className, variante, tamaño, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variantesBoton({ variante, tamaño }), className)}
      {...props}
    />
  )
);
Boton.displayName = "Boton";
