export class InternalNode {
    private _text: string;
    private _type: Type;
    private _group: Group;
    private _parent: InternalNode;
    private _children: InternalNode[];

    get text(): string {
        return this._text;
    }

    set text(text: string) {
        this._text = text;
    }

    get type(): Type {
        return this._type;
    }

    set type(type: Type) {
        this._type = type;
    }

    get group(): Group {
        return this._group;
    }

    set group(group: Group) {
        this._group = group;
    }

    get parent(): InternalNode {
        return this._parent;
    }

    set parent(parent: InternalNode) {
        this._parent = parent;
    }

    get children(): InternalNode[] {
        return this._children;
    }

    set children(children: InternalNode[]) {
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