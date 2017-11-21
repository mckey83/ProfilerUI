import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule }  from '@angular/http';
import { Repository } from './shared/repository/repository';
import { Service } from './shared/service';


@NgModule({
  declarations: [AppComponent],
  imports:      [ BrowserModule, HttpModule ],
  providers:    [Repository, Service],
  bootstrap:    [AppComponent]
})
export class AppModule {

}
