import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  scroller: any;
  objImg: any;
  constructor() { }
  @HostListener("scroll", ['$event'])
  
  ngOnInit() {
    this.objImg = [{
      img: 'https://areajugones.sport.es/wp-content/uploads/2015/03/reverse-flash.jpg',
      name: 'Flash Reverso'
    },
  {
    img: 'https://okdiario.com/img/series/2016/12/24/zoom.png',
    name: 'Zoom'
  },
{
  img: 'https://i1.wp.com/codigoespagueti.com/wp-content/uploads/2021/11/The-Flash-Armageddon-Temporada-8.jpg?fit=1280%2C720&quality=80&ssl=1',
  name: 'Flash'
}]
  }
  doSomethingOnInternalScroll(event:any){
    let scrollOffset = event.srcElement.scrollTop;
    this.scroller = scrollOffset;
    console.log(this.scroller);
    
  }
}