import { RecuperarPage } from './pages/home/recuperar/recuperar.page';
import { RegisterPage } from './pages/register/register.page';
import { LoginComponent } from './pages/login/login.component';
import { SabiasPage } from './pages/home/sabias/sabias.page';
import { TriviaPage } from './pages/home/trivia/trivia.page';
import { TabsPage } from './pages/home/tabs.page';
import { Tab3Page } from './pages/home/tab3/tab3.page';
import { Tab2Page } from './pages/home/tab2/tab2.page';
import { Tab1Page } from './pages/home/tab1/tab1.page';
import { TriviaAdmonPage } from './pages/administrador/trivia-admon/trivia-admon.page';
import { AdministratorComponent } from './pages/administrador/administrator/administrator.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RootGuard } from './guards/root.guard';
import { ThemeGuard } from './guards/theme.guard';
import { DirectorioComponent } from './pages/home/directorio/directorio.component';
import { AboutComponent } from './pages/home/about/about.component';
import { ExamenPage } from './pages/examen/examen.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: "inicio",
    pathMatch: "full"
  }, 
  {
    path: 'inicio',
    component: TabsPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "trivia",
    component: TriviaPage,
    canActivate: [AuthGuard, ThemeGuard],
  },
  {
    path: "examen",
    component: ExamenPage,
    canActivate: [AuthGuard, ThemeGuard],
  }, {
    path: "preguntas",
    component: Tab2Page,
    canActivate: [AuthGuard, ThemeGuard],
  },
  {
    path: "directorio",
    component: DirectorioComponent,
    canActivate: [AuthGuard, ThemeGuard]
  },
  {
    path: "sabias",
    component: SabiasPage,
    canActivate: [AuthGuard, ThemeGuard],
  }, {
    path: "capsula",
    component: Tab3Page,
    canActivate: [AuthGuard, ThemeGuard],
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'recuperar',
    children: [{
      path: ":id",
      component: RecuperarPage,
    }]
  }, {
    path: 'register',
    children: [{
      path: ":invitado",
      component: RegisterPage,
    }]
  },
  {
    path: "root",
    canActivateChild: [RootGuard],
    children: [
      {
        path: 'administrador',
        component: TriviaAdmonPage
        //loadChildren: () => import('./pages/administrador/trivia-admon/trivia-admon.module').then( m => m.TriviaAdmonPageModule)
      }, {
        path: 'admon',
        component: AdministratorComponent
      },
    ]
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
