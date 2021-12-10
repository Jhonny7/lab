import { Injectable } from '@angular/core';
import { LocalStorageEncryptService } from './local-storage-encrypt.service';

export const TIME_OUT = 1000 * 60 * 1; //ultimo número define en minutos
/**Clase provider que es básicamente un servicio generico para las peticiones a servicios */
@Injectable(
    {
        providedIn: "root"
    }
)
export class ThemeService {

    constructor(
        private localStorageEncryptService: LocalStorageEncryptService) {
    }

    //For themes
    getColorPrimary() {
        let color: any = this.localStorageEncryptService.getFromLocalStorage("primary");
        return color;
    }

    getColorHex() {
        let color: any = this.localStorageEncryptService.getFromLocalStorage("theme");

        return color;
    }

    getThemeClass() {
        let color: any = this.localStorageEncryptService.getFromLocalStorage("themeClass");
        return color;
    }
}