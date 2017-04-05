import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { ExpressionComponent} from './sandbox/expression.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { MirrorMountainComponent } from "./visualization/mirror-mountain/mirror-mountain.component";

@NgModule({
  imports:      [ BrowserModule,
  RouterModule.forRoot([
    {
      path: 'sandbox',
      component: SandboxComponent
    }
    ]) ],
  declarations: [ AppComponent, SandboxComponent, ExpressionComponent, VisualizationComponent, MirrorMountainComponent ],
  bootstrap:    [ AppComponent ],
  entryComponents: [ExpressionComponent]
})
export class AppModule { }
