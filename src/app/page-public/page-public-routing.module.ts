import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagePublicPage } from './page-public.page';

const routes: Routes = [
  {
    path: '',
    component: PagePublicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagePublicPageRoutingModule {}
