import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageSecurePage } from './page-secure.page';

const routes: Routes = [
  {
    path: '',
    component: PageSecurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSecurePageRoutingModule {}
