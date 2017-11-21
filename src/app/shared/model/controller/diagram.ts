import { Rect } from '../service/rect';
import { Text } from '../service/text';

export class Diagram {
    constructor(public methods:Rect[], public texts:Text[], public borders: Rect[]) {}
}
