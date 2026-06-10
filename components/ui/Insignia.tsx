import * as React from "react";
import { cn } from "@/lib/Utilidades";

// Insignia (badge): etiqueta pequeña. Acepta un color de fondo opcional por estilo en línea.
export interface PropsInsignia extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
}

export function Insignia({ className, color, style, ...props }: PropsInsignia) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{
        borderColor: color ? `${color}66` : "var(--borde)",
        color: color ?? "var(--texto)",
        backgroundColor: color ? `${color}1a` : "transparent",
        ...style,
      }}
      {...props}
    />
  );
}
