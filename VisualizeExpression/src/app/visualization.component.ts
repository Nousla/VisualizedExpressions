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

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    if (!this.data) {
      return;
    }

    var width = 700,
      height = 500,
      nodeWidth = 40,
      nodeHeight = 40,
      fontOffset = 5,
      fontSize = nodeHeight - fontOffset;

    var svg = d3.select(this.graphContainer.nativeElement)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var rootNode = d3.hierarchy(this.data[0]);
    d3.cluster().nodeSize([nodeWidth, nodeHeight]).size([width, height / 2])(rootNode);

    var nodes = rootNode.descendants();

    nodes.forEach((node) => {
      node["y"] = -node["y"] + (height / 2);
    });

    console.log(rootNode);

    var rootGroup = svg.append("g");

    rootGroup.selectAll("line")
      .data(nodes.slice(1))
      .enter()
      .append("line")
      .attr("x1", (node) => { return node.parent["x"] + (nodeWidth / 2) })
      .attr("y1", (node) => { return node.parent["y"] + (nodeHeight / 2) })
      .attr("x2", (node) => { return node["x"] + (nodeWidth / 2) })
      .attr("y2", (node) => { return node["y"] + (nodeHeight / 2) })
      .attr("class", "chart-line");

    var newNodeSelection = rootGroup.selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", (node) => { return "translate(" + node["x"] + "," + node["y"] + ")" });

    newNodeSelection.append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("class", this.getRectClassName);

    newNodeSelection.append("text")
      .attr("font-size", fontSize)
      .attr("x", "0")
      .attr("y", fontSize)
      .attr("transform", "translate(" + (nodeWidth / 2) + "," + (-fontOffset) + ")")
      .text((node) => { return node.data["value"] })
      .attr("class", "chart-text");

    // this.createTree(rootNode, 0);
    // rootNode.each(this.createNode.bind(this));
  }

  private getRectClassName(node: d3.HierarchyNode<any[]>): string {
    if (node.data["type"] === "variable") {
      return "chart-rect-var";
    }
    else {
      return "chart-rect";
    }
  }

  // Recursive node traversal
  private createTree(node: d3.HierarchyNode<any[]>, siblingIndex: number): void {
    node.data["siblingIndex"] = siblingIndex;
    this.createNode(node);

    if (!node.children) {
      return;
    }

    for (var i = 0; i < node.children.length; i++) {
      this.createTree(node.children[i], i);
    }
  }

  private createNode(node: d3.HierarchyNode<any[]>): void {
    // console.log(node.data["name"] + " : " + node.data["value"]);

    var nodeWidth = 50,
      nodeHeight = 50,
      fontSize = 35,
      allocatedWidth = (1000 / (node.parent ? node.parent.children.length : 1) / (node.depth == 0 ? 1 : node.depth));

    var svg = d3.select(this.graphContainer.nativeElement)
      .select("svg");

    var g = svg.append("g")
      .attr("transform", "translate(" + (allocatedWidth * node.data["siblingIndex"] + (allocatedWidth / 2) - nodeWidth) + "," + (node.depth * nodeHeight + nodeHeight) + ")");

    g.append("rect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("class", "chart-rect");

    g.append("text")
      .attr("font-size", fontSize)
      .attr("x", "0")
      .attr("y", fontSize)
      .attr("transform", "translate(" + (nodeWidth / 2) + ")")
      .text(node.data["value"])
      .attr("class", "chart-text");

    svg.append("line")
      .attr("x1", "")
  }
}
