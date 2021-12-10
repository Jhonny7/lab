import { SqlGenericService } from './../../services/sqlGenericService';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NewModel } from 'src/app/models/new.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.page.html',
  styleUrls: ['./noticia.page.scss'],
})
export class NoticiaPage implements OnInit {

  public news:Array<NewModel> = [];

  constructor(
    private sqlGenericService: SqlGenericService
  ) { }

  ngOnInit() {
    this.cargarNoticias();
  }

  cargarNoticias(){
    let sql: string = `SELECT * FROM noticia`;
    this.sqlGenericService.excecuteQueryString(sql).pipe(
      map((newObj:any)=>{
        //console.log(newObj);
        let array:Array<NewModel> = [];
        newObj.parameters.forEach(itm => {
          array.push(NewModel.fromJson(itm));
        });

        return array;
      })
    ).subscribe((response:any)=>{
     //console.log(response);
      
    },(error: HttpErrorResponse)=>{

    });
  }
}
