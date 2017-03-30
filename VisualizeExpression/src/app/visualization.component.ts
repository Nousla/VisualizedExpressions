import { Component, Input, ViewChild, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'visualization',
  template: `<div class="chart" #graphContainer></div>`,
  styleUrls: ['./visualization.component.css']
})

export class VisualizationComponent implements OnInit {
  @Input()
  private data: Array<any>;
  @ViewChild('graphContainer')
  private graphContainer: ElementRef;

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
  }
}
