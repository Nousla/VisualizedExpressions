import { Injectable, Inject } from "@angular/core";
import InternalData from "../visualization/internal-data";
import { InternalNode, Group as InternalNodeGroup } from "../visualization/internal-node";
import UndefinedArgumentException from "../exceptions/undefined-argument-exception";

Injectable()
export class ExpressionOperationService {

    applyReplacement(data: InternalData, selectedNode: InternalNode, newNode: InternalNode): InternalData {
        if (!data) {
            throw new UndefinedArgumentException("data");
        }

        if (!selectedNode) {
            throw new UndefinedArgumentException("selectedNode");
        }

        if (!newNode) {
            throw new UndefinedArgumentException("newNode");
        }

        var newData: InternalData;
        var targetNode = this.optimizeTargetNode(selectedNode, newNode);

        if (!targetNode) {
            newData = new InternalData(newNode)
        }
        else {
            let children = targetNode.parent.children;
            let targetNodeIndex = children.indexOf(targetNode);
            let splicedNode = children.splice(targetNodeIndex, 1);
            children.splice(targetNodeIndex, 0, newNode);

            let oldParent = newNode.parent;
            newNode.parent = targetNode.parent;

            newData = data.clone();

            // Reverse changes in the data
            children.splice(targetNodeIndex, 1);
            children.splice(targetNodeIndex, 0, selectedNode);
            newNode.parent = oldParent;
        }

        return newData;
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

export default ExpressionOperationService;
