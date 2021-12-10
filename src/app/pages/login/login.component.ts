import { LocalStorageEncryptService } from './../../services/local-storage-encrypt.service';
import { GenericService } from './../../services/generic.service';
import { SqlGenericService } from './../../services/sqlGenericService';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertService } from './../../services/alert.service';
import { LoaderService } from './../../services/loading-service';
import { Plugins } from '@capacitor/core';
import { Router, NavigationExtras } from '@angular/router';
/* import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'; */
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
//import firebase from 'firebase'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  public visto: boolean = false;

  public data: any = {
    email: {
      error: false,
      value: ""
    },
    pass: {
      error: false,
      value: ""
    }
  };

  constructor(
    private alertService: AlertService,
    private loadingService: LoaderService,
    public router: Router,
    //private afAuth: AngularFireAuth,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private sqlGenericService: SqlGenericService,
    private genericService: GenericService,
    private localStorageEncryptService: LocalStorageEncryptService,
    private menu: MenuController,
    ) {
      this.menu.enable(false);
    //Se limpia siempre sesión al ingresar a login
    this.localStorageEncryptService.clearProperty("userSessionEducacion");
  }



  ngOnInit() {
    setTimeout(() => {
      let objDiv = document.getElementById("btn-scroll");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 500);
    //this.getCurrentState();
  }

  async getCurrentState() {
    const result = await Plugins.FacebookLogin.getCurrentAccessToken();
    try {
      //console.log("Facebook current");

      //console.log(result);
      if (result && result.accessToken) {
        let user = { token: result.accessToken.token, userId: result.accessToken.userId }
        let navigationExtras: NavigationExtras = {
          queryParams: {
            userinfo: JSON.stringify(user)
          }
        };
        //Redireccion to home si tiene login facebook
        //this.router.navigate(["/home"], navigationExtras);
      }
    } catch (e) {
      //console.log(e)
    }
  }

  async signIn(): Promise<void> {
    //console.log("LOGGIN FACEBOOK_");

    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result && result.accessToken) {
      let user = { token: result.accessToken.token, userId: result.accessToken.userId, data: result };

      let navigationExtras: NavigationExtras = {
        queryParams: {
          userinfo: JSON.stringify(user)
        }
      };

      /*
      imagen: https://graph.facebook.com/${id}/picture?type=large&redirect=true&width=500&height=500
      fields: https://graph.facebook.com/${id}?fields=id,name,email&access_token=${token}
      */
      //console.log("USER FACEBOOK_");
      //console.log(JSON.stringify(user));

      //this.router.navigate(["/home"], navigationExtras);
    }
  }

  loginGoogle() {
    /* if (this.platform.is('android')) {
     //console.log("IN ANDROID");

      this.loginGoogleAndroid();
    } else {
      this.loginGoogleWeb();
    } */
  }

  /* async loginGoogleAndroid() {
    const res = await this.googlePlus.login({
      'webClientId': "207458345350-s4f0poahnfj28ea1e1nnv3enrlgv96nl.apps.googleusercontent.com",
      'offline': true
    });
    const resConfirmed = await this.afAuth.signInWithCredential(firebase.default.auth.GoogleAuthProvider.credential(res.idToken));
    const user = resConfirmed.user;
   //console.log("google user____");
   //console.log(user);


  }

  async loginGoogleWeb() {
    let f: any = firebase;
    const res = await this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider());
    const user = res.user;
   //console.log(user);
  } */

  change() {
    let id: any = document.getElementById("input-pass3");
    if (id.type == "text") {
      id.type = "password";
    } else {
      id.type = "text";
    }
  }

  login() {
    this.loadingService.show("Espere...");
    let sql: string = `SELECT * FROM usuario WHERE password = SHA2(MD5(UNHEX(SHA2('${this.data.pass.value}',512))),224) AND username = '${this.data.email.value}'`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.parameters.length > 0) {
        localStorage.setItem("userSessionEducacion", JSON.stringify(response.parameters[0]));
        //this.menu.enable(true);
        this.router.navigate(["/", "inicio"]);
      } else {
        this.alertService.errorAlert("Oops", `Verifica usuario y/o contraseña`);
      }
    }, (error: HttpErrorResponse) => {
      this.loadingService.hide();
      this.alertService.errorAlert("Oops", `Verifica usuario y/o contraseña`);
    });
  }

  recuperar() {
    this.alertService.alertWithInputs((valor: any) => {
      console.log(valor);
      this.confirmRecuperar(valor);
    }, "¿Olvidaste tu contraseña?", "Ingresa un correo electrónico válido para enviarte las instrucciones para recuperarla", "Recuperar");
  }

  confirmRecuperar(email: string) {
    let epoch = Date.now();

    //insertar en usuario contrasegnia

    let sqlSearch: string = `SELECT * FROM usuario WHERE username = '${email}'`;

    this.loadingService.show("Recuperando...");

    this.sqlGenericService.excecuteQueryString(sqlSearch).subscribe((find: any) => {
      if (find.parameters.length > 0) {
        let sqlDeleteBefore = `DELETE FROM contrasegna_temporal WHERE id_usuario = ${find.parameters[0].id}`;

        this.sqlGenericService.excecuteQueryString(sqlDeleteBefore).subscribe((deleted: any) => {
          let sql: string = `INSERT INTO contrasegna_temporal (pass_temporal, id_usuario) VALUES ('${String(epoch)}', ${find.parameters[0].id})`;
          this.sqlGenericService.excecuteQueryString(sql).subscribe((insert: any) => {
            console.log(insert);

            let request: any = {
              asunto: "Recuperar Contrasenia",
              from: "sarrejuan@gmail.com",
              name: "sarrejuan@gmail.com",
              to: email,
              cuerpo: `<section>
            <div style="background-color: #006b89;
            text-align: center;padding: 8px;">
              <p style="color: #fff;margin: 0;font-size: 20px;">Este correo es enviado por TRANSFO</p>
            </div>
            <div style="padding: 10px;border: 1px solid #c8c8c8;">
              <p style="color: #000;">Hola jhonny, olvidaste tu contraseña?</p>
              <p style="color: #000;">Nosotros te enviamos este correo para que puedas reestablecerla, solo da clic en el
                botón
                y sigue las instrucciones
              </p>

              <p> <strong>Código para reestablecer:</strong> ${epoch}</p>
      
              <a href="https://${window.location.hostname}/recuperar/${insert.parameters}"><button style="color: #fff;
                background-color: #006b89;
                font-size: 16px;
                padding: 8px;
                border-radius: 8px;
                box-shadow: 1px 1px 1px #123;
                margin-bottom: 20px;
                min-width: 200px;
                cursor: pointer;" >Recuperar</button></a>
      
              <p style="color: #000;">O si lo prefieres puedes hacer click en el siguiente enlace</p>
              <a href="https://${window.location.hostname}/recuperar/${insert.parameters}">https://${window.location.hostname}/recuperar/${insert.parameters}</a>
            </div>
          </section>`
            };
            this.genericService.sendPostRequest(environment.mail, request).subscribe((response: any) => {
              this.loadingService.hide();
              this.alertService.successAlert("Bien!", "Te hemos enviado un correo electrónico, revisa tu bandeja de spam en caso de no verlo en tus correos recientes");
            }, (error: HttpErrorResponse) => {
              this.loadingService.hide();
              this.alertService.errorAlert("Oops!", "Ocurrió un error, contacta al administrador");
            });
          }, (error: HttpErrorResponse) => {
            this.loadingService.hide();
            this.alertService.errorAlert("Oops!", "Ocurrió un error, contacta al administrador");
          });

        }, (error: HttpErrorResponse) => {
          this.loadingService.hide();
          this.alertService.errorAlert("Oops!", "Ocurrió un error, contacta al administrador");
        });


      } else {
        this.alertService.warnAlert("Espera!", "El usuario ingresado no existe en nuestros registros, contacta al administrador o intentalo nuevamente");
      }
    }, (error: HttpErrorResponse) => {
      this.loadingService.hide();
      this.alertService.errorAlert("Oops!", "Ocurrió un error, contacta al administrador");
    });


  }
}
