import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  constructor(private authService: AuthService, private router: Router) { }

  //Borramos historias de LocalStorage
  async logout() {
    //await this.authService.logout();
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('suscripciones');
    localStorage.removeItem('eventos');
    this.router.navigateByUrl('/login', { replaceUrl: true });
    localStorage.removeItem('presentismosMarcados');
    localStorage.removeItem('asistencia');

  }
}
