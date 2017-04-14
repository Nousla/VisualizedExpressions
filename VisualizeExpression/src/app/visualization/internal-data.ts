import { InternalNode } from "./internal-node";
import UndefinedParameterException from "../exceptions/undefined-parameter-exception";

export class InternalData {
    private _rootNode: InternalNode;

    constructor(rootNode: InternalNode) {
        this._rootNode = rootNode;
    }

    get rootNode(): InternalNode {
        return this._rootNode;
    }

    // Pre-order traversal
    traverseNodes(callback: (node: InternalNode) => void): void {
        if (!callback) {
            throw new UndefinedParameterException("callback not defined");
        }

        this.traverseNodesInternal(callback, this.rootNode);
    }

    private traverseNodesInternal(callback: (node: InternalNode) => void, node: InternalNode) {
        callback(node);

        if (!node.children) {
            return;
        }

        for (var i = 0; i < node.children.length; i++) {
            this.traverseNodesInternal(callback, node.children[i]);
        }
    }
}

export default InternalData;