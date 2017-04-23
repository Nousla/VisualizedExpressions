import { Injectable, ElementRef } from '@angular/core';
import VisualizationService from '../visualization-service';
import { InternalData } from '../internal-data';
import { MirrorMountainConfig } from "./mirror-mountain-config";
import * as d3 from 'd3';
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from '../internal-node';
import VisualizationEventHandler from '../visualization-event-handler';

@Injectable()
export class MirrorMountainService implements VisualizationService {
    private width = 750;
    private height = 350;
    private nodeWidth = 40;
    private nodeHeight = 40;

    private nodeHorizontalSpacing = 10;
    private nodeVerticalSpacing = 20;
    private textHorizontalMargin = 5;

    private eventHandler: VisualizationEventHandler;

    constructor() {
        var svg = d3.select("body")
            .append("svg")
            .attr("id", "svg-hidden")
            .attr("visibility", "hidden");

        svg.append("text");

        svg.append("rect")
            .attr("class", "mirror-mountain-rect");
    }

    configure(config: Object, eventHandler: VisualizationEventHandler): void {
        if (config) {
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

        if (eventHandler) {
            this.eventHandler = eventHandler;
        }
    }

    construct(elementRef: ElementRef, internalData: InternalData): void {
        if (!elementRef) {
            return;
        }

        this.clearNodes(elementRef);

        if (!internalData) {
            return;
        }

        var rootNode = d3.hierarchy(internalData.rootNode);
        rootNode = this.preprocessRootNode(rootNode);
        this.layoutHierarchy(rootNode);
        this.postprocessRootNode(rootNode);

        var svg = d3.select(elementRef.nativeElement)
            .append("svg");

        var rectNode = <SVGRectElement>d3.select("#svg-hidden rect").node();
        var computedStyle = window.getComputedStyle(rectNode);
        var rectStrokeWidth = parseInt(computedStyle.strokeWidth);

        if (!rectStrokeWidth) {
            rectStrokeWidth = 0;
        }

        var rootGroup = svg.append("g")
            .attr("transform", "translate(" + rectStrokeWidth + "," + rectStrokeWidth + ")");;
        var instance = this;

        var links = rootNode.links();
        rootGroup.selectAll("line")
            .data(links)
            .enter()
            .each(function (link: D3Link) {
                instance.processLink(link, this);
            });

        var nodes = rootNode.descendants();
        rootGroup.selectAll("g")
            .data(nodes)
            .enter()
            .each(function (node: D3Node) {
                instance.processNode(node, this);
            });

        var gNode = <SVGGElement>rootGroup.node();
        if (gNode) {
            var boundingBox = gNode.getBBox();
            svg.attr("width", boundingBox.width + rectStrokeWidth * 2)
                .attr("height", boundingBox.height + rectStrokeWidth * 2);
        }
    }

    private clearNodes(elementRef: ElementRef): void {
        d3.select(elementRef.nativeElement)
            .selectAll("*")
            .remove();
    }

    private preprocessRootNode(rootNode: D3Node): D3Node {
        var nodeStack: D3Node[] = [];

        while (rootNode.data.type === InternalNodeType.Parentheses && rootNode.children) {
            rootNode = rootNode.children[0];
        }

        nodeStack.push(rootNode);

        while (nodeStack.length > 0) {
            let node = nodeStack.pop();
            this.preprocessNode(node, nodeStack);
        }

        return rootNode;
    }

    private preprocessNode(node: D3Node, nodeStack: D3Node[]): void {
        var width = this.getTextWidth(node);
        node["width"] = width > this.nodeWidth ? width : this.nodeWidth;

        if (!node.children) {
            return;
        }

        if (node.data.type === InternalNodeType.Parentheses) {
            let childToAdd = node.children[0];
            childToAdd.parent = node.parent;
            nodeStack.push(childToAdd);

            var index = node.parent.children.indexOf(node);
            node.parent.children.splice(index, 1);
            node.parent.children.splice(index, 0, childToAdd);

            node.parent = undefined;
        }
        else {
            for (var i = 0; i < node.children.length; i++) {
                nodeStack.push(node.children[i]);
            }
        }
    }

    private layoutHierarchy(rootNode: D3Node): void {
        rootNode["x"] = (-rootNode["width"] / 2);
        rootNode["y"] = 0;

        var treeHeight = this.calculateHeight(rootNode);

        this.layoutAdjacentNodes(rootNode.children, 1, treeHeight, this.nodeHeight + this.nodeVerticalSpacing);
    }

    private calculateHeight(node: D3Node): number {
        if (!node.children) {
            return 0;
        }

        var maxHeight = 0;
        for (var i = 0; i < node.children.length; i++) {
            maxHeight = Math.max(maxHeight, this.calculateHeight(node.children[i]));
        }

        return maxHeight + 1;
    }

    private layoutAdjacentNodes(nodes: D3Node[], currentLevel: number, maxLevel: number, previousHeight: number): void {
        if (!nodes || nodes.length === 0) {
            return;
        }

        var totalWidth = this.calculateTotalWidth(nodes);
        var accumulatedWidth = 0;
        var accumulatedChildren: D3Node[] = [];

        for (let i = 0; i < nodes.length; i++) {
            nodes[i]["x"] = (accumulatedWidth - (totalWidth / 2)) + i * this.nodeHorizontalSpacing;
            nodes[i]["y"] = previousHeight;

            accumulatedWidth += nodes[i]["width"];

            if (nodes[i].children) {
                accumulatedChildren.push.apply(accumulatedChildren, nodes[i].children);
            }
            else {
                // Re-include nodes that are leaf nodes, but are not at the lowest level. 
                // This will force all leaf nodes to the same level.
                if (currentLevel !== maxLevel) {
                    accumulatedChildren.push(nodes[i]);
                }
            }
        }

        var nextHeight = previousHeight + this.nodeHeight + this.nodeVerticalSpacing;

        this.layoutAdjacentNodes(accumulatedChildren, currentLevel + 1, maxLevel, nextHeight);
    }

    private calculateTotalWidth(nodes: D3Node[]): number {
        var totalWidth = 0;
        for (var i = 0; i < nodes.length; i++) {
            totalWidth += nodes[i]["width"];
        }

        return totalWidth;
    }

    private postprocessRootNode(rootNode: D3Node): void {
        var offsetX: number;
        var offsetY: number;
        if (rootNode.children && rootNode.children.length > 0) {
            let topLeftLeafNode = this.findEdgeLeaf(rootNode.children[0], true);
            offsetX = topLeftLeafNode["x"];
            offsetY = topLeftLeafNode["y"];
        }
        else {
            offsetX = -rootNode["width"] / 2;
            offsetY = 0;
        }

        rootNode.descendants().forEach((node: D3Node) => {
            if (node.data.type === InternalNodeType.Equality) {
                var leftEdgeLeaf = this.findEdgeLeaf(node.children[0], false);
                if (leftEdgeLeaf) {
                    node["x"] = leftEdgeLeaf["x"] + leftEdgeLeaf["width"] + this.nodeHorizontalSpacing;
                    node["y"] -= leftEdgeLeaf["y"];
                }

                node.children[1].each((rightTreeNode: D3Node) => {
                    rightTreeNode["x"] += node["width"] + this.nodeHorizontalSpacing;
                });
            }
            else {
                node["y"] = -node["y"];
            }

            if (node.data.group === InternalNodeGroup.Operator && node.data.type !== InternalNodeType.Equality) {
                var leaves = node.leaves();
                var treeWidth = this.calculateNodesWidth(leaves);
                node["x"] = leaves[0]["x"] + (treeWidth / 2);
            }

            if (offsetX && offsetX < 0) {
                node["x"] -= offsetX;
            }

            if (offsetY && offsetY > 0) {
                node["y"] += offsetY;
            }
        });
    }

    private calculateNodesWidth(nodes: D3Node[]): number {
        if (!nodes) {
            return 0;
        }

        var leftNode = nodes[0];
        var rightNode = nodes[nodes.length - 1];
        return (rightNode["x"] + rightNode["width"]) - leftNode["x"];
    }

    private processNode(node: D3Node, element: d3.EnterElement): void {
        switch (node.data.group) {
            case InternalNodeGroup.Number: this.processNumberNode(node, element);
                break;
            case InternalNodeGroup.Operator: this.processOperatorNode(node, element);
                break;
            case InternalNodeGroup.Container: this.processContainerNode(node, element);
                break;
            default: this.processStandardNode(node, element);
                break;
        }
    }

    private processNumberNode(node: D3Node, element: d3.EnterElement): void {
        this.processStandardNode(node, element);
    }

    private processOperatorNode(node: D3Node, element: d3.EnterElement): void {
        this.processStandardNode(node, element);
    }

    private processContainerNode(node: D3Node, element: d3.EnterElement): void {
        return;
    }

    private processStandardNode(node: D3Node, element: d3.EnterElement): void {
        var newNodeSelection = d3.select(element).append("g")
            .attr("transform", (node: D3Node) => { return "translate(" + node["x"] + "," + node["y"] + ")" })

        newNodeSelection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", (node: D3Node) => { return node["width"] })
            .attr("height", this.nodeHeight)
            .attr("class", this.getRectClassName)
            .on("click", this.onClick.bind(this));

        newNodeSelection.append("svg")
            .attr("width", (node: D3Node) => { return node["width"] })
            .attr("height", this.nodeHeight)
            .append("text")
            .attr("font-size", this.getFontSize())
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("class", this.getTextClassName)
            .attr("dy", this.getTextDY)
            .text((node: D3Node) => { return node.data.text })
            .on("click", this.onClick.bind(this));
    }

    private processLink(link: D3Link, element: d3.EnterElement): void {
        if (link.source && link.source.data.type === InternalNodeType.Equality) {
            return;
        }

        var path: string[] = [];

        // Move to start position (parent node)
        path.push("M");
        path.push(link.source["x"] + (link.source["width"] / 2));
        path.push(link.source["y"]);

        // First line (vertical)
        path.push("V");
        path.push((link.source["y"] - (this.nodeVerticalSpacing / 2)).toString());

        // Second line (horizontal)
        path.push("H");
        path.push(link.target["x"] + (link.target["width"] / 2));

        // Third line (vertical)
        path.push("V");
        path.push(link.target["y"] + this.nodeHeight);

        d3.select(element).append("path")
            .attr("d", () => { return path.join(" "); })
            .attr("fill", "transparent")
            .attr("class", "mirror-mountain-line")
    }

    private onClick(node: D3Node): void {
        if (this.eventHandler) {
            this.eventHandler.selectNode(node.data)
        }
    }

    private getRectClassName(node: D3Node): string {
        if (node.data.type === InternalNodeType.Equality) {
            return "mirror-mountain-rect mirror-mountain-rect-equality";
        }
        else {
            return "mirror-mountain-rect";
        }
    }

    private getTextDY(node: D3Node): string {
        if (node.data.type === InternalNodeType.Multiplication) {
            return "0.5em";
        }
        else if (node.data.type === InternalNodeType.Division
            || node.data.type === InternalNodeType.Subtraction) {
            return "0.25em";
        }
        else {
            return "0.3em";
        }
    }

    private getTextClassName(node: D3Node): string {
        return "mirror-mountain-text";
    }

    private getTextWidth(node: D3Node): number {
        var textNode = <SVGTextElement>d3.select("#svg-hidden text")
            .text(() => { return node.data.text })
            .attr("class", () => { return this.getTextClassName(node) })
            .attr("font-size", this.getFontSize())
            .node();

        return textNode ? textNode.getComputedTextLength() + this.textHorizontalMargin : 0;
    }

    private findEdgeLeaf(node: D3Node, left: boolean): D3Node {
        var currentNode = node;
        while (currentNode && currentNode.children) {
            currentNode = left ? currentNode.children[0] : currentNode.children[1];
        }

        return currentNode;
    }

    private getFontSize(): number {
        return this.nodeHeight * 0.75;
    }
}

type D3Node = d3.HierarchyNode<InternalNode>;
type D3Link = d3.HierarchyLink<InternalNode>;