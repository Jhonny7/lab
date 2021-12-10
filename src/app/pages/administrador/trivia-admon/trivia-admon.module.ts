import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TriviaAdmonPageRoutingModule } from './trivia-admon-routing.module';

import { TriviaAdmonPage } from './trivia-admon.page';
import { MaterialModule } from 'src/app/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    TriviaAdmonPageRoutingModule,
    MaterialModule
  ],
  declarations: [TriviaAdmonPage]
})
export class TriviaAdmonPageModule {}
