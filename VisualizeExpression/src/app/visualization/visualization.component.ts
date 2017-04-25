import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, InjectionToken, Inject } from '@angular/core';
import { InternalData } from './internal-data';
import VisualizationEventHandler from './visualization-event-handler';

@Component({
  selector: 'visualization',
  template: '<visualization-mirror-mountain [data]="data" [config]="config" [eventHandler]="eventHandler"></visualization-mirror-mountain>',
  styleUrls: ['./visualization.component.css']
})

export class VisualizationComponent {
  @Input()
  private data: InternalData;
  @Input()
  private config: Object;
  @Input()
  private eventHandler: VisualizationEventHandler;
}
