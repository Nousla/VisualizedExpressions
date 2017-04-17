import { InternalNode } from "./internal-node";
import UndefinedArgumentException from "../exceptions/undefined-argument-exception";

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
            throw new UndefinedArgumentException("callback not defined");
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

    clone(): InternalData {
        return new InternalData(this.cloneNode(this.rootNode));
    }

    private cloneNode(node: InternalNode): InternalNode {
        var clonedNode = new InternalNode();
        clonedNode.name = node.name;
        clonedNode.type = node.type;
        clonedNode.group = node.group;
        clonedNode.parent = undefined;

        if (!node.children) {
            return clonedNode;
        }

        var children = [];
        for (let i = 0; i < node.children.length; i++) {
            let child = this.cloneNode(node.children[i]);
            child.parent = clonedNode;
            children.push(child);
        }

        clonedNode.children = children;

        return clonedNode;
    }
}

export default InternalData;