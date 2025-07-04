import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventoSuscriptoPage } from './evento-suscripto.page';

const routes: Routes = [
  {
    path: '',
    component: EventoSuscriptoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoSuscriptoPageRoutingModule {}
