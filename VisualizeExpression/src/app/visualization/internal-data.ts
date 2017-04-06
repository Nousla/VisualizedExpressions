import { InternalNode } from "./internal-node";

export class InternalData {
    private _rootNode: InternalNode;

    constructor(rootNode: InternalNode) {
        this._rootNode = rootNode;
    }

    get data (): InternalNode {
        return this._rootNode;
    }
}

export default InternalData;