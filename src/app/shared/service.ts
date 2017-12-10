import { Rect } from './model/service/rect';
import { Text } from './model/service/text';
import { ModelRepository } from './model/repository/model-repository';
import { Diagram } from './model/service/diagram';
import { Repository } from './repository/repository';
import {Injectable, OnInit} from '@angular/core';
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
  private modelRepository: ModelRepository;

  constructor (private repository: Repository) {

  }

  public updateInit(): void {
    this.modelRepository = this.repository.getModel();
    while (this.modelRepository == null ) {
      setTimeout(() => { }, 10000);
    }

    console.log(this.modelRepository.method[0]);

    const rects = new Array<Rect>();
    const texts = new Array<Text>();
    this.modelRepository.method.forEach(res => {
      if (res.duration > this.NS_TO_COORDINATE_RATIO) {
        this.setCoordinate(res);
        const rect = this.createRect(res);
        rects.push(rect);
        texts.push(this.createTexts(res, rect));
      }
    });
    this.diagram = new Diagram(rects, texts);
  }

  public update(choose: Array<Rect>): void {
    const rects = new Array<Rect>();
    const texts = new Array<Text>();
    const filters = [];
    if (choose.length > 0) {
      choose.forEach( res => {
        const finded = this.modelRepository.method.find(x => x.id === res.id);
        const start = finded.startTime;
        const finish = finded.startTime + finded.duration;
        const threadId = finded.threadId;
        filters.push(new Filter(start, finish, threadId));
      });
    }
    for (const res of this.modelRepository.method) {
      if (this.notInFilter(res, filters)) {
        this.setCoordinate(res);
        const rect = this.createRect(res);
        rects.push(rect);
        texts.push(this.createTexts(res, rect));
      }
    }
    this.diagram = new Diagram(rects, texts);
  }

  public getSimple(): Diagram {
    this.Y = 0;
    this.updateInit();
    return this.diagram;
  }

  public getWithParameter(choose: Array<Rect>): Diagram {
    this.Y = 0;
    this.update(choose);
    return this.diagram;
  }

  private notInFilter(method: MethodRepository, filters: Filter[]): boolean {

    if (filters.length > 0) {
      let result = true;
      filters.forEach(filter => {
        if (method.startTime > filter.start &&
          (method.startTime + method.duration) < filter.finish &&
          method.threadId === filter.threadId &&
          method.duration > this.NS_TO_COORDINATE_RATIO
        ) {
          console.log(method.threadId);
          result = false;
        }
      });
      return result;
    } else {
      return method.duration > this.NS_TO_COORDINATE_RATIO;
    }
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

  private createTexts(method: MethodRepository, rect: Rect): Text {
    const x = this.X + this.getWidth(method.duration) + 5;
    const y = this.Y + 8;
    const startTime = method.startTime;
    const textColor = rect.stack.length > 1 ? 'black' : 'red';
    return new Text(
      method.id,
      x,
      y,
      method.className,
      method.methodName,
      method.duration / this.NS_TO_COORDINATE_RATIO,
      method.threadId,
      method.threadName,
      startTime / this.NS_TO_COORDINATE_RATIO,
      textColor,
      method.path
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
