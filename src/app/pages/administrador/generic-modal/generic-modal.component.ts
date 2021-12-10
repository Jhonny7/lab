import { element } from 'protractor';
import { catalogoSabias } from './../../../../environments/environment.prod';

import { DomSanitizer } from '@angular/platform-browser';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { idEmpresa, environment, pathSettlementsCity } from 'src/environments/environment.prod';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as classic from '@ckeditor/ckeditor5-build-classic';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import { AlertService } from 'src/app/services/alert.service';
import { GenericService } from 'src/app/services/generic.service';
import { LoaderService } from 'src/app/services/loading-service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements OnInit {

  public img: any = environment.getImagenIndividual;
  public filesInfo: any = {};
  public temas: any[] = [];
  public servicios: any[] = [];
  public perfiles: any[] = [];
  public redes: any[] = [];
  public municipios: any[] = [];
  public complejidades: any[] = [];
  public respuestaTemporal: string = "";
  public respuestasTemporales: any[] = [];
  //public examenTemporal: any = [];
  public preguntaTemporal: string = "";

  public examenTemporal:any = [];

  public tipoRespuesta: number = 1;

  public fileInfo: any[] = [];
  public files: any[] = [];
  public filesText: any[] = [];

  public redTemporal: any = {
    tipo: null,
    link: ""
  };
  public redTemporales: any[] = [];
  public servs: any[] = [];
  public elements: any[] = [];

  public Editor = DecoupledEditor;

  editorConfig = {
    mediaEmbed: {
      previewsInData: true
    }
  }

  public model = {
    editorData: `<p>Ingresa descripción de la cápsula</p>`,
    Editor: DecoupledEditor,

  };

  public s: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private parentDilogRef: MatDialogRef<any>,
    private alertService: AlertService,
    private domSanitizer: DomSanitizer,
    private sqlGenericService: SqlGenericService,
    private loadingService: LoaderService,
    private genericService: GenericService) {

  }

  ngOnInit(): void {

    /*
    pregunta: "",
          respuesta: "",
          id_tema: null,
          id: null
    */
    switch (this.data.id) {
      case 1:
        //this.data.idArchivo = this.data.current.url;
        break;
      case 2:
        this.cargarPerfiles();
        this.cargarTemas();
        break;
      case 3:
        this.cargarPerfiles();
        this.cargarTemas();
        this.cargarComplejidades();
        break;
      case 7:
        this.cargarPerfiles();
        this.cargarTemas();
        break;
      case 4:
        //this.data.idArchivo = this.data.current.id_archivo;
        this.cargarPerfiles();
        this.cargarTemas();
        break;
      case 5:
        if (this.data.current.id) {
          this.redTemporales = JSON.parse(this.data.current.links);
          this.servs = this.data.current.servicios.split(",");
        }
        this.getServicios();
        this.getStates();
        this.getRedes();
        break;
      case 6:
        if (this.data.current.id && this.data.current.json) {
          this.redTemporales = JSON.parse(this.data.current.json);
        }
        this.cargarPerfiles();
        this.cargarTemas();
        this.cargarTipoCatalogos();
        this.getVideos();
        break;
      default:
        break;
    }
  }

  cargarTipoCatalogos() {
    let sql: string = `SELECT * FROM tipo_catalogo WHERE id = 35`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      //console.log(response);
      response.parameters.forEach((itm, index) => {
        //console.log(index);
        //console.log(this.sections);

        this.s = {
          id: index + 1,
          name: itm.descripcion,
          catalogType: itm.id,
          files: [],
          filesInfo: [],
          filesText: [],
          idArchivo: null,
          elements: [],
          countFiles: -1,
          change: (event) => {
            this.fileChangeEvent(event, this.s);
          },
          onDrop: (event) => {
            this.onDrop(event, this.s);
          },
          description: "Carga las imágenes que necesitas en tu catálogo, no hay límite",
          upload: (i, f) => {
            this.consumoServicio(this.s, true, i, f);
          },
          reset: (array, position, DB: boolean = false) => {
            this.s.filesText = [];
            if (DB) {
              this.deleteFile(this.s.idArchivo[position], this.s, position);
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
            this.cargarLogo(this.s);
          }
        };


      });

      this.s.preload();

    }, (error: HttpErrorResponse) => {

    });
  }

  changeImg(evt: any) {
    console.log("------------------------------------");

    let file: any = evt.target.files[0];
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

      this.filesInfo = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        namer: "",
        descripcion: ""
      };

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.type == "image/svg+xml") {
          let img: any = new Image();
          img.src = reader.result;

          img.onload = () => {
            let canvas: any = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let context: any = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            let png: any = canvas.toDataURL("image/png");
            //console.log(png);
            switch (this.data.id) {
              case 1:
                this.data.current.b64 = png;
                this.data.current.url = null;
                break;

              default:
                break;
            }

          };

        } else {
          switch (this.data.id) {
            case 1:
              this.data.current.b64 = reader.result;
              this.data.current.url = null;
              break;
            case 7:
              this.data.current.b64 = reader.result;
              this.data.current.url = null;
              break;

            default:
              break;
          }
        }

      };
      reader.onerror = error => {
        ////console.log("Error: ", error);
      };
    }
  }

  getStates() {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append("idState", 15);//definido por sharkit
    this.genericService.sendGetParams(pathSettlementsCity, httpParams).subscribe((response: any) => {
      //this.dataInvitado.municipio.value = "0";
      this.municipios = response.parameters;
    }, (error: HttpErrorResponse) => {

    });
  }

  changeVideo(evt: any) {
    let file: any = evt.target.files[0];
    if (file.size > 20000000) {
      this.alertService.warnAlert(
        "Ooops!",
        "Tu archivo debe ser de máximo 20MB de tamaño, Intenta nuevamente con otro archivo",
        () => {
          ////console.log("hola");
        }
      );
    } else if (
      file.type != "video/mp4" &&
      file.type != "video/avi" &&
      file.type != "image/mpeg" &&
      file.type != "video/mkv"
    ) {
      this.alertService.warnAlert(
        "Ooops!",
        "Solo aceptamos archivos en formato avi, mpeg y mkv",
        () => {
          ////console.log("hola");
        }
      );
    } else {

      this.filesInfo = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        namer: "",
        descripcion: ""
      };

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        switch (this.data.id) {
          case 4:
            this.data.current.b64 = reader.result;
            this.data.current.url = null;
            break;

          default:
            break;
        }

      };
      reader.onerror = error => {
        ////console.log("Error: ", error);
      };
    }
  }

  add() {
    switch (this.data.id) {
      case 1:
        if (this.data.status) {
          this.editTema();
        } else {
          this.createTema();
        }
        break;
      case 4:
        if (this.data.status) {
          this.editCapsula();
        } else {
          this.createCapsula();
        }
        break;
      case 2:
        if (this.data.status) {
          this.editPregunta();
        } else {
          this.createPregunta();
        }
        break;
      case 3:
        if (this.data.status) {
          this.editTrivia();
        } else {
          this.createTrivia();
        }
        break;
      case 7:
        if (this.data.status) {
          this.editExamen();
        } else {
          this.createExamen();
        }
        break;

      case 5:
        if (this.data.status) {
          this.editDirectorio();
        } else {
          this.createDirectorio();
        }
        break;
      case 6:
        if (this.data.status) {
          this.editSabias();
        } else {
          this.createSabias();
        }
        break;
      default:
        break;
    }
  }

  onConfirmClick() {
    this.parentDilogRef.close(false);
  }

  ///CREATES
  createTema() {
    if (this.data.current.label.length == 0) {
      this.alertService.warnAlert("Espera!", "El campo descripción es requerido");
    } else {

      if (this.data.current.b64.length > 0) {
        let fls: any[] = [];
        fls.push({ ...this.filesInfo, base64: this.data.current.b64 });

        let request = {
          files: fls,
          idAdjunto: this.data.idArchivo,
          idEmpresa: idEmpresa,
          tipo: 31,
          name: this.data.current.label,
          description: this.data.current.label,
          multi: true
        };

        this.loadingService.show("Agregando...");
        let sqlTema = `INSERT INTO catalogo (id_tipo_catalogo, id_empresa, descripcion, nombre) VALUES ('31', ${idEmpresa}, '${this.data.current.label}', '${this.data.current.label}')`;
        //console.log(sqlTema);

        this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
          let returnId: any = resp.parameters;
          if (this.data.current.b64 && this.data.current.b64.length > 0) {
            let requestFile: any = {
              b64: this.data.current.b64,
              id: returnId,
              extension: "png",
              table: "catalogo"
            };
            this.genericService.sendPostRequest(environment.loadFile, requestFile).subscribe((resp2: any) => {
              //Se registra correctamente nuevo usuario
              this.alertService.successAlert("Bien!", "Tema creado exitosamente");
              this.parentDilogRef.close(false);
              this.loadingService.hide();
              //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
              //this.listenNotifications();
            }, (err: HttpErrorResponse) => {
              this.loadingService.hide();
            });
          } else {
            this.alertService.successAlert("Bien!", "Tema creado exitosamente");
            this.parentDilogRef.close(false);
            this.loadingService.hide();
          }

        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      } else {
        let sqlTema2 = `INSERT INTO catalogo (id_tipo_catalogo, id_empresa, descripcion, nombre) VALUES ('31', ${idEmpresa}, '${this.data.current.label}', '${this.data.current.label}')`;

        this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
          //Se registra correctamente nuevo usuario
          this.alertService.successAlert("Bien!", "Tema creado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
          //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
          //this.listenNotifications();
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      }

    }
  }

  async createSabias(fromFiles: boolean = false) {
    if (this.data.current.descripcion.length == 0 ||
      this.data.current.nombre.length == 0 ||
      this.data.current.id_tema == "0" ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else if (this.s.files.length + this.s.elements.length > 5) {
      this.alertService.warnAlert("Espera!", "Máximo puedes almacenar 6 imágenes en esta sección");
    } else {

      if (fromFiles) {
        let json = JSON.stringify(this.redTemporales);
        let sqlTema2 = `INSERT INTO catalogo (id_tipo_usuario,id_tema, json, id_tipo_catalogo, id_empresa, descripcion, nombre, id_referencia) 
        VALUES (${this.data.current.id_tipo_usuario},${this.data.current.id_tema},'${json}',34, ${idEmpresa}, '${this.data.current.descripcion}', '${this.data.current.nombre}', '${catalogoSabias}')`;

        return this.sqlGenericService.excecuteQueryString(sqlTema2);
      } else {
        let json = JSON.stringify(this.redTemporales);
        let sqlTema2 = `INSERT INTO catalogo (id_tipo_usuario, id_tema, json, id_tipo_catalogo, id_empresa, descripcion, nombre, id_referencia) 
        VALUES (${this.data.current.id_tipo_usuario},${this.data.current.id_tema},'${json}',34, ${idEmpresa}, '${this.data.current.descripcion}', '${this.data.current.nombre}', '${catalogoSabias}')`;

        this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
          //Se registra correctamente nuevo usuario
          this.alertService.successAlert("Bien!", "Registro creado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
          //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
          //this.listenNotifications();
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      }

    }
  }

  createCapsula() {
    if (this.data.current.descripcion.length == 0 ||
      this.data.current.nombre.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {

      if (this.data.current.b64.length > 0) {
        let fls: any[] = [];
        fls.push({ ...this.filesInfo, base64: this.data.current.b64 });

        let request = {
          files: fls,
          idAdjunto: this.data.idArchivo,
          idEmpresa: idEmpresa,
          tipo: 31,
          name: this.data.current.nombre,
          description: this.data.current.descripcion,
          multi: true
        };

        this.loadingService.show("Agregando...");

        let sqlTema = `INSERT INTO capsula (id_tipo_usuario, id_tema, id_empresa, descripcion, nombre) VALUES (${this.data.current.id_tipo_usuario},${this.data.current.id_tema}, ${idEmpresa}, '${this.data.current.descripcion}', '${this.data.current.nombre}')`;
        //console.log(sqlTema);

        this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
          let returnId: any = resp.parameters;
          if (this.data.current.b64 && this.data.current.b64.length > 0) {
            let requestFile: any = {
              b64: this.data.current.b64,
              id: returnId,
              extension: "mp4",
              table: "capsula"
            };
            this.genericService.sendPostRequest(environment.loadFile, requestFile).subscribe((resp2: any) => {
              //Se registra correctamente nuevo usuario
              this.alertService.successAlert("Bien!", "Cápsula informativa creada exitosamente");
              this.parentDilogRef.close(false);
              this.loadingService.hide();
              //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
              //this.listenNotifications();
            }, (err: HttpErrorResponse) => {
              this.loadingService.hide();
            });
          } else {
            this.alertService.successAlert("Bien!", "Cápsula informativa creada exitosamente");
            this.parentDilogRef.close(false);
            this.loadingService.hide();
          }
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      } else {
        let sqlTema2 = `INSERT INTO capsula (id_tema, id_empresa, descripcion, nombre) VALUES (${this.data.current.id_tema}, ${idEmpresa}, '${this.data.current.descripcion}', '${this.data.current.nombre}')`;

        this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
          //Se registra correctamente nuevo usuario
          this.alertService.successAlert("Bien!", "Cápsula informativa creado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
          //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
          //this.listenNotifications();
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      }

    }
  }

  createExamen() {
    let error: number = 0;

    this.data.current.respuestas.forEach(element => {
      if (!element.correcto) {
        error++;
      }
    });
    //console.log(this.data.current);

    if (this.data.current.pregunta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.nombre.length == 0 ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else if (this.data.current.respuestas.length < 1) {
      this.alertService.warnAlert("Espera!", "Agrega por lo menos 1 respuesta");
    } else if (!this.data.current.respuesta) {
      this.alertService.warnAlert("Espera!", "Selecciona una respuesta correcta");
    } else {
      let jsonObj: any = {
        pregunta: this.data.current.pregunta,
        respuestas: this.data.current.respuestas,
        respuesta: this.data.current.respuesta
      };

      let json = JSON.stringify(jsonObj);
      let sqlTema2 = `INSERT INTO examen (id_tipo_usuario, id_tema, id_empresa, json_examen, nombre) VALUES (${this.data.current.id_tipo_usuario},${this.data.current.id_tema}, ${idEmpresa}, '${json}', '${this.data.current.nombre}')`;

      this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario

        let returnId: any = resp.parameters;
        if (this.data.current.b64 && this.data.current.b64.length > 0) {
          let requestFile: any = {
            b64: this.data.current.b64,
            id: returnId,
            extension: "png",
            table: "examen"
          };
          this.genericService.sendPostRequest(environment.loadFile, requestFile).subscribe((resp2: any) => {
            //Se registra correctamente nuevo usuario
            this.alertService.successAlert("Bien!", "Examen creado exitosamente");
            this.parentDilogRef.close(false);
            this.loadingService.hide();
            //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
            //this.listenNotifications();
          }, (err: HttpErrorResponse) => {
            this.loadingService.hide();
          });
        } else {
          this.alertService.successAlert("Bien!", "Examen creado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
        }
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  createPregunta() {
    if (this.data.current.pregunta.length == 0 ||
      this.data.current.respuesta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {

      let sqlTema2 = `INSERT INTO preguntas_frecuentes (id_tipo_usuario, id_tema, id_empresa, pregunta, respuesta) VALUES (${this.data.current.id_tipo_usuario},${this.data.current.id_tema}, ${idEmpresa}, '${this.data.current.pregunta}', '${this.data.current.respuesta}')`;

      this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Pregunta Frecuente creada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  createTrivia() {
    let error: number = 0;

    this.data.current.respuestas.forEach(element => {
      if (!element.correcto) {
        error++;
      }
    });
    //console.log(this.data.current);

    if (this.data.current.pregunta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_complejidad == 0 ||
      this.data.current.id_complejidad == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else if (this.data.current.respuestas.length < 4) {
      this.alertService.warnAlert("Espera!", "Agrega por lo menos 4 respuestas");
    } else if (!this.data.current.respuesta) {
      this.alertService.warnAlert("Espera!", "Selecciona una respuesta correcta");
    } else {
      let jsonObj: any = {
        pregunta: this.data.current.pregunta,
        respuestas: this.data.current.respuestas,
        respuesta: this.data.current.respuesta
      };

      let json = JSON.stringify(jsonObj);
      let sqlTema2 = `INSERT INTO trivia (id_tipo_usuario, id_tema, id_complejidad, id_empresa, json_trivia) VALUES (${this.data.current.id_tipo_usuario},${this.data.current.id_tema}, ${this.data.current.id_complejidad}, ${idEmpresa}, '${json}')`;

      this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Trivia creada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  createDirectorio() {
    //console.log(this.data.current);
    let error: number = 0;
    this.servicios.forEach(serv => {
      if (!serv.checked) {
        error++;
      }
    });

    if (this.data.current.estado_combo.length == "0" ||
      this.data.current.domicilio.length == 0 ||
      this.data.current.nombre_lugar.length == 0 ||
      error == this.servicios.length) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {
      let json = JSON.stringify(this.redTemporales);
      let url: string = "";
      let stringServs: string = "";
      let stringServs2: string = "";
      this.servicios.forEach(serv => {
        console.log(serv);
        if (serv.checked) {
          stringServs += `${serv.id},`;
          stringServs2 += `${serv.label},`;
        }
      });
      stringServs = stringServs.slice(0, -1);

      switch (stringServs) {
        case "173":
          url = "https://cdn.pixabay.com/photo/2012/04/23/16/12/click-38743_640.png";
          break;
        case "174":
          url = "https://cdn.pixabay.com/photo/2012/04/23/16/12/subway-38744_640.png";
          break;
        case "175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,174":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,174,175,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,174,175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,175,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,175,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "174,175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "174,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "174,175,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "175,176":
          url = "https://picsum.photos/700/400?random";
          break;
      }

      let sqlTema2 = `INSERT INTO directorio (id_empresa, estado_combo, domicilio, municipio,
        nombre_lugar,nombre_contacto,telefono,email,ubicacion_maps,links,servicios,url) VALUES 
        (${idEmpresa}, '${this.data.current.estado_combo}', '${this.data.current.domicilio}', '${this.data.current.estado_combo}',
        '${this.data.current.nombre_lugar}','${this.data.current.nombre_contacto}','${this.data.current.telefono}',
        '${this.data.current.email}', '${this.data.current.ubicacion_maps}', '${json}','${stringServs2}','${url}')`;

      this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Directorio creado exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  //EDITS
  editTema() {
    if (this.data.current.label.length == 0) {
      this.alertService.warnAlert("Espera!", "El campo descripción es requerido");
    } else {
      if (this.data.current.b64.length > 0) {
        let fls: any[] = [];
        fls.push({ ...this.filesInfo, base64: this.data.current.b64 });

        let request = {
          files: fls,
          idAdjunto: this.data.idArchivo,
          idEmpresa: idEmpresa,
          tipo: 31,
          name: this.data.current.label,
          description: this.data.current.label,
          multi: true
        };

        this.loadingService.show("Actualizando...");

        let sqlTema = `UPDATE catalogo SET descripcion = '${this.data.current.label}', nombre = '${this.data.current.label}' WHERE id = ${this.data.current.id}`;
        //console.log(sqlTema);

        this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
          let returnId: any = resp.parameters;
          if (this.data.current.b64 && this.data.current.b64.length > 0) {
            let requestFile: any = {
              b64: this.data.current.b64,
              id: this.data.current.id,
              extension: "png",
              table: "catalogo"
            };
            this.genericService.sendPostRequest(environment.loadFile, requestFile).subscribe((resp2: any) => {

              this.alertService.successAlert("Bien!", "Tema actualizado exitosamente");
              this.parentDilogRef.close(false);
              this.loadingService.hide();

            }, (err: HttpErrorResponse) => {
              this.loadingService.hide();
            });
          } else {
            this.alertService.successAlert("Bien!", "Tema actualizado exitosamente");
            this.parentDilogRef.close(false);
            this.loadingService.hide();
          }
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });




      } else {
        let sqlTema = `UPDATE catalogo SET descripcion = '${this.data.current.label}', nombre = '${this.data.current.label}' WHERE id = ${this.data.current.id}`;
        //console.log(sqlTema);

        this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
          //Se registra correctamente nuevo usuario
          this.alertService.successAlert("Bien!", "Tema actualizado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
          //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
          //this.listenNotifications();
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      }
    }
  }

  editSabias() {
    if (this.data.current.descripcion.length == 0 ||
      this.data.current.nombre.length == 0 ||
      this.data.current.id_tema == "0" ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {

      let json = JSON.stringify(this.redTemporales);

      let sqlTema = `UPDATE catalogo 
      SET 
      id_tipo_usuario = ${this.data.current.id_tipo_usuario},
      descripcion = '${this.data.current.descripcion}', 
      nombre = '${this.data.current.nombre}',
      json = '${json}',
      id_tema = ${this.data.current.id_tema} 
      WHERE id = ${this.data.current.id}`;
      //console.log(sqlTema);

      this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Registro actualizado exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });
    }
  }

  editCapsula() {
    if (this.data.current.descripcion.length == 0 ||
      this.data.current.nombre.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {
      if (this.data.current.b64.length > 0) {
        let fls: any[] = [];
        fls.push({ ...this.filesInfo, base64: this.data.current.b64 });

        let request = {
          files: fls,
          idAdjunto: this.data.idArchivo,
          idEmpresa: idEmpresa,
          tipo: 31,
          name: this.data.current.nombre,
          description: this.data.current.descripcion,
          multi: true
        };

        this.loadingService.show("Actualizando...");

        let sqlTema = `UPDATE capsula SET id_tipo_usuario = ${this.data.current.id_tipo_usuario}, descripcion = '${this.data.current.descripcion}', nombre = '${this.data.current.nombre}', id_tema = ${this.data.current.id_tema} WHERE id = ${this.data.current.id}`;
        //console.log(sqlTema);

        this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {

          let returnId: any = resp.parameters;
          if (this.data.current.b64 && this.data.current.b64.length > 0) {
            let requestFile: any = {
              b64: this.data.current.b64,
              id: this.data.current.id,
              extension: "mp4",
              table: "capsula"
            };
            this.genericService.sendPostRequest(environment.loadFile, requestFile).subscribe((resp2: any) => {

              this.alertService.successAlert("Bien!", "Cápsula informativa actualizada exitosamente");
              this.parentDilogRef.close(false);
              this.loadingService.hide();

            }, (err: HttpErrorResponse) => {
              this.loadingService.hide();
            });
          } else {
            this.alertService.successAlert("Bien!", "Cápsula informativa actualizada exitosamente");
            this.parentDilogRef.close(false);
            this.loadingService.hide();
          }
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });




      } else {
        let sqlTema = `UPDATE capsula SET id_tipo_usuario = ${this.data.current.id_tipo_usuario}, id_tema = ${this.data.current.id_tema}, descripcion = '${this.data.current.descripcion}', nombre = '${this.data.current.nombre}' WHERE id = ${this.data.current.id}`;
        //console.log(sqlTema);

        this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
          //Se registra correctamente nuevo usuario
          this.alertService.successAlert("Bien!", "Cápsula informativa actualizada exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
          //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
          //this.listenNotifications();
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      }
    }
  }

  editPregunta() {
    if (this.data.current.pregunta.length == 0 ||
      this.data.current.respuesta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {

      let sqlTema = `UPDATE preguntas_frecuentes SET id_tipo_usuario = ${this.data.current.id_tipo_usuario}, pregunta = '${this.data.current.pregunta}', respuesta = '${this.data.current.respuesta}', id_tema = ${this.data.current.id_tema} WHERE id = ${this.data.current.id}`;
      //console.log(sqlTema);

      this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Pregunta Frecuente actualizada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  editTrivia() {
    let error: number = 0;
    //console.log(this.data);

    this.data.current.respuestas.forEach(element => {
      if (!element.correcto) {
        error++;
      }
    });
    if (this.data.current.pregunta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_complejidad == 0 ||
      this.data.current.id_complejidad == null ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else if (this.data.current.respuestas.length < 4) {
      this.alertService.warnAlert("Espera!", "Agrega por lo menos 4 respuestas");
    } else if (!this.data.current.respuesta) {
      this.alertService.warnAlert("Espera!", "Selecciona una respuesta correcta");
    } else {
      let jsonObj: any = {
        pregunta: this.data.current.pregunta,
        respuestas: this.data.current.respuestas,
        respuesta: this.data.current.respuesta
      };

      let json = JSON.stringify(jsonObj);
      let sqlTema = `UPDATE trivia SET id_tipo_usuario = ${this.data.current.id_tipo_usuario}, json_trivia = '${json}', id_tema = ${this.data.current.id_tema}, id_complejidad = ${this.data.current.id_complejidad} WHERE id = ${this.data.current.id}`;
      //console.log(sqlTema);

      this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Trivia actualizada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  editExamen() {
    let error: number = 0;
    //console.log(this.data);

    this.data.current.respuestas.forEach(element => {
      if (!element.correcto) {
        error++;
      }
    });
    if (this.data.current.pregunta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.nombre.length == 0 ||
      this.data.current.id_tipo_usuario == 0 ||
      this.data.current.id_tipo_usuario == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else if (this.data.current.respuestas.length < 1) {
      this.alertService.warnAlert("Espera!", "Agrega por lo menos 1 respuesta");
    } else if (!this.data.current.respuesta) {
      this.alertService.warnAlert("Espera!", "Selecciona una respuesta correcta");
    } else {
      let jsonObj: any = {
        pregunta: this.data.current.pregunta,
        respuestas: this.data.current.respuestas,
        respuesta: this.data.current.respuesta
      };

      let json = JSON.stringify(jsonObj);
      let sqlTema = `UPDATE examen 
      SET 
      id_tipo_usuario = ${this.data.current.id_tipo_usuario}, 
      json_examen = '${json}', 
      id_tema = ${this.data.current.id_tema}, 
      nombre = '${this.data.current.nombre}'
      WHERE id = ${this.data.current.id}`;
      //console.log(sqlTema);

      this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario

        if (this.data.current.b64 && this.data.current.b64.length > 0) {
          let requestFile: any = {
            b64: this.data.current.b64,
            id: this.data.current.id,
            extension: "png",
            table: "examen"
          };
          this.genericService.sendPostRequest(environment.loadFile, requestFile).subscribe((resp2: any) => {

            this.alertService.successAlert("Bien!", "Examen actualizado exitosamente");
            this.parentDilogRef.close(false);
            this.loadingService.hide();

          }, (err: HttpErrorResponse) => {
            this.loadingService.hide();
          });
        } else {
          this.alertService.successAlert("Bien!", "Examen actualizado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
        }
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  editDirectorio() {
    let error: number = 0;
    this.servicios.forEach(serv => {
      if (!serv.checked) {
        error++;
      }
    });

    if (this.data.current.estado_combo.length == "0" ||
      this.data.current.domicilio.length == 0 ||
      this.data.current.nombre_lugar.length == 0 ||
      error == this.servicios.length) {
      this.alertService.warnAlert("Espera!", "Todos los campos marcados (*) son requeridos");
    } else {
      let json = JSON.stringify(this.redTemporales);

      let url: string = "";
      let stringServs: string = "";
      let stringServs2: string = "";
      this.servicios.forEach(serv => {
        console.log(serv);
        if (serv.checked) {
          stringServs += `${serv.id},`;
          stringServs2 += `${serv.label},`;
        }
      });
      stringServs = stringServs.slice(0, -1);
      console.log(stringServs);

      switch (stringServs) {
        case "173":
          url = "https://cdn.pixabay.com/photo/2012/04/23/16/12/click-38743_640.png";
          break;
        case "174":
          url = "https://cdn.pixabay.com/photo/2012/04/23/16/12/subway-38744_640.png";
          break;
        case "175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,174":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,174,175,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,174,175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,174,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "173,175,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "174,175":
          url = "https://picsum.photos/700/400?random";
          break;
        case "174,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "174,175,176":
          url = "https://picsum.photos/700/400?random";
          break;
        case "175,176":
          url = "https://picsum.photos/700/400?random";
          break;
      }
      console.log(url);


      let sqlTema = `UPDATE directorio SET 
      links = '${json}', 
      estado_combo = '${this.data.current.estado_combo}',
      municipio = '${this.data.current.estado_combo}',
      domicilio = '${this.data.current.domicilio}',
      nombre_lugar = '${this.data.current.nombre_lugar}',
      nombre_contacto = '${this.data.current.nombre_contacto}',
      telefono = '${this.data.current.telefono}',
      email = '${this.data.current.email}',
      ubicacion_maps = '${this.data.current.ubicacion_maps}',
      url = '${url}',
      servicios = '${stringServs2}'
      WHERE id = ${this.data.current.id}`;
      //console.log(sqlTema);

      this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Directorio actualizado exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  /**Combos */
  cargarTemas() {
    let sql: string = `SELECT id, descripcion as label FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.temas = resp.parameters;
      this.temas.unshift({ id: null, label: "[--Selecciona--]" });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  /**Combos */
  cargarPerfiles() {
    let sql: string = `SELECT 
    id as value, 
    nombre as label 
    FROM catalogo 
    WHERE id_tipo_catalogo = 29 AND id_empresa = ${idEmpresa} AND id != 169`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.perfiles = resp.parameters;
      this.perfiles.unshift({ value: null, label: "[--Selecciona--]" });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  getRedes() {
    let sql: string = `SELECT id, descripcion as label FROM catalogo WHERE id_tipo_catalogo = 33 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.redes = resp.parameters;
      this.redes.unshift({ id: null, label: "[--Selecciona--]" });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  getServicios() {
    let sql: string = `SELECT id, descripcion as label FROM catalogo WHERE id_tipo_catalogo = 38 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.servicios = resp.parameters;
      this.servicios.forEach(element => {
        element.checked = false;
        if (this.data.current.id) {
          let positionServ: any = this.servs.findIndex((serv) => {
            return serv == element.label;
          });
          if (positionServ >= 0) {
            element.checked = true;
          }
        }
      });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  getVideos() {
    let sql: string = `SELECT id, descripcion as label FROM catalogo WHERE id_tipo_catalogo = 36 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.redes = resp.parameters;
      this.redes.unshift({ id: null, label: "[--Selecciona--]" });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarComplejidades() {
    let sql: string = `SELECT id, descripcion as label FROM catalogo WHERE id_tipo_catalogo = 32 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.complejidades = resp.parameters;
      this.complejidades.unshift({ id: null, label: "[--Selecciona--]" });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  /**Operaciones variadas */
  aniadir() {
    let epoch = Date.now();
    if (this.respuestaTemporal.length > 0) {
      this.data.current.respuestas.push({
        correcta: false,
        respuesta: this.respuestaTemporal,
        id: epoch
      });
      this.respuestaTemporal = "";
    }
  }

  /**Operaciones variadas */
  aniadir2() {
    let epoch = Date.now();
    if (this.respuestaTemporal.length > 0) {
      this.respuestasTemporales.push({
        correcta: false,
        respuesta: this.respuestaTemporal,
        id: epoch,
        pregunta: this.preguntaTemporal,
        all: this.respuestasTemporales
      });
      this.respuestaTemporal = "";
      //this.preguntaTemporal = "";
    }
  }

  save(){
    let epoch = Date.now();
    this.examenTemporal.push({
      pregunta: this.preguntaTemporal,
      respuestas: this.respuestasTemporales,
      id: epoch,
      respuesta: this.respuestaTemporal,
      correcta: false
    });
  }

  remove(position) {
    this.data.current.respuestas.splice(position, 1);
  }

  aniadirRed() {
    let epoch = Date.now();
    if (this.redTemporal.link.length > 0 && this.redTemporal.tipo != "0") {
      this.redTemporales.push({ ... this.redTemporal })
      this.redTemporal.link = "";
      this.redTemporal.tipo = "0";
    }
  }

  aniadirVideo() {
    let epoch = Date.now();
    if (this.redTemporal.link.length > 0 && this.redTemporal.tipo != "0") {
      this.redTemporales.push({ ... this.redTemporal })
      this.redTemporal.link = "";
      this.redTemporal.tipo = "0";
    }
  }

  removeRed(position) {
    this.redTemporales.splice(position, 1);
  }

  removeVideo(position) {
    this.redTemporales.splice(position, 1);
  }

  cambio(evt: any) {
    /*//console.log(evt);
   //console.log(this.data.current.respuesta);
     */
  }

  returnType(idRed) {
    let position = this.redes.findIndex((red) => {
      return red.id == idRed
    });
    return this.redes[position].label;
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  //SABIAS QUE FILES
  cargarLogo(section: any) {
    //console.log(section);

    let sql: string = `SELECT * FROM catalogo WHERE id_tipo_catalogo = ${section.catalogType} AND id_empresa = ${idEmpresa} AND id_referencia = ${this.data.current.id}`;
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

    let sql: string = `DELETE catalogo
     FROM catalogo
     WHERE id = ${obj.elements[position].id}`;

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

    if (this.s.files.length + this.s.elements.length > 5) {
      this.alertService.warnAlert("Espera!", "Máximo puedes almacenar 6 imágenes en esta sección");
    } else {
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
    console.log(this.s);

    if (this.s.files.length + this.s.elements.length > 5) {
      this.alertService.warnAlert("Espera!", "Máximo puedes almacenar 6 imágenes en esta sección");
    } else {
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

  async consumoServicio(obj: any, ind: boolean = false, position: number = 0, fileR: any = null) {
    let idReferencia = null;
    if (!this.data.current.id) {
      (await this.createSabias(true)).subscribe((res: any) => {
        this.data.current.id = res.parameters;
        this.data.status = true;
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
            multi: true,
            idReferencia: this.data.current.id
          };
        }

        this.loadingService.show();
        this.genericService
          .sendPostRequest(environment.load, request)
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
      }, (error: HttpErrorResponse) => {

      });
    } else {
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
          multi: true,
          idReferencia: this.data.current.id
        };
      }

      this.loadingService.show();
      this.genericService
        .sendPostRequest(environment.load, request)
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

    //catalogType
    //filesInfo
    //files

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
