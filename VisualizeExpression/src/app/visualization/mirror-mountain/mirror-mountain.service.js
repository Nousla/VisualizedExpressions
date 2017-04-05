"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var d3 = require("d3");
var MirrorMountainService = (function () {
    function MirrorMountainService() {
        this.width = 750;
        this.height = 350;
        this.nodeWidth = 40;
        this.nodeHeight = 40;
    }
    MirrorMountainService.prototype.configure = function (config) {
        if (config["width"]) {
            this.width = config["width"];
        }
        if (config["height"]) {
            this.width = config["height"];
        }
        if (config["nodeWidth"]) {
            this.width = config["nodeWidth"];
        }
        if (config["nodeHeight"]) {
            this.width = config["nodeHeight"];
        }
    };
    MirrorMountainService.prototype.construct = function (elementRef, internalData) {
        var _this = this;
        var svg = d3.select(elementRef.nativeElement)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        var rootNode = d3.hierarchy(internalData.data[0]);
        d3.cluster().nodeSize([this.nodeWidth, this.nodeHeight]).size([this.width, this.height])(rootNode);
        var instance = this;
        var rootGroup = svg.append("g");
        var nodes = rootNode.descendants();
        var links = rootNode.links();
        var leftEdgeLeaf = this.findEdgeLeaf(rootNode.children[0], false);
        var rightEdgeLeaf = this.findEdgeLeaf(rootNode.children[1], true);
        var edgeLeafGapWidth = leftEdgeLeaf["x"] + rightEdgeLeaf["x"];
        nodes.forEach(function (node) {
            if (node.data["type"] === "equality") {
                node["x"] = edgeLeafGapWidth / 2;
            }
            else {
                node["y"] = -node["y"] + (_this.height);
            }
        });
        rootGroup.selectAll("line")
            .data(links)
            .enter()
            .each(function (link) {
            instance.processLink(link, this);
        });
        rootGroup.selectAll("g")
            .data(nodes)
            .enter()
            .each(function (node) {
            instance.processNode(node, this);
        });
    };
    MirrorMountainService.prototype.processLink = function (link, element) {
        var _this = this;
        if (link.source && link.source.data["type"] === "equality") {
            return;
        }
        d3.select(element).append("line")
            .attr("x1", function () { return link.source["x"] + (_this.nodeWidth / 2); })
            .attr("y1", function () { return link.source["y"] + (_this.nodeHeight / 2); })
            .attr("x2", function () { return link.target["x"] + (_this.nodeWidth / 2); })
            .attr("y2", function () { return link.target["y"] + (_this.nodeHeight / 2); })
            .attr("class", "mirror-mountain-line");
    };
    MirrorMountainService.prototype.processNode = function (node, element) {
        switch (node.data["group"]) {
            case "number":
                this.processNumberNode(node, element);
                break;
            case "operator":
                this.processOperatorNode(node, element);
                break;
            case "extended":
                this.processExtendedNode(node, element);
                break;
            default:
                this.processStandardNode(node, element);
                break;
        }
    };
    MirrorMountainService.prototype.processNumberNode = function (node, element) {
        this.processStandardNode(node, element);
    };
    MirrorMountainService.prototype.processOperatorNode = function (node, element) {
        this.processStandardNode(node, element);
    };
    MirrorMountainService.prototype.processExtendedNode = function (node, element) {
        this.processStandardNode(node, element);
    };
    MirrorMountainService.prototype.processStandardNode = function (node, element) {
        var newNodeSelection = d3.select(element).append("g")
            .attr("transform", function (node) { return "translate(" + node["x"] + "," + node["y"] + ")"; });
        newNodeSelection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", this.nodeWidth)
            .attr("height", this.nodeHeight)
            .attr("class", this.getRectClassName);
        newNodeSelection.append("svg")
            .attr("width", this.nodeWidth)
            .attr("height", this.nodeHeight)
            .attr("viewBox", "0 0 60 60")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("text")
            .attr("font-size", this.getFontSize())
            .attr("x", "50%")
            .attr("y", "50%")
            .text(function (node) { return node.data["name"]; })
            .attr("class", this.getTextClassName);
    };
    MirrorMountainService.prototype.getRectClassName = function (node) {
        if (node.data["type"] === "equality") {
            return "mirror-mountain-rect-equality";
        }
        else {
            return "mirror-mountain-rect";
        }
    };
    MirrorMountainService.prototype.getTextClassName = function (node) {
        switch (node.data["group"]) {
            case "number": return "mirror-mountain-text mirror-mountain-text-number";
            case "operator": return (node.data["type"] === "multiplication") ?
                "mirror-mountain-text mirror-mountain-text-operator-multiplication" :
                "mirror-mountain-text mirror-mountain-text-operator";
            case "extended": return "mirror-mountain-text mirror-mountain-text-variable";
            default:
                "";
                break;
        }
    };
    MirrorMountainService.prototype.findEdgeLeaf = function (node, left) {
        var currentNode = node;
        while (currentNode && currentNode.children) {
            currentNode = left ? currentNode.children[0] : currentNode.children[1];
        }
        return currentNode;
    };
    MirrorMountainService.prototype.getFontSize = function () {
        return this.nodeHeight;
    };
    return MirrorMountainService;
}());
MirrorMountainService = __decorate([
    core_1.Injectable()
], MirrorMountainService);
exports.MirrorMountainService = MirrorMountainService;
//# sourceMappingURL=mirror-mountain.service.js.map