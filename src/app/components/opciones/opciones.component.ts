import { EventService } from './../../services/event.service';
import { Router } from '@angular/router';
import { LocalStorageEncryptService } from './../../services/local-storage-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { DirectorioComponent } from 'src/app/pages/home/directorio/directorio.component';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.scss'],
})
export class OpcionesComponent implements OnInit {

  public themes: any[] = [
    {
      id: 1,
      color: "#000",
      theme: "primary",
    },
    {
      id: 2,
      color: "#0783bc",
      theme: "primary2",
    },
    {
      id: 3,
      color: "#006b89",
      theme: "primary3",
    },
    {
      id: 4,
      color: "#890000",
      theme: "primary4",
    },
    {
      id: 5,
      color: "#056c24",
      theme: "primary5",
    }
  ];

  public languages: any[] = [{
    id: 1,
    language: "es",
    icon: "assets/imgs/languages/espana.png"
  }, {
    id: 2,
    language: "en",
    icon: "assets/imgs/languages/reino-unido.png"
  }, {
    id: 3,
    language: "zh",
    icon: "assets/imgs/languages/porcelana.png"
  }, {
    id: 4,
    language: "de",
    icon: "assets/imgs/languages/alemania.png"
  }, {
    id: 5,
    language: "ja",
    icon: "assets/imgs/languages/japon.png"
  },];

  public optionPanes: any[] = [
    /* {
    title: 'options.favorites',
    icon: "star-outline",
    action: ()=>{
      this.eventService.send("closePopover",{});
      this.router.navigate(["/","favorites"]);
    }
  }, */
  ];

  constructor(
    private translateService: TranslateService,
    private localStorageEncryptService: LocalStorageEncryptService,
    private router: Router,
    private eventService: EventService,
    private test: DirectorioComponent
  ) { }

  ngOnInit() { }

  changeTheme(theme: any) {
    this.localStorageEncryptService.setToLocalStorage("theme", theme.color);
    this.localStorageEncryptService.setToLocalStorage("themeClass", theme.theme);
    this.test.cargarColores();
  }

  changeLanguage(language: any) {
    this.localStorageEncryptService.setToLocalStorage("language", language.language);
    this.translateService.setDefaultLang(language.language);
    this.translateService.use(language.language);

    this.eventService.send("translate",null);
  }

}
