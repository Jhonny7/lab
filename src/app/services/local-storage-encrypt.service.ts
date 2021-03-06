import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/**Clase que guarda información en localstorage pero de forma
 * encriptada para no dejar a la vista del usuario o de terceros, la
 * información detallada de lo que se requiere utilizar durante el ciclo de vida
 * de la aplicación
 */
@Injectable(
  {
    providedIn: "root"
}
)
export class LocalStorageEncryptService {

  /**
   * Llave secreta para encriptar y desencriptar la informacion almacenada
   */
  //private secretKey = 'luegoluegoShark';
  private secretKey = '23deJulio08F!';
  /**
   * Llave secreta para encriptar y desencriptar la informacion almacenada
   */
  //private secretKey = '23dejulio08F!';

  private CryptoJSAesJson = {
    stringify: function (cipherParams) {
      var j: any = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
      if (cipherParams.iv) j.iv = cipherParams.iv.toString();
      if (cipherParams.salt) j.s = cipherParams.salt.toString();
      return JSON.stringify(j);
    },
    parse: function (jsonStr) {
      var j: any = JSON.parse(jsonStr);
      var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
      if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
      if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
      return cipherParams;
    }
  };

  encryptBack(data: any) {
    let encryptedData: any = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey, { format: this.CryptoJSAesJson }).toString();
    //console.log(encryptedData);
    
    return encryptedData;
  }

  decryptBack(data: any) {
    //let encryptedData: any = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return JSON.parse(CryptoJS.AES.decrypt(JSON.stringify(data), this.secretKey, { format: this.CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));
  }

  constructor() { }

  /**
   * Almacena encriptado los datos necesarios en el localstorage
   * @param key Llave a almacenar
   * @param data Dato a almacenar
   */
  setToLocalStorage(key: string, data: any) {
    let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    //console.log("encriptado",encryptedData);
    
    let encryptedKey = CryptoJS.SHA256(key).toString();

    encryptedData = JSON.stringify(data);
    encryptedKey = key;
    localStorage.setItem(encryptedKey, encryptedData);
  }

  yayirobe(data){
    return CryptoJS.AES.decrypt(data, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

  /**
   * Recupera valores del localstorage por medio de la llave
   * @param key Llave a obtener
   */
  getFromLocalStorage(key: string): any {
    let encryptedKey = CryptoJS.SHA256(key).toString();
    encryptedKey = key;
    const item = localStorage.getItem(encryptedKey);
    if (item === undefined || item === null) {
      return null;
    }
    let dencryptedData;// = CryptoJS.AES.decrypt(item, this.secretKey).toString(CryptoJS.enc.Utf8);
    dencryptedData = 1;
    if(dencryptedData == 1){
      return JSON.parse(item);
    }else{
      if (this.isJson(dencryptedData)) {
        return JSON.parse(dencryptedData);
      } else {
        return dencryptedData;
      }
    }
  }

  /**
   * Limpia todo el localstorage
   */
  clear() {
    localStorage.clear();
  }

  /**
   * Remueve una propiedad especifica del local storage
   * @param property Propiedad a eliminar
   */
  clearProperty(property: string) {
    const encryptedKey = CryptoJS.SHA256(property).toString();
    //localStorage.removeItem(encryptedKey);
    localStorage.removeItem(property);
  }

  /**
   * Valida si una cadena cumple el formato JSON
   * @param str Cadena a validar
   * @returns True si cumple el formato False no cumple el formato
   */
  private isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}
