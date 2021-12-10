import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable(
    {
        providedIn: "root"
    }
)
export class RootGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,

    ) {

    }

    canActivateChild() {
        return this.check();
    }

    canActivate() {
        return this.check();
    }

    check() {
        let userSessionEducacion: any = JSON.parse(localStorage.getItem("userSessionEducacion"));
        if (userSessionEducacion && (userSessionEducacion.id_tipo_usuario == 169 || userSessionEducacion.id_tipo_usuario == "169")) {
            return true;
        } else {
            return this.router.navigate(["/","login"]);
        }
    }

}