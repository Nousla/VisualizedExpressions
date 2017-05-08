import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { InternalData } from '../internal-data';
import VisualizationService from "../visualization-service";
import VisualizationEventHandler from '../visualization-event-handler';
import { MirrorMountainService } from "./mirror-mountain.service";
import { MirrorMountainConfig } from "./mirror-mountain-config";
import { VISUALIZATION_SERVICE } from "../visualization-injection-token";

@Component({
  selector: 'visualization-mirror-mountain',
  template: '<div class="mirror-mountain-box" #mirrorMountainBox></div>',
  styleUrls: ['./mirror-mountain.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MirrorMountainComponent implements OnChanges {
  @Input()
  private data: InternalData;
  @Input()
  private config: Object;
  @Input()
  private eventHandler: VisualizationEventHandler;
  @ViewChild('mirrorMountainBox')
  private mirrorMountainBox: ElementRef;

  constructor( @Inject(VISUALIZATION_SERVICE) private visualizationService: VisualizationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.visualizationService.configure(this.config);
    this.visualizationService.construct(this.mirrorMountainBox, this.data, this.eventHandler);
  }
}
