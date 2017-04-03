import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, InjectionToken, Inject } from '@angular/core';
import { InternalData } from './internal-data';

@Component({
  selector: 'visualization',
  template: '<visualization-mirror-mountain [data]="data"></visualization-mirror-mountain><visualization-mirror-mountain [data]="data"></visualization-mirror-mountain>',
  styleUrls: ['./visualization.component.css']
})

export class VisualizationComponent {
  @Input()
  private data: InternalData;
}
