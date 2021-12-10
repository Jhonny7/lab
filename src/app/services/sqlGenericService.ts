import { emulado, environment } from './../../environments/environment.prod';
import { LocalStorageEncryptService } from './local-storage-encrypt.service';
import { GenericService } from './generic.service';
import { Injectable } from "@angular/core";

export interface ParamSQL {
    table: string,
    selectables?: Array<any>,//get Attributes in FROM of select
    conditions?: any,//Condiciones que van en where
    inserts?: any,
    updates?: any,
    querie?: any,
    typeSQL: number,
    push?: string
}

const enum TypeSQL {
    CREATE = 1,
    ALL = 2,
    ALL_PARAMS = 3,
    UPDATE = 4,
    DELETE = 5,
    PARAMETRIZABLE = 6
}

@Injectable({
    providedIn: "root"
})
export class SqlGenericService {

    constructor(
        private genericService: GenericService,
        private localStorageEncryptService: LocalStorageEncryptService
    ) {

    }

    private create(data: ParamSQL) {
        let sql = `INSERT INTO ${data.table} (`;
        if (data.inserts) {
            let titulosInserts: any = Object.keys(data.inserts);
            let valoresInserts: any = Object['values'](data.inserts);

            titulosInserts.forEach(select => {
                sql += `${select},`;
            });
            sql = sql.slice(0, -1);
            sql += ') VALUES(';

            valoresInserts.forEach(select => {
                sql += `${select.type == 'string' ? "'" : ""}${select.value}${select.type == 'string' ? "'" : ""},`;
            });
            sql = sql.slice(0, -1);
        }
        let sqli: string = sql.trim();
        sqli += ')';

        return sqli;
    }

    private delete(dataSQL: ParamSQL) {
        //let sql = 'DELETE FROM tasks WHERE id=?';
        let sql = `DELETE FROM ${dataSQL.table} WHERE 1=1`;
        if (dataSQL.conditions) {
            sql += ` `;
            let titulosSelectables: any = Object.keys(dataSQL.conditions);
            let valoresSelectables: any = Object['values'](dataSQL.conditions);
            for (let index = 0; index < titulosSelectables.length; index++) {
                let condition = titulosSelectables[index];
                let valor = valoresSelectables[index];
                sql += `AND ${condition} ${valor.type ? valor.type : '='} ${valor.type && valor.type == "like" ? '"' : ''}${valor.type && valor.type == "like" ?
                    '%' + valor.value + '%' : valor.value}${valor.type && valor.type == "like" ? '"' : ''}`;
            }
        }
        return sql;
    }

    private getAll(dataSQL: ParamSQL) {
        let sql = `SELECT * FROM ${dataSQL.table}`;
        return sql;
    }

    private getAllByParams(data: ParamSQL) {
        let sql = `SELECT `;
        if (data.selectables) {
            data.selectables.forEach(select => {
                sql += `${select},`;
            });
            sql = sql.slice(0, -1);
        } else {
            sql += "*";
        }
        sql += ` FROM ${data.table} WHERE 1=1`;
        if (data.conditions) {
            sql += ` `;
            let titulosSelectables: any = Object.keys(data.conditions);
            let valoresSelectables: any = Object['values'](data.conditions);
            for (let index = 0; index < titulosSelectables.length; index++) {
                let condition = titulosSelectables[index];
                let valor = valoresSelectables[index];
                sql += `AND ${condition} ${valor.type ? valor.type : '='} ${valor.type && valor.type == "like" ? '"' : ''}${valor.type && valor.type == "like" ?
                    '%' + valor.value + '%' : valor.value}${valor.type && valor.type == "like" ? '"' : ''}`;
            }
        }

        return sql;
    }

