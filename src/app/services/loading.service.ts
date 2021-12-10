import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

/**Clase Servicio que sirve para mostrar y ocultar un spinner
 * de carga en peticiones de servicios back o en donde se requiera
 */
@Injectable(
  {
    providedIn: "root"
}
)
export class LoadingService {
  /**Variable que tiene la referencia del spinner */
  private loading: any;
  private activo: number = 0;
  /**Constructor donde se hace la inyección del 
   * controlador de loading
   */
  constructor(private loadingController: LoadingController) { }

  /**Método que se encarga de mostrar el loader */
  async show(message: any = null) {
    try {
      if(this.activo == 0){
        let params: any = {

        };
        if (message) {
          params.content = message;
        }
        this.loading = await this.loadingController.create(params);
        this.activo = 1;
        await this.loading.present();
      }
    } catch (error) {

    }
  }

  /**Método que se encarga de ocultar el loader */
  hide() {
    try {
      if (this.activo == 1) {
        this.activo = 0;
        this.loading.dismiss();
      } else {
      }
    } catch (error) {

    }
  }
}
