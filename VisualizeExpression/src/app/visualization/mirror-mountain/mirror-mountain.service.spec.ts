import { MirrorMountainService } from "./mirror-mountain.service";
import { UndefinedArgumentException } from "../../exceptions/undefined-argument-exception";
import { ElementRef } from "@angular/core/";
import { InternalData } from "../internal-data";
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from "../internal-node";
import VisualizationEventHandler from '../visualization-event-handler';

describe('Mirror Mountain Service suite', () => {
    var service: MirrorMountainService;

    beforeEach(() => {
        service = new MirrorMountainService();
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

    it('#visualize should add node element', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.text = "x";
        internalNode.children = [];
        internalNode.type = InternalNodeType.Variable;
        internalNode.group = InternalNodeGroup.Symbol;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.querySelector("svg");
        let nodeElement = svgElement.querySelector("g");
        expect(nodeElement).toBeDefined();
    });

    it('#visualize should add node element with text', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let internalNode: InternalNode = new InternalNode();
        internalNode.text = "x";
        internalNode.children = [];
        internalNode.type = InternalNodeType.Variable;
        internalNode.group = InternalNodeGroup.Symbol;

        let internalData: InternalData = new InternalData(internalNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.querySelector("svg");
        let nodeElement = svgElement.querySelector("g");
        let textElement = svgElement.querySelector("text");
        expect(textElement.textContent).toBe("x");
    });

    it('#visualize should add three node elements', () => {
        let nativeElement = document.createElement("div");

        let elementRef: ElementRef = new ElementRef(nativeElement);

        let rootNode: InternalNode = new InternalNode();
        rootNode.text = "+";
        rootNode.type = InternalNodeType.Equality;
        rootNode.group = InternalNodeGroup.Operator;

        let childNode1: InternalNode = new InternalNode();
        childNode1.text = "5";
        childNode1.type = InternalNodeType.Integer;
        childNode1.group = InternalNodeGroup.Number;

        let childNode2: InternalNode = new InternalNode();
        childNode1.text = "2";
        childNode1.type = InternalNodeType.Integer;
        childNode1.group = InternalNodeGroup.Number;

        rootNode.children = [childNode1, childNode2];

        let internalData: InternalData = new InternalData(rootNode);
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        service.visualize(elementRef, internalData, mockEventHandler);

        let svgElement = nativeElement.querySelector("svg");
        let rootElement = svgElement.querySelector("g");
        let nodeElements = rootElement.querySelectorAll("g");
        expect(nodeElements.length).toBe(3);
    });
});

class MockEmptyVisualizationHandler implements VisualizationEventHandler {
    selectNode(data: InternalNode): void { }
}