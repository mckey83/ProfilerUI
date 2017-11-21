import { Rect } from './rect';
import { Text } from './text';

export class Diagram {
    constructor(public methods:Rect[], public texts:Text[], public borders: Rect[]) {}
}
