import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';



const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    /* children:[
      {
        path: 'register',
        loadChildren: () => import('./../register/register.module').then( m => m.RegisterPageModule)
      }
    ] */
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class LoginRoutingModule {}
