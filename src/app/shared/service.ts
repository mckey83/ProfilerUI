import { Rect } from './model/service/rect';
import { Text } from './model/service/text';
import { ModelRepository } from './model/repository/model-repository';
import { Diagram } from './model/service/diagram';
import { Repository } from './repository/repository';
import { Injectable } from '@angular/core';
import { MethodRepository } from './model/repository/method-repository';
import { Observable } from 'rxjs/Observable';
import {Filter} from './model/service/Filter';


@Injectable()
export class Service {
  private diagram: Diagram;
  private Y_SHIFT = 15;
  private Y_HEIGHT = 10;
  private Y = 0;
  private X = 0;
  private NS_TO_COORDINATE_RATIO = 10000000;
  private modelRepository: Observable<ModelRepository>;

  constructor (private repository: Repository) {
    this.modelRepository = this.repository.getData();
  }

  public getWithParameter(choose: Array<Rect>): Diagram {
    this.Y = 0;
    this.update(choose);
    return this.diagram;
  }

  private update(choose: Array<Rect>): void {
    const rects = new Array<Rect>();
    const texts = new Array<Text>();
    this.modelRepository.subscribe(modelRepository => {
      const filters = [];
      if (choose.length > 0) {
        choose.forEach( res => {
          const finded = modelRepository.method.find(x => x.id === res.id);
          const start = finded.startTime;
          const finish = finded.startTime + finded.duration;
          const threadId = finded.threadId;
          filters.push(new Filter(start, finish, threadId, res.id));
        });
      }
      this.computeDataForDiagram(modelRepository, filters, rects, texts);
    });
    this.diagram = new Diagram(rects, texts);
  }

  private computeDataForDiagram(modelRepository, filters: Array<Filter>, rects: Rect[], texts: Text[]) {
    for (const res of modelRepository.method) {
      if (this.notInFilter(res, filters)) {
        this.setCoordinate(res);
        const rect = this.createRect(res);
        rects.push(rect);
        let isFind = false;
        for (const current of filters){
          if (res.id === current.parentId) {
            isFind = true; break;
          }
        }
        if (isFind) { console.log(res.id); }

        texts.push(this.createTexts(res, rect, isFind));
      }
    }
  }

  private notInFilter(method: MethodRepository, filters: Filter[]): boolean {
    if ( method.duration < this.NS_TO_COORDINATE_RATIO * 10) {
      return false;
    }
    if (filters.length < 0) {
      return true;
    }
    let result = true;
    filters.forEach(filter => {
      if (method.startTime > filter.start &&
        (method.startTime + method.duration) < filter.finish &&
        method.threadId === filter.threadId
      ) { result = false; }
    });
    return result;
  }

  private setCoordinate (res: MethodRepository) {
    this.X = res.startTime / this.NS_TO_COORDINATE_RATIO;
    this.Y += this.Y_SHIFT;
  }

  private createRect(method: MethodRepository): Rect {
    const width = this.getWidth(method.duration);
    const sourceStack = method.stack;
    const color = method.color;
    const resultStack = new Array<String>();
    sourceStack.forEach( stack => {
      if (this.isShow(stack)) {
        resultStack.push(stack + '\n');
      }
    });
    return new Rect(method.id, this.X, this.Y, width, this.Y_HEIGHT, color, resultStack);
  }

  private createTexts(method: MethodRepository, rect: Rect, isFind: boolean): Text {
    const x = this.X + this.getWidth(method.duration) + 5;
    const y = this.Y + 8;
    const startTime = method.startTime / (this.NS_TO_COORDINATE_RATIO * 100);
    const duration = method.duration / (this.NS_TO_COORDINATE_RATIO * 100);
    const textColor = rect.stack.length > 1 ? 'black' : 'red';
    const isChoosed = isFind === true ?  '+++' : '---';
    return new Text(
      method.id,
      x,
      y,
      method.className,
      method.methodName,
      duration,
      method.threadId,
      method.threadName,
      startTime ,
      textColor,
      method.path,
      isChoosed
    );
  }

  private isShow(stack) {
    return !this.clearNotBmc(stack) &&
      this.clearAdvice(stack) &&
      this.clearDoAroundTask(stack) &&
      this.clearAroundBody(stack) &&
      this.clearClosure(stack) &&
      this.clearLogMethod(stack) &&
      this.clearLogAspect(stack);
  }

  private clearClosure(stack) {
    return stack.indexOf('$AjcClosure') === -1;
  }

  private clearDoAroundTask(stack) {
    return stack.indexOf('doAroundTask') === -1;
  }

  private clearLogMethod(stack) {
    return stack.indexOf('logMethod') === -1;
  }

  private clearLogAspect(stack) {
    return stack.indexOf('logServiceLayer') === -1;
  }

  private clearAroundBody(stack) {
    return stack.indexOf('_aroundBody') === -1;
  }

  private clearAdvice(stack) {
    return stack.indexOf('$advice') === -1;
  }

  private clearNotBmc(stack) {
    return stack.indexOf('com.bmc') === -1;
  }

  private getWidth(duration: number): number {
    const width = duration / this.NS_TO_COORDINATE_RATIO;
    return width < 10 ? 10 : width;
  }
}
