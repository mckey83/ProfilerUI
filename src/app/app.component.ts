import { Component } from '@angular/core';
import { Rect } from './shared/model/service/rect';
import { Text } from './shared/model/service/text';
import { Service } from './shared/service';
import {Observable} from 'rxjs/Observable';
import { Diagram } from './shared/model/service/diagram';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {
  private methods: Array<Rect> = [];
  private texts: Array<Text> = [];
  private toggled: Array<Rect> = [];


  constructor(private service: Service) {
    this.showAll();
  }

  private showAll() {
    this.update([]);
  }

  public getHeight(): number {
    return  this.methods.length * 15 + 100;
  }

  public getWidth(): number {
    return (this.methods[this.methods.length - 2]).x + 2000;
  }

  toggle(event: Event, toggle: Rect) {
    event.preventDefault();

    const isToggled = this.toggled.find( res => res.id === toggle.id );
    if (isToggled) {
      this.setUnToggled(toggle);
    } else {
      this.setToggled(toggle);
    }
    this.update(this.toggled);
  }

  private setUnToggled(toggled: Rect) {
    this.toggled = this.toggled.filter(item => item.id !== toggled.id);
  }

  private setToggled(toggle: Rect) {
    this.toggled.push(toggle);
  }

  private update(hidden: Rect[]) {
    this.service.getWithout(hidden).subscribe(diagram => {
        this.methods = diagram.methods;
        this.texts = diagram.texts;
      }
    );
  }
}
