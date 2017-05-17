export class GuideTree {
    private _rootNode: GuideNode;
    private _paths: GuideNode[];
    private _activePath: number;

    public get rootNode(): GuideNode {
        return this._rootNode;
    }

    public set rootNode(rootNode: GuideNode) {
        this._rootNode = rootNode;
    }

    public get paths(): GuideNode[] {
        return this._paths;
    }

    public set paths(paths: GuideNode[]) {
        this._paths = paths;
    }

    public get activePath(): number {
        return this._activePath;
    }

    public set activePath(activePath: number) {
        this._activePath = activePath;
    }
}

export class GuideNode {
    _expression: string;
    _children: GuideNode[];

    public get expression(): string {
        return this._expression;
    }

    public set expression(expression: string) {
        this._expression = expression;
    }

    public get children(): GuideNode[] {
        return this._children;
    }

    public set children(children: GuideNode[]) {
        this._children = children;
    }
}