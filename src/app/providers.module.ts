import { AdDirective } from './directives/ad.directive';
import { Overlay } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { DirectorioComponent } from './pages/home/directorio/directorio.component';
//import { FCM } from '@ionic-native/fcm/ngx';
@NgModule({
  providers: [
      Overlay,
      GooglePlus,
      Device,
      DirectorioComponent,
      AppVersion, 
      //FCM
  ]
})
export class ProvidersModule {}
