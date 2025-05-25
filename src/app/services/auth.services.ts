import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuarioLogueado');
  }

  async register(email: string, password: string, nombre?: string, apellido?: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    // Guarda nombre y apellido en el perfil de Firebase
    if (userCredential.user && (nombre || apellido)) {
      await userCredential.user.updateProfile({ displayName: `${nombre || ''} ${apellido || ''}`.trim() });
    }
    // Guarda el usuario en localStorage para mantener la sesión
    const usuarioLogueado = {
      id: userCredential.user?.uid,
      email: userCredential.user?.email,
      nombre: nombre,
      apellido: apellido,
    };
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
    // Guarda el token de Firebase
    const token = await userCredential.user?.getIdToken();
    if (token) {
      localStorage.setItem('tokenFirebase', token);
    }
    return userCredential;
  }
}