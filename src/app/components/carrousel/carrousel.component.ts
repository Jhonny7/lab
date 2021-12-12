import {  AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss'],
})
export class CarrouselComponent implements OnInit,  AfterViewInit {
  slidesIndex = 1;
@Input() objImg: {};
  constructor() { }

  ngOnInit() {
    setInterval(()=>{
    this.plusSlides(1);
    },6000)
  }
  ngAfterViewInit() {
   this.showSlides(this.slidesIndex);
  }
   plusSlides(n) {
    this.showSlides(this.slidesIndex += n);
  }
  
   currentSlide(n) {
    this.showSlides(this.slidesIndex = n);
  }
  
   showSlides(n) {
    let i;
    let slides: any = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {this.slidesIndex = 1}    
    if (n < 1) {this.slidesIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[this.slidesIndex-1].style.display = "block";  
    dots[this.slidesIndex-1].className += " active";
  }

}
