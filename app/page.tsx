"use client";

import { useEffect, useState } from "react";
import { useBusqueda } from "@/hooks/useBusqueda";
import { useAnimacion } from "@/hooks/useAnimacion";
import { useRelaciones } from "@/hooks/useRelaciones";
import { construirRelacion } from "@/Dominio/Algoritmo/ConstructorRelacion";
import { SelectorEvidencias } from "@/components/SelectorEvidencias";
import { Leyenda } from "@/components/Leyenda";
import { VistaRed } from "@/components/VistaRed";
import { ControlesAnimacion } from "@/components/ControlesAnimacion";
import { PanelActivacion } from "@/components/PanelActivacion";
import { TarjetaCorrelacion } from "@/components/TarjetaCorrelacion";
import { RelacionesGuardadas } from "@/components/RelacionesGuardadas";
import { SelectorDataset } from "@/components/SelectorDataset";
import { Tarjeta, TarjetaContenido } from "@/components/ui/Tarjeta";
import { datasets } from "@/lib/Datasets";

// Pantalla principal: junta la consulta, el lienzo animado y los resultados,
// todo conectado a la lógica del dominio (sección 7).
export default function Home() {
    // Dataset (archivo JSON) elegido. Empieza en el caso práctico de ejemplo.
    const [datasetId, setDatasetId] = useState(datasets[0].id);
    const dataset = datasets.find((d) => d.id === datasetId) ?? datasets[0];

    const {
        red,
        consulta,
        resultado,
        error,
        alternarEvidencia,
        buscar,
        limpiar,
    } = useBusqueda(dataset.red);
    const anim = useAnimacion(resultado);
    const { relaciones, guardar, eliminar, exportar } = useRelaciones();

    // ¿La relación actual ya fue guardada? Se reinicia al cambiar el resultado.
    const [guardado, setGuardado] = useState(false);
    useEffect(() => {
        setGuardado(false);
    }, [resultado]);

    function alGuardar() {
        if (!resultado) return;
        const relacion = construirRelacion(resultado, red, consulta);
        if (relacion) {
            guardar(relacion);
            setGuardado(true);
        }
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8">
            {/* Encabezado */}
            <header className="mb-6 border-b border-borde pb-4 flex justify-between">
                <div className="justify-center flex flex-col">
                    <p className="fuente-display text-xs uppercase tracking-[0.4em] text-acento">
                        Proyecto final · Sistemas Inteligentes
                    </p>
                    <h1 className="fuente-display mt-1 text-3xl text-texto md:text-4xl">
                        Búsqueda por Intersección
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm text-texto-tenue">
                        Correlaciona delitos encontrando la{" "}
                        <span className="text-texto">activación</span>: el nodo
                        del que salen arcos hacia las evidencias consultadas.
                    </p>
                </div>
                <div className="space-y-1 items-end justify-center flex flex-col">
                    <h2 className="flex flex-col">Presentado por:</h2>
                    <p className="flex flex-col text-sm text-zinc-300 ml-3 items-end">
                        <span>Andres Felipe Martinez Guerra</span>
                        <span>Sebastian David Ordoñez Bolaños</span>
                        <span>Juan Felipe Pantoja Andrade</span>
                        <span>Brigith Daniela Espinosa Matabanchoy</span>
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
                {/* Columna izquierda: consulta, leyenda, relaciones */}
                <aside className="flex flex-col gap-4">
                    <SelectorDataset datasetId={datasetId} onCambiar={setDatasetId} />
                    <SelectorEvidencias
                        red={red}
                        consulta={consulta}
                        error={error}
                        onAlternar={alternarEvidencia}
                        onBuscar={buscar}
                        onLimpiar={limpiar}
                    />
                    <Leyenda />
                    <RelacionesGuardadas
                        relaciones={relaciones}
                        onEliminar={eliminar}
                        onExportar={exportar}
                    />
                </aside>

                {/* Columna derecha (ancha): lienzo + controles + resultado abajo */}
                <section className="flex min-w-0 flex-col gap-4">
                    <Tarjeta>
                        <TarjetaContenido className="p-3">
                            <VistaRed
                                red={red}
                                consulta={consulta}
                                resultado={resultado}
                                paso={anim.paso}
                                totalPasos={anim.totalPasos}
                            />
                        </TarjetaContenido>
                    </Tarjeta>

                    <ControlesAnimacion
                        habilitado={resultado !== null}
                        {...anim}
                    />

                    {/* El resultado va ABAJO del mapa, en dos columnas */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <PanelActivacion
                            red={red}
                            resultado={resultado}
                            onGuardar={alGuardar}
                            guardado={guardado}
                        />
                        <TarjetaCorrelacion red={red} resultado={resultado} />
                    </div>
                </section>
            </div>
        </div>
    );
}
