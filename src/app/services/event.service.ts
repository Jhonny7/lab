import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Servicio de eventos 
 */
@Injectable({
  providedIn: 'root'
})
export class EventService implements OnInit {
    
    
    private subject = new Subject<any>();

    private subjects:Array<any> = [];

    ngOnInit(): void {
        //console.log("event service");
        
    }

    /**Multiples with topic */
    send(topic:string, data:any){
        if(!this.subjects[topic]){
            this.subjects[topic] = new Subject<any>();
        }
        //console.log(this.subjects);
        this.subjects[topic].next(data);
    }

    clear(topic:string){
        this.subjects[topic].next();
        delete this.subjects[topic];
    }

    get(topic:string): Observable<any>{
        if(!this.subjects[topic]){
            this.subjects[topic] = new Subject<any>();
        }
        //console.log(this.subjects);
        
        return this.subjects[topic].asObservable();
    }
}