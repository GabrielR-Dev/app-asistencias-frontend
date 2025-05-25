import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MateriaDetallePage } from './materia-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: MateriaDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MateriaDetallePageRoutingModule {}