    private update(dataSQL: ParamSQL) {
        //let sql = 'UPDATE tasks SET title=?, completed=? WHERE id=?';
        let sql = `UPDATE ${dataSQL.table} SET `;
        if (dataSQL.updates) {
            let titulosUpdates: any = Object.keys(dataSQL.updates);
            let valoresUpdates: any = Object['values'](dataSQL.updates);

            for (let index = 0; index < titulosUpdates.length; index++) {
                const propiedad = titulosUpdates[index];
                const valor = valoresUpdates[index];
                sql += `${propiedad} = ${valor.type == 'string' ? "'" : ""}${valor.value}${valor.type == 'string' ? "'" : ""},`;
            }
            sql = sql.slice(0, -1);
        }

        if (dataSQL.conditions) {
            sql += ` WHERE 1=1 `;
            let titulosSelectables: any = Object.keys(dataSQL.conditions);
            let valoresSelectables: any = Object['values'](dataSQL.conditions);
            for (let index = 0; index < titulosSelectables.length; index++) {
                let condition = titulosSelectables[index];
                let valor = valoresSelectables[index];
                sql += `AND ${condition} ${valor.type ? valor.type : '='} ${valor.type && valor.type == "like" ? '"' : valor.type && valor.type == "string" ? "'" : ''}${valor.type && valor.type == "like" ?
                    '%' + valor.value + '%' : valor.value}${valor.type && valor.type == "like" ? '"' : valor.type && valor.type == "string" ? "'" : ''}`;
            }
        }
        //console.log(sql);
        return sql;
    }

    executeQuery(dataSQL: ParamSQL) {
        let query: string = "";
        switch (dataSQL.typeSQL) {
            case 1:
                query = this.create(dataSQL);
                break;
            case 2:
                query = this.getAll(dataSQL);
                break;
            case 3:
                query = this.getAllByParams(dataSQL);
                break;
            case 4:
                query = this.update(dataSQL);
                break;
            case 5:
                query = this.delete(dataSQL);
                break;
            case 6:
                query = dataSQL.querie
        }
        //console.log(query);
        //console.log(dataSQL.typeSQL);
        let queryEncrypt: any = this.localStorageEncryptService.encryptBack(query);
        ////console.log(params);
        let request: any = {
            query: queryEncrypt,
            retorna: dataSQL.typeSQL == 1 ? 3 : dataSQL.typeSQL > 1 && dataSQL.typeSQL < 4 ? 1 : 9,
            push: dataSQL.push ? dataSQL.push : null
        }

        if(request.push !== null && !emulado){
            let user:any = this.localStorageEncryptService.getFromLocalStorage("userSession");
            request.token = user.token;
        }else if(request.push !== null && emulado){
            let user:any = this.localStorageEncryptService.getFromLocalStorage("userSession");
            request.token = "tokenFake";
        }else{
            request.token = null;
        }

        //console.log(request);
        

        return this.genericService.sendPostRequest(environment.genericQuerie, request);
        /* .subscribe((response: any) => {
            //console.log(response.parameters);
            response.parameters.forEach(element => {
              this.catalogo.push(element);
            });
          }, (error: HttpErrorResponse) => {
            
            //this.alertaService.errorAlertGeneric("Ocurrió un error,");
          }); */
    }

    returnQuery(dataSQL: ParamSQL) {
        let query: string = "";
        switch (dataSQL.typeSQL) {
            case 1:
                query = this.create(dataSQL);
                break;
            case 2:
                query = this.getAll(dataSQL);
                break;
            case 3:
                query = this.getAllByParams(dataSQL);
                break;
            case 4:
                query = this.update(dataSQL);
                break;
            case 5:
                query = this.delete(dataSQL);
                break;
            case 6:
                query = dataSQL.querie
        }
        //console.log(query);
        //console.log(dataSQL.typeSQL);
        let queryEncrypt: any = this.localStorageEncryptService.encryptBack(query);
        return queryEncrypt;
        /* .subscribe((response: any) => {
            //console.log(response.parameters);
            response.parameters.forEach(element => {
              this.catalogo.push(element);
            });
          }, (error: HttpErrorResponse) => {
            
            //this.alertaService.errorAlertGeneric("Ocurrió un error,");
          }); */
    }

    excecuteQueryString(query:string, whitReturn:number = 1){
        let queryEncript: any = this.localStorageEncryptService.encryptBack(query);
       //console.log(query);
        
        let sqlplit: any[] = query.split(" ");
        if (sqlplit[0].toUpperCase() == "insert".toUpperCase()) {
            whitReturn = 3;
        }else if (sqlplit[0].toUpperCase() == "update".toUpperCase()) {
            whitReturn = 3;
        }
        
        let request:any = {
            query: queryEncript,
            retorna: whitReturn,
            push: null,
            token: null
        };

        return this.genericService.sendPostRequest(environment.genericQuerie, request);
    }
}