import { SqlGenericService } from '../../services/sqlGenericService';
//import { environment } from './../../../../../kabikappionic/src/environments/environment';
import { environment, idEmpresa } from 'src/environments/environment.prod';
import { Component, Input, OnInit } from '@angular/core';

// import Swiper JS
declare var Swiper;
// import Swiper styles
import 'swiper/swiper-bundle.css';
import { HttpErrorResponse } from '@angular/common/http';

export interface GalleryItem {
  name: string,
  description: string,
  buttonText: string,
  action?: Function,
  image: string
};

@Component({
  selector: 'gallery-url',
  templateUrl: 'gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryUrlComponent implements OnInit {

  @Input() galleryItems: Array<GalleryItem>;
  public epochNumber: number = Date.now();
  public env: any = environment;
  public colorHeader: string = "#000";

  constructor(
    private sqlGenericService: SqlGenericService
  ) { }

  public ngOnInit() {
    setTimeout(() => {
     //console.log(this.galleryItems);
      const swiper = new Swiper(`.swiper-${this.epochNumber}`, {
        spaceBetween: 0,
        slidesPerView: "auto",
        touchRatio: 0.2,
        loop: this.galleryItems.length > 1 ? true : false,
        slideToClickedSlide: true,
        loopedSlides: 50,
        autoplay: true,
        direction: "horizontal",
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },

        
      });

      setTimeout(() => {

        /* let id: any = document.getElementById("in");
        let id2: any = document.getElementById("swp");
        console.log(id2);
        
        id2.style.height = `${id.offsetHeight}px`; */
        this.onResize({});
      }, 500);

    }, 1000);
  }

  onResize(evt: any) {
    let id: any = document.getElementById("in");
    let id2: any = document.getElementById("swp");
    id.style.height = "auto";
    
    id2.style.height = `${id.offsetHeight}px`;
  }
}