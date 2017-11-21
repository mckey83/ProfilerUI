import { Rect } from './rect';


export class Method {
    constructor(public rect: Rect, 
                public className: String, 
                public methodName: String, 
                public duration:number){}
}
