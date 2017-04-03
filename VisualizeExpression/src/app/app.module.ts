import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { VisualizationComponent } from './visualization.component';
import { MirrorMountainComponent } from "./mirror-mountain.component";

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, VisualizationComponent, MirrorMountainComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
