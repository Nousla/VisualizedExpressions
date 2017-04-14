import * as math from 'mathjs';
import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from './internal-node';
import InternalData from './internal-data';
import { MathOutputService } from "./math-output-service";
import { Injectable } from "@angular/core";

@Injectable()
export class MathTextOutputService implements MathOutputService {
    convert(data: InternalData): Object {
        var nodeMap = new Map<InternalNode, mathjs.MathNode>();

        data.traverseNodes((node: InternalNode) => { this.traverseNode(node, nodeMap) });

        var rootNode = nodeMap.get(data.rootNode);
        var math = this.postprocess((<Object>rootNode).toString());

        return math;
    }

    traverseNode(node: InternalNode, nodeMap: Map<InternalNode, mathjs.MathNode>) {
        var mathJSNode = this.createMathJSNode(node);

        var parent = nodeMap.get(node.parent);
        if (parent) {
            if (node.parent.group === InternalNodeGroup.Operator) {
                parent["args"].push(mathJSNode);
            }
            else if (node.parent.group === InternalNodeGroup.Container) {
                parent["content"] = mathJSNode;
            }
        }

        nodeMap.set(node, mathJSNode);
    }

    createMathJSNode(node: InternalNode): mathjs.MathNode {
        var mathJSNode: mathjs.MathNode;

        switch (node.type) {
            case InternalNodeType.Addition:
            case InternalNodeType.Subtraction:
                mathJSNode = new math.expression["node"].OperatorNode(node.name, "operator", []);
                break;
            case InternalNodeType.Decimal:
            case InternalNodeType.Integer:
                mathJSNode = new math.expression["node"].ConstantNode(node.name);
                break;
            case InternalNodeType.Equality:
                mathJSNode = new math.expression["node"].OperatorNode("==", "equality", []);
                break;
            case InternalNodeType.Parentheses:
                // Adds dummy object as content until it gets replaced by the child.
                let dummyNode = new math.expression["node"].SymbolNode("dummy");
                mathJSNode = new math.expression["node"].ParenthesisNode(dummyNode);
                break;
            default:
                mathJSNode = new math.expression["node"].SymbolNode("?");
                break;
        }

        return mathJSNode;
    }

    postprocess(math: string): string {
        return math.replace("==", "=");
    }
}

export default MathTextOutputService;