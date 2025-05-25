import { Component, OnInit } from '@angular/core';
import { Materia } from 'src/app/models/materia.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-materia-detalle',
  templateUrl: './materia-detalle.page.html',
  styleUrls: ['./materia-detalle.page.scss'],
  standalone: false
})
export class MateriaDetallePage implements OnInit {
  materia: Materia | null = null;
  clasesFuturas: any[] = [];
  clasesEnCurso: any[] = [];
  clasesPasadas: any[] = [];

  constructor(private location: Location) {}

  ngOnInit() {
    const materiaRaw = localStorage.getItem('materiaDetalle');
    if (materiaRaw) {
      const m = JSON.parse(materiaRaw);
      this.materia = new Materia(
        m.nombre,
        m.creadorId,
        m.descripcion,
        m.profesorNombre,
        m.profesorApellido,
        m.puntuacion,
        m.fechaCreacion,
        m.invitacion
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
