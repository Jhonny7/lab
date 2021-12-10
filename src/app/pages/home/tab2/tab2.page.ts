/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import { FAQs } from 'src/app/interfaces/FAQs';

import { GenericService } from 'src/app/services/generic.service';
import { LoaderService } from 'src/app/services/loading-service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageEncryptService } from 'src/app/services/local-storage-encrypt.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { idEmpresa } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @Input() data: any;
  faqs: any;
  viewFAQs = false;
  title: string;
  listMaterias: Array<string>;

  public user:any = null;
  constructor(
    private sqlGenericService: SqlGenericService,
    private loadingService: LoaderService,
    public genericService: GenericService,
    private localStorageEncryptService: LocalStorageEncryptService,
  ) {
    this.user = this.localStorageEncryptService.getFromLocalStorage("userSessionEducacion");
   }

  ngOnInit() {
    this.getMaterias();
  }
  /**
   * function to obtain the questions depending on the selected subject
   *
   * @param item momentary variable to obtain the selected matter.
   */
  getFAQ(item) {
    this.title = item.label;
    const sql = `SELECT * FROM preguntas_frecuentes WHERE id_empresa = ${idEmpresa} AND id_tema = ${item.value} AND (id_tipo_usuario = 170 OR id_tipo_usuario = ${this.user.id_tipo_usuario})`;
    console.log(sql);
    
    this.loadingService.show('Espere...');
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      this.faqs = response.parameters;
      this.viewFAQs = true;
      this.loadingService.hide();
      console.log(this.faqs);
    });
  }
  getMaterias() {
    this.loadingService.show('Espere...');
    const sql = `SELECT id AS value, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      console.log(response.parameters);
      this.listMaterias = response.parameters;
      this.loadingService.hide();
      let temaID: any = this.localStorageEncryptService.getFromLocalStorage("temaGlobal");

      let position = this.listMaterias.findIndex((o: any) => {
        return o.value == temaID;
      });
      let t = this.listMaterias[position];

      this.getFAQ(t);
    });
  }
  /**
   * function to expand and collapse the panel
   *
   * @param evt Variable that is equivalent to the selected item
   */
  accordion(evt): void {
    const panel = evt.srcElement.parentNode.nextSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      evt.target.name = 'add';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      evt.target.name = 'close';
    };
  }
  /**
   * function to return to the subject list.
   */
  return() {
    window.history.back();
  }
};
