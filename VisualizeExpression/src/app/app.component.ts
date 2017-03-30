import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `<h1>Test</h1>
             <visualization [data]=graphData></visualization>`,
})
export class AppComponent {
  private graphData: [];
}
