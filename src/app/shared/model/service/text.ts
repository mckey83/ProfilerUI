import {MethodRepository} from "../repository/method-repository";
import {Filter} from "./Filter";

export class Text {
  public readonly id: number;
  public readonly x: number;
  public readonly y: number;
  public readonly className: String;
  public readonly methodName: String;
  public readonly duration: number;
  public readonly threadId: number;
  public readonly threadName: String;
  public readonly startTime: number;
  public readonly textColor: String;
  public readonly path: String;
  public readonly isChoosed;
  private NS_TO_COORDINATE_RATIO;


  constructor(method: MethodRepository, x: number, y: number, filters: Array<Filter>, ratio:number){
    this.NS_TO_COORDINATE_RATIO = ratio;
    this.id = method.id;
    this.x = x + this.getWidth(method.duration) + 5;
    this.y = y + 8;
    this.className = method.className;
    this.methodName = method.methodName;
    this.duration = this.getDuration(method);
    this.threadId = method.threadId;
    this.threadName = method.threadName;
    this.startTime = this.getStartTime(method);
    this.textColor = 'black';
    this.path = method.path;
    this.isChoosed = this.isToggled(filters, method) ?  '+++' : '---';
  }

  private getStartTime(method: MethodRepository) {
    return method.startTime / (this.NS_TO_COORDINATE_RATIO);
  }

  private getDuration(method: MethodRepository) {
    return method.duration / (this.NS_TO_COORDINATE_RATIO);
  }

  private getWidth(duration: number): number {
    const width = duration * 50 / this.NS_TO_COORDINATE_RATIO;
    return width < 10 ? 10 : width;
  }

  private isToggled(filters: Array<Filter>, method: MethodRepository) {
    const findInFilter = filters.filter(filter => method.id === filter.parentId);
    let isToggled = findInFilter.length != 0;
    return isToggled;
  }
}
