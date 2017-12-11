import { Component } from '@angular/core';
import { Rect } from './shared/model/service/rect';
import { Text } from './shared/model/service/text';
import { Service } from './shared/service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {
  private methods: Array<Rect>;
  private texts: Array<Text>;
  private choose: Array<Rect> = [];

  constructor(private service: Service) {
    this.update();
  }

  private update() {
    this.setView([]);
  }

  public getHeight(): number {
    return  this.methods.length * 15 + 100;
  }

  public getWidth(): number {
    return (this.methods[this.methods.length - 2]).x + 2000;
  }

  toggle(event: Event, rect: Rect) {
    event.preventDefault();
    const isContain = this.choose.find( res => {
        return res.id === rect.id;
      }
    );
    if (isContain) {
      for (let i = 0; i < this.choose.length; i++) {
        if (this.choose[i].id === rect.id) {
          const removed = this.choose.filter(item => item.id !== rect.id );
          this.choose = removed;
          this.setView(this.choose);
        }
      }
    } else {
      this.choose.push(rect);
      this.setView(this.choose);
    }
  }

  private setView(filter: Rect[]) {
    const diagram = this.service.getWithParameter(filter);
    this.methods = diagram.methods;
    this.texts = diagram.texts;
  }
}
