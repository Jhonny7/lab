import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageEncryptService } from './../../../services/local-storage-encrypt.service';
import { LoaderService } from 'src/app/services/loading-service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { environment, idEmpresa } from 'src/environments/environment.prod';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab3Page implements OnInit {
  viewCapsulas: boolean = false;
  viewCapsulasList: boolean = false;
  listMaterias: Array<string>;
  capsulasInfo;
  title: any;
  titleCapsula: any;
  descripcion: any;
  video: any;
  url = environment.getImagenIndividual;
  public user: any = null;

  constructor(
    private loadingService: LoaderService,
    private sqlGenericService: SqlGenericService,
    public genericService: GenericService,
    private localStorageEncryptService: LocalStorageEncryptService,
    private domSanitizer: DomSanitizer,
  ) {
    this.user = this.localStorageEncryptService.getFromLocalStorage("userSessionEducacion");
  }

  ngOnInit() {
    this.getMaterias();

    /*
    $asunto = $data['asunto'];
    $cuerpo = $data['cuerpo'];
    $from = $data['from'];
    $to = $data['to'];

    $name = $data['name'];
    */


  }

  getMaterias() {
    this.loadingService.show('Espere...');

    const sql = `SELECT id AS value, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      console.log(response.parameters);
      this.listMaterias = response.parameters;
      this.loadingService.hide();
      let temaID: any = this.localStorageEncryptService.getFromLocalStorage("temaGlobal");
      console.log(temaID);

      let position = this.listMaterias.findIndex((o: any) => {
        return o.value == temaID;
      });
      console.log(position);


      let t = this.listMaterias[position];
      console.log(t);

      this.getCapsulasList(t);
    });
  }

  getCapsulasList(item) {
    this.title = item.label;
    this.loadingService.show('Espere...');
    const sql = `SELECT * FROM capsula WHERE id_empresa = ${idEmpresa} AND id_tema = ${item.value} AND (id_tipo_usuario = 170 OR id_tipo_usuario = ${this.user.id_tipo_usuario})`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      console.log(response.parameters);
      this.capsulasInfo = response.parameters;
      //this.capsulasInfo.d2 = this.domSanitizer.bypassSecurityTrustHtml(this.capsulasInfo.descripcion);
      this.loadingService.hide();
    });
    this.viewCapsulasList = true;
    this.viewCapsulas = false;
  }

  getCapsulas(item) {
    this.titleCapsula = item.nombre;
    this.video = item.url;
    this.descripcion = this.domSanitizer.bypassSecurityTrustHtml(item.descripcion);
    this.viewCapsulasList = false;
    this.viewCapsulas = true;
  }
  return() {
    window.history.back();
  }
}
