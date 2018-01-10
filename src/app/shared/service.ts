import { Rect } from './model/service/rect';
import { Text } from './model/service/text';
import { ModelRepository } from './model/repository/model-repository';
import { Diagram } from './model/service/diagram';
import { Repository } from './repository/repository';
import { Injectable } from '@angular/core';
import { MethodRepository } from './model/repository/method-repository';
import { Observable } from 'rxjs/Observable';
import { Filter } from './model/service/Filter';


@Injectable()
export class Service {
  private Y_SHIFT = 15;
  private Y_HEIGHT = 10;
  private Y = 0;
  private X = 0;
  private NS_TO_COORDINATE_RATIO = 10000000000;
  private modelRepository: Observable<ModelRepository>;

  constructor (private repository: Repository) {
    this.modelRepository = this.repository.getData();
  }

  public getWithoutHidden(hidden: Array<Rect>): Observable<Diagram> {
    return this.modelRepository
      .map(res => res.method)
      .map(methods => {
          const filters = this.getFilters(hidden, methods);
          const rects = this.getRects(methods, filters);
          const texts = this.getTexts(methods, filters);
          return new Diagram(rects, texts);
        }
      );
  }

  private getFilters(choose: Array<Rect>, methods): Filter[] {
    return choose.map( res => {
      const found = methods.find(x => x.id === res.id);
      const start = found.startTime;
      const finish = found.startTime + found.duration;
      const threadId = found.threadId;
      return new Filter(start, finish, threadId, res.id);
    });
  }

  private getRects(methods: MethodRepository[], filters: Array<Filter>): Rect[] {
    this.setCoordinateToDefault();
    return methods.filter(method => this.isNotInFilter(method, filters))
                  .map(method => {
                      this.setX(method);
                      this.setY();
                      return new Rect(method, this.X, this.Y, this.Y_HEIGHT, this.NS_TO_COORDINATE_RATIO);
                    }
                  );
  }

  private getTexts(methods: MethodRepository[], filters: Array<Filter>): Text[] {
    this.setCoordinateToDefault();
    return methods.filter(method => this.isNotInFilter(method, filters))
                  .map(method => {
                      this.setX(method);
                      this.setY();
                      return new Text(method, this.X, this.Y, filters, this.NS_TO_COORDINATE_RATIO);
                    }
                  );
  }

  private setCoordinateToDefault(): void {
    this.X = 0;
    this.Y = 0;
  }

  private isNotInFilter(method: MethodRepository, filters: Filter[]): boolean {
    const findInFilter = filters.filter(filter => this.isChildMethod(method, filter));
    return findInFilter.length === 0;
  }

  private isChildMethod(method: MethodRepository, filter: Filter): boolean {
    return method.startTime > filter.start &&
      (method.startTime + method.duration) <= filter.finish &&
      method.threadId === filter.threadId;
  }

  private setY(): void {
    this.Y += this.Y_SHIFT;
  }

  private setX(res: MethodRepository): void {
    this.X = res.startTime / this.NS_TO_COORDINATE_RATIO;
  }

}
