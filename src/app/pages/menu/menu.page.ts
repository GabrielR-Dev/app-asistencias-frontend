import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CargarMasDatosService } from 'src/app/services/cargar-mas-datos.service';

import { ListaM } from 'src/app/models/lista.model';
import { UsuarioM } from 'src/app/models/usuario.model';
import { ConnectableObservable } from 'rxjs';


@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})

export class MenuPage implements OnInit {
  listaAsist: ListaM[] = [];
  listaAsistCarga: ListaM[] = [];
  listaAsistDisponibles: ListaM[] = [];
  codigoInvitacion: string = '';


  constructor(
    private router: Router,
    private cargarMasDatos: CargarMasDatosService
  ) { }

  ngOnInit() {
    //this.listaAsist = JSON.parse(localStorage.getItem('listas') || '[]')
    this.cargaIniciadoraAsist()   //llama a una función para crear listas
    this.listaAsistCarga.push(...this.cargarMasDatos.cargarInicial(this.listaAsist))    //carga 10 listas de todas las que tengo

  }

  //crea un par de listas de ejemplo
  cargaIniciadoraAsist() {
    for (let i = 0; i < 15; i++) {
      this.listaAsist.push(new ListaM(`Lista de Asistencias número ${i}`, i));
    }
    localStorage.setItem('listas', JSON.stringify(this.listaAsist))
    //esto es para agregar más listas, pero solo al local storage que guarda todas las listas de la app (listasApp) y a la variable que las representa (listasDisponibles)
    const todasLasListas: ListaM[] = [];
    todasLasListas.push(...this.listaAsist)
    for (let i = this.listaAsist.length + 1; i <= this.listaAsist.length + 10; i++) {
      todasLasListas.push(new ListaM(`Lista de Asistencias número ${i}`, i));
    }
    localStorage.setItem('listasApp', JSON.stringify(todasLasListas))
    this.listaAsistDisponibles.push(...todasLasListas)
    console.log(this.listaAsistDisponibles[17].invitacion)
    console.log(this.listaAsistDisponibles);
  }

  //carga mas de las listas que tengo (carga de a 10)
  cargarMasListas() {
    const carga = this.cargarMasDatos.cargarMas(this.listaAsist, this.listaAsistCarga);
    this.listaAsistCarga.push(...carga);
  }

  //te lleva a una página donde estará todo el detalle de la lista
  detalle(id: any, lista: ListaM[]) {
    let detalle = lista.filter(item => item.nombre === id)
    localStorage.setItem('detalle', JSON.stringify(detalle))
    this.router.navigate(['/detalle', id]);
  }

  //elimina una lista de lo que está cargado, de todas las que tenes y actualiza el localstorage
  //recordad de cambiar el nombre por id cuando se complete el proyecto
  eliminar(idFav: any, lista: ListaM[]) {
    let listaActualizada = lista.filter(item => item.nombre !== idFav);
    this.listaAsistCarga = listaActualizada.slice(0, this.listaAsistCarga.length);
    this.listaAsist = listaActualizada;
    localStorage.setItem('listas', JSON.stringify(listaActualizada))
  }

  agregarListaPorCodigo() {
    const listaEncontrada = this.listaAsistDisponibles.find(
      item => String(item.invitacion) === this.codigoInvitacion
    );
    console.log("El código que usted buscó fue", this.codigoInvitacion)
    console.log("El código que usted encontró fue", listaEncontrada?.invitacion)
    console.log(listaEncontrada)

    if (listaEncontrada) {
      // Verifica que no esté agregada
      const yaExiste = this.listaAsist.some(item => item.invitacion === listaEncontrada.invitacion);

      if (!yaExiste) {
        const longCarga = this.listaAsistCarga.length;
        this.listaAsistCarga.push(listaEncontrada);
        const restoTotal = this.listaAsist.slice(longCarga, this.listaAsist.length)
        this.listaAsist = [...this.listaAsistCarga];
        this.listaAsist.push(...restoTotal)
        localStorage.setItem('listas', JSON.stringify(this.listaAsist));
        console.log('Lista agregada');
      } else {
        console.log('Ya existe esa lista en tus guardadas');
      }
    } else {
      console.log('Código no válido');
    }

    this.codigoInvitacion = ''; // limpia el input
  }
}
