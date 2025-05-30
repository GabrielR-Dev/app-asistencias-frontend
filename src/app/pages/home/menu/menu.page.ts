import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargarMasDatosService } from 'src/app/services/cargar-mas-datos.service';
import { ListaM } from 'src/app/models/lista.model';
import { Evento } from 'src/app/models/evento.model';

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
  eventoForm: any = {
    nombre: '',
    descripcion: '',
    creadorId: '',
    organizadorId: '',
    organizadorNombre: '',
    organizadorApellido: ''
  };
  eventos: Evento[] = [];

  // Buscar materia por código de invitación
  eventoBuscado: Evento | null = null;
  yaSuscripto: boolean = false;

  // Nuevo: usuario logueado
  usuarioLogueado: any = null;

  constructor(
    private router: Router,
    private cargarMasDatos: CargarMasDatosService
  ) { }

  ngOnInit() {
    //this.listaAsist = JSON.parse(localStorage.getItem('listas') || '[]')
    //this.cargaIniciadoraAsist()   //llama a una función para crear listas
    this.listaAsistCarga.push(...this.cargarMasDatos.cargarInicial(this.listaAsist))    //carga 10 listas de todas las que tengo

    // Cargar materias desde localStorage y mapear a instancias de Materia
    const eventosRaw = JSON.parse(localStorage.getItem('eventos') || '[]');
    this.eventos = eventosRaw.map((e: any) => new Evento(
      e.nombre,
      e.creadorId,
      e.descripcion,
      e.organizadorNombre,
      e.organizadorApellido,
      e.puntuacion,
      e.fechaCreacion,
      e.invitacion
    ));

    // Obtener usuario logueado real desde localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || 'null');
    if (usuarioLogueado && usuarioLogueado.id !== undefined && usuarioLogueado.id !== null && usuarioLogueado.id !== '') {
      this.usuarioLogueado = usuarioLogueado;
    } else {
      // Solo redirigir si NO está en la página de login y no hay usuario válido
      if (this.router.url !== '/login') {
        //this.router.navigate(['/login']);
        console.log('No hay usuario logueado, redirigiendo a login');
      }
      return;
    }

    // Al cargar eventos suscriptos desde storage, restaurar la descripción si existe
    const eventosSuscriptosRaw = JSON.parse(localStorage.getItem('eventosSuscriptos') || '[]');
    if (eventosSuscriptosRaw.length > 0) {
      this.listaAsistCarga = eventosSuscriptosRaw.map((e: any) => {
        const l = new ListaM(e.nombre, e.invitacion);
        l.invitacion = e.invitacion;
        (l as any).descripcion = e.descripcion || '';
        (l as any).creadorNombre = e.creadorNombre || '';
        return l;
      });
    }
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
    this.router.navigate(['/evento-suscripto', id]);
  }

  //elimina una lista de lo que está cargado, de todas las que tenes y actualiza el localstorage
  //recordad de cambiar el nombre por id cuando se complete el proyecto
  eliminar(idFav: any, lista: ListaM[]) {

    let listaActualizada = lista.filter(item => item.nombre !== idFav);
    this.listaAsistCarga = listaActualizada.slice(0, this.listaAsistCarga.length);
    this.listaAsist = listaActualizada;
    
    localStorage.setItem('listas', JSON.stringify(listaActualizada));
    // Permitir volver a suscribirse si se elimina de la lista suscripta
    this.yaSuscripto = false;
  }

  // Busca la materia por código de invitación en todas las materias guardadas
  agregarListaPorCodigo() {

    const eventosRaw = JSON.parse(localStorage.getItem('eventos') || '[]');
    const eventoEncontrado = eventosRaw.find((e: any) => e.invitacion == this.codigoInvitacion);

    if (eventoEncontrado) {
      this.eventoBuscado = new Evento(
        eventoEncontrado.nombre,
        eventoEncontrado.creadorId,
        eventoEncontrado.descripcion,
        eventoEncontrado.organizadorNombre,
        eventoEncontrado.organizadorApellido,
        eventoEncontrado.puntuacion,
        eventoEncontrado.fechaCreacion,
        eventoEncontrado.invitacion
      );

      // Verificar si ya está suscripto (solo si sigue en la lista)
      this.yaSuscripto = this.listaAsistCarga.some(e => e.invitacion == eventoEncontrado.invitacion);
    } else {
      this.eventoBuscado = null;
      this.yaSuscripto = false;
    }
  }

  // Suscribirse a la materia encontrada
  suscribirseAEvento() {
    if (this.eventoBuscado && !this.yaSuscripto) {
      const invitacion = Number(this.eventoBuscado.invitacion) || Date.now();
      const listaSuscripta = new ListaM(
        this.eventoBuscado.nombre,
        invitacion
      );
      listaSuscripta.invitacion = invitacion;
      // Agregar descripción al objeto ListaM para mostrarla en la lista
      (listaSuscripta as any).descripcion = this.eventoBuscado.descripcion || '';
      // Guardar el nombre del creador del evento
      (listaSuscripta as any).creadorNombre = this.eventoBuscado.organizadorNombre || '';
      this.listaAsistCarga.push(listaSuscripta);
      localStorage.setItem('eventosSuscriptos', JSON.stringify(this.listaAsistCarga));
      this.yaSuscripto = true;
      // Asegura que al suscribirse también se guarde el eventoDetalle correctamente
      localStorage.setItem('eventoDetalle', JSON.stringify(this.eventoBuscado));
      this.eventoBuscado = null;
      this.codigoInvitacion = '';
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
    // Usar el usuario logueado real
    const usuarioLogueado = this.usuarioLogueado;
    this.eventoForm = {
      nombre: '',
      descripcion: '',
      creadorId: usuarioLogueado.id,
      organizadorId: usuarioLogueado.id,
      organizadorNombre: usuarioLogueado.nombre,
      organizadorApellido: usuarioLogueado.apellido
    };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  // Guarda una nueva materia creada por el usuario logueado
  guardaEvento() {
    if (!this.eventoForm.nombre || !this.eventoForm.descripcion) {
      return;
    }
    // Usar datos del usuario logueado para el evento
    const usuarioLogueado = this.usuarioLogueado;

    const nuevoEvento = new Evento(
      this.eventoForm.nombre,
      usuarioLogueado.id,
      this.eventoForm.descripcion,
      usuarioLogueado.nombre,
      usuarioLogueado.apellido
    );

    this.eventos.push(nuevoEvento);
    localStorage.setItem('eventos', JSON.stringify(this.eventos));

    this.cerrarModal();

    this.eventoForm = {
      nombre: '',
      descripcion: '',
      creadorId: usuarioLogueado.id,
      organizadorId: usuarioLogueado.id,
      organizadorNombre: usuarioLogueado.nombre,
      organizadorApellido: usuarioLogueado.apellido
    };
  }

  detalleEvento(evento: Evento) {
    // Guarda la materia seleccionada en localStorage y navega a la página de detalle

    localStorage.setItem('eventoDetalle', JSON.stringify(evento));
    this.router.navigate(['menu/materia-detalle']);

  }

  eliminarEvento(evento: Evento) {
    // Elimina la materia de la lista y del localStorage
    this.eventos = this.eventos.filter(e => e.invitacion !== evento.invitacion);
    localStorage.setItem('eventos', JSON.stringify(this.eventos));

    // Si la materia eliminada estaba siendo mostrada en el buscador, la oculta
    if (this.eventoBuscado && this.eventoBuscado.invitacion === evento.invitacion) {
      this.eventoBuscado = null;
      this.yaSuscripto = false;
    }
  }

}
