import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresentesPage } from './presentes.page';

const routes: Routes = [
  {
    path: '',
    component: PresentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresentesPageRoutingModule {}
