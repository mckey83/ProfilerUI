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



  constructor(private http: Http) { }



  private getData(): Observable<ModelRepository> {
    return this.http.get('http://localhost:4200/assets/file.json').map(res => res.json());
  }

  public getModel(): ModelRepository {
    const methodRepository: Array<MethodRepository> = [];
    this.getData().subscribe(modelRepository => {
      for (const res of modelRepository.method) {
        methodRepository.push(new MethodRepository(
          res.id,
          res.className,
          res.methodName,
          res.duration,
          res.threadId,
          res.methodName,
          res.stack,
          res.startTime,
          res.path,
          res.color));
      }
    });
    const model = [];

    let i = 0;
    while (model.length < 1 && i < 10) {
      model.push(new ModelRepository(methodRepository, new Description));
      setTimeout(() => { }, 1000);
      i++;
    }

    model.push(new ModelRepository(methodRepository, new Description))

    return model[0];
  }

}
