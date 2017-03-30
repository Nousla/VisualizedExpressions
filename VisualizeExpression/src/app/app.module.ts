import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { VisualizationComponent } from './visualization.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, VisualizationComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
