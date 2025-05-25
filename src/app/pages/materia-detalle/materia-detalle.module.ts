import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MateriaDetallePageRoutingModule } from './materia-detalle-routing.module';

import { MateriaDetallePage } from './materia-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MateriaDetallePageRoutingModule
  ],
  declarations: [MateriaDetallePage]
})
export class MateriaDetallePageModule {}
