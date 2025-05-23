import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargarMasDatosService } from 'src/app/services/cargar-mas-datos.service';
import { ListaM } from 'src/app/models/lista.model';
import { Materia } from 'src/app/models/materia.model';

// Simulación de usuario logueado
const usuario1 = {
  id: Date.now(),
  nombre: 'Valentín',
  apellido: 'Ojeda',
  mail: 'vale@gmail.com',
  dni: '12345678'
};
const usuario2 = {
  id: Date.now(),
  nombre: 'Gabriel',
  apellido: 'Rolon',
  mail: 'gabi@gmail.com',
  dni: '12345678'
};

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

  modalAbierto: boolean = false;
  materiaForm: any = {
    nombre: '',
    descripcion: '',
    creadorId: '',
    profesorId: '',
    profesorNombre: '',
    profesorApellido: ''
  };
  materias: Materia[] = [];

  // Buscar materia por código de invitación
  materiaBuscada: Materia | null = null;
  yaSuscripto: boolean = false;

  constructor(
    private router: Router,
    private cargarMasDatos: CargarMasDatosService
  ) { }

  ngOnInit() {
    //this.listaAsist = JSON.parse(localStorage.getItem('listas') || '[]')
    //this.cargaIniciadoraAsist()   //llama a una función para crear listas
    this.listaAsistCarga.push(...this.cargarMasDatos.cargarInicial(this.listaAsist))    //carga 10 listas de todas las que tengo

    // Cargar materias desde localStorage y mapear a instancias de Materia
    const materiasRaw = JSON.parse(localStorage.getItem('materias') || '[]');
    this.materias = materiasRaw.map((m: any) => new Materia(
      m.nombre,
      m.creadorId,
      m.descripcion,
      m.profesorNombre,
      m.profesorApellido,
      m.puntuacion,
      m.fechaCreacion,
      m.invitacion
    ));
  }

  //crea un par de listas de ejemplo
  cargaIniciadoraAsist() {
    for (let i = 0; i < 15; i++) {
      this.listaAsist.push(new ListaM(`Lista de Asistencias número ${i}`, i));
    }
    //esto es para agregar más listas, pero solo al local storage que guarda todas las listas de la app (listasApp) y a la variable que las representa (listasDisponibles)
    localStorage.setItem('listas', JSON.stringify(this.listaAsist))
    
    const todasLasListas: ListaM[] = [];
    todasLasListas.push(...this.listaAsist)
    for (let i = this.listaAsist.length + 1; i <= this.listaAsist.length + 10; i++) {
      todasLasListas.push(new ListaM(`Lista de Asistencias número ${i}`, i));
    }
    localStorage.setItem('listasApp', JSON.stringify(todasLasListas))
    this.listaAsistDisponibles.push(...todasLasListas)
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

  // Busca la materia por código de invitación en todas las materias guardadas
  agregarListaPorCodigo() {
    const materiasRaw = JSON.parse(localStorage.getItem('materias') || '[]');
    const materiaEncontrada = materiasRaw.find((m: any) => m.invitacion == this.codigoInvitacion);
    if (materiaEncontrada) {
      this.materiaBuscada = new Materia(
        materiaEncontrada.nombre,
        materiaEncontrada.creadorId,
        materiaEncontrada.descripcion,
        materiaEncontrada.profesorNombre,
        materiaEncontrada.profesorApellido,
        materiaEncontrada.puntuacion,
        materiaEncontrada.fechaCreacion,
        materiaEncontrada.invitacion
      );
    } else {
      this.materiaBuscada = null;
      this.yaSuscripto = false;
    }
  }

  // Suscribirse a la materia encontrada
  suscribirseAMateria() {
    if (this.materiaBuscada && !this.yaSuscripto) {
      this.materias.push(this.materiaBuscada);
      localStorage.setItem('materias', JSON.stringify(this.materias));
      this.yaSuscripto = true;
    }
  }

  // Lógica para crear una clase nueva (puedes personalizar los datos)
  crearClaseNueva() {
    const nuevaClase = new ListaM('Clase nueva ' + (this.listaAsist.length + 1), Date.now());
    this.listaAsist.push(nuevaClase);
    this.listaAsistCarga.push(nuevaClase);
    localStorage.setItem('listas', JSON.stringify(this.listaAsist));
  }

  // Modal de materias para crear
  abrirModal() {
    this.modalAbierto = true;

    this.materiaForm = {
      nombre: '',
      descripcion: '',
      creadorId: usuario2.id,
      profesorId: usuario2.id,
      profesorNombre: usuario2.nombre,
      profesorApellido: usuario2.apellido
    };
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  // Guarda una nueva materia creada por el usuario logueado
  guardarMateria() {
    if (!this.materiaForm.nombre || !this.materiaForm.descripcion) {
      return;
    }
    const nuevaMateria = new Materia(
      this.materiaForm.nombre,
      this.materiaForm.creadorId,
      this.materiaForm.descripcion,
      this.materiaForm.profesorNombre,
      this.materiaForm.profesorApellido
    );
    this.materias.push(nuevaMateria);
    localStorage.setItem('materias', JSON.stringify(this.materias));
    this.cerrarModal();

    // Limpiar el formulario
    this.materiaForm = {
      nombre: '',
      descripcion: '',
      creadorId: usuario1.id,
      profesorId: usuario1.id,
      profesorNombre: usuario1.nombre,
      profesorApellido: usuario1.apellido
    };
  }

  detalleMateria(materia: Materia) {
    // Guarda la materia seleccionada en localStorage y navega a la página de detalle
    localStorage.setItem('materiaDetalle', JSON.stringify(materia));
    this.router.navigate(['menu/materia-detalle']);
  }

  eliminarMateria(materia: Materia) {
    // Elimina la materia de la lista y del localStorage
    this.materias = this.materias.filter(m => m.invitacion !== materia.invitacion);
    localStorage.setItem('materias', JSON.stringify(this.materias));
    // Si la materia eliminada estaba siendo mostrada en el buscador, la oculta
    if (this.materiaBuscada && this.materiaBuscada.invitacion === materia.invitacion) {
      this.materiaBuscada = null;
      this.yaSuscripto = false;
    }
  }

}
