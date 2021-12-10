import { Injectable } from '@angular/core';
@Injectable()
export class ValidationService {
  /** Generate ValidationService */
  constructor() {
  }
  public getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': "Campo requerido",
      'invalidCreditCard': 'Número de tarjeta inválido',
      'invalidEmailAddress': 'Correo electrónico inválido',
      'invalidPassword': 'Contraseña inválida. La contraseña debe contener mínimo 8 caracteres, por lo menos un valor numérico y mínimo un símbolo.',
      'minlength': `Mínimum longitud ${validatorValue.requiredLength}`,
      'maxlength': `Maxima longitud ${validatorValue.requiredLength}`,
      'seleccion': 'El campo es requerido, selecciona al menos uno',
      'invalidNumber': 'Ingrese un número válido',
      'phone': 'Ingrese un número válido',
      'maxilength': `Longitud máxima 10 dígitos`,
      'minilength': `Longitud mínima 10 dígitos`,
      'minilengthpass': `Longitud mínima requerida 6 caracteres`,
      'maxilengthpass': `Longitud máxima requerida 10 caracteres`,
      'onlyCharacter': `El campo es de tipo texto`,
    };
    return config[validatorName];
  }
  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if(control.value){
      if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
        return null;
      }
      else {
        return { 'invalidCreditCard': true };
      }
    }
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value) {
      if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return null;
      }
      else {
        return { 'invalidEmailAddress': true };
      }
    }

  }

  static characterValidator(control) {
    
    // RFC 2822 compliant regex
    if (control.value) {
      if (control._pendingValue.match(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)) {
        
        return null;
      }
      else {
        if (control._pendingValue.substring(0, control.value.length - 1).match(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)) {
          
          control.setValue(control._pendingValue.substring(0, control._pendingValue.length - 1));
          return null;
        } else {
          return null;
        }
      }
    }

  }

  static phoneValidator(control) {
    // RFC 2822 compliant regex
    if (control.value) {
      if (control._pendingValue.match("^[0-9]*$")) {
        return null;
      } else {
        if (control._pendingValue.substring(0, control.value.length - 1).match("^[0-9]*$")) {
          control.setValue(control._pendingValue.substring(0, control._pendingValue.length - 1));
          return null;
        } else {
          return null;
        }

      }
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if(control.value){
      if (control.value.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")) {
        return null;
      }
      else {
        return { 'invalidPassword': true };
      }
    }
  }

  static maxLengthValidator(control) {
    if (control.value) {
      if (control._pendingValue.length <= 10) {
        return null;
      } else {

        if (control._pendingValue.length > 10) {
          control.setValue(control._pendingValue.substring(0, control._pendingValue.length - 1));
          return null;
        } else {
          return null;
        }

      }
    }
  }

  static maxLengthCCV(control) {
    if (control.value) {
      if (control._pendingValue.length <= 3) {
        return null;
      } else {

        if (control._pendingValue.length > 3) {
          control.setValue(control._pendingValue.substring(0, control._pendingValue.length - 1));
          return null;
        } else {
          return null;
        }

      }
    }
  }

  static maxLengthCard(control) {
    if (control.value) {
      if (control._pendingValue.length <= 20) {
        return null;
      } else {

        if (control._pendingValue.length > 20) {
          control.setValue(control._pendingValue.substring(0, control._pendingValue.length - 1));
          return null;
        } else {
          return null;
        }

      }
    }
  }

  static minLengthValidator(control) {
    if (control.value) {
      if (control._pendingValue.length >= 10) {
        return null;
      } else {

        if (control._pendingValue.length < 10) {
          return { 'minilength': true };
        } else {
          return null;
        }

      }
    }
  }

  static minLengthPassValidator(control) {
    if (control.value) {
      if (control._pendingValue.length >= 6) {
        return null;
      } else {

        if (control._pendingValue.length < 6) {
          return { 'minilengthpass': true };
        } else {
          return null;
        }

      }
    }
  }

  static maxLengthPassValidator(control) {
    if (control.value) {
      if (control._pendingValue.length <= 10) {
        return null;
      } else {

        if (control._pendingValue.length > 10) {
          return { 'maxilengthpass': true };
        } else {
          return null;
        }

      }
    }
  }

  static numberValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match("^[0-9]*$")) {
      return null;
    }
    else {
      return { 'invalidNumber': true };
    }
  }
}
