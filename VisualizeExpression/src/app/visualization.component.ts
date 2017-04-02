import { Component, Input, ViewChild, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'visualization',
  template: `
            <p>Mirror Mountain / Root / Reverse Syntax Tree / dendrogram</p>
            <div class="chart" #graphContainer></div>
            `,
  styleUrls: ['./visualization.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class VisualizationComponent implements OnInit {
  @Input()
  private data: Array<any>;
  @ViewChild('graphContainer')
  private graphContainer: ElementRef;

  // Send as configuration data
  private width = 700;
  private height = 500;
  private nodeWidth = 40;
  private nodeHeight = 40;
  private fontOffset = 5;
  private fontSize = this.nodeHeight - this.fontOffset;

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    if (!this.data) {
      return;
    }

    var svg = d3.select(this.graphContainer.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    var rootNode = d3.hierarchy(this.data[0]);
    d3.cluster().nodeSize([this.nodeWidth, this.nodeHeight]).size([this.width, this.height / 2])(rootNode);

    var nodes = rootNode.descendants();

    nodes.forEach((node) => {
      node["y"] = -node["y"] + (this.height / 2);
    });

    console.log(rootNode);

    var rootGroup = svg.append("g");

    rootGroup.selectAll("line")
      .data(nodes.slice(1))
      .enter()
      .append("line")
      .attr("x1", (node) => { return node.parent["x"] + (this.nodeWidth / 2) })
      .attr("y1", (node) => { return node.parent["y"] + (this.nodeHeight / 2) })
      .attr("x2", (node) => { return node["x"] + (this.nodeWidth / 2) })
      .attr("y2", (node) => { return node["y"] + (this.nodeHeight / 2) })
      .attr("class", "chart-line");

    var instance = this;

    rootGroup.selectAll("g")
      .data(nodes)
      .enter()
      .each(function (node: d3.HierarchyNode<any[]>) {
        instance.processNode(node, this);
      });
  }

  private processNode(node: d3.HierarchyNode<any[]>, element: d3.EnterElement): void {
    switch (node.data["type"]) {
      case "equality": this.processEqualityNode(node, element);
        break;
      case "number": this.processNumberNode(node, element);
        break;
      case "operator": this.processOperatorNode(node, element);
        break;
      case "variable": this.processVariableNode(node, element);
        break;
      default: this.processStandardNode(node, element);
        break;
    }
  }

  private processEqualityNode(node: d3.HierarchyNode<any[]>, element: d3.EnterElement): void {
    this.processStandardNode(node, element);

    d3.select(element)
      .select("g")
      .attr("transform", "translate(" + (this.width/2) + ",0)");
  }

  private processNumberNode(node: d3.HierarchyNode<any[]>, element: d3.EnterElement): void {
    this.processStandardNode(node, element);
  }

  private processOperatorNode(node: d3.HierarchyNode<any[]>, element: d3.EnterElement): void {
    this.processStandardNode(node, element);
  }

  private processVariableNode(node: d3.HierarchyNode<any[]>, element: d3.EnterElement): void {
    this.processStandardNode(node, element);
  }

  private processStandardNode(node: d3.HierarchyNode<any[]>, element: d3.EnterElement): void {
    var newNodeSelection = d3.select(element).append("g")
      .attr("transform", (node: d3.HierarchyNode<any[]>) => { return "translate(" + node["x"] + "," + node["y"] + ")" });

    newNodeSelection.append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", this.nodeWidth)
      .attr("height", this.nodeHeight)
      .attr("class", this.getRectClassName);

    newNodeSelection.append("text")
      .attr("font-size", this.fontSize)
      .attr("x", "0")
      .attr("y", this.fontSize)
      .attr("transform", "translate(" + (this.nodeWidth / 2) + "," + (-this.fontOffset) + ")")
      .text((node: d3.HierarchyNode<any[]>) => { return node.data["value"] })
      .attr("class", "chart-text");
  }

  private getRectClassName(node: d3.HierarchyNode<any[]>): string {
    if (node.data["type"] === "variable") {
      return "chart-rect-var";
    }
    else {
      return "chart-rect";
    }
  }
}
