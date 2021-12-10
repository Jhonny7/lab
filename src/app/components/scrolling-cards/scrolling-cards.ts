import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'scrolling-cards',
  templateUrl: './scrolling-cards.html',
  styleUrls: ['./scrolling-cards.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class ScrollingCardsComponent implements OnDestroy, OnInit{

  @Input() cards:any;

  constructor(
  ) {
  }

  public ngOnInit():void{
  }

  public ngOnDestroy():void{
    
  }

}
