import { catalogoSabias, remastered } from './../../../../environments/environment.prod';
import { AlertService } from './../../../services/alert.service';
import { environment, idEmpresa } from 'src/environments/environment.prod';
import { LoaderService } from './../../../services/loading-service';
import { SqlGenericService } from './../../../services/sqlGenericService';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericModalComponent } from '../generic-modal/generic-modal.component';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-trivia-admon',
  templateUrl: './trivia-admon.page.html',
  styleUrls: ['./trivia-admon.page.scss'],
})
export class TriviaAdmonPage implements OnInit {

  public menus: any = [
    {
      title: "Temas / Categorías",
      icon: "assignment",
      id: 1
    }, {
      title: "Preguntas Frecuentes",
      icon: "help_outline",
      id: 2
    }, {
      title: "Trivias",
      icon: "question_answer",
      id: 3
    }, {
      title: "Cápsulas informativas",
      icon: "play_circle_filled",
      id: 4
    }, {
      title: "Directorio",
      icon: "fmd_good",
      id: 5
    }, {
      title: "Sabías qué...",
      icon: "priority_high",
      id: 6
    },
  ];

  public menuActivo = 1;

  public temas: any[] = [];
  public capsulas: any[] = [];
  public directorio: any[] = [];
  public sabias: any[] = [];
  public preguntas: any[] = [];
  public trivias: any[] = [];
  public examenes: any[] = [];
  public triviaObj: any = {
    idTema: null,
    idComplejidad: null,
    complejidades: []
  }

  public img: any = environment.getImagenIndividual;

  constructor(
    private menu: MenuController,
    private sqlGenericService: SqlGenericService,
    private loadingService: LoaderService,
    private matDialog: MatDialog,
    private alertService: AlertService
  ) {
    if (remastered) {
      this.menus.push({
        title: "Exámenes",
        icon: "question_answer",
        id: 7
      });
    }
  }

  ngOnInit() {
    this.menu.enable(false);
    this.cargarTemas();
  }

  open(menu) {
    this.menuActivo = menu.id;
    switch (this.menuActivo) {
      case 1:
        this.cargarTemas();
        break;
      case 4:
        this.cargarCapsulas();
        break;
      case 2:
        this.cargarPreguntas();
        break;
      case 3:
        this.cargarTrivias();
        this.cargarTemas();
        this.cargarComplejidad();
        break;
      case 5:
        this.cargarDirectorio();
        break;
      case 6:
        this.cargarSabias();
        break;
      case 7:
        this.cargarExamenes();
        this.cargarTemas();
        break;
      default:
        break;
    }
  }

