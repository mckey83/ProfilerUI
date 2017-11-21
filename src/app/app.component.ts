import { Component } from '@angular/core';
import { Rect } from './shared/model/service/rect';
import { Text } from './shared/model/service/text';
import { Method } from './shared/model/service/method';
import { Diagram } from './shared/model/controller/diagram';
import { Service } from './shared/service';
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
