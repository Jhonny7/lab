import { AlertService } from 'src/app/services/alert.service';
import { LocalStorageEncryptService } from './../services/local-storage-encrypt.service';
import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable(
    {
        providedIn: "root"
    }
)
export class ThemeGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private localStorageEncryptService: LocalStorageEncryptService,
        private alertService: AlertService
    ) {

    }

    canActivateChild() {
        return this.check();
    }

    canActivate() {
        return this.check();
    }

    check() {
        let tt:any = this.localStorageEncryptService.getFromLocalStorage("temaGlobal");
        if (tt) {
            return true;
        } else {
            this.alertService.warnAlert("Espera!", "Antes de continuar debes seleccionar un tema");
            return this.router.navigate(["/inicio"]);
        }
    }

}