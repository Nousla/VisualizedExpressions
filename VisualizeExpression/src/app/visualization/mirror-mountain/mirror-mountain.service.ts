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

    private eventHandler: VisualizationEventHandler;

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

        var processedRootNode = this.preprocessRootNode(internalData.clone().rootNode);

        var rootNode = d3.hierarchy(processedRootNode);
        d3.cluster().nodeSize([this.nodeWidth + 10, this.nodeHeight + 10])(rootNode);

        // Determine new x and width based on text length. Push all sibling nodes 
        // or fill the total width with all sibling nodes.
        // Custom layout in layers.

        var nodes = rootNode.descendants();
        var links = rootNode.links();

        var errorX: number;
        var errorY: number;
        if (rootNode.children && rootNode.children.length > 0) {
            let topLeftLeafNode = this.findEdgeLeaf(rootNode.children[0], true);
            errorX = topLeftLeafNode["x"];
            errorY = topLeftLeafNode["y"];
        }

        nodes.forEach((node: d3.HierarchyNode<InternalNode>) => {
            if (node.data.type === InternalNodeType.Equality) {
                var leftEdgeLeaf = this.findEdgeLeaf(rootNode.children[0], false);
                var rightEdgeLeaf = this.findEdgeLeaf(rootNode.children[1], true);
                var edgeLeafGapWidth = leftEdgeLeaf["x"] + rightEdgeLeaf["x"];

                node["x"] = edgeLeafGapWidth / 2;
                node["y"] -= leftEdgeLeaf["y"];
            }
            else {
                node["y"] = -node["y"];
            }

            if (errorX && errorX < 0) {
                node["x"] -= errorX;
            }

            if (errorY && errorY > 0) {
                node["y"] += errorY;
            }
        });

        var svg = d3.select(elementRef.nativeElement)
            .append("svg");

        var rootGroup = svg.append("g");
        var instance = this;

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

        var gNode = <SVGGElement>rootGroup.node();
        if (gNode) {
            var boundingBox = gNode.getBBox();
            svg.attr("width", boundingBox.width)
                .attr("height", boundingBox.height)
                .attr("viewBox", "0 0 " + boundingBox.width + " " + boundingBox.height);
        }
    }

    private clearNodes(elementRef: ElementRef): void {
        d3.select(elementRef.nativeElement)
            .selectAll("*")
            .remove();
    }

    private preprocessRootNode(rootNode: InternalNode): InternalNode {
        var nodeStack = [];

        while (rootNode.type === InternalNodeType.Parentheses && rootNode.children) {
            rootNode = rootNode.children[0];
        }

        nodeStack.push(rootNode);

        while (nodeStack.length > 0) {
            let node = nodeStack.pop();
            this.preprocessNode(node, nodeStack);
        }

        return rootNode;
    }

    private preprocessNode(node: InternalNode, nodeStack: InternalNode[]): void {
        if (!node.children) {
            return;
        }

        var childrenToAdd: InternalNode[];
        if (node.type === InternalNodeType.Parentheses) {
            for (var i = 0; i < node.children.length; i++) {
                node.children[i].parent = node.parent;
                nodeStack.push(node.children[i]);
            }

            childrenToAdd = node.children;

            var index = node.parent.children.indexOf(node);
            node.parent.children.splice(index, 1);
            node.parent.children.push.apply(node.parent.children, childrenToAdd);
            node.parent = undefined;
        }
        else {
            for (var i = 0; i < node.children.length; i++) {
                nodeStack.push(node.children[i]);
            }
        }
    }

    private processNode(node: d3.HierarchyNode<InternalNode>, element: d3.EnterElement): void {
        switch (node.data.group) {
            case InternalNodeGroup.Number: this.processNumberNode(node, element);
                break;
            case InternalNodeGroup.Operator: this.processOperatorNode(node, element);
                break;
            case InternalNodeGroup.Container: this.processContainerNode(node, element);
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

    private processContainerNode(node: d3.HierarchyNode<InternalNode>, element: d3.EnterElement): void {
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
            .attr("class", this.getRectClassName)
            .on("click", this.onClick.bind(this));

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
            .attr("class", this.getTextClassName)
            .on("click", this.onClick.bind(this));
    }

    private processLink(link: d3.HierarchyLink<InternalNode>, element: d3.EnterElement): void {
        if (link.source && link.source.data.type === InternalNodeType.Equality) {
            return;
        }

        var source = link.source;
        if (link.source.data.type === InternalNodeType.Parentheses && link.source.parent) {
            source = link.source.parent;
        }

        d3.select(element).append("line")
            .attr("x1", () => { return source["x"] + (this.nodeWidth / 2) })
            .attr("y1", () => { return source["y"] + (this.nodeHeight / 2) })
            .attr("x2", () => { return link.target["x"] + (this.nodeWidth / 2) })
            .attr("y2", () => { return link.target["y"] + (this.nodeHeight / 2) })
            .attr("class", "mirror-mountain-line")
    }

    private onClick(node: d3.HierarchyNode<InternalNode>): void {
        if (this.eventHandler) {
            this.eventHandler.selectNode(node.data)
        }
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
            case InternalNodeGroup.Operator: /*return (node.data["type"] === "multiplication") ? 
                "mirror-mountain-text mirror-mountain-text-operator-multiplication" :*/
                return "mirror-mountain-text mirror-mountain-text-operator";
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