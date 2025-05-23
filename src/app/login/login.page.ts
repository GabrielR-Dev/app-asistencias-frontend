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
  
  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      console.log('Login exitoso:', user);
      this.router.navigateByUrl('/page-secure', { replaceUrl: true }); // Cambia a la página que quieras
    } catch (error: any) {
      this.errorMessage = 'Error de conexion';
    }
  }


  //Ocultar contraseña
  ocultarContra() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  
  
  ngOnInit() {
  }
  irMenu(){
    this.router.navigate(['/page-public']);
  }
}