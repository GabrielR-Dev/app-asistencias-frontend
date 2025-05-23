import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {Router} from '@angular/router';


@Component({
  selector: 'app-page-secure',
  templateUrl: './page-secure.page.html',
  styleUrls: ['./page-secure.page.scss'],
  standalone: false,
})
export class PageSecurePage implements OnInit {
  private auth = getAuth();
  constructor(private router : Router) { }

  ngOnInit() {
  }
  async logout(): Promise<void> {
  try {
    await signOut(this.auth);
    this.router.navigate(['/page-public']); // 👈 Redirige al login
    console.log('Sesion cerrada');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
}
