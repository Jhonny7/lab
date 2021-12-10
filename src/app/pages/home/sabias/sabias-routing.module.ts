import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SabiasPage } from './sabias.page';

const routes: Routes = [
  {
    path: '',
    component: SabiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SabiasPageRoutingModule {}
