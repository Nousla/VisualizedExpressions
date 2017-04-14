import { Injectable, Inject } from "@angular/core";
import MATH_OUTPUT_SERVICE from "../visualization/math-output-service-token";
import MathOutputService from "../visualization/math-output-service";
import InternalData from "../visualization/internal-data";
import { InternalNode } from "../visualization/internal-node";

Injectable()
export class ExpressionService {
    constructor( @Inject(MATH_OUTPUT_SERVICE) private mus: MathOutputService) {
    }

    applyChange(data: InternalData, selectedNode: InternalNode, newNode: InternalNode): Object {
        var math: Object;

        if (!selectedNode.parent) {
            let newData = new InternalData(newNode);
            math = this.mus.convert(newData);
        }
        else {
            var children = selectedNode.parent.children;
            var selectedNodeIndex = children.indexOf(selectedNode);
            var splicedNode = children.splice(selectedNodeIndex, 1);
            var newNodeIndex = children.push(newNode) - 1;
            newNode.parent = selectedNode.parent;

            math = this.mus.convert(data);

            // Reverse changes in the data
            children.splice(newNodeIndex, 1);
            children.splice(selectedNodeIndex, 0, selectedNode);
        }

        return math;
    }
}

export default ExpressionService;