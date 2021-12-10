import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SabiasPageRoutingModule } from './sabias-routing.module';

import { SabiasPage } from './sabias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SabiasPageRoutingModule
  ],
  declarations: [SabiasPage]
})
export class SabiasPageModule {}
