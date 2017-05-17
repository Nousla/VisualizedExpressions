export class InternalNode {
    private _text: string;
    private _type: Type;
    private _group: Group;
    private _parent: InternalNode;
    private _children: InternalNode[];

    public get text(): string {
        return this._text;
    }

    public set text(text: string) {
        this._text = text;
    }

    public get type(): Type {
        return this._type;
    }

    public set type(type: Type) {
        this._type = type;;
    }

    public get group(): Group {
        return this._group;
    }

    public set group(group: Group) {
        this._group = group;
    }

    public get parent(): InternalNode {
        return this._parent;
    }

    public set parent(parent: InternalNode) {
        this._parent = parent;
    }

    public get children(): InternalNode[] {
        return this._children;
    }

    public set children(children: InternalNode[]) {
        this._children = children;
    }
}

export const enum Type {
    Addition,
    Decimal,
    Division,
    Equality,
    Integer,
    Multiplication,
    Parentheses,
    Subtraction,
    Variable,
    Unknown
}

export const enum Group {
    Number,
    Operator,
    Container,
    Symbol,
    Unknown
}