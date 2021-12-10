import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideosAdmonPage } from './videos-admon.page';

const routes: Routes = [
  {
    path: '',
    component: VideosAdmonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideosAdmonPageRoutingModule {}
