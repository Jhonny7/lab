import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from './../../../services/loading-service';
import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { idEmpresa } from 'src/environments/environment.prod';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.scss'],
})
export class DirectorioComponent implements OnInit {
  directorio: any;
  infoCard: any;
  socialMedia: boolean;
  flag: boolean = false;
  social = [{
    id: 145,
    name: 'facebook'
  },
  {
    id: 146,
    name: 'instagram'
  },
  {
    id: 147,
    name: 'linkedin'
  }]
  constructor(
    private loadingService: LoaderService,
    private genericService: GenericService,
    private sqlGenericService: SqlGenericService
  ) {
    this.socialMedia = false;
  }

  ngOnInit() {
    this.getDirectorios();
    this.flag = true;
  }
  ionViewDidEnter() {
    this.cargarColores();
  }

  cargarColores() {
    const el: any = document.querySelector('.containers');
    el.style.setProperty('--colores', this.genericService.getColorHex());

  }
  getDirectorios() {
    this.loadingService.show('Espere...')
    let sql = `SELECT id AS value, estado_combo, domicilio, municipio, nombre_lugar, nombre_contacto, telefono, email, ubicacion_maps, links, servicios, url FROM directorio WHERE id_empresa = ${idEmpresa}`
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      console.log(response.parameters);

      response.parameters.forEach(element => {
        if (element.links) {
          element.links = JSON.parse(element.links)
        }
      });
      response.parameters.forEach(element => {
        element.links = this.getIconSocialMedia(element.links);
        element.socialMedia = false;
      });

      this.directorio = response.parameters;
      console.log(this.directorio);

      this.loadingService.hide();
    },(error: HttpErrorResponse)=>{
      this.loadingService.hide();
    });

  }
  showSocialMedia(flag, item) {

    item.socialMedia = flag

  }

  getIconSocialMedia(itm) {
    for (let i = 0; i < itm.length; i++) {
      this.social.forEach(element => {
        if (itm[i].tipo == element.id) {
          itm[i].tipo = element.name;
        }
      });

    }
    return itm;
  }
  goToLink(itm) {
    console.log(itm);

    window.open(
      itm,
      '_blank'
    );
  }
  animation(itm) {
    if (itm.socialMedia) {
      return 'showAnimation';
    } else {
      return 'hideAnimation'
    }
  }


}
