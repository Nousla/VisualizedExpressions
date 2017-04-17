import { Injectable, Inject } from "@angular/core";
import MATH_OUTPUT_SERVICE from "../visualization/math-output-service-token";
import MathOutputService from "../visualization/math-output-service";
import InternalData from "../visualization/internal-data";
import { InternalNode } from "../visualization/internal-node";
import UndefinedArgumentException from "../exceptions/undefined-argument-exception";

Injectable()
export class ExpressionService {
    constructor( @Inject(MATH_OUTPUT_SERVICE) private mus: MathOutputService) {
    }

    applyChange(data: InternalData, selectedNode: InternalNode, newNode: InternalNode): Object {
        if(!data) {
            throw new UndefinedArgumentException("data is undefined!");
        }

        if(!selectedNode) {
            throw new UndefinedArgumentException("selectedNode is undefined!");
        }

        if(!newNode) {
            throw new UndefinedArgumentException("newNode is undefined!");
        }

        var expression: Object;

        if (!selectedNode.parent) {
            let newData = new InternalData(newNode);
            expression = this.mus.convert(newData);
        }
        else {
            var children = selectedNode.parent.children;
            var selectedNodeIndex = children.indexOf(selectedNode);
            var splicedNode = children.splice(selectedNodeIndex, 1);
            var newNodeIndex = children.push(newNode) - 1;
            newNode.parent = selectedNode.parent;

            expression = this.mus.convert(data);

            // Reverse changes in the data
            children.splice(newNodeIndex, 1);
            children.splice(selectedNodeIndex, 0, selectedNode);
        }

        return expression;
    }
}

export default ExpressionService;