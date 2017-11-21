import { Rect } from '../service/rect';
import { Method } from '../service/method';

export class Dto {
    constructor(public method:Method[], public background:Rect) {}
}
