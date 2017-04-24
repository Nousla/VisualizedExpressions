import { Injectable, Inject } from "@angular/core";
import MATH_OUTPUT_SERVICE from "../visualization/math-output-service-token";
import MathOutputService from "../visualization/math-output-service";
import InternalData from "../visualization/internal-data";
import { InternalNode, Group as InternalNodeGroup } from "../visualization/internal-node";
import UndefinedArgumentException from "../exceptions/undefined-argument-exception";

Injectable()
export class ExpressionService {
    constructor( @Inject(MATH_OUTPUT_SERVICE) private mus: MathOutputService) {
    }

    applyChange(data: InternalData, selectedNode: InternalNode, newNode: InternalNode): Object {
        if (!data) {
            throw new UndefinedArgumentException("data is undefined!");
        }

        if (!selectedNode) {
            throw new UndefinedArgumentException("selectedNode is undefined!");
        }

        if (!newNode) {
            throw new UndefinedArgumentException("newNode is undefined!");
        }

        var expression: Object;
        var targetNode = this.optimizeTargetNode(selectedNode, newNode);

        if (!targetNode) {
            expression = this.mus.convert(new InternalData(newNode));
        }
        else {
            let children = targetNode.parent.children;
            let targetNodeIndex = children.indexOf(targetNode);
            let splicedNode = children.splice(targetNodeIndex, 1);
            children.splice(targetNodeIndex, 0, newNode);
            newNode.parent = targetNode.parent;

            expression = this.mus.convert(data);

            // Reverse changes in the data
            children.splice(targetNodeIndex, 1);
            children.splice(targetNodeIndex, 0, selectedNode);
        }

        return expression;
    }

    // Optimize away containers
    private optimizeTargetNode(targetNode: InternalNode, newNode: InternalNode): InternalNode {
        if(!targetNode || !targetNode.parent) {
            return null;
        }

        var optimizedTargetNode = targetNode;
        if (newNode.group === InternalNodeGroup.Number
            && optimizedTargetNode.parent.group === InternalNodeGroup.Container) {
            while (optimizedTargetNode.parent && optimizedTargetNode.parent.group === InternalNodeGroup.Container) {
                optimizedTargetNode = optimizedTargetNode.parent;

                if (!optimizedTargetNode.parent) {
                    return null;
                }
            }
        }

        return optimizedTargetNode;
    }
}

export default ExpressionService;
