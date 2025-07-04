import { Component, OnInit } from '@angular/core';

import { UsuarioM } from 'src/app/models/usuario.model';
import { UsuarioPresente } from 'src/app/models/usuarioPresente.model';
import { ApiAsistenciasService } from 'src/app/services/api/apiAsistencias/api-asistencias.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-participantes',
  templateUrl: './presentes.page.html',
  styleUrls: ['./presentes.page.scss'],
  standalone:false
})


export class PresentesPage implements OnInit {
listaPresentes:UsuarioPresente [] = [];

  estaCargando: boolean = true;

  constructor(private apiAsistencias: ApiAsistenciasService, private route:ActivatedRoute) { }

 async ngOnInit() {

const id= this.route.snapshot.paramMap.get('id');
if (id) {
      
      const idAsistencia = +id;

      this.cargarListaPresentes(idAsistencia);

    } else {

      console.error("No se encontró un ID en la URL para cargar los presentes");
      
    }
  }


cargarListaPresentes (id:number)
{

  this.estaCargando = true;

this.apiAsistencias.verPresentes(id).subscribe ({
next:(datos)=> {console.log("si",datos);
 
if (Array.isArray(datos)) {
        
        this.listaPresentes = datos;
      } else if (datos) {
        //
        this.listaPresentes = [datos];
      } else {
       
        this.listaPresentes = [];
      }
},
error: (err) => {
        console.error('Ocurrió un error al cargar la lista:', err);
        this.estaCargando = false; 
      }

 });


}
}
