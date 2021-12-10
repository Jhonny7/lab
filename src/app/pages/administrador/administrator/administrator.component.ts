
import { SqlGenericService } from '../../../services/sqlGenericService';
import { LoaderService } from '../../../services/loading-service';
import { environment, idEmpresa } from '../../../../environments/environment.prod';
import { GenericService } from '../../../services/generic.service';
import { AlertService } from '../../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit {

  public sections: any = [];

  public env: any = environment;
  constructor(
    private alertService: AlertService,
    private genericService: GenericService,
    private loadingService: LoaderService,
    private sqlGenericService: SqlGenericService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    document.addEventListener('contextmenu', event => event.preventDefault());
    //console.log(this.);
    //
    /* this.sections.forEach(itm => {
      if(itm){
        itm.preload();
      }
    }); */

    this.cargarTipoCatalogos();
  }

  cargarTipoCatalogos(){
    let sql: string = `SELECT * FROM tipo_catalogo WHERE visible = 1`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      //console.log(response);
      response.parameters.forEach((itm,index) => {
       //console.log(index);
       //console.log(this.sections);
        
        this.sections.push({
          id: index+1,
          name: itm.descripcion,
          catalogType: itm.id,
          files: [],
          filesInfo: [],
          filesText: [],
          idArchivo: null, 
          elements: [],
          countFiles: -1,
          change: (event) => {
            this.fileChangeEvent(event, this.sections[index]);
          },
          onDrop: (event) => {
            this.onDrop(event, this.sections[index]);
          },
          description: "Carga las imágenes que necesitas en tu catálogo, no hay límite",
          upload: (i, f) => {
            this.consumoServicio(this.sections[index], true, i, f);
          },
          reset: (array, position, DB: boolean = false) => {
            this.sections[index].filesText = [];
            if (DB) {
              this.deleteFile(this.sections[index].idArchivo[position], this.sections[index], position);
            } else {
              array.splice(position, 1);
            }
          },
          update: (element: any) => {
            this.upd(element);
          }, 
          inputClc: (element) => { 
            let id: any = document.getElementById(`filer-${element.id}`); id.click(); 
          },
          otherImg: (event: any, element: any) => {
            this.otherImg(event, element);
          }, 
          preload: () => {
            this.cargarLogo(this.sections[index]);
          }
        });

        
      });

      this.sections.forEach(element => {
        element.preload();
      });

    }, (error: HttpErrorResponse) => {

    });
  }

  cargarLogo(section: any) {
   //console.log(section);
    
    let sql: string = `SELECT * FROM catalogo WHERE id_tipo_catalogo = ${section.catalogType} AND id_empresa = ${idEmpresa}`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      //console.log(response);

      switch (section.id) {
        default:
          section.idArchivo = [];
          section.elements = [];
          response.parameters.forEach(e => {
            section.elements.push(e);
          });
          break;
      }
    }, (error: HttpErrorResponse) => {

    });
  }

  deleteFile(idFile: number, obj: any, position: number = -1) {
    //console.log(idFile,obj,position);

    let sql: string = `DELETE catalogo, archivo
    FROM catalogo
    INNER JOIN archivo ON catalogo.id_archivo = archivo.id
    WHERE catalogo.id_archivo = ${obj.elements[position].id_archivo}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      //console.log(response);
      if (obj.countFiles == -1 || obj.countFiles > 1) {
        //obj.idArchivo[position] = null;
        obj.elements.splice(position, 1);
      } else {
        obj.idArchivo = null;
      }
    }, (error: HttpErrorResponse) => {

    });
  }

  onDrop(ev, variable) {

    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // Si los elementos arrastrados no son ficheros, rechazarlos
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          //console.log(file);
          variable.filesInfo.push({
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type
          });

          variable.filesText.push({
            name: "",
            descripcion: ""
          });
          this.validateFile(file, variable, ev, true);
        }
      }
    } else {
      // Usar la interfaz DataTransfer para acceder a el/los archivos
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        //console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
  }

  onDragOver(event, s) {
    let id: any = document.getElementById(`drag-${s.id}`);
    //id.style.opacity = "0.7";

    event.stopPropagation();
    event.preventDefault();
  }

  onDropOver(event, s) {
    let id: any = document.getElementById(`drag-${s.id}`);
    id.style.opacity = "1";

    event.stopPropagation();
    event.preventDefault();
  }

  otherImg(evt: any, elemtn: any) {
    let file: any = evt.target.files[0];
    elemtn.fileTmp = file;
    if (file.size > 2000000) {
      this.alertService.warnAlert(
        "Ooops!",
        "Tu archivo debe ser de máximo 2MB de tamaño, Intenta nuevamente con otro archivo",
        () => {
          ////console.log("hola");
        }
      );
    } else if (
      file.type != "image/png" &&
      file.type != "image/jpg" &&
      file.type != "image/jpeg" &&
      file.type != "image/svg+xml"
    ) {
      this.alertService.warnAlert(
        "Ooops!",
        "Solo aceptamos archivos en formato png, jpg y svg",
        () => {
          ////console.log("hola");
        }
      );
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.type == "image/svg+xml") {
          let img: any = new Image();
          img.src = reader.result;

          img.onload = function () {
            let canvas: any = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let context: any = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            let png: any = canvas.toDataURL("image/png");
            //console.log(png);

            elemtn.b64 = png;
            elemtn.files = [];
            elemtn.files.push(
              {
                b64: png,
                b64Security: png
              }
            );
          };

        } else {
          elemtn.b64 = reader.result;
          elemtn.files = [];
          elemtn.files.push(
            {
              b64: reader.result,
              b64Security: reader.result
            }
          );
        }

      };
      reader.onerror = error => {
        ////console.log("Error: ", error);
      };
    }
  }

  fileChangeEvent(evt: any, variable: any) {
    if (variable.files.length < variable.countFiles || variable.countFiles == -1) {
      let file: any = evt.target.files[0];
      variable.filesInfo.push({
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        namer: "",
        descripcion: ""
      });
      this.validateFile(file, variable, evt);
    } else {
      this.alertService.warnAlert(
        "Ooops!",
        "Cantidad de archivos excedidos",
        () => {
          ////console.log("hola");
        }
      );
    }
  }

  validateFile(file, variable: any, evt: any, fromDrop: boolean = false) {
    //console.log(file);

    if (file.size > 2000000) {
      this.alertService.warnAlert(
        "Ooops!",
        "Tu archivo debe ser de máximo 2MB de tamaño, Intenta nuevamente con otro archivo",
        () => {
          ////console.log("hola");
        }
      );
    } else if (
      file.type != "image/png" &&
      file.type != "image/jpg" &&
      file.type != "image/jpeg" &&
      file.type != "image/svg+xml"
    ) {
      this.alertService.warnAlert(
        "Ooops!",
        "Solo aceptamos archivos en formato png, jpg y svg",
        () => {
          ////console.log("hola");
        }
      );
    } else {
      this.getBase64(!fromDrop ? evt.target.files[0] : file, variable);
    }
  }

  getBase64(file, variable: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (file.type == "image/svg+xml") {
        let img: any = new Image();
        img.src = reader.result;

        img.onload = function () {
          let canvas: any = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          let context: any = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
          let png: any = canvas.toDataURL("image/png");
          //console.log(png);
          variable.files.push(
            {
              b64: png,
              b64Security: png
            }
          );
        };

      } else {
        variable.files.push(
          {
            b64: reader.result,
            b64Security: file.type == "image/svg+xml" ? this.domSanitizer.bypassSecurityTrustResourceUrl(String(reader.result)) : reader.result
          }
        );
      }

    };
    reader.onerror = error => {
      ////console.log("Error: ", error);
    };
  }

  consumoServicio(obj: any, ind: boolean = false, position: number = 0, fileR: any = null) {
    //catalogType
    //filesInfo
    //files
    let request: any = {};
    if (!ind) {
      if (obj.files.length > 0) {

        for (let index = 0; index < obj.filesInfo.length; index++) {
          const f = obj.files[index];

          obj.filesInfo[index].base64 = f.b64;
        }

        request = {
          files: obj.filesInfo,
          idEmpresa: idEmpresa,
          tipo: obj.catalogType,
          name: obj.name,
          multi: false
        };

      }
    } else {
      const f = obj.files[position];
      obj.filesInfo[position].base64 = f.b64;

      let fls: any[] = [];
      fls.push(obj.filesInfo[position]);

      let textos: any[] = [];
      textos.push(obj.filesText[position]);

      request = {
        files: fls,
        idAdjunto: obj.idArchivo,
        idEmpresa: idEmpresa,
        tipo: obj.catalogType,
        name: fileR.namer,
        description: fileR.descripcion,
        multi: true
      };
    }

    this.loadingService.show();
    this.genericService
      .sendPostRequest(environment.loadBlob, request)
      .subscribe(
        (response: any) => {
          ////console.log(response);
          //fileR.subido = true;
          this.loadingService.hide();
          if (!ind) {
            obj.idArchivo = response.parameters;
          } else {
            obj.idArchivo.push(response.parameters);
            obj.files.splice(position, 1);
          }

          obj.preload();
          this.alertService.successAlert(
            "Bien!",
            `Hemos actualizado tu imagen`,
            () => {
              ////console.log("hola");
            }
          );
        },
        (error: HttpErrorResponse) => {
          this.loadingService.hide();
          this.alertService.errorAlert(
            "Ooops!",
            "Ha sucedido un error, intenta recargar nuevamente, si el error persiste contacta a un administrador",
            () => {
              ////console.log("hola");
            }
          );
        }
      );
  }

  getImageSecurity(i) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`${environment.getImagenIndividual}${i}`);
  }

  upd(element: any) {
   //console.log(element);
    let fls: any = null;
    if (element.fileTmp) {
      fls = [];
      element.fileTmp.base64 = element.b64;
      fls.push(element.fileTmp);
    }

    let request = {
      files: fls,
      idEmpresa: idEmpresa,
      id: element.id,
      name: element.nombre,
      description: element.descripcion,
      multi: true,
      update: true,
      idAdjunto: element.id_archivo,
      tipo: "Inactive"
    };

    this.loadingService.show();
    this.genericService
      .sendPostRequest(environment.loadBlob, request)
      .subscribe(
        (response: any) => {
          ////console.log(response);
          //fileR.subido = true;
          this.loadingService.hide();
          element.id_archivo = response.parameters;
          delete element.fileTmp;
          delete element.b64;

          this.alertService.successAlert(
            "Bien!",
            `Hemos actualizado tu imagen`,
            () => {
              ////console.log("hola");
            }
          );
        },
        (error: HttpErrorResponse) => {
          this.loadingService.hide();
          this.alertService.errorAlert(
            "Ooops!",
            "Ha sucedido un error, intenta recargar nuevamente, si el error persiste contacta a un administrador",
            () => {
              ////console.log("hola");
            }
          );
        }
      );
  }

}
