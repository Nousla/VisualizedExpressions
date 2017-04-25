import * as math from 'mathjs';
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from './internal-node';
import InternalData from './internal-data';
import MathInputService from './math-input-service';
import { Injectable } from "@angular/core";

@Injectable()
export class MathTextInputService implements MathInputService {

    convert(input: string): InternalData {
        var processedInput = this.preprocess(input);
        if (input === "") {
            return null;
        }

        var nodeMap = new Map<mathjs.MathNode, InternalNode>();
        var rootNode: mathjs.MathNode;

        try {
            rootNode = math.parse(processedInput);
        }
        catch (ex) {
            return null;
        }

        var rootInternalNode = this.createNode(rootNode);
        nodeMap.set(rootNode, rootInternalNode);
        var internalData = new InternalData(rootInternalNode);

        rootNode.traverse(function (node: mathjs.MathNode, path: string, parent: mathjs.MathNode) {
            var internalNode = nodeMap.get(node);

            if (internalNode === undefined) {
                internalNode = this.createNode(node);
                nodeMap.set(node, internalNode);
            }

            var internalParentNode = nodeMap.get(parent);
            internalNode.parent = internalParentNode;

            if (internalParentNode !== undefined) {
                if (internalParentNode.children === undefined) {
                    internalParentNode.children = [];
                }
                internalParentNode.children.push(internalNode);
            }
        }.bind(this));

        return internalData;
    }

    private preprocess(input: string): string {
        return input.replace('=', '==').replace('/(\r\n|\r|\n)/g', '');
    }

    private postprocessOperator(input: string): string {
        return input.replace('==', '=');
    }

    private createNode(node: mathjs.MathNode): InternalNode {
        var internalNode = new InternalNode();

        switch (node.type) {
            case "ConstantNode":
                internalNode.text = node.value;
                internalNode.type = Number.isInteger(+node.value)
                    ? InternalNodeType.Integer
                    : InternalNodeType.Decimal;
                internalNode.group = InternalNodeGroup.Number;
                break;
            case "OperatorNode":
                internalNode.text = (node.op = this.postprocessOperator(node.op));
                internalNode.type = this.getOperatorType(node);
                internalNode.group = InternalNodeGroup.Operator;
                break;
            case "ParenthesisNode":
                internalNode.text = "()";
                internalNode.type = InternalNodeType.Parentheses;
                internalNode.group = InternalNodeGroup.Container;
                break;
            case "SymbolNode":
                internalNode.text = node.name;
                internalNode.type = InternalNodeType.Variable;
                internalNode.group = InternalNodeGroup.Symbol;
                break;
            default:
                internalNode.text = "?";
                internalNode.type = InternalNodeType.Unknown;
                internalNode.group = InternalNodeGroup.Unknown;
                break;
        }

        return internalNode;
    }

    private getOperatorType(node: mathjs.MathNode): InternalNodeType {
        switch (node.op) {
            case "+": return InternalNodeType.Addition;
            case "-": return InternalNodeType.Subtraction;
            case "=": return InternalNodeType.Equality;
            case "*": return InternalNodeType.Multiplication;
            case "/": return InternalNodeType.Division;
            default: return InternalNodeType.Unknown;
        }
    }
}

export default MathTextInputService;