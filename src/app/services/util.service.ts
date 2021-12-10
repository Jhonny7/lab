import { Router } from '@angular/router';
import { AdDirective } from './../directives/ad.directive';
import { ComponentFactoryResolver, Injectable, OnDestroy } from "@angular/core";
import { AdComponent } from '../interfaces/ad.interface';

/**Clase provider que se utiliza para generar mensajes de error, alerta o éxito
 * Se hizo de forma genérica para evitar repetir esta clase de código
 */
@Injectable({
  providedIn:"root"
})
export class UtilService implements OnDestroy {
  /**Constructor del servicio en el que se inyecta el controlador de alertas de ionic
   * y eventos de escucha para el momento de un cierre de sesión inesperado
   */
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  getRandomText(length) {
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".match(/./g);
    var text = "";
    for (var i = 0; i < length; i++)
    text += charset[Math.floor(Math.random() * charset.length)];
    return text;
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  renderDynamicComponent(component: any, host: AdDirective, data:any = null){
    const componentFactory:any = this.componentFactoryResolver.resolveComponentFactory(component);

    const viewContainerRef = host.viewContainerRef;

    viewContainerRef.clear();

    const componentRef:any = viewContainerRef.createComponent<AdComponent>(componentFactory);

    componentRef.instance.data = data;
    
  }
}
