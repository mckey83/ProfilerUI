import { Rect } from './model/service/rect';
import { Text } from './model/service/text';
import { Dto } from './model/repository/dto';
import { Diagram } from './model/controller/diagram';
import { Method } from './model/service/method';
import { Repository } from './repository/repository';
import { Injectable }     from '@angular/core';



@Injectable()
export class Service {
    rects = new Array<Rect>();
    texts = new Array<Text>();
    borders =  new Array<Rect>();

    constructor (private repository:Repository){
        repository.getData().subscribe(dto => {
            this.createRects(dto);
            this.createTexts(dto);
            this.createBorder(dto);
        });
    }

    public get(): Diagram{
        return new Diagram(this.rects, this.texts, this.borders);
    }

    private createRects(dto:Dto): void {
        dto.method.forEach(res => {
            let method:Method = res;
        this.rects.push(new Rect(method.rect.x, method.rect.y, method.rect.width, method.rect.height));
        });
    }

    private createTexts(dto:Dto): void {
        dto.method.forEach(res => {
            let method:Method = res;
        let x = method.rect.x + method.rect.width + 5;
        let y = method.rect.y + method.rect.height / 2 + 3;
        this.texts.push(new Text(x, y, method.className, method.methodName, method.duration));
        });
    }

    private createBorder(dto:Dto): void {
        this.borders.push(new Rect(10, dto.background.y, 10, 10));
    }
}
