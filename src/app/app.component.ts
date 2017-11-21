import { Component } from '@angular/core';
import { Rect } from './shared/rect';
import { Text } from './shared/text';
import { Dto } from './shared/dto';
import { Diagram } from './shared/diagram';
import { Service } from './shared/service';
import { Method } from './shared/method';
import { Repository } from './shared/repository';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})

export class AppComponent{
    rects: Array<Rect>;
texts: Array<Text>; 
borders: Array<Rect>; 

constructor (private service:Service){
    let diagram = service.get();
this.rects = diagram.methods;
this.texts = diagram.texts;
this.borders = diagram.borders;
} 


}