  cargarTemas() {
    if (this.menuActivo != 3) {
      this.loadingService.show("Cargando temas...");
    }
    let sql: string = `SELECT id, descripcion as label, id_archivo, url FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    //console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.temas = resp.parameters;
      if (this.menuActivo == 3) {
        this.temas.unshift({
          id: null,
          label: "[--Seleccione--]"
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarCapsulas() {
    this.loadingService.show("Cargando cápsulas...");

    let sql: string = `SELECT c.id, c.descripcion, c.nombre, c.id_archivo, c.url, cat.nombre as tema, c.id_tema, c.id_tipo_usuario FROM capsula c 
    INNER JOIN catalogo cat
    ON (cat.id = c.id_tema)
    WHERE c.id_empresa = ${idEmpresa} ORDER BY cat.nombre`;
    //console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.capsulas = resp.parameters;
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarDirectorio() {
    this.loadingService.show("Cargando directorio...");

    let sql: string = `SELECT * FROM directorio
    WHERE id_empresa = ${idEmpresa} ORDER BY nombre_lugar`;
    //console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.directorio = resp.parameters;
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarSabias() {
    this.loadingService.show("Cargando Sabías qué...");

    let sql: string = `SELECT * FROM catalogo
    WHERE id_empresa = ${idEmpresa} AND id_referencia = '${catalogoSabias}' ORDER BY nombre`;
    //console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      //console.log(resp);

      this.loadingService.hide();
      this.sabias = resp.parameters;
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarComplejidad() {
    let sql: string = `SELECT id, descripcion as label, id_archivo, url FROM catalogo WHERE id_tipo_catalogo = 32 AND id_empresa = ${idEmpresa}`;
    //console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.triviaObj.complejidades = resp.parameters;
      this.triviaObj.complejidades.unshift({
        id: null,
        label: "[--Seleccione--]"
      });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarPreguntas() {
    this.loadingService.show("Cargando preguntas frecuentes...");
    let sql: string = `SELECT 
    pf.*,
    t.nombre  
    FROM preguntas_frecuentes pf
    INNER JOIN catalogo t
    ON (t.id = pf.id_tema) 
    WHERE pf.id_empresa = ${idEmpresa}
    ORDER BY t.nombre ASC`;
    //console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.preguntas = resp.parameters;
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarTrivias() {
    this.loadingService.show("Cargando trivias...");
    let sql: string = `SELECT 
    pf.*,
    t.nombre,
    t2.nombre as complejidad 
    FROM trivia pf
    INNER JOIN catalogo t
    ON (t.id = pf.id_tema) 
    INNER JOIN catalogo t2
    ON (t2.id = pf.id_complejidad) 
    WHERE pf.id_empresa = ${idEmpresa}
    ORDER BY t.nombre ASC`;
    //console.log(sql);

    this.trivias = [];
    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      resp.parameters.forEach(element => {
        let json: any = JSON.parse(element.json_trivia);
        this.trivias.push({
          pregunta: json.pregunta,
          complejidad: element.complejidad,
          id: element.id,
          tema: element.nombre,
          json: json,
          id_tema: element.id_tema,
          id_complejidad: element.id_complejidad,
          respuestas: json.respuestas,
          respuesta: json.respuesta,
          id_tipo_usuario: element.id_tipo_usuario
        });
      });

    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarExamenes() {
    this.loadingService.show("Cargando examenes...");
    let sql: string = `SELECT 
    pf.*,
    t.nombre
    FROM examen pf
    INNER JOIN catalogo t
    ON (t.id = pf.id_tema) 
    WHERE pf.id_empresa = ${idEmpresa}
    ORDER BY t.nombre ASC`;
    console.log(sql);

    this.examenes = [];
    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      resp.parameters.forEach(element => {
        let json: any = JSON.parse(element.json_examen);
        this.examenes.push({
          pregunta: json.pregunta,
          id: element.id,
          tema: element.nombre,
          json: json,
          id_tema: element.id_tema,
          respuestas: json.respuestas,
          respuesta: json.respuesta,
          id_tipo_usuario: element.id_tipo_usuario,
          url: element.url,
          nombre: element.nombre
        });
      });

      console.log(this.examenes);
      

    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  create() {
    let data: any = {};
    data.id = this.menuActivo;
    switch (this.menuActivo) {
      case 1:
        data.status = false;
        data.id = 1;
        data.current = {
          label: "",
          b64: "",
          url: null,
          id: null
        };
        break;
      case 4:
        data.status = false;
        data.current = {
          nombre: "",
          descripcion: "",
          b64: "",
          url: null,
          id_tema: null,
          id: null,
          id_tipo_usuario: null
        };
        break;
      case 2:
        data.status = false;
        data.current = {
          pregunta: "",
          respuesta: "",
          id_tema: null,
          id: null,
          id_tipo_usuario: null
        };
        break;
      case 3:
        data.status = false;
        data.current = {
          pregunta: "",
          complejidad: null,
          id: null,
          tema: null,
          json: null,
          id_tema: null,
          id_complejidad: null,
          respuestas: [],
        };

      case 5:
        data.status = false;
        data.current = {
          estado_combo: "0",
          domicilio: "",
          id: null,
          nombre_lugar: "",
          nombre_contacto: "",
          telefono: "",
          email: "",
          ubicacion_maps: "",
          links: "",
          servicios: ""
        };
        break;
      case 6:
        data.status = false;
        data.current = {
          nombre: "",
          descripcion: "",
          id: null,
          id_tema: null,
          json: "",
          id_tipo_usuario: null
        };
        break;

      case 7:
        data.status = false;
        data.current = {
          pregunta: "",
          id: null,
          tema: null,
          json: null,
          id_tema: null,
          respuestas: [],
          nombre: "",
          b64: "",
          url: null,
        };
      default:
        break;
    }
    let matDialogConfig = { data: data, disableClose: true, panelClass: "modal-general" };
    let dialogRef = this.matDialog.open(GenericModalComponent, matDialogConfig);
    //dialogRef.
    dialogRef.beforeClosed().subscribe((r) => {
      switch (this.menuActivo) {
        case 1:
          this.cargarTemas();
          break;
        case 4:
          this.cargarCapsulas();
          break;
        case 2:
          this.cargarPreguntas();
          break;
        case 3:
          this.cargarTrivias();
          break;
        case 5:
          this.cargarDirectorio();
          break;
        case 6:
          this.cargarSabias();
          break;
        case 7:
          this.cargarExamenes();
          break;
        default:
          break;
      }
    });
  }

  edit(item: any) {
    let data: any = {};
    data.id = this.menuActivo;
    switch (this.menuActivo) {
      case 1:
        let tema = item;
        data.status = true;
        data.current = {
          label: tema.label,
          b64: "",
          url: tema.url,
          id: tema.id
        };
        break;
      case 4:
        let capsula = item;
        //console.log(capsula);

        data.status = true;
        data.current = {
          nombre: capsula.nombre,
          descripcion: capsula.descripcion,
          b64: "",
          url: capsula.url,
          id: capsula.id,
          id_tema: capsula.id_tema,
          id_tipo_usuario: capsula.id_tipo_usuario
        };
        break;
      case 2:
        let preguntaFrecuente = item;
        data.status = true;
        data.current = {
          pregunta: preguntaFrecuente.pregunta,
          respuesta: preguntaFrecuente.respuesta,
          id_tema: preguntaFrecuente.id_tema,
          id: preguntaFrecuente.id,
          id_tipo_usuario: preguntaFrecuente.id_tipo_usuario
        };
        break;
      case 3:
        let trivia = item;
        data.status = true;
        //console.log(trivia);

        data.current = {
          pregunta: trivia.pregunta,
          complejidad: trivia.complejidad,
          id: trivia.id,
          tema: trivia.tema,
          json: trivia.json,
          id_tema: trivia.id_tema,
          id_complejidad: trivia.id_complejidad,
          respuestas: trivia.respuestas,
          respuesta: trivia.respuesta,
          id_tipo_usuario: trivia.id_tipo_usuario
        }
        break;
      case 5:
        let directorio = item;
        data.status = true;

        data.current = {
          estado_combo: directorio.estado_combo,
          domicilio: directorio.domicilio,
          id: directorio.id,
          nombre_lugar: directorio.nombre_lugar,
          nombre_contacto: directorio.nombre_contacto,
          telefono: directorio.telefono,
          email: directorio.email,
          ubicacion_maps: directorio.ubicacion_maps,
          links: directorio.links,
          servicios: directorio.servicios
        }
        break;
      case 6:
        let sabias = item;
        console.log(sabias);

        data.status = true;

        data.current = {
          nombre: sabias.nombre,
          descripcion: sabias.descripcion,
          id: sabias.id,
          id_tema: sabias.id_tema,
          json: sabias.json,
          id_tipo_usuario: sabias.id_tipo_usuario
        }
        break;
      case 7:
        let examen = item;
        data.status = true;
        //console.log(trivia);

        data.current = {
          pregunta: examen.pregunta,
          id: examen.id,
          tema: examen.tema,
          json: examen.json,
          id_tema: examen.id_tema,
          respuestas: examen.respuestas,
          respuesta: examen.respuesta,
          id_tipo_usuario: examen.id_tipo_usuario,
          nombre: examen.nombre,
          b64: "",
          url: examen.url,
        }
      default:
        break;
    }

    let matDialogConfig: MatDialogConfig = { data: data, disableClose: true, panelClass: "modal-general" };
    let dialogRef = this.matDialog.open(GenericModalComponent, matDialogConfig);
    //dialogRef.
    dialogRef.beforeClosed().subscribe((r) => {
      switch (this.menuActivo) {
        case 1:
          this.cargarTemas();
          break;
        case 4:
          this.cargarCapsulas();
          break;
        case 2:
          this.cargarPreguntas();
          break;
        case 3:
          this.cargarTrivias();
          break;
        case 5:
          this.cargarDirectorio();
          break;
        case 6:
          this.cargarSabias();
          break;
        case 7:
          this.cargarExamenes();
          break;
        default:
          break;
      }
    });
  }

  delete(item: any, other: any = null) {
    let sqlDelete: string = "";
    let data: any = {};
    switch (this.menuActivo) {
      case 1:
        let tema = item;
        sqlDelete = `DELETE FROM catalogo WHERE id = ${tema.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará el tema permanentemente"
        break;
      case 4:
        let capsula = item;
        sqlDelete = `DELETE FROM capsula WHERE id = ${capsula.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará la cápsula informativa permanentemente"
        break;
      case 2:
        let pregunta = item;
        sqlDelete = `DELETE FROM preguntas_frecuentes WHERE id = ${pregunta.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará la pregunta frecuente permanentemente"
        break;
      case 3:
        let trivia = item;
        sqlDelete = `DELETE FROM trivia WHERE id = ${trivia.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará la trivia permanentemente"
        break;
      case 5:
        let directorio = item;
        sqlDelete = `DELETE FROM directorio WHERE id = ${directorio.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará el directorio permanentemente"
        break;
      case 6:
        let sabias = item;
        sqlDelete = `DELETE FROM catalogo WHERE id = ${sabias.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará el registro permanentemente"
        break;
      case 7:
        let examen = item;
        sqlDelete = `DELETE FROM examen WHERE id = ${examen.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará el registro permanentemente"
        break;
      default:
        break;
    }

    this.confirm(data, other);

  }

  confirm(data, other: any = null) {
    this.alertService.confirmTrashAlert(() => {
      this.loadingService.show("Eliminando...");
      let msj: string = "";
      this.sqlGenericService.excecuteQueryString(data.sql).subscribe((response: any) => {
        this.loadingService.hide();

        switch (this.menuActivo) {
          case 1:
            this.cargarTemas();
            break;
          case 4:
            this.cargarCapsulas();
            break;
          case 2:
            this.cargarPreguntas();
            break;
          case 3:
            this.cargarTrivias();
            break;
          case 5:
            this.cargarDirectorio();
            break;
          case 6:
            this.cargarSabias();
            break;
          case 7:
            this.cargarExamenes();
            break;
          default:
            break;
        }

      }, (error: HttpErrorResponse) => {
        this.loadingService.hide();
        if (other) {
          this.alertService.warnAlert("Oops!", `${other} no puede ser eliminado, ya que está asignado`);
        } else {
          this.alertService.errorAlert("Oops!", "Ocurrió un error, contacta al administrador");
        }
      });
    }, "Confirmar", data.msj, "Aceptar");
  }

}
