import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarMasDatosService {

  constructor() { }

  //pasa las listas de "listaAsist" a "listaAsistCarga", esta ultima variable sera la mostrada por pantalla
  cargarInicial(listaCompletaParam: any) {
    if (listaCompletaParam.length < 10) {
      const limite = listaCompletaParam.length
      const nuevaLista = listaCompletaParam.slice(0, limite);
      return nuevaLista;
    }
    else {
      const nuevaLista = listaCompletaParam.slice(0, 10);
      return nuevaLista;
    }
  }

  //carga mas datos tomando en cuenta donde se quedo la array que carga por pantalla
  cargarMas(listaCompletaParam: any, listaCargadaParam: any) {
    const longitudCarga = listaCargadaParam.length;
    const siguienteCarga = listaCompletaParam.slice(longitudCarga, longitudCarga + 10);
    return siguienteCarga;
  }
}
