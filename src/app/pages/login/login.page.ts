import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/secure']);
        // acá podés redirigir a otra página si querés
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      });
  }
  //Ocultar contraseña
  ocultarContra() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  volverTabs(){
    this.router.navigate(['/home']);
  }

}