import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: [
    "../../node_modules/primeng/resources/themes/omega/theme.css",
    "../../node_modules/primeng/resources/primeng.min.css",
    "../../node_modules/font-awesome/css/font-awesome.min.css"
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
