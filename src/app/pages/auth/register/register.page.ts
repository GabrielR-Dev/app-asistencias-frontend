import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiAuthService } from 'src/app/services/api/apiAuth/api-auth.service';
import { AuthService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  nombreUsuario: any;
  edad: any;
  genero: any;

  constructor(private authService: AuthService, private router: Router, private apiAuth: ApiAuthService) { }

  /*async register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    try {
      await this.authService.register(this.email, this.password, this.nombre, this.apellido);
      this.router.navigateByUrl('/login', { replaceUrl: true });
      console.log('Registro Exitoso');

      
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }*/
  async register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    try {

      // Registro en Firebase (opcional)
      //await this.authService.register(this.email, this.password, this.nombre, this.apellido);
      // Registro en tu API

      const response = await firstValueFrom(this.apiAuth.registerApi({
        nombre: this.nombre,
        apellido: this.apellido,
        nombreUsuario: this.nombreUsuario,
        email: this.email,
        contrasenia: this.password,
        edad: this.edad,
        genero: this.genero
      }));

      console.log('Registro exitoso:', response);
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error: any) {
      if (error.status === 400 && error.error && error.error.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Error al registrar usuario';
      }
      console.error('Error en registro:', error);
    }
  }
  irMenu() {
    this.router.navigate(['/page-public']);
  }
}