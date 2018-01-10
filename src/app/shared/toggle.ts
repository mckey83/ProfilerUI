 import {Rect} from "./model/service/rect";

 export class Toggle {

  private toggled: Array<Rect> = [];

  public onToggle (toggle:Rect): void{
    const isToggled = this.toggled.find( res => res.id === toggle.id );
    if (isToggled) {
      this.setUnToggled(toggle);
    } else {
      this.setToggled(toggle);
    }
  }

   public get (): Array<Rect>{
     return this.toggled;
   }

   private setUnToggled(toggled: Rect) {
     this.toggled = this.toggled.filter(item => item.id !== toggled.id);
   }

   private setToggled(toggle: Rect) {
     this.toggled.push(toggle);
   }
}
