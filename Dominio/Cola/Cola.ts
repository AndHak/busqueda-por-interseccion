// Cola FIFO: lo primero que entra es lo primero que sale.
// Vive en su propia carpeta porque es genérica e independiente del algoritmo:
// solo sabe de "encolar/desencolar", no sabe nada de la red de delitos.
export class Cola<T> {
  private elementos: T[] = [];

  // Mete un elemento por el final de la cola.
  encolar(elemento: T): void {
    this.elementos.push(elemento);
  }

  // Saca y devuelve el elemento del frente (el más antiguo). undefined si está vacía.
  desencolar(): T | undefined {
    return this.elementos.shift();
  }

  // Indica si la cola no tiene elementos.
  estaVacia(): boolean {
    return this.elementos.length === 0;
  }

  // Cantidad de elementos que hay en la cola.
  get tamaño(): number {
    return this.elementos.length;
  }
}
