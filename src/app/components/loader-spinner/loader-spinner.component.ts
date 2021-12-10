import { Component } from '@angular/core';

@Component({
  selector: 'loader-spinner',
  templateUrl: 'loader-spinner.html'
})
export class LoaderSpinnerComponent {

  text: string;

  constructor() {
   //console.log('Hello LoaderSpinnerComponent Component');
    this.text = 'Hello World';
  }

}
