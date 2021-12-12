import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderHomeComponent implements OnInit {
@Input() scroller;
viewSearch: boolean = false;
searchIcon = 'search';
  constructor() { }

  ngOnInit() {
    console.log("entré");
  }
  search(){
    this.viewSearch = !this.viewSearch;
    if(this.viewSearch){
      this.searchIcon = 'close';
    } else {
      this.searchIcon = 'search';
    }
  }
 
}
