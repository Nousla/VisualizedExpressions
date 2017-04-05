import { Component, Input, ViewChild, ElementRef, OnInit, ViewEncapsulation, InjectionToken, Inject } from '@angular/core';
import { InternalData } from '../internal-data';
import { IVisualizationService } from "../ivisualization";
import { MirrorMountainService } from "./mirror-mountain.service";
import { MirrorMountainConfig } from "./mirror-mountain-config";

export let VISUALIZATION_SERVICE = new InjectionToken<IVisualizationService>("VisualizationServiceToken");

@Component({
  selector: 'visualization-mirror-mountain',
  template: '<div class="chartContainer" #chartContainer></div>',
  styleUrls: ['./mirror-mountain.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: VISUALIZATION_SERVICE,
      useFactory: () => { 
        let config = new MirrorMountainConfig();
        let service = new MirrorMountainService();
        service.configure(config);
        return new MirrorMountainService();
      }
    }]
})

export class MirrorMountainComponent implements OnInit {
  @Input()
  private data: InternalData;
  @ViewChild('chartContainer')
  private chartContainer: ElementRef;

  constructor( @Inject(VISUALIZATION_SERVICE) private visualizationService: IVisualizationService) { }

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    if (!this.data) {
      return;
    }

    this.visualizationService.construct(this.chartContainer, this.data);
  }
}
