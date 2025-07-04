import { Component, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage  {

  usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}'); // Guardammos datos del usuario que inicio sesion
  

  seleccionarImagen: string | ArrayBuffer | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  cambiarFoto() {
    this.fileInput.nativeElement.click();
  }

  imagenElegida(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.seleccionarImagen = reader.result;
    };
    reader.readAsDataURL(archivo);
  }
 
  


}
