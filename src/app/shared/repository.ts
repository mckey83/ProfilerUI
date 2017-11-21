import { Component, Input } from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Rect } from './rect';
import { OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
 

@Injectable()
export class Repository {
    constructor(private http: Http) {}
    getData():Observable<any>{
        return this.http.get('http://127.0.0.1:4200/assets/file.json').map(res => res.json());        
    }    
}
