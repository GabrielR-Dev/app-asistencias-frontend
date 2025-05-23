import { Component } from '@angular/core';
import { AuthService } from '../services/auth.services';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
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
  }
  irMenu(){
    this.router.navigate(['/page-public']);
  }
}