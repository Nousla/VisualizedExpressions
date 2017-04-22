import { InternalNode, Type as InternalNodeType, Group as InternalNodeGroup } from './internal-node';
import InternalData from './internal-data';
import { MathOutputService } from "./math-output-service";
import { Injectable } from "@angular/core";

@Injectable()
export class MathTextOutputService implements MathOutputService {
    convert(data: InternalData): Object {
        var mathBuilder: string[] = [];

        this.processNode(data.rootNode, mathBuilder);

        return mathBuilder.join("");
    }

    processNode(node: InternalNode, mathBuilder: string[]) {
        switch (node.group) {
            case InternalNodeGroup.Container:
                this.processContainerGroupNode(node, mathBuilder);
                break;
            case InternalNodeGroup.Number:
                this.processNumberGroupNode(node, mathBuilder);
                break;
            case InternalNodeGroup.Operator:
                this.processOperatorGroupNode(node, mathBuilder);
                break;
            default:
                this.processUnknownGroupNode(node, mathBuilder);
                break;
        }
    }

    processContainerGroupNode(node: InternalNode, mathBuilder: string[]): void {
        if (node.type !== InternalNodeType.Parentheses) {
            return;
        }

        mathBuilder.push("(");

        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                this.processNode(node.children[i], mathBuilder);
            }
        }

        mathBuilder.push(")");
    }

    processNumberGroupNode(node: InternalNode, mathBuilder: string[]): void {
        mathBuilder.push(node.text);
    }

    processOperatorGroupNode(node: InternalNode, mathBuilder: string[]): void {
        if (!node.children || node.children.length !== 2) {
            return;
        }

        this.processNode(node.children[0], mathBuilder);
        mathBuilder.push(node.text);
        this.processNode(node.children[1], mathBuilder);
    }

    processUnknownGroupNode(node: InternalNode, mathBuilder: string[]): void {
        mathBuilder.push(node.text);
    }
}

export default MathTextOutputService;