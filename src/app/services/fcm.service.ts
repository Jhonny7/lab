import { emulado } from './../../environments/environment.prod';
import { LocalStorageEncryptService } from './local-storage-encrypt.service';
import { LoaderService } from './loading-service';
import { SqlGenericService } from './sqlGenericService';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';


import { Device } from '@ionic-native/device/ngx';
import { HttpErrorResponse } from '@angular/common/http';

import { FCM } from '@capacitor-community/fcm';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    constructor(
        private router: Router,
        private device: Device,
        private sqlGenericService: SqlGenericService,
        private loadingService: LoaderService,
        private localStorageEncryptService: LocalStorageEncryptService
    ) { }

    initPush() {
        if (!emulado) {
            this.registerPush();
        }
    }

    private async registerPush() {

       //console.log("For get token");
        
        // Get FCM token instead the APN one returned by Capacitor
        FCM.getToken()
            .then((r) => {
               //console.log("***TOKEN***");
               //console.log(r.token);
                
                let token: string = r.token;
                /** FCM Register */
                let uuid: any = this.device.uuid;
                let sql: string = `INSERT INTO usuario (uuid, token) VALUES ('${uuid}', '${token}')`;
                let sqlChecking: string = `SELECT * FROM usuario WHERE uuid = '${uuid}'`;

                this.loadingService.show();

                //consultar uuid en base de datos antes de registrar nuevo token 
                //Si encuentra el uuid se actualizará el token pero no creará nuevo usuario

               //console.log("listo for consumming");
                
                this.sqlGenericService.excecuteQueryString(sqlChecking).subscribe((resp: any) => {
                   //console.log("RESPONSE*****************");
                   //console.log(resp);
                    
                    if (resp.parameters.length <= 0) {
                       //console.log("CONSUMING INSERT INTO");
                        
                        this.sqlGenericService.excecuteQueryString(sql, 3).subscribe((resp: any) => {
                            //Se registra correctamente nuevo usuario
                            this.loadingService.hide();
                            this.localStorageEncryptService.setToLocalStorage("token-gym", token);
                            FCM.subscribeTo({ topic: 'myGymGlobal' });//se suscribe a notificaciones globales de la app
                            //PushNotifications.
                            this.listenNotifications();
                        }, (err: HttpErrorResponse) => {
                           //console.log(err);
                            
                            this.loadingService.hide();
                        });
                    } else {
                        this.loadingService.hide();
                    }
                }, (err: HttpErrorResponse) => {
                   //console.log("IN ERRROOR");
                    
                   //console.log(err);
                    
                    this.loadingService.hide();
                });
                /** */
            })
            .catch((err) =>//console.log(err));
            {});

        this.listenNotifications();

        
    }


    public listenNotifications() {
        
    }
}