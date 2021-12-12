import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderHomeComponent implements OnInit {
@Input() scroller;
  constructor() { }

  ngOnInit() {
    console.log("entré");
    
  }
 
}
