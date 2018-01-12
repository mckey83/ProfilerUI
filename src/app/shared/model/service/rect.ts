import {MethodRepository} from "../repository/method-repository";

export class Rect {
  public readonly id : number;
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly color: String;
  public readonly stack: String[];
  private NS_TO_COORDINATE_RATIO: number;

  constructor(method: MethodRepository, x: number, y: number, height: number, ratio: number) {
    this.NS_TO_COORDINATE_RATIO = ratio;
    this.id = method.id;
    this.x = x;
    this.y = y;
    this.width = this.getWidth(method.duration);
    this.height = height;
    this.color = method.color;
    this.stack = this.splitStackForLine(method.stack);
  }

  private getWidth(duration: number): number {
    const width = duration * 50 / this.NS_TO_COORDINATE_RATIO;
    return width < 10 ? 10 : width;
  }

  private splitStackForLine(sourceStack: String[]): String[] {
    return sourceStack.filter(stack => this.isShow(stack))
      .map(stack => stack + '\n');
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
}
