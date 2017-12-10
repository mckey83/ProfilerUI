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

  private modelRepository: ModelRepository;

  private result: ModelRepository;

  constructor(private http: Http) {
    this.createModel();
    console.log(this.modelRepository);
  }

  public getData(): Observable<ModelRepository> {
    return this.http.get('http://localhost:4200/assets/file.json').map(res => res.json());
  }

  public getModel(): ModelRepository {
    return this.modelRepository;
  }

  private createModel(): void {
    const methodRepository: Array<MethodRepository> = [];
    this.getData().subscribe(modelRepository => {
      modelRepository.method.forEach(res => {
        methodRepository.push(new MethodRepository(
          res.id,
          res.className,
          res.methodName,
          res.duration,
          res.threadId,
          res.threadName,
          res.stack,
          res.startTime,
          res.path,
          res.color
        ));
      });
    });
    this.modelRepository = new ModelRepository(methodRepository, new Description());
  }


}
