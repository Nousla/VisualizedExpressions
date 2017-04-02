"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var d3 = require("d3");
var VisualizationComponent = (function () {
    function VisualizationComponent() {
    }
    VisualizationComponent.prototype.ngOnInit = function () {
        this.createChart();
    };
    VisualizationComponent.prototype.createChart = function () {
        if (!this.data) {
            return;
        }
        var width = 700, height = 500, nodeWidth = 40, nodeHeight = 40, fontOffset = 5, fontSize = nodeHeight - fontOffset;
        var svg = d3.select(this.graphContainer.nativeElement)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        var rootNode = d3.hierarchy(this.data[0]);
        d3.cluster().nodeSize([nodeWidth, nodeHeight]).size([width, height / 2])(rootNode);
        var nodes = rootNode.descendants();
        nodes.forEach(function (node) {
            node["y"] = -node["y"] + (height / 2);
        });
        console.log(rootNode);
        var rootGroup = svg.append("g");
        rootGroup.selectAll("line")
            .data(nodes.slice(1))
            .enter()
            .append("line")
            .attr("x1", function (node) { return node.parent["x"] + (nodeWidth / 2); })
            .attr("y1", function (node) { return node.parent["y"] + (nodeHeight / 2); })
            .attr("x2", function (node) { return node["x"] + (nodeWidth / 2); })
            .attr("y2", function (node) { return node["y"] + (nodeHeight / 2); })
            .attr("class", "chart-line");
        var newNodeSelection = rootGroup.selectAll("g")
            .data(nodes)
            .enter()
            .append("g")
            .attr("transform", function (node) { return "translate(" + node["x"] + "," + node["y"] + ")"; });
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
            .text(function (node) { return node.data["value"]; })
            .attr("class", "chart-text");
        // this.createTree(rootNode, 0);
        // rootNode.each(this.createNode.bind(this));
    };
    VisualizationComponent.prototype.getRectClassName = function (node) {
        if (node.data["type"] === "variable") {
            return "chart-rect-var";
        }
        else {
            return "chart-rect";
        }
    };
    // Recursive node traversal
    VisualizationComponent.prototype.createTree = function (node, siblingIndex) {
        node.data["siblingIndex"] = siblingIndex;
        this.createNode(node);
        if (!node.children) {
            return;
        }
        for (var i = 0; i < node.children.length; i++) {
            this.createTree(node.children[i], i);
        }
    };
    VisualizationComponent.prototype.createNode = function (node) {
        // console.log(node.data["name"] + " : " + node.data["value"]);
        var nodeWidth = 50, nodeHeight = 50, fontSize = 35, allocatedWidth = (1000 / (node.parent ? node.parent.children.length : 1) / (node.depth == 0 ? 1 : node.depth));
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
            .attr("x1", "");
    };
    return VisualizationComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], VisualizationComponent.prototype, "data", void 0);
__decorate([
    core_1.ViewChild('graphContainer'),
    __metadata("design:type", core_1.ElementRef)
], VisualizationComponent.prototype, "graphContainer", void 0);
VisualizationComponent = __decorate([
    core_1.Component({
        selector: 'visualization',
        template: "\n            <p>Mirror Mountain / Root / Reverse Syntax Tree / dendrogram</p>\n            <div class=\"chart\" #graphContainer></div>\n            ",
        styleUrls: ['./visualization.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    })
], VisualizationComponent);
exports.VisualizationComponent = VisualizationComponent;
//# sourceMappingURL=visualization.component.js.map