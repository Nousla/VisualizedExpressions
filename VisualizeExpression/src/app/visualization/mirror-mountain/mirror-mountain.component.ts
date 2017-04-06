import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, InjectionToken, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { InternalData } from '../internal-data';
import VisualizationService from "../visualization-service";
import { MirrorMountainService } from "./mirror-mountain.service";
import { MirrorMountainConfig } from "./mirror-mountain-config";

export let VISUALIZATION_SERVICE = new InjectionToken<VisualizationService>("VisualizationServiceToken");

@Component({
  selector: 'visualization-mirror-mountain',
  template: '<div class="chartContainer" #chartContainer></div>',
  styleUrls: ['./mirror-mountain.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: VISUALIZATION_SERVICE,
      useFactory: () => { 
        return new MirrorMountainService();
      }
    }]
})

export class MirrorMountainComponent implements OnChanges {
  @Input()
  private data: InternalData;
  @Input()
  private config: Object;
  @ViewChild('chartContainer')
  private chartContainer: ElementRef;

  constructor( @Inject(VISUALIZATION_SERVICE) private visualizationService: VisualizationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.data) {
      return;
    }

    this.visualizationService.configure(this.config);
    this.visualizationService.construct(this.chartContainer, this.data);
  }
}
