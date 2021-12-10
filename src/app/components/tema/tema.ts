import { environment } from 'src/environments/environment.prod';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'tema',
  templateUrl: './tema.html',
  styleUrls: ['./tema.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class TemaComponent implements OnDestroy, OnInit{

  @Input() tema:any;

  public imgUrl:string = environment.getImagenIndividual;

  constructor(
  ) {
  }

  public ngOnInit():void{
  }

  public ngOnDestroy():void{
    
  }

}
