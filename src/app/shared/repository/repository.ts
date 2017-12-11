import { Component, Input, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Rect } from '../model/service/rect';
import { ModelRepository } from '../model/repository/model-repository';
import {MethodRepository} from '../model/repository/method-repository';
import {Description} from '../model/repository/description';


@Injectable()
export class Repository {

  private modelRepository: Observable<ModelRepository>;

  private result: ModelRepository;

  constructor(private http: Http) {
    this.modelRepository = this.http.get('http://localhost:4200/assets/file.json').map(res => res.json());
  }

  public getData(): Observable<ModelRepository> {
    return this.modelRepository;
  }
}
