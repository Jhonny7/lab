import { ExamenPage } from './pages/examen/examen.page';
import { RecuperarPage } from './pages/home/recuperar/recuperar.page';
import { LoginComponent } from './pages/login/login.component';
import { RegisterPage } from './pages/register/register.page';
import { SabiasPage } from './pages/home/sabias/sabias.page';
import { TriviaPage } from './pages/home/trivia/trivia.page';
import { MaterialModule } from 'src/app/material.module';
import { TabsPage } from './pages/home/tabs.page';
import { Tab3Page } from './pages/home/tab3/tab3.page';
import { Tab2Page } from './pages/home/tab2/tab2.page';
import { Tab1Page } from './pages/home/tab1/tab1.page';
import { IonicModule } from '@ionic/angular';
import { ScrollingCardsComponent } from './components/scrolling-cards/scrolling-cards';
import { OpcionesComponent } from './components/opciones/opciones.component';
import { HeaderComponent } from './components/header/header';
import { SpinnerOverlayComponent } from './components/spinner-overlay/spinner-overlay.component';
import { NgModule } from '@angular/core';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TabsComponent } from './components/tabs/tabs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContainerComponent } from './components/container/container';
import { ContainerAppComponent } from './components/container-app/container-app';
import { AdministratorComponent } from './pages/administrador/administrator/administrator.component';
import { AdDirective } from './directives/ad.directive';
import { TriviaAdmonPage } from './pages/administrador/trivia-admon/trivia-admon.page';
import { GenericModalComponent } from './pages/administrador/generic-modal/generic-modal.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GalleryComponent } from './components/gallery/gallery.component';
import { TemaComponent } from './components/tema/tema';
import { DirectorioComponent } from './pages/home/directorio/directorio.component';
import { GalleryUrlComponent } from './components/gallery-url/gallery.component';
import { AboutComponent } from './pages/home/about/about.component';
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        SpinnerOverlayComponent,
        SpinnerComponent,
        TabsComponent,
        TabsPage,
        Tab1Page,
        Tab2Page,
        Tab3Page,
        HeaderComponent,
        ContainerComponent,
        ContainerAppComponent,
        OpcionesComponent,
        ScrollingCardsComponent,
        AdministratorComponent,
        AdDirective,
        TriviaAdmonPage,
        GenericModalComponent,
        TriviaPage,
        SabiasPage,
        TemaComponent,
        GalleryComponent,
        RegisterPage,
        LoginComponent,
        RecuperarPage,
        DirectorioComponent,
        GalleryUrlComponent,
        AboutComponent,
        ExamenPage
    ],
    exports:[
        SpinnerOverlayComponent,
        SpinnerComponent,
        TabsComponent,
        TabsPage,
        Tab1Page,
        Tab2Page,
        Tab3Page,
        HeaderComponent,
        ContainerComponent,
        ContainerAppComponent,
        OpcionesComponent,
        ScrollingCardsComponent,
        AdministratorComponent,
        AdDirective,
        TriviaAdmonPage,
        GenericModalComponent,
        TriviaPage,
        SabiasPage,
        GalleryComponent,
        TemaComponent,
        RegisterPage,
        LoginComponent,
        RecuperarPage,
        DirectorioComponent,
        GalleryUrlComponent,
        AboutComponent,
        ExamenPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot(),
        MaterialModule,
        CKEditorModule,
        TranslateModule.forChild(
            {
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient]
                }
            }
        ),
    ]
})
export class ComponentsModule { }
