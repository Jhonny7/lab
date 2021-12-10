import { environment, pathSettlementsCity } from './../../../environments/environment.prod';
import { GenericService } from './../../services/generic.service';
import { LoaderService } from './../../services/loading-service';
import { LoadingService } from './../../services/loading.service';
import { SqlGenericService } from './../../services/sqlGenericService';
import { AlertService } from './../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { idEmpresa } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public data: any = {
    email: {
      error: false,
      value: ""
    },
    nombre: {
      error: false,
      value: ""
    },
    apellido_paterno: {
      error: false,
      value: ""
    },
    apellido_materno: {
      error: false,
      value: "",
      exclude: true,
    },
    pass: {
      error: false,
      value: ""
    },
    confirm_pass: {
      error: false,
      value: ""
    },
    edad: {
      error: false,
      value: ""
    }, municipio: {
      error: false,
      value: ""
    }, rol: {
      error: false,
      value: ""
    },
  };

  public dataInvitado: any = {
    edad: {
      error: false,
      value: ""
    }, municipio: {
      error: false,
      value: ""
    }, rol: {
      error: false,
      value: ""
    },
  };

  public invitado: number = 0;

  public municipios: any[] = [];
  public roles: any[] = [];

  constructor(
    private alertService: AlertService,
    private sqlGenericService: SqlGenericService,
    private loadingService: LoaderService,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private router: Router,
    private menu: MenuController,
  ) {
    this.menu.enable(false);
    let expiredSession = new Date();
    expiredSession.setDate(expiredSession.getDate() + 1);
    let str: string = JSON.stringify(expiredSession);

    let fecha = new Date(JSON.parse(str));

  }

  ngOnInit() {
    //this.alertService.errorAlert("Oops!","Datos incorrectos");
    this.invitado = Number(this.route.snapshot.params.invitado);
    this.getStates();
    this.getRoles();
  }

  getRoles() {
    let sql: string = `SELECT 
    id as value, 
    nombre as label 
    FROM catalogo 
    WHERE id_tipo_catalogo = 29 AND id_empresa = ${idEmpresa} AND id != 169 AND id != 170`;
    this.loadingService.show("Espere...");
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      this.roles = response.parameters;
      this.dataInvitado.rol.value = "129";
      this.data.rol.value = "129";
      this.loadingService.hide();
    }, (error: HttpErrorResponse) => {
      this.loadingService.hide();
      this.alertService.errorAlert("Oops", `El usuario ${this.data.email.value} no se ha registrado, intenta nuevamente`);
    });
  }

  getStates() {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append("idState", 15);//definido por sharkit
    this.genericService.sendGetParams(pathSettlementsCity, httpParams).subscribe((response: any) => {
      this.dataInvitado.municipio.value = "0";
      this.data.municipio.value = "0";
      this.municipios = response.parameters;
      //console.log(this.dataInvitado);

    }, (error: HttpErrorResponse) => {

    });
  }

  register() {
    let keys: any = Object.keys(this.data);
    let error: number = 0;

    keys.forEach(key => {
      if (this.data[key].value.length <= 0 && !this.data[key].exclude) {
        this.data[key].error = true;
        error++;
      } else {
        this.data[key].error = false;
      }
    });
    this.loadingService.show("Registrando...");
    if (error > 0) {
      this.alertService.warnAlert("Oops!", "Llena todos los campos marcados con (*)");
    } else if (this.data.pass.value != this.data.confirm_pass.value) {
      this.alertService.warnAlert("Oops!", "Las contraseñas deben coincidir");
    } else {
      let sqlUser: string = `SELECT username FROM usuario WHERE username = '${this.data.email.value}'`;
      this.sqlGenericService.excecuteQueryString(sqlUser).subscribe((response: any) => {
        if (response.parameters.length <= 0) {
          let sql: string = `INSERT INTO usuario (id_tipo_usuario, id_empresa, uuid, token, nombre, apellido_paterno, apellido_materno, language, last_session, password, username, edad, municipio) VALUES (${this.data.rol.value}, '${idEmpresa}', 'web', 'web', '${this.data.nombre.value}', '${this.data.apellido_paterno.value}', '${this.data.apellido_materno.value}', 'es', now(), SHA2(MD5(UNHEX(SHA2('${this.data.pass.value}',512))),224), '${this.data.email.value}', '${this.data.edad.value}', '${this.data.municipio.value}')`;
          this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
            keys.forEach(key => {
              this.data[key].value = "";
            });
            this.loadingService.hide();
            setTimeout(() => {
              this.backing();
            }, 500);
            ////console.log(response);
          }, (error: HttpErrorResponse) => {
            this.loadingService.hide();
            this.alertService.errorAlert("Oops", `El usuario ${this.data.email.value} no se ha registrado, intenta nuevamente`);
          });
        } else {
          this.loadingService.hide();
          this.alertService.errorAlert("Oops", `El usuario ${this.data.email.value} ya se encuentra registrado`);
        }
      }, (error: HttpErrorResponse) => {

      });
    }
  }

  registerInvitado() {
    let keys: any = Object.keys(this.dataInvitado);
    let error: number = 0;

    keys.forEach(key => {
      if ((this.dataInvitado[key].value.length <= 0 &&
        !this.dataInvitado[key].exclude)
        || this.dataInvitado[key].value == "0") {
        this.dataInvitado[key].error = true;
        error++;
      } else {
        this.dataInvitado[key].error = false;
      }
    });
    //console.log(error);

    this.loadingService.show("Registrando...");
    if (error > 0) {
      this.loadingService.hide();
      this.alertService.warnAlert("Oops!", "Llena todos los campos marcados con (*)");
    } else {
      let now = Date.now();
      let sql: string = `INSERT INTO usuario (id_tipo_usuario, id_empresa, uuid, token, language, last_session, username, edad, municipio) VALUES (${this.dataInvitado.rol.value}, '${idEmpresa}', 'temporal', 'temporal', 'es', now(), '${now}', '${this.dataInvitado.edad.value}', '${this.dataInvitado.municipio.value}')`;
      this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
        keys.forEach(key => {
          this.dataInvitado[key].value = "";
        });

        let expiredSession = new Date();
        expiredSession.setDate(expiredSession.getDate() + 1);
        localStorage.setItem("expiredSession", JSON.stringify(expiredSession));
        this.router.navigate(["home"]);
        this.loadingService.hide();

        ////console.log(response);
      }, (error: HttpErrorResponse) => {
        this.loadingService.hide();
        this.alertService.errorAlert("Oops", `El usuario ${this.data.email.value} no se ha registrado, intenta nuevamente`);
      });
    }
  }

  change() {
    let id: any = document.getElementById("input-pass");
    if (id.type == "text") {
      id.type = "password";
    } else {
      id.type = "text";
    }
  }

  backing() {
    window.history.back();
  }

}
