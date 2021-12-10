import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { ComponentsModule } from 'src/app/components.module';
import { AdDirective } from 'src/app/directives/ad.directive';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TabsPage,AdDirective],
  providers:[AdDirective]
})
export class TabsPageModule {}
