import { MirrorMountainService } from "./mirror-mountain.service";
import { UndefinedArgumentException } from "../../exceptions/undefined-argument-exception";
import { ElementRef } from "@angular/core/";
import { InternalData } from "../internal-data";
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from "../internal-node";
import VisualizationEventHandler from '../visualization-event-handler';

describe('Mirror Mountain Service suite', () => {
    var service: MirrorMountainService;
    var addedDocumentElement: Element;

    beforeEach(() => {
        service = new MirrorMountainService();

        addedDocumentElement = undefined;
    });

    afterEach(() => {
        var hiddenSVG = document.querySelector("#svg-hidden");
        hiddenSVG.remove();

        if (addedDocumentElement) {
            addedDocumentElement.remove();
        }
    });

    it('#visualize should fail at undefined element reference', () => {
        let internalData: InternalData = new InternalData(new InternalNode());
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        let visualizeFunction = () => {
            service.visualize(undefined, internalData, mockEventHandler);
        }

        expect(visualizeFunction).toThrowError(UndefinedArgumentException);
    });

    it('#visualize should fail at undefined internal data reference', () => {
        let elementRef: ElementRef = new ElementRef({});
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        let visualizeFunction = () => {
            service.visualize(elementRef, undefined, mockEventHandler);
        }

        expect(visualizeFunction).toThrowError(UndefinedArgumentException);
    });

    it('#visualize should clear existing content', () => {
        let nativeElement = document.createElement("div");
        let nativeElementChild = document.createElement("p");
        nativeElement.appendChild(nativeElementChild);

        let elementRef: ElementRef = new ElementRef(nativeElement);
        let internalData: InternalData = new InternalData(new InternalNode());
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let containsChild = nativeElement.contains(nativeElementChild);
        expect(containsChild).toEqual(false);
    });

    it('#visualize should add svg element', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);
        let internalData: InternalData = new InternalData(new InternalNode());
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.querySelector("svg");
        expect(svgElement).toBeDefined();
    });

    it('#visualize should add symbol node element', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.group = InternalNodeGroup.Symbol;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let groupElement = svgElement.firstElementChild;
        let nodeElement = groupElement.firstElementChild;

        expect(nodeElement).toBeDefined();
    });

    it('#visualize should add number node element', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.group = InternalNodeGroup.Number;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let groupElement = svgElement.firstElementChild;
        let nodeElement = groupElement.firstElementChild;

        expect(nodeElement).toBeDefined();
    });

    it('#visualize should not add container node element', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.group = InternalNodeGroup.Container;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let groupElement = svgElement.firstElementChild;
        let nodeElement = groupElement.firstElementChild;

        expect(nodeElement).toBeNull();
    });

    it('#visualize should add operator node element', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.group = InternalNodeGroup.Operator;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let groupElement = svgElement.firstElementChild;
        let nodeElement = groupElement.firstElementChild;

        expect(nodeElement).toBeDefined();
    });

    it('#visualize should add unknown node element', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.group = InternalNodeGroup.Unknown;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let groupElement = svgElement.firstElementChild;
        let nodeElement = groupElement.firstElementChild;

        expect(nodeElement).toBeDefined();
    });

    it('#visualize should add node element with text', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.text = "x";
        internalNode.type = InternalNodeType.Variable;
        internalNode.group = InternalNodeGroup.Symbol;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let nodeElement = svgElement.firstElementChild;
        let textElement = svgElement.querySelector("text");

        expect(textElement.textContent).toBe("x");
    });

    it('#visualize should add three node elements', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let rootNode: InternalNode = new InternalNode();
        rootNode.text = "+";
        rootNode.type = InternalNodeType.Addition;
        rootNode.group = InternalNodeGroup.Operator;

        let childNode1: InternalNode = new InternalNode();
        childNode1.text = "5";
        childNode1.type = InternalNodeType.Integer;
        childNode1.group = InternalNodeGroup.Number;

        let childNode2: InternalNode = new InternalNode();
        childNode2.text = "2";
        childNode2.type = InternalNodeType.Integer;
        childNode2.group = InternalNodeGroup.Number;

        rootNode.children = [childNode1, childNode2];

        let internalData: InternalData = new InternalData(rootNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let rootElement = svgElement.firstElementChild;
        let nodeElements = rootElement.querySelectorAll("g");

        expect(nodeElements.length).toBe(3);
    });

    it('#visualize should add two path elements', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let rootNode: InternalNode = new InternalNode();
        rootNode.text = "+";
        rootNode.type = InternalNodeType.Addition;
        rootNode.group = InternalNodeGroup.Operator;

        let childNode1: InternalNode = new InternalNode();
        childNode1.text = "5";
        childNode1.type = InternalNodeType.Integer;
        childNode1.group = InternalNodeGroup.Number;

        let childNode2: InternalNode = new InternalNode();
        childNode2.text = "2";
        childNode2.type = InternalNodeType.Integer;
        childNode2.group = InternalNodeGroup.Number;

        rootNode.children = [childNode1, childNode2];

        let internalData: InternalData = new InternalData(rootNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let rootElement = svgElement.firstElementChild;
        let pathElements = rootElement.querySelectorAll("path");

        expect(pathElements.length).toBe(2);
    });

    it('#visualize should not add path elements for equality', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let rootNode: InternalNode = new InternalNode();
        rootNode.text = "=";
        rootNode.type = InternalNodeType.Equality;
        rootNode.group = InternalNodeGroup.Operator;

        let childNode1: InternalNode = new InternalNode();
        childNode1.text = "5";
        childNode1.type = InternalNodeType.Integer;
        childNode1.group = InternalNodeGroup.Number;

        let childNode2: InternalNode = new InternalNode();
        childNode2.text = "2";
        childNode2.type = InternalNodeType.Integer;
        childNode2.group = InternalNodeGroup.Number;

        rootNode.children = [childNode1, childNode2];

        let internalData: InternalData = new InternalData(rootNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let rootElement = svgElement.firstElementChild;
        let pathElements = rootElement.querySelectorAll("path");

        expect(pathElements.length).toBe(0);
    });

    it('#visualize should put leaf nodes at same level', () => {
        let nativeElement = document.createElement("div");
        document.body.appendChild(nativeElement);
        addedDocumentElement = nativeElement;

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let rootNode: InternalNode = new InternalNode();
        rootNode.text = "-";
        rootNode.type = InternalNodeType.Subtraction;
        rootNode.group = InternalNodeGroup.Operator;

        let operatorNode: InternalNode = new InternalNode();
        operatorNode.text = "+";
        operatorNode.type = InternalNodeType.Addition;
        operatorNode.group = InternalNodeGroup.Operator;

        let leafNode1: InternalNode = new InternalNode();
        leafNode1.text = "5";
        leafNode1.type = InternalNodeType.Integer;
        leafNode1.group = InternalNodeGroup.Number;

        let leafNode2: InternalNode = new InternalNode();
        leafNode2.text = "2";
        leafNode2.type = InternalNodeType.Integer;
        leafNode2.group = InternalNodeGroup.Number;

        operatorNode.children = [leafNode1, leafNode2];

        let leafNode3: InternalNode = new InternalNode();
        leafNode3.text = "7";
        leafNode3.type = InternalNodeType.Integer;
        leafNode3.group = InternalNodeGroup.Number;

        rootNode.children = [operatorNode, leafNode3];

        let internalData: InternalData = new InternalData(rootNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let rootElement = svgElement.firstElementChild;
        let nodeElements = rootElement.querySelectorAll("g");

        var hiddenRect = document.querySelector("#svg-hidden rect");
        var computedStyle = window.getComputedStyle(hiddenRect);
        var rectStrokeWidth = parseInt(computedStyle.strokeWidth);

        let leafCheck = 0;
        for (var i = 0; i < nodeElements.length; i++) {
            // For more information on SVG matrices: 
            // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
            let nodeMatrix = nodeElements[i].getCTM();
            if (nodeMatrix.f === rectStrokeWidth) {
                leafCheck++;
            }
        }

        expect(leafCheck).toBe(3);
    });

    it('#visualize should put equality nodes at same level as leaf nodes', () => {
        let nativeElement = document.createElement("div");
        document.body.appendChild(nativeElement);
        addedDocumentElement = nativeElement;

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let rootNode: InternalNode = new InternalNode();
        rootNode.text = "=";
        rootNode.type = InternalNodeType.Equality;
        rootNode.group = InternalNodeGroup.Operator;

        let operatorNode: InternalNode = new InternalNode();
        operatorNode.text = "+";
        operatorNode.type = InternalNodeType.Addition;
        operatorNode.group = InternalNodeGroup.Operator;

        let leafNode1: InternalNode = new InternalNode();
        leafNode1.text = "5";
        leafNode1.type = InternalNodeType.Integer;
        leafNode1.group = InternalNodeGroup.Number;

        let leafNode2: InternalNode = new InternalNode();
        leafNode2.text = "2";
        leafNode2.type = InternalNodeType.Integer;
        leafNode2.group = InternalNodeGroup.Number;

        operatorNode.children = [leafNode1, leafNode2];

        let leafNode3: InternalNode = new InternalNode();
        leafNode3.text = "7";
        leafNode3.type = InternalNodeType.Integer;
        leafNode3.group = InternalNodeGroup.Number;

        rootNode.children = [operatorNode, leafNode3];

        let internalData: InternalData = new InternalData(rootNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let rootElement = svgElement.firstElementChild;
        let nodeElements = rootElement.querySelectorAll("g");

        var hiddenRect = document.querySelector("#svg-hidden rect");
        var computedStyle = window.getComputedStyle(hiddenRect);
        var rectStrokeWidth = parseInt(computedStyle.strokeWidth);

        let leafCheck = 0;
        for (var i = 0; i < nodeElements.length; i++) {
            // For more information on SVG matrices: 
            // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
            let nodeMatrix = nodeElements[i].getCTM();
            if (nodeMatrix.f === rectStrokeWidth) {
                leafCheck++;
            }
        }

        expect(leafCheck).toBe(4);
    });

    it('#visualize should call back when node element clicked', (done: DoneFn) => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.text = "x";
        internalNode.children = [];
        internalNode.type = InternalNodeType.Variable;
        internalNode.group = InternalNodeGroup.Symbol;

        let internalData: InternalData = new InternalData(internalNode);
        let selectedNode: InternalNode;

        let mockEventHandler: MockEmptyVisualizationHandler = {
            selectNode(data: InternalNode) {
                selectedNode = data;
            }
        };

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.firstElementChild;
        let nodeElement = svgElement.querySelector("g");
        let rectElement = nodeElement.querySelector("rect");

        var event = document.createEvent("SVGEvents");
        event.initEvent("click", false, false);
        rectElement.dispatchEvent(event);

        setTimeout(() => {
            expect(selectedNode).toBeDefined();
            done();
        }, 50);
    });
});

class MockEmptyVisualizationHandler implements VisualizationEventHandler {
    selectNode(data: InternalNode): void { }
}