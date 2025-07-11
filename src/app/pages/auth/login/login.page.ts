import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiAuthService } from 'src/app/services/api/apiAuth/api-auth.service';
import { AuthService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-login',

  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  mostrarPassword: boolean = false;
  usuario: any;

  constructor(private authService: AuthService, private router: Router, private apiAuth: ApiAuthService) { }

  /*async login() {
    // Validación de campos vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }
    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Ingrese un correo electrónico válido.';
      return;
    }
    try {
      const cred = await this.authService.login(this.email, this.password);
      // Guarda el usuario y el token en localStorage para que el guard funcione
      const user = cred.user;
      if (user) {
        const token = await user.getIdToken();
        const usuarioLogueado = {
          id: user.uid,
          email: user.email,
          nombre: user.displayName || '',
        };
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
        localStorage.setItem('tokenFirebase', token);
        // Redirigir al menú correctamente y forzar recarga para evitar problemas de guard
        window.location.href = '/home/menu';
        return;
      }
    } catch (error: any) {
      // Errores comunes de Firebase
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'El correo electrónico no está registrado.';
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'Correo electrónico inválido.';
      } else if (error.code === 'auth/invalid-credential') {
        this.errorMessage = 'Email o contraceña incorrecta.';
      } else {
        this.errorMessage = error.message;
      }
    }
  }*/
  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    try {
      const response = await firstValueFrom(this.apiAuth.loginApi(this.email, this.password));
      // Guardar token u otro dato si es necesario
      localStorage.setItem('usuarioLogueado', JSON.stringify(response));
      this.errorMessage = '';
      window.location.href = '/home/menu';
      return;
    } catch (error: any) {
      this.errorMessage = error.error?.text || error.error || 'Error al iniciar sesión';
    }
  }


  //Ocultar contraseña
  ocultarContra() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  volverTabs() {
    this.router.navigate(['/home']);
  }
  irMenu() {
    this.router.navigate(['/home/menu']);
  }

}