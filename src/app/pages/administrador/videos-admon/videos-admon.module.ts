import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideosAdmonPageRoutingModule } from './videos-admon-routing.module';

import { VideosAdmonPage } from './videos-admon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideosAdmonPageRoutingModule
  ],
  declarations: [VideosAdmonPage]
})
export class VideosAdmonPageModule {}
