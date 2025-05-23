<<<<<<< Updated upstream
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'login',
<<<<<<< Updated upstream
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
=======
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
>>>>>>> Stashed changes
  },
  {
    path: 'secure',
    loadChildren: () => import('./secure/secure.module').then((m) => m.SecurePageModule),
  },
  {
    path: 'home',
<<<<<<< Updated upstream
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
=======
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
>>>>>>> Stashed changes
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
=======
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'secure',
    loadChildren: () => import('./secure/secure.module').then((m) => m.SecurePageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
>>>>>>> Stashed changes
export class AppRoutingModule { }