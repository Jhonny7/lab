import { LocalStorageEncryptService } from './../../../services/local-storage-encrypt.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loading-service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss'],
})
export class TriviaPage implements OnInit {

  public user: any = null;
  public triviaActual: any[] = [];

  public data: any = {
    step: 1,
    preguntaActual: 0,
    almacenRespuestas: [],
    aprobado: false,
    nivelUser: ""
  };

  public tiempo: number = 25;
  public intervalo: any;

  constructor(
    private loadingService: LoaderService,
    private alertService: AlertService,
    private sqlGenericService: SqlGenericService,
    private localStorageEncryptService: LocalStorageEncryptService
  ) {
    this.user = this.localStorageEncryptService.getFromLocalStorage("userSessionEducacion");

  }

  termina(){
    this.data = {
      step: 1,
      preguntaActual: 0,
      almacenRespuestas: [],
      aprobado: false,
      nivelUser: ""
    };
    if (!this.user.id_nivel) {
      this.cargarNivel();
    } else {
      this.cargarTrivia();
    }
  }

  ngOnInit() {
    //this.loadingService.show("Verificando tu nivel actual");
    if (!this.user.id_nivel) {
      this.cargarNivel();
    } else {
      this.cargarTrivia();
    }
  }

  cargarTrivia(recarga: boolean = false) {
    ////////////////////// CHECAR SI ESTA EN MAXIMO NIVEL PARA CAMBIAR CONSULTA ///////////////////////////
    let sqlMaximo: string = `SELECT * FROM catalogo WHERE id_tipo_catalogo = 37 ORDER BY id_referencia DESC LIMIT 1`;

    this.sqlGenericService.excecuteQueryString(sqlMaximo).subscribe((max: any) => {
      if (recarga) {
        this.loadingService.show("Espera");
      }
      let sql: string = `SELECT 
        t.* 
        FROM trivia t 
        LEFT JOIN usuario_pregunta up
        ON (up.id_pregunta = t.id) 
        WHERE 
        up.id_pregunta IS NULL AND
        t.id_complejidad = (SELECT id_referencia FROM catalogo WHERE id = ${this.user.id_nivel})
        AND (t.id_tipo_usuario = 170 OR t.id_tipo_usuario = ${this.user.id_tipo_usuario})
        ORDER BY RAND()
        LIMIT 5`;

      if (this.user.id_nivel == max.parameters[0].id) {
        //SE BUSCAN TRIVIAS DE NIVELES ALEATORIOS
        sql = `SELECT 
        t.* 
        FROM trivia t 
        LEFT JOIN usuario_pregunta up
        ON (up.id_pregunta = t.id) 
        WHERE 
        up.id_pregunta IS NULL
        AND (t.id_tipo_usuario = 170 OR t.id_tipo_usuario = ${this.user.id_tipo_usuario})
        ORDER BY RAND()
        LIMIT 5`;
        /* this.data.step = 2;
        this.alertService.successAlert("Waow!", "Has superado todos los niveles, espera próximamente más trivias", null, "trivia"); */
      }

      console.log(sql);

      this.triviaActual = [];
      this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
        response.parameters.forEach(element => {
          let json: any = JSON.parse(element.json_trivia);
          this.triviaActual.push({
            ...element,
            json
          });
        });
        if (this.triviaActual.length <= 0) {
          //NO HAY MAS PREGUNTAS AQUI AUMENTA DE NIVEL Y COMPLEJIDAD
          this.loadingService.hide();

          //////////////////REVISAR SI ESTA EN MÁXIMO NIVEL//////////////////
          console.log(max);
          console.log(this.user);

          if (this.user.id_nivel == max.parameters[0].id) {
            this.data.nivelUser = "Experto";
            this.tiempo = 0;
            this.data.step = 2;
          } else {
            this.alertService.confirmTrashAlert(
              () => {
                ///ACTUALIZAR NIVEL DE USUARIO
                this.loadingService.show("Espera...");
                let sqlUser: string = `SELECT * FROM catalogo WHERE id_tipo_catalogo = 37 ORDER BY id_referencia ASC`;

                this.sqlGenericService.excecuteQueryString(sqlUser).subscribe((nivel: any) => {
                  let position: any = nivel.parameters.findIndex((niv) => {
                    return niv.id == this.user.id_nivel;
                  });
                  if (nivel.parameters[position + 1]) {
                    this.loadingService.hide();
                    let sql: string = `UPDATE usuario SET id_nivel = ${nivel.parameters[position + 1].id}`;
                    this.sqlGenericService.excecuteQueryString(sql).subscribe((userUpd: any) => {
                      this.user.id_nivel = nivel.parameters[position + 1].id;
                      this.data.nivelUser = nivel.parameters[position + 1].nombre;
                      this.localStorageEncryptService.setToLocalStorage("userSessionEducacion", this.user);
                    }, (error: HttpErrorResponse) => {
                      this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
                    });
                  } else {
                    this.loadingService.hide();
                    //MAXIMO NIVEL SUPERADO
                    this.data.step = 2;
                    this.alertService.successAlert("Waow!", "Has superado todos los niveles, espera próximamente más trivias", null, "trivia")
                  }

                }, (error: HttpErrorResponse) => {
                });

              },
              "Waow! Felicidades!", this.user.id_nivel !== max.parameters[0].id ? "Has aumentado de nivel 💪" :
              "Has superado todos los niveles", "Continuar", "trivia");
          }
        } else {
          this.loadingService.hide();
          this.checkLevel();
        }

        if (recarga) {
          this.data.preguntaActual = 0;
          this.data.almacenRespuestas = [];
          this.data.aprobado = false;

          this.empezar();
          this.loadingService.hide();
        }
      }, (error: HttpErrorResponse) => {
        if (recarga) {
          this.loadingService.hide();
        }
        this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
      });
    }, (error: HttpErrorResponse) => {

    });


  }

  cargarNivel() {
    this.loadingService.show("Verificando tu nivel actual");
    let sql: string = `UPDATE usuario SET id_nivel = (SELECT id FROM catalogo WHERE id_referencia = 140)`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      this.loadingService.hide();

      let sqlUser: string = `SELECT * FROM usuario WHERE id = ${this.user.id}`;
      this.sqlGenericService.excecuteQueryString(sqlUser).subscribe((response: any) => {
        this.user = response.parameters[0];
        this.cargarTrivia();
        this.localStorageEncryptService.setToLocalStorage("userSessionEducacion", this.user);
      }, (error: HttpErrorResponse) => {
        this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
      });

    }, (error: HttpErrorResponse) => {
      this.loadingService.hide();
      this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
    });
  }

  checkLevel() {
    let sqlUser: string = `SELECT * FROM catalogo WHERE id = ${this.user.id_nivel}`;
    this.sqlGenericService.excecuteQueryString(sqlUser).subscribe((response: any) => {
      this.data.nivelUser = response.parameters[0].nombre;
    }, (error: HttpErrorResponse) => {
    });
  }

  empezar() {
    this.data.step = 2;
    if (this.triviaActual.length > 0) {
      this.intervalear();
    }

  }

  intervalear() {
    this.intervalo = setInterval(() => {
      this.tiempo--;
      if (this.tiempo == 0) {
        clearInterval(this.intervalo);
        this.evalua({ id: -1 });//respuesta erronea default
      }
    }, 1000);
  }

  evalua(respuestaSeleccionada: any) {
    if (this.triviaActual[this.data.preguntaActual]) {

      let dt: any = {
        seleccion: respuestaSeleccionada.id,
        correcta: this.triviaActual[this.data.preguntaActual].json.respuesta,
        idTrivia: this.triviaActual[this.data.preguntaActual].id,
        pregunta: this.triviaActual[this.data.preguntaActual].json.pregunta,
        isFine: this.triviaActual[this.data.preguntaActual].json.respuesta == respuestaSeleccionada.id
      };

      this.data.almacenRespuestas.push(dt);
      this.data.preguntaActual++;
      console.log(this.data.preguntaActual);
      console.log(this.triviaActual.length);


      if (this.data.preguntaActual <= this.triviaActual.length - 1) {
        console.log("ififififif");

        clearInterval(this.intervalo);
        if (this.triviaActual[this.data.preguntaActual - 1].json.respuesta == respuestaSeleccionada.id) {
          //Respuesta correcta    
          let sqlInsert: string = "INSERT INTO usuario_pregunta (id_usuario, id_pregunta) VALUES ";
          sqlInsert += `(${this.user.id},${dt.idTrivia})`;
          this.loadingService.show("Evaluando...");
          this.sqlGenericService.excecuteQueryString(sqlInsert).subscribe((response: any) => {
            this.loadingService.hide();
            this.alertService.successAlert("Genial!", "Respuesta correcta", () => {
              this.tiempo = 25;
              clearInterval(this.intervalo);
              this.intervalear();
            });
            //this.user = response.parameters[0];
            //this.cargarTrivia(true);
          }, (error: HttpErrorResponse) => {
            this.loadingService.hide();
            this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
          });
        } else {
          //Respuesta incorrecta
          this.alertService.warnAlert("Oops!", "Respuesta incorrecta", () => {
            this.tiempo = 25;
            clearInterval(this.intervalo);
            this.intervalear();
          });

        }


      } else {
        console.log("noifififififif");
        console.log(this.triviaActual[this.data.preguntaActual - 1]);
        console.log(respuestaSeleccionada);


        /*YA NO SE EVALUA EN GENERAL AHORA ES DE UNA EN UNA */

        clearInterval(this.intervalo);
        if (this.triviaActual[this.data.preguntaActual - 1] &&
          this.triviaActual[this.data.preguntaActual - 1].json.respuesta == respuestaSeleccionada.id) {
          //Respuesta correcta    
          let sqlInsert: string = "INSERT INTO usuario_pregunta (id_usuario, id_pregunta) VALUES ";
          sqlInsert += `(${this.user.id},${dt.idTrivia})`;
          this.loadingService.show("Evaluando...");
          this.sqlGenericService.excecuteQueryString(sqlInsert).subscribe((response: any) => {
            this.loadingService.hide();
            this.alertService.successAlert("Genial!", "Respuesta correcta", () => {
              clearInterval(this.intervalo);
              let errores = 0;
              this.tiempo = 25;
              this.data.almacenRespuestas.forEach(element => {
                if (!element.isFine) {
                  errores++;
                }
              });

              this.data.aprobado = errores == 0;
              this.data.step = 3;
              console.log(this.data);
              ////////////////////// ACTUALIZAR E INSERTAR DATOS A LA BASE TRIVIA USUARIO////////////////////////
              if (this.data.aprobado) {

              } else {

              }
            });
            //this.user = response.parameters[0];
            //this.cargarTrivia(true);
          }, (error: HttpErrorResponse) => {
            this.loadingService.hide();
            this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
          });
        } else {
          console.log("en super else");

          //Respuesta incorrecta
          this.alertService.warnAlert("Oops!", "Respuesta incorrecta", () => {
            if (this.triviaActual[this.data.preguntaActual]) {
              this.tiempo = 25;
              clearInterval(this.intervalo);
              this.intervalear();
            }else{
              this.data.step = 3;
              console.log("ginal");
            }
          });

        }

        console.log("Terminamos");

      }
    } else {

    }
  }

  intenta() {
    this.cargarTrivia(true);
  }

  regresar() {
    window.history.back();
  }

  reset() {
    this.loadingService.show("Espera...");
    let sql: string = `DELETE FROM usuario_pregunta WHERE id_usuario = ${this.user.id};UPDATE usuario SET id_nivel = 164 WHERE id = ${this.user.id}`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      this.loadingService.hide();
      this.data.nivelUser = "Principiante";
      this.user.id_nivel = 164;
      this.localStorageEncryptService.setToLocalStorage("userSessionEducacion", this.user);
      this.alertService.successAlert("Bien!", "Has vuelto a comenzar");
      this.cargarNivel();
      //this.user = response.parameters[0];
      //this.cargarTrivia(true);
    }, (error: HttpErrorResponse) => {
      this.loadingService.hide();
      this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
    });
  }
}
