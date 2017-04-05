import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { ExpressionComponent} from './sandbox/expression.component';

@NgModule({
  imports:      [ BrowserModule,
  RouterModule.forRoot([
    {
      path: 'sandbox',
      component: SandboxComponent
    }
    ]) ],
  declarations: [ AppComponent, SandboxComponent, ExpressionComponent ],
  bootstrap:    [ AppComponent ],
  entryComponents: [ExpressionComponent]
})
export class AppModule { }
