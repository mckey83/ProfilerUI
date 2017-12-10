import { Rect } from '../service/rect';


export class MethodRepository {
  constructor(
              public id: number,
              public className: String,
              public methodName: String,
              public duration: number,
              public threadId: number,
              public threadName: String,
              public stack: String[],
              public startTime: number,
              public path: String,
              public color: String
  ) {}
}
