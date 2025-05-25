import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-evento-detalle',
  templateUrl: './evento-detalle.page.html',
  styleUrls: ['./evento-detalle.page.scss'],
  standalone: false
})
export class EventoDetallePage implements OnInit {
  evento: Evento | null = null;
  clasesFuturas: any[] = [];
  clasesEnCurso: any[] = [];
  clasesPasadas: any[] = [];

  constructor(private location: Location) {}

  ngOnInit() {
    const eventoRaw = localStorage.getItem('eventoDetalle');
    if (eventoRaw) {
      const e = JSON.parse(eventoRaw);
      this.evento = new Evento(
        e.nombre,
        e.creadorId,
        e.descripcion,
        e.organizadorNombre,
        e.organizadorApellido,
        e.puntuacion,
        e.fechaCreacion,
        e.invitacion
      );
    }
    // Simulación de clases (debería venir de un servicio o base de datos)
    this.clasesFuturas = [
      { nombre: 'Clase 1', fecha: '2025-06-01', estado: 'futura' },
      { nombre: 'Clase 2', fecha: '2025-06-10', estado: 'futura' }
    ];
    this.clasesEnCurso = [
      { nombre: 'Clase 3', fecha: '2025-05-23', estado: 'en curso' }
    ];
    this.clasesPasadas = [
      { nombre: 'Clase 0', fecha: '2025-05-10', estado: 'pasada' }
    ];
  }

  // Método para volver atrás
  volverAtras() {
    this.location.back();
  }
}
