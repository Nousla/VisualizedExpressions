import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { ExpressionComponent } from './sandbox/expression.component';
import { ExpressionOperationComponent } from './sandbox/expression-operation.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { MirrorMountainComponent } from "./visualization/mirror-mountain/mirror-mountain.component";
import { ModalSuccessComponent } from './sandbox/modal-success.component';

@NgModule({
  imports: [BrowserModule, FormsModule,
    RouterModule.forRoot([
      {
        path: 'sandbox',
        component: SandboxComponent
      }
    ]), DialogModule, ButtonModule, BrowserAnimationsModule],
  declarations: [
    AppComponent, 
    SandboxComponent, 
    ExpressionComponent, 
    ExpressionOperationComponent,
    VisualizationComponent, 
    MirrorMountainComponent,
    ModalSuccessComponent
    ],
  bootstrap: [AppComponent],
  entryComponents: [ExpressionComponent]
})
export class AppModule { }
