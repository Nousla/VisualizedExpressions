import { InternalData } from "../visualization/internal-data";
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from "../visualization/internal-node";
import { ExpressionOperationService } from "./expression-operation.service";
import { MathOutputService } from "../visualization/math-output-service";
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";

describe('Expression Service suite', () => {
    var service: ExpressionOperationService;

    beforeEach(() => {
        service = new ExpressionOperationService();
    });

    it('#applyReplacement should fail at undefined data reference', () => {
        let selectedNode = new InternalNode();
        let newNode = new InternalNode();

        let applyReplacementFunction = () => {
            service.applyReplacement(undefined, selectedNode, newNode);
        }

        expect(applyReplacementFunction).toThrowError(UndefinedArgumentException);
    });

    it('#applyReplacement should fail at undefined selectedNode reference', () => {
        let data = new InternalData(new InternalNode());
        let newNode = new InternalNode();

        let applyReplacementFunction = () => {
            service.applyReplacement(data, undefined, newNode);
        }

        expect(applyReplacementFunction).toThrowError(UndefinedArgumentException);
    });

    it('#applyReplacement should fail at undefined newNode reference', () => {
        let data = new InternalData(new InternalNode());
        let selectedNode = new InternalNode();

        let applyReplacementFunction = () => {
            service.applyReplacement(data, selectedNode, undefined);
        }

        expect(applyReplacementFunction).toThrowError(UndefinedArgumentException);
    });

    it('#applyReplacement should replace root node', () => {
        let rootNode = new InternalNode();
        rootNode.text = "+";
        rootNode.type = InternalNodeType.Addition;
        rootNode.group = InternalNodeGroup.Operator;

        let data = new InternalData(rootNode);
        let selectedNode = rootNode;

        let newNode = new InternalNode();
        newNode.text = "-";
        newNode.type = InternalNodeType.Subtraction;
        newNode.group = InternalNodeGroup.Operator;

        let result: InternalData = service.applyReplacement(data, selectedNode, newNode);
        expect(result.rootNode.text).toBe("-");
    });

    it('#applyReplacement should replace non-root node', () => {
        let rootNode = new InternalNode();
        rootNode.text = "+";
        rootNode.type = InternalNodeType.Addition;
        rootNode.group = InternalNodeGroup.Operator;

        let childNode1 = new InternalNode();
        childNode1.text = "7";
        childNode1.type = InternalNodeType.Integer;
        childNode1.group = InternalNodeGroup.Number;
        childNode1.parent = rootNode;

        let childNode2 = new InternalNode();
        childNode2.text = "2";
        childNode2.type = InternalNodeType.Integer;
        childNode2.group = InternalNodeGroup.Number;
        childNode2.parent = rootNode;

        rootNode.children = [childNode1, childNode2];

        let data = new InternalData(rootNode);
        let selectedNode = childNode1;

        let newNode = new InternalNode();
        newNode.text = "9";
        newNode.type = InternalNodeType.Integer;
        newNode.group = InternalNodeGroup.Number;

        let result: InternalData = service.applyReplacement(data, selectedNode, newNode);
        expect(result.rootNode.children[0].text).toBe("9");
    });

    it('#applyReplacement should remove superfluous parentheses', () => {
        let rootNode = new InternalNode();
        rootNode.text = "()";
        rootNode.type = InternalNodeType.Parentheses;
        rootNode.group = InternalNodeGroup.Container;

        let operatorNode = new InternalNode();
        operatorNode.text = "+";
        operatorNode.type = InternalNodeType.Addition;
        operatorNode.group = InternalNodeGroup.Operator;

        rootNode.children = [operatorNode];

        let childNode1 = new InternalNode();
        childNode1.text = "7";
        childNode1.type = InternalNodeType.Integer;
        childNode1.group = InternalNodeGroup.Number;
        childNode1.parent = operatorNode;

        let childNode2 = new InternalNode();
        childNode2.text = "2";
        childNode2.type = InternalNodeType.Integer;
        childNode2.group = InternalNodeGroup.Number;
        childNode2.parent = operatorNode;

        operatorNode.children = [childNode1, childNode2];

        let data = new InternalData(rootNode);
        let selectedNode = operatorNode;

        let newNode = new InternalNode();
        newNode.text = "9";
        newNode.type = InternalNodeType.Integer;
        newNode.group = InternalNodeGroup.Number;

        let result: InternalData = service.applyReplacement(data, selectedNode, newNode);
        expect(result.rootNode.text).toBe("9");
    });
});