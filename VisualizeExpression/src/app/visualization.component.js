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
        // Send as configuration data
        this.width = 700;
        this.height = 500;
        this.nodeWidth = 40;
        this.nodeHeight = 40;
        this.fontOffset = 5;
        this.fontSize = this.nodeHeight - this.fontOffset;
    }
    VisualizationComponent.prototype.ngOnInit = function () {
        this.createChart();
    };
    VisualizationComponent.prototype.createChart = function () {
        var _this = this;
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
        nodes.forEach(function (node) {
            node["y"] = -node["y"] + (_this.height / 2);
        });
        console.log(rootNode);
        var rootGroup = svg.append("g");
        rootGroup.selectAll("line")
            .data(nodes.slice(1))
            .enter()
            .append("line")
            .attr("x1", function (node) { return node.parent["x"] + (_this.nodeWidth / 2); })
            .attr("y1", function (node) { return node.parent["y"] + (_this.nodeHeight / 2); })
            .attr("x2", function (node) { return node["x"] + (_this.nodeWidth / 2); })
            .attr("y2", function (node) { return node["y"] + (_this.nodeHeight / 2); })
            .attr("class", "chart-line");
        var instance = this;
        rootGroup.selectAll("g")
            .data(nodes)
            .enter()
            .each(function (node) {
            instance.processNode(node, this);
        });
    };
    VisualizationComponent.prototype.processNode = function (node, element) {
        switch (node.data["type"]) {
            case "equality":
                this.processEqualityNode(node, element);
                break;
            case "number":
                this.processNumberNode(node, element);
                break;
            case "operator":
                this.processOperatorNode(node, element);
                break;
            case "variable":
                this.processVariableNode(node, element);
                break;
            default:
                this.processStandardNode(node, element);
                break;
        }
    };
    VisualizationComponent.prototype.processEqualityNode = function (node, element) {
        this.processStandardNode(node, element);
        d3.select(element)
            .select("g")
            .attr("transform", "translate(" + (this.width / 2) + ",0)");
    };
    VisualizationComponent.prototype.processNumberNode = function (node, element) {
        this.processStandardNode(node, element);
    };
    VisualizationComponent.prototype.processOperatorNode = function (node, element) {
        this.processStandardNode(node, element);
    };
    VisualizationComponent.prototype.processVariableNode = function (node, element) {
        this.processStandardNode(node, element);
    };
    VisualizationComponent.prototype.processStandardNode = function (node, element) {
        var newNodeSelection = d3.select(element).append("g")
            .attr("transform", function (node) { return "translate(" + node["x"] + "," + node["y"] + ")"; });
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
            .text(function (node) { return node.data["value"]; })
            .attr("class", "chart-text");
    };
    VisualizationComponent.prototype.getRectClassName = function (node) {
        if (node.data["type"] === "variable") {
            return "chart-rect-var";
        }
        else {
            return "chart-rect";
        }
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