import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'container',
  templateUrl: './container.html',
  styleUrls: ['./container.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class ContainerComponent implements OnDestroy, OnInit{

  constructor(
  ) {
  }

  public ngOnInit():void{
  }

  public ngOnDestroy():void{
    
  }

}
