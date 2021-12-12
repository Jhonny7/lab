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
      img: 'https://tecnosolucionescr.net/templates/yootheme/cache/27_Lab_acreditado-e651d64b.png',
      name: 'Flash Reverso'
    },
  {
    img: 'https://media-adsa.camilyo.software/media-adsa/static/3886/894.jpg',
    name: 'Zoom'
  },
{
  img: 'https://www.masbellezaysalud.com/wp-content/uploads/2021/04/Foro-Competencias-De-Laboratorios-Clinicos-Mas-Belleza-y-Salud.jpg',
  name: 'Flash'
}]
  }
  doSomethingOnInternalScroll(event:any){
    let scrollOffset = event.srcElement.scrollTop;
    this.scroller = scrollOffset;
    console.log(this.scroller);
    
  }
}