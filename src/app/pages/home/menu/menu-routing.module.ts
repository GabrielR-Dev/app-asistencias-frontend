import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage
  },
  {
    path: 'materia-detalle',
    loadChildren: () => import('../evento-detalle/evento-detalle.module').then(m => m.EventoDetallePageModule)
  },
  {
    path: 'evento-suscripto',
    loadChildren: () => import('../evento-suscripto/evento-suscripto.module').then(m => m.EventoSuscriptoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
