import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {  HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "../../../assets/i18n/", ".json");
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    TranslateModule.forChild(
      {
        loader:{
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }
    )
  ],
  declarations: [LoginComponent]
})
export class LoginModule {}
