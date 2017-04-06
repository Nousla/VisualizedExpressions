import { Injectable, ElementRef } from '@angular/core';
import VisualizationService from '../visualization-service';
import { InternalData } from '../internal-data';
import { MirrorMountainConfig } from "./mirror-mountain-config";
import * as d3 from 'd3';
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from "../internal-node";

@Injectable()
export class MirrorMountainService implements VisualizationService {
    private width = 750;
    private height = 350;
    private nodeWidth = 40;
    private nodeHeight = 40;

    configure(config: Object): void {
        if (!config) {
            return;
        }

        if (config.hasOwnProperty("width")) {
            this.width = config["width"];
        }

        if (config.hasOwnProperty("height")) {
            this.width = config["height"];
        }

        if (config.hasOwnProperty("nodeWidth")) {
            this.width = config["nodeWidth"];
        }

        if (config.hasOwnProperty("nodeHeight")) {
            this.width = config["nodeHeight"];
        }
    }

    construct(elementRef: ElementRef, internalData: InternalData): void {
        d3.select(elementRef.nativeElement)
            .selectAll("*")
            .remove();
        var svg = d3.select(elementRef.nativeElement)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        var rootNode = d3.hierarchy(internalData.data);
        d3.cluster().nodeSize([this.nodeWidth, this.nodeHeight])/*.size([this.width, this.height])*/(rootNode);

        var instance = this;
        var rootGroup = svg.append("g");
        var nodes = rootNode.descendants();
        var links = rootNode.links();

        var topLeftLeaf = this.findEdgeLeaf(rootNode.children[0], true);
        console.log(topLeftLeaf);

        nodes.forEach((node: d3.HierarchyNode<InternalNode>) => {
            if (node.data.type === InternalNodeType.Equality) {
                var leftEdgeLeaf = this.findEdgeLeaf(rootNode.children[0], false);
                var rightEdgeLeaf = this.findEdgeLeaf(rootNode.children[1], true);
                var edgeLeafGapWidth = leftEdgeLeaf["x"] + rightEdgeLeaf["x"];

                node["x"] = edgeLeafGapWidth / 2;
            }
            else {
                node["y"] = -node["y"] + (this.height);
            }
        });

        rootGroup.selectAll("line")
            .data(links)
            .enter()
            .each(function (link: d3.HierarchyLink<InternalNode>) {
                instance.processLink(link, this);
            });

        rootGroup.selectAll("g")
            .data(nodes)
            .enter()
            .each(function (node: d3.HierarchyNode<InternalNode>) {
                instance.processNode(node, this);
            });
    }

    private processLink(link: d3.HierarchyLink<InternalNode>, element: d3.EnterElement): void {
        if (link.source && link.source.data.type === InternalNodeType.Equality) {
            return;
        }

        d3.select(element).append("line")
            .attr("x1", () => { return link.source["x"] + (this.nodeWidth / 2) })
            .attr("y1", () => { return link.source["y"] + (this.nodeHeight / 2) })
            .attr("x2", () => { return link.target["x"] + (this.nodeWidth / 2) })
            .attr("y2", () => { return link.target["y"] + (this.nodeHeight / 2) })
            .attr("class", "mirror-mountain-line")
    }

    private processNode(node: d3.HierarchyNode<InternalNode>, element: d3.EnterElement): void {
        switch (node.data.group) {
            case InternalNodeGroup.Number: this.processNumberNode(node, element);
                break;
            case InternalNodeGroup.Operator: this.processOperatorNode(node, element);
                break;
            default: this.processStandardNode(node, element);
                break;
        }
    }

    private processNumberNode(node: d3.HierarchyNode<InternalNode>, element: d3.EnterElement): void {
        this.processStandardNode(node, element);
    }

    private processOperatorNode(node: d3.HierarchyNode<InternalNode>, element: d3.EnterElement): void {
        this.processStandardNode(node, element);
    }

    private processExtendedNode(node: d3.HierarchyNode<InternalNode>, element: d3.EnterElement): void {
        this.processStandardNode(node, element);
    }

    private processStandardNode(node: d3.HierarchyNode<InternalNode>, element: d3.EnterElement): void {
        var newNodeSelection = d3.select(element).append("g")
            .attr("transform", (node: d3.HierarchyNode<InternalNode>) => { return "translate(" + node["x"] + "," + node["y"] + ")" })

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
            .text((node: d3.HierarchyNode<InternalNode>) => { return node.data.name })
            .attr("class", this.getTextClassName);
    }

    private getRectClassName(node: d3.HierarchyNode<InternalNode>): string {
        if (node.data.type === InternalNodeType.Equality) {
            return "mirror-mountain-rect-equality";
        }
        else {
            return "mirror-mountain-rect";
        }
    }

    private getTextClassName(node: d3.HierarchyNode<InternalNode>): string {
        switch (node.data.group) {
            case InternalNodeGroup.Number: return "mirror-mountain-text mirror-mountain-text-number";
            /*case "operator": return (node.data["type"] === "multiplication") ? 
                "mirror-mountain-text mirror-mountain-text-operator-multiplication" : 
                "mirror-mountain-text mirror-mountain-text-operator";*/
            //case "extended": return "mirror-mountain-text mirror-mountain-text-variable";
            default: ""
                break;
        }
    }

    private findEdgeLeaf(node: d3.HierarchyNode<InternalNode>, left: boolean): d3.HierarchyNode<InternalNode> {
        var currentNode = node;
        while (currentNode && currentNode.children) {
            currentNode = left ? currentNode.children[0] : currentNode.children[1];
        }

        return currentNode;
    }

    private getFontSize(): number {
        return this.nodeHeight;
    }
}
