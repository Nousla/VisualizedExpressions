import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, InjectionToken, Inject } from '@angular/core';
import { InternalData } from './internal-data';
import VisualizationEventHandler from './visualization-event-handler';

@Component({
  selector: 'visualization',
  template: '<visualization-mirror-mountain [data]="data" [eventHandler]="eventHandler"></visualization-mirror-mountain>'
})

export class VisualizationComponent {
  @Input()
  private data: InternalData;
  @Input()
  private eventHandler: VisualizationEventHandler;
}
