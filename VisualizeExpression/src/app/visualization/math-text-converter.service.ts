import * as math from 'mathjs';
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from './internal-node';
import InternalData from './internal-data';
import MathConverterService from './math-converter-service';
import { Injectable } from "@angular/core";

@Injectable()
export class MathTextConverterService implements MathConverterService {

    convert(input: string): InternalData {
        var processedInput = this.preprocess(input);
        if(input === "") {
            return null;
        }

        var nodeMap = new Map<mathjs.MathNode, InternalNode>();
        var nodeSubstituteMap = new Map<mathjs.MathNode, mathjs.MathNode>();
        var rootNode: mathjs.MathNode;
        try {
            rootNode = math.parse(processedInput);

            if (rootNode.type === "ParenthesisNode") {
                rootNode = rootNode["content"];
            }
        }
        catch (ex) {
            return null;
        }
        var rootInternalNode = this.createNode(rootNode);
        nodeMap.set(rootNode, rootInternalNode);
        var internalData = new InternalData(rootInternalNode);

        rootNode.traverse(function (node: mathjs.MathNode, path: string, parent: mathjs.MathNode) {
            if (node.type === "ParenthesisNode") {
                nodeSubstituteMap.set(node, parent);
                return;
            }

            var internalNode = nodeMap.get(node);

            if (internalNode === undefined) {
                internalNode = this.createNode(node);
                nodeMap.set(node, internalNode);
            }

            if (nodeSubstituteMap.has(parent)) {
                parent = nodeSubstituteMap.get(parent);
            }

            var internalParentNode = nodeMap.get(parent);

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
        return input.replace('=', '==').replace('/(\r\n|\r|\n)/g','');
    }

    private postprocessOperator(input: string): string {
        return input.replace('==','=');
    }

    private createNode(node: mathjs.MathNode): InternalNode {
        var internalNode = new InternalNode();

        switch (node.type) {
            case "ConstantNode":
                internalNode.name = node.value;
                internalNode.type = Number.isInteger(+node.value)
                    ? InternalNodeType.Integer
                    : InternalNodeType.Decimal;
                internalNode.group = InternalNodeGroup.Number;
                break;
            case "OperatorNode":
                internalNode.name = (node.op = this.postprocessOperator(node.op));
                internalNode.type = this.getOperatorType(node);
                internalNode.group = InternalNodeGroup.Operator;
                break;
            default:
                internalNode.name = "?";
                internalNode.type = undefined;
                internalNode.group = undefined;
                break;
        }

        return internalNode;
    }

    private getOperatorType(node: mathjs.MathNode): InternalNodeType {
        switch (node.op) {
            case "+": return InternalNodeType.Addition;
            case "-": return InternalNodeType.Subtraction;
            case "=": return InternalNodeType.Equality;
        }

        return undefined;
    }
}