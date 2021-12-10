import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TriviaAdmonPage } from './trivia-admon.page';

const routes: Routes = [
  {
    path: '',
    component: TriviaAdmonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriviaAdmonPageRoutingModule {}
