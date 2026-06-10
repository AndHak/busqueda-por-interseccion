import type { Metadata } from "next";
import { Special_Elite, Archivo } from "next/font/google";
import "./globals.css";

// Fuentes distintivas: máquina de escribir (display) + sans condensada (cuerpo).
const display = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

const cuerpo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Búsqueda por Intersección — Correlación de Evidencias",
  description:
    "Visualizador de búsqueda por intersección (activación en redes semánticas) para correlacionar delitos a través de sus evidencias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${cuerpo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
