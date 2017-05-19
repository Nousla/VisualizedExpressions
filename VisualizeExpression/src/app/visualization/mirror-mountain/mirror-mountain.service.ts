import { Injectable, ElementRef } from '@angular/core';
import VisualizationService from '../visualization-service';
import { InternalData } from '../internal-data';
import { MirrorMountainConfig } from "./mirror-mountain-config";
import * as d3 from 'd3';
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from '../internal-node';
import VisualizationEventHandler from '../visualization-event-handler';
import { UndefinedArgumentException } from "../../exceptions/undefined-argument-exception";

@Injectable()
export class MirrorMountainService implements VisualizationService {
    private nodeWidth = 40;
    private nodeHeight = 40;

    private nodeHorizontalSpacing = 10;
    private nodeVerticalSpacing = 20;
    private textHorizontalMargin = 5;

    constructor() {
        var svg = d3.select("body")
            .append("svg")
            .attr("id", "svg-hidden")
            .attr("visibility", "hidden")
            .style("height", "0");

        svg.append("text");

        svg.append("rect")
            .attr("class", "mirror-mountain-rect");
    }

    configure(config: Object): void {
        if (config && config instanceof MirrorMountainConfig) {
            if (config.hasOwnProperty("nodeWidth")) {
                this.nodeWidth = config["nodeWidth"];
            }

            if (config.hasOwnProperty("nodeHeight")) {
                this.nodeHeight = config["nodeHeight"];
            }
        }
    }

