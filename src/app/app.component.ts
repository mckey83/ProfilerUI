import {Component, OnInit} from '@angular/core';
import { Rect } from './shared/model/service/rect';
import { Text } from './shared/model/service/text';
import { Service } from './shared/service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent implements  OnInit {


  private methods: Array<Rect>;
  private texts: Array<Text>;
  private choose: Array<Rect> = [];

  constructor(private service: Service) { }

  ngOnInit(): void {
    const diagram = this.service.getSimple();
    if (diagram != null) {
      this.methods = diagram.methods;
      this.texts = diagram.texts;
    }
  }

  public getHeight(): number {
    return  this.methods.length * 15 + 100;
  }

  public getWidth(): number {
    return (this.methods[this.methods.length - 2]).x + 2000;
  }

  toggle(rect: Rect) {
    this.choose.push(rect);
    const diagram = this.service.getWithParameter(this.choose);
    this.methods = diagram.methods;
    this.texts = diagram.texts;
  }
}
