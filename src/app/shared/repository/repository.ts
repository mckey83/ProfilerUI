import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Rect } from '../model/service/rect';
import { Dto } from '../model/repository/dto';


@Injectable()
export class Repository {
    constructor(private http: Http) {}
    getData():Observable<Dto>{
        return this.http.get('http://localhost:4200/assets/file.json').map(res => res.json());
    }
}