    visualize(elementRef: ElementRef, internalData: InternalData, eventHandler: VisualizationEventHandler): void {
        if (!elementRef) {
            throw new UndefinedArgumentException("elementRef");
        }

        if (!internalData) {
            throw new UndefinedArgumentException("internalData");
        }

        this.clearNodes(elementRef);

        var rootNode = d3.hierarchy(internalData.rootNode);
        rootNode = this.preprocessRootNode(rootNode);
        var layoutOutput = this.layoutHierarchy(rootNode);
        this.postprocessRootNode(rootNode, layoutOutput);

        var svg = d3.select(elementRef.nativeElement).select("svg");
        if (svg.empty()) {
            svg = d3.select(elementRef.nativeElement).append("svg");
        }

        var rectNode = <SVGRectElement>d3.select("#svg-hidden rect").node();
        var computedStyle = window.getComputedStyle(rectNode);
        var rectStrokeWidth = parseInt(computedStyle.strokeWidth);

        if (!rectStrokeWidth) {
            rectStrokeWidth = 0;
        }

        var rootGroup = svg.select("g");
        if (rootGroup.empty()) {
            rootGroup = svg.append("g");
        }
        rootGroup.attr("transform", "translate(" + rectStrokeWidth + "," + rectStrokeWidth + ")");

        var instance = this;

        var nodes = rootNode.descendants();
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
                instance.processNode(node, this, eventHandler);
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

    private layoutHierarchy(rootNode: D3Node): LayoutOutput {
        rootNode["x"] = -(rootNode["width"] / 2);
        rootNode["y"] = 0;

        var treeHeight = this.calculateHeight(rootNode);
        var layoutState = new LayoutState(treeHeight);
        layoutState.currentLevel = 1;

        var layoutOutput = new LayoutOutput();
        layoutOutput.maxWidth = rootNode["width"];

        this.layoutAdjacentNodes(rootNode.children, layoutState, layoutOutput);

        return layoutOutput;
    }

    private layoutAdjacentNodes(nodes: D3Node[], layoutState: LayoutState, layoutOutput: LayoutOutput): void {
        if (!nodes || nodes.length === 0) {
            return;
        }

        var totalWidth = this.calculateTotalWidth(nodes) + (nodes.length - 1) * this.nodeHorizontalSpacing;
        layoutOutput.maxWidth = Math.max(layoutOutput.maxWidth, totalWidth);

        var accumulatedWidth = 0;
        var accumulatedChildren: D3Node[] = [];

        for (let i = 0; i < nodes.length; i++) {
            nodes[i]["x"] = (-(totalWidth / 2) + accumulatedWidth) + i * this.nodeHorizontalSpacing;
            nodes[i]["y"] = layoutState.currentLevel * (this.nodeHeight + this.nodeVerticalSpacing);

            accumulatedWidth += nodes[i]["width"];

            if (nodes[i].children) {
                let offsetHeight: number = nodes[i]["offsetHeight"];
                if (offsetHeight) {
                    accumulatedChildren.push(nodes[i]);

                    offsetHeight -= 1;
                    if (offsetHeight <= 0) {
                        delete nodes[i]["offsetHeight"];
                    }
                    else {
                        nodes[i]["offsetHeight"] = offsetHeight;
                    }
                }
                else {
                    let height = this.calculateHeight(nodes[i]);
                    if(height < layoutState.maxLevel - layoutState.currentLevel)
                    {
                        accumulatedChildren.push(nodes[i]); 
                    }
                    else {
                        accumulatedChildren.push.apply(accumulatedChildren, nodes[i].children);
                    }
                }
            }
            else {
                // Re-include nodes that are leaf nodes, but are not at the lowest level. 
                // This will force all leaf nodes to the same level.
                if (layoutState.currentLevel !== layoutState.maxLevel) {
                    accumulatedChildren.push(nodes[i]);
                }
            }
        }

        layoutState.currentLevel += 1;

        this.layoutAdjacentNodes(accumulatedChildren, layoutState, layoutOutput);
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

    private calculateTotalWidth(nodes: D3Node[]): number {
        var totalWidth = 0;
        for (var i = 0; i < nodes.length; i++) {
            totalWidth += nodes[i]["width"];
        }

        return totalWidth;
    }

    private postprocessRootNode(rootNode: D3Node, layoutOutput: LayoutOutput): void {
        var offsetY: number = 0;
        if (rootNode.children && rootNode.children.length > 0) {
            let topLeftLeafNode = this.findEdgeLeaf(rootNode.children[0], true);
            offsetY = topLeftLeafNode["y"];
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

            if (node.data.group === InternalNodeGroup.Operator
                && node.data.type !== InternalNodeType.Equality) {
                var leaves = node.leaves();
                var treeWidth = this.calculateNodesWidth(leaves);
                node["x"] = leaves[0]["x"] + (treeWidth / 2) - (node["width"] / 2);
            }

            node["x"] += layoutOutput.maxWidth / 2;

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

    private processNode(node: D3Node, element: d3.EnterElement, eventHandler: VisualizationEventHandler): void {
        if(node.data.group !== InternalNodeGroup.Container){
            this.processStandardNode(node, element, eventHandler);
        }
    }

    private processStandardNode(node: D3Node, element: d3.EnterElement, eventHandler: VisualizationEventHandler): void {
        var newNodeSelection = d3.select(element).append("g")
            .attr("transform", (node: D3Node) => { return "translate(" + node["x"] + "," + node["y"] + ")" })

        var rect = newNodeSelection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", (node: D3Node) => { return node["width"] })
            .attr("height", this.nodeHeight)
            .attr("class", this.getRectClassName);

        var text = newNodeSelection.append("svg")
            .attr("width", (node: D3Node) => { return node["width"] })
            .attr("height", this.nodeHeight)
            .append("text")
            .attr("font-size", this.getFontSize())
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("class", this.getTextClassName)
            .attr("dy", this.getTextDY)
            .text((node: D3Node) => { return node.data.text })

        if (eventHandler) {
            rect.style("cursor", "pointer")
                .on("click", (node: D3Node) => { this.onClick(node, eventHandler) });

            text.style("cursor", "pointer")
                .on("click", (node: D3Node) => { this.onClick(node, eventHandler) })
        }
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

    private onClick(node: D3Node, eventHandler: VisualizationEventHandler): void {
        if (eventHandler) {
            eventHandler.selectNode(node.data)
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
            currentNode = left || currentNode.children.length == 1 ? currentNode.children[0] : currentNode.children[1];
        }

        return currentNode;
    }

    private getFontSize(): number {
        return this.nodeHeight * 0.75;
    }
}

class LayoutState {
    private _currentLevel: number;
    private _maxLevel: number;

    constructor(maxLevel: number) {
        this._maxLevel = maxLevel;
    }

    get currentLevel(): number {
        return this._currentLevel;
    }

    get maxLevel(): number {
        return this._maxLevel;
    }

    set currentLevel(currentLevel: number) {
        this._currentLevel = currentLevel;
    }
}

class LayoutOutput {
    private _maxWidth: number;

    get maxWidth(): number {
        return this._maxWidth;
    }

    set maxWidth(maxWidth: number) {
        this._maxWidth = maxWidth;
    }
}



type D3Node = d3.HierarchyNode<InternalNode>;
type D3Link = d3.HierarchyLink<InternalNode>;