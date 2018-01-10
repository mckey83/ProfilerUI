import { Component } from '@angular/core';
import { Rect } from './shared/model/service/rect';
import { Text } from './shared/model/service/text';
import { Service } from './shared/service';
import {Toggle} from "./shared/toggle";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {
  private methods: Array<Rect> = [];
  private texts: Array<Text> = [];
  private toggle: Toggle = new Toggle();


  constructor(private service: Service) {
    this.showAll();
  }

  private showAll(): void {
    this.update([]);
  }

  public getHeight(): number {
    return  this.methods.length * 15 + 100;
  }

  public getWidth(): number {
    return (this.methods[this.methods.length - 2]).x + 2000;
  }

  onClick(event: Event, rect: Rect): void {
    event.preventDefault();
    this.toggle.onToggle(rect);
    this.update(this.toggle.get());
  }

  private update(hidden: Rect[]): void {
    this.service.getWithoutHidden(hidden).subscribe(diagram => {
        this.methods = diagram.methods;
        this.texts = diagram.texts;
      }
    );
  }
}
